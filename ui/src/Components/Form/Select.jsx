import { useState } from "react";

function Select({ values, name, value, setVal }) {
	const [show, setShow] = useState(false);
	return (
		<div className="select">
			<label htmlFor={name}>{name.replace("_", " ")}</label>
			<div className="select__value" onClick={() => setShow((prev) => !prev)}>
				{value}
				<i className="fas fa-caret-down"></i>
				{show && (
					<div className="select__options" id={name}>
						{values.map((item, index) => (
							<span key={index} onClick={() => setVal(item)}>
								{item}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default Select;
