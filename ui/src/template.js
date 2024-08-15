const Templates = {
	ReactJS: {
		"$Main_tag[input]": "div",

		"#Styles[list]": {
			module: {
				val: "import styles from './{{ComponentName}}.module.css';",
				content: `import "./{{ComponentName}}.module.css";`,
				file: "{{ComponentName}}.module.css",
			},
			css: {
				val: "import './{{ComponentName}}.css';",
				content: `import "./{{ComponentName}}.css";`,
				file: "{{ComponentName}}.css",
			},
			scss: {
				val: "import './{{ComponentName}}.scss';",
				content: `import "./{{ComponentName}}.scss";`,
				file: "{{ComponentName}}.scss",
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
					content: `{{Styles}}
				function {{ComponentName}}() {
					return <{{Main_tag}} className="{{ComponentName}}"></{{Main_tag}}>;
				}
					export default {{ComponentName}};`,
					file: "{{ComponentName}}.jsx",
				},
				{
					content: "export default {{ComponentName}};",
					file: "index.jsx",
				},
			],

			class: [
				{
					content: `{{Styles}}
				class {{ComponentName}} extends React.Component {
					render() {
						return <{{Main_tag}} className="{{ComponentName}}"></{{Main_tag}}>;
					}
				}
				export default {{ComponentName}};`,
					file: "{{ComponentName}}.jsx",
				},
				{
					content: "export default {{ComponentName}};",
					file: "index.jsx",
				},
			],
		},
	},
	NextJS: {
		"$Main_tag[input]": "div2",

		"#Styles[list]": {
			module: {
				let: "import styles from './{{ComponentName}}.module.css';",
				content: `import "./{{ComponentName}}.module.css";`,
				file: "{{ComponentName}}.module.css",
			},
			css: {
				let: "import './{{ComponentName}}.css';",
				content: `import "./{{ComponentName}}.css";`,
				file: "{{ComponentName}}.css",
			},
			scss2: {
				let: "import './{{ComponentName}}.scss';",
				content: `import "./{{ComponentName}}.scss";`,
				file: "{{ComponentName}}.scss",
			},
			none: {
				let: "",
				content: "",
				file: "",
			},
		},

		"Component_type[radio]": {
			server: {
				content: `{{Styles}}
				export default function {{ComponentName}}() {
					return <{{Main_tag}} className="{{ComponentName}}"></{{Main_tag}}>;
				}`,
				file: "{{ComponentName}}.jsx",
			},

			client: {
				content: `{{Styles}}
				export default function {{ComponentName}}() {
					return <{{Main_tag}} className="{{ComponentName}}"></{{Main_tag}}>;
				}`,
				file: "{{ComponentName}}.jsx",
			},

			group: {
				content: `{{Styles}}
				export default function {{ComponentName}}() {
					return <{{Main_tag}} className="{{ComponentName}}"></{{Main_tag}}>;
				}`,
				file: "{{ComponentName}}.jsx",
			},
		},
	},
};

export default Templates;
