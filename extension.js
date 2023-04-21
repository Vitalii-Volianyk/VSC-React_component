const vscode = require("vscode");
const fs = require("fs");
/**
 * @param {vscode.ExtensionContext} context
 */
let current_path = "";

function activate(context) {
	let component = vscode.commands.registerCommand(
		"react-component-structure.createEmotionComponent",
		function (url) {
			vscode.workspace.fs.stat(url).then(({type}) => {
				if (type == 2) {
					current_path = url;
					vscode.window
						.showInputBox({placeHolder: "Component name"})
						.then(val => {
							if (val !== undefined) {
								createComponentEmotion(val);
							}
						});
				} else if (type == 1) {
					let path = vscode.Uri.parse(url).toString().split("/");
					current_path = path.slice(0, -1).join("/");
					vscode.window
						.showInputBox({placeHolder: "Component name"})
						.then(val => {
							if (val !== undefined) {
								createComponentEmotion(val);
							}
						});
				}
			});
		}
	);
	context.subscriptions.push(component);
	let disposable = vscode.commands.registerCommand(
		"react-component-structure.createComponent",
		function (url) {
			vscode.workspace.fs.stat(url).then(({type}) => {
				if (type == 2) {
					current_path = url;
					vscode.window
						.showInputBox({placeHolder: "Component name"})
						.then(val => {
							if (val !== undefined) {
								createComponentModule(val);
							}
						});
				} else if (type == 1) {
					let path = vscode.Uri.parse(url).toString().split("/");
					current_path = path.slice(0, -1).join("/");
					vscode.window
						.showInputBox({placeHolder: "Component name"})
						.then(val => {
							if (val !== undefined) {
								createComponentModule(val);
							}
						});
				}
			});
		}
	);
	context.subscriptions.push(disposable);
	// let refactor = vscode.commands.registerCommand(
	// 	"react-component-structure.refactor",
	// 	function (url) {
	// 		vscode.workspace.fs.stat(url).then(({ type }) => {
	// 			if (type == 1) {
	// 				const path = url.fsPath;
	// 				const ext = path.slice(-3);
	// 				if (ext == "jsx" || ext == ".js") {
	// 					fs.readFile(path, function (err, data) {
	// 						if (err) {
	// 							console.log(err);
	// 							return;
	// 						}
	// 						let text = data.toString();
	// 						while (
	// 							text.search(
	// 								/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim
	// 							) > -1
	// 						) {
	// 							text = text.replace(
	// 								/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim,
	// 								"const $1 =($2)=> {$3}"
	// 							);
	// 						}
	// 						let props = [];
	// 						text = text.replace(
	// 							/\s*this\.props\.(\w*)\(?.*\)?/gim,
	// 							(p0, p1) => {
	// 								props.push(p1);
	// 								return p0;
	// 							}
	// 						);
	// 						const pp =
	// 							props.length > 0 ? `{${props.join(", ")}}` : "";
	// 						text = text.replace(
	// 							/class\s*(.*)\s*extends.*{([\s\S]*)}/gim,
	// 							`const $1 =(${pp})=> {$2}`
	// 						);
	// 						text = text.replace(/this\.props\./gim, "");
	// 						let states = {};
	// 						text = text.replace(
	// 							/\s*state\s*=\s*{((\s*.*,\s*)+\s*)}/gim,
	// 							(match, p1) => {
	// 								p1 = p1.split(",");
	// 								p1 = p1.map(el => {
	// 									if (el.trim()) {
	// 										return el.split(":");
	// 									}
	// 									return ["", ""];
	// 								});
	// 								p1 = p1.map(el => {
	// 									let name = el[0].trim();
	// 									const func =
	// 										name.charAt(0).toUpperCase() +
	// 										name.slice(1);
	// 									if (name) {
	// 										states[name] = "set" + func;
	// 										return `\nconst [${name}, set${func}] = useState(${el[1].trim()})`;
	// 									}
	// 									return "";
	// 								});
	// 								if (p1[p1.length - 1] == "") {
	// 									p1.pop();
	// 								}
	// 								return p1.join("; ");
	// 							}
	// 						);
	// 						text = text.replace(
	// 							/this\.setState\({(.*)}\)/gim,
	// 							(match, p1) => {
	// 								p1 = p1.split(",");
	// 								p1 = p1.map(el => el.split(":"));
	// 								p1 = p1.map(el => {
	// 									let name = el[0].trim();
	// 									if (states[name]) {
	// 										return `${
	// 											states[name]
	// 										}(${el[1].trim()})`;
	// 									}
	// 								});
	// 								return p1.join(";\n");
	// 							}
	// 						);

	// 						text = text.replace(/this\./gim, "");
	// 						fs.writeFile(path, text, function (err) {
	// 							if (err) {
	// 								return console.error(err);
	// 							}
	// 							console.log("Data written successfully!");
	// 						});
	// 					});
	// 				}
	// 			}
	// 		});
	// 	}
	// );
	// context.subscriptions.push(refactor);
}

