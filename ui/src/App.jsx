import { useEffect } from "react";
import { useState } from "react";
import Lodash from "lodash";
import "./App.css";
import Code from "./code";
import Templates from "./template";
import Route from "./Components/Route";
import Types from "./Components/Types";
import AddFolder from "./Components/AddFolder";
import { compileTemplate } from "./func";
import Changes from "./Components/Changes";

function App() {
	const [structure, setStructure] = useState(Code);
	const [path, setPath] = useState([]);
	const [newFoderPath, setNewFoderPath] = useState("");
	const [params, setParams] = useState({});

	useEffect(() => {
		window.addEventListener("message", (event) => {
			const message = event.data;
			switch (message.command) {
				case "structure":
					setStructure(message.data);
					break;
				case "test":
					console.log(message);
					break;
				default:
					break;
			}
		});
		if (window.vscode) {
			window.vscode.postMessage({ command: "updateStructure" });
		}
	}, []);

	const addPath = (folderName) => {
		let newPath = `${newFoderPath}/${folderName}`;
		let index = path.indexOf(newPath);
		if (index !== -1) {
			return;
		}
		let newPathArray = newPath.replace(`${structure.rootPath}/`, "").split("/");
		let newStructure = {};
		for (let i = newPathArray.length - 1; i >= 0; i--) {
			let folder = {};
			folder[newPathArray[i]] = {
				path: `${structure.rootPath}/${newPathArray.slice(0, i + 1).join("/")}`,
				name: newPathArray[i],
				folders: newStructure,
			};
			newStructure = folder;
		}
		setStructure((prev) => {
			return Lodash.merge(prev, { folders: newStructure });
		});

		const compiled = compileTemplate(
			Templates,
			params.currentType,
			params.vars,
			params.subTemplates,
			params.currTemplates,
			folderName,
			newFoderPath + "/" + folderName
		);
		setPath((prev) => [...prev, ...compiled]);
	};

	const removePath = (delPath) => {
		console.log(delPath);
		setPath((prev) => {
			return prev.filter((path) => path.path !== delPath);
		});
	};

	const saveFolder = (folderName) => {
		if (folderName === "") {
			setNewFoderPath("");
			return;
		}
		addPath(folderName);
		setNewFoderPath("");
	};

	const save = () => {
		if (window.vscode) {
			window.vscode.postMessage({ command: "addPath", data: path });
		}
		setPath([]);
	};

	return (
		<div className="App">
			<div>
				<div className="floating">
					<Types templates={Templates} params={setParams} />
					{newFoderPath !== "" && (
						<AddFolder saveFolder={saveFolder} parentPath={newFoderPath} />
					)}
				</div>

				<Route addFolder={setNewFoderPath} folders={structure.folders} />
			</div>
			<Changes changes={path} removePath={removePath} save={save} />
		</div>
	);
}

export default App;
