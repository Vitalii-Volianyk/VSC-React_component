const vscode = require("vscode");
const fs = require("fs");
/**
 * @param {vscode.ExtensionContext} context
 */
let current_path = "";

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"react-component-structure.createComponent",
		function (url) {
			vscode.workspace.fs.stat(url).then(({ type }) => {
				if (type == 2) {
					current_path = url;
					vscode.window
						.showInputBox({ placeHolder: "Component name" })
						.then(val => {
							if (val !== undefined) {
								createComponent(val);
							}
						});
				} else if (type == 1) {
					let path = vscode.Uri.parse(url).toString().split("/");
					current_path = path.slice(0, -1).join("/");
					vscode.window
						.showInputBox({ placeHolder: "Component name" })
						.then(val => {
							if (val !== undefined) {
								createComponent(val);
							}
						});
				}
			});
		}
	);
	context.subscriptions.push(disposable);
	let refactor = vscode.commands.registerCommand(
		"react-component-structure.refactor",
		function (url) {
			vscode.workspace.fs.stat(url).then(({ type }) => {
				if (type == 1) {
					const path = url.fsPath;
					const ext = path.slice(-3);
					if (ext == "jsx" || ext == ".js") {
						fs.readFile(path, function (err, data) {
							if (err) {
								console.log(err);
								return;
							}
							let text = data.toString();
							while (
								text.search(
									/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim
								) > -1
							) {
								text = text.replace(
									/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim,
									"const $1 =($2)=> {$3}"
								);
							}
							let props = [];
							text = text.replace(
								/\s*this\.props\.(\w*)\(?.*\)?/gim,
								(p0, p1) => {
									props.push(p1);
									return p0;
								}
							);
							const pp =
								props.length > 0 ? `{${props.join(", ")}}` : "";
							text = text.replace(
								/class\s*(.*)\s*extends.*{([\s\S]*)}/gim,
								`const $1 =(${pp})=> {$2}`
							);
							text = text.replace(/this\.props\./gim, "");
							let states = {};
							text = text.replace(
								/\s*state\s*=\s*{((\s*.*,\s*)+\s*)}/gim,
								(match, p1) => {
									p1 = p1.split(",");
									p1 = p1.map(el => {
										if (el.trim()) {
											return el.split(":");
										}
										return ["", ""];
									});
									p1 = p1.map(el => {
										let name = el[0].trim();
										const func =
											name.charAt(0).toUpperCase() +
											name.slice(1);
										if (name) {
											states[name] = "set" + func;
											return `\nconst [${name}, set${func}] = useState(${el[1].trim()})`;
										}
										return "";
									});
									if (p1[p1.length - 1] == "") {
										p1.pop();
									}
									return p1.join("; ");
								}
							);
							text = text.replace(
								/this\.setState\({(.*)}\)/gim,
								(match, p1) => {
									p1 = p1.split(",");
									p1 = p1.map(el => el.split(":"));
									p1 = p1.map(el => {
										let name = el[0].trim();
										if (states[name]) {
											return `${
												states[name]
											}(${el[1].trim()})`;
										}
									});
									return p1.join(";\n");
								}
							);

							text = text.replace(/this\./gim, "");
							fs.writeFile(path, text, function (err) {
								if (err) {
									return console.error(err);
								}
								console.log("Data written successfully!");
							});
						});
					}
				}
			});
		}
	);
	context.subscriptions.push(refactor);
}
function createComponent(name) {
	const param = name.split(".");
	let config = "";
	let writeStr = "";
	name = param[0];
	if (param.length > 1) {
		config = param[1];
	}
	const path = current_path + "/" + name;
	vscode.workspace.fs.createDirectory(vscode.Uri.parse(path));
	if (config == "c") {
		writeStr = `import { Component } from 'react';
import css from './${name}.module.css'

class ${name} extends Component {
  render() {
    return <div></div>;
  }
}

export default ${name};`;
	} else {
		writeStr = `import css from './${name}.module.css'

const ${name} = () => {
	return <div></div>;	
}

export default ${name};`;
	}
	const writeData = Buffer.from(writeStr, "utf8");
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/" + name + ".jsx"),
		writeData
	);
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/" + name + ".module.css"),
		Buffer.from("", "utf8")
	);
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/index.jsx"),
		Buffer.from(`export { default } from './${name}';`, "utf8")
	);
}
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
