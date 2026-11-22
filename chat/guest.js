/* XMM AI guest mode: until you log in (auth.xmm-ai.com) you can chat, but cannot
   create images, save chats on this device, or send images/files. */
(function(){
"use strict";
var AUTH=/(^|\.)xmm-ai\.com$/.test(location.hostname)?"https://auth.xmm-ai.com/":"/login/";
function named(){try{return String(JSON.parse(localStorage.getItem("xmm.name")||'""')||"").trim()!==""}catch(e){return false}}
function guest(){return !named()}
window.XMM_GUEST=guest;
var $=function(s){return document.querySelector(s)};

/* never persist chats for guests */
try{var _si=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==="xmm.chats"&&guest())return;return _si.apply(this,arguments)}}catch(e){}
if(guest()){try{localStorage.removeItem("xmm.chats")}catch(e){}}

/* login-required popup */
var pop;
function login(msg){
  if(!pop){
    var st=document.createElement("style");
    st.textContent="#gLogin{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:20px}#gLogin[hidden]{display:none}#gLogin .c{width:min(360px,100%);background:#1c1c1e;color:#fff;border-radius:22px;padding:24px 22px 18px;text-align:center;font:15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.5)}#gLogin h3{margin:0 0 6px;font-size:19px}#gLogin p{margin:0 0 18px;color:#a1a1a6}#gLogin button{display:block;width:100%;border:0;border-radius:14px;padding:13px;font:600 16px -apple-system,system-ui,sans-serif;cursor:pointer}#gLogin .go{background:#fff;color:#000;margin-bottom:8px}#gLogin .no{background:transparent;color:#a1a1a6}";
    document.head.appendChild(st);
    pop=document.createElement("div");pop.id="gLogin";pop.hidden=true;
    pop.innerHTML='<div class="c"><h3>Log in to continue</h3><p id="gMsg"></p><button class="go" type="button">Log in</button><button class="no" type="button">Not now</button></div>';
    document.body.appendChild(pop);
    pop.querySelector(".go").onclick=function(){location.href=AUTH};
    pop.querySelector(".no").onclick=function(){pop.hidden=true};
    pop.onclick=function(e){if(e.target===pop)pop.hidden=true};
  }
  pop.querySelector("#gMsg").textContent=msg||"Log in to use this feature.";
  pop.hidden=false;
}
window.XMM_LOGIN_POPUP=login;
function stop(e,msg){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();login(msg)}

var IMG_MSG="Log in to create images.",ATT_MSG="Log in to send images and files.";
var IMGTXT=/^\s*\/(?:image|img|imagine)\b|\b(?:generate|create|make|draw|paint|design|imagine|render)\b[^.\n]{0,40}\b(?:image|picture|photo|illustration|logo|wallpaper|poster|portrait|artwork)s?\b|\b(?:image|picture|photo)\s+of\b/i;

/* block native file pickers for guests (covers every "+" / Camera / Photos / Files path) */
try{var _ic=HTMLInputElement.prototype.click;HTMLInputElement.prototype.click=function(){if(this.type==="file"&&guest()){login(ATT_MSG);return}return _ic.apply(this,arguments)};
if(HTMLInputElement.prototype.showPicker){var _sp=HTMLInputElement.prototype.showPicker;HTMLInputElement.prototype.showPicker=function(){if(this.type==="file"&&guest()){login(ATT_MSG);return}return _sp.apply(this,arguments)}}}catch(e){}
/* capture-phase click guards */
window.addEventListener("click",function(e){
  if(!guest())return;var t=e.target;if(!t||!t.closest)return;
  /* profile / avatar button -> login */
  if(t.closest("#clAv")){stop(e,"Log in to get your profile and settings.");pop.querySelector(".go").onclick=function(){location.href=AUTH};return}
  if(t.closest('[data-go="profile"]')){stop(e,"Log in to set up your profile.");return}
  /* attach */
  if(t.closest("#attBtn,[data-act='attach'],[data-act='upload'],[data-k='camera'],[data-k='photos'],[data-k='files'],[data-a='cam'],[data-a='img'],[data-a='file'],[data-a='photo'],[data-a='camera']")){stop(e,ATT_MSG);return}
  /* create image entry points */
  if(t.closest('[data-act="image"],[data-q="image"],#gmChips button:first-child')){stop(e,IMG_MSG);return}
  var chip=t.closest("#gmChips button,.quick button,.chip");
  if(chip&&/create image/i.test(chip.textContent||"")){stop(e,IMG_MSG);return}
  /* send button with image-looking prompt */
  if(t.closest("#sendBtn")){var m=$("#msg");if(m&&(window.XMM_GENMODE==="image"||IMGTXT.test(m.value||""))){stop(e,IMG_MSG);return}}
},true);
window.addEventListener("keydown",function(e){
  if(!guest()||e.key!=="Enter"||e.shiftKey)return;var t=e.target;
  if(t&&t.id==="msg"&&(window.XMM_GENMODE==="image"||IMGTXT.test(t.value||"")))stop(e,IMG_MSG);
},true);
/* file picks, paste and drag-drop */
window.addEventListener("change",function(e){
  var t=e.target;if(guest()&&t&&t.type==="file"){try{t.value=""}catch(x){}stop(e,ATT_MSG)}
},true);
["paste","drop"].forEach(function(n){window.addEventListener(n,function(e){
  if(!guest())return;var d=n==="paste"?e.clipboardData:e.dataTransfer;
  if(d&&d.files&&d.files.length)stop(e,ATT_MSG);
},true)});
/* block any programmatic image mode for guests */
var _g;try{Object.defineProperty(window,"XMM_GENMODE",{configurable:true,get:function(){return guest()?"":_g},set:function(v){if(v==="image"&&guest()){login(IMG_MSG);return}_g=v}})}catch(e){}

