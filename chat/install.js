/* Install page for app.xmm-ai.com/?install=1 — App Store style. Unsupported: iOS 14 and lower, Android 4.5 and lower. Closing sends logged-out visitors to sign in. */
(function(){
"use strict";
var AUTH=/(^|\.)xmm-ai\.com$/.test(location.hostname)?"https://auth.xmm-ai.com/":"/login/";
function named(){try{return String(JSON.parse(localStorage.getItem("xmm.name")||'""')||"").trim()!==""}catch(e){return false}}
var deferred=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e});
function detect(){
  var ua=navigator.userAgent||"",r={os:"other",ver:0,ok:true,name:"your device"};
  var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  var m;
  if(ios){r.os="ios";r.name=/ipad/i.test(ua)||navigator.platform==="MacIntel"?"iPad":"iPhone";
    m=/OS (\d+)[_.](\d+)/.exec(ua);r.ver=m?parseFloat(m[1]+"."+m[2]):0;
    if(!m){m=/Version\/(\d+)\.(\d+)/.exec(ua);r.ver=m?parseFloat(m[1]+"."+m[2]):99}
    r.ok=r.ver>=15}
  else if(/android/i.test(ua)){r.os="android";r.name="Android phone";
    m=/Android\s+(\d+)(?:\.(\d+))?/i.exec(ua);r.ver=m?parseFloat(m[1]+"."+(m[2]||0)):99;
    r.ok=r.ver>4.5}
  return r}
