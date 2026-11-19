/* XMM Video (beta): frame-by-frame, 5 fps, 19s between frames, 3 min cooldown per video */
(function(){
var FPS=5,GAP=19000,COOL=180000,M={"1.0":{s:5,n:"XMM Video 1.0"},"1.1":{s:7,n:"XMM Video 1.1"}};
var el,model="1.0",run=0,frames=[],busy=false,pb=0,W=512,H=512;
var $=function(s){return el.querySelector(s)};
var sleep=function(ms,tok){return new Promise(function(r){var t=Date.now(),i=setInterval(function(){if(tok!==run||Date.now()-t>=ms){clearInterval(i);r()}},250)})};
function css(){if(document.getElementById("xv-css"))return;var s=document.createElement("style");s.id="xv-css";s.textContent="#xv{position:fixed;inset:0;z-index:99990;background:#0b0b0e;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top,0px) + 14px) 16px calc(env(safe-area-inset-bottom,0px) + 16px);overflow:auto}#xv h1{font-size:22px;margin:0;display:flex;align-items:center;gap:10px}#xv .tag{font-size:11px;padding:3px 8px;border-radius:99px;background:#f5a623;color:#000;font-weight:700}#xv .bk{position:absolute;right:14px;top:calc(env(safe-area-inset-top,0px) + 12px);border:0;background:#222;color:#fff;border-radius:50%;width:38px;height:38px;font-size:18px}#xv .stage{margin:16px auto;width:min(100%,420px);aspect-ratio:1;background:#16161b;border-radius:18px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#888;text-align:center;padding:10px}#xv canvas{width:100%;height:100%;display:none}#xv textarea{width:100%;box-sizing:border-box;background:#16161b;color:#fff;border:1px solid #2a2a33;border-radius:14px;padding:12px;font:16px system-ui;min-height:70px}#xv .row{display:flex;gap:8px;margin:10px auto;width:min(100%,420px)}#xv .row button,#xv .go{flex:1;border:0;border-radius:14px;padding:13px;font:600 15px system-ui;background:#222;color:#fff}#xv .row button.on{background:#fff;color:#000}#xv .go{background:#2f7bff;width:min(100%,420px);margin:6px auto;display:block}#xv .go:disabled{opacity:.5}#xv .st{text-align:center;font-size:13px;opacity:.75;min-height:18px}#xv .wrap{width:min(100%,420px);margin:0 auto}#xv .md{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:5}#xv .md div{background:#1b1b22;border-radius:18px;padding:22px;max-width:320px;text-align:center}#xv .md button{margin-top:14px;border:0;border-radius:12px;padding:11px 22px;background:#fff;font-weight:700}";document.head.appendChild(s)}
function open(){if(el)return;css();el=document.createElement("div");el.id="xv";
 el.innerHTML='<button class="bk" aria-label="Close">✕</button><h1>Video <span class="tag">BETA</span></h1><div class="stage"><canvas width="'+W+'" height="'+H+'"></canvas><span class="ph">Describe a video and tap Generate</span></div><div class="st"></div><div class="wrap"><textarea placeholder="Describe your video…" dir="auto"></textarea></div><div class="row"><button data-m="1.0" class="on">XMM Video 1.0<br><small>up to 5s</small></button><button data-m="1.1">XMM Video 1.1<br><small>up to 7s</small></button></div><button class="go">Generate video</button><div class="row"><button class="dl" hidden>Download</button><button class="rp" hidden>Replay</button></div>';
 document.body.appendChild(el);
 $(".bk").onclick=close;
 Array.prototype.forEach.call(el.querySelectorAll("[data-m]"),function(b){b.onclick=function(){if(busy)return;model=b.dataset.m;Array.prototype.forEach.call(el.querySelectorAll("[data-m]"),function(x){x.classList.toggle("on",x===b)})}});
 $(".go").onclick=gen;$(".rp").onclick=play;$(".dl").onclick=dl;
 var seen=0;try{seen=localStorage.getItem("xmm.vid.seen")}catch(e){}
 if(!seen){var m=document.createElement("div");m.className="md";m.innerHTML='<div><b>Video generation is still beta</b><p style="opacity:.75">It may look rough. We are working to make it better.</p><button>Got it</button></div>';m.querySelector("button").onclick=function(){try{localStorage.setItem("xmm.vid.seen","1")}catch(e){}m.remove()};el.appendChild(m)}}
function close(){run++;busy=false;pb++;if(el){el.remove();el=null}}
function status(t){if(el)$(".st").textContent=t}
function cdLeft(){var t=0;try{t=+localStorage.getItem("xmm.vid.last")||0}catch(e){}return Math.max(0,t+COOL-Date.now())}
function toBmp(blob){return createImageBitmap(blob)}
function b64blob(b64){var bin=atob(b64),a=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:"image/webp"})}
async function framePoll(prompt,seed,i,n){var p=prompt+", frame "+(i+1)+" of "+n+", smooth continuous motion, same scene and subject";
 var u="https://image.pollinations.ai/prompt/"+encodeURIComponent(p)+"?width="+W+"&height="+H+"&seed="+seed+"&nologo=true";
 try{var r=await fetch(u);if(r.ok)return await r.blob()}catch(e){}
 if(window.XMM_RACE){var d=await window.XMM_RACE(p,W,H);if(d){return await (await fetch(d)).blob()}}
 throw new Error("frame failed")}
