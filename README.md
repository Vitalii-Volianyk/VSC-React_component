### Edit structure

Use rigth click on the folder than You want edit.

![Edit structure](assets/VSC/11.png)

Chose parametrs for selected template and create all neded folders.

![Basic/functional structure](assets/VSC/12.png)

If neded You can delete unnesesary changes befor saving.

![unsaved structure](assets/VSC/13.png)

After You click "Save" button all changes will be created in explorer.

![Empty structure](assets/VSC/14.png)

Use global/local settings for change used template file.

![Settings](assets/VSC/15.png)

For creating own templates:

1. create template.js file and set relative folder in setings
2. use sheme for create own templates
3. and change global or local(workspace) setings.
   - for example You create file with path: "U:/folder/templates/templates.js"
   - paste "U:/folder/templates" in setings

```js
const templates = {
	Template_name: {
		"$Var_name[Var_type]": "defoult var value", //if name start from symbol $ it is variable and value push to direct use(without precompile)
		"#Sub_var_name[Sub_var_type]": {
			//if name start from symbol # it is variable and value push to direct use with precompile using direct values
			value_1: {
				val: "value that will be compiled and pushed in to variable",
				content: "content if neded",
				file: "file name with modifications, relative to parent folder",
			},
			value_2: {
				val: "",
				content: "",
				file: "",
			}, // You can use one or array of objects for creating any quontity of files.
		},
		// For example:
		"Component_type[radio]": {
			//if name dont start from any symbol it is template precompile using direct values and sub values
			server: {
				content: `{{{Styles}}}
						export default function {{{ComponentName}}}() {
							return <{{{Main_tag}}} className="{{{ComponentName}}}"></{{{Main_tag}}}>;
						}`,
				file: "{{{ComponentName}}}.jsx", //any variable can use in subvars & templates with 3 pairs of brakets {{{var}}}
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
				folder: "({{{ComponentName}}})", //Also if your object dont have "content" you can work with folders
			},
		},
	},
};
```
