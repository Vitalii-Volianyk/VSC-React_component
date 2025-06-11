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
		// Показуємо вітальне повідомлення лише якщо версія змінилася
		vscode.window
			.showInformationMessage(
				`Вітаємо у Розширенні MyCoolExtension! 🎉 Нова версія ${currentExtensionVersion} встановлена або оновлена.` +
					` Дякуємо за використання!`,
				"Відкрити документацію",
				"Закрити"
			)
			.then((selection) => {
				if (selection === "Відкрити документацію") {
					vscode.env.openExternal(
						vscode.Uri.parse("https://godotengine.org/en/docs")
					);
				}
			});

		// Після показу повідомлення, зберігаємо поточну версію
		// Це гарантує, що повідомлення не буде показано знову до наступного оновлення
		context.globalState.update(
			HAS_SHOWN_WELCOME_MESSAGE_KEY,
			currentExtensionVersion
		);
	}

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
