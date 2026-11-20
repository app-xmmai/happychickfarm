/* XMM AI · MCP servers. A tiny MCP client that runs fully in the browser (Streamable HTTP, JSON-RPC).
   - Sidebar button "MCP server" opens a manager: add Claude / OpenAI / any MCP server by URL.
   - Built-in "Browser tools" server (time, calculator, fetch page, open link, copy, download file, notify).
   - The AI calls tools by writing a ```mcp-call block; app.js runs it and feeds the result back. */
(function(){"use strict";
var KEY="xmm.mcp",ID=0,MAX_OUT=6000;
var $=function(s,r){return(r||document).querySelector(s)};
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function load(){try{var a=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(a))return a}catch(e){}return[{id:"builtin",name:"Browser",builtin:1,on:true}]}
var S=load();if(!S.some(function(s){return s.builtin}))S.unshift({id:"builtin",name:"Browser",builtin:1,on:true});
function save(){try{localStorage.setItem(KEY,JSON.stringify(S.map(function(s){var o={};for(var k in s)if(k!=="sid"&&k!=="ver"&&k!=="err"&&k!=="busy")o[k]=s[k];return o})))}catch(e){}}
function toast(t){try{window.XMM_API&&XMM_API.toast(t)}catch(e){}}

/* ---------------- built-in browser tools ---------------- */
var BI=[
 {name:"get_time",description:"Current date, time and time zone of the user.",inputSchema:{type:"object",properties:{}},run:function(){var d=new Date();return d.toString()+" ("+(Intl.DateTimeFormat().resolvedOptions().timeZone||"")+")"}},
 {name:"calculate",description:"Evaluate a math expression, e.g. (12+3)*4/5 or 2^10 or 15%7.",inputSchema:{type:"object",properties:{expression:{type:"string"}},required:["expression"]},run:function(a){var x=String(a.expression||"").replace(/\^/g,"**");if(!/^[\d\s+\-*\/().%,eE]*$/.test(x))throw new Error("Only numbers and + - * / % ^ ( ) are allowed");return String(Function('"use strict";return ('+x+')')())}},
 {name:"fetch_url",description:"Download a web page or text file and return its readable text.",inputSchema:{type:"object",properties:{url:{type:"string"}},required:["url"]},run:async function(a,sig){var u=String(a.url||"");if(!/^https?:\/\//i.test(u))throw new Error("URL must start with http:// or https://");var t;try{var r=await fetch(u,{signal:sig});t=await r.text()}catch(e){if(e&&e.name==="AbortError")throw e;var r2=await fetch("https://r.jina.ai/"+u,{signal:sig});t=await r2.text()}return t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}},
 {name:"open_url",description:"Open a link in a new browser tab.",inputSchema:{type:"object",properties:{url:{type:"string"}},required:["url"]},run:function(a){var u=String(a.url||"");if(!/^https?:\/\//i.test(u))throw new Error("URL must start with http:// or https://");var w=window.open(u,"_blank","noopener");return w?"Opened "+u:"The browser blocked the pop-up. Tell the user to allow pop-ups, or give them the link."}},
 {name:"copy_to_clipboard",description:"Copy text to the user's clipboard.",inputSchema:{type:"object",properties:{text:{type:"string"}},required:["text"]},run:async function(a){await navigator.clipboard.writeText(String(a.text||""));return "Copied to clipboard."}},
 {name:"download_file",description:"Create a file and download it on the user's device.",inputSchema:{type:"object",properties:{filename:{type:"string"},content:{type:"string"}},required:["filename","content"]},run:function(a){var n=String(a.filename||"file.txt").replace(/[\\\/:*?"<>|]/g,"_").slice(0,80);var b=new Blob([String(a.content||"")],{type:"text/plain"});var l=document.createElement("a");l.href=URL.createObjectURL(b);l.download=n;document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(l.href);l.remove()},1500);return "Downloaded "+n}},
 {name:"notify",description:"Show a short message to the user on screen.",inputSchema:{type:"object",properties:{message:{type:"string"}},required:["message"]},run:function(a){toast(String(a.message||"").slice(0,200));return "Shown."}}
];

/* ---------------- MCP over HTTP ---------------- */
async function rpc(s,method,params,note,sig){
 var body={jsonrpc:"2.0",method:method};if(params)body.params=params;if(!note)body.id=++ID;
 var h={"Content-Type":"application/json","Accept":"application/json, text/event-stream"};
 if(s.token)h.Authorization=/^bearer\s/i.test(s.token)?s.token:"Bearer "+s.token;
 if(s.sid)h["Mcp-Session-Id"]=s.sid;if(s.ver)h["MCP-Protocol-Version"]=s.ver;
 var r;try{r=await fetch(s.url,{method:"POST",headers:h,body:JSON.stringify(body),signal:sig})}
 catch(e){if(e&&e.name==="AbortError")throw e;throw new Error("Could not reach the server. It must be online, use https and allow browser (CORS) requests.")}
 try{var sid=r.headers.get("Mcp-Session-Id");if(sid)s.sid=sid}catch(e){}
 if(note)return null;
 if(r.status===401||r.status===403)throw new Error("The server refused access ("+r.status+"). Check the token.");
 if(!r.ok)throw new Error("Server answered HTTP "+r.status);
 var ct=r.headers.get("Content-Type")||"",txt=await r.text(),msg=null;
 if(/event-stream/i.test(ct)){txt.split(/\r?\n/).forEach(function(l){if(l.indexOf("data:")!==0)return;try{var j=JSON.parse(l.slice(5).trim());if(j&&j.id===body.id)msg=j}catch(e){}})}
 else{try{msg=JSON.parse(txt)}catch(e){throw new Error("The server did not answer with MCP JSON.")}if(Array.isArray(msg))msg=msg.filter(function(m){return m.id===body.id})[0]}
 if(!msg)throw new Error("No MCP answer received.");
 if(msg.error)throw new Error(msg.error.message||"MCP error");
 return msg.result}
async function connect(s,sig){
 s.sid=null;s.ver=null;
 var init=await rpc(s,"initialize",{protocolVersion:"2025-03-26",capabilities:{},clientInfo:{name:"XMM AI",version:"1.0"}},false,sig);
 s.ver=(init&&init.protocolVersion)||"2025-03-26";
 try{await rpc(s,"notifications/initialized",null,true,sig)}catch(e){}
 var tools=[],cur=null,n=0;
 do{var r=await rpc(s,"tools/list",cur?{cursor:cur}:{},false,sig);tools=tools.concat(r.tools||[]);cur=r.nextCursor;n++}while(cur&&n<4);
 s.tools=tools.map(function(t){return{name:t.name,description:t.description||"",inputSchema:t.inputSchema||{type:"object",properties:{}}}});
 s.err="";return s.tools}
async function refresh(s){s.busy=1;s.err="";draw();try{await connect(s)}catch(e){s.err=e.message||String(e);s.tools=s.tools||[]}s.busy=0;save();draw()}

/* ---------------- what the AI sees ---------------- */
function active(){return S.some(function(s){return s.on&&toolsOf(s).length})}
function toolsOf(s){return s.builtin?BI:(s.tools||[])}
function findServer(n){n=String(n||"").toLowerCase();return S.filter(function(s){return s.on&&s.name.toLowerCase()===n})[0]||S.filter(function(s){return s.on&&toolsOf(s).some(function(t){return t.name===n})})[0]}
function sig(t){var p=(t.inputSchema&&t.inputSchema.properties)||{},req=(t.inputSchema&&t.inputSchema.required)||[];return Object.keys(p).slice(0,8).map(function(k){return k+(req.indexOf(k)<0?"?":"")+":"+(p[k].type||"any")}).join(", ")}
function hint(){
 var L=[];S.forEach(function(s){if(!s.on)return;toolsOf(s).slice(0,40).forEach(function(t){L.push("- "+s.name+" › "+t.name+"("+sig(t)+")"+(t.description?": "+String(t.description).replace(/\s+/g," ").slice(0,110):""))})});
 if(!L.length)return"";
 return "\n\nTOOLS (MCP): You can take real actions in the user's browser with these tools:\n"+L.slice(0,70).join("\n")+
 "\nTo use a tool, reply with ONLY one fenced block and nothing else:\n```mcp-call\n{\"server\":\"<server name>\",\"tool\":\"<tool name>\",\"args\":{...}}\n```\nThe result will be sent back to you; then answer the user. Use a tool only when it really helps; never invent tool results; never claim to have done something a tool did not confirm."}
function parse(t){t=String(t||"");var m=t.match(/```mcp-call\s*([\s\S]*?)```/)||t.match(/```mcp-call\s*([\s\S]*)$/);if(!m)return null;
 try{var j=JSON.parse(m[1].trim());if(j&&j.tool){var s=findServer(j.server||j.tool);return{server:(s&&s.name)||String(j.server||""),tool:String(j.tool),args:j.args&&typeof j.args==="object"?j.args:{},_s:s}}}catch(e){}return null}
function strip(t){return String(t||"").replace(/```mcp-call[\s\S]*?(```|$)/g,"").trim()}
function raw(c){return "```mcp-call\n"+JSON.stringify({server:c.server,tool:c.tool,args:c.args})+"\n```"}
async function run(c,sg){
 var s=c._s||findServer(c.server);if(!s)return "Error: no enabled server named \""+c.server+"\".";
 try{
  var out;
  if(s.builtin){var t=BI.filter(function(x){return x.name===c.tool})[0];if(!t)return "Error: unknown tool \""+c.tool+"\".";out=await t.run(c.args,sg)}
  else{
   var res;try{res=await rpc(s,"tools/call",{name:c.tool,arguments:c.args},false,sg)}catch(e){if(e&&e.name==="AbortError")throw e;await connect(s,sg);res=await rpc(s,"tools/call",{name:c.tool,arguments:c.args},false,sg)}
   var parts=(res&&res.content||[]).map(function(p){return p.type==="text"?p.text:(p.type==="resource"&&p.resource&&p.resource.text)||"["+p.type+"]"});
   out=parts.join("\n")||JSON.stringify(res&&res.structuredContent||res||{});
   if(res&&res.isError)out="Tool error: "+out}
  out=String(out);if(out.length>MAX_OUT)out=out.slice(0,MAX_OUT)+"\n…[cut]";return out
 }catch(e){if(e&&e.name==="AbortError")throw e;return "Error: "+(e.message||e)}}

/* ---------------- UI ---------------- */
var CSS=".xmcp-m{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:16px}.xmcp-m[hidden]{display:none}"+
".xmcp-c{width:min(560px,100%);max-height:88vh;overflow:auto;background:#141416;color:#ececf0;border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:18px 18px 20px;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}"+
".xmcp-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}.xmcp-h h3{margin:0;font-size:18px}.xmcp-x{border:0;background:rgba(255,255,255,.08);color:#fff;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer}"+
".xmcp-p{color:#9a9aa6;margin:4px 0 12px;font-size:13px}.xmcp-r{display:flex;gap:10px;align-items:center;padding:10px 12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;margin:8px 0;background:rgba(255,255,255,.03)}.xmcp-r .i{flex:1;min-width:0}.xmcp-r b{display:block;font-size:14px}.xmcp-r small{display:block;color:#9a9aa6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.xmcp-r small.e{color:#ff8a8a;white-space:normal}"+
".xmcp-b{border:0;border-radius:10px;padding:7px 11px;background:rgba(255,255,255,.1);color:#fff;font-size:13px;cursor:pointer}.xmcp-b.p{background:#fff;color:#000;font-weight:600}.xmcp-b.d{color:#ff8a8a}"+
".xmcp-t{position:relative;width:42px;height:24px;border-radius:99px;background:rgba(255,255,255,.18);border:0;cursor:pointer;flex:none}.xmcp-t:after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s}.xmcp-t.on{background:#34c759}.xmcp-t.on:after{transform:translateX(18px)}"+
".xmcp-f{display:grid;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.1)}.xmcp-f input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:#0c0c0e;color:#fff;font-size:14px}.xmcp-chips{display:flex;gap:6px;flex-wrap:wrap}.xmcp-chips button{border:1px solid rgba(255,255,255,.16);background:transparent;color:#ddd;border-radius:99px;padding:4px 11px;font-size:12px;cursor:pointer}"+
".xmcp-btn{cursor:pointer}";
function ensureStyle(){if(document.getElementById("xmcpCss"))return;var s=document.createElement("style");s.id="xmcpCss";s.textContent=CSS;document.head.appendChild(s)}
var ICON='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0V8zM12 17v4"/></svg>';
function modal(){var m=document.getElementById("xmcpM");if(m)return m;ensureStyle();m=document.createElement("div");m.id="xmcpM";m.className="xmcp-m";m.hidden=true;
 m.innerHTML='<div class="xmcp-c" role="dialog" aria-modal="true" aria-label="MCP servers"><div class="xmcp-h"><h3>MCP servers</h3><button class="xmcp-x" type="button" data-x aria-label="Close">×</button></div>'+
 '<p class="xmcp-p">Connect MCP servers so the AI can use their tools. Everything runs in your browser, nothing goes through our servers. Servers must be online (https) and allow browser requests (CORS).</p><div id="xmcpL"></div>'+
 '<form class="xmcp-f" id="xmcpF" autocomplete="off"><div class="xmcp-chips"><span class="xmcp-p" style="margin:0;align-self:center">Quick name:</span><button type="button" data-n="Claude">Claude</button><button type="button" data-n="OpenAI">OpenAI</button></div>'+
 '<input id="xmcpN" placeholder="Name (e.g. Claude)" maxlength="30"><input id="xmcpU" placeholder="MCP server URL (https://…/mcp)" inputmode="url" autocapitalize="off" spellcheck="false"><input id="xmcpT" type="password" placeholder="Token / API key (optional)" autocomplete="off"><button class="xmcp-b p" type="submit" id="xmcpA">Add server</button><div class="xmcp-p" id="xmcpS" style="margin:0"></div></form></div>';
 document.body.appendChild(m);
 m.addEventListener("click",function(e){var t=e.target;if(t===m||t.closest("[data-x]")){m.hidden=true;return}
  var c=t.closest("[data-n]");if(c){$("#xmcpN").value=c.dataset.n;$("#xmcpU").focus();return}
  var b=t.closest("[data-a]");if(!b)return;var s=S.filter(function(x){return x.id===b.dataset.i})[0];if(!s)return;
  if(b.dataset.a==="tog"){s.on=!s.on;save();draw()}else if(b.dataset.a==="del"){S=S.filter(function(x){return x!==s});save();draw()}else if(b.dataset.a==="ref")refresh(s)});
 $("#xmcpF").addEventListener("submit",async function(e){e.preventDefault();var n=$("#xmcpN").value.trim(),u=$("#xmcpU").value.trim(),t=$("#xmcpT").value.trim(),st=$("#xmcpS");
  if(!n||!/^https?:\/\//i.test(u)){st.textContent="Enter a name and a URL that starts with https://";return}
  if(S.some(function(x){return x.name.toLowerCase()===n.toLowerCase()})){st.textContent="A server with that name already exists.";return}
  var s={id:"s"+Date.now().toString(36),name:n,url:u,token:t,on:true,tools:[]};st.textContent="Connecting…";$("#xmcpA").disabled=true;
  try{await connect(s);S.push(s);save();$("#xmcpN").value=$("#xmcpU").value=$("#xmcpT").value="";st.textContent="Connected · "+s.tools.length+" tools";draw()}
  catch(er){st.textContent="Not added: "+(er.message||er)}
  $("#xmcpA").disabled=false});
 return m}
function draw(){var L=document.getElementById("xmcpL");if(!L)return;
 L.innerHTML=S.map(function(s){var n=toolsOf(s).length;
  return'<div class="xmcp-r"><div class="i"><b>'+esc(s.name)+(s.builtin?" · built in":"")+'</b>'+(s.err?'<small class="e">'+esc(s.err)+'</small>':'<small>'+(s.busy?"Connecting…":n+" tool"+(n===1?"":"s")+(s.url?" · "+esc(s.url):" · runs in this browser"))+'</small>')+'</div>'+
  (s.builtin?"":'<button class="xmcp-b" type="button" data-a="ref" data-i="'+s.id+'">Refresh</button><button class="xmcp-b d" type="button" data-a="del" data-i="'+s.id+'">Remove</button>')+
  '<button class="xmcp-t'+(s.on?" on":"")+'" type="button" data-a="tog" data-i="'+s.id+'" aria-label="Toggle"></button></div>'}).join("")}
function open(){var m=modal();draw();m.hidden=false;
 S.forEach(function(s){if(!s.builtin&&s.on&&(!s.tools||!s.tools.length)&&!s.busy)refresh(s)})}

/* ---------------- sidebar buttons (every sidebar layout) ---------------- */
function mk(tag,cls,inner){var b=document.createElement(tag);b.type="button";b.className=cls+" xmcp-btn";b.innerHTML=inner;b.setAttribute("data-xmcp","1");return b}
function inject(){
 var ds=$("#clDrawer #clDs");if(ds&&!$(".xmcp-btn",ds)){var b=mk("button","cl-nr",ICON+"<span>MCP server</span>");b.style.setProperty("--i","5");ds.insertBefore(b,ds.querySelector(".cl-rl")||ds.firstChild)}
 var xs=document.querySelectorAll("#sideChat .xs-r");if(xs.length&&!$("#sideChat .xmcp-btn")){var last=xs[xs.length-1],b2=mk("button","xs-r",ICON+"<span>MCP server</span>");last.parentNode.insertBefore(b2,last.nextSibling)}
 var nv=$("#sideChat .xnav");if(nv&&!$(".xmcp-btn",nv))nv.appendChild(mk("button","",ICON+"<span>MCP server</span>"));
 var s2=$("#sideChat .sidenav2");if(s2&&!$(".xmcp-btn",s2))s2.appendChild(mk("button","",ICON+"MCP server"))}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xmcp]");if(!b)return;e.preventDefault();e.stopPropagation();
 try{document.body.classList.remove("cl-drawer");var sc=$("#scrim");if($("#sideChat.open")&&sc)sc.click()}catch(x){}open()},true);
var T=0;function sched(){if(T)return;T=setTimeout(function(){T=0;try{inject()}catch(e){}},120)}
function boot(){ensureStyle();inject();new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});setInterval(inject,2500)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();

window.XMM_MCP={active:active,hint:hint,parse:parse,strip:strip,raw:raw,run:run,open:open};
})();
