import { useState } from "react";

function Input({ type = "input", defaultVal, name }) {
	const [val, setVal] = useState(defaultVal);
	return (
		<div className="input">
			<label htmlFor={name}>{name.replace("_", " ")}</label>
			<input
				type={type}
				name={name}
				id={name}
				value={val}
				onChange={(e) => setVal(e.target.value)}
			/>
		</div>
	);
}

export default Input;
