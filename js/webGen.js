const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

function getComponentTemplate(templateType = "ReactJS") {
	let temp = fs.readFileSync(
		path.join(__dirname, `templates/${templateType}.jst`),
		"utf8"
	);
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

async function getTemplates(templatesPath) {
	var templates = {};
	if (!fs.existsSync(templatesPath)) {
		fs.mkdirSync(templatesPath, { recursive: true });
		fs.writeFileSync(
			path.join(templatesPath, "ReactJS.jst"),
			getComponentTemplate("ReactJS")
		);
		fs.writeFileSync(
			path.join(templatesPath, "NextJS.jst"),
			getComponentTemplate("NextJS")
		);
		console.log("Templates folder created at", templatesPath);
	} else if (fs.readdirSync(templatesPath).length === 0) {
		fs.writeFileSync(
			path.join(templatesPath, "ReactJS.jst"),
			getComponentTemplate("ReactJS")
		);
		fs.writeFileSync(
			path.join(templatesPath, "NextJS.jst"),
			getComponentTemplate("NextJS")
		);
		console.log("Templates folder is empty, default templates created.");
	}

	const files = await fs.promises.readdir(templatesPath, {
		withFileTypes: true,
	});

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (file.name.match(/.*\.jst$/)) {
			const data = await fs.promises.readFile(
				path.join(templatesPath, file.name),
				"utf8"
			);
			templates[file.name.replace(/\.jst$/, "")] = new Function(
				`${data} return template;`
			)();
		}
	}
	return templates;
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

async function AddPanel(url, context) {
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
	const config = vscode.workspace.getConfiguration("structure_creation");
	const templatesPath =
		config.inspect("templatesPath").workspaceValue ||
		config.inspect("templatesPath").globalValue;
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
					getTemplates(templatesPath).then((templates) => {
						webview.postMessage({
							command: "template",
							data: templates,
						});
					});

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
	return panel;
}

module.exports = {
	getComponentTemplate,
	readFolders,
	writeFile,
	createFolder,
	AddPanel,
};
