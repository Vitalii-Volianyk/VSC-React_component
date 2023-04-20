var e=require("vscode"),w=require("fs"),c="";function l(t){let r=e.commands.registerCommand("react-component-structure.createEmotionComponent",function(i){e.workspace.fs.stat(i).then(({type:n})=>{n==2?(c=i,e.window.showInputBox({placeHolder:"Component name"}).then(o=>{o!==void 0&&f(o)})):n==1&&(c=e.Uri.parse(i).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&f(s)}))})});t.subscriptions.push(r);let p=e.commands.registerCommand("react-component-structure.createComponent",function(i){e.workspace.fs.stat(i).then(({type:n})=>{n==2?(c=i,e.window.showInputBox({placeHolder:"Component name"}).then(o=>{o!==void 0&&u(o)})):n==1&&(c=e.Uri.parse(i).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&u(s)}))})});t.subscriptions.push(p)}function f(t){let r=t.split("."),p="",i="";t=r[0];let n=r[2].charAt(0).toUpperCase()+r[2].slice(1)+"Styled",o=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(o));let s=Buffer.from(`import { ${n} } from './${t}.styled';

export const ${t} = () => {
  return <${n}></${n}>;
};`,"utf8");e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+".jsx"),s),e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+".styled.js"),Buffer.from(`import styled from '@emotion/styled';

export const ${n} = styled.${r[2]}\`\`;`,"utf8")),e.workspace.fs.writeFile(e.Uri.parse(o+"/index.jsx"),Buffer.from(`export * from "./${t}";`,"utf8"))}function u(t){let r=t.split("."),p="",i="";t=r[0],r.length>1&&(p=r[1]);let n=e.workspace.getConfiguration().get("react_component.styles"),o=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(o)),p==="c"?i=m(t,n):p==="e"?i=d(t,"without"):i=d(t,n);let s=Buffer.from(i,"utf8");e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+"."+e.workspace.getConfiguration().get("react_component.extension")),s),n==="module"&&e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+".module.css"),Buffer.from("","utf8")),e.workspace.getConfiguration().get("react_component.reimport")&&p!=="e"&&e.workspace.fs.writeFile(e.Uri.parse(o+"/index."+e.workspace.getConfiguration().get("react_component.extension")),Buffer.from(`export { default } from './${t}';`,"utf8"))}function a(){}function m(t,r){return r==="module"?`import { Component } from 'react';
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
