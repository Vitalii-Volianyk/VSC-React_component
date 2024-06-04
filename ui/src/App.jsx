import { useEffect } from "react";
import "./App.css";

function App() {
	useEffect(() => {
		window.addEventListener("message", (event) => {
			const message = event.data;

			if (message.command === "refactor") {
				console.log(message);
			}
		});
	}, []);

	return (
		<div className="bg-gradient-to-r from-blue-600 to-purple-500 p-10">
			<p className="text-white/80 text-xl font-semibold">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, explicabo
				doloremque deserunt, voluptates, fugiat dolorem consectetur odio autem
				quas ipsa veniam ducimus necessitatibus exercitationem numquam assumenda
				natus beatae sed velit!
			</p>
		</div>
	);
}

export default App;
