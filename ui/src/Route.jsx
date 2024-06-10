function Route({ folders }) {
	if (Object.keys(folders).length === 0) return null;
	return (
		<div className="Route">
			{Object.keys(folders).map((key) => {
				return (
					<details key={key}>
						<summary>{key}</summary>
						<Route folders={folders[key].folders} />
					</details>
				);
			})}
		</div>
	);
}

export default Route;
