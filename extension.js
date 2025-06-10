const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const { test1 } = require("./js/estClass.js");

function getComponentTemplate() {
	let temp = fs.readFileSync(path.join(__dirname, "templates.js"), "utf8");
	return temp;
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

	const files = await vscode.workspace.fs.readDirectory(
		vscode.Uri.parse(path)
	);

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (file[1] === 2) {
			folders[file[0]] = await getSubFolders(path, file);
		}
	}

	return folders;
}

function writeFile(path, writeStr = "") {
	if (fs.existsSync(path)) {
		return;
	}
	const writeData = Buffer.from(writeStr, "utf8");
	vscode.workspace.fs.writeFile(vscode.Uri.parse(path), writeData).then(
		() => {
			console.log("Write Success");
		},
		(err) => {
			console.log(err);
		}
	);
}
function createFolder(path) {
	if (fs.existsSync(path)) {
		return;
	}
	vscode.workspace.fs.createDirectory(vscode.Uri.parse(path)).then(
		() => {
			console.log("Create Success");
		},
		(err) => {
			console.log(err);
		}
	);
}

async function activate(context) {
	test1();
	const UserDirectoryPath = vscode.env.appRoot;
	const config = vscode.workspace.getConfiguration("structure_creation");
	if (config.inspect("templatesPath").globalValue === undefined) {
		config.update(
			"templatesPath",
			vscode.Uri.joinPath(
				vscode.Uri.parse(UserDirectoryPath),
				"templates"
			).path,
			true
		);
	}
	const templatesPath =
		config.inspect("templatesPath").workspaceValue ||
		config.inspect("templatesPath").globalValue;

	let disposable = vscode.commands.registerCommand(
		"structure_creation.editStructure",
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
						cssPath.filter((item) =>
							item[0].match(/.*\.css$/)
						)[0][0]
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
							fs.readFile(
								path.join(templatesPath, "templates.js"),
								"utf8",
								(err, data) => {
									if (err) {
										if (err.code === "ENOENT") {
											fs.writeFile(
												path.join(
													templatesPath,
													"templates.js"
												),
												getComponentTemplate(),
												(err) => {
													if (err) {
														console.error(err);
														return;
													}
												}
											);
											webview.postMessage({
												command: "template",
												data: new Function(
													`${getComponentTemplate()} return templates;`
												)(),
											});
											return;
										}
									}

									webview.postMessage({
										command: "template",
										data: new Function(
											`${data} return templates;`
										)(),
									});
								}
							);

							break;
						case "addPath":
							message.data.map((item) => {
								if (item.content !== undefined) {
									writeFile(item.path, item.content);
								} else {
									createFolder(item.path);
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
