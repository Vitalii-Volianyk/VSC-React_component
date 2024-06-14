function Types({ types, setType, currentType }) {
	return (
		<div className="TypesContainer">
			<span>Progect type:</span>
			{types.map((type, index) => (
				<div key={index}>
					<input
						type="radio"
						name={type}
						value={type}
						id={type}
						onChange={(e) => setType(e.target.value)}
						checked={currentType === type}
					/>
					<label htmlFor={type}>{type[0].toUpperCase() + type.slice(1)}</label>
				</div>
			))}
		</div>
	);
}

export default Types;
