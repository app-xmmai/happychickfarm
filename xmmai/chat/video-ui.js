/* video-ui.js — XMM AI new look (Ask / Imagine / Build top bar, pill composer, + menu, ... menu,
   5-line collapse for sent messages, voice, animations). Loaded last; leaves the sidebar and the step summary alone. */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var API=function(){return window.XMM_API||{}};
var body=document.body;
var SV=function(d,w){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||1.9)+'" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>'};
var IC={
 menu:'<path d="M5 9h14M5 15h14"/>',
 dots:'<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>',
 edit:'<path d="M12 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-4"/><path d="M18.5 3.5l2 2L12 14l-3 1 1-3z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 bolt:'<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21"/>',
 wave:'<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4"/>',
 up:'<path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/>',
 share:'<path d="M12 15V4M8 7.5L12 4l4 3.5M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6"/>',
 trash:'<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2a1 1 0 001 .8h7.4a1 1 0 001-.8L17.5 7M10 11v5M14 11v5"/>',
 cam:'<path d="M4 8.5A2.5 2.5 0 016.5 6h1.2l1.3-2h6l1.3 2h1.2A2.5 2.5 0 0120 8.5v9a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5z"/><circle cx="12" cy="13" r="3.4"/>',
 img:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.5"/><path d="M4 17l5-4 4 3.5 3-2.5 4 3.5"/>',
 file:'<path d="M14 3.5H8A2.5 2.5 0 005.5 6v12A2.5 2.5 0 008 20.5h8a2.5 2.5 0 002.5-2.5V8z"/><path d="M14 3.5V8h4.5"/>',
 conn:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/><path d="M17 3.5v7M13.5 7h7"/>',
 skills:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
 back:'<path d="M15 18l-6-6 6-6"/>',
 code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14"/>',
 web:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5S9.4 5.9 12 3.5z"/>',
 translate:'<path d="M4 6h9M8.5 4v2M6 6c.6 3.4 2.8 6 5.5 7.5M12 6c-.7 3.6-3.4 6.4-7 8M13 20l4-9 4 9M14.4 17h5.2"/>',
 refresh:'<path d="M20 12a8 8 0 11-2.6-5.9M20 4v4.5h-4.5"/>',
 pen:'<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19z"/>',
 game:'<path d="M7 8.5h10a4 4 0 014 4v1.5a3 3 0 01-5.3 1.9L14 14H10l-1.7 1.9A3 3 0 013 14v-1.5a4 4 0 014-4zM8 11v3M6.5 12.5h3M16 12h.01M18 13.5h.01"/>',
 tree:'<path d="M12 21v-7M12 14l-4.5-4.5M12 14l4.5-4.5M7.5 9.5L5 6M16.5 9.5L19 6M12 14V4"/>',
 palette:'<path d="M12 3.5a8.5 8.5 0 100 17c1.4 0 2-.9 2-1.8 0-1.4-1.2-1.6-1.2-2.8 0-1 .8-1.6 1.8-1.6H17a3.5 3.5 0 003.5-3.5C20.5 6.6 16.8 3.5 12 3.5z"/><circle cx="7.8" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="7.8" r="1"/>',
 calc:'<rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M8.5 8h7M9 12.5h.01M12 12.5h.01M15 12.5h.01M9 16h.01M12 16h.01M15 16h.01"/>',
 timer:'<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.3 1.4M9.5 3.5h5"/>',
 eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.7"/>'
};
function toast(t){try{API().toast(t)}catch(e){}}
function click(sel){var e=$(sel);if(e)e.click()}
function mob(){return innerWidth<900}
function state(){return API().S||{}}
function msgCount(){var c=API().cur&&API().cur();return c?c.msgs.length:0}
function isTouch(){return matchMedia("(pointer:coarse)").matches}
function spring(el,kf,o){if(el&&el.animate)try{return el.animate(kf,o)}catch(e){}}
var EASE="cubic-bezier(.2,.9,.25,1.12)",EASE2="cubic-bezier(.32,.72,0,1)";

/* ====================================================== top bar */
var seg,pill,vtop;
function segHTML(active){
 return '<div class="vseg" role="tablist"><span class="vseg-pill"></span>'+
  ['Ask','Build'].map(function(n){return '<button type="button" role="tab" data-v="'+n.toLowerCase()+'" class="'+(n.toLowerCase()===active?"on":"")+'">'+n+'</button>'}).join('')+'</div>'}
