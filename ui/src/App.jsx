import { useEffect } from "react";
import { useState } from "react";
import Lodash from "lodash";
import "./App.css";
import Route from "./Components/Route";
import Types from "./Components/Types";
import AddFolder from "./Components/AddFolder";
import { compileTemplate } from "./func";
import Changes from "./Components/Changes";

function App() {
	const [structure, setStructure] = useState({});
	const [templates, setTemplates] = useState({});
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
				case "template":
					setTemplates(message.data);

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
			templates,
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

	let temp = Object.keys(templates).length;
	let temp2 =
		structure.folders !== undefined && Object.keys(structure.folders).length;
	return (
		<div className="App">
			<div>
				<div className="floating">
					{temp < 1 ? (
						<div>Templates not loaded</div>
					) : (
						<Types templates={templates} params={setParams} />
					)}

					{newFoderPath !== "" && (
						<AddFolder saveFolder={saveFolder} parentPath={newFoderPath} />
					)}
				</div>
				<span className="rootPath">
					{structure.rootPath && structure.rootPath.split("/").pop()}
					<button
						className="addFolderButton"
						onClick={() => setNewFoderPath(structure.rootPath)}
					>
						+
					</button>
				</span>
				{temp2 > 0 && (
					<Route
						addFolder={temp > 0 ? setNewFoderPath : null}
						folders={structure.folders}
					/>
				)}
			</div>
			<Changes changes={path} removePath={removePath} save={save} />
		</div>
	);
}

export default App;
