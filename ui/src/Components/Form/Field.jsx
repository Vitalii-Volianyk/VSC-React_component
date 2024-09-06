import { useEffect } from "react";
import Input from "./Input";
import Radio from "./Radio";
import Select from "./Select";

function Field({ type = "input", defaultVal, name, change, values }) {
	useEffect(() => {
		if (type === "input") {
			if (!values[name] && values[name] !== "") {
				change((prev) => ({
					...prev,
					[name]: defaultVal,
				}));
			}
		} else {
			if (!values[name]) {
				change((prev) => ({
					...prev,
					[name]: defaultVal[0],
				}));
			}
		}
	}, [values, name, change, defaultVal, type]);

	const onChange = (val) => {
		change((prev) => ({ ...prev, [name]: val }));
	};

	switch (type) {
		case "input":
			return (
				<Input
					value={values[name] !== undefined ? values[name] : defaultVal}
					setVal={onChange}
					name={name}
				/>
			);
		case "radio":
			return (
				<Radio
					values={defaultVal}
					value={values[name] || defaultVal[0]}
					setVal={onChange}
					name={name}
				/>
			);
		case "list":
			return (
				<Select
					values={defaultVal}
					value={values[name] || defaultVal[0]}
					setVal={onChange}
					name={name}
				/>
			);
		default:
			return (
				<Input
					value={values[name] || defaultVal}
					setVal={onChange}
					name={name}
				/>
			);
	}
}

export default Field;
