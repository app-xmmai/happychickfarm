/* Create bar above the chat input: Chat | Image | Video. Video = keyless community generator (Hugging Face Space), 1 per 5 min, short clips. */
(function(){
var $=function(s){return document.querySelector(s)};
function C(){return(window.XMM_API&&window.XMM_API.CFG)||{}}
var DEF=[{name:"LTX Video",type:"gradio",base:"https://lightricks-ltx-video-distilled.hf.space",fn:"generate",fps:24,maxFrames:121,maxSec:5,w:704,h:512,
 data:["{prompt}","worst quality, inconsistent motion, blurry, jittery, distorted",null,null,"{h}","{w}",8,"{frames}","{seed}",true,1,true]}];
function PV(){return C().VIDEO_AI&&C().VIDEO_AI.length?C().VIDEO_AI:DEF}
function CD(){return C().VIDEO_COOLDOWN_MS||300000}
function MAXS(){return Math.min(7,Math.max.apply(null,PV().map(function(p){return p.maxSec||5})))}
var LK="xmm.vidlast",RK="xmm.vidres",mode="chat",sec=5,res={},JOBS={};
try{res=JSON.parse(localStorage.getItem(RK)||"{}")}catch(e){res={}}
function saveRes(){try{var k=Object.keys(res);if(k.length>25)k.slice(0,k.length-25).forEach(function(x){delete res[x]});localStorage.setItem(RK,JSON.stringify(res))}catch(e){}}
function last(){try{return+localStorage.getItem(LK)||0}catch(e){return 0}}
function stamp(v){try{if(v)localStorage.setItem(LK,String(v));else localStorage.removeItem(LK)}catch(e){}}
function left(){return Math.max(0,last()+CD()-Date.now())}
function fmt(ms){var s=Math.ceil(ms/1000);return Math.floor(s/60)+":"+("0"+(s%60)).slice(-2)}
function toast(t){try{(window.XMM_API&&XMM_API.toast||window.toast)(t)}catch(e){}}
var dock=$(".dock"),msg=$("#msg");if(!dock||!msg)return;
var bar=document.createElement("div");bar.className="gm";
function lens(){var m=MAXS(),a=[3,5,7].filter(function(x){return x<=m});if(a.indexOf(sec)<0)sec=a[a.length-1];return a}
function paint(){var a=lens();bar.querySelector(".gm-len").innerHTML="<span>Length</span>"+a.map(function(x){return'<button type="button" data-s="'+x+'"'+(x===sec?' class="on"':"")+'>'+x+'s</button>'}).join("")}
bar.hidden=true;bar.innerHTML='<div class="gm-seg"><button type="button" data-m="image" class="on">Image</button><button type="button" data-m="video">Video<i class="gm-cd"></i></button></div><div class="gm-len" hidden></div>';
dock.insertBefore(bar,dock.firstChild);paint();
var PH=msg.getAttribute("placeholder")||"Ask Anything";
function setMode(m){mode=m;window.XMM_GENMODE=m;document.body.setAttribute("data-genmode",m);[].forEach.call(bar.querySelectorAll("[data-m]"),function(b){b.classList.toggle("on",b.dataset.m===m)});
 bar.querySelector(".gm-len").hidden=m!=="video";msg.setAttribute("placeholder",m==="image"?"Describe an image…":m==="video"?"Describe a video (up to "+sec+" seconds)…":PH)}
bar.onclick=function(e){var b=e.target.closest&&e.target.closest("button");if(!b)return;if(b.dataset.m){setMode(b.dataset.m);try{msg.focus()}catch(x){}}else if(b.dataset.s){sec=+b.dataset.s;paint();setMode(mode)}};
setInterval(function(){var i=bar.querySelector(".gm-cd"),l=left();if(i)i.textContent=l>0?" · "+fmt(l):""},1000);
/* start a video: adds the messages, the box then makes the clip */
function start(text){var l=left();if(l>0){toast("Video limit: 1 video every 5 minutes. Wait "+fmt(l));return false}
 var A=window.XMM_API;if(!A)return false;var c=A.cur&&A.cur();if(!c){A.newChat&&A.newChat();c=A.cur&&A.cur()}if(!c)return false;
 var cfg={id:"v"+Date.now().toString(36),prompt:String(text).slice(0,300),sec:sec,t:Date.now()};
 c.msgs.push({role:"user",text:text,full:text,atts:[],imgs:[]});c.msgs.push({role:"assistant",text:"```xmm-video\n"+JSON.stringify(cfg)+"\n```"});
 stamp(Date.now());A.saveChats&&A.saveChats();A.renderMsgs&&A.renderMsgs();A.renderList&&A.renderList();return true}
/* ---- generator (Gradio queue API of a Hugging Face Space) ---- */
function rnd(){return Math.floor(Math.random()*1e9)}
function pick(o){if(!o)return null;if(typeof o==="string")return /^https?:|^\/|\.mp4|\.webm/.test(o)?o:null;if(Array.isArray(o)){for(var i=0;i<o.length;i++){var r=pick(o[i]);if(r)return r}return null}
 if(o.video)return pick(o.video);return o.url||o.path||null}
function abs(p,u){if(!u)return null;if(/^https?:/.test(u))return u;if(/^\/gradio_api\/|^\/file=/.test(u))return p.base+u;return p.base+"/gradio_api/file="+u.replace(/^\//,"")}
async function plan(p,prompt,s,nf,signal){var r=await fetch(p.base+"/gradio_api/info",{signal:signal});if(!r.ok)throw new Error("HTTP "+r.status);var info=await r.json(),ne=info.named_endpoints||{},key=null;
 if(p.fn&&ne["/"+p.fn])key="/"+p.fn;else{var ks=Object.keys(ne);for(var i=0;i<ks.length&&!key;i++){var e=ne[ks[i]],txt=(e.parameters||[]).some(function(q){return /prompt|text/i.test((q.parameter_name||"")+(q.label||""))}),vid=JSON.stringify(e.returns||[]).toLowerCase().indexOf("video")>=0;if(txt&&vid)key=ks[i]}}
 if(!key)throw new Error("No video endpoint");
 var data=(ne[key].parameters||[]).map(function(q){var n=((q.parameter_name||"")+" "+(q.label||"")).toLowerCase(),d=q.parameter_has_default?q.parameter_default:null;
  if(/negative/.test(n))return d!=null?d:"worst quality, blurry, jittery, distorted";if(/prompt/.test(n))return prompt;if(/width/.test(n))return p.w||704;if(/height/.test(n))return p.h||512;if(/frame/.test(n))return nf;if(/seed/.test(n)&&!/random/.test(n))return rnd();if(/random/.test(n))return true;if(/duration|second|length/.test(n))return s;
  if(d==null&&/^(textbox|string|str)$/i.test(String(q.python_type&&q.python_type.type||q.type&&q.type.type||"")))return prompt;return d});
 return{fn:key.replace(/^\//,""),data:data}}
async function call(p,fn,data,st,signal){var r=await fetch(p.base+"/gradio_api/call/"+fn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:data}),signal:signal});if(!r.ok)throw new Error("HTTP "+r.status);
 var id=(await r.json()).event_id;if(!id)throw new Error("No job id");st("In the queue…");
 var rr=await fetch(p.base+"/gradio_api/call/"+fn+"/"+id,{signal:signal});if(!rr.ok||!rr.body)throw new Error("HTTP "+rr.status);
 var rd=rr.body.getReader(),dec=new TextDecoder(),buf="";
 for(;;){var x=await rd.read();if(x.done)break;buf+=dec.decode(x.value,{stream:true}).replace(/\r\n/g,"\n");var parts=buf.split("\n\n");buf=parts.pop();
  for(var i=0;i<parts.length;i++){var m1=parts[i].match(/event: *(\w+)/),m2=parts[i].match(/data: *([\s\S]*)/),e=m1&&m1[1],d=m2&&m2[1];
   if(e==="generating"||e==="heartbeat")st("Making the video…");
   if(e==="error")throw new Error(d&&d!=="null"?String(d).slice(0,140):"The server is busy or out of free quota");
   if(e==="complete"){var u=abs(p,pick(JSON.parse(d)));if(u)return u;throw new Error("No video came back")}}}
 throw new Error("The server closed the connection")}
async function viaGradio(p,prompt,s,st){var fps=p.fps||24,nf=Math.min(p.maxFrames||121,Math.max(9,Math.round(s*fps/8)*8+1));
 var ac=new AbortController(),to=setTimeout(function(){ac.abort()},360000),err;
 try{try{var pl=await plan(p,prompt,s,nf,ac.signal);return await call(p,pl.fn,pl.data,st,ac.signal)}catch(e){err=e;if(ac.signal.aborted)throw e}
  if(p.data&&p.fn){var data=p.data.map(function(x){if(x==="{frames}")return nf;if(x==="{w}")return p.w||704;if(x==="{h}")return p.h||512;if(x==="{seed}")return rnd();return typeof x==="string"?x.replace("{prompt}",prompt):x});return await call(p,p.fn,data,st,ac.signal)}
  throw err}
 finally{clearTimeout(to)}}
async function gen(prompt,s,st){var P=PV(),err;for(var i=0;i<P.length;i++){try{st("Starting "+P[i].name+"…");return await viaGradio(P[i],prompt,Math.min(s,P[i].maxSec||5),st)}catch(e){err=e}}throw err||new Error("No video server")}
/* ---- boxes ---- */
function setAll(id,fn){(JOBS[id]||[]).forEach(function(b){if(b.isConnected)fn(b)})}
/* ---- the XMM tag: the AI icon looks around, then a box pops out of its head saying xmm-ai.com. Same drawing for live playback and for the saved file. ---- */
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function sm(a,b,t){t=Math.max(0,Math.min(1,(t-a)/(b-a)));return t*t*(3-2*t)}
var LOOK=[[0,0,0],[.45,1,0],[.95,-1,0],[1.45,-1,-.7],[1.95,1,.6],[2.35,0,0],[3.4,0,0],[3.9,.8,-.3],[4.5,-.8,.3],[5.1,0,0],[6,0,0]];
function look(p){for(var i=1;i<LOOK.length;i++){if(p<=LOOK[i][0]){var a=LOOK[i-1],b=LOOK[i],k=sm(a[0],b[0],p);return[a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k]}}return[0,0]}
function drawTag(c,W,H,t){var u=Math.max(36,Math.min(W,H)*.14),x0=u*.35,y0=H-u*.35-u*.86,p=t%6,L=look(p);c.save();
 /* head */
 c.shadowColor="rgba(0,0,0,.45)";c.shadowBlur=u*.18;c.shadowOffsetY=u*.04;var g=c.createLinearGradient(x0,y0,x0+u,y0+u*.86);g.addColorStop(0,"#8b6cff");g.addColorStop(1,"#0a84ff");c.fillStyle=g;rr(c,x0,y0,u,u*.86,u*.3);c.fill();
 c.shadowColor="transparent";rr(c,x0-u*.07,y0+u*.3,u*.09,u*.26,u*.04);c.fill();rr(c,x0+u*.98,y0+u*.3,u*.09,u*.26,u*.04);c.fill();
 c.fillStyle="#0b0f1f";rr(c,x0+u*.1,y0+u*.13,u*.8,u*.6,u*.22);c.fill();
 /* eyes: white with pupils that look around, and a blink */
 var bl=(p%3.1)<.14?Math.max(.12,1-Math.sin((p%3.1)/.14*Math.PI)):1,ey=y0+u*.43;
 [x0+u*.32,x0+u*.68].forEach(function(ex){c.fillStyle="#fff";c.beginPath();c.ellipse(ex,ey,u*.115,u*.115*bl,0,0,7);c.fill();
  c.fillStyle="#0b0f1f";c.beginPath();c.ellipse(ex+L[0]*u*.05,ey+L[1]*u*.05*bl,u*.058,u*.058*bl,0,0,7);c.fill()});
 /* box that comes out of the head */
 var k=sm(2.5,3,p)-sm(5.1,5.6,p);if(k>.01){var f=u*.27;c.font="700 "+f+"px -apple-system,system-ui,'Segoe UI',Roboto,sans-serif";var tw=c.measureText("xmm-ai.com").width,bw=tw+f*1.2,bh=f*1.9,ax=x0+u*.5,ay=y0+u*.02,bx=x0,by=ay-bh-u*.2;
  c.translate(ax,ay);c.scale(k,k);c.translate(-ax,-ay);c.globalAlpha=Math.min(1,k*1.4);c.shadowColor="rgba(0,0,0,.5)";c.shadowBlur=u*.15;
  c.fillStyle="rgba(11,15,31,.9)";rr(c,bx,by,bw,bh,bh*.3);c.fill();c.beginPath();c.moveTo(ax-f*.28,by+bh-1);c.lineTo(ax+f*.28,by+bh-1);c.lineTo(ax,ay);c.closePath();c.fill();
  c.shadowColor="transparent";c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=Math.max(1,u*.02);rr(c,bx,by,bw,bh,bh*.3);c.stroke();
  c.fillStyle="#fff";c.textBaseline="middle";c.fillText("xmm-ai.com",bx+f*.6,by+bh/2+f*.04)}
 c.restore()}
function fit(cv){var r=cv.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1),w=Math.round(r.width*d),h=Math.round(r.height*d);if(w&&(cv.width!==w||cv.height!==h)){cv.width=w;cv.height=h}}
function loop(cv){if(!cv.isConnected)return;fit(cv);var c=cv.getContext("2d");c.clearRect(0,0,cv.width,cv.height);drawTag(c,cv.width,cv.height,performance.now()/1000);requestAnimationFrame(function(){loop(cv)})}
function show(b,url){var u=url.replace(/"/g,"%22");b.classList.add("done");b.innerHTML='<video src="'+u+'" controls controlslist="nodownload nofullscreen noremoteplayback" disablepictureinpicture autoplay loop muted playsinline preload="auto"></video><canvas class="xv-tag"></canvas><div class="xv-acts"><button type="button" data-xv="save">Save</button><button type="button" data-xv="fs" aria-label="Full screen">⛶</button></div>';b.setAttribute("data-url",url);var v=b.querySelector("video");try{v.muted=true;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}catch(e){}loop(b.querySelector(".xv-tag"))}
/* save = record the clip again with the tag drawn into every frame */
async function bake(url){var r=await fetch(url);if(!r.ok)throw new Error("Could not download the video");var obj=URL.createObjectURL(await r.blob());
 if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)throw new Error("This browser cannot save the video with the XMM tag");
 var v=document.createElement("video");v.muted=true;v.playsInline=true;v.src=obj;await new Promise(function(ok,no){v.onloadedmetadata=ok;v.onerror=function(){no(new Error("Could not read the video"))}});
 var W=v.videoWidth||704,H=v.videoHeight||512,cv=document.createElement("canvas");cv.width=W;cv.height=H;var cx=cv.getContext("2d");
 var mt=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"].filter(function(m){return MediaRecorder.isTypeSupported(m)})[0],ch=[];
 var rec=new MediaRecorder(cv.captureStream(30),mt?{mimeType:mt,videoBitsPerSecond:6e6}:{});rec.ondataavailable=function(e){if(e.data&&e.data.size)ch.push(e.data)};
 var done=new Promise(function(ok){rec.onstop=ok}),t0=performance.now();
 function fr(){cx.drawImage(v,0,0,W,H);drawTag(cx,W,H,(performance.now()-t0)/1000);if(!v.ended)requestAnimationFrame(fr)}
 v.onended=function(){setTimeout(function(){try{rec.stop()}catch(e){}},200)};rec.start();await v.play();fr();await done;URL.revokeObjectURL(obj);
 var out=new Blob(ch,{type:rec.mimeType||mt||"video/webm"}),a=document.createElement("a");a.href=URL.createObjectURL(out);a.download="xmm-ai-video."+(/mp4/.test(out.type)?"mp4":"webm");document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500)}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-xv]");if(!t)return;var b=t.closest(".xv");if(!b)return;
 if(t.dataset.xv==="fs"){var f=b.requestFullscreen||b.webkitRequestFullscreen;if(f)f.call(b);else toast("Full screen is not supported here");return}
 if(t.dataset.xv==="save"){if(t.disabled)return;t.disabled=true;var o=t.textContent;t.textContent="Saving…";toast("Adding the XMM tag, about "+(+b.dataset.sec||5)+" seconds…");
  bake(b.getAttribute("data-url")).then(function(){toast("Saved")}).catch(function(x){toast(String(x&&x.message||x).slice(0,90))}).then(function(){t.disabled=false;t.textContent=o})}});
