import AddFolder from "./AddFolder";

function Route({ folders, addPath }) {
	if (Object.keys(folders).length === 0) return null;

	return (
		<div className="Route">
			{Object.keys(folders).map((key) => {
				const q_folders = Object.keys(folders[key].folders).length;
				return (
					<div key={key}>
						<details className={q_folders <= 0 ? "noCursor" : null}>
							<summary>
								<span>
									{q_folders > 0 ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="10.033"
											height="5"
										>
											<path d="M5.016 0 0 .003 2.506 2.5 5.016 5l2.509-2.5L10.033.003 5.016 0z" />
										</svg>
									) : null}
									{key}
								</span>
								<AddFolder addFolder={addPath} parentPath={folders[key].path} />
							</summary>
							<Route folders={folders[key].folders} addPath={addPath} />
						</details>
					</div>
				);
			})}
		</div>
	);
}

export default Route;
