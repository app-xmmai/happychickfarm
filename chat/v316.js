/* XMM AI v316 — Claude-style shell: sidebar, top bar, composer, settings, live Preview panel.
   Reuses the existing chat engine (messages, models, uploads, voice, Build) through its own DOM/API. */
(function(){"use strict";
var D=document,H=D.documentElement,B=D.body;
function $(s,r){return (r||D).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||D).querySelectorAll(s))}
function el(t,c,h){var e=D.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function API(){return window.XMM_API||{}}
function CL(){return window.XMM_CLONE||{}}
function uname(){return String(ld("xmm.name","")||"").trim()}
function toast(t){try{API().toast(t)}catch(e){}}
function sw(c){return'<svg viewBox="0 0 24 24" aria-hidden="true">'+c+'</svg>'}
var I={
 panel:sw('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15"/>'),
 panelR:sw('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M14.5 4.5v15"/>'),
 plus:sw('<path d="M12 5v14M5 12h14"/>'),
 search:sw('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
 proj:sw('<path d="M6 4.5h12M4.5 8h15"/><rect x="3.5" y="11" width="17" height="9.5" rx="2.5"/>'),
 art:sw('<rect x="3.5" y="8" width="12" height="12" rx="3"/><path d="M8.5 8V6.5a3 3 0 0 1 3-3H17a3.5 3.5 0 0 1 3.5 3.5v5.5a3 3 0 0 1-3 3H16"/>'),
 code:sw('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'),
 plug:sw('<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4"/>'),
 chev:sw('<path d="m7 10 5 5 5-5"/>'),
 flt:sw('<path d="M4 7h16M7 12h10M10 17h4"/>'),
 dots:sw('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'),
 mic:sw('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
 wave:sw('<path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>'),
 enter:sw('<path d="M20 6v6a2 2 0 0 1-2 2H5M9 10l-4 4 4 4"/>'),
 stop:sw('<rect x="6.5" y="6.5" width="11" height="11" rx="2.5"/>'),
 x:sw('<path d="M6 6l12 12M18 6L6 18"/>'),
 copy:sw('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>'),
 dev:sw('<rect x="3" y="4" width="14" height="10" rx="2"/><path d="M7 18h6M10 14v4"/><rect x="17" y="9" width="4.5" height="9" rx="1.2"/>'),
 eye:sw('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
 spark:sw('<path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3L5.3 18.7"/>'),
 doc:sw('<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1zM14 3.5V8h4"/>'),
 sld:sw('<rect x="3.5" y="4.5" width="17" height="12" rx="2"/><path d="M12 16.5V20M8 20h8"/>'),
 dsg:sw('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-.9-.6-1.3-.6-2.1 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>'),
 ok:sw('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
 card:sw('<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18"/>'),
 pal:sw('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-.9-.6-1.3-.6-2.1 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3z"/>'),
 usr:sw('<circle cx="12" cy="8.5" r="3.7"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>'),
 cap:sw('<rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/>'),
 bell:sw('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5zM10 20.5a2 2 0 0 0 4 0"/>'),
 lock:sw('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
 sparkle:sw('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>')
};

/* ------------------------------------------------------------------ build */
var root,side,top,ctr,main,home,dock,ta,sendB,micB,waveB,panel,float_,list,flt=0,lastSig="",busyT0=0,wasBusy=false,lastOut={status:"",steps:[],out:"",files:[],t:0,done:false};
function weekday(){try{return new Date().toLocaleDateString("en-US",{weekday:"long"})}catch(e){return"day"}}
function hello(){var n=uname();return"Happy "+weekday()+(n?", "+n:"")}
function avatarCss(){var a=ld("xmm.v3.avatar","");return a?"url("+a+")":""}
function initial(){return(uname()||"X").charAt(0).toUpperCase()}

function build(){
 if($("#v3"))return;
 root=el("div");root.id="v3";root.className="v3v";root.setAttribute("data-empty","1");
 root.innerHTML=
 '<aside id="v3Side"><div class="v3-sh"><button class="v3-ib" id="v3Col" type="button" aria-label="Close sidebar">'+I.panel+'</button><span class="v3-wm">XMM AI</span></div>'+
 '<nav class="v3-nav" id="v3Nav">'+
 '<button data-n="new" class="on" type="button">'+I.plus+'<span>New</span></button>'+
 '<button data-n="search" type="button">'+I.search+'<span>Search</span></button>'+
 '<button data-n="projects" type="button">'+I.proj+'<span>Projects</span></button>'+
 '<button data-n="artifacts" type="button">'+I.art+'<span>Artifacts</span></button>'+
 '<button data-n="code" type="button">'+I.code+'<span>Code</span></button>'+
 '<button data-n="plugins" type="button">'+I.plug+'<span>Plugins</span></button></nav>'+
 '<div class="v3-lh"><button class="l" id="v3Lbl" type="button"><span>Chats and tasks</span>'+I.chev+'</button><button class="v3-ib sm" id="v3Flt" type="button" aria-label="Show more or fewer chats">'+I.flt+'</button></div>'+
 '<div class="v3-list" id="v3List"></div>'+
 '<div class="v3-user"><button class="u" id="v3Usr" type="button"><span class="v3-av" id="v3Av">X</span><span class="un"><b id="v3Un">XMM</b> · Free</span>'+I.chev+'</button><button class="v3-ib" id="v3Dev" type="button" aria-label="Get the app">'+I.dev+'</button></div></aside>'+
 '<div id="v3Scrim"></div>'+
 '<div id="v3Ctr"><header id="v3Top"><button class="v3-ib" id="v3Menu" type="button" aria-label="Open sidebar">'+I.panel+'</button>'+
 '<button id="v3Title" type="button"><span id="v3TitleT">New chat</span>'+I.chev+'</button><div class="v3-free">Free plan</div><span class="v3-sp"></span>'+
 '<button class="v3-pv" id="v3Prev" type="button">'+I.eye+'<span>Preview</span><i></i></button>'+
 '<button class="v3-ib" id="v3PanelBtn" type="button" aria-label="Toggle panel">'+I.panelR+'</button></header>'+
 '<div id="v3Main"></div>'+
 '<section id="v3Home"><h1>'+I.spark+'<span id="v3Hi"></span></h1></section>'+
 '<div id="v3Dock"><div class="v3-comp" id="v3Comp"><textarea id="v3In" rows="1" dir="auto" placeholder="How can I help you today?" aria-label="Message"></textarea>'+
 '<div class="v3-row"><button class="v3-ib" id="v3Add" type="button" aria-label="Add">'+I.plus+'</button>'+
 '<div class="v3-seg"><button class="on" data-m="chat" type="button">Chat</button><button data-m="code" type="button">Build</button></div><span class="v3-sp"></span>'+
 '<button class="v3-model" id="v3Model" type="button"></button>'+
 '<button class="v3-ib v3-mic" id="v3Mic" type="button" aria-label="Dictate">'+I.mic+'</button>'+
 '<button class="v3-go" id="v3Go" type="button" aria-label="Voice mode">'+I.wave+'</button></div></div>'+
 '<div class="v3-foot"><span>XMM AI is AI and can make mistakes. Please double-check responses.</span><button id="v3Model2" type="button"></button></div></div></div>';
 B.appendChild(root);
 side=$("#v3Side");top=$("#v3Top");ctr=$("#v3Ctr");main=$("#v3Main");home=$("#v3Home");dock=$("#v3Dock");ta=$("#v3In");sendB=$("#v3Go");micB=$("#v3Mic");list=$("#v3List");
 var sh=$("#shell-chat");if(sh)main.appendChild(sh);
 var at=$("#atts");if(at)$("#v3Comp").insertBefore(at,ta);
 panel=el("aside","v3v");panel.id="v3Panel";panel.innerHTML=
  '<div class="v3p-h"><b><i id="v3PDot"></i>Preview</b><button class="v3-ib" id="v3PClose" type="button" aria-label="Close panel">'+I.panelR+'</button></div><div class="v3p-b" id="v3PBody"></div>';
 B.appendChild(panel);
 float_=el("button","v3v");float_.id="v3Float";float_.type="button";float_.innerHTML=I.eye+"<span>Preview</span><i></i>";B.appendChild(float_);
 H.classList.add("v3");
 if(innerWidth<900)root.classList.add("col");
 wire();paintPanel(true);tick();
}

/* ------------------------------------------------------------------ actions */
function isMobile(){return innerWidth<900}
function openSide(){if(isMobile())root.classList.add("open");else root.classList.remove("col")}
function closeSide(){if(isMobile())root.classList.remove("open");else root.classList.add("col")}
function togglePanel(f){var on=typeof f==="boolean"?f:!panel.classList.contains("on");panel.classList.toggle("on",on);root.classList.toggle("pn",on&&!isMobile());if(on)paintPanel(true)}
function newChat(){try{API().newChat()}catch(e){}if(isMobile())closeSide();setTimeout(function(){ta&&ta.focus()},60)}
function srcChats(){return $$("#chatList .chat-i[data-id]")}
function openChat(id){var s=$('#chatList .chat-i[data-id="'+id+'"]');if(s)s.click();if(isMobile())closeSide()}
function chatMenu(btn,id){var its=[];try{if(window.XMM_TWIN&&XMM_TWIN.chatItems)its=XMM_TWIN.chatItems(id)||[]}catch(e){}
 its.push({label:"Delete chat",danger:1,fn:function(){try{API().delChat(id)}catch(e){}}});try{API().showMenu(btn,its,"right")}catch(e){}}
function openSearch(){
 if($("#v3Srch"))return;var o=el("div","v3v");o.id="v3Srch";
 o.innerHTML='<div class="bx"><input id="v3SIn" placeholder="Search chats" dir="auto" autocomplete="off"><div class="rs" id="v3SRs"></div></div>';B.appendChild(o);
 var inp=$("#v3SIn"),rs=$("#v3SRs");
 function go(){var q=inp.value.trim().toLowerCase(),h="",n=0;srcChats().forEach(function(c){var sp=c.querySelector("span"),t=(sp?sp.textContent:c.textContent||"").trim()||"Untitled";if(!q||t.toLowerCase().indexOf(q)>-1){h+='<button type="button" data-id="'+esc(c.dataset.id)+'" dir="auto">'+esc(t)+'</button>';n++}});rs.innerHTML=n?h:'<p>No chats found</p>'}
 inp.oninput=go;go();setTimeout(function(){inp.focus()},30);
 o.onclick=function(e){if(e.target===o){o.remove();return}var b=e.target.closest("button[data-id]");if(b){o.remove();openChat(b.dataset.id)}};
}
function navGo(k){
 if(k==="new"){newChat();return}
 if(isMobile())closeSide();
 if(k==="search"){openSearch();return}
 if(k==="projects"){var b=$('.sidenav2 [data-k="notebooks"]');if(b)b.click();return}
 if(k==="artifacts"){var s=$('#seg [data-m="code"]');if(s)s.click();return}
 if(k==="code"){var c=$("#sideCode");if(c)c.click();return}
 if(k==="plugins"){var m=$(".xmcp-btn");if(m)m.click();else openSettings("plugins");return}
}
function send(){
 var m=$("#msg");if(!m)return;var S=API().S||{};
 if(S.busy){var st=$("#sendBtn");if(st)st.click();return}
 var at=$("#atts"),has=at&&at.children.length;
 if(!ta.value.trim()&&!has)return;
 m.value=ta.value;m.dispatchEvent(new Event("input",{bubbles:true}));
 var sb=$("#sendBtn");if(sb)sb.click();
 ta.value="";fit();
}
function fit(){ta.style.height="auto";ta.style.height=Math.min(220,ta.scrollHeight)+"px"}

function wire(){
 $("#v3Col").onclick=closeSide;$("#v3Menu").onclick=openSide;$("#v3Scrim").onclick=closeSide;
 $("#v3Nav").addEventListener("click",function(e){var b=e.target.closest("button[data-n]");if(b)navGo(b.dataset.n)});
 $("#v3Flt").onclick=function(){flt=flt?0:1;lastSig="";toast(flt?"Showing recent chats":"Showing all chats")};
 $("#v3Lbl").onclick=function(){$("#v3Flt").click()};
 $("#v3Usr").onclick=function(){openSettings("acc")};
 $("#v3Dev").onclick=function(){var i=$('[data-act="install"]');if(i)i.click();else toast("Open xmm-ai.com on your phone to install")};
 list.addEventListener("click",function(e){var d=e.target.closest(".d");var r=e.target.closest(".v3-ci");if(!r)return;if(d){e.stopPropagation();chatMenu(d,r.dataset.id);return}openChat(r.dataset.id)});
 var lp=0;list.addEventListener("pointerdown",function(e){var r=e.target.closest(".v3-ci");if(!r)return;clearTimeout(lp);lp=setTimeout(function(){r.__lp=1;chatMenu(r,r.dataset.id)},560)});
 ["pointerup","pointermove","pointercancel","pointerleave"].forEach(function(n){list.addEventListener(n,function(){clearTimeout(lp)})});
 $("#v3Title").onclick=function(){var c=$("#chatList .chat-i.on");var id=c&&c.dataset.id;if(id)chatMenu($("#v3Title"),id)};
 $("#v3Prev").onclick=function(){togglePanel()};$("#v3PanelBtn").onclick=function(){togglePanel()};$("#v3PClose").onclick=function(){togglePanel(false)};
 float_.onclick=function(){togglePanel()};
 $("#v3Add").onclick=function(){try{CL().openAdd()}catch(e){var a=$("#attBtn");if(a)a.click()}};
 $("#v3Model").onclick=$("#v3Model2").onclick=function(){try{CL().openModel()}catch(e){var m=$("#modeBtn");if(m)m.click()}};
 $(".v3-seg").addEventListener("click",function(e){var b=e.target.closest("button[data-m]");if(!b)return;if(b.dataset.m==="code"){var s=$('#seg [data-m="code"]');if(s)s.click()}});
 micB.onclick=function(){var m=$("#gMic");if(m)m.click();else toast("Dictation is not available")};
 sendB.onclick=function(){var S=API().S||{};if(S.busy||ta.value.trim()||($("#atts")&&$("#atts").children.length)){send();return}try{CL().openVoice()}catch(e){var w=$("#gWave");if(w)w.click()}};
 ta.addEventListener("input",function(){fit();var m=$("#msg");if(m){m.value=ta.value;m.dispatchEvent(new Event("input",{bubbles:true}))}upd()});
 ta.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing&&!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){e.preventDefault();send()}});
 D.addEventListener("keydown",function(e){if(e.key==="Escape"){var s=$("#v3Set");if(s){s.remove();return}var q=$("#v3Srch");if(q){q.remove();return}if(panel.classList.contains("on"))togglePanel(false)}});
 /* old drawer / settings triggers now open the new ones */
 new MutationObserver(function(){if(B.classList.contains("cl-drawer")){B.classList.remove("cl-drawer");openSide()}}).observe(B,{attributes:true,attributeFilter:["class"]});
 var os=$("#settings");if(os)new MutationObserver(function(){if(!os.hidden){os.hidden=true;openSettings("acc")}}).observe(os,{attributes:true,attributeFilter:["hidden"]});
 D.addEventListener("click",function(e){var t=e.target;if(!t.closest)return;if(t.closest('[data-act="settings"]')&&!t.closest("#v3,#v3Set")){e.stopImmediatePropagation();e.preventDefault();openSettings("acc")}},true);
 addEventListener("resize",function(){if(!isMobile())root.classList.remove("open");root.classList.toggle("pn",panel.classList.contains("on")&&!isMobile())});
 addEventListener("xmm-code-start",function(){lastOut={status:"Starting…",steps:[],out:"",files:[],t:Date.now(),done:false}});
 addEventListener("xmm-code-end",function(){lastOut.done=true});
 /* the mic button of the old composer is hidden, listen to its state */
}
function upd(){var S=API().S||{},has=ta.value.trim()||($("#atts")&&$("#atts").children.length);
 var busy=!!S.busy;var want=busy?"stop":has?"send":"wave";
 if(sendB.__s!==want){sendB.__s=want;sendB.className="v3-go"+(want==="send"||want==="stop"?" send":"");sendB.innerHTML=want==="stop"?I.stop:want==="send"?I.enter:I.wave;sendB.setAttribute("aria-label",want==="wave"?"Voice mode":want==="stop"?"Stop":"Send")}}

/* ------------------------------------------------------------------ preview panel */
function snapshot(){
 var S=API().S||{},busy=!!S.busy,code=$("#code"),cd=$("#cdLog"),r={status:"",steps:[],out:"",files:[],busy:false,t:0};
 var bb=window.__v3bb;
 if(cd){
  $$(".stp",cd).forEach(function(s){r.steps.push({t:(s.textContent||"").replace(/\s+/g," ").trim(),done:s.classList.contains("done")})});
  var lv=$(".cd-live",cd);if(lv)r.status=(lv.textContent||"").replace(/\s+/g," ").trim();
  var bots=$$(".m-bot .body",cd);if(bots.length){var lb=bots[bots.length-1];if($(".think",lb))r.status=r.status||"Planning…";var tx=(lb.textContent||"").trim();if(tx)r.out=tx.slice(-2200)}
  $$(".cd-fcard",cd).forEach(function(f){var p=f.getAttribute("data-fp");if(p&&r.files.indexOf(p)<0)r.files.push(p)});
  if(!r.files.length)$$(".stp",cd).forEach(function(s){var m=/([\w\-./]+\.(html|css|js|json|md|svg|txt|py|ts|jsx))/i.exec(s.textContent||"");if(m&&r.files.indexOf(m[1])<0)r.files.push(m[1])});
 }
 var buildBusy=!!(cd&&$(".stp.active",cd))||!!(cd&&$(".cd-live",cd)&&$(".think",cd))||bb;
 if(buildBusy){r.busy=true;if(!r.status){var a=r.steps.filter(function(s){return!s.done}).pop();r.status=a?a.t:"Working…"}}
 else if(busy){
  r.busy=true;var bots2=$$("#msgs .m-bot");var lb2=bots2[bots2.length-1];
  if(lb2){var body=$(".body",lb2)||lb2;if($(".think",body)&&!(body.textContent||"").replace(/Thinking|…|\.\.\./g,"").trim())r.status="Thinking…";
   else if($(".genbox:not(.ok)",lb2))r.status="Generating an image…";
   else{r.status="Writing the answer…";var tx2=(body.textContent||"").trim();r.out=tx2.slice(-2200)}}
  else r.status="Working…";
 }
 return r;
}
function paintPanel(force){
 var body=$("#v3PBody");if(!body)return;
 var r=snapshot();
 if(r.busy&&!wasBusy){busyT0=Date.now()}
 if(r.busy){lastOut={status:r.status,steps:r.steps,out:r.out,files:r.files,t:busyT0,done:false}}
 else if(wasBusy){lastOut.done=true;if(r.steps.length||r.out||r.files.length){lastOut.steps=r.steps.length?r.steps:lastOut.steps;lastOut.out=r.out||lastOut.out;lastOut.files=r.files.length?r.files:lastOut.files}}
 wasBusy=r.busy;
 var dot=$("#v3PDot");if(dot)dot.className=r.busy?"busy":(lastOut.t?"done":"");
 [$(".v3-pv"),float_].forEach(function(b){if(b)b.classList.toggle("busy",r.busy)});
 if(!panel.classList.contains("on"))return;
 var has=lastOut.t||r.busy;
 var el_=r.busy?Math.max(0,Math.round((Date.now()-busyT0)/1000))+"s":"";
 var sig=JSON.stringify([has,r.busy,lastOut.status,lastOut.steps,lastOut.out&&lastOut.out.length,lastOut.files,lastOut.done,el_]);
 if(!force&&body.__sig===sig)return;body.__sig=sig;
 if(!has){
  body.innerHTML='<div class="v3p-empty"><small>Make something new</small>'+
   '<button type="button" data-mk="doc"><span class="ic">'+I.doc+'</span>Docs</button>'+
   '<button type="button" data-mk="sld"><span class="ic">'+I.sld+'</span>Slides</button>'+
   '<button type="button" data-mk="dsg"><span class="ic">'+I.dsg+'</span>Design</button>'+
   '<p>Open a file, artifact, or page to see it here. While XMM AI works, this panel shows exactly what it is doing.</p></div>';
  return;
 }
 var st=lastOut.done&&!r.busy?"Done":(lastOut.status||"Working…");
 var h='<div class="v3p-card"><div class="v3p-st">'+(r.busy?'<span class="sp"></span>':'<span class="ok">'+I.ok+'</span>')+'<span>'+esc(st)+'</span><em>'+esc(el_)+'</em></div></div>';
 if(lastOut.steps.length){h+='<div class="v3p-t">Steps</div><div class="v3p-steps">'+lastOut.steps.map(function(s,i){var act=r.busy&&!s.done&&i===lastOut.steps.length-1;return'<div class="v3p-step'+(s.done?" done":act?" act":"")+'"><i></i><span>'+esc(s.t)+'</span></div>'}).join("")+'</div>'}
 if(lastOut.files.length){h+='<div class="v3p-t">Files</div><div class="v3p-files">'+lastOut.files.map(function(f){return'<span>'+esc(f)+'</span>'}).join("")+'</div>'}
 if(lastOut.out){h+='<div class="v3p-t">'+(r.busy?"Live output":"Last output")+'</div><pre class="v3p-out" id="v3POut">'+esc(lastOut.out)+'</pre>'}
 if(lastOut.files.length||$("#cdLog")){h+='<button class="v3p-btn" type="button" data-open="build">Open full preview</button>'}
 body.innerHTML=h;var po=$("#v3POut");if(po)po.scrollTop=po.scrollHeight;
}
D.addEventListener("click",function(e){
 var b=e.target.closest&&e.target.closest("#v3PBody [data-mk]");
 if(b){var k=b.dataset.mk,pre=k==="doc"?"Write a document about ":k==="sld"?"Create a presentation about ":"Design a modern landing page for ";
  if(ta){ta.value=pre;ta.dispatchEvent(new Event("input",{bubbles:true}));if(isMobile())togglePanel(false);ta.focus();ta.setSelectionRange(pre.length,pre.length)}return}
 var o=e.target.closest&&e.target.closest("#v3PBody [data-open]");
 if(o){var s=$('#seg [data-m="code"]');if(s)s.click()}
});
window.addEventListener("xmm-code-start",function(){window.__v3bb=true;busyT0=Date.now()});
window.addEventListener("xmm-code-end",function(){window.__v3bb=false});

/* ------------------------------------------------------------------ list + state */
function render(){
 var src=srcChats(),sig=flt+"|"+src.map(function(c){var sp=c.querySelector("span");return c.dataset.id+":"+(c.classList.contains("on")?1:0)+":"+((sp?sp.textContent:c.textContent)||"").trim()}).join("|");
 if(sig===lastSig)return;lastSig=sig;
 var h="",i=0;
 src.forEach(function(c){if(flt&&i>=12){i++;return}var sp=c.querySelector("span"),t=(sp?sp.textContent:c.textContent||"").trim()||"Untitled";
  h+='<div class="v3-ci'+(c.classList.contains("on")?" on":"")+'" role="button" tabindex="0" data-id="'+esc(c.dataset.id)+'"><i></i><span class="t" dir="auto">'+esc(t)+'</span><span class="d" role="button" aria-label="Chat options">'+I.dots+'</span></div>';i++});
 list.innerHTML=h||'<div class="v3-none">No conversations yet</div>';
}
function tick(){
 if(!root)return;
 var mc=$("#mainChat"),empty=!mc||mc.getAttribute("data-empty")==="1";
 var vc=$("#viewChat"),other=vc&&vc.hidden;
 var e1=empty?"1":"0";if(root.getAttribute("data-empty")!==e1)root.setAttribute("data-empty",e1);
 var vw=other?"other":"chat";if(root.getAttribute("data-view")!==vw)root.setAttribute("data-view",vw);
 var nw=$('#v3Nav button[data-n="new"]');if(nw)nw.classList.toggle("on",empty&&!other);
 var hi=$("#v3Hi");if(hi){var t=hello();if(hi.textContent!==t)hi.textContent=t}
 var on=$("#chatList .chat-i.on span"),tt=on?on.textContent.trim():"New chat";var tel=$("#v3TitleT");if(tel&&tel.textContent!==(tt||"New chat"))tel.textContent=tt||"New chat";
 var mo=$("#modeBtn span"),mn=mo?mo.textContent.trim():"XMM AI";
 var m1=$("#v3Model"),m2=$("#v3Model2");if(m1&&m1.__t!==mn){m1.__t=mn;m1.innerHTML="<b>"+esc(mn)+"</b>";if(m2)m2.textContent=mn}
 var gm=$("#gMic");if(gm)micB.classList.toggle("on",gm.classList.contains("on"));
 var m=$("#msg");if(m&&D.activeElement!==ta&&m.value!==ta.value){ta.value=m.value;fit()}
 var av=$("#v3Av"),a=avatarCss(),l=initial();if(av){if(av.textContent!==(a?"":l))av.textContent=a?"":l;if(av.style.backgroundImage!==a)av.style.backgroundImage=a}
 var un=$("#v3Un");if(un&&un.textContent!==(uname()||"XMM"))un.textContent=uname()||"XMM";
 upd();render();paintPanel(false);
 /* floating Preview button while the Build screen covers the app */
 var c=$("#code"),cv=c&&c.offsetParent!==null&&getComputedStyle(c).display!=="none";
 float_.classList.toggle("on",!!cv);
}

/* ------------------------------------------------------------------ settings */
function devName(){var u=navigator.userAgent,b=/Edg\//.test(u)?"Edge":/OPR\//.test(u)?"Opera":/Firefox|FxiOS/.test(u)?"Firefox":/Chrome|CriOS/.test(u)?"Chrome":/Safari/.test(u)?"Safari":"Browser";
 var o=/iPhone|iPad|iPod/.test(u)?"iOS":/Android/.test(u)?"Android":/Windows/.test(u)?"Windows":/Mac OS X/.test(u)?"macOS":/Ubuntu/.test(u)?"Ubuntu":/Linux/.test(u)?"Linux":"";return b+(o?" ("+o+")":"")}
function uid(){var u=ld("xmm.v3.uid","");if(!u){try{u=crypto.randomUUID()}catch(e){u="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==="x"?r:(r&3|8)).toString(16)})}sv("xmm.v3.uid",u)}return u}
function fmt(t){try{return new Date(t).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch(e){return""}}
function loc(){try{var z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";return z.split("/").pop().replace(/_/g," ")}catch(e){return""}}
function themePref(){return ld("xmm.cl.theme","dark")}
function applyTheme(p){sv("xmm.cl.theme",p);var d=p!=="light";if(p==="system"){try{d=matchMedia("(prefers-color-scheme:dark)").matches}catch(e){}}H.setAttribute("data-cl-theme",d?"dark":"light");H.dataset.clTheme=d?"dark":"light"}
function row(l,c,s){return'<div class="row"><div>'+l+(s?'<small>'+s+'</small>':'')+'</div><div>'+c+'</div></div>'}
function tog(k,on){return'<button class="sw'+(on?" on":"")+'" type="button" data-sw="'+k+'" aria-label="Toggle"></button>'}
var NAV=[["acc","Account",I.usr],["bill","Billing",I.card],0,["app","Appearance",I.pal],["mem","Your XMM",I.sparkle],["cap","Capabilities",I.cap],["notif","Notifications",I.bell],["priv","Privacy",I.lock],0,["plugins","Plugins",I.plug],["code","Code",I.code]];
function page(k){
 var n=uname();
 if(k==="acc"){var a=avatarCss(),si=ld("xmm.v3.signin",0);if(!si){si=Date.now();sv("xmm.v3.signin",si)}
  var lang=$("#topLang"),lo="";if(lang){lo=$$("option",lang).map(function(o){return'<option value="'+esc(o.value)+'"'+(o.value===lang.value?" selected":"")+'>'+esc(o.textContent)+'</option>'}).join("")}
  var wk=ld("xmm.v3.work","Other");var WK=["Other","Software development","Student","Design","Business","Education","Writing","Research"];
  return'<h4>Profile</h4>'+row('Profile photo','<button class="av" id="v3PhBtn" type="button" style="'+(a?"background-image:"+a:"")+'">'+(a?"":esc(initial()))+'</button>','PNG, JPEG, or WebP, up to 10MB.')+
   row('Full name','<input class="in" id="v3Nm" maxlength="40" dir="auto" value="'+esc(n)+'">')+
   row('What should XMM call you?','<input class="in" id="v3Nm2" maxlength="40" dir="auto" value="'+esc(n)+'">')+
   row('What best describes your work?','<select class="in" id="v3Wk">'+WK.map(function(w){return'<option'+(w===wk?" selected":"")+'>'+w+'</option>'}).join("")+'</select>')+
   (lo?row('Language','<select class="in" id="v3Lg">'+lo+'</select>'):"")+
   row('User ID','<span class="cp"><code>'+esc(uid())+'</code><button class="v3-ib sm" id="v3Cp" type="button" aria-label="Copy">'+I.copy+'</button></span>')+
   '<div class="sec"><b>Where you’re logged in</b><button class="bt" id="v3Lo" type="button">Log out of all devices</button></div>'+
   '<table><thead><tr><th>Device</th><th>Location</th><th>Signed in</th><th>Last active</th></tr></thead><tbody><tr><td>'+esc(devName())+'<span class="cur">Current</span></td><td>'+esc(loc()||"—")+'</td><td>'+esc(fmt(si))+'</td><td>'+esc(fmt(Date.now()))+'</td></tr></tbody></table>'+
   '<div class="sec"><b>Installed app</b><button class="bt" id="v3Ins" type="button">Install XMM AI</button></div><p class="note">Add XMM AI to your home screen or desktop for full-screen use.</p>';}
 if(k==="bill")return'<h4>Billing</h4>'+row('Plan','Free','XMM AI is free to use. No payment details are needed.')+row('Usage','Fair use','Some features such as video have cooldowns to keep servers fast for everyone.');
 if(k==="app"){var p=themePref();return'<h4>Appearance</h4><div class="th">'+[["light","Light","l"],["dark","Dark","d"],["system","System","s"]].map(function(t){return'<button type="button" data-th="'+t[0]+'" class="'+(p===t[0]?"on":"")+'"><i class="'+t[2]+'"></i>'+t[1]+'</button>'}).join("")+'</div>'+
  row('Haptic feedback',tog("hap",ld("xmm.cl.hap",true)!==false),'Tiny vibration on taps (phones).')}
 if(k==="mem")return'<h4>Your XMM</h4><p class="note" style="margin:0 0 12px">Anything you write here is remembered and used to make answers fit you better.</p><textarea class="in" id="v3Mem" placeholder="For example: I build websites, I prefer short answers…">'+esc(ld("xmm.mem",""))+'</textarea>';
 if(k==="cap")return'<h4>Capabilities</h4>'+row('Open links in the same tab',tog("links",ld("xmm.cl.links","tab")==="same"),'Off opens links in a new tab.')+row('Voice mode','<button class="bt" id="v3Vo" type="button">Open</button>','Talk with XMM AI hands-free.');
 if(k==="notif"){var pm="";try{pm=Notification.permission}catch(e){pm="unsupported"}
  return'<h4>Notifications</h4>'+row('Browser notifications',pm==="granted"?'On':pm==="denied"?'Blocked in browser':pm==="unsupported"?'Not supported':'<button class="bt" id="v3Nf" type="button">Allow</button>','Get told when a long task such as a build is done.')}
 if(k==="priv")return'<h4>Privacy</h4>'+row('Terms of Use','<a href="https://xmm-ai.com/terms" target="_blank" rel="noopener">View</a>')+row('Privacy Policy','<a href="https://xmm-ai.com/privacy" target="_blank" rel="noopener">View</a>')+
  row('Delete all chats','<button class="bt dg" id="v3Del" type="button">Delete</button>','Removes every chat saved on this device.')+row('Log out','<button class="bt" id="v3Out" type="button">Log out</button>');
 if(k==="plugins")return'<h4>Plugins</h4>'+row('MCP server','<button class="bt" id="v3Mcp" type="button">Open</button>','Connect external tools to XMM AI.');
 if(k==="code")return'<h4>Code</h4>'+row('Build mode','<button class="bt" id="v3Bd" type="button">Open Build</button>','XMM AI Engine 5.2 writes complete files and shows them live in Preview.');
 return"";
}
function openSettings(k){
 var old=$("#v3Set");if(old)old.remove();
 var o=el("div","v3v");o.id="v3Set";
 o.innerHTML='<div class="m"><div class="h"><h3>Settings</h3><button class="v3-ib" id="v3SX" type="button" aria-label="Close">'+I.x+'</button></div><div class="c"><nav id="v3SN"><div class="sr">'+I.search+'<input id="v3SS" placeholder="Search" autocomplete="off"></div>'+
  NAV.map(function(x){return x?'<button type="button" data-k="'+x[0]+'">'+x[2]+'<span>'+x[1]+'</span></button>':'<hr>'}).join("")+'</nav><div class="p" id="v3SP"></div></div></div>';
 B.appendChild(o);var cur="acc";
 function show(key){cur=key;$$("#v3SN button").forEach(function(b){b.classList.toggle("on",b.dataset.k===key)});$("#v3SP").innerHTML=page(key)}
 show(k&&NAV.some(function(x){return x&&x[0]===k})?k:"acc");
 o.addEventListener("mousedown",function(e){if(e.target===o)o.remove()});
 $("#v3SX").onclick=function(){o.remove()};
 $("#v3SN").addEventListener("click",function(e){var b=e.target.closest("button[data-k]");if(b)show(b.dataset.k)});
 $("#v3SS").addEventListener("input",function(e){var q=e.target.value.trim().toLowerCase();$$("#v3SN button").forEach(function(b){b.style.display=!q||b.textContent.toLowerCase().indexOf(q)>-1?"":"none"})});
 var P=$("#v3SP");
 P.addEventListener("input",function(e){var t=e.target;
  if(t.id==="v3Nm"||t.id==="v3Nm2"){var v=t.value;if(v.trim()){try{API().setName(v)}catch(x){sv("xmm.name",v)}var o2=$(t.id==="v3Nm"?"#v3Nm2":"#v3Nm");if(o2&&o2!==t)o2.value=v}}
  else if(t.id==="v3Mem")sv("xmm.mem",t.value)});
 P.addEventListener("change",function(e){var t=e.target;
  if(t.id==="v3Wk")sv("xmm.v3.work",t.value);
  else if(t.id==="v3Lg"){var l=$("#topLang");if(l){l.value=t.value;l.dispatchEvent(new Event("change",{bubbles:true}))}}
  else if(t.id==="v3Ph"){var f=t.files&&t.files[0];if(!f)return;if(f.size>10*1048576){toast("Photo is larger than 10MB");return}
   var img=new Image(),u=URL.createObjectURL(f);img.onload=function(){var c=D.createElement("canvas"),s=Math.min(img.width,img.height),z=160;c.width=c.height=z;c.getContext("2d").drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,z,z);try{sv("xmm.v3.avatar",c.toDataURL("image/jpeg",.85))}catch(x){}URL.revokeObjectURL(u);show(cur)};img.src=u}});
 P.addEventListener("click",function(e){var t=e.target.closest("button,a");if(!t)return;var id=t.id;
  if(t.dataset.th){applyTheme(t.dataset.th);show("app");return}
  if(t.dataset.sw){var k2=t.dataset.sw,on=!t.classList.contains("on");t.classList.toggle("on",on);if(k2==="hap")sv("xmm.cl.hap",on);else if(k2==="links")sv("xmm.cl.links",on?"same":"tab");return}
  if(id==="v3PhBtn"){var fi=el("input");fi.type="file";fi.accept="image/png,image/jpeg,image/webp";fi.id="v3Ph";fi.style.display="none";P.appendChild(fi);fi.click();return}
  if(id==="v3Cp"){try{navigator.clipboard.writeText(uid());toast("Copied")}catch(x){}return}
  if(id==="v3Lo"||id==="v3Out"){o.remove();var lg=$("#logout");if(lg)lg.click();return}
  if(id==="v3Ins"){o.remove();var ins=$('[data-act="install"]');if(ins)ins.click();return}
  if(id==="v3Del"){if(confirm("Delete all chats on this device?")){o.remove();var ca=$("#clearAll");if(ca)ca.click()}return}
  if(id==="v3Nf"){try{Notification.requestPermission().then(function(){show("notif")})}catch(x){}return}
  if(id==="v3Vo"){o.remove();try{CL().openVoice()}catch(x){}return}
  if(id==="v3Mcp"){o.remove();var mb=$(".xmcp-btn");if(mb)mb.click();else toast("Plugins are loading, try again");return}
  if(id==="v3Bd"){o.remove();var sb=$('#seg [data-m="code"]');if(sb)sb.click();return}
 });
}
window.XMM_V3={openSettings:openSettings,togglePanel:togglePanel,openSearch:openSearch};

/* ------------------------------------------------------------------ boot */
var n=0;
(function wait(){
 if(D.body&&$("#shell-chat")&&$("#mainChat")&&$("#msg")&&(window.XMM_API||n>160)){try{B=D.body;build();setInterval(tick,260)}catch(e){try{console.error("v316",e)}catch(_){}}return}
 n++;setTimeout(wait,60);
})();
})();
