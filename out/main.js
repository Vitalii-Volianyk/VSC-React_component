var r=require("vscode"),g=require("fs"),h="";function S(s){let p=r.commands.registerCommand("react-component-structure.createComponent",function(o){r.workspace.fs.stat(o).then(({type:n})=>{n==2?(h=o,r.window.showInputBox({placeHolder:"Component name"}).then(c=>{c!==void 0&&x(c)})):n==1&&(h=r.Uri.parse(o).toString().split("/").slice(0,-1).join("/"),r.window.showInputBox({placeHolder:"Component name"}).then(l=>{l!==void 0&&x(l)}))})});s.subscriptions.push(p);let u=r.commands.registerCommand("react-component-structure.refactor",function(o){r.workspace.fs.stat(o).then(({type:n})=>{if(n==1){let c=o.fsPath,l=c.slice(-3);(l=="jsx"||l==".js")&&g.readFile(c,function(w,C){if(w){console.log(w);return}let e=C.toString();for(;e.search(/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim)>-1;)e=e.replace(/^\s*(\w*)\s*=\(?(.*)\)?=>\s*{([\s\S]*)}/gim,"const $1 =($2)=> {$3}");let m=[];e=e.replace(/\s*this\.props\.(\w*)\(?.*\)?/gim,(f,t)=>(m.push(t),f));let j=m.length>0?`{${m.join(", ")}}`:"";e=e.replace(/class\s*(.*)\s*extends.*{([\s\S]*)}/gim,`const $1 =(${j})=> {$2}`),e=e.replace(/this\.props\./gim,"");let d={};e=e.replace(/\s*state\s*=\s*{((\s*.*,\s*)+\s*)}/gim,(f,t)=>(t=t.split(","),t=t.map(i=>i.trim()?i.split(":"):["",""]),t=t.map(i=>{let a=i[0].trim(),$=a.charAt(0).toUpperCase()+a.slice(1);return a?(d[a]="set"+$,`
const [${a}, set${$}] = useState(${i[1].trim()})`):""}),t[t.length-1]==""&&t.pop(),t.join("; "))),e=e.replace(/this\.setState\({(.*)}\)/gim,(f,t)=>(t=t.split(","),t=t.map(i=>i.split(":")),t=t.map(i=>{let a=i[0].trim();if(d[a])return`${d[a]}(${i[1].trim()})`}),t.join(`;
`))),e=e.replace(/this\./gim,""),g.writeFile(c,e,function(f){if(f)return console.error(f);console.log("Data written successfully!")})})}})});s.subscriptions.push(u)}function x(s){let p=s.split("."),u="",o="";s=p[0],p.length>1&&(u=p[1]);let n=h+"/"+s;r.workspace.fs.createDirectory(r.Uri.parse(n)),u=="c"?o=`import { Component } from 'react';
import css from './${s}.module.css'

class ${s} extends Component {
  render() {
    return <div></div>;
  }
}

export default ${s};`:o=`import css from './${s}.module.css'

const ${s} = () => {
	return <div></div>;	
}

export default ${s};`;let c=Buffer.from(o,"utf8");r.workspace.fs.writeFile(r.Uri.parse(n+"/"+s+".jsx"),c),r.workspace.fs.writeFile(r.Uri.parse(n+"/"+s+".module.css"),Buffer.from("","utf8")),r.workspace.fs.writeFile(r.Uri.parse(n+"/index.jsx"),Buffer.from(`export { default } from './${s}';`,"utf8"))}function k(){}module.exports={activate:S,deactivate:k};
