import { useEffect } from "react";
import { useState } from "react";
import "./App.css";
import Code from "./code";
import Route from "./Route";

function App() {
	const [structure, setStructure] = useState(Code);
	const [path, setPath] = useState([]);
	useEffect(() => {
		window.addEventListener("message", (event) => {
			const message = event.data;

			if (message.command === "refactor") {
				console.log(message);
			} else if (message.command === "structure") {
				setStructure(message.data);
			}
		});
	}, []);

	const addPath = (newPath) => {
		setPath([...path, newPath]);
	};

	const save = () => {
		setPath([]);
		// window.parent.postMessage({ command: "addPath" }, "*");
	};

	return (
		<div>
			<Route addPath={addPath} folders={structure.folders} />
			<button onClick={save}>Save</button>
		</div>
	);
}

export default App;
