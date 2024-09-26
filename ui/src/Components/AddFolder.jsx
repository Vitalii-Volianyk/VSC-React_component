import { useState } from "react";

function AddFolder({ saveFolder, parentPath }) {
	const [folderName, setFolderName] = useState("");

	const handleFolderNameChange = (e) => {
		setFolderName(e.target.value);
	};

	const handleAddFolder = () => {
		saveFolder(folderName);
		setFolderName("");
	};
	const cancelAdd = () => {
		saveFolder("");
		setFolderName("");
	};

	return (
		<div className="addFolder">
			<span>{parentPath}</span>
			<input
				type="text"
				value={folderName}
				onChange={handleFolderNameChange}
				autoFocus={true}
			/>
			<div>
				<button onClick={cancelAdd}>
					<svg
						version="1.1"
						id="icons_1_"
						xmlns="http://www.w3.org/2000/svg"
						x="0"
						y="0"
						viewBox="0 0 128 128"
						style={{ enableBackground: "new 3 3 125 125" }}
						xmlSpace="preserve"
					>
						<g id="row1_1_">
							<g id="_x34__2_">
								<path
									className="st2"
									d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7s57.6 25.7 57.6 57.3c0 31.7-25.8 57.3-57.6 57.3zm21.9-73.2L81 43.3c-.9-.9-2.3-.9-3.2 0L64 57 50.2 43.3c-.9-.9-2.3-.9-3.2 0l-4.9 4.8c-.9.9-.9 2.3 0 3.2L55.9 65 42.1 78.8c-.9.9-.9 2.3 0 3.2l4.9 4.8c.9.9 2.3.9 3.2 0L64 73.1l13.8 13.7c.9.9 2.3.9 3.2 0l4.9-4.8c.9-.9.9-2.3 0-3.2L72.1 65l13.8-13.7c.9-.9.9-2.3 0-3.2z"
									id="error_transparent"
								/>
							</g>
						</g>
					</svg>
				</button>
				<button onClick={handleAddFolder}>
					<svg
						version="1.1"
						id="icons_1_"
						xmlns="http://www.w3.org/2000/svg"
						x="0"
						y="0"
						viewBox="0 0 128 128"
						style={{ enableBackground: "new 3 3 125 125" }}
						xmlSpace="preserve"
					>
						<g id="row1_1_">
							<g id="_x35__2_">
								<path
									className="st2"
									d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7s57.6 25.7 57.6 57.3c0 31.7-25.8 57.3-57.6 57.3zm23.2-76.8c-.9-.9-2.3-.9-3.2 0L55.2 73.2 41.4 59.5c-.9-.9-2.3-.9-3.2 0l-4.8 4.8c-.9.9-.9 2.3 0 3.2l15.3 15.3 3.3 3.3.8.8.7.7c.9.9 2.3.9 3.2 0L92 52.5c.9-.9.9-2.3 0-3.2l-4.8-4.8z"
									id="error_transparent_copy"
								/>
							</g>
						</g>
					</svg>
				</button>
			</div>
		</div>
	);
}

export default AddFolder;
