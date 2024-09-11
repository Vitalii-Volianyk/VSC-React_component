import { useEffect, useState } from "react";
import Field from "./Form/Field";
import Select from "./Form/Select";

function Types({ templates, params }) {
	const [currentType, setCurrentType] = useState(Object.keys(templates)[0]);
	const [vars, setVars] = useState({});
	const [subTemplates, setSubTemplates] = useState({});
	const [currTemplates, setCurrTemplates] = useState({});

	const resetValues = (type) => {
		setCurrentType(type);
		setVars({});
		setSubTemplates({});
		setCurrTemplates({});
	};

	useEffect(() => {
		params({
			currentType,
			vars,
			subTemplates,
			currTemplates,
		});
	}, [currentType, vars, subTemplates, currTemplates, params]);

	return (
		<div className="TypesContainer">
			<Select
				values={Object.keys(templates)}
				value={currentType || Object.keys(templates)[0]}
				setVal={resetValues}
				name="Project_type"
			/>

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
							defaultVal={defaultVal}
							name={key.match(/^#(.*)\[.*\]$/)[1]}
						/>
					);
				return (
					<Field
						change={setCurrTemplates}
						values={currTemplates}
						key={index}
						type={type}
						defaultVal={defaultVal}
						name={key.match(/^(.*)\[.*\]$/)[1]}
					/>
				);
			})}
		</div>
	);
}

export default Types;