function movePill(sg){
 if(!sg)return;var on=$("button.on",sg),p=$(".vseg-pill",sg);if(!on||!p)return;
 p.style.width=on.offsetWidth+"px";p.style.transform="translateX("+on.offsetLeft+"px)"}
function setSeg(sg,v){$$("button",sg).forEach(function(b){b.classList.toggle("on",b.dataset.v===v)});movePill(sg)}
var mode="ask"; /* ask | build  (Imagine is the Images screen) */
function studioOpen(){var s=$("#studio");return s&&!s.hidden}
function curMode(){return studioOpen()?"imagine":mode}
function applyMode(){
 body.classList.toggle("v-build",mode==="build");window.XMM_VMODE=mode;
 var ta=$("#msg");if(ta)ta.placeholder=mode==="build"?"Build with XMM":"Ask Anything";
 renderChips();syncSeg()}
function closeSide(){try{var s=document.getElementById("sideChat");if(s&&s.classList.contains("open")){s.classList.remove("open");var sc=document.getElementById("scrim");if(sc)sc.classList.remove("on")}document.body.classList.add("xhide");var c=document.querySelector('[data-act="closeDrawer"]');if(c)c.click()}catch(z){}}
function goMode(v){
 var cur=curMode();
 if(v===cur)return;
 if(cur==="imagine"){click("#svBack");
  if(v!=="imagine"){setTimeout(function(){mode=v;applyMode();if(v==="build")closeSide()},260)}}
 if(v==="imagine"){return}
 if(cur!=="imagine"){mode=v;applyMode();if(v==="build")closeSide()}
 syncSeg(v)}
function syncSeg(force){
 var v=force||curMode();
 $$(".vseg").forEach(function(sg){setSeg(sg,v)})}
function wireSeg(sg){sg.addEventListener("click",function(e){var b=e.target.closest("button[data-v]");if(!b)return;goMode(b.dataset.v)})}

function buildTop(){
 var tb=$("#mainChat .topbar");if(!tb||tb.dataset.v)return;tb.dataset.v=1;
 vtop=document.createElement("div");vtop.className="vtop";
 vtop.innerHTML=
  '<button type="button" class="vc vmenu" aria-label="Menu">'+SV(IC.menu,2)+'</button>'+
  segHTML("ask")+
  '<div class="vright"><div class="vgl"><button type="button" class="vdots" aria-label="More">'+SV(IC.dots,2)+'</button><button type="button" class="vnew" aria-label="New chat">'+SV(IC.edit,1.8)+'</button></div></div>';
 tb.appendChild(vtop);
 seg=$(".vseg",vtop);wireSeg(seg);
 $(".vmenu",vtop).onclick=function(e){e.stopPropagation();click(".xtog")};
 $(".vnew",vtop).onclick=function(){var b=$(".vnew",vtop);spring(b,[{transform:"scale(1)"},{transform:"scale(.82) rotate(-8deg)"},{transform:"scale(1)"}],{duration:340,easing:EASE});click('#chatNav [data-k="newchat"]')};
 $(".vdots",vtop).onclick=function(e){e.stopPropagation();openDots()};
 requestAnimationFrame(function(){movePill(seg)});
 addEventListener("resize",function(){$$(".vseg").forEach(movePill)});
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){$$(".vseg").forEach(movePill)});
}

/* Imagine: put the same switch into the Images header */
function studioSeg(){
 var st=$("#studio .sv-top");if(!st||st.dataset.v)return;st.dataset.v=1;
 var h=$("h1",st);if(h)h.style.display="none";
 var d=document.createElement("div");d.innerHTML=segHTML("imagine");var sg=d.firstChild;st.appendChild(sg);wireSeg(sg);
}