/* Settings: guests see "Log in" instead of Log out */
window.addEventListener("click",function(e){
  if(!guest())return;var b=e.target.closest&&e.target.closest('[data-do="logout"]');
  if(b){stop(e,"You are not logged in yet.")}
},true);

/* ?install=1 from the landing page: show our own install popup */
var deferred=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e});
function installPopup(){
  try{var u=new URL(location.href);if(u.searchParams.get("install")!=="1")return;
    u.searchParams.delete("install");history.replaceState(null,"",u.pathname+(u.search||"")+u.hash)}catch(e){return}
  if(navigator.standalone||matchMedia("(display-mode: standalone)").matches)return;
  var ua=navigator.userAgent||"",ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),and=/android/i.test(ua);
  var steps=ios?["Tap the <b>Share</b> button in Safari","Scroll and tap <b>Add to Home Screen</b>","Tap <b>Add</b>"]:and?["Tap the <b>menu (\u22ee)</b> in Chrome","Tap <b>Install app</b> or <b>Add to Home screen</b>","Confirm"]:["Open the browser menu","Click <b>Install XMM AI</b>","The app opens in its own window"];
  var st=document.createElement("style");
  st.textContent="#gInst{position:fixed;inset:0;z-index:99999;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:16px}@media(min-width:700px){#gInst{align-items:center}}#gInst .c{width:min(380px,100%);background:#1c1c1e;color:#fff;border-radius:24px;padding:24px 22px 18px;font:15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.5);text-align:center}#gInst img{width:60px;height:60px;border-radius:14px;margin-bottom:8px}#gInst h3{margin:0 0 4px;font-size:20px}#gInst p{margin:0 0 14px;color:#a1a1a6}#gInst ol{text-align:left;margin:0 0 16px;padding-left:22px}#gInst li{margin:6px 0}#gInst button{display:block;width:100%;border:0;border-radius:14px;padding:13px;font:600 16px -apple-system,system-ui,sans-serif;cursor:pointer}#gInst .go{background:#fff;color:#000;margin-bottom:8px}#gInst .no{background:transparent;color:#a1a1a6}";
  document.head.appendChild(st);
  var d=document.createElement("div");d.id="gInst";
  d.innerHTML='<div class="c"><img src="/chat/icon.svg" alt=""><h3>Install XMM AI</h3><p>Add it to your device for the full-screen app.</p><ol>'+steps.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ol><button class="go" type="button" hidden>Install</button><button class="no" type="button">Close</button></div>';
  document.body.appendChild(d);
  var go=d.querySelector(".go");
  function arm(){if(deferred){go.hidden=false;go.onclick=function(){try{deferred.prompt();deferred.userChoice.then(function(){d.remove()})}catch(e){}}}}
  arm();setTimeout(arm,800);setTimeout(arm,2000);
  d.querySelector(".no").onclick=function(){d.remove()};d.onclick=function(e){if(e.target===d)d.remove()};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installPopup);else installPopup();

/* Guests: "Log in" button inside the sidebar footer (next to the profile button), no floating button */
function pill(){
  if(!guest())return;var db=$(".cl-db");if(!db||$("#gLoginBtn"))return;
  var b=document.createElement("button");b.id="gLoginBtn";b.type="button";b.textContent="Log in";
  b.style.cssText="background:#fff;color:#000;border:0;border-radius:999px;padding:9px 16px;font:600 14px -apple-system,system-ui,sans-serif;cursor:pointer;margin-left:8px;flex:none";
  b.onclick=function(e){e.stopPropagation();location.href=AUTH};db.appendChild(b);
}
setInterval(pill,600);
})();
