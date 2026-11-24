/* Upload popup: "Upload or add files" dialog with drop zone */
(function(){
 if(window.__xmmPopup)return;window.__xmmPopup=1;
 var css=document.createElement("style");
 css.textContent=
 ".xp-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(0,0,0,.55);opacity:0;transition:opacity .16s ease}"+
 ".xp-ov.on{opacity:1}"+
 ".xp-box{display:flex;flex-direction:column;width:min(660px,100%);height:min(560px,86vh);border-radius:24px;background:#2b2b2d;color:#f2f2f2;border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 80px rgba(0,0,0,.6);transform:scale(.96) translateY(6px);transition:transform .18s ease;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden}"+
 ".xp-ov.on .xp-box{transform:none}"+
 ".xp-h{display:flex;align-items:center;gap:10px;padding:0 18px 0 24px;height:56px;flex:none;border-bottom:1px solid rgba(255,255,255,.1);font-size:15px;font-weight:500}"+
 ".xp-h span.t{flex:1}"+
 ".xp-bt{font-size:11px;padding:3px 10px;border-radius:99px;background:rgba(255,255,255,.12);color:rgba(255,255,255,.75)}"+
 ".xp-x{display:grid;place-items:center;width:34px;height:34px;border:0;border-radius:50%;background:none;color:inherit;cursor:pointer;padding:0;flex:none;-webkit-tap-highlight-color:transparent}"+
 ".xp-x:hover{background:rgba(255,255,255,.1)}.xp-x svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}"+
 ".xp-b{flex:1;min-height:0;padding:20px}"+
 ".xp-d{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;border-radius:16px;background:#3a3a3c;padding:20px;transition:background .15s,outline-color .15s;outline:2px dashed transparent;outline-offset:-8px}"+
 ".xp-d.over{background:#444447;outline-color:rgba(255,255,255,.4)}"+
 ".xp-d b{font-size:15px;font-weight:500}.xp-d small{font-size:13px;color:rgba(255,255,255,.62);margin-bottom:6px}"+
 ".xp-c{border:0;border-radius:10px;background:rgba(255,255,255,.18);color:#fff;font:inherit;font-size:14px;padding:8px 16px;cursor:pointer}.xp-c:hover{background:rgba(255,255,255,.26)}"+
 ".xp-m{display:none;gap:8px;margin-top:10px}.xp-m button{border:0;border-radius:99px;background:rgba(255,255,255,.12);color:#fff;font:inherit;font-size:13px;padding:7px 14px;cursor:pointer}"+
 "@media (pointer:coarse){.xp-m{display:flex}.xp-box{height:min(440px,80vh)}}"+
 "html[data-cl-theme=light] .xp-box{background:#fff;color:#141413;border-color:rgba(0,0,0,.1)}"+
 "html[data-cl-theme=light] .xp-h{border-color:rgba(0,0,0,.08)}html[data-cl-theme=light] .xp-bt{background:rgba(0,0,0,.07);color:#555}"+
 "html[data-cl-theme=light] .xp-x:hover{background:rgba(0,0,0,.07)}html[data-cl-theme=light] .xp-d{background:#f1f0ea}html[data-cl-theme=light] .xp-d small{color:#6b6a64}"+
 "html[data-cl-theme=light] .xp-c,html[data-cl-theme=light] .xp-m button{background:rgba(0,0,0,.08);color:#141413}";
 document.head.appendChild(css);
 var ALL="image/*,video/*,.txt,.md,.csv,.json,.js,.ts,.py,.html,.css,.xml,.log,.pdf";
 function deliver(files){
  if(!files||!files.length)return;
  var real=document.getElementById("file");
  if(!real){real=document.createElement("input");real.type="file";real.id="file";real.className="xmm-file";real.multiple=true;real.style.cssText="position:fixed;left:-99999px;width:0;height:0;opacity:0;pointer-events:none";document.body.appendChild(real)}
  try{var dt=new DataTransfer();[].forEach.call(files,function(x){dt.items.add(x)});real.files=dt.files}catch(e){}
  real.dispatchEvent(new Event("change",{bubbles:true}));
 }
 function pick(accept,cap){
  var f=document.createElement("input");f.type="file";f.className="xmm-file";f.multiple=!cap;f.accept=accept;
  if(cap)f.setAttribute("capture","environment");
  f.style.cssText="position:fixed;left:-99999px;width:0;height:0;opacity:0;pointer-events:none";
  document.body.appendChild(f);
  f.onchange=function(){try{deliver(f.files)}catch(e){}try{f.remove()}catch(e){}};
  try{f.click()}catch(e){try{f.remove()}catch(e2){}}
 }
 var ov=null;
 function close(){if(!ov)return;var o=ov;ov=null;o.classList.remove("on");setTimeout(function(){try{o.remove()}catch(e){}},180)}
 function open(){
  if(ov)return;
  ov=document.createElement("div");ov.className="xp-ov";
  ov.innerHTML='<div class="xp-box" role="dialog" aria-modal="true" aria-label="Upload or add files"><div class="xp-h"><span class="t">Upload or add files</span><span class="xp-bt">Beta</span><button class="xp-x" type="button" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>'+
   '<div class="xp-b"><div class="xp-d"><b>Drag files or photos here</b><small>Documents, images, spreadsheets, and code files</small><button class="xp-c" type="button" data-a="files">Choose files</button>'+
   '<div class="xp-m"><button type="button" data-a="cam">Camera</button><button type="button" data-a="img">Photos</button><button type="button" data-a="vid">Video</button></div></div></div></div>';
  var box=ov.querySelector(".xp-box"),dz=ov.querySelector(".xp-d");
  /* close: X button, backdrop, Esc */
  ov.querySelector(".xp-x").addEventListener("click",function(e){e.preventDefault();e.stopPropagation();close()});
  ov.addEventListener("mousedown",function(e){if(e.target===ov)close()});
  ov.addEventListener("touchstart",function(e){if(e.target===ov){e.preventDefault();close()}},{passive:false});
  ov.addEventListener("click",function(e){
   var b=e.target.closest("[data-a]");if(!b)return;e.stopPropagation();
   var a=b.dataset.a;
   if(a==="cam")pick("image/*",true);else if(a==="img")pick("image/*",false);else if(a==="vid")pick("video/*",false);else pick(ALL,false);
   close();
  });
  /* drag & drop */
  ["dragenter","dragover"].forEach(function(t){dz.addEventListener(t,function(e){e.preventDefault();dz.classList.add("over")})});
  ["dragleave","dragend"].forEach(function(t){dz.addEventListener(t,function(){dz.classList.remove("over")})});
  dz.addEventListener("drop",function(e){e.preventDefault();dz.classList.remove("over");var fl=e.dataTransfer&&e.dataTransfer.files;if(fl&&fl.length){deliver(fl);close()}});
  document.body.appendChild(ov);
  requestAnimationFrame(function(){requestAnimationFrame(function(){ov&&ov.classList.add("on")})});
 }
 document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
 document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("#attBtn,#v3Add,#cvPlus");
  if(!a)return;e.stopImmediatePropagation();e.preventDefault();open();
 },true);
 function hook(){if(window.XMM_CLONE)window.XMM_CLONE.openAdd=open;window.__ipPlus=function(){open()}}
 hook();window.addEventListener("load",function(){hook();setTimeout(hook,500)});
})();