async function frameHorde(prompt,seed,i,n,tok){var p=prompt+", frame "+(i+1)+" of "+n+", smooth continuous motion, same scene and subject";
 var r=await fetch("https://aihorde.net/api/v2/generate/async",{method:"POST",headers:{"Content-Type":"application/json",apikey:"0000000000","Client-Agent":"xmmai:1:web"},body:JSON.stringify({prompt:p,params:{width:512,height:512,steps:20,n:1,seed:String(seed),sampler_name:"k_euler_a",cfg_scale:7},r2:false,shared:false,slow_workers:true})});
 var j=await r.json();if(!j.id)throw new Error("queue");
 for(var k=0;k<120;k++){if(tok!==run)throw new Error("cancel");await sleep(3000,tok);var s=await(await fetch("https://aihorde.net/api/v2/generate/status/"+j.id)).json();if(s.faulted)throw new Error("fault");if(s.done&&s.generations&&s.generations[0]){var g=s.generations[0].img;if(/^https?:/.test(g))return await(await fetch(g)).blob();return b64blob(g)}}
 throw new Error("timeout")}
async function gen(){var pr=$("textarea").value.trim();if(!pr||busy){$("textarea").focus();return}
 var l=cdLeft();if(l>0){status("Cool down: wait "+Math.ceil(l/1000)+"s before the next video");return}
 var tok=++run,secs=M[model].s,n=secs*FPS,seed=Math.floor(Math.random()*1e9);busy=true;frames=[];$(".go").disabled=true;$(".dl").hidden=$(".rp").hidden=true;
 try{localStorage.setItem("xmm.vid.last",String(Date.now()))}catch(e){}
 var cv=$("canvas"),cx=cv.getContext("2d");cv.style.display="block";$(".ph").style.display="none";
 for(var i=0;i<n;i++){if(tok!==run)return;
  status("Frame "+(i+1)+" of "+n+" · about "+Math.ceil((n-i)*GAP/60000)+" min left");
  try{var b=await(model==="1.1"?frameHorde(pr,seed,i,n,tok).catch(function(){return framePoll(pr,seed,i,n)}):framePoll(pr,seed,i,n));var bm=await toBmp(b);frames.push(bm);cx.drawImage(bm,0,0,W,H)}catch(e){if(tok!==run)return;if(frames.length<5){status("Couldn't make the video. Try again later.");busy=false;$(".go").disabled=false;try{localStorage.removeItem("xmm.vid.last")}catch(_){}return}break}
  if(i<n-1)await sleep(GAP,tok)}
 if(tok!==run)return;busy=false;$(".go").disabled=false;status("Done · "+frames.length+" frames (beta)");$(".dl").hidden=$(".rp").hidden=false;play()}
function play(){var cv=$("canvas"),cx=cv.getContext("2d"),my=++pb,i=0;(function step(){if(my!==pb||!el)return;cx.drawImage(frames[i%frames.length],0,0,W,H);i++;if(i<frames.length*3)setTimeout(step,1000/FPS)})()}
function dl(){var cv=$("canvas"),st=cv.captureStream(FPS),ch=[],mt=MediaRecorder.isTypeSupported("video/mp4")?"video/mp4":"video/webm",rc=new MediaRecorder(st,{mimeType:mt}),cx=cv.getContext("2d"),i=0;
 rc.ondataavailable=function(e){ch.push(e.data)};rc.onstop=function(){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob(ch,{type:mt}));a.download="xmm-video."+(mt==="video/mp4"?"mp4":"webm");a.click()};
 pb++;rc.start();(function step(){if(!el)return;if(i>=frames.length){rc.stop();return}cx.drawImage(frames[i++],0,0,W,H);setTimeout(step,1000/FPS)})()}
var nav=document.getElementById("chatNav");
function add(){if(!nav||nav.querySelector('[data-act="video"]'))return;var b=document.createElement("button");b.className="nav-i";b.dataset.act="video";b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10l5-3v10l-5-3z"/></svg><span>Video <small style="font-size:9px;background:#f5a623;color:#000;border-radius:6px;padding:1px 4px;margin-left:3px">BETA</small></span>';nav.appendChild(b)}
if(nav){add();new MutationObserver(add).observe(nav,{childList:true})}
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest('[data-act="video"]')){e.preventDefault();e.stopPropagation();open()}},true);
window.XMM_VIDEO={open:open,close:close};
})();
