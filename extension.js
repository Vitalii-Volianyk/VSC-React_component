const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const { AddPanel } = require("./js/webGen.js");

const HAS_SHOWN_WELCOME_MESSAGE_KEY = "hasShownWelcomeMessageForVersion";

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

async function activate(context) {
	const currentExtensionVersion = context.extension.packageJSON.version;
	const lastShownVersion = context.globalState.get(
		HAS_SHOWN_WELCOME_MESSAGE_KEY
	);
	if (lastShownVersion !== currentExtensionVersion) {
		// open readme file in preview mode

		vscode.window.createWebviewPanel(
			"welcomeMessage",
			"Welcome to Structure Creation extension",
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
			}
		).webview.html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Welcome</title>
				</head>
				<body>
					<h1>Welcome to Structure Creation Extension</h1>
					<p>Version: ${currentExtensionVersion}</p>
					<p>This extension helps you to create project structures quickly and easily.</p>
					<h2>Here are some features:</h2>
					<ul>
						<li>Customizable templates</li>
						<li>Easy to use interface</li>
						<li>Supports multiple languages</li>
					</ul>
					<h2>Key changes in this version:</h2>
					<ul>
						<li>
						Added support for new template formats and multifile templates
						<br>
						Now you can create templates with multiple files in folders, allowing for easier organization.
						<br>
						(unfortunately, the old templates will not work with this version).
						</li>
						<li>
							added some custom Handlebars helpers to enhance template functionality:
							<br>
							<ul>
								<li>capitalize</li>
								<li>lowerCase</li>
								<li>upperCase</li>
								<li>camelCase</li>
								<li>kebabCase</li>
								<li>snakeCase</li>
								<li>pascalCase</li>
							</ul>
							for example, you can use them like this:
							<pre lang="javascript">{{{capitalize myVariable}}}</pre>
							or
							<pre lang="javascript">{{{camelCase myVariable}}}</pre>
							input text: "my variable" will be transformed to "My variable" or "myVariable" respectively.
						</li>
						<li>Improved template management</li>
						<li>Improved performance</li>
						<li>Bug fixes</li>
					</ul>
					<p>Check the README for more information.</p>
					<p>Thank you for using this extension!</p>
					<h3>If you want to support the development, you can donate via <a href="https://send.monobank.ua/jar/6khupRuMuf">Mono</a>.
					<br>
					Or via <a href="https://u24.gov.ua/">UNITED24</a></h3>
				</body>
				</html>`;
	}

	// Після показу повідомлення, зберігаємо поточну версію
	// Це гарантує, що повідомлення не буде показано знову до наступного оновлення
	context.globalState.update(
		HAS_SHOWN_WELCOME_MESSAGE_KEY,
		currentExtensionVersion
	);

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

	let disposable = vscode.commands.registerCommand(
		"structure_creation.editStructure",
		async function (url) {
			const panel = AddPanel(url, context);
		}
	);
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