/* ====================================================== popovers */
var pop=null,popBtn=null;
function closePop(){
 if(!pop)return;var p=pop;pop=null;
 /* liquid.js plays the reverse morph into the button when the popover is removed; animating it here too made it fade, pop back and close again */
 if(p._lqR&&p._lqA2&&p._lqA2.isConnected){p.remove()}
 else{var a=spring(p,[{opacity:1,transform:"scale(1)",filter:"blur(0)"},{opacity:0,transform:"scale(.6)",filter:"blur(6px)"}],{duration:200,easing:EASE2});
 var kill=function(){p.remove()};if(a)a.onfinish=kill;else kill()}
 if(popBtn){popBtn.classList.remove("open");popBtn=null}
}
function showPop(anchor,html,o){
 closePop();o=o||{};
 var p=document.createElement("div");p.className="vpop "+(o.cls||"");p.innerHTML=html;body.appendChild(p);
 var r=anchor.getBoundingClientRect(),pw=p.offsetWidth,ph=p.offsetHeight,x,y,ox,oy;
 if(o.up){y=r.top-ph-10;oy="bottom"}else{y=r.bottom+10;oy="top"}
 if(o.right){x=r.right-pw;ox="right"}else{x=r.left;ox="left"}
 x=Math.max(10,Math.min(innerWidth-pw-10,x));y=Math.max(10,Math.min(innerHeight-ph-10,y));
 p.style.left=x+"px";p.style.top=y+"px";p.style.transformOrigin=oy+" "+ox;
 spring(p,[{opacity:0,transform:"scale(.35)",filter:"blur(10px)"},{opacity:1,transform:"scale(1.025)",filter:"blur(0)",offset:.7},{opacity:1,transform:"scale(1)",filter:"blur(0)"}],{duration:360,easing:EASE2});
 pop=p;popBtn=anchor;anchor.classList.add("open");return p}
document.addEventListener("pointerdown",function(e){if(pop&&!e.target.closest(".vpop")&&!e.target.closest(".vdots,#attBtn"))closePop()},true);
addEventListener("keydown",function(e){if(e.key==="Escape")closePop()});

function openDots(){
 if(pop&&popBtn&&popBtn.classList.contains("vdots")){closePop();return}
 var n=msgCount();
 var p=showPop($(".vdots"),
  '<button data-a="share">'+SV(IC.share,1.8)+'<span>Share Conversation</span></button>'+
  
  '<i class="vsep"></i>'+
  '<button data-a="del" class="red">'+SV(IC.trash,1.8)+'<span>Delete Conversation</span></button>',{right:1,cls:"vmenu-pop"});
 p.onclick=function(e){var b=e.target.closest("button[data-a]");if(!b)return;var a=b.dataset.a;closePop();
  if(a==="share"){var sh=$('[data-act="share"]');if(sh)sh.click();else toast("Nothing to share yet")}
  else if(a==="files"){/* preview removed */}
  else if(a==="del"){var c=API().cur&&API().cur();if(c&&API().delChat){API().delChat(c.id);toast("Conversation deleted")}}}
}
function openPlus(){/* disabled — upload.js modal only */}
var SKILLS=[["Summarize","Summarize this in 5 bullet points: "],["Explain simply","Explain this like I'm 12: "],["Write an email","Write a polite email about "],["Fix my code","Find and fix the bug in this code:\n"],["Translate","Translate to English: "],["Brainstorm","Give me 10 creative ideas for "]];
function skillsPop(a){
 var p=showPop(a,'<button data-a="back">'+SV(IC.back,1.8)+'<span>Skills</span></button><i class="vsep"></i>'+SKILLS.map(function(s,i){return '<button data-i="'+i+'">'+SV(IC.skills,1.7)+'<span>'+s[0]+'</span></button>'}).join(""),{up:1,cls:"vplus-pop"});
 p.onclick=function(e){var b=e.target.closest("button");if(!b)return;
  if(b.dataset.a==="back"){openPlus();return}
  var s=SKILLS[+b.dataset.i];closePop();var m=$("#msg");if(!m||!s)return;
  m.value=s[1];m.dispatchEvent(new Event("input",{bubbles:true}));m.focus();try{m.setSelectionRange(m.value.length,m.value.length)}catch(e){}}
}
/* + is handled by upload.js modal only — do not open native picker on page taps */
window.addEventListener("click",function(e){
 var b=e.target.closest&&e.target.closest("#attBtn");if(!b)return;
 /* let upload.js capture handler own this; do not openPlus / file.click here */
},true);

