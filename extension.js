const vscode = require("vscode");
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"react-component-structure.editStructure",
		function (url) {
			const path = url.fsPath;

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
				vscode.Uri.joinPath(context.extensionUri, "media", "ext.css")
			);
			const scriptPath = panel.webview.asWebviewUri(
				vscode.Uri.joinPath(context.extensionUri, "media", "ext.js")
			);
			const webview = panel.webview;
			const html = `<!DOCTYPE html>
					<html lang="en">
					<head>
					  <meta charset="UTF-8">
					  <meta http-equiv="X-UA-Compatible" content="IE=edge">
					  <meta
						  http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${
								webview.cspSource
							} https:; script-src ${
				webview.cspSource
			} 'self' 'unsafe-inline'; style-src ${webview.cspSource};"
						/>
					  <meta name="viewport" content="width=device-width, initial-scale=1.0">
					  <link rel="stylesheet" type="text/css" href="${cssStyle}" />
					  <script src="${scriptPath}"></script>
					  <title>Edit Structure</title>
					</head>
					<body>
					  <h1>Edit Structure</h1>
					  <h2>Current Structure</h2>
					  <p>${path}</p>
					  <h2>Workspace</h2>
					  <p>${vscode.workspace.getWorkspaceFolder(url).name}</p>
					  <h2>Relative Path</h2>
					  <p>${vscode.workspace.asRelativePath(url)}</p>
					  <form action="">
						<label for="structure">Structure</label>
						<input type="text" name="structure" id="structure" />
						<button type="button" onclick="FormSubmit()">Save</button>
					  </form>
					   
					</body>
					</html>`;
			panel.webview.html = html;
		}
	);
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
