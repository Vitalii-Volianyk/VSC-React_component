import Handlebars from "handlebars";

const prepareTemplate = (
	templates,
	currentType,
	vars,
	subTemplates,
	currTemplates,
	folderName
) => {
	let subTemplatestemp = {};
	let template = {};
	let subVars = {};
	Object.keys(templates[currentType]).forEach((key) => {
		if (key.match(/^\$/)) {
			return;
		} else if (key.match(/^#/)) {
			let name = key.match(/^#(.*)\[.*\]$/)[1];
			subTemplatestemp[name] =
				templates[currentType][key][subTemplates[name]];
			subVars[name] =
				templates[currentType][key][subTemplates[name]].val || "";
		} else {
			let name = key.match(/^(.*)\[.*\]$/)[1];
			template[name] = templates[currentType][key][currTemplates[name]];
		}
	});
	return {
		template: template,
		subTemplates: subTemplatestemp,
		variable: { ...vars, ComponentName: folderName },
		subVars: subVars,
	};
};

const precompileTemplate = (item, compiled, newFolderPath) => {
	if (!item.file) {
		if (item.folder) {
			return {
				path:
					newFolderPath +
					"/" +
					Handlebars.compile(item.folder)(compiled),
				basePath: newFolderPath,
			};
		}
		return;
	}
	const content = Handlebars.compile(item.content || "")(compiled);
	const file = Handlebars.compile(item.file)(compiled);
	return {
		content,
		path: newFolderPath + "/" + file,
		basePath: newFolderPath,
	};
};

const compileTemplate = (
	templates,
	currentType,
	vars,
	subTemp,
	currTemp,
	folderName,
	newFoderPath
) => {
	const { template, subTemplates, variable, subVars } = prepareTemplate(
		templates,
		currentType,
		vars,
		subTemp,
		currTemp,
		folderName
	);
	let compiled = { ...variable };
	let toGenerate = [];
	Object.keys(subVars).forEach((key) => {
		compiled[key] = Handlebars.compile(subVars[key])(compiled);
	});
	Object.keys(subTemplates).forEach((key) => {
		if (Array.isArray(template[key])) {
			subTemplates[key].forEach((item) => {
				const preC = precompileTemplate(item, compiled, newFoderPath);
				if (preC) {
					toGenerate.push(preC);
				}
			});
			return;
		}
		const preC = precompileTemplate(
			subTemplates[key],
			compiled,
			newFoderPath
		);
		if (preC) {
			toGenerate.push(preC);
		}
	});

	Object.keys(template).forEach((key) => {
		if (Array.isArray(template[key])) {
			template[key].forEach((item) => {
				const preC = precompileTemplate(item, compiled, newFoderPath);
				if (preC) {
					toGenerate.push(preC);
				}
			});
			return;
		}
		const preC = precompileTemplate(template[key], compiled, newFoderPath);
		if (preC) {
			toGenerate.push(preC);
		}
	});

	return toGenerate;
};

export { compileTemplate };
