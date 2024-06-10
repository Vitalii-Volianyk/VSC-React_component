const vscode = require("vscode");

// function readFoldersSync(path) {
// 	let folders = {};

// 	vscode.workspace.fs
// 		.readDirectory(vscode.Uri.parse(path))
// 		.then((files) => {
// 			files.forEach((file) => {
// 				if (file[1] === 2) {
// 					readFolders(path + "/" + file[0])
// 						.then((res) => {
// 							let folder = {
// 								name: file[0],
// 								folders: res,
// 							};
// 						})
// 						.catch((error) => {
// 							console.log(error);
// 						});
// 				}
// 			});
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 		})
// 		.finally(() => {
// 			return folders;
// 		});
// }

async function readFolders(path) {
	let folders = {};

	const files = await vscode.workspace.fs.readDirectory(vscode.Uri.parse(path));

	files.forEach(async (file) => {
		if (file[1] === 2) {
			const res = await readFolders(path + "/" + file[0]);
			let folder = {
				name: file[0],
				folders: res,
			};
			folders[file[0]] = folder;
		}
	});

	return folders;
}

export default readFolders;
