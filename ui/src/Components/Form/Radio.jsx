function Radio({ values, name, value, setVal }) {
	return (
		<div className="input">
			<label htmlFor={name}>{name.replace("_", " ")}</label>
			{values.map((item, index) => (
				<div key={index}>
					<input
						type="radio"
						name={name}
						value={item}
						checked={item === value ? "cheked" : false}
						onChange={(e) => setVal(e.target.value)}
					/>
					<label htmlFor={item}>{item}</label>
				</div>
			))}
		</div>
	);
}

export default Radio;
