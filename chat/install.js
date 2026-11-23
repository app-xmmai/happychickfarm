/* Install popup for app.xmm-ai.com/?install=1 (login is mandatory; closing the popup sends logged-out visitors to sign in). */
(function(){
"use strict";
var AUTH=/(^|\.)xmm-ai\.com$/.test(location.hostname)?"https://auth.xmm-ai.com/":"/login/";
function named(){try{return String(JSON.parse(localStorage.getItem("xmm.name")||'""')||"").trim()!==""}catch(e){return false}}
var $=function(s){return document.querySelector(s)};
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
  function close(){d.remove();if(!named())location.href=AUTH}d.querySelector(".no").onclick=close;d.onclick=function(e){if(e.target===d)close()};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installPopup);else installPopup();

})();
