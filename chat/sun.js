/* XMMGPT Sun 6.2 event: say "sun" to the AI, answer the quiz, unlock the model. After the event it becomes Sun 6.2 Lite. */
(function(){"use strict";
var EVENT_END=new Date("2026-12-16T00:00:00").getTime(),USE_MS=30*864e5,KEY="xmm.sun.unlock";
function A(){return window.XMM_SUNAPI}
function now(){return Date.now()}
function eventOn(){return now()<EVENT_END}
function unlockedAt(){try{return +JSON.parse(localStorage.getItem(KEY))||0}catch(e){return 0}}
function fullOk(){var u=unlockedAt();return !!u&&now()<u+USE_MS}
function list(){var l=[];if(fullOk()||eventOn())l.push("sun62");l.push("sun62l");return l.concat(["x25","x20","x12"])}
function locked(k){return k==="sun62"&&!fullOk()}
function allowed(k){if(k==="sun62")return fullOk();if(k==="sun62l")return true;return true}
function hint(){A().toast("Locked. Event: tell the AI \u201Csun\u201D to unlock it.")}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

/* ---- quiz card ---- */
var OPTS=["White","Orange","Yellow"];
function card(m,i){var q=m.sunQuiz,done=q.done;
 return '<div class="m-bot" data-i="'+i+'"><div class="body" dir="auto"><p>'+esc(m.text)+'</p></div>'+
 '<div class="sunq'+(done?" done":"")+'" data-i="'+i+'"><b>What colour is the sun?</b>'+OPTS.map(function(o,n){
  var st=done&&n===0?" ok":(q.bad&&q.bad.indexOf(n)>=0?" bad":"");
  return '<button type="button" class="sq-o'+st+'" data-n="'+n+'"'+(done||st===" bad"?" disabled":"")+'>'+o+'</button>'}).join("")+'</div></div>'}

function post(role,text,extra){var a=A(),c=a.cur();if(!c){c={id:a.uid(),title:"Sun",msgs:[]};a.S.chats.unshift(c);a.S.cur=c.id}
 var m={role:role,text:text};if(extra)for(var k in extra)m[k]=extra[k];if(role==="user")m.full=text;c.msgs.push(m);a.saveChats();a.renderMsgs();a.renderList();return m}
function intercept(text){
 if(!eventOn()||fullOk()||!/^\s*sun[\s.!?]*$/i.test(text))return false;
 var c=A().cur();if(c&&c.msgs.some(function(m){return m.sunQuiz&&!m.sunQuiz.done}))return false;
 post("user",text.trim());
 setTimeout(function(){post("assistant","Nice, let\u2019s see how much you know about the sun.",{sunQuiz:{bad:[]}})},550);
 return true}
function play(){var m=document.getElementById("msg");if(!m)return;A().send("sun")}

document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".sq-o");if(!b)return;
 var box=b.closest(".sunq"),i=+box.dataset.i,c=A().cur(),m=c&&c.msgs[i];if(!m||!m.sunQuiz||m.sunQuiz.done)return;var n=+b.dataset.n;
 if(n===0){m.sunQuiz.done=true;try{localStorage.setItem(KEY,JSON.stringify(now()))}catch(_){}
  A().saveChats();A().renderMsgs();
  setTimeout(function(){post("assistant","Well done! The sun is white in space. It only looks yellow because of the way the human eye sees it.");
   setTimeout(unlockPop,1100)},500)}
 else{m.sunQuiz.bad.push(n);b.classList.add("bad","shake");b.disabled=true;A().saveChats()}});

/* ---- unlock pop up + confetti ---- */
function closeAnim(el,fn){el.classList.add("out");setTimeout(function(){el.remove();fn&&fn()},320)}
function unlockPop(){var o=document.createElement("div");o.className="sunpop";
 o.innerHTML='<div class="sp-card"><div class="sp-sun"></div><h3>Congrats!</h3><p>You have unlocked the new <b>XMMGPT Sun 6.2</b> model!</p><button type="button" class="sp-go">Try it now</button></div>';
 document.body.appendChild(o);requestAnimationFrame(function(){requestAnimationFrame(function(){o.classList.add("in")})});confetti();
 o.querySelector(".sp-go").onclick=function(){A().sunSetMode("sun62");closeAnim(o)};
 o.addEventListener("click",function(e){if(e.target===o)closeAnim(o)})}
function confetti(){var cv=document.createElement("canvas");cv.className="sun-confetti";document.body.appendChild(cv);
 var x=cv.getContext("2d"),W=cv.width=innerWidth,H=cv.height=innerHeight,dpr=Math.min(devicePixelRatio||1,2);cv.width=W*dpr;cv.height=H*dpr;x.scale(dpr,dpr);
 var cols=["#ffd34d","#ff8a3d","#ffffff","#5ac8fa","#ff5e8a","#7cf29a"],P=[],n=Math.min(180,Math.round(W/6));
 for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:-20-Math.random()*H*.6,w:6+Math.random()*7,h:4+Math.random()*6,vy:2+Math.random()*3.5,vx:-1+Math.random()*2,r:Math.random()*6.28,vr:-.2+Math.random()*.4,c:cols[i%cols.length]});
 var t0=performance.now();(function f(t){var el=t-t0;x.clearRect(0,0,W,H);var alive=0;
  P.forEach(function(p){p.y+=p.vy;p.x+=p.vx+Math.sin(p.y/30)*.6;p.r+=p.vr;if(p.y<H+20)alive++;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.globalAlpha=Math.max(0,Math.min(1,(5200-el)/1200));x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});
  if(alive&&el<5200)requestAnimationFrame(f);else cv.remove()})(t0)}


/* ---- new features pop up (all devices) ---- */
/* shows on EVERY load/reload until the user claims (unlocks) the model; nothing is remembered about dismissing it */
function showWN(){if(!eventOn()||fullOk()||document.querySelector(".sunwn"))return;
 var busy=function(id){var e=document.getElementById(id);return e&&!e.hidden&&getComputedStyle(e).display!=="none"};
 if(busy("login")||busy("welcome")||document.getElementById("cine")||/\/login/.test(location.pathname)){setTimeout(showWN,150);return}
 var o=document.createElement("div");o.className="sunpop sunwn";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
 o.innerHTML='<div class="sp-card"><div class="sp-sun"></div><h3>New features!</h3><ul class="sp-fl"><li><b>XMMGPT Sun 6.2 event</b><span>Wanna play a game? Get a reward!</span></li><li><b>Smoother animations</b><span>The upload menu and model switcher now open and close smoothly.</span></li></ul><button type="button" class="sp-go">Let\u2019s play!</button><button type="button" class="sp-later">Maybe later</button></div>';
 document.body.appendChild(o);requestAnimationFrame(function(){requestAnimationFrame(function(){o.classList.add("in")})});
 function done(){}
 o.querySelector(".sp-go").onclick=function(){done();closeAnim(o,function(){play()})};
 o.querySelector(".sp-later").onclick=function(){done();closeAnim(o)};
 o.addEventListener("click",function(e){if(e.target===o){done();closeAnim(o)}})}
setTimeout(showWN,250);
window.XMM_SUN={list:list,locked:locked,allowed:allowed,hint:hint,card:card,intercept:intercept,play:play,eventOn:eventOn,fullOk:fullOk,closeAnim:closeAnim};
})();
