import { useEffect } from "react";
import { useState } from "react";
import "./App.css";
import Code from "./code";
import Route from "./Route";

function App() {
	const [structure, setStructure] = useState(Code);
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

	return (
		<div>
			<Route folders={structure.folders} />
		</div>
	);
}

export default App;
