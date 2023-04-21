var e=require("vscode"),w=require("fs"),c="";function l(t){let r=e.commands.registerCommand("react-component-structure.createEmotionComponent",function(o){e.workspace.fs.stat(o).then(({type:i})=>{i==2?(c=o,e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&f(s)})):i==1&&(c=e.Uri.parse(o).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(p=>{p!==void 0&&f(p)}))})});t.subscriptions.push(r);let n=e.commands.registerCommand("react-component-structure.createComponent",function(o){e.workspace.fs.stat(o).then(({type:i})=>{i==2?(c=o,e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&u(s)})):i==1&&(c=e.Uri.parse(o).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(p=>{p!==void 0&&u(p)}))})});t.subscriptions.push(n)}function f(t){let r=t.split(".");t=r[0];let n=r[1].charAt(0).toUpperCase()+r[1].slice(1)+"Styled";console.log(n);let o=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(o));let i=Buffer.from(`import { ${n} } from './${t}.styled';

export const ${t} = () => {
  return <${n}></${n}>;
};`,"utf8");e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+".jsx"),i),e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+".styled.js"),Buffer.from(`import styled from '@emotion/styled';

export const ${n} = styled.${r[1]}\`\`;`,"utf8")),e.workspace.fs.writeFile(e.Uri.parse(o+"/index.jsx"),Buffer.from(`export * from "./${t}";`,"utf8"))}function u(t){let r=t.split("."),n="",o="";t=r[0],r.length>1&&(n=r[1]);let i=e.workspace.getConfiguration().get("react_component.styles"),s=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(s)),n==="c"?o=m(t,i):n==="e"?o=d(t,"without"):o=d(t,i);let p=Buffer.from(o,"utf8");e.workspace.fs.writeFile(e.Uri.parse(s+"/"+t+"."+e.workspace.getConfiguration().get("react_component.extension")),p),i==="module"&&e.workspace.fs.writeFile(e.Uri.parse(s+"/"+t+".module.css"),Buffer.from("","utf8")),e.workspace.getConfiguration().get("react_component.reimport")&&n!=="e"&&e.workspace.fs.writeFile(e.Uri.parse(s+"/index."+e.workspace.getConfiguration().get("react_component.extension")),Buffer.from(`export { default } from './${t}';`,"utf8"))}function a(){}function m(t,r){return r==="module"?`import { Component } from 'react';
import css from './${t}.module.css'
class ${t} extends Component {
	render() {
		return <div>${t}</div>;
	}
}
export default ${t};`:r==="emotion"?`import { Component } from 'react';
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
export default ${t};`}function d(t,r){return r==="module"?`import css from './${t}.module.css'
const ${t} = () => {
	return <div>${t}</div>;
}
export default ${t};`:r==="emotion"?`import styled from '@emotion/styled';

const Container = styled.div\`\`;

const ${t} = () => {
	return <Container>${t}</Container>;
}
export default ${t};`:`const ${t} = () => {
return <div>${t}</div>;
}
export default ${t};`}module.exports={activate:l,deactivate:a};
