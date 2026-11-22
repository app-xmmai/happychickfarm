/* XMM AI gemini.js — Gemini layer: greeting name, suggestion chips, avatar, sidebar toggle. */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var CH=[["image","Create image",2],["write","Write",0],["analyze","Analyze",1],["code","Code",3],["trip","Plan a trip",5],["translate","Translate",4]];
function nm(){try{return String(JSON.parse(localStorage.getItem("xmm.name"))||"").trim()}catch(e){return""}}
function tick(){
 var g=$("#gmName");if(g){var t="Hi "+(nm()||"there");if(g.textContent!==t)g.textContent=t}
 var dock=$("#viewChat .dock"),comp=$(".composer");
 if(dock&&comp&&!$("#gmChips")){
  var c=document.createElement("div");c.id="gmChips";
  CH.forEach(function(x){var b=document.createElement("button");b.type="button";b.innerHTML="<i>"+XMI(x[0])+"</i><span>"+x[1]+"</span>";
   b.onclick=function(){var z=document.querySelector('#zhero .zc[data-i="'+x[2]+'"]');if(z)z.click()};c.appendChild(b)});
  comp.insertAdjacentElement("afterend",c)}
 var top=$("#clTop");
 if(top&&!$(".gm-av")){var a=document.createElement("button");a.type="button";a.className="gm-av";a.setAttribute("aria-label","Account");a.onclick=function(){var v=$("#clAv");if(v)v.click()};top.appendChild(a)}
 var av=$(".gm-av");if(av){var l=(nm()||"X").charAt(0).toUpperCase();if(av.textContent!==l)av.textContent=l}
}
document.addEventListener("click",function(e){
 var t=e.target;if(!t.closest)return;
 if(t.closest("#gmMenu")){var m=$("#clMenu");if(m)m.click();return}
 if(t.closest(".gm-sh")){var v=$("#clAv");if(v)v.click()}
},true);
/* word "galaxy" in a sent message unlocks XMMGPT-7 Galaxy */
function galCheck(){try{var m=$("#msg");if(m&&/\bgalaxy\b/i.test(m.value)&&window.XMM_SUN&&XMM_SUN.galOk&&!XMM_SUN.galOk())XMM_SUN.unlockGalaxy()}catch(e){}}
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey&&e.target&&e.target.id==="msg")galCheck()},true);
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#sendBtn"))galCheck()},true);
/* Siri-style edge glow while any pop-up is open */
var gl=document.createElement("div");gl.id="gmSiri";document.body.appendChild(gl);
setInterval(function(){gl.classList.toggle("on",!!document.querySelector(".sunpop,#xgp"))},250);
setInterval(tick,600);tick();
})();
