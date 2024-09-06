import { useState } from "react";

function Select({ values, name, value, setVal }) {
	const [show, setShow] = useState(false);
	return (
		<div className="select">
			<label htmlFor={name}>{name.replace("_", " ")}</label>

			<div className="select__value" onClick={() => setShow((prev) => !prev)}>
				{value}

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
			<svg
				className={show ? "open" : "close"}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 10.033 5"
			>
				<path d="M5.016 0 0 .003 2.506 2.5 5.016 5l2.509-2.5L10.033.003 5.016 0z" />
			</svg>
		</div>
	);
}

export default Select;
