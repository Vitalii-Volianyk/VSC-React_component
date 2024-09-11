const { read } = require("fs");
const vscode = require("vscode");

function getComponentTemplate() {
	return {
		"ReactJS(jsx)": {
			"$Main_tag[input]": "div",
			"$ext[list]": {
				js: {
					val: "js",
				},
				jsx: {
					val: "jsx",
				},
				tsx: {
					val: "tsx",
				},
			},
			"#Styles[list]": {
				module: {
					val: 'import styles from "./{{{ComponentName}}}.module.css";',
					content: 'import "./{{{ComponentName}}}.module.css";',
					file: "{{{ComponentName}}}.module.css",
				},
				css: {
					val: "import './{{{ComponentName}}}.css';",
					content: "import './{{{ComponentName}}}.css';",
					file: "{{{ComponentName}}}.css",
				},
				scss: {
					val: `import './{{{ComponentName}}}.scss';`,
					content: `import "./{{{ComponentName}}}.scss";`,
					file: "{{{ComponentName}}}.scss",
				},
				none: {
					val: "",
					content: "",
					file: "",
				},
			},

			"Component_type[radio]": {
				function: [
					{
						content: `{{{Styles}}}
				function {{{ComponentName}}}() {
					return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
				}
					export default {{{ComponentName}}};`,
						file: "{{{ComponentName}}}.{{{ext}}}",
					},
					{
						content: "export default {{{ComponentName}}};",
						file: "index.{{{ext}}}",
					},
					{
						folder: "gfdgfgffdgdf/{{{ComponentName}}}",
					},
				],

				class: [
					{
						content: `{{{Styles}}}
				class {{{ComponentName}}} extends React.Component {
					render() {
						return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
					}
				}
				export default {{{ComponentName}}};`,
						file: "{{{ComponentName}}}.{{{ext}}}",
					},
					{
						content: "export default {{{ComponentName}}};",
						file: "index.{{{ext}}}",
					},
				],
			},
		},
		"NextJS(jsx)": {
			"$Main_tag[input]": "div2",

			"#Styles[list]": {
				module: {
					val: "import styles from './{{{ComponentName}}}.module.css';",
					content: "",
					file: "{{{ComponentName}}}.module.css",
				},
				css: {
					val: "import './{{{ComponentName}}}.css';",
					content: "",
					file: "{{{ComponentName}}}.css",
				},
				scss2: {
					val: "import './{{{ComponentName}}}.scss';",

					file: "{{{ComponentName}}}.scss",
				},
				none: {
					let: "",
					content: "",
					file: "",
				},
			},

			"Component_type[radio]": {
				server: {
					content: `{{{Styles}}}
				export default function {{{ComponentName}}}() {
					return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
				}`,
					file: "{{{ComponentName}}}.jsx",
				},

				client: {
					content: `{{{Styles}}}
				export default function {{{ComponentName}}}() {
					return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
				}`,
					file: "{{{ComponentName}}}.jsx",
				},

				group: {
					content: `{{{Styles}}}
				export default function {{{ComponentName}}}() {
					return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
				}`,
					file: "{{{ComponentName}}}.jsx",
				},
			},
		},
	};
}

async function getSubFolders(path, file) {
	let folder = {};
	if (file[1] === 2) {
		const res = await readFolders(path + "/" + file[0]);
		folder = {
			path: path + "/" + file[0],
			name: file[0],
			folders: res,
		};
	}
	return folder;
}

async function readFolders(path) {
	let folders = {};

	const files = await vscode.workspace.fs.readDirectory(vscode.Uri.parse(path));

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (file[1] === 2) {
			folders[file[0]] = await getSubFolders(path, file);
		}
	}

	return folders;
}

function writeFile(path, writeStr) {
	const writeData = Buffer.from(writeStr, "utf8");
	vscode.workspace.fs.writeFile(vscode.Uri.parse(path), writeData);
}

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"react-component-structure.editStructure",
		async function (url) {
			const panel = vscode.window.createWebviewPanel(
				"editStructure",
				"Edit Structure",
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					localResourceRoots: [
						vscode.Uri.joinPath(context.extensionUri, "media"),
					],
				}
			);
			const webview = panel.webview;

			const cssPath = await vscode.workspace.fs.readDirectory(
				vscode.Uri.joinPath(context.extensionUri, "media/static/css")
			);
			const cssStyle = webview.asWebviewUri(
				vscode.Uri.joinPath(
					context.extensionUri,
					`media/static/css/${
						cssPath.filter((item) => item[0].match(/.*\.css$/))[0][0]
					}`
				)
			);
			const jsPath = await vscode.workspace.fs.readDirectory(
				vscode.Uri.joinPath(context.extensionUri, "media/static/js")
			);

			const scriptPath = webview.asWebviewUri(
				vscode.Uri.joinPath(
					context.extensionUri,
					`media/static/js/${
						jsPath.filter((item) => item[0].match(/.*\.js$/))[0][0]
					}`
				)
			);

			const html = `
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="utf-8" />
						<link rel="icon" href="/favicon.ico" />
						<meta name="viewport" content="width=device-width,initial-scale=1" />
						<meta name="theme-color" content="#000000" />
									 
						<meta
							name="description"
							content="Web site created using create-react-app"
						/>
						<link rel="apple-touch-icon" href="/logo192.png" />
						<link rel="manifest" href="/manifest.json" />
						<title>React App</title>
						<link rel="stylesheet" type="text/css" href="${cssStyle}" />
						</head>
						<body>
						<noscript>You need to enable JavaScript to run this app.</noscript>
						<div id="root"></div>
						<script>
        (function() {
            window.vscode = acquireVsCodeApi();
            
        }())
    </script>
						<script src="${scriptPath}"></script>
					</body>
				</html>`;
			webview.html = html;

			// Handle messages from the webview
			webview.onDidReceiveMessage(
				(message) => {
					switch (message.command) {
						case "alert":
							vscode.window.showErrorMessage(message.text);
							return;
						case "updateStructure":
							readFolders(url.path)
								.then((res) => {
									let project = {
										rootPath: url.path,
										folders: {},
									};
									project.folders = res;
									webview.postMessage({
										command: "structure",
										data: project,
									});
								})
								.catch((error) => {
									console.log(error);
								});
							webview.postMessage({
								command: "template",
								data: getComponentTemplate(),
							});

							break;
						case "addPath":
							console.log(message.data);
							message.data.map((item) => {
								if (item.content !== undefined) {
									writeFile(item.path, item.content);
								}
							});
							break;
					}
				},
				undefined,
				context.subscriptions
			);
		}
	);
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