function createComponentEmotion(name) {
	const param = name.split(".");
	name = param[0];
	const StyledName =
		param[1].charAt(0).toUpperCase() + param[1].slice(1) + "Styled";
	console.log(StyledName);
	const path = current_path + "/" + name;
	vscode.workspace.fs.createDirectory(vscode.Uri.parse(path));

	const writeData = Buffer.from(
		`import { ${StyledName} } from './${name}.styled';

export const ${name} = () => {
  return <${StyledName}></${StyledName}>;
};`,
		"utf8"
	);
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/" + name + ".jsx"),
		writeData
	);

	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/" + name + ".styled.js"),
		Buffer.from(
			`import styled from '@emotion/styled';

export const ${StyledName} = styled.${param[1]}\`\`;`,
			"utf8"
		)
	);
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/index.jsx"),
		Buffer.from(`export * from "./${name}";`, "utf8")
	);
}

function createComponentModule(name) {
	const param = name.split(".");
	let config = "";
	let writeStr = "";
	name = param[0];
	if (param.length > 1) {
		config = param[1];
	}
	const styles = vscode.workspace
		.getConfiguration()
		.get("react_component.styles");
	const path = current_path + "/" + name;
	vscode.workspace.fs.createDirectory(vscode.Uri.parse(path));
	if (config === "c") {
		writeStr = getClassMarkup(name, styles);
	} else if (config === "e") {
		writeStr = getFuncMarkup(name, "without");
	} else {
		writeStr = getFuncMarkup(name, styles);
	}
	const writeData = Buffer.from(writeStr, "utf8");
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(
			path +
				"/" +
				name +
				"." +
				vscode.workspace
					.getConfiguration()
					.get("react_component.extension")
		),
		writeData
	);
	if (styles === "module") {
		vscode.workspace.fs.writeFile(
			vscode.Uri.parse(path + "/" + name + ".module.css"),
			Buffer.from("", "utf8")
		);
	}
	if (
		vscode.workspace.getConfiguration().get("react_component.reimport") &&
		config !== "e"
	) {
		vscode.workspace.fs.writeFile(
			vscode.Uri.parse(
				path +
					"/index." +
					vscode.workspace
						.getConfiguration()
						.get("react_component.extension")
			),
			Buffer.from(`export { default } from './${name}';`, "utf8")
		);
	}
}
function deactivate() {}

function getClassMarkup(name, styles) {
	if (styles === "module") {
		return `import { Component } from 'react';\nimport css from './${name}.module.css'\nclass ${name} extends Component {\n\trender() {\n\t\treturn <div>${name}</div>;\n\t}\n}\nexport default ${name};`;
	} else if (styles === "emotion") {
		return `import { Component } from 'react';\nimport styled from '@emotion/styled';\n\nconst Container = styled.div\`\`;\n\nclass ${name} extends Component {\n\trender() {\n\t\treturn <Container>${name}</Container>;\n\t}\n}\nexport default ${name};`;
	} else {
		return `import { Component } from 'react';\nclass ${name} extends Component {\n\trender() {\n\t\treturn <div>${name}</div>;\n\t}\n}\nexport default ${name};`;
	}
}

function getFuncMarkup(name, styles) {
	if (styles === "module") {
		return `import css from './${name}.module.css'\nconst ${name} = () => {\n\treturn <div>${name}</div>;\n}\nexport default ${name};`;
	} else if (styles === "emotion") {
		return `import styled from '@emotion/styled';\n\nconst Container = styled.div\`\`;\n\nconst ${name} = () => {\n\treturn <Container>${name}</Container>;\n}\nexport default ${name};`;
	} else {
		return `const ${name} = () => {\nreturn <div>${name}</div>;\n}\nexport default ${name};`;
	}
}

module.exports = {
	activate,
	deactivate,
};
