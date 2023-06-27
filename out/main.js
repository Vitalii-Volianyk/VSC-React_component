var e=require("vscode"),c="";function m(t){let o=e.commands.registerCommand("react-component-structure.createEmotionComponent",function(r){e.workspace.fs.stat(r).then(({type:i})=>{i==2?(c=r,e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&a(s)})):i==1&&(c=e.Uri.parse(r).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(f=>{f!==void 0&&a(f)}))})}),n=e.commands.registerCommand("react-component-structure.createNativeComponent",function(r){e.workspace.fs.stat(r).then(({type:i})=>{i==2?(c=r,e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&d(s)})):i==1&&(c=e.Uri.parse(r).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(f=>{f!==void 0&&d(f)}))})});t.subscriptions.push(o),t.subscriptions.push(n);let p=e.commands.registerCommand("react-component-structure.createComponent",function(r){e.workspace.fs.stat(r).then(({type:i})=>{i==2?(c=r,e.window.showInputBox({placeHolder:"Component name"}).then(s=>{s!==void 0&&u(s)})):i==1&&(c=e.Uri.parse(r).toString().split("/").slice(0,-1).join("/"),e.window.showInputBox({placeHolder:"Component name"}).then(f=>{f!==void 0&&u(f)}))})});t.subscriptions.push(p)}function a(t){let o=t.split(".");t=o[0];let n=o[1].charAt(0).toUpperCase()+o[1].slice(1)+"Styled";console.log(n);let p=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(p));let r=Buffer.from(`import { ${n} } from './${t}.styled';

export const ${t} = () => {
  return <${n}></${n}>;
};`,"utf8");e.workspace.fs.writeFile(e.Uri.parse(p+"/"+t+".jsx"),r),e.workspace.fs.writeFile(e.Uri.parse(p+"/"+t+".styled.js"),Buffer.from(`import styled from '@emotion/styled';

export const ${n} = styled.${o[1]}\`\`;`,"utf8")),e.workspace.fs.writeFile(e.Uri.parse(p+"/index.jsx"),Buffer.from(`export * from "./${t}";`,"utf8"))}function u(t){let o=t.split("."),n="",p="";t=o[0],o.length>1&&(n=o[1]);let r=e.workspace.getConfiguration().get("react_component.styles"),i=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(i)),n==="c"?p=x(t,r):n==="e"?p=l(t,"without"):p=l(t,r);let s=Buffer.from(p,"utf8");e.workspace.fs.writeFile(e.Uri.parse(i+"/"+t+"."+e.workspace.getConfiguration().get("react_component.extension")),s),r==="module"&&e.workspace.fs.writeFile(e.Uri.parse(i+"/"+t+".module.css"),Buffer.from("","utf8")),e.workspace.getConfiguration().get("react_component.reimport")&&n!=="e"&&e.workspace.fs.writeFile(e.Uri.parse(i+"/index."+e.workspace.getConfiguration().get("react_component.extension")),Buffer.from(`export { default } from './${t}';`,"utf8"))}function w(){}function x(t,o){return o==="module"?`import { Component } from 'react';
import css from './${t}.module.css'
class ${t} extends Component {
	render() {
		return <div>${t}</div>;
	}
}
export default ${t};`:o==="emotion"?`import { Component } from 'react';
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
export default ${t};`}function l(t,o){return o==="module"?`import css from './${t}.module.css'
const ${t} = () => {
	return <div>${t}</div>;
}
export default ${t};`:o==="emotion"?`import styled from '@emotion/styled';

const Container = styled.div\`\`;

const ${t} = () => {
	return <Container>${t}</Container>;
}
export default ${t};`:`const ${t} = () => {
return <div>${t}</div>;
}
export default ${t};`}function d(t){let o=c+"/"+t;e.workspace.fs.createDirectory(e.Uri.parse(o));let n=Buffer.from(`import {View, Text} from "react-native";
import styles from "./${t}.styled";

export default function ${t}() {
	  return (
	<View style={styles.container}>
	  <Text style={styles.text}>${t}</Text>
	</View>
  );
}
`,"utf8");e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+".js"),n),e.workspace.fs.writeFile(e.Uri.parse(o+"/index.js"),Buffer.from(`export * from "./${t}";`,"utf8")),e.workspace.fs.writeFile(e.Uri.parse(o+"/"+t+".styled.js"),Buffer.from(`import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		fontSize: 20,
	},
});`,"utf8"))}module.exports={activate:m,deactivate:w};
