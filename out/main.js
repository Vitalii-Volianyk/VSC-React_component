var r=require("vscode"),w=require("fs"),$="";function S(t){let s=r.commands.registerCommand("react-component-structure.createComponent",function(i){r.workspace.fs.stat(i).then(({type:p})=>{p==2?($=i,r.window.showInputBox({placeHolder:"Component name"}).then(o=>{o!==void 0&&C(o)})):p==1&&($=r.Uri.parse(i).toString().split("/").slice(0,-1).join("/"),r.window.showInputBox({placeHolder:"Component name"}).then(u=>{u!==void 0&&C(u)}))})});t.subscriptions.push(s);let a=r.commands.registerCommand("react-component-structure.refactor",function(i){r.workspace.fs.stat(i).then(({type:p})=>{if(p==1){let o=i.fsPath,u=o.slice(-3);(u=="jsx"||u==".js")&&w.readFile(o,function(g,k){if(g){console.log(g);return}let n=k.toString();for(;n.search(/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim)>-1;)n=n.replace(/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim,"const $1 =($2)=> {$3}");let d=[];n=n.replace(/\s*this\.props\.(\w*)\(?.*\)?/gim,(l,e)=>(d.push(e),l));let v=d.length>0?`{${d.join(", ")}}`:"";n=n.replace(/class\s*(.*)\s*extends.*{([\s\S]*)}/gim,`const $1 =(${v})=> {$2}`),n=n.replace(/this\.props\./gim,"");let m={};n=n.replace(/\s*state\s*=\s*{((\s*.*,\s*)+\s*)}/gim,(l,e)=>(e=e.split(","),e=e.map(c=>c.trim()?c.split(":"):["",""]),e=e.map(c=>{let f=c[0].trim(),h=f.charAt(0).toUpperCase()+f.slice(1);return f?(m[f]="set"+h,`
const [${f}, set${h}] = useState(${c[1].trim()})`):""}),e[e.length-1]==""&&e.pop(),e.join("; "))),n=n.replace(/this\.setState\({(.*)}\)/gim,(l,e)=>(e=e.split(","),e=e.map(c=>c.split(":")),e=e.map(c=>{let f=c[0].trim();if(m[f])return`${m[f]}(${c[1].trim()})`}),e.join(`;
`))),n=n.replace(/this\./gim,""),w.writeFile(o,n,function(l){if(l)return console.error(l);console.log("Data written successfully!")})})}})});t.subscriptions.push(a)}function C(t){let s=t.split("."),a="",i="";t=s[0],s.length>1&&(a=s[1]);let p=r.workspace.getConfiguration().get("react_component.styles"),o=$+"/"+t;r.workspace.fs.createDirectory(r.Uri.parse(o)),a==="c"?i=j(t,p):a==="e"?i=x(t,"without"):i=x(t,p);let u=Buffer.from(i,"utf8");r.workspace.fs.writeFile(r.Uri.parse(o+"/"+t+"."+r.workspace.getConfiguration().get("react_component.extension")),u),p==="module"&&r.workspace.fs.writeFile(r.Uri.parse(o+"/"+t+".module.css"),Buffer.from("","utf8")),r.workspace.getConfiguration().get("react_component.reimport")&&a!=="e"&&r.workspace.fs.writeFile(r.Uri.parse(o+"/index."+r.workspace.getConfiguration().get("react_component.extension")),Buffer.from(`export { default } from './${t}';`,"utf8"))}function y(){}function j(t,s){return s==="module"?`import { Component } from 'react';
import css from './${t}.module.css'
class ${t} extends Component {
	render() {
		return <div>${t}</div>;
	}
}
export default ${t};`:s==="emotion"?`import { Component } from 'react';
import styled from '@emotion/styled'
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
export default ${t};`}function x(t,s){return s==="module"?`import css from './${t}.module.css'
const ${t} = () => {
	return <div>${t}</div>;
}
export default ${t};`:s==="emotion"?`import styled from '@emotion/styled'
const Container = styled.div\`\`;
const ${t} = () => {
	return <Container>${t}</Container>;
}
export default ${t};`:`const ${t} = () => {
return <div>${t}</div>;
}
export default ${t};`}module.exports={activate:S,deactivate:y};
