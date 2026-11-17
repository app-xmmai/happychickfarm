(function(){
"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
var api=function(){return window.XMM_API||null};
var HINT=" PERSONA OVERRIDE (this beats every earlier instruction about tone, emojis, length and style): talk like a rude dumb gen z / gen alpha bro. short blunt replies, one or two lines max, no empty lines between lines, wrong grammar on purpose, no dashes, almost no punctuation, lowercase is fine. copy how the user types (their spelling, slang, caps, speed) and adapt to it. say twin, ts and bro sometimes but not in every line and never more than once per reply, and never put an emoji right after the word twin. emojis: only once in a while, most replies have none, never mid sentence, only at the very end and only from 💔 ✌️ 😭 🥀 🫩, never 😎 and never 👍. if the question is hard or confusing or you dont know, act dumb and say idk bro✌️🫩🥀💔 or shit twin idk fr. be a little rude and cuss casually (shit, damn, ass, wtf) but never slurs and never hateful stuff. still put the real answer in there and keep facts correct. when the user asks you to build or make anything (website, app, game, script, tool) give the full working code, one complete fenced code block per file, with a one line intro in this style and nothing else long. code blocks show up as downloadable file cards. ignore any earlier rule that says always use emojis or be polite and formal.";
var GREET=/^(hi+|hey+|heya|hello+|helo|hola|hallo|yo+|sup|wassup|wsg|what'?s ?up|whats ?up|gm|good (morning|evening|afternoon)|hii+|hy+)(\s+(there|twin|bro|xmm|ai|man|dude))?[\s!?.,]*$/i;
window.XMM_TWIN={
 hint:function(){return HINT},
 local:function(t,first,hasImg){
  if(hasImg)return null;
  var s=String(t||"").trim();
  if(/^can birds fly\??$/i.test(s))return{text:"Yes, most birds can fly.",delay:700};
  if(/^can fly birds\??$/i.test(s))return{text:"🙏🥀gah dayum",delay:10000};
  if(first&&GREET.test(s))return{text:"what do u want🫩✌️🥀💔",delay:600};
  return null},
 chatItems:function(id){
  var a=api();if(!a)return[];var c=a.S.chats.find(function(x){return x.id===id});if(!c)return[];
  return[
   {label:"Rename",fn:function(){var n=prompt("Rename chat",c.title);if(n&&n.trim()){c.title=n.trim().slice(0,60);a.saveChats();a.renderList()}}},
   {label:c.pin?"Unpin":"Pin chat",fn:function(){c.pin=c.pin?0:1;a.saveChats();a.renderList()}},
   {label:"Copy chat",fn:function(){navigator.clipboard.writeText(a.transcript(c)).then(function(){a.toast("Chat copied")})}},
   {label:"Export .md",fn:function(){var md="# "+c.title+"\n\n"+c.msgs.map(function(m){return(m.role==="user"?"**You:** ":"**XMM:** ")+(m.text||"")}).join("\n\n");
     var b=new Blob([md],{type:"text/markdown"}),u=URL.createObjectURL(b),l=document.createElement("a");l.href=u;l.download=(c.title||"chat").replace(/[^\w\- ]+/g,"").slice(0,40)+".md";document.body.appendChild(l);l.click();l.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000)}}
  ]}
};
var IC={
 copy:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
 edit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
 spk:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
 down:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
 ghost:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15c1 1 5 1 6 0"/></svg>'
};
function decorate(){
 var a=api();if(!a)return;var c=a.cur();var box=$("#msgs");if(!c||!box)return;
 [].slice.call(box.children).forEach(function(el,i){
  var m=c.msgs[i];if(!m)return;
  if(el.classList.contains("m-uw")&&m.role==="user"&&m.text&&!el.querySelector(".twin-ua")){
   var u=el.querySelector(".m-user");if(!u||u.textContent!==m.text)return;
   var d=document.createElement("div");d.className="twin-ua";
   d.innerHTML='<button class="twin-ib" data-twin="ucopy" data-i="'+i+'" aria-label="Copy">'+IC.copy+'</button><button class="twin-ib" data-twin="uedit" data-i="'+i+'" aria-label="Edit message">'+IC.edit+'</button>';
   el.appendChild(d)}
  else if(el.classList.contains("m-bot")){
   var acts=el.querySelector(".m-acts");
   if(acts&&!acts.querySelector('[data-twin="tts"]')){var bi=+el.dataset.i;
    var b=document.createElement("button");b.className="icon-btn";b.setAttribute("data-twin","tts");b.setAttribute("data-i",bi);b.setAttribute("aria-label","Read aloud");b.innerHTML=IC.spk;acts.insertBefore(b,acts.children[2]||null)}}
 })}
var raf=0;function sched(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;try{decorate()}catch(e){}})}
function openEdit(el,i){
 var a=api(),c=a.cur(),m=c&&c.msgs[i];if(!m)return;
 if(a.S.busy){a.toast("wait for the reply to finish");return}
 var u=el.querySelector(".m-user"),ua=el.querySelector(".twin-ua");if(u)u.style.display="none";if(ua)ua.style.display="none";
 var w=document.createElement("div");w.className="twin-edit";w.dataset.i=i;
 w.innerHTML='<textarea rows="2"></textarea><div class="twin-eb"><button class="twin-b" data-twin="ecancel">Cancel</button><button class="twin-b pri" data-twin="esend">Send</button></div>';
 el.appendChild(w);var t=w.querySelector("textarea");t.value=m.text;t.style.height="auto";t.style.height=Math.min(t.scrollHeight,220)+"px";t.focus();
 t.addEventListener("input",function(){t.style.height="auto";t.style.height=Math.min(t.scrollHeight,220)+"px"})}
