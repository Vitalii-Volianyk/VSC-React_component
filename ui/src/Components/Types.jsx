import { useState } from "react";
import { compileTemplate } from "../func";
import Field from "./Form/Field";

function Types({ templates }) {
	const [currentType, setCurrentType] = useState(Object.keys(templates)[0]);
	const [vars, setVars] = useState({});
	const [subTemplates, setSubTemplates] = useState({});
	const [currTemplates, setCurrTemplates] = useState({});

	const resetValues = () => {
		setVars({});
		setSubTemplates({});
		setCurrTemplates({});
	};

	if (Object.keys(subTemplates).length !== 0) {
		console.log(
			compileTemplate(templates, currentType, vars, subTemplates, currTemplates)
		);
	}

	return (
		<div className="TypesContainer">
			<span>Progect type:</span>
			{Object.keys(templates).map((type, index) => (
				<div
					key={index}
					onClick={(e) => {
						setCurrentType(type);
						resetValues();
					}}
					className={currentType === type ? "checked" : "unchecked"}
				>
					<div className="radio"></div>
					<label htmlFor={type}>{type[0].toUpperCase() + type.slice(1)}</label>
				</div>
			))}

			{Object.keys(templates[currentType]).map((key, index) => {
				const type = key.match(/^.*\[(.*)\]$/)[1] || "input";
				const defaultVal = templates[currentType][key];
				if (key.match(/^\$/))
					return (
						<Field
							change={setVars}
							values={vars}
							key={index}
							type={type}
							defaultVal={defaultVal}
							name={key.match(/^\$(.*)\[.*\]$/)[1]}
						/>
					);
				if (key.match(/^#/))
					return (
						<Field
							change={setSubTemplates}
							values={subTemplates}
							key={index}
							type={type}
							defaultVal={Object.keys(defaultVal)}
							name={key.match(/^#(.*)\[.*\]$/)[1]}
						/>
					);
				return (
					<Field
						change={setCurrTemplates}
						values={currTemplates}
						key={index}
						type={type}
						defaultVal={Object.keys(defaultVal)}
						name={key.match(/^(.*)\[.*\]$/)[1]}
					/>
				);
			})}
		</div>
	);
}

export default Types;