/* ====================================================== composer */
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
var rec=null,recMode="",voice={on:false,tok:0};
function langCode(){var l=(document.documentElement.lang||"en").slice(0,2);return {de:"de-DE",en:"en-US",fa:"fa-IR",ar:"ar-SA",es:"es-ES"}[l]||"en-US"}
function setMsg(v){var m=$("#msg");m.value=v;m.dispatchEvent(new Event("input",{bubbles:true}))}
function ui(){var mc=$(".vmic"),sp=$("#speakBtn");
 if(mc)mc.classList.toggle("on",recMode==="mic");
 if(sp){sp.classList.toggle("on",voice.on);var l=sp.querySelector("span");if(l)l.textContent=voice.on?"Listening…":"Speak"}
 body.classList.toggle("v-listen",!!recMode)}
function stopRec(){if(rec){var r=rec;rec=null;r.onend=r.onerror=r.onresult=null;try{r.abort()}catch(e){}}recMode="";ui()}
/* one listening round. cb(text) is called with what was heard ("" if nothing) */
function ensureMic(cb){
 /* iOS 14.5+ / Android: trigger the system permission popup via getUserMedia first (user gesture required) */
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){cb(true);return}
 navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(function(stream){
  try{stream.getTracks().forEach(function(tr){tr.stop()})}catch(e){}
  cb(true)
 }).catch(function(err){
  var n=err&&(err.name||err.message)||"";
  if(/NotAllowed|Permission|denied/i.test(n))toast("Microphone permission is blocked — enable it in Settings");
  else if(/NotFound|DevicesNotFound/i.test(n))toast("No microphone found");
  else toast("Mic unavailable");
  cb(false)
 })
}
function hear(mode,cb){
 if(!SR){toast("Unsupported browser");cb(null);return}
 ensureMic(function(ok){if(!ok){cb(null);return}
  stopRec();var r=new SR();rec=r;recMode=mode;r.lang=langCode();r.interimResults=true;r.continuous=false;
  var heard="",done=false,base=mode==="mic"?$("#msg").value:"";
  function fin(err){if(done)return;done=true;if(rec===r){rec=null;recMode=""}ui();cb(heard.trim(),err)}
  r.onresult=function(e){var t="";for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;heard=t;if(mode==="mic")setMsg((base?base+" ":"")+t)};
  r.onerror=function(e){if(e.error==="not-allowed"||e.error==="service-not-allowed")toast("Microphone permission is blocked");fin(e.error)};
  r.onend=function(){fin()};
  try{r.start();ui()}catch(e){fin("start")}
 })
}
function cleanSpeech(t){return String(t||"").replace(/```[\s\S]*?```/g," (code) ").replace(/<[^>]+>/g,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/[*_`#>~|]/g,"").replace(/\s+/g," ").trim()}
function lastAnswer(){var c=API().cur&&API().cur();if(!c)return "";for(var i=c.msgs.length-1;i>=0;i--){var m=c.msgs[i];if(m.role==="assistant"&&m.text)return m.text}return ""}
function voiceStop(){voice.on=false;voice.tok++;stopRec();cdHide();ui()}
var CDMS=1500,vcd=null,cdT=0,cdIv=0;
function cdHide(){clearInterval(cdIv);cdIv=0;if(vcd)vcd.classList.remove("on")}
function cdShow(left){if(!vcd)return;vcd.classList.add("on");var s=(Math.max(0,left)/1000).toFixed(1);vcd.querySelector("span").textContent="Sending in "+s+"s";vcd.querySelector("i").style.width=(Math.max(0,left)/CDMS*100)+"%"}
function voiceRound(){
 if(!voice.on)return;var tok=voice.tok;
 if(!SR){toast("Unsupported browser");voiceStop();return}
 stopRec();var r=new SR();rec=r;recMode="speak";r.lang=langCode();r.interimResults=true;r.continuous=true;
 var base=$("#msg").value,spoke=false;cdT=0;cdHide();
 r.onresult=function(e){var t="";for(var k=0;k<e.results.length;k++)t+=e.results[k][0].transcript;
  if(!t.trim())return;spoke=true;cdT=Date.now();setMsg((base?base+" ":"")+t);cdShow(CDMS)};
 r.onerror=function(e){if(e.error==="not-allowed"||e.error==="service-not-allowed"){toast("Microphone permission is blocked");voiceStop()}};
 r.onend=function(){if(rec!==r)return;rec=null;recMode="";
  if(voice.on&&tok===voice.tok){base=$("#msg").value;setTimeout(function(){if(voice.on&&tok===voice.tok)voiceRound()},120)}else ui()};
 try{r.start();ui()}catch(e){voiceStop();return}
 clearInterval(cdIv);
 cdIv=setInterval(function(){
  if(!voice.on||tok!==voice.tok){cdHide();return}
  if(!spoke||!cdT)return;
  var left=CDMS-(Date.now()-cdT);cdShow(left);
  if(left<=0){var txt=$("#msg").value.trim();if(txt&&state().busy)return;cdHide();if(txt){var sb=$("#sendBtn");if(sb)sb.click()}clearInterval(cdIv);cdIv=0;stopRec();setTimeout(function(){if(txt)setMsg("");if(voice.on&&tok===voice.tok)voiceRound()},120)}
 },80)
}
var vchips;
var CHIPS=[
 ["Write code","code","#7c6cff",function(){goMode("build")}],
 ["Create image","img","#ff6fb5",function(){setMsg("make image of ");$("#msg").focus()}],
 ["Analyze image","eye","#4ad0ff",function(){setMsg("Analyze this image: ");$("#msg").focus();click("#attBtn")}],
 ["Search the web","web","#4fe3a0",function(){setMsg("Search the web: ");$("#msg").focus()}],
 ["Translate","translate","#ffb44a",function(){setMsg("Translate to English: ");$("#msg").focus()}],
 ["Write","pen","#ff7a6c",function(){setMsg("Write ");$("#msg").focus()}]
];
var POOL=[
 ["Chord player","wave","#a66bff","a chord player app with piano keys I can click and play chords"],
 ["Tower defense","game","#31d58a","a tower defense game"],
 ["Fractal tree","tree","#ff5fa8","an animated fractal tree with sliders"],
 ["Color palette","palette","#ff5a5f","a color palette generator"],
 ["Snake game","game","#ffd24a","a snake game"],
 ["Calculator","calc","#4ad0ff","a calculator app"],
 ["Pomodoro timer","timer","#ff8a4a","a pomodoro timer app"],
 ["Drawing board","pen","#7ee06f","a drawing board app with colors and brush sizes"],
 ["Memory game","game","#b78cff","a memory card matching game"],
 ["Landing page","code","#5ab0ff","a modern landing page website"]
];
var poolAt=0;
function shuffle(){poolAt=(poolAt+4)%POOL.length}
function buildItems(){var out=[];for(var i=0;i<6;i++)out.push(POOL[(poolAt+i)%POOL.length]);return out}
function renderChips(){
 if(!vchips)return;var inner=$(".vchips-in",vchips);
 if(mode==="build"){
  inner.innerHTML='<button type="button" class="vrefresh" data-r="1" aria-label="More ideas">'+SV(IC.refresh,1.8)+'</button>'+buildItems().map(function(c,i){return '<button type="button" data-b="'+i+'"><i style="color:'+c[2]+'">'+SV(IC[c[1]]||IC.code,1.9)+'</i><span>'+c[0]+'</span></button>'}).join("")}
 else inner.innerHTML=CHIPS.map(function(c,i){return '<button type="button" data-i="'+i+'"><i style="color:'+c[2]+'">'+SV(IC[c[1]],1.9)+'</i><span>'+c[0]+'</span></button>'}).join("");
 var anim=inner.children;for(var k=0;k<anim.length;k++){anim[k].style.animation="vchip .5s "+(k*45)+"ms var(--v-sp) both"}
}
/* Build mode: make sure the app's code agent picks the message up */
var BUILDRX=/\b(build|create|make|write)\b.{0,40}\b(code|html|css|js|javascript|app|game|site|page|ui|dashboard|calculator|timer|clock)\b/i;
function buildWrap(){
 if(mode!=="build"||studioOpen())return;var m=$("#msg");if(!m)return;var t=m.value.trim();
 if(t&&!BUILDRX.test(t)){m.value="Build an app: "+t}}
window.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#sendBtn");if(b&&b.dataset.has&&!state().busy)buildWrap()},true);
window.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey&&e.target&&e.target.id==="msg"&&innerWidth>860&&!state().busy)buildWrap()},true);
function buildComposer(){
 var comp=$(".composer");if(!comp||comp.dataset.v)return;comp.dataset.v=1;
 var dock=comp.parentNode,ta=$("#msg"),att=$("#attBtn"),mode=$("#modeBtn"),send=$("#sendBtn");
 comp.classList.remove("glass");
 /* top row: the text box, bottom row: + / model / spacer / mic / speak-or-send */
 var top=document.createElement("div");top.className="vrow-t";top.appendChild(ta);
 var bot=document.createElement("div");bot.className="vrow-b";
 var sp=document.createElement("span");sp.className="vgrow";
 var mic=document.createElement("button");mic.type="button";mic.className="vmic";mic.setAttribute("aria-label","Dictate");mic.innerHTML=SV(IC.mic,1.8);
 var speak=document.createElement("button");speak.type="button";speak.id="speakBtn";speak.setAttribute("aria-label","Speak");speak.innerHTML=SV(IC.wave,2.2)+'<span>Speak</span>';
 att.innerHTML=SV(IC.plus,2);
 var bi=mode.querySelector("svg");if(bi)bi.outerHTML=SV(IC.bolt,1.9);
 bot.appendChild(att);bot.appendChild(mode);bot.appendChild(sp);bot.appendChild(send);bot.appendChild(speak);
 comp.innerHTML="";vcd=document.createElement("div");vcd.className="vcd";vcd.innerHTML="<b><i></i></b><span></span>";comp.appendChild(vcd);comp.appendChild(top);comp.appendChild(bot);
 ta.placeholder="Ask Anything";
 /* the old send arrow is re-drawn by app.js: keep it, but swap to a thin arrow */
 mic.onclick=function(){if(recMode==="mic"){stopRec();return}if(voice.on)voiceStop();hear("mic",function(){})};
 speak.onclick=function(){if(voice.on){voiceStop();return}if(recMode)stopRec();voice.on=true;voice.tok++;ui();voiceRound()};
 /* suggestion chips above the box (fade out once you type) */
 vchips=document.createElement("div");vchips.className="vchips";
 vchips.innerHTML='<div class="vchips-in"></div>';
 vchips.onclick=function(e){var b=e.target.closest("button");if(!b)return;
  if(b.dataset.r){var r=b;r.classList.remove("spin");void r.offsetWidth;r.classList.add("spin");shuffle();setTimeout(renderChips,180);return}
  if(b.dataset.b){var c=buildItems()[+b.dataset.b];setMsg("Make "+c[3]);$("#sendBtn").click();return}
  if(b.dataset.i)CHIPS[+b.dataset.i][3]()};
 dock.insertBefore(vchips,comp);renderChips();
 /* 5 lines max, then the box scrolls (the rest of the text stays there) */
 function fit(){
  ta.style.height="auto";
  var cs=getComputedStyle(ta),lh=parseFloat(cs.lineHeight)||23,max=lh*5;
  var h=Math.min(ta.scrollHeight,max);
  ta.style.height=h+"px";
  ta.style.overflowY=ta.scrollHeight>max+1?"auto":"hidden";
  comp.classList.toggle("multi",ta.scrollHeight>lh*1.4);
  body.classList.toggle("v-typing",!!ta.value.trim());
 }
 ta.addEventListener("input",fit);
 ta.addEventListener("focus",function(){comp.classList.add("focus")});
 ta.addEventListener("blur",function(){comp.classList.remove("focus")});
 window.XMM_SYNC_EXPAND=fit;
 setInterval(function(){if(!ta.value&&ta.style.height!=="")fit()},400);
 comp.addEventListener("pointerdown",function(e){if(!e.target.closest("button")&&e.target!==ta)ta.focus()});
 fit();
}

/* ====================================================== messages */
var seen={};
function key(el,i){var c=state().cur||"x";return c+":"+i+":"+(el.classList.contains("m-uw")?"u":"b")}
function animateNew(){
 var box=$("#msgs");if(!box)return;
 var nodes=$$(":scope > .m-uw, :scope > .m-bot",box);
 var fresh=[];
 nodes.forEach(function(n,i){var k=key(n,i);if(!seen[k]){seen[k]=1;fresh.push(n)}});
 if(fresh.length>2||!fresh.length)return; /* a whole chat loading: no animation */
 fresh.forEach(function(n){
  if(n.classList.contains("m-uw"))spring(n,[{opacity:0,transform:"translateY(18px) scale(.82)",transformOrigin:"100% 100%"},{opacity:1,transform:"translateY(0) scale(1.02)",transformOrigin:"100% 100%",offset:.7},{opacity:1,transform:"none",transformOrigin:"100% 100%"}],{duration:460,easing:EASE2});
  else spring(n,[{opacity:0,transform:"translateY(10px)",filter:"blur(6px)"},{opacity:1,transform:"none",filter:"blur(0)"}],{duration:520,easing:EASE2})})
}
/* long sent messages: show 5 lines, then "Show full message" (not for the AI) */
function clampUser(){
 $$("#msgs .m-uw").forEach(function(w){
  var u=$(".m-user",w);if(!u||u.dataset.c)return;
  var lh=parseFloat(getComputedStyle(u).lineHeight)||22,limit=lh*5+1;
  var t=u.querySelector(".mu-t");
  if(!t){t=document.createElement("div");t.className="mu-t";while(u.firstChild)t.appendChild(u.firstChild);u.appendChild(t)}
  if(t.scrollHeight<=limit+lh*.5){u.dataset.c="n";return}
  u.dataset.c="y";u.classList.add("clamped");
  var b=document.createElement("button");b.type="button";b.className="mu-more";b.textContent="Show full message";
  w.appendChild(b);
  b.onclick=function(){
   var open=u.classList.toggle("expanded");b.textContent=open?"Show less":"Show full message";
   var h0=t.offsetHeight;
   spring(t,[{opacity:.4},{opacity:1}],{duration:260,easing:EASE2})}
 })
}
function msgsObs(){
 var box=$("#msgs");if(!box||box.dataset.v)return;box.dataset.v=1;
 var q=false;
 new MutationObserver(function(){if(q)return;q=true;requestAnimationFrame(function(){q=false;clampUser();animateNew();syncEmpty()})}).observe(box,{childList:true,subtree:true});
 clampUser();animateNew();
 addEventListener("resize",function(){$$("#msgs .m-user").forEach(function(u){delete u.dataset.c;u.classList.remove("clamped","expanded");var w=u.parentNode,b=$(".mu-more",w);if(b)b.remove()});clampUser()});
}
function syncEmpty(){
 var e=!msgCount();body.classList.toggle("v-empty",e);
 var d=$(".vdots");if(d)d.style.display=e?"none":"";
}

/* ====================================================== logo (empty state) */
function buildLogo(){
 var g=$(".greeting");if(!g||$(".vlogo",g))return;
 var d=document.createElement("div");d.className="vlogo";d.innerHTML='<img src="icon.svg?v=x33" alt="">';g.appendChild(d)}

/* ====================================================== init */
function init(){
 if(body.dataset.vui)return;
 if(!$("#mainChat .topbar")||!$(".composer"))return;
 body.dataset.vui=1;body.classList.add("vui");
 buildTop();buildComposer();buildLogo();msgsObs();studioSeg();syncEmpty();syncSeg();
 /* keep the switch in step when the Images / Build screens open or close */
 var sq=false;new MutationObserver(function(muts){if(sq)return;if(muts.every(function(m){return m.target.closest&&m.target.closest(".vseg,.vpop,.vtop,.composer,#msgs")}))return;sq=true;setTimeout(function(){sq=false;studioSeg();syncSeg()},60)}).observe(body,{childList:true,attributes:true,subtree:true,attributeFilter:["hidden","class"]});
 body.classList.add("v-in");
 setInterval(syncEmpty,600);
 /* press feedback on every button */
 document.addEventListener("pointerdown",function(e){var b=e.target.closest&&e.target.closest(".vc,.vdots,.vnew,.vseg button,.vrow-b button,.vchips button,.vpop button,.mu-more,.m-acts .icon-btn");if(!b)return;b.classList.add("vp");var off=function(){b.classList.remove("vp");removeEventListener("pointerup",off,true);removeEventListener("pointercancel",off,true)};addEventListener("pointerup",off,true);addEventListener("pointercancel",off,true)},true);
}
function start(){init();if(!body.dataset.vui)setTimeout(start,150)}
if(document.readyState!=="loading")setTimeout(start,420);else document.addEventListener("DOMContentLoaded",function(){setTimeout(start,420)});
})();