function fail(b,t){b.classList.remove("done");b.classList.add("bad");b.innerHTML='<div class="xv-load"><b>'+(t||"Couldn’t make the video")+'</b><small>No server responded. Try again later.</small></div>'}
function ecode(e){var m=String(e&&e.message||e),n=m.match(/HTTP (\d{3})/);if(n)return n[1];if(e&&e.name==="AbortError")return 408;if(/quota|busy|queue|limit/i.test(m))return 429;if(/No video/i.test(m))return 502;if(/fetch|network|closed|load failed/i.test(m))return 503;return 500}
async function run(id,prompt,s){var p=prompt;
 try{if(window.XMM_EN)p=await window.XMM_EN(p)||p}catch(e){}try{if(window.XMM_SAFE)p=await window.XMM_SAFE(p)||p}catch(e){}
 try{var u=await gen(p,s,function(t){setAll(id,function(b){var sm=b.querySelector(".dotslbl,.xv-load small");if(sm)sm.textContent=t})});res[id]=u;saveRes();setAll(id,function(b){show(b,u)})}
 catch(e){var m="Error "+ecode(e);stamp(0);setAll(id,function(b){fail(b,m)})}
 delete JOBS[id]}
function hyd(){[].forEach.call(document.querySelectorAll(".xv:not([data-s])"),function(b){b.setAttribute("data-s","1");var id=b.dataset.id;
 if(res[id]){show(b,res[id]);return}
 if(JOBS[id]){JOBS[id].push(b);return}
 if(Date.now()-(+b.dataset.t||0)>15*60000){fail(b,"This video is no longer available");return}
 JOBS[id]=[b];run(id,b.dataset.p||"",+b.dataset.sec||5)})}
var tm=0;new MutationObserver(function(){if(tm)return;tm=setTimeout(function(){tm=0;hyd()},120)}).observe(document.body,{childList:true,subtree:true});hyd();
function imagine(on){bar.hidden=!on;document.body.classList.toggle("imagine-on",!!on);setMode(on?"image":"chat")}
window.XMM_IMAGINE=function(){try{var A=window.XMM_API;A&&A.newChat&&A.newChat()}catch(e){}try{document.body.classList.remove("cl-drawer","drawer","side-open")}catch(e){}imagine(true);setTimeout(function(){try{msg.focus()}catch(e){}},80)};
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest('#clNc,.xfab,[data-act="newchat"],#chatNav [data-k="newchat"],.xnav [data-ch]');if(t&&!t.closest("#clDrawer .cl-ds"))imagine(false)},true);
window.XMM_VIDEO={start:start,left:left,setMode:setMode,imagine:imagine,setSec:function(n){sec=+n;paint()},lens:lens,fmt:fmt};
})();
