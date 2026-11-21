/* extra.js: "See more" for long answers + /map/<location> route */
(function(){
var open=new Set(),T=0;
function clamp(){T=0;document.querySelectorAll(".m-bot").forEach(function(m){var b=m.querySelector(".body");if(!b||b.querySelector(".genbox"))return;var id=m.getAttribute("data-i");var btn=m.querySelector(":scope>.xm-btn");
 if(open.has(id)){b.classList.remove("xm-clamp");if(btn){btn.textContent="See less"}return}
 if(!btn&&b.scrollHeight>b.clientHeight+0&&b.scrollHeight>440){b.classList.add("xm-clamp");btn=document.createElement("button");btn.type="button";btn.className="xm-btn";btn.textContent="See more";m.insertBefore(btn,b.nextSibling)}
 else if(!btn&&b.classList.contains("xm-clamp")&&b.scrollHeight<=440){b.classList.remove("xm-clamp")}})}
document.addEventListener("click",function(e){var x=e.target.closest&&e.target.closest(".xm-btn");if(!x)return;e.preventDefault();var m=x.parentNode,id=m.getAttribute("data-i"),b=m.querySelector(".body");if(open.has(id)){open.delete(id);b.classList.add("xm-clamp");x.textContent="See more"}else{open.add(id);b.classList.remove("xm-clamp");x.textContent="See less"}},true);
new MutationObserver(function(){if(!T)T=setTimeout(clamp,350)}).observe(document.body,{childList:true,subtree:true,characterData:true});
/* galaxy unlock: asking for directions to "galaxy" -> tapping the card unlocks the space background */
window.addEventListener("click",function(ev){var b=ev.target.closest&&ev.target.closest("[data-xe=nav]");if(!b||!/galax/i.test(b.getAttribute("data-q")||""))return;ev.preventDefault();ev.stopImmediatePropagation();ev.stopPropagation();
 var had=document.documentElement.classList.contains("xm-galaxy");try{localStorage.setItem("xmm.galaxy","1")}catch(_){}document.documentElement.classList.add("xm-galaxy");
 if(document.getElementById("xgp"))return;var d=document.createElement("div");d.id="xgp";d.innerHTML='<div class="xgc"><div class="xgi">\u{1F30C}</div><b>You got Galaxy Mode!</b><small>'+(had?"Space background is already on.":"Space background unlocked.")+'</small><button type="button">Awesome</button></div>';d.onclick=function(e){if(e.target===d||e.target.tagName==="BUTTON")d.remove()};document.body.appendChild(d)},true);
/* splash */
function hideXl(){var x=document.getElementById("xl");if(!x||x.className)return;var w=Math.max(0,3000-(Date.now()-(window.__xlT||0)));setTimeout(function(){x.className="out";setTimeout(function(){x.remove()},450)},w)}
if(document.readyState==="complete")hideXl();else addEventListener("load",hideXl);setTimeout(hideXl,3200);
/* /map/<location> */
var prev="/chat/",pending=null;
function slug(q){return encodeURIComponent(String(q).trim().replace(/\s+/g,"-"))}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xe=nav]");if(b)pending=b.getAttribute("data-q")},true);
setInterval(function(){var nv=document.getElementById("nv"),onMap=/^\/map\//.test(location.pathname);
 if(nv&&!onMap&&!loading){var i=nv.querySelector(".sbar input"),q=(i&&i.value.trim())||pending||"";if(q){prev=location.pathname;try{history.pushState({map:1},"","/map/"+slug(q))}catch(e){}}}
 else if(!nv&&onMap&&!loading){try{history.replaceState(null,"",prev.indexOf("/map/")===0?"/chat/":prev)}catch(e){}pending=null}},250);
addEventListener("popstate",function(){if(!/^\/map\//.test(location.pathname)&&document.getElementById("nv")&&window.XMM_NAV)window.XMM_NAV.close()});
var loading=false;
function boot(){var m=location.pathname.match(/^\/map\/(.+)$/);if(!m)return;var q;try{q=decodeURIComponent(m[1]).replace(/-+/g," ").trim()}catch(e){q=m[1]}if(!q)return;loading=true;
 var n=0,t=setInterval(function(){if(window.XMM_NAV&&window.XMM_NAV.open){clearInterval(t);pending=q;window.XMM_NAV.open(q,null);setTimeout(function(){loading=false},1500)}else if(++n>80){clearInterval(t);loading=false}},100)}
if(document.readyState==="complete")boot();else addEventListener("load",boot);
})();
