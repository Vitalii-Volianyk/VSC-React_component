var e=require("vscode"),m=require("fs"),c="";function d(t){let n=e.commands.registerCommand("react-component-structure.createComponent",function(o){e.workspace.fs.stat(o).then(({type:r})=>{r==2?(c=o,e.window.showInputBox({placeHolder:"Component name"}).then(i=>{i!==void 0&&p(i)})):r==1&&(c=e.Uri.parse(o).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&p(s)}))})});t.subscriptions.push(n)}function p(t){let n=t.split("."),o="",r="";t=n[0],n.length>1&&(o=n[1]);let i=e.workspace.getConfiguration().get("react_component.styles"),s=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(s)),o==="c"?r=a(t,i):o==="e"?r=f(t,"without"):r=f(t,i);let u=Buffer.from(r,"utf8");e.workspace.fs.writeFile(e.Uri.parse(s+"/"+t+"."+e.workspace.getConfiguration().get("react_component.extension")),u),i==="module"&&e.workspace.fs.writeFile(e.Uri.parse(s+"/"+t+".module.css"),Buffer.from("","utf8")),e.workspace.getConfiguration().get("react_component.reimport")&&o!=="e"&&e.workspace.fs.writeFile(e.Uri.parse(s+"/index."+e.workspace.getConfiguration().get("react_component.extension")),Buffer.from(`export { default } from './${t}';`,"utf8"))}function l(){}function a(t,n){return n==="module"?`import { Component } from 'react';
import css from './${t}.module.css'
class ${t} extends Component {
	render() {
		return <div>${t}</div>;
	}
}
export default ${t};`:n==="emotion"?`import { Component } from 'react';
import styled from '@emotion/styled';

const Container = styled.div\`\`;

class ${t} extends Component {
	render() {
		return <Container>${t}</Container>;
	}
}
export default ${t};`:`import { Component } from 'react';
class ${t} extends Component {
	render() {
		return <div>${t}</div>;
	}
}
export default ${t};`}function f(t,n){return n==="module"?`import css from './${t}.module.css'
const ${t} = () => {
	return <div>${t}</div>;
}
export default ${t};`:n==="emotion"?`import styled from '@emotion/styled';

const Container = styled.div\`\`;

const ${t} = () => {
	return <Container>${t}</Container>;
}
export default ${t};`:`const ${t} = () => {
return <div>${t}</div>;
}
export default ${t};`}module.exports={activate:d,deactivate:l};
