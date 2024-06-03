const vscode = acquireVsCodeApi();
let structure = [];
function FormSubmit(e) {
	const structure = document.getElementById("structure").value;
	vscode.postMessage({
		command: "alert",
		text: "🐛  on line " + structure,
	});
}
