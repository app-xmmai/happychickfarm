/* XMM Videos (beta): XMM AI 1.0, 5 second real videos, gallery + chat input, 3 min cooldown */
(function(){
var COOL=180000,SPACES=["Lightricks/ltx-2"],GC="https://cdn.jsdelivr.net/npm/@gradio/client@1.8.0/dist/index.min.js";
var el,run=0,busy=false,hist=[];
try{hist=JSON.parse(localStorage.getItem("xmm.vids")||"[]")}catch(e){}
var $=function(s){return el.querySelector(s)};
var E=function(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
function css(){if(document.getElementById("xv-css"))return;var s=document.createElement("style");s.id="xv-css";s.textContent="#xv{position:fixed;inset:0;z-index:99990;background:#0b0b0e;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column}#xv .hd{padding:calc(env(safe-area-inset-top,0px) + 14px) 16px 8px;display:flex;align-items:center;gap:10px}#xv h1{font-size:22px;margin:0;flex:1;display:flex;align-items:center;gap:10px}#xv .tag{font-size:11px;padding:3px 8px;border-radius:99px;background:#f5a623;color:#000;font-weight:700}#xv .bk{border:0;background:#222;color:#fff;border-radius:50%;width:38px;height:38px;font-size:18px}#xv .gr{flex:1;overflow:auto;padding:8px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;align-content:start}#xv .cd{position:relative;background:#16161b;border-radius:14px;overflow:hidden;aspect-ratio:1}#xv .cd video{width:100%;height:100%;object-fit:cover;display:block}#xv .cd .dl{position:absolute;right:6px;top:6px;width:30px;height:30px;border-radius:50%;border:0;background:rgba(0,0,0,.65);color:#fff;font-size:15px}#xv .cd .pm{position:absolute;left:0;right:0;bottom:0;padding:18px 8px 6px;font-size:11px;background:linear-gradient(transparent,rgba(0,0,0,.8));pointer-events:none}#xv .cd.ld{display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;opacity:.8;padding:10px;animation:xvp 1.6s infinite}@keyframes xvp{50%{opacity:.45}}#xv .em{grid-column:1/-1;text-align:center;opacity:.5;margin-top:60px}#xv .bar{display:flex;gap:8px;padding:10px 16px calc(env(safe-area-inset-bottom,0px) + 14px)}#xv .bar textarea{flex:1;background:#16161b;color:#fff;border:1px solid #2a2a33;border-radius:22px;padding:12px 16px;font:16px system-ui;resize:none;height:46px;box-sizing:border-box}#xv .bar button{width:46px;height:46px;border-radius:50%;border:0;background:#2f7bff;color:#fff;font-size:20px}#xv .bar button:disabled{opacity:.5}#xv .md{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:5}#xv .md div{background:#1b1b22;border-radius:18px;padding:22px;max-width:320px;text-align:center}#xv .md button{margin-top:14px;border:0;border-radius:12px;padding:11px 22px;background:#fff;font-weight:700}";document.head.appendChild(s)}
function draw(){var g=$(".gr");g.innerHTML=(busy?'<div class="cd ld" id="xvl">Starting…</div>':"")+(hist.length?hist.map(function(h,i){return'<div class="cd"><video src="'+E(h.url)+'" playsinline controls loop preload="metadata"></video><button class="dl" data-i="'+i+'" aria-label="Download">⬇</button><div class="pm">'+E(h.prompt)+'</div></div>'}).join(""):(busy?"":'<div class="em">No videos yet. Describe one below.</div>'));
 Array.prototype.forEach.call(g.querySelectorAll(".dl"),function(b){b.onclick=function(){dl(hist[+b.dataset.i].url)}})}
function open(){if(el)return;css();el=document.createElement("div");el.id="xv";
 el.innerHTML='<div class="hd"><h1>Videos <span class="tag">BETA</span></h1><button class="bk" aria-label="Close">✕</button></div><div class="gr"></div><div class="bar"><textarea placeholder="What video do you want?" dir="auto"></textarea><button class="go" aria-label="Generate">↑</button></div>';
 document.body.appendChild(el);$(".bk").onclick=close;$(".go").onclick=gen;
 $("textarea").addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();gen()}});
 draw();
 var seen=0;try{seen=localStorage.getItem("xmm.vid.seen")}catch(e){}
 if(!seen){var m=document.createElement("div");m.className="md";m.innerHTML='<div><b>Video generation is still beta</b><p style="opacity:.75">It may look rough. We are working to make it better.</p><button>Got it</button></div>';m.querySelector("button").onclick=function(){try{localStorage.setItem("xmm.vid.seen","1")}catch(e){}m.remove()};el.appendChild(m)}}
function close(){if(el){el.remove();el=null}}
function status(t){var l=el&&el.querySelector("#xvl");if(l)l.textContent=t}
function cdLeft(){var t=0;try{t=+localStorage.getItem("xmm.vid.last")||0}catch(e){}return Math.max(0,t+COOL-Date.now())}
async function gen(){var ta=$("textarea"),pr=ta.value.trim();if(!pr||busy){ta.focus();return}
 var l=cdLeft();if(l>0){ta.value="";ta.placeholder="Cool down: wait "+Math.ceil(l/1000)+"s";setTimeout(function(){if(el)ta.placeholder="What video do you want?"},3000);return}
 ta.value="";busy=true;$(".go").disabled=true;draw();var my=++run;
 try{localStorage.setItem("xmm.vid.last",String(Date.now()))}catch(e){}
 var out=null;
 for(var si=0;si<SPACES.length&&!out;si++){try{var m0=await import(GC),c=await m0.Client.connect(SPACES[si]);
  var dep=((c.config&&c.config.dependencies)||[]).filter(function(d){return d.api_name&&/gen|video/i.test(d.api_name)})[0],ep="/"+(dep?dep.api_name:"generate_video");
  var job=c.submit(ep,{input_image:null,prompt:pr,duration:5,enhance_prompt:true,randomize_seed:true});
  for await(var m of job){if(m.type==="status")status(m.position!=null?"In queue: "+(m.position+1):"Making your video…");
   if(m.type==="data"&&m.data&&m.data[0]){var v=m.data[0];out=typeof v==="string"?v:(v.video&&v.video.url)||v.url||v.path}}}catch(e){}}
 busy=false;if(el)$(".go").disabled=false;
 if(out){hist.unshift({url:out,prompt:pr});hist=hist.slice(0,30);try{localStorage.setItem("xmm.vids",JSON.stringify(hist))}catch(e){}}
 else{try{localStorage.removeItem("xmm.vid.last")}catch(e){}if(el){ta.value=pr}}
 if(el){draw();if(!out)$(".gr").insertAdjacentHTML("afterbegin",'<div class="em" style="margin:0 0 8px">Couldn\'t make the video right now. Try again later.</div>')}}
async function dl(u){try{var b=await(await fetch(u)).blob(),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="xmm-video.mp4";a.click()}catch(e){window.open(u,"_blank")}}
var nav=document.getElementById("chatNav");
function add(){if(!nav||nav.querySelector('[data-act="video"]'))return;var b=document.createElement("button");b.className="nav-i";b.dataset.act="video";b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10l5-3v10l-5-3z"/></svg><span>Videos <small style="font-size:9px;background:#f5a623;color:#000;border-radius:6px;padding:1px 4px;margin-left:3px">BETA</small></span>';nav.appendChild(b)}
if(nav){add();new MutationObserver(add).observe(nav,{childList:true})}
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest('[data-act="video"]')){e.preventDefault();e.stopPropagation();open()}},true);
window.XMM_VIDEO={open:open,close:close};
})();
