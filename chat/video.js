/* Create bar above the chat input: Chat | Image | Video. Video = Agnes (agnes-video-2.5-flash) straight from the browser, 1 per minute. */
(function(){
var $=function(s){return document.querySelector(s)};
function C(){return(window.XMM_API&&window.XMM_API.CFG)||{}}
function PV(){return[{name:"Agnes",type:"worker",maxSec:7}]}
function CD(){return C().VIDEO_COOLDOWN_MS||60000}
function MAXS(){return Math.min(7,Math.max.apply(null,PV().map(function(p){return p.maxSec||5})))}
var LK="xmm.vidlast",RK="xmm.vidres",mode="chat",sec=5,res={},JOBS={};
try{res=JSON.parse(localStorage.getItem(RK)||"{}")}catch(e){res={}}
function saveRes(){try{var k=Object.keys(res);if(k.length>25)k.slice(0,k.length-25).forEach(function(x){delete res[x]});localStorage.setItem(RK,JSON.stringify(res))}catch(e){}}
function last(){try{return+localStorage.getItem(LK)||0}catch(e){return 0}}
function stamp(v){try{if(v)localStorage.setItem(LK,String(v));else localStorage.removeItem(LK)}catch(e){}}
function lockUntil(){try{return+localStorage.getItem("xmm.vidlock")||0}catch(e){return 0}}
function lock(ms){try{localStorage.setItem("xmm.vidlock",String(Date.now()+ms))}catch(e){}}
function left(){return Math.max(0,last()+CD()-Date.now(),lockUntil()-Date.now())}
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
function start(text){var l=left();if(l>0){toast("Please wait "+fmt(l)+" before the next video (1 per minute; 10 min after an Agnes rate-limit).");return false}
 var A=window.XMM_API;if(!A)return false;var c=A.cur&&A.cur();if(!c&&A.S){c={id:"c"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),title:String(text).slice(0,40)||"New video",msgs:[]};A.S.chats.unshift(c);A.S.cur=c.id}if(!c)return false;
 var cfg={id:"v"+Date.now().toString(36),prompt:String(text).slice(0,500),sec:sec,t:Date.now()};
 c.msgs.push({role:"user",text:text,full:text,atts:[],imgs:[]});c.msgs.push({role:"assistant",text:"```xmm-video\n"+JSON.stringify(cfg)+"\n```"});
 stamp(Date.now());A.saveChats&&A.saveChats();A.renderMsgs&&A.renderMsgs();A.renderList&&A.renderList();return true}
var JK="xmm.vidjobs";
function jobs(){try{return JSON.parse(localStorage.getItem(JK)||"{}")}catch(e){return{}}}
function setJob(id,v){var o=jobs(),n=Date.now();if(v)o[id]=v;else delete o[id];for(var k in o)if(n-(o[k].t||0)>864e5)delete o[k];try{localStorage.setItem(JK,JSON.stringify(o))}catch(e){}}
function hint(d){d=String(d||"");return /1015/.test(d)?"Agnes is rate-limiting this server (1015). Wait a few minutes, then try again.":d}
/* ONE request to Agnes per video, straight from the browser (no Cloudflare). A reload resumes the same job (or shows the same error). */
var AG="https://apihub.agnes-ai.com",AM="agnes-video-2.5-flash";
function agKey(){return String(C().AGNES_KEY||"").trim()}
function agId(j){if(!j)return null;var d=j.data&&typeof j.data==="object"?j.data:{};return j.video_id||j.id||j.task_id||d.video_id||d.id||d.task_id||null}
function agUrl(o,n){n=n||0;if(!o||n>5)return null;if(typeof o==="string")return /^https?:\/\//i.test(o)&&/(\.mp4|\.webm|\.mov|\/video)/i.test(o)?o:null;
 if(Array.isArray(o)){for(var i=0;i<o.length;i++){var u=agUrl(o[i],n+1);if(u)return u}return null}
 if(typeof o==="object"){var ks=["video_url","url","output","video","result","data","content"];for(var k=0;k<ks.length;k++)if(o[ks[k]]!=null){var u2=agUrl(o[ks[k]],n+1);if(u2)return u2}for(var key in o){var u3=agUrl(o[key],n+1);if(u3)return u3}}return null}
function agErr(t){var j=null;try{j=JSON.parse(t)}catch(e){}j=j||{};var m=(j.error&&(j.error.message||j.error))||j.message||j.detail||t||"";return String(m).slice(0,200)}
async function viaWorker(p,prompt,s,st,bid){var key=agKey();if(!key){var en=new Error("HTTP 500");en.detail="No Agnes key set (AGNES_KEY in config.js)";throw en}
 var jb=bid?jobs()[bid]:null;
 if(jb&&jb.fail){var ef=new Error("HTTP "+(jb.code||429));ef.detail=jb.fail;throw ef}
 var H={Authorization:"Bearer "+key};
 try{var wid=jb&&jb.wid;
  if(!wid){st("Starting…");
   var r=await fetch(AG+"/v1/videos",{method:"POST",headers:{Authorization:H.Authorization,"Content-Type":"application/json"},body:JSON.stringify({model:AM,mode:"text",n:1,prompt:String(prompt).slice(0,500),seconds:String(Math.min(12,Math.max(4,Math.round(+s||5)))),size:"720P",aspect_ratio:"16:9"})});
   if(!r.ok){var tx="";try{tx=await r.text()}catch(x){}var er=new Error("HTTP "+r.status);er.detail=hint(r.status===429||/1015/.test(tx)?"Agnes rate limit / quota reached "+agErr(tx):agErr(tx)||"Agnes error");throw er}
   var j=await r.json();wid=agId(j);if(!wid){var e2=new Error("HTTP 502");e2.detail="Agnes returned no video id";throw e2}
   wid=String(wid);if(bid)setJob(bid,{wid:wid,t:Date.now()})}
  var t0=Date.now(),bad=0,first=true;
  for(;;){await new Promise(function(ok){setTimeout(ok,first?20000:6000)});first=false;if(Date.now()-t0>420000){var te=new Error("timeout");te.name="AbortError";throw te}
   st("Making the video…");var d=null;
   try{var q=await fetch(AG+"/agnesapi?video_id="+encodeURIComponent(wid)+"&model_name="+AM,{headers:H});
    if(q.status===404){var e5=new Error("HTTP 404");e5.detail="Video not found";throw e5}
    if(q.ok)d=await q.json();else{bad++;if(bad>8){var e3=new Error("HTTP "+q.status);e3.detail="status check failed";throw e3}}}catch(x){if(x&&x.detail)throw x;bad++;if(bad>8)throw x}
   if(!d)continue;bad=0;
   var dd=d.data&&typeof d.data==="object"?d.data:{},stt=String(d.status||dd.status||d.state||dd.state||"").toLowerCase(),u=agUrl(d);
   if(/fail|error|cancel|reject|timeout|expired/.test(stt)){var e4=new Error("HTTP 502");e4.detail=hint(String((d.error&&(d.error.message||d.error))||d.message||dd.error||dd.message||"Generation failed").slice(0,200));throw e4}
   if(u&&(!stt||/done|complete|succe|finish|ready|success/.test(stt))){if(bid)setJob(bid,null);return u}}
 }catch(e){if(bid&&!(e&&e.name==="TypeError"))setJob(bid,{fail:e.detail||String(e.message||e),code:+(String(e.message).match(/\d{3}/)||[0])[0]||502,t:Date.now()});
  if(e&&e.name==="TypeError"&&!e.detail)e.detail="Browser could not reach Agnes (network or CORS blocked)";throw e}}
/* Agnes only (agnes-video-2.5-flash): no other servers. */
async function gen(prompt,s,st,bid){
 try{st("Starting Agnes…");return await viaWorker(null,prompt,Math.min(s,7),st,bid)}
 catch(e){e.trace="Agnes "+ecode(e)+(e&&e.detail?" — "+String(e.detail).slice(0,160):"");throw e}}
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
function fail(b,t,tr){b.classList.remove("done");b.classList.add("bad");b.innerHTML='<div class="xv-load"><b>'+(t||"Couldn’t make the video")+'</b><small>'+(tr?String(tr).replace(/</g,"&lt;"):"No server responded. Try again later.")+'</small></div>'}
function ecode(e){var m=String(e&&e.message||e),n=m.match(/HTTP (\d{3})/);if(n)return n[1];if(e&&e.name==="AbortError")return 408;if(/quota|busy|queue|limit/i.test(m))return 429;if(/No video/i.test(m))return 502;if(/fetch|network|closed|load failed/i.test(m))return 503;return 500}
async function run(id,prompt,s){var p=prompt;
 try{var u=await gen(p,s,function(t){setAll(id,function(b){var sm=b.querySelector(".dotslbl,.xv-load small");if(sm)sm.textContent=t})},id);res[id]=u;saveRes();setAll(id,function(b){try{show(b,u)}catch(x){}})}
 catch(e){var m="Error "+ecode(e),tr=e&&e.trace;if(/1015|rate limit|quota|429/i.test(String((e&&e.detail)||"")+String((e&&e.message)||"")))lock(600000);setAll(id,function(b){fail(b,m,tr)})}
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
