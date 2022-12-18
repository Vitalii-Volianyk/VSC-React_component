var t=require("vscode"),c="";function p(e){let i=t.commands.registerCommand("react-component-structure.helloWorld",function(r){t.workspace.fs.stat(r).then(({type:s})=>{s==2?(c=r,t.window.showInputBox({placeHolder:"Component name"}).then(o=>{o!==void 0&&f(o)})):s==1&&(c=t.Uri.parse(r).toString().split("/").slice(0,-1).join("/"),t.window.showInputBox({placeHolder:"Component name"}).then(n=>{n!==void 0&&f(n)}))})});e.subscriptions.push(i)}function f(e){let i=e.split("."),r="",s="";e=i[0],i.length>1&&(r=i[1]);let o=c+"/"+e;t.workspace.fs.createDirectory(t.Uri.parse(o)),r=="c"?s=`import { Component } from 'react';
import css from './${e}.module.css'

class ${e} extends Component() {
  render() {
    return <div></div>;
  }
}

export default ${e};`:s=`import css from './${e}.module.css'

const ${e} = () => {
	return <div></div>;	
}

export default ${e};`;let n=Buffer.from(s,"utf8");t.workspace.fs.writeFile(t.Uri.parse(o+"/"+e+".jsx"),n),t.workspace.fs.writeFile(t.Uri.parse(o+"/"+e+".module.css"),Buffer.from("","utf8")),t.workspace.fs.writeFile(t.Uri.parse(o+"/index.jsx"),Buffer.from(`export { default } from './${e}';`,"utf8"))}function d(){}module.exports={activate:p,deactivate:d};
