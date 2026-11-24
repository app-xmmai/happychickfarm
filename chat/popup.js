/* Upload popup: centered pop-up dialog for Camera / Photos / Video / Files */
(function(){
 if(window.__xmmPopup)return;window.__xmmPopup=1;
 var css=document.createElement("style");
 css.textContent=".xp-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .16s ease}"+
 ".xp-ov.on{opacity:1}"+
 ".xp-box{width:min(340px,calc(100vw - 32px));padding:18px;border-radius:24px;background:rgba(32,32,36,.92);color:#fff;border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 70px rgba(0,0,0,.55);transform:scale(.9) translateY(8px);transition:transform .2s cubic-bezier(.2,.9,.3,1.2);font-family:inherit}"+
 ".xp-ov.on .xp-box{transform:none}"+
 "@media (prefers-color-scheme:light){html[data-cl-theme=light] .xp-box{background:rgba(255,255,255,.95);color:#111;border-color:rgba(0,0,0,.08)}html[data-cl-theme=light] .xp-t{background:rgba(0,0,0,.05)}}"+
 "html[data-cl-theme=light] .xp-box{background:rgba(255,255,255,.96);color:#111;border-color:rgba(0,0,0,.08)}html[data-cl-theme=light] .xp-t{background:rgba(0,0,0,.05);color:#111}"+
 ".xp-h{display:flex;align-items:center;justify-content:space-between;margin:0 0 14px;font-size:17px;font-weight:600}"+
 ".xp-x{border:0;background:rgba(127,127,127,.2);color:inherit;width:28px;height:28px;border-radius:50%;font-size:16px;line-height:1;cursor:pointer}"+
 ".xp-g{display:grid;grid-template-columns:1fr 1fr;gap:10px}"+
 ".xp-t{display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 8px;border:0;border-radius:16px;background:rgba(255,255,255,.08);color:#fff;font:inherit;font-size:14px;cursor:pointer;transition:transform .12s,background .12s}"+
 ".xp-t:active{transform:scale(.94)}.xp-t svg{width:26px;height:26px}";
 document.head.appendChild(css);
 var IC={
  cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-9 9"/></svg>',
  vid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3z"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>'};
 var TILES=[["cam","Camera","image/*",1],["img","Photos","image/*",0],["vid","Video","video/*",0],["file","Files","image/*,.txt,.md,.csv,.json,.js,.ts,.py,.html,.css,.xml,.log,.pdf",0]];
 function pick(accept,cap){
  var f=document.createElement("input");f.type="file";f.className="xmm-file";f.multiple=!cap;f.accept=accept;
  if(cap)f.setAttribute("capture","environment");
  f.style.cssText="position:fixed;left:-99999px;width:0;height:0;opacity:0;pointer-events:none";
  document.body.appendChild(f);
  f.onchange=function(){try{if(f.files&&f.files.length){
   var real=document.getElementById("file");
   if(!real){real=document.createElement("input");real.type="file";real.id="file";real.className="xmm-file";real.multiple=true;real.style.cssText=f.style.cssText;document.body.appendChild(real)}
   try{var dt=new DataTransfer();[].forEach.call(f.files,function(x){dt.items.add(x)});real.files=dt.files}catch(e){}
   real.dispatchEvent(new Event("change",{bubbles:true}));}}catch(e){}
   try{f.remove()}catch(e){}};
  try{f.click()}catch(e){try{f.remove()}catch(e2){}}
 }
 var ov=null;
 function close(){if(!ov)return;var o=ov;ov=null;o.classList.remove("on");setTimeout(function(){o.remove()},180)}
 function open(){
  if(ov)return;
  ov=document.createElement("div");ov.className="xp-ov";
  ov.innerHTML='<div class="xp-box" role="dialog" aria-label="Upload"><div class="xp-h"><span>Upload</span><button class="xp-x" type="button" aria-label="Close">×</button></div><div class="xp-g">'+
   TILES.map(function(t){return'<button class="xp-t" type="button" data-k="'+t[0]+'">'+IC[t[0]]+'<span>'+t[1]+'</span></button>'}).join("")+'</div></div>';
  ov.addEventListener("click",function(e){
   if(e.target===ov||e.target.closest(".xp-x")){close();return}
   var b=e.target.closest(".xp-t");if(!b)return;
   var t=TILES.filter(function(x){return x[0]===b.dataset.k})[0];
   pick(t[2],t[3]);close();
  });
  document.body.appendChild(ov);
  requestAnimationFrame(function(){requestAnimationFrame(function(){ov&&ov.classList.add("on")})});
 }
 document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
 document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("#attBtn,#v3Add,#cvPlus");
  if(!a)return;e.stopImmediatePropagation();e.preventDefault();open();
 },true);
 /* also override the clone.js sheet opener */
 function hook(){if(window.XMM_CLONE)window.XMM_CLONE.openAdd=open;window.__ipPlus=function(){open()}}
 hook();window.addEventListener("load",function(){hook();setTimeout(hook,500)});
})();
