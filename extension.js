const vscode = require("vscode");
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"react-component-structure.editStructure",
		function (url) {
			let project = {
				rootPath: url.path,
				folders: [],
			};

			const path = url.path;
			console.log(path);

			vscode.workspace.fs
				.readDirectory(vscode.Uri.parse(project.rootPath + "/API/3cltr"))
				.then((files) => {
					files.forEach((file) => {
						console.log(file);
					});
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					console.log("finally");
				});

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

			panel.webview.onDidReceiveMessage(
				(message) => {
					switch (message.command) {
						case "alert":
							vscode.window.showInformationMessage(message.text);
							return;
					}
				},
				undefined,
				context.subscriptions
			);

			const cssStyle = panel.webview.asWebviewUri(
				vscode.Uri.joinPath(
					context.extensionUri,
					"media/static/css/main.f855e6bc.css"
				)
			);

			const scriptPath = panel.webview.asWebviewUri(
				vscode.Uri.joinPath(
					context.extensionUri,
					"media/static/js/main.9833f1df.js"
				)
			);

			const webview = panel.webview;

			const html = `
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="utf-8" />
						<link rel="icon" href="/favicon.ico" />
						<meta name="viewport" content="width=device-width,initial-scale=1" />
						<meta name="theme-color" content="#000000" />
						<meta http-equiv="Content-Security-Policy" content="default-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src ${webview.cspSource} 'self' 'unsafe-inline'; style-src ${webview.cspSource};"/>			 
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
						<script src="${scriptPath}"></script>
					</body>
				</html>`;
			panel.webview.html = html;

			panel.webview.postMessage({ command: "refactor" });

			// Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				(message) => {
					switch (message.command) {
						case "alert":
							vscode.window.showErrorMessage(message.text);
							return;
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