function speak(i){
 var a=api(),c=a.cur(),m=c&&c.msgs[i];if(!m)return;
 if(!window.speechSynthesis){a.toast("no voice on this browser");return}
 if(speechSynthesis.speaking){speechSynthesis.cancel();return}
 var t=String(m.text||"").replace(/```[\s\S]*?```/g," ").replace(/[*_`#>]/g,"");
 speechSynthesis.speak(new SpeechSynthesisUtterance(t))}
document.addEventListener("click",function(e){
 var b=e.target.closest&&e.target.closest("[data-twin]");if(!b)return;
 var a=api();if(!a)return;var k=b.dataset.twin,i=+b.dataset.i;
 if(k==="ucopy"){var c=a.cur(),m=c&&c.msgs[i];if(m)navigator.clipboard.writeText(m.text).then(function(){a.toast("Copied")})}
 else if(k==="uedit"){openEdit(b.closest(".m-uw"),i)}
 else if(k==="tts"){speak(i)}
 else if(k==="ecancel"){a.renderMsgs()}
 else if(k==="esend"){var w=b.closest(".twin-edit"),ix=+w.dataset.i,t=w.querySelector("textarea").value.trim();if(!t)return;
  var cc=a.cur();if(!cc)return;cc.msgs.splice(ix);a.saveChats();a.renderMsgs();a.send(t)}
 else if(k==="down"){var cv=$("#convo");if(cv)cv.scrollTo({top:cv.scrollHeight,behavior:"smooth"})}
 else if(k==="sugg"){a.send(b.dataset.t)}
 else if(k==="temp"){
  window.__twinTemp=!window.__twinTemp;document.body.classList.toggle("twin-temp-on",!!window.__twinTemp);
  b.classList.toggle("on",!!window.__twinTemp);a.newChat();a.toast(window.__twinTemp?"Temporary chat on, not saved":"Temporary chat off")}
},true);
document.addEventListener("keydown",function(e){
 var a=api();if(!a)return;var mod=e.ctrlKey||e.metaKey,key=(e.key||"").toLowerCase();
 if(mod&&key==="k"){e.preventDefault();var s=$("#sideSearch");if(s){document.body.classList.remove("collapsed");s.focus()}}
 else if(mod&&e.shiftKey&&key==="o"){e.preventDefault();a.newChat()}
 else if(key==="escape"&&a.S.busy){var sb=$("#sendBtn");if(sb)sb.click()}
 else if(key==="/"&&!mod&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||"")){e.preventDefault();var m=$("#msg");if(m)m.focus()}
});
function init(){
 var box=$("#msgs");if(!box)return;
 new MutationObserver(sched).observe(box,{childList:true});sched();
 var g=$(".greeting");
 if(g&&!$(".twin-sugg")){var s=document.createElement("div");s.className="twin-sugg";
  [["Make image of a red car at sunset","make image of a red car at sunset"],["Help me study","help me study for a test"],["Write a snake game","write a snake game in html"],["Explain something","explain black holes simply"]].forEach(function(p){
   var b=document.createElement("button");b.className="twin-chip";b.setAttribute("data-twin","sugg");b.dataset.t=p[1];b.textContent=p[0];s.appendChild(b)});
  g.parentNode.insertBefore(s,g.nextSibling)}
 var cv=$("#convo"),vc=$("#viewChat");
 if(cv&&vc&&!$(".twin-down")){var d=document.createElement("button");d.className="twin-down";d.setAttribute("data-twin","down");d.setAttribute("aria-label","Scroll to bottom");d.innerHTML=IC.down;document.body.appendChild(d);
  var upd=function(){var far=cv.scrollHeight-cv.scrollTop-cv.clientHeight>280&&!vc.classList.contains("empty");d.classList.toggle("show",far)};
  cv.addEventListener("scroll",upd,{passive:true});setInterval(upd,700)}
 var tb=$(".topbar .tb-share");
 if(tb&&!$(".twin-temp")){var t=document.createElement("button");t.className="icon-btn only-d twin-temp";t.setAttribute("data-twin","temp");t.setAttribute("aria-label","Temporary chat");t.title="Temporary chat";t.innerHTML=IC.ghost;tb.parentNode.insertBefore(t,tb)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(init,300)});else setTimeout(init,300);
})();
