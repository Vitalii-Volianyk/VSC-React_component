import Input from "./Form/Input";
import Select from "./Form/Select";

function Types({ setType, currentType, templates }) {
	return (
		<div className="TypesContainer">
			<span>Progect type:</span>
			{Object.keys(templates).map((type, index) => (
				<div
					key={index}
					onClick={(e) => setType(type)}
					className={currentType === type ? "checked" : "unchecked"}
				>
					<div className="radio"></div>
					<label htmlFor={type}>{type[0].toUpperCase() + type.slice(1)}</label>
				</div>
			))}

			{Object.keys(templates[currentType]).map((key, index) => {
				if (key.match(/^\$/))
					return (
						<Input
							key={index}
							type={key.match(/^.*\[(.*)\]$/)[1] || "input"}
							defaultVal={templates[currentType][key]}
							name={key.match(/^\$(.*)\[.*\]$/)[1]}
						/>
					);
				if (key.match(/^#/))
					return (
						<Select
							key={index}
							type={key.match(/^.*\[(.*)\]$/)[1] || "input"}
							defaultVal={Object.keys(templates[currentType][key])}
							name={key.match(/^#(.*)\[.*\]$/)[1]}
						/>
					);
				return (
					<div key={index} className="radio">
						<input
							type="radio"
							name={currentType}
							id={key}
							value={key}
							onChange={(e) => setType(key)}
						/>
						<label htmlFor={key}>{key[0].toUpperCase() + key.slice(1)}</label>
					</div>
				);
			})}
		</div>
	);
}

export default Types;
