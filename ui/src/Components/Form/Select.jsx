import { useState } from "react";

function Select({ type = "input", defaultVal, name }) {
	const [val, setVal] = useState(defaultVal);
	return (
		<div className="input">
			<label htmlFor={name}>{name.replace("_", " ")}</label>
			<select
				name={name}
				value={val}
				onChange={(e) => setVal(e.target.value)}
				id={name}
			>
				{defaultVal.map((item, index) => (
					<option key={index} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
}

export default Select;
