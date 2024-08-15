import { useEffect } from "react";
import { useState } from "react";
import Lodash from "lodash";
import "./App.css";
import Code from "./code";
import Templates from "./template";
import Route from "./Components/Route";
import Types from "./Components/Types";
import AddFolder from "./Components/AddFolder";

function App() {
	const [structure, setStructure] = useState(Code);
	const [path, setPath] = useState([]);
	const [type, setType] = useState(Object.keys(Templates)[0]);
	const [newFoderPath, setNewFoderPath] = useState("");

	useEffect(() => {
		window.addEventListener("message", (event) => {
			const message = event.data;
			switch (message.command) {
				case "structure":
					setStructure(message.data);
					break;
				// case "types":
				// 	setTypes(message.data);
				// 	break;
				default:
					break;
			}
		});
	}, []);

	const addPath = (newPath) => {
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
		setPath([...path, newPath]);
	};
	const addFolder = (newPath) => {
		setNewFoderPath(newPath);
	};
	const saveFolder = (folderName) => {
		if (folderName === "") {
			setNewFoderPath("");
			return;
		}
		addPath(`${newFoderPath}/${folderName}`);
		setNewFoderPath("");
	};

	const save = () => {
		// window.parent.postMessage({ command: "addPath" }, "*");
		setPath([]);
	};

	return (
		<div className="App">
			<div className="floating">
				<Types setType={setType} templates={Templates} currentType={type} />
				{newFoderPath !== "" && (
					<AddFolder saveFolder={saveFolder} parentPath={newFoderPath} />
				)}
			</div>

			<Route addFolder={addFolder} folders={structure.folders} />
			<button className="MainButton" onClick={save}>
				Save
			</button>
		</div>
	);
}

export default App;
