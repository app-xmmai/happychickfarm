/* XMM AI gemini.js — Gemini layer: greeting name, suggestion chips, avatar, sidebar toggle. */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var CH=[["🎨","Create image",2],["✏️","Write",0],["📊","Analyze",1],["💻","Code",3],["🗓️","Plan a trip",5],["🌐","Translate",4]];
function nm(){try{return String(JSON.parse(localStorage.getItem("xmm.name"))||"").trim()}catch(e){return""}}
function tick(){
 var g=$("#gmName");if(g){var t="Hi "+(nm()||"there");if(g.textContent!==t)g.textContent=t}
 var dock=$("#viewChat .dock"),comp=$(".composer");
 if(dock&&comp&&!$("#gmChips")){
  var c=document.createElement("div");c.id="gmChips";
  CH.forEach(function(x){var b=document.createElement("button");b.type="button";b.innerHTML="<i>"+x[0]+"</i><span>"+x[1]+"</span>";
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
setInterval(tick,600);tick();
})();
