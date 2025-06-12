var U=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var v=U((M,b)=>{var a=require("vscode"),u=require("path"),s=require("fs");function d(e="ReactJS"){return s.readFileSync(u.join(__dirname,`templates/${e}.jst`),"utf8")}async function x(e,t){let r={};if(t[1]===2){let i=await f(e+"/"+t[0]);r={path:e+"/"+t[0],name:t[0],folders:i}}return r}async function f(e){let t={},r=await a.workspace.fs.readDirectory(a.Uri.parse(e));for(let i=0;i<r.length;i++){let n=r[i];n[1]===2&&(t[n[0]]=await x(e,n))}return t}async function F(e){var t={};s.existsSync(e)?s.readdirSync(e).length===0&&(s.writeFileSync(u.join(e,"ReactJS.jst"),d("ReactJS")),s.writeFileSync(u.join(e,"NextJS.jst"),d("NextJS")),console.log("Templates folder is empty, default templates created.")):(s.mkdirSync(e,{recursive:!0}),s.writeFileSync(u.join(e,"ReactJS.jst"),d("ReactJS")),s.writeFileSync(u.join(e,"NextJS.jst"),d("NextJS")),console.log("Templates folder created at",e));let r=await s.promises.readdir(e,{withFileTypes:!0});for(let i=0;i<r.length;i++){let n=r[i];if(n.name.match(/.*\.jst$/)){let p=await s.promises.readFile(u.join(e,n.name),"utf8");t[n.name.replace(/\.jst$/,"")]=new Function(`${p} return template;`)()}}return t}function g(e,t=""){if(s.existsSync(e))return;let r=Buffer.from(t,"utf8");a.workspace.fs.writeFile(a.Uri.parse(e),r).then(()=>{console.log("Write Success")},i=>{console.log(i)})}function S(e){s.existsSync(e)||a.workspace.fs.createDirectory(a.Uri.parse(e)).then(()=>{console.log("Create Success")},t=>{console.log(t)})}async function E(e,t){let r=a.window.createWebviewPanel("editStructure","Edit Structure",a.ViewColumn.One,{enableScripts:!0,localResourceRoots:[a.Uri.joinPath(t.extensionUri,"media")]}),i=r.webview,n=await a.workspace.fs.readDirectory(a.Uri.joinPath(t.extensionUri,"media/static/css")),p=i.asWebviewUri(a.Uri.joinPath(t.extensionUri,`media/static/css/${n.filter(l=>l[0].match(/.*\.css$/))[0][0]}`)),m=await a.workspace.fs.readDirectory(a.Uri.joinPath(t.extensionUri,"media/static/js")),h=i.asWebviewUri(a.Uri.joinPath(t.extensionUri,`media/static/js/${m.filter(l=>l[0].match(/.*\.js$/))[0][0]}`)),k=`
					<!DOCTYPE html>
					<html lang="en">
						<head>
							<meta charset="utf-8" />
							<link rel="icon" href="/favicon.ico" />
							<meta name="viewport" content="width=device-width,initial-scale=1" />
							<meta name="theme-color" content="#000000" />
										 
							<meta
								name="description"
								content="Web site created using create-react-app"
							/>
							<link rel="apple-touch-icon" href="/logo192.png" />
							<link rel="manifest" href="/manifest.json" />
							<title>React App</title>
							<link rel="stylesheet" type="text/css" href="${p}" />
							</head>
							<body>
							<noscript>You need to enable JavaScript to run this app.</noscript>
							<div id="root"></div>
							<script>
			(function() {
				window.vscode = acquireVsCodeApi();
				
			}())
		</script>
							<script src="${h}"></script>
						</body>
					</html>`;i.html=k;let w=a.workspace.getConfiguration("structure_creation"),C=w.inspect("templatesPath").workspaceValue||w.inspect("templatesPath").globalValue;return i.onDidReceiveMessage(l=>{switch(l.command){case"alert":a.window.showErrorMessage(l.text);return;case"updateStructure":f(e.path).then(o=>{let y={rootPath:e.path,folders:{}};y.folders=o,i.postMessage({command:"structure",data:y})}).catch(o=>{console.log(o)}),F(C).then(o=>{i.postMessage({command:"template",data:o})});break;case"addPath":l.data.map(o=>{o.content!==void 0?g(o.path,o.content):S(o.path)});break}},void 0,t.subscriptions),r}b.exports={getComponentTemplate:d,readFolders:f,writeFile:g,createFolder:S,AddPanel:E}});var R=require("path"),J=require("fs"),c=require("vscode"),{AddPanel:P}=v(),j="hasShownWelcomeMessageForVersion";async function V(e){let t=e.extension.packageJSON.version;e.globalState.get(j)!==t&&(c.window.createWebviewPanel("welcomeMessage","Welcome to Structure Creation extension",c.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}).webview.html=`
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Welcome</title>
				</head>
				<body>
					<h1>Welcome to Structure Creation Extension</h1>
					<p>Version: ${t}</p>
					<p>This extension helps you to create project structures quickly and easily.</p>
					<h2>Here are some features:</h2>
					<ul>
						<li>Customizable templates</li>
						<li>Easy to use interface</li>
						<li>Supports multiple languages</li>
					</ul>
					<h2>Key changes in this version:</h2>
					<ul>
						<li>
						Added support for new template formats and multifile templates
						<br>
						Now you can create templates with multiple files in folders, allowing for easier organization.
						<br>
						(unfortunately, the old templates will not work with this version).
						</li>
						<li>
							added some custom Handlebars helpers to enhance template functionality:
							<br>
							<ul>
								<li>capitalize</li>
								<li>lowerCase</li>
								<li>upperCase</li>
								<li>camelCase</li>
								<li>kebabCase</li>
								<li>snakeCase</li>
								<li>pascalCase</li>
							</ul>
							for example, you can use them like this:
							<pre lang="javascript">{{{capitalize myVariable}}}</pre>
							or
							<pre lang="javascript">{{{camelCase myVariable}}}</pre>
							input text: "my variable" will be transformed to "My variable" or "myVariable" respectively.
						</li>
						<li>Improved template management</li>
						<li>Improved performance</li>
						<li>Bug fixes</li>
					</ul>
					<p>Check the README for more information.</p>
					<p>Thank you for using this extension!</p>
					<h3>If you want to support the development, you can donate via <a href="https://send.monobank.ua/jar/6khupRuMuf">Mono</a>.
					<br>
					Or via <a href="https://u24.gov.ua/">UNITED24</a></h3>
				</body>
				</html>`),e.globalState.update(j,t);let i=c.env.appRoot,n=c.workspace.getConfiguration("structure_creation");n.inspect("templatesPath").globalValue===void 0&&n.update("templatesPath",c.Uri.joinPath(c.Uri.parse(i),"templates").path,!0);let p=c.commands.registerCommand("structure_creation.editStructure",async function(m){let h=P(m,e)});e.subscriptions.push(p)}function W(){}module.exports={activate:V,deactivate:W};
