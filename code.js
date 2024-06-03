const vscode = require("vscode");
let current_path = "";

function createComponentEmotion(name) {
	const param = name.split(".");
	name = param[0];
	const StyledName =
		param[1].charAt(0).toUpperCase() + param[1].slice(1) + "Styled";
	console.log(StyledName);
	const path = current_path + "/" + name;
	vscode.workspace.fs.createDirectory(vscode.Uri.parse(path));

	const writeData = Buffer.from(
		`import { ${StyledName} } from './${name}.styled';

export default function ${name} (){
  return <${StyledName}></${StyledName}>;
};`,
		"utf8"
	);
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/" + name + ".jsx"),
		writeData
	);

	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(path + "/" + name + ".styled.js"),
		Buffer.from(
			`import styled from '@emotion/styled';

export const ${StyledName} = styled.${param[1]}\`\`;`,
			"utf8"
		)
	);
	if (vscode.workspace.getConfiguration().get("react_component.reimport")) {
		vscode.workspace.fs.writeFile(
			vscode.Uri.parse(path + "/index.jsx"),
			Buffer.from(`export * from "./${name}";`, "utf8")
		);
	}
}

function createComponentModule(name) {
	const param = name.split(".");
	let config = "";
	let writeStr = "";
	name = param[0];
	if (param.length > 1) {
		config = param[1];
	}
	const styles = vscode.workspace
		.getConfiguration()
		.get("react_component.styles");
	const path = current_path + "/" + name;
	vscode.workspace.fs.createDirectory(vscode.Uri.parse(path));
	if (config === "c") {
		writeStr = getClassMarkup(name, styles);
	} else if (config === "e") {
		writeStr = getFuncMarkup(name, "without");
	} else {
		writeStr = getFuncMarkup(name, styles);
	}
	const writeData = Buffer.from(writeStr, "utf8");
	vscode.workspace.fs.writeFile(
		vscode.Uri.parse(
			path +
				"/" +
				name +
				"." +
				vscode.workspace.getConfiguration().get("react_component.extension")
		),
		writeData
	);
	if (styles === "module") {
		vscode.workspace.fs.writeFile(
			vscode.Uri.parse(path + "/" + name + ".module.css"),
			Buffer.from("", "utf8")
		);
	}
	if (
		vscode.workspace.getConfiguration().get("react_component.reimport") &&
		config !== "e"
	) {
		vscode.workspace.fs.writeFile(
			vscode.Uri.parse(
				path +
					"/index." +
					vscode.workspace.getConfiguration().get("react_component.extension")
			),
			Buffer.from(`export { default } from './${name}';`, "utf8")
		);
	}
}

function getClassMarkup(name, styles) {
	if (styles === "module") {
		return `import { Component } from 'react';\nimport css from './${name}.module.css'\nclass ${name} extends Component {\n\trender() {\n\t\treturn <div>${name}</div>;\n\t}\n}\nexport default ${name};`;
	} else if (styles === "emotion") {
		return `import { Component } from 'react';\nimport styled from '@emotion/styled';\n\nconst Container = styled.div\`\`;\n\nclass ${name} extends Component {\n\trender() {\n\t\treturn <Container>${name}</Container>;\n\t}\n}\nexport default ${name};`;
	} else {
		return `import { Component } from 'react';\nclass ${name} extends Component {\n\trender() {\n\t\treturn <div>${name}</div>;\n\t}\n}\nexport default ${name};`;
	}
}

function getFuncMarkup(name, styles) {
	if (styles === "module") {
		return `import css from './${name}.module.css'\nconst ${name} = () => {\n\treturn <div>${name}</div>;\n}\nexport default ${name};`;
	} else if (styles === "emotion") {
		return `import styled from '@emotion/styled';\n\nconst Container = styled.div\`\`;\n\nconst ${name} = () => {\n\treturn <Container>${name}</Container>;\n}\nexport default ${name};`;
	} else {
		return `const ${name} = () => {\nreturn <div>${name}</div>;\n}\nexport default ${name};`;
	}
}

function writeFile(path, writeStr) {
	const writeData = Buffer.from(writeStr, "utf8");
	vscode.workspace.fs.writeFile(vscode.Uri.parse(path), writeData);
}
