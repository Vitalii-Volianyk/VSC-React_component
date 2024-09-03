function Select({ values, name, value, setVal }) {
	return (
		<div className="input">
			<label htmlFor={name}>{name.replace("_", " ")}</label>
			<select
				name={name}
				value={value}
				onChange={(e) => setVal(e.target.value)}
				id={name}
			>
				{values.map((item, index) => (
					<option key={index} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
}

export default Select;
