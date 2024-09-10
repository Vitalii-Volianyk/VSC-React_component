const { read } = require("fs");
const vscode = require("vscode");

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
		function (url) {
			let project = {
				rootPath: url.path,
				folders: {},
			};

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
			const cssStyle = webview.asWebviewUri(
				vscode.Uri.joinPath(
					context.extensionUri,
					"media/static/css/main.6185841d.css"
				)
			);

			const scriptPath = webview.asWebviewUri(
				vscode.Uri.joinPath(
					context.extensionUri,
					"media/static/js/main.e4ec4cd5.js"
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
									project.folders = res;
									webview.postMessage({
										command: "structure",
										data: project,
									});
								})
								.catch((error) => {
									console.log(error);
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
