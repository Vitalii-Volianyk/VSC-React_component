var d=require("path"),l=require("fs"),e=require("vscode");function f(){return l.readFileSync(d.join(__dirname,"templates.js"),"utf8")}async function U(t,a){let s={};if(a[1]===2){let r=await h(t+"/"+a[0]);s={path:t+"/"+a[0],name:a[0],folders:r}}return s}async function h(t){let a={},s=await e.workspace.fs.readDirectory(e.Uri.parse(t));for(let r=0;r<s.length;r++){let c=s[r];c[1]===2&&(a[c[0]]=await U(t,c))}return a}function v(t,a=""){if(l.existsSync(t))return;let s=Buffer.from(a,"utf8");e.workspace.fs.writeFile(e.Uri.parse(t),s).then(()=>{console.log("Write Success")},r=>{console.log(r)})}function y(t){l.existsSync(t)||e.workspace.fs.createDirectory(e.Uri.parse(t)).then(()=>{console.log("Create Success")},a=>{console.log(a)})}async function k(t){let a=e.env.appRoot,s=e.workspace.getConfiguration("structure_creation");s.inspect("templatesPath").globalValue===void 0&&s.update("templatesPath",e.Uri.joinPath(e.Uri.parse(a),"templates").path,!0);let r=s.inspect("templatesPath").workspaceValue||s.inspect("templatesPath").globalValue,c=e.commands.registerCommand("structure_creation.editStructure",async function(u){let n=e.window.createWebviewPanel("editStructure","Edit Structure",e.ViewColumn.One,{enableScripts:!0,localResourceRoots:[e.Uri.joinPath(t.extensionUri,"media")]}).webview,w=await e.workspace.fs.readDirectory(e.Uri.joinPath(t.extensionUri,"media/static/css")),g=n.asWebviewUri(e.Uri.joinPath(t.extensionUri,`media/static/css/${w.filter(o=>o[0].match(/.*\.css$/))[0][0]}`)),P=await e.workspace.fs.readDirectory(e.Uri.joinPath(t.extensionUri,"media/static/js")),b=n.asWebviewUri(e.Uri.joinPath(t.extensionUri,`media/static/js/${P.filter(o=>o[0].match(/.*\.js$/))[0][0]}`)),j=`
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
						<link rel="stylesheet" type="text/css" href="${g}" />
						</head>
						<body>
						<noscript>You need to enable JavaScript to run this app.</noscript>
						<div id="root"></div>
						<script>
        (function() {
            window.vscode = acquireVsCodeApi();
            
        }())
    </script>
						<script src="${b}"></script>
					</body>
				</html>`;n.html=j,n.onDidReceiveMessage(o=>{switch(o.command){case"alert":e.window.showErrorMessage(o.text);return;case"updateStructure":h(u.path).then(i=>{let p={rootPath:u.path,folders:{}};p.folders=i,n.postMessage({command:"structure",data:p})}).catch(i=>{console.log(i)}),l.readFile(d.join(r,"templates.js"),"utf8",(i,p)=>{if(i&&i.code==="ENOENT"){l.writeFile(d.join(r,"templates.js"),f(),m=>{if(m){console.error(m);return}}),n.postMessage({command:"template",data:new Function(`${f()} return templates;`)()});return}n.postMessage({command:"template",data:new Function(`${p} return templates;`)()})});break;case"addPath":o.data.map(i=>{i.content!==void 0?v(i.path,i.content):y(i.path)});break}},void 0,t.subscriptions)});t.subscriptions.push(c)}function S(){}module.exports={activate:k,deactivate:S};
