import { useState } from "react";

function AddFolder({ addFolder, parentPath }) {
	const [folderName, setFolderName] = useState("");
	const [newState, setNewState] = useState(false);

	const handleFolderNameChange = (e) => {
		setFolderName(e.target.value);
	};

	const handleAddFolder = () => {
		addFolder(`${parentPath}/${folderName}`);
		setFolderName("");
		setNewState(false);
	};

	return (
		<div>
			{newState ? (
				<div>
					<input
						type="text"
						value={folderName}
						onChange={handleFolderNameChange}
						autoFocus={true}
					/>
					<button onClick={handleAddFolder}>Add Folder</button>
				</div>
			) : (
				<button onClick={() => setNewState(true)}>+</button>
			)}
		</div>
	);
}

export default AddFolder;
