function Radio({ values, name, value, setVal }) {
	return (
		<div className="radio">
			<span>{name.replace("_", " ")}</span>
			<div className="option">
				{values.map((item, index) => (
					<div key={index} className={item === value ? "cheked" : ""}>
						<input
							type="radio"
							name={name}
							id={item}
							value={item}
							key={index}
							checked={item === value ? "cheked" : false}
							onChange={(e) => setVal(e.target.value)}
						/>
						<label htmlFor={item}>{item}</label>
					</div>
				))}
			</div>
		</div>
	);
}

export default Radio;
