import { useEffect, useState } from "react";

let SubTypes = {
	react: ["function", "class"],
	next: ["server", "client", "group"],
};
let StyleTypes = {
	react: ["module", "class"],
	next: ["server", "client", "group"],
};
function Types({ types, setType, currentType }) {
	const [subType, setSubType] = useState(SubTypes[currentType][0]);

	useEffect(() => {
		setSubType(SubTypes[currentType][0]);
	}, [currentType]);

	return (
		<div className="TypesContainer">
			<span>Progect type:</span>
			{types.map((type, index) => (
				<div
					key={index}
					onClick={(e) => setType(type)}
					className={currentType === type ? "checked" : "unchecked"}
				>
					<div className="radio"></div>
					<label htmlFor={type}>{type[0].toUpperCase() + type.slice(1)}</label>
				</div>
			))}
			<div className="subContainer">
				<span>Component type:</span>
				{SubTypes[currentType].map((type, index) => (
					<div
						key={index}
						onClick={(e) => setSubType(type)}
						className={subType === type ? "checked" : "unchecked"}
					>
						<div className="radio"></div>
						<label htmlFor={type}>
							{type[0].toUpperCase() + type.slice(1)}
						</label>
					</div>
				))}
			</div>
		</div>
	);
}

export default Types;
