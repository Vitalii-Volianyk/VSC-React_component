import DeleteIcon from "./DeleteIcon";

function Changes({ changes, removePath, save }) {
	if (changes.length === 0) {
		return <h3>No unsaved changes</h3>;
	}
	let folder = Object.groupBy(changes, ({ basePath }) => basePath);
	return (
		<div className="changes">
			<h1>Unsaved changes:</h1>
			{Object.keys(folder).map((key, index) => {
				return (
					<div key={index}>
						<h2>{key}:</h2>
						{folder[key].map((change, i) => {
							return (
								<div key={i} className="detail">
									<p>{change.path.replace(change.basePath, "")}</p>
									<button onClick={() => removePath(change.path)}>
										<DeleteIcon />
									</button>
								</div>
							);
						})}
					</div>
				);
			})}

			<button className="MainButton" onClick={save}>
				Save
			</button>
		</div>
	);
}

export default Changes;
