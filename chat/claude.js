/* XMM AI claude.js — Claude look: wordmark, "Chats and tasks" label, Share button. */
(function(){"use strict";
var SH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>';
function tick(){
 var l=document.querySelector("#clDrawer .cl-dh>span");if(l&&l.textContent!=="XMM AI")l.textContent="XMM AI";
 var r=document.querySelector("#clDrawer .cl-rl");if(r&&r.textContent!=="Chats and tasks")r.textContent="Chats and tasks";
 var t=document.getElementById("clTop");
 if(t&&!t.querySelector(".cl-share")){var b=document.createElement("button");b.type="button";b.className="cl-share";b.innerHTML=SH+"<span>Share</span>";
  b.onclick=function(){var s=document.querySelector('[data-act="share"]');if(s)s.click()};t.appendChild(b)}
}
setInterval(tick,600);tick();
})();
