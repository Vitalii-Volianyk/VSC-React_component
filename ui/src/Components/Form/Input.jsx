function Input({ name, value, setVal }) {
	return (
		<div className="input">
			<label htmlFor={name}>{name.replace("_", " ")}</label>
			<input
				type="input"
				name={name}
				id={name}
				value={value}
				onChange={(e) => setVal(e.target.value)}
			/>
		</div>
	);
}

export default Input;
