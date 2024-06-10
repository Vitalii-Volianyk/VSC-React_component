import AddFolder from "./AddFolder";

function Route({ folders, addPath }) {
	if (Object.keys(folders).length === 0) return null;
	return (
		<div className="Route">
			{Object.keys(folders).map((key) => {
				return (
					<div key={key}>
						<details>
							<summary>{key}</summary>
							<Route folders={folders[key].folders} addPath={addPath} />
						</details>
						<AddFolder addFolder={addPath} parentPath={folders[key].path} />
					</div>
				);
			})}
		</div>
	);
}

export default Route;