function installPopup(){
  try{var u=new URL(location.href);if(u.searchParams.get("install")!=="1")return;
    u.searchParams.delete("install");history.replaceState(null,"",u.pathname+(u.search||"")+u.hash)}catch(e){return}
  if(navigator.standalone||matchMedia("(display-mode: standalone)").matches)return;
  var D=detect();
  var steps=D.os==="ios"?[["share","Tap the <b>Share</b> button in Safari"],["plus","Scroll down and tap <b>Add to Home Screen</b>"],["ok","Tap <b>Add</b> — XMM AI is on your Home Screen"]]
   :D.os==="android"?[["dots","Tap the <b>menu (&#8942;)</b> in Chrome"],["plus","Tap <b>Install app</b> or <b>Add to Home screen</b>"],["ok","Confirm — XMM AI is in your app drawer"]]
   :[["dots","Open your browser menu or the address bar install icon"],["plus","Click <b>Install XMM AI</b>"],["ok","XMM AI opens in its own window"]];
  var IC={share:'<path d="M12 3v12M8 7l4-4 4 4M6 11H5a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-1"/>',plus:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',ok:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',dots:'<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>'};
  var svg=function(k){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[k]+'</svg>'};
  var st=document.createElement("style");
  st.textContent='#gInst{position:fixed;inset:0;z-index:99999;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);animation:giF .35s ease both;font:15px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,system-ui,sans-serif;color:#fff}'+
  '@media(min-width:700px){#gInst{align-items:center}}'+
  '#gInst .c{position:relative;width:min(430px,100%);max-height:96vh;overflow:auto;background:linear-gradient(180deg,#26262b,#16161a);border-radius:30px 30px 0 0;padding:26px 22px calc(20px + env(safe-area-inset-bottom,0px));box-shadow:0 -20px 70px rgba(0,0,0,.55);animation:giU .6s cubic-bezier(.22,1,.36,1) both}'+
  '@media(min-width:700px){#gInst .c{border-radius:30px}}'+
  '#gInst .x{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.12);color:#cfcfd4;border:0;font-size:18px;line-height:1;cursor:pointer;transition:transform .25s cubic-bezier(.34,1.56,.64,1),background .25s}#gInst .x:active{transform:scale(.9)}'+
  '#gInst .hd{display:flex;gap:16px;align-items:center;margin-bottom:18px}'+
  '#gInst .ic{flex:none;width:96px;height:96px;border-radius:22.5%;background:#000;display:grid;place-items:center;box-shadow:0 8px 28px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.1) inset;overflow:hidden;animation:giP .8s .15s cubic-bezier(.34,1.56,.64,1) both}#gInst .ic img{width:100%;height:100%;object-fit:cover}'+
  '#gInst h3{margin:0;font-size:24px;font-weight:700;letter-spacing:-.3px}#gInst .sub{margin:2px 0 10px;color:#9a9aa2;font-size:14px}'+
  '#gInst .get{display:inline-block;min-width:84px;border:0;border-radius:999px;padding:8px 22px;background:#0a84ff;color:#fff;font:700 15px -apple-system,system-ui,sans-serif;letter-spacing:.3px;cursor:pointer;transition:transform .3s cubic-bezier(.34,1.56,.64,1),filter .2s}#gInst .get:active{transform:scale(.93)}'+
  '#gInst .stats{display:flex;border-top:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1);margin:0 -2px 18px}#gInst .stats div{flex:1;padding:12px 4px;text-align:center;border-left:1px solid rgba(255,255,255,.1)}#gInst .stats div:first-child{border:0}#gInst .stats small{display:block;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#8e8e96}#gInst .stats b{display:block;font-size:18px;margin-top:3px;color:#d4d4d9}#gInst .stats span{display:block;font-size:11.5px;color:#8e8e96}'+
  '#gInst .shots{display:flex;gap:10px;overflow:auto;margin:0 -22px 18px;padding:0 22px;scrollbar-width:none}#gInst .shots::-webkit-scrollbar{display:none}#gInst .sh{flex:none;width:118px;height:208px;border-radius:18px;border:1px solid rgba(255,255,255,.12);padding:10px;display:flex;flex-direction:column;gap:6px;animation:giU .7s cubic-bezier(.22,1,.36,1) both}#gInst .sh i{display:block;height:9px;border-radius:5px;background:rgba(255,255,255,.22)}#gInst .sh i.s{width:60%}#gInst .sh em{margin-top:auto;display:block;height:26px;border-radius:13px;background:rgba(255,255,255,.18)}'+
  '#gInst .sh:nth-child(1){background:linear-gradient(160deg,#1b3a6b,#0d1b36);animation-delay:.2s}#gInst .sh:nth-child(2){background:linear-gradient(160deg,#4a2a7a,#1b1033);animation-delay:.3s}#gInst .sh:nth-child(3){background:linear-gradient(160deg,#0f5a4a,#07241e);animation-delay:.4s}'+
  '#gInst .t{font-size:13px;font-weight:600;color:#8e8e96;text-transform:uppercase;letter-spacing:.06em;margin:4px 2px 10px}'+
  '#gInst .stp{display:flex;gap:14px;align-items:center;padding:12px 14px;margin-bottom:8px;border-radius:16px;background:rgba(255,255,255,.07);animation:giU .6s cubic-bezier(.22,1,.36,1) both}#gInst .stp:nth-of-type(1){animation-delay:.25s}#gInst .stp:nth-of-type(2){animation-delay:.35s}#gInst .stp:nth-of-type(3){animation-delay:.45s}'+
  '#gInst .stp .n{flex:none;width:36px;height:36px;border-radius:11px;background:#0a84ff;display:grid;place-items:center}#gInst .stp .n svg{width:20px;height:20px}#gInst .stp b{color:#fff}'+
  '#gInst .bad{text-align:center;padding:8px 4px 4px}#gInst .bad .e{width:64px;height:64px;margin:6px auto 12px;border-radius:50%;background:rgba(255,69,58,.15);color:#ff453a;display:grid;place-items:center;font-size:34px;font-weight:700}#gInst .bad p{margin:6px 0;color:#b4b4bb}#gInst .bad b{color:#fff}'+
  '#gInst .web{display:block;width:100%;margin-top:14px;border:0;border-radius:14px;padding:14px;background:rgba(255,255,255,.1);color:#fff;font:600 16px -apple-system,system-ui,sans-serif;cursor:pointer;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}#gInst .web:active{transform:scale(.97)}'+
  '@keyframes giF{from{opacity:0}to{opacity:1}}@keyframes giU{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}@keyframes giP{from{opacity:0;transform:scale(.6) rotate(-8deg)}to{opacity:1;transform:none}}';
  document.head.appendChild(st);
  var d=document.createElement("div");d.id="gInst";
  var head='<button class="x" type="button" aria-label="Close">&times;</button><div class="hd"><div class="ic"><img src="/chat/icon.svg" alt=""></div><div><h3>XMM AI</h3><div class="sub">Chat, code, images and voice</div>';
  if(!D.ok){
    var need=D.os==="ios"?"iOS 15 or later":"Android 5.0 or later";
    d.innerHTML='<div class="c">'+head+'</div></div><div class="bad"><div class="e">!</div><h3>Not supported</h3><p>XMM AI needs <b>'+need+'</b>.</p><p>Your '+D.name+' runs <b>'+(D.os==="ios"?"iOS ":"Android ")+D.ver+'</b>, which is too old to install the app.</p><button class="web" type="button">Continue in browser</button></div></div>';
  }else{
    d.innerHTML='<div class="c">'+head+'<button class="get" type="button">GET</button></div></div>'+
    '<div class="stats"><div><small>Price</small><b>Free</b><span>No ads</span></div><div><small>Works on</small><b>'+(D.os==="ios"?"iOS 15+":D.os==="android"?"Android 5+":"Any")+'</b><span>Phone &amp; tablet</span></div><div><small>Size</small><b>&lt; 2 MB</b><span>No download</span></div><div><small>Mode</small><b>Full</b><span>Screen app</span></div></div>'+
    '<div class="shots"><div class="sh"><i></i><i class="s"></i><i></i><em></em></div><div class="sh"><i class="s"></i><i></i><i></i><em></em></div><div class="sh"><i></i><i></i><i class="s"></i><em></em></div></div>'+
    '<div class="t">How to install</div><div id="gSteps">'+steps.map(function(s,i){return'<div class="stp"><span class="n">'+svg(s[0])+'</span><span>'+s[1]+'</span></div>'}).join("")+'</div></div>';
  }
  document.body.appendChild(d);
  function close(){d.style.transition="opacity .3s";d.style.opacity="0";setTimeout(function(){d.remove();if(!named())location.href=AUTH},280)}
  var x=d.querySelector(".x");if(x)x.onclick=close;var w=d.querySelector(".web");if(w)w.onclick=close;
  d.onclick=function(e){if(e.target===d)close()};
  var get=d.querySelector(".get");
  if(get)get.onclick=function(){
    if(deferred){try{deferred.prompt();deferred.userChoice.then(function(){d.remove()});return}catch(e){}}
    var s=d.querySelector("#gSteps");if(s){s.scrollIntoView({behavior:"smooth",block:"center"});[].forEach.call(s.children,function(c,i){c.style.animation="none";void c.offsetWidth;c.style.animation="giU .5s "+(i*.12)+"s cubic-bezier(.22,1,.36,1) both"})}
  };
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installPopup);else installPopup();
})();
