const templates = {
	ReactJS: {
		"$Main_tag[input]": "div",
		"$ext[list]": {
			js: {
				val: "js",
			},
			jsx: {
				val: "jsx",
			},
		},
		"#Styles[list]": {
			module: {
				val: 'import styles from "./{{{ComponentName}}}.module.css";',
				content: 'import "./{{{ComponentName}}}.module.css";',
				file: "{{{ComponentName}}}.module.css",
			},
			css: {
				val: "import './{{{ComponentName}}}.css';",
				content: "import './{{{ComponentName}}}.css';",
				file: "{{{ComponentName}}}.css",
			},
			scss: {
				val: "import './{{{ComponentName}}}.scss';",
				content: `import "./{{{ComponentName}}}.scss";`,
				file: "{{{ComponentName}}}.scss",
			},
			none: {
				val: "",
				content: "",
				file: "",
			},
		},

		"Component_type[radio]": {
			function: [
				{
					content: `{{{Styles}}}
				function {{{ComponentName}}}() {
					return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
				}
					export default {{{ComponentName}}};`,
					file: "{{{ComponentName}}}.{{{ext}}}",
				},
				{
					content: "export default {{{ComponentName}}};",
					file: "index.{{{ext}}}",
				},
			],

			class: [
				{
					content: `{{{Styles}}}
				class {{{ComponentName}}} extends React.Component {
					render() {
						return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
					}
				}
				export default {{{ComponentName}}};`,
					file: "{{{ComponentName}}}.{{{ext}}}",
				},
				{
					content: "export default {{{ComponentName}}};",
					file: "index.{{{ext}}}",
				},
			],
		},
	},
	NextJS: {
		"$Main_tag[input]": "div",

		"#Styles[list]": {
			module: {
				val: "import styles from './{{{ComponentName}}}.module.css';",
				content: "",
				file: "{{{ComponentName}}}.module.css",
			},
			css: {
				val: "import './{{{ComponentName}}}.css';",
				content: "",
				file: "{{{ComponentName}}}.css",
			},
			scss: {
				val: "import './{{{ComponentName}}}.scss';",

				file: "{{{ComponentName}}}.scss",
			},
			none: {
				let: "",
				content: "",
				file: "",
			},
		},

		"Component_type[radio]": {
			server: {
				content: `{{{Styles}}}
				export default function {{{ComponentName}}}() {
					return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
				}`,
				file: "{{{ComponentName}}}.jsx",
			},

			client: {
				content: `
				use client
				{{{Styles}}}
				export default function {{{ComponentName}}}() {
					return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
				}`,
				file: "{{{ComponentName}}}.jsx",
			},

			group: {
				folder: "({{{ComponentName}}})",
			},
		},
	},
};
