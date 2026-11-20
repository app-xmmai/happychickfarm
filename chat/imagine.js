/* Imagine page: full-screen studio (image + video) instead of the normal chat UI */
(function(){
var css='#imgn{position:fixed;inset:0;z-index:2147483000;background:#1c1c1d;color:#f2f2f0;display:none;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,system-ui,sans-serif;overflow:hidden}'+
'#imgn.on{display:flex}'+
'#imgn .im-top{display:flex;align-items:center;justify-content:space-between;padding:max(14px,env(safe-area-inset-top)) 18px 10px}'+
'#imgn .im-top button{display:inline-flex;align-items:center;gap:8px;border:0;background:none;color:inherit;font:500 15px/1 inherit;padding:10px;border-radius:12px;cursor:pointer}'+
'#imgn .im-top button:hover{background:rgba(255,255,255,.08)}'+
'#imgn .im-sc{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 16px max(28px,env(safe-area-inset-bottom))}'+
'#imgn .im-w{max-width:752px;margin:0 auto}'+
'#imgn h1{font:500 24px/1.2 inherit;text-align:center;margin:clamp(24px,9vh,92px) 0 26px}'+
'#imgn .im-box{border:1px solid rgba(255,255,255,.16);border-radius:26px;background:#1f1f20;padding:14px 14px 12px}'+
'#imgn textarea{display:block;width:100%;min-height:44px;max-height:180px;resize:none;border:0;outline:0;background:none;color:inherit;font:400 17px/1.4 inherit;padding:6px 8px 10px}'+
'#imgn textarea::placeholder{color:#8c8c90}'+
'#imgn .im-row{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}'+
'#imgn .im-seg{display:inline-flex;padding:3px;border-radius:99px;background:rgba(255,255,255,.08)}'+
'#imgn .im-seg button{display:inline-flex;align-items:center;gap:7px;border:0;background:none;color:#a4a4a8;font:600 14px/1 inherit;padding:9px 14px;border-radius:99px;cursor:pointer}'+
'#imgn .im-seg button.on{background:rgba(255,255,255,.12);color:#fff}'+
'#imgn .im-r{display:flex;align-items:center;gap:6px}'+
'#imgn .im-chip{display:inline-flex;align-items:center;gap:6px;border:0;background:none;color:#c9c9cc;font:500 14px/1 inherit;padding:9px 10px;border-radius:10px;cursor:pointer}'+
'#imgn .im-chip:hover{background:rgba(255,255,255,.08)}'+
'#imgn .im-chip[hidden]{display:none}'+
'#imgn .im-go{width:36px;height:36px;border-radius:50%;border:0;background:#3a3a3d;color:#8c8c90;display:grid;place-items:center;cursor:pointer}'+
'#imgn .im-go.rdy{background:#f2f2f0;color:#111}'+
'#imgn .im-er{margin:12px 4px 0;padding:10px 14px;border-radius:12px;background:rgba(255,69,58,.16);color:#ff8d85;font:600 14px/1.3 inherit;text-align:center}#imgn .im-er[hidden]{display:none}'+
'#imgn .im-lb{margin:30px 2px 12px;font:600 13px/1 inherit;color:#8c8c90;letter-spacing:.04em;text-transform:uppercase}'+
'#imgn .im-g{column-count:3;column-gap:12px}'+
'#imgn .im-t{break-inside:avoid;margin:0 0 12px;border-radius:18px;position:relative;overflow:hidden;cursor:pointer;display:block;width:100%;border:0;padding:0;text-align:left;color:#fff}'+
'#imgn .im-t span{position:absolute;left:14px;bottom:12px;right:12px;font:600 14px/1.25 inherit;text-shadow:0 1px 8px rgba(0,0,0,.55)}'+
'#imgn .im-t::after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 55%,rgba(0,0,0,.4))}'+
'#imgn .im-t:active{transform:scale(.98)}'+
'#imgn .im-t img{display:block;width:100%}'+
'@media(max-width:700px){#imgn .im-g{column-count:2}#imgn h1{font-size:22px}}';
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
var $=function(s,r){return(r||document).querySelector(s)};
var SV={img:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 3.5 3L16 12l4 4"/></svg>',
vid:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6.5" width="12.5" height="11" rx="3"/><path d="m15.5 11 5-3v8l-5-3"/></svg>',
clock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
up:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
back:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'};
var IMG=[["Cozy cabin","a cozy cabin in a snowy forest at night, warm light in the windows","linear-gradient(160deg,#ffb36b,#3b2a5a)",250],["Neon city","a rainy neon cyberpunk street at night, reflections on wet asphalt","linear-gradient(160deg,#ff4fa3,#2a1b6e)",190],["Portrait","studio portrait of a smiling woman, soft window light, 85mm","linear-gradient(160deg,#c9b8a4,#6b7f6a)",300],["Astronaut","an astronaut floating above a glowing blue planet, cinematic","linear-gradient(160deg,#6fa8ff,#0b1030)",200],["Sticker pack","die-cut sticker sheet of cute animals","linear-gradient(160deg,#ffe35a,#ff9d3c)",170],["Vintage map","aged hand-drawn fantasy map on parchment","linear-gradient(160deg,#d9c08f,#8a6c3a)",230],["Poster","bold retro travel poster of a mountain lake","linear-gradient(160deg,#ff6a4a,#8f1f0d)",260],["Food","overhead photo of a rustic pizza on a wooden table","linear-gradient(160deg,#f6c453,#b4472b)",180],["Dragon","a friendly dragon curled around a lighthouse, watercolor","linear-gradient(160deg,#7be0b8,#1d5c6b)",240]];
var VID=[["Ocean drone","aerial drone shot over turquoise waves crashing on a cliff","linear-gradient(160deg,#4fd1ff,#0b3a6b)",250],["City timelapse","timelapse of a busy city crossing at dusk with light trails","linear-gradient(160deg,#ffb36b,#2a1b6e)",190],["Walking forest","a person walking through a misty forest, sun rays, cinematic","linear-gradient(160deg,#9bd37a,#1f3b2a)",300],["Space","a spaceship flying past a ringed planet, slow camera pan","linear-gradient(160deg,#8f7bff,#0a0a24)",200],["Rain window","raindrops sliding down a window, blurred city lights behind","linear-gradient(160deg,#7aa0c4,#1a2433)",170],["Cat","a fluffy cat jumping onto a sofa in slow motion","linear-gradient(160deg,#ffd29b,#8a5a3a)",230],["Fire","campfire sparks floating up into a starry night sky","linear-gradient(160deg,#ff8a3d,#2b0f0a)",260],["Coffee","steam rising from a fresh cup of coffee, macro, soft light","linear-gradient(160deg,#d7b08a,#3a2418)",180],["Dragon fly","a dragon flying over snowy mountains, epic fantasy","linear-gradient(160deg,#c3d4ff,#33406b)",240]];
var el=document.createElement("div");el.id="imgn";
el.innerHTML='<div class="im-top"><button type="button" data-x="back" aria-label="Back">'+SV.back+'</button><button type="button" data-x="new">'+SV.plus+'New canvas</button></div><div class="im-sc"><div class="im-w"><h1>What should we imagine?</h1><div class="im-box"><textarea rows="1" placeholder="Type to imagine" dir="auto" enterkeyhint="send"></textarea><div class="im-row"><div class="im-seg"><button type="button" data-m="image" class="on">'+SV.img+'Image</button><button type="button" data-m="video">'+SV.vid+'Video</button></div><div class="im-r"><button type="button" class="im-chip" data-x="len" hidden>'+SV.clock+'<b></b></button><button type="button" class="im-go" data-x="go" aria-label="Create">'+SV.up+'</button></div></div></div><div class="im-er" hidden></div><div class="im-lb">Ideas</div><div class="im-g"></div></div></div>';
document.body.appendChild(el);
var ta=$("textarea",el),go=$(".im-go",el),mode="image",g=$(".im-g",el),lenB=$('[data-x="len"]',el);
function V(){return window.XMM_VIDEO}
function curSec(){try{var a=V().lens(),s=el.__s;if(a.indexOf(s)<0)s=a[a.length-1];return s}catch(e){return 5}}
function grid(){var L=mode==="video"?VID:IMG;g.innerHTML=L.map(function(t,i){return'<button type="button" class="im-t" data-i="'+i+'" style="height:'+t[3]+'px;background:'+t[2]+'"><span>'+t[0]+'</span></button>'}).join("")}
function setM(m){mode=m;[].forEach.call(el.querySelectorAll("[data-m]"),function(b){b.classList.toggle("on",b.dataset.m===m)});lenB.hidden=m!=="video";if(m==="video")lenB.querySelector("b").textContent=curSec()+"s";ta.placeholder=m==="video"?"Describe a video to imagine":"Type to imagine";grid()}
function rdy(){go.classList.toggle("rdy",!!ta.value.trim());ta.style.height="auto";ta.style.height=Math.min(180,ta.scrollHeight)+"px"}
function open(){el.classList.add("on");document.body.style.overflow="hidden";setM(mode);setTimeout(function(){try{ta.focus()}catch(e){}},60)}
function close(){el.classList.remove("on");document.body.style.overflow=""}
function err(t){var e=$(".im-er",el);e.textContent=t;e.hidden=false;clearTimeout(err.t);err.t=setTimeout(function(){e.hidden=true},6000)}
function send(){var t=ta.value.trim();if(!t)return;$(".im-er",el).hidden=true;var A=window.XMM_API;
 if(mode==="video"){try{
   if(!V()||!A){err("Error 500");return}
   var w=V().left();if(w>0){err("Error 429 · wait "+V().fmt(w));return}
   try{V().setSec(curSec())}catch(e){}
   try{A.newChat&&A.newChat()}catch(e){}
   if(V().start(t)){ta.value="";rdy();close()}else err("Error 500")}
  catch(e){err("Error 500")}return}
 if(!A){err("Error 500");return}
 close();try{A.newChat&&A.newChat()}catch(e){}
 var q=/^\s*(make|create|generate|draw)\b.*\bimage\b|^\s*\/(image|img|imagine)\b/i.test(t)?t:"make image of "+t;
 setTimeout(function(){try{A.send(q)}catch(e){}ta.value="";rdy()},80)}
el.addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
 if(t.dataset.m){setM(t.dataset.m);return}
 if(t.classList.contains("im-t")){var L=mode==="video"?VID:IMG;ta.value=L[+t.dataset.i][1];rdy();ta.focus();return}
 var x=t.dataset.x;if(x==="back")close();else if(x==="new"){ta.value="";rdy();ta.focus()}
 else if(x==="go")send();
 else if(x==="len"){var a=V().lens(),s=curSec();el.__s=a[(a.indexOf(s)+1)%a.length];lenB.querySelector("b").textContent=el.__s+"s"}});
ta.addEventListener("input",rdy);
ta.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();send()}});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&el.classList.contains("on"))close()});
window.XMM_IMAGINE=function(){try{document.body.classList.remove("cl-drawer","drawer","side-open")}catch(e){}open()};
})();
