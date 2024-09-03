import Handlebars from "handlebars";

const prepareTemplate = (
	templates,
	currentType,
	vars,
	subTemplates,
	currTemplates
) => {
	let subTemplatestemp = {};
	let template = {};
	let subVars = {};
	Object.keys(templates[currentType]).forEach((key) => {
		if (key.match(/^\$/)) {
			return;
		} else if (key.match(/^#/)) {
			let name = key.match(/^#(.*)\[.*\]$/)[1];
			subTemplatestemp[name] = templates[currentType][key][subTemplates[name]];
			subVars[name] = templates[currentType][key][subTemplates[name]].val || "";
		} else {
			let name = key.match(/^(.*)\[.*\]$/)[1];
			template[name] = templates[currentType][key][currTemplates[name]];
		}
	});
	return {
		template: template,
		subTemplates: subTemplatestemp,
		variable: { ...vars, ComponentName: "ComponentName" },
		subVars: subVars,
	};
};

const precompileTemplate = (item, compiled) => {
	if (!item.file) {
		if (item.folder) {
			return {
				path: Handlebars.compile(item.folder)(compiled),
			};
		}
		return;
	}
	const content = Handlebars.compile(item.content || "")(compiled);
	const file = Handlebars.compile(item.file)(compiled);
	return { content, path: file };
};

const compileTemplate = (templates, currentType, vars, subTemp, currTemp) => {
	const { template, subTemplates, variable, subVars } = prepareTemplate(
		templates,
		currentType,
		vars,
		subTemp,
		currTemp
	);
	let compiled = { ...variable };
	let toGenerate = [];
	Object.keys(subVars).forEach((key) => {
		compiled[key] = Handlebars.compile(subVars[key])(vars);
	});
	Object.keys(subTemplates).forEach((key) => {
		if (Array.isArray(template[key])) {
			subTemplates[key].forEach((item) => {
				const preC = precompileTemplate(item, compiled);
				if (preC) {
					toGenerate.push(preC);
				}
			});
			return;
		}
		const preC = precompileTemplate(subTemplates[key], compiled);
		if (preC) {
			toGenerate.push(preC);
		}
	});

	Object.keys(template).forEach((key) => {
		if (Array.isArray(template[key])) {
			template[key].forEach((item) => {
				const preC = precompileTemplate(item, compiled);
				if (preC) {
					toGenerate.push(preC);
				}
			});
			return;
		}
		const preC = precompileTemplate(template[key], compiled);
		if (preC) {
			toGenerate.push(preC);
		}
	});

	return toGenerate;
};

export { compileTemplate };
