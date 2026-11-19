/* XMM live navigation v4 (Apple Maps style): Leaflet + OSM tiles, OSRM route with blue line, turn banner, "Recalculating…" */
(function(){
var L0="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet";
var el,map,me,dest,line,casing,wid=null,total=0,dur=0,coords=[],steps=[],q="",destLL=null,info=null,lastRoute=0,follow=true,started=false,driving=false,lastP=null,failed=0,routing=false,offCount=0,wxDone=false,ro=null,ro2=null,chev=null,vm=0,viewDeg=0,lastHead=null,roadB=null,remM=0,remT=0,lastSpd=0,lastTurn="",alts=[],roads=[],straight=false,rec=null,recOn=false,aiAbort=null,aiHist=[],lastChev=0,lastDeg=0,onRz=null;
var GC={},GI={};
var IC={
 car:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11h.5A1.5 1.5 0 0 1 21 12.5V17a1 1 0 0 1-1 1h-1.2a1.8 1.8 0 0 1-3.6 0H8.8a1.8 1.8 0 0 1-3.6 0H4a1 1 0 0 1-1-1v-4.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-2.8a.5.5 0 0 0-.5-.3H8.6a.5.5 0 0 0-.5.3L7.1 11z"/></svg>',
 call:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
 web:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
 share:'<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
 x:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 loc:'<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3.5 11.2 20 4l-7.2 16.5-1.9-7.4z"/></svg>',
 pin:'<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5c0 4.7 6.5 12.5 6.5 12.5s6.5-7.800 6.5-12.5A6.500 6.500 0 0 0 12 2.500zm0 8.800a2.300 2.300 0 1 1 0-4.600 2.300 2.300 0 0 1 0 4.600z"/></svg>',
 flag:'<svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><path d="M6 3v18M6 4h11l-2.500 4 2.500 4H6" stroke="#fff" stroke-width="2.200" stroke-linejoin="round" fill="#fff"/></svg>',
 arr:'<svg viewBox="0 0 24 24" width="38" height="38" fill="#fff"><path d="M12 3 5 12.500h4.500V21h5v-8.500H19z"/></svg>',
 cmp:'<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.7" opacity=".4"/><g class="cn" style="transform-origin:12px 12px"><path d="M12 3.800l3.200 8.200H8.800z" fill="#ff453a"/><path d="M12 20.200 8.800 12h6.400z" fill="currentColor" opacity=".6"/></g></svg>',
 ai:'<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9zM5 14l.7 2 2 .7-2 .7L5 19.5l-.7-2.1-2-.7 2-.7z"/></svg>',
 mic:'<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V6a3.500 3.500 0 0 0-7 0v5a3.500 3.500 0 0 0 3.500 3.500zM6 11a1 1 0 1 0-2 0 8 8 0 0 0 7 7.940V21H8.500a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2H13v-2.060A8 8 0 0 0 20 11a1 1 0 1 0-2 0 6 6 0 0 1-12 0z"/></svg>',
 search:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.500-3.500"/></svg>'
};
function css(){if(document.getElementById("nv-css"))return;var s=document.createElement("style");s.id="nv-css";s.textContent=
"#nv{--bg:rgba(255,255,255,.82);--fg:#111;--mu:rgba(60,60,67,.62);--sep:rgba(60,60,67,.16);--chip:rgba(118,118,128,.14);--blue:#0a84ff;position:fixed;inset:0;z-index:100000;background:#e9e7e2;font-family:-apple-system,system-ui,'SF Pro Text','Segoe UI',Roboto,sans-serif;color:var(--fg);overflow:hidden;-webkit-font-smoothing:antialiased}"+
"@media(prefers-color-scheme:dark){#nv{--bg:rgba(34,34,38,.84);--fg:#fff;--mu:rgba(235,235,245,.6);--sep:rgba(235,235,245,.16);--chip:rgba(120,120,128,.32)}}"+
"#nv .map,#nv .leaflet-container{position:absolute;inset:0;background:#e9e7e2;font-family:inherit}"+
"#nv,#nv .map{touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none}"+
".leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-zoom-animated{transform-origin:0 0}.leaflet-tile{-webkit-user-drag:none;user-select:none}"+
"#nv img,.xe-mini img{max-width:none!important;max-height:none!important;min-width:0!important;border-radius:0!important;aspect-ratio:auto!important}#nv .leaflet-overlay-pane svg,#nv .leaflet-overlay-pane canvas,.xe-mini .leaflet-overlay-pane svg,.xe-mini .leaflet-overlay-pane canvas{max-width:none!important;max-height:none!important}"+
"#nv .leaflet-tile-pane img{width:256px;height:256px}"+
"#nv.pre.hr .turn{display:flex;padding:9px 14px;border-radius:18px}#nv.pre.hr .turn .ti{width:36px;height:36px}#nv.pre.hr .turn b{font-size:17px}"+
"#nv .fabs .aib{background:var(--blue);color:#fff}#nv .aip{position:absolute;z-index:1002;left:8px;right:8px;bottom:calc(var(--sh,200px) + 12px);border-radius:24px;padding:12px;display:none;flex-direction:column;gap:10px;max-height:56%}#nv .aip.on{display:flex}"+
"#nv .aih{display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:15px}#nv .aih button{width:30px;height:30px;border-radius:50%;border:0;background:var(--chip);display:grid;place-items:center}"+
"#nv .aio{overflow:auto;-webkit-overflow-scrolling:touch;font-size:16px;line-height:1.42;min-height:44px;max-height:32vh;white-space:pre-wrap;touch-action:pan-y;user-select:text;-webkit-user-select:text}#nv .aio .u{color:var(--mu);font-size:14px;margin-bottom:6px}#nv .aio .e{color:#ff453a}"+
"#nv .aic{display:flex;gap:6px;flex-wrap:wrap}#nv .aic button{border:0;border-radius:99px;background:var(--chip);padding:7px 12px;font-size:13px;font-weight:600;color:var(--blue)}"+
"#nv .air{display:flex;gap:8px;align-items:center}#nv .air input{flex:1;min-width:0;height:46px;border-radius:14px;border:0;background:var(--chip);padding:0 12px;font-size:16px;font-family:inherit;color:var(--fg);outline:0;-webkit-user-select:text;user-select:text}"+
"#nv .mic{width:48px;height:48px;border-radius:50%;border:0;background:var(--blue);color:#fff!important;display:grid;place-items:center;flex:none}#nv .mic.on{background:#ff453a;animation:nvm 1.1s infinite}@keyframes nvm{50%{box-shadow:0 0 0 10px rgba(255,69,58,.2)}}"+
"#nv .map{transform-origin:50% 50%}#nv.rot .map{inset:auto;left:-70%;top:-70%;width:240%;height:240%;transition:transform .4s ease-out;will-change:transform}#nv.rot .leaflet-control-attribution{display:none}"+
"#nv .fade{position:absolute;left:0;right:0;top:0;height:34%;z-index:500;pointer-events:none;background:linear-gradient(#e9e7e2 8%,rgba(233,231,226,0));opacity:0;transition:opacity .3s}#nv.tilt .fade{opacity:1}"+
"#nv .nv-attr{position:absolute;z-index:600;left:6px;bottom:calc(var(--sh,200px) + 4px);font-size:9px;background:rgba(255,255,255,.7);color:#333;padding:1px 4px;border-radius:4px;display:none}#nv.rot .nv-attr{display:block}"+
"#nv .nv-op{transform:rotate(var(--un,0deg)) scaleY(var(--sy,1));transform-origin:60px 53px}#nv .nv-me{transform:rotate(var(--un,0deg)) scaleY(var(--sy,1))}"+
"#nv .fabs .cmp .cn{transition:transform .4s ease-out}#nv .fabs .cmp svg{transition:transform .3s}#nv .fabs .cmp.m1{background:var(--chip)}#nv .fabs .cmp.m2{background:var(--blue);color:#fff}#nv .fabs .cmp.m2 svg{transform:perspective(60px) rotateX(48deg)}"+
".nv-ch{width:16px;height:16px;display:grid;place-items:center;pointer-events:none}.nv-ch svg{width:14px;height:14px;display:block}"+
"#nv .leaflet-control-attribution{font-size:9px;background:rgba(255,255,255,.7);margin:0 0 calc(var(--sh,0px) + 4px) 0}"+
"#nv .gl{background:var(--bg);-webkit-backdrop-filter:blur(26px) saturate(1.8);backdrop-filter:blur(26px) saturate(1.8);box-shadow:0 8px 32px rgba(0,0,0,.16),0 0 0 .5px rgba(255,255,255,.5) inset;border:.5px solid var(--sep)}"+
"#nv button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}"+
"#nv .top{position:absolute;z-index:1000;left:12px;right:12px;top:calc(env(safe-area-inset-top,0px) + 10px);display:flex;flex-direction:column;gap:8px;pointer-events:none}"+
"#nv .top>*{pointer-events:auto}"+
"#nv .wx{align-self:flex-start;display:none;align-items:center;gap:6px;border-radius:99px;padding:7px 13px 7px 10px;font-weight:600;font-size:15px}"+
"#nv .wx.on{display:flex}"+
"#nv .sbar{display:flex;align-items:center;gap:10px;border-radius:16px;padding:0 6px 0 14px;height:46px}"+
"#nv .sbar svg{flex:none;opacity:.55}"+
"#nv .sbar input{flex:1;min-width:0;border:0;background:none;outline:0;font:500 17px inherit;color:var(--fg);padding:0}"+
"#nv .sbar input::placeholder{color:var(--mu)}"+
"#nv .sbar .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#8ea0ff,#6c7be0);color:#fff;font:600 13px inherit;display:grid;place-items:center;border:0}"+
"#nv .turn{display:none;align-items:center;gap:14px;border-radius:22px;padding:12px 16px;background:linear-gradient(135deg,#0a84ff,#2563eb)!important;color:#fff;border:0}"+
"#nv:not(.pre) .turn{display:flex}#nv:not(.pre) .sbar{display:none}"+
"#nv .turn .ti{width:44px;height:44px;display:grid;place-items:center;flex:none}#nv .turn .ti svg{transition:transform .3s}"+
"#nv .turn .tt{min-width:0;flex:1}#nv .turn small{display:block;font-size:13px;opacity:.8;font-weight:600}#nv .turn b{display:block;font-size:21px;font-weight:700;line-height:1.15;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}"+
"#nv .rcl{align-self:center;display:none;align-items:center;gap:9px;border-radius:99px;padding:9px 16px;font-weight:700;font-size:15px}"+
"#nv .rcl.on{display:flex}#nv .rcl i{width:16px;height:16px;border-radius:50%;border:2.5px solid var(--sep);border-top-color:var(--blue);animation:nvs .8s linear infinite}"+
"@keyframes nvs{to{transform:rotate(360deg)}}"+
"#nv .fabs{position:absolute;z-index:1000;right:12px;bottom:calc(var(--sh,200px) + 18px);border-radius:16px;display:flex;flex-direction:column;overflow:hidden}"+
"#nv .fabs button{width:46px;height:46px;border:0;background:none;display:grid;place-items:center;font-size:24px;font-weight:300;color:var(--blue)}#nv .fabs button+button{border-top:.5px solid var(--sep)}#nv .fabs button:active{background:var(--chip)}"+
"#nv .sheet,#nv .drv{position:absolute;z-index:1000;left:8px;right:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);border-radius:30px;padding:8px 16px 16px}"+
"#nv .sheet::before{content:'';display:block;width:38px;height:5px;border-radius:3px;background:var(--sep);margin:0 auto 10px}"+
"#nv:not(.pre) .sheet{display:none}#nv.pre .drv{display:none}"+
"#nv .hd{display:flex;align-items:center;gap:10px}"+
"#nv .rb{width:34px;height:34px;border-radius:50%;border:0;background:var(--chip);display:grid;place-items:center;flex:none;color:var(--mu)}"+
"#nv .nm{flex:1;min-width:0;text-align:center}#nv .nm b{display:block;font-size:19px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#nv .nm small{display:block;font-size:13px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}"+
"#nv .acts{display:flex;gap:8px;margin-top:14px}"+
"#nv .acts>*{flex:1;border:0;border-radius:14px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-weight:600;font-size:12px;text-decoration:none;background:var(--chip);color:var(--blue)}"+
"#nv .acts .st{background:var(--blue);color:#fff;flex:1.15}#nv .acts .st b{font-size:15px;font-weight:700;line-height:1}"+
"#nv .acts .off{opacity:.42;pointer-events:none}"+
"#nv .stats{display:flex;margin-top:14px;border-top:.5px solid var(--sep);padding-top:12px}"+
"#nv .stats>div{flex:1;text-align:center;min-width:0;padding:0 4px}#nv .stats>div+div{border-left:.5px solid var(--sep)}"+
"#nv .stats small{display:block;font-size:11px;color:var(--mu);font-weight:600;text-transform:none}#nv .stats b{display:block;font-size:16px;font-weight:700;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
"#nv .drv .row{display:flex;align-items:center;gap:6px}#nv .drv .row>div{flex:1;text-align:center}"+
"#nv .drv b{display:block;font-size:26px;font-weight:800;letter-spacing:-.4px;line-height:1.05;font-variant-numeric:tabular-nums}#nv .drv .tm{color:#22a95a}#nv .drv small{font-size:12px;color:var(--mu);font-weight:600}"+
"#nv .drv .ex{border:0;background:#ff453a;color:#fff;font-weight:700;font-size:16px;border-radius:16px;padding:0 20px;height:46px;flex:none}"+
"#nv .spd{position:absolute;z-index:1000;left:12px;bottom:calc(var(--sh,200px) + 18px);width:62px;height:62px;border-radius:50%;display:none;flex-direction:column;align-items:center;justify-content:center}"+
"#nv:not(.pre) .spd{display:flex}#nv .spd b{font-size:22px;line-height:1;font-weight:800}#nv .spd small{font-size:9px;color:var(--mu);font-weight:700}"+
".nv-me{position:relative;width:22px;height:22px}.nv-me i{position:absolute;inset:0;border-radius:50%;background:rgba(10,132,255,.28);animation:nvp 2s infinite}.nv-me u{position:absolute;inset:3px;border-radius:50%;background:#0a84ff;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)}"+
"@keyframes nvp{0%{transform:scale(.8);opacity:1}100%{transform:scale(2.4);opacity:0}}"+
".nv-op{position:relative;width:120px;height:74px;font-family:-apple-system,system-ui,'Segoe UI',sans-serif}.nv-op i{position:absolute;left:38px;top:0;width:44px;height:44px;border-radius:50%;background:linear-gradient(180deg,#ff9f0a,#ff7a00);border:3px solid #fff;display:grid;place-items:center;box-shadow:0 4px 12px rgba(0,0,0,.35)}.nv-op i::after{content:'';position:absolute;left:50%;bottom:-9px;margin-left:-6px;border:6px solid transparent;border-top:8px solid #fff;border-bottom:0}.nv-op i svg{width:22px;height:22px}.nv-op span{position:absolute;left:0;right:0;top:52px;text-align:center;font-size:12px;font-weight:700;color:#7a3b00;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
".xe-mini{width:100%;height:190px;border-radius:16px;margin:8px 0;overflow:hidden;background:#e9e7e2;position:relative;z-index:0}.xe-mini .leaflet-control-attribution{font-size:8px}";
document.head.appendChild(s)}
var LQ=[],LS=0;function load(cb){if(window.L&&LS===2)return cb();LQ.push(cb);if(LS)return;LS=1;var n=2,fin=false,go=function(){if(fin)return;if(--n>0)return;fin=true;LS=2;var q=LQ.splice(0);q.forEach(function(f){try{f()}catch(e){}})};var l=document.createElement("link");l.rel="stylesheet";l.href=L0+".min.css";l.onload=go;l.onerror=go;document.head.appendChild(l);var s=document.createElement("script");s.src=L0+".min.js";s.onload=go;s.onerror=function(){LS=0;LQ=[];alert("Could not load the map");close()};document.head.appendChild(s);setTimeout(function(){if(!fin&&window.L){n=1;go()}},2500)}
function hav(a,b){var R=6371000,r=Math.PI/180,dl=(b[0]-a[0])*r,dg=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dg/2)*Math.sin(dg/2);return 2*R*Math.asin(Math.sqrt(x))}
function brg(a,b){var r=Math.PI/180,y=Math.sin((b[1]-a[1])*r)*Math.cos(b[0]*r),x=Math.cos(a[0]*r)*Math.sin(b[0]*r)-Math.sin(a[0]*r)*Math.cos(b[0]*r)*Math.cos((b[1]-a[1])*r);return(Math.atan2(y,x)/r+360)%360}
function ahead(p,i,m){var d=0,k=i;while(k<coords.length-1&&d<m){d+=hav(coords[k],coords[k+1]);k++}return coords[Math.min(k,coords.length-1)]}
function smooth(d){var diff=((d-lastDeg)%360+540)%360-180;lastDeg+=diff;return lastDeg}
function drawChev(pts){if(!map||!window.L)return;if(chev){map.removeLayer(chev);chev=null}if(!pts||pts.length<2)return;chev=L.layerGroup();var tot=0,i;for(i=0;i<pts.length-1;i++)tot+=hav(pts[i],pts[i+1]);var step=Math.max(120,tot/30),acc=step*.6,cnt=0;
 for(i=0;i<pts.length-1&&cnt<40;i++){var seg=hav(pts[i],pts[i+1]);acc+=seg;if(acc>=step){acc=0;var j=Math.min(pts.length-1,i+1),k=j,d=0;while(k<pts.length-1&&d<25){d+=hav(pts[k],pts[k+1]);k++}var a=brg(pts[i],pts[k>i?k:i+1]);cnt++;
  L.marker(pts[i],{interactive:false,keyboard:false,zIndexOffset:100,icon:L.divIcon({className:"",iconSize:[16,16],iconAnchor:[8,8],html:'<div class="nv-ch"><svg viewBox="0 0 24 24" style="transform:rotate('+Math.round(a)+'deg)" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16l7-9 7 9"/></svg></div>'})}).addTo(chev)}}
 chev.addTo(map)}
function fmtT(s){s=Math.max(0,Math.round(s/60));if(s>=60){var h=Math.floor(s/60),m=s%60;return h+" h "+(m?m+" min":"")}return(s<1?"<1":s)+" min"}
function fmtD(m){return m>=1000?(m/1000).toFixed(m>=10000?0:1)+" km":Math.max(10,Math.round(m/10)*10)+" m"}
function $(s){return el&&el.querySelector(s)}
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function opIcon(name){return L.divIcon({className:"",html:'<div class="nv-op"><i>'+IC.pin+'</i><span>'+esc(name||"")+'</span></div>',iconSize:[120,74],iconAnchor:[60,53]})}
function geoFull(query,cb,err){if(GI[query])return cb(GI[query]);fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&extratags=1&q="+encodeURIComponent(query)).then(function(r){return r.json()}).then(function(j){if(!j[0]){err&&err();return}var o=j[0],x=o.extratags||{};GI[query]={ll:[+o.lat,+o.lon],full:o.display_name||"",phone:x.phone||x["contact:phone"]||"",web:x.website||x["contact:website"]||"",hours:x.opening_hours||""};GC[query]=GI[query].ll;cb(GI[query])}).catch(function(){err&&err()})}
function geo(query,cb,err){if(GC[query])return cb(GC[query]);geoFull(query,function(i){cb(i.ll)},err)}
function status(on,txt){var r=$(".rcl");if(!r)return;r.classList.toggle("on",!!on);if(txt)r.querySelector("span").textContent=txt}
function draw(pts){if(line){map.removeLayer(line);map.removeLayer(casing)}
 casing=L.polyline(pts,{color:"#fff",weight:12,opacity:1,lineCap:"round",lineJoin:"round",interactive:false}).addTo(map);
 line=L.polyline(pts,{color:"#0a84ff",weight:7.5,opacity:1,lineCap:"round",lineJoin:"round",interactive:false}).addTo(map);drawChev(pts)}
function near(pt){var bi=0,bd=1e12;for(var i=0;i<coords.length;i++){var d=hav(pt,coords[i]);if(d<bd){bd=d;bi=i}}return[bi,bd]}
function getRoute(from){lastRoute=Date.now();routing=true;var re=coords.length>0;status(true,re?"Recalculating…":"Calculating route…");if(re&&driving)setTurn("Recalculating…","Finding a new route",0,"arr");
 fetch("https://router.project-osrm.org/route/v1/driving/"+from[1]+","+from[0]+";"+destLL[1]+","+destLL[0]+"?overview=full&geometries=geojson&steps=true&alternatives=true").then(function(r){return r.json()}).then(function(j){var r=j.routes&&j.routes[0];if(!r)throw 0;failed=0;offCount=0;
  coords=r.geometry.coordinates.map(function(c){return[c[1],c[0]]});total=r.distance;dur=r.duration;straight=false;alts=(j.routes||[]).slice(1).map(function(x){return{d:x.distance,t:x.duration}});
  steps=[];((r.legs&&r.legs[0]&&r.legs[0].steps)||[]).forEach(function(s){var m=s.maneuver||{};if(!m.location||m.type==="depart")return;steps.push({ll:[m.location[1],m.location[0]],type:m.type,mod:m.modifier||"",name:s.name||"",exit:m.exit,idx:near([m.location[1],m.location[0]])[0]})});
  roads=[];steps.forEach(function(x){if(x.name&&roads.indexOf(x.name)<0)roads.push(x.name)});draw(coords);routing=false;status(false);var sub=$(".top .rcl span");
  if(!started){started=true;fit()}else if(!driving)fit();upd(from)}).catch(function(){routing=false;status(false);if(++failed>2||!coords.length){coords=[from,destLL];steps=[];alts=[];roads=[];straight=true;total=hav(from,destLL);dur=total/13;draw(coords);if(line)line.setStyle({dashArray:"2 14"});if(!started){started=true;fit()}upd(from)}})}
function fit(){if(!line||driving||!map||vm>0)return;var h=($(".sheet")||{}).offsetHeight||200;var tp=($(".top")||{}).offsetHeight||130;map.invalidateSize();map.fitBounds(line.getBounds(),{paddingTopLeft:[36,tp+24],paddingBottomRight:[36,h+30],maxZoom:17,animate:false})}
function rot(mod,type){if(/roundabout|rotary/.test(type))return 0;return({"straight":0,"slight right":35,"right":90,"sharp right":135,"uturn":180,"sharp left":-135,"left":-90,"slight left":-35})[mod]||0}
function words(s){var m=s.mod,t=s.type,nm=s.name?(" onto "+s.name):"";
 if(t==="arrive")return"Arrive at destination";
 if(/roundabout|rotary/.test(t))return"Take the roundabout"+(s.exit?" · exit "+s.exit:"");
 if(t==="fork")return"Keep "+(/left/.test(m)?"left":"right")+nm;
 if(m==="uturn")return"Make a U-turn";
 if(m==="straight"||!m)return"Continue straight"+(s.name?" on "+s.name:"");
 return(/slight/.test(m)?"Bear ":/sharp/.test(m)?"Sharp ":"Turn ")+(m.replace(/slight |sharp /,""))+nm}
function setTurn(a,b,deg,ic){lastTurn=a+" "+b;var t=$(".turn");if(!t)return;t.querySelector("small").textContent=a;t.querySelector("b").textContent=b;var i=t.querySelector(".ti");i.innerHTML=ic==="flag"?IC.flag:IC.arr;var s=i.firstChild;if(s&&ic!=="flag")s.style.transform="rotate("+smooth(deg)+"deg)"}
function upd(p){if(!coords.length||!el)return;var n=near(p),bi=n[0],bd=n[1];
 if(bd>80&&!routing&&Date.now()-lastRoute>6000){if(++offCount>=2||!driving){getRoute(p);return}}else if(bd<=80)offCount=0;
 var rem=bd;for(var j=bi;j<coords.length-1;j++)rem+=hav(coords[j],coords[j+1]);
 var t=total?dur*rem/total:0;remM=rem;remT=t;$(".km").textContent=fmtD(rem);$(".tm").textContent=fmtT(t);
 if(coords.length>1)roadB=brg(p,ahead(p,bi,90));if(!el.classList.contains("hr")){el.classList.add("hr");sh()}
 if(!driving&&!routing&&rem>=30){var tg=ahead(p,bi,90);setTurn("Route ready \u00b7 "+fmtD(rem),"Follow the arrow to "+title(),brg(p,tg),"arr")}
 var eta=new Date(Date.now()+t*1000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
 $(".eta").textContent=eta;var s1=$(".s-km"),s2=$(".s-eta"),s3=$(".st b");if(s1)s1.textContent=fmtD(rem);if(s2)s2.textContent=eta;if(s3)s3.textContent=fmtT(t);
 if(driving&&!routing){
  if(rem<30){setTurn("You have arrived",title(),0,"flag")}
  else{var nx=null;for(var k=0;k<steps.length;k++)if(steps[k].idx>bi){nx=steps[k];break}
   if(nx){var dd=hav(p,coords[Math.min(coords.length-1,bi+1)]);for(var m=bi+1;m<nx.idx;m++)dd+=hav(coords[m],coords[m+1]);setTurn("In "+fmtD(dd),words(nx),brg(p,ahead(p,bi,Math.min(120,Math.max(40,dd)))),nx.type==="arrive"?"flag":"arr")}
   else setTurn("Continue",fmtD(rem)+" to "+title(),brg(p,ahead(p,bi,90)),"arr")}
  var rest=[p].concat(coords.slice(bi+1));casing.setLatLngs(rest);line.setLatLngs(rest);if(Date.now()-lastChev>2500){lastChev=Date.now();drawChev(rest)}}}
function title(){return String(q).split(",")[0]}
function weather(p){if(wxDone||!p)return;wxDone=true;fetch("https://api.open-meteo.com/v1/forecast?latitude="+p[0]+"&longitude="+p[1]+"&current=temperature_2m,weather_code").then(function(r){return r.json()}).then(function(j){var c=j.current;if(!c||!el)return;var w=c.weather_code,e=w===0?"☀️":w<3?"⛅":w<50?"☁️":w<70?"🌧️":w<80?"🌨️":w<95?"🌦️":"⛈️";var x=$(".wx");x.textContent=e+" "+Math.round(c.temperature_2m)+"°";x.classList.add("on")}).catch(function(){})}
function onPos(pos){var p=[pos.coords.latitude,pos.coords.longitude];lastP=p;var hh=pos.coords.heading;if(typeof hh==="number"&&!isNaN(hh))lastHead=hh;weather(p);
 if(!me){me=L.marker(p,{icon:L.divIcon({className:"",html:'<div class="nv-me"><i></i><u></u></div>',iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:900}).addTo(map)}else me.setLatLng(p);
 if(!coords.length){if(!routing&&Date.now()-lastRoute>3000&&destLL)getRoute(p);else if(!destLL&&!routing&&Date.now()-lastRoute>3000)geo(q,function(d){destLL=d;getRoute(p)});return}
 upd(p);lastSpd=Math.round((pos.coords.speed||0)*3.6);var s=$(".spv");if(s)s.textContent=lastSpd;
 if(vm>0&&follow)map.setView(p,Math.max(map.getZoom(),vm===2?17:16),{animate:false});else if(driving&&follow)map.setView(p,Math.max(map.getZoom(),17),{animate:true});applyView()}
function sh(){if(!el)return;var b=$(".sheet"),d=$(".drv"),h=(el.classList.contains("pre")?b:d).offsetHeight+8;el.style.setProperty("--sh",h+"px")}
function setDest(d,inf){destLL=d;info=inf||info;if(!el||!map)return;if(dest)map.removeLayer(dest);dest=L.marker(d,{icon:opIcon(title()),zIndexOffset:500}).addTo(map);if(!lastP)map.setView(d,14);
 if(info){var sub=$(".nm small");if(sub){var rest=String(q).split(",").slice(1).join(",").trim()||String(info.full||"").split(",").slice(1,4).join(",").trim();sub.textContent=rest}
  var c=$(".acts .call"),w=$(".acts .web");if(c&&info.phone){c.href="tel:"+info.phone.split(/[;,]/)[0].replace(/\s/g,"");c.classList.remove("off")}
  if(w&&info.web){w.href=/^https?:/i.test(info.web)?info.web:"https://"+info.web;w.classList.remove("off")}
  if(info.hours){var hb=$(".s-hr");if(hb){hb.parentNode.style.display="";hb.textContent=info.hours.split(";")[0].slice(0,22)}}}}
function search(v){v=String(v||"").trim();if(!v)return;q=v;coords=[];steps=[];destLL=null;info=null;started=false;if(line){map.removeLayer(line);map.removeLayer(casing);line=null;casing=null}
 $(".nm b").textContent=title();$(".nm small").textContent="";status(true,"Searching…");
 geoFull(v,function(i){status(false);setDest(i.ll,i);if(lastP)getRoute(lastP)},function(){status(true,"Place not found");setTimeout(function(){status(false)},2000)})}
function open(query,ll){close();q=query;destLL=ll||null;info=null;started=false;driving=false;follow=true;coords=[];steps=[];me=null;line=null;casing=null;failed=0;lastRoute=0;routing=false;offCount=0;wxDone=false;chev=null;lastChev=0;lastDeg=0;vm=0;viewDeg=0;lastHead=null;roadB=null;
 if(!navigator.geolocation){alert("Location is not supported");return}
 css();el=document.createElement("div");el.id="nv";el.className="pre";
 el.innerHTML='<div class="map"></div><div class="fade"></div><div class="nv-attr">© OpenStreetMap</div>'+
 '<div class="top"><div class="wx gl"></div><div class="sbar gl">'+IC.search+'<input type="text" placeholder="Search Maps" enterkeyhint="search"><button class="av" aria-label="Close">'+'✕'+'</button></div>'+
 '<div class="turn gl"><div class="ti">'+IC.arr+'</div><div class="tt"><small>Starting…</small><b>Calculating route…</b></div></div><div class="rcl gl"><i></i><span>Calculating route…</span></div></div>'+
 '<div class="spd gl"><b class="spv">0</b><small>KM/H</small></div>'+
 '<div class="fabs gl"><button class="cmp" aria-label="View angle">'+IC.cmp+'</button><button class="aib" aria-label="Ask AI">'+IC.ai+'</button><button class="rc" aria-label="My location">'+IC.loc+'</button><button class="zi" aria-label="Zoom in">+</button><button class="zo" aria-label="Zoom out">−</button></div>'+
 '<div class="sheet gl"><div class="hd"><button class="rb shr" aria-label="Share">'+IC.share+'</button><div class="nm"><b></b><small></small></div><button class="rb cls" aria-label="Close">'+IC.x+'</button></div>'+
 '<div class="acts"><button class="st">'+IC.car+'<b>--</b></button><a class="call off" role="button">'+IC.call+'Call</a><a class="web off" target="_blank" rel="noopener" role="button">'+IC.web+'Website</a></div>'+
 '<div class="stats"><div><small>Distance</small><b class="s-km">--</b></div><div><small>Arrive</small><b class="s-eta">--</b></div><div style="display:none"><small>Hours</small><b class="s-hr"></b></div></div></div>'+
 '<div class="aip gl"><div class="aih"><span>Ask about the road</span><button class="aix" aria-label="Close AI">'+IC.x+'</button></div><div class="aio"></div><div class="aic"><button data-q="Is there another road I can take?">Other roads?</button><button data-q="How long until I arrive?">How long?</button><button data-q="What is my next turn?">Next turn?</button><button data-q="Is there a road to the destination?">Road available?</button></div><div class="air"><button class="mic" aria-label="Talk">'+IC.mic+'</button><input type="text" placeholder="Ask about the road…" enterkeyhint="send"></div></div>'+
 '<div class="drv gl"><div class="row"><div><b class="tm">--</b><small>time left</small></div><div><b class="km">--</b><small>distance</small></div><div><b class="eta">--</b><small>arrive</small></div><button class="ex">End</button></div></div>';
 document.body.appendChild(el);$(".nm b").textContent=title();
 var inp=$(".sbar input");inp.value=title();inp.addEventListener("keydown",function(e){if(e.key==="Enter"){inp.blur();search(inp.value)}});inp.addEventListener("focus",function(){inp.select()});
 $(".sbar .av").onclick=close;$(".cls").onclick=close;$(".ex").onclick=close;
 $(".shr").onclick=function(){var u="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);if(navigator.share)navigator.share({title:title(),url:u}).catch(function(){});else if(navigator.clipboard){navigator.clipboard.writeText(u);status(true,"Link copied");setTimeout(function(){status(false)},1500)}};
 $(".st").onclick=function(){if(!coords.length)return;driving=true;follow=true;el.classList.remove("pre");sh();setTurn("Starting…","Follow the blue line",0,"arr");if(lastP){map.setView(lastP,17);var r=[lastP].concat(coords);casing.setLatLngs(r);line.setLatLngs(r);upd(lastP)}};
 $(".rc").onclick=function(){follow=true;if(lastP){if(driving)map.setView(lastP,17);else map.setView(lastP,15)}else if(line)fit()};
 $(".cmp").onclick=function(){setVM((vm+1)%3)};$(".aib").onclick=aiOpen;$(".aix").onclick=aiClose;$(".mic").onclick=aiMic;[].forEach.call(el.querySelectorAll(".aic button"),function(b){b.onclick=function(){aiAsk(b.getAttribute("data-q"))}});var ai_in=$(".air input");ai_in.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();ai_in.blur();aiAsk(ai_in.value)}});ai_in.addEventListener("focus",aiStop);
  $(".zi").onclick=function(){map.zoomIn()};$(".zo").onclick=function(){map.zoomOut()};
 if(window.ResizeObserver){ro=new ResizeObserver(sh);ro.observe($(".sheet"));ro.observe($(".drv"))}setTimeout(sh,60);
 load(function(){if(!el)return;map=L.map($(".map"),{zoomControl:false,attributionControl:true,preferCanvas:true,tap:false,zoomSnap:.5,fadeAnimation:false,markerZoomAnimation:false,inertia:true}).setView([52.1,5.3],6);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap",keepBuffer:3,updateWhenIdle:false,updateWhenZooming:false}).addTo(map);
  var iv=function(){if(map){map.invalidateSize();if(el&&el.classList.contains("pre")&&line&&!lastP)fit()}};setTimeout(iv,0);setTimeout(iv,250);setTimeout(iv,800);
  onRz=function(){setTimeout(iv,120)};window.addEventListener("resize",onRz);window.addEventListener("orientationchange",onRz);if(window.visualViewport)window.visualViewport.addEventListener("resize",onRz);if(window.ResizeObserver){ro2=new ResizeObserver(iv);ro2.observe($(".map"))}
  map.on("dragstart",function(){follow=false});
  if(destLL)setDest(destLL);
  geoFull(q,function(i){if(!el)return;if(!destLL)setDest(i.ll,i);else setDest(destLL,i)},function(){if(!destLL)status(true,"Place not found")});
  navigator.geolocation.getCurrentPosition(function(p){if(el&&!lastP)onPos(p)},function(){},{enableHighAccuracy:false,maximumAge:120000,timeout:5000});
  wid=navigator.geolocation.watchPosition(onPos,function(e){status(true,e.code===1?"Allow location in settings":"Can't get your location")},{enableHighAccuracy:true,maximumAge:2000,timeout:20000})})}


/* view angle: 0 north up, 1 heading up, 2 road ahead (3D tilt, route pointing up) */
function smoothV(d){var diff=((d-viewDeg)%360+540)%360-180;viewDeg+=diff;return viewDeg}
function applyView(){if(!el)return;var m=$(".map");if(!m)return;var d=0;if(vm===1)d=lastHead!=null?lastHead:(roadB!=null?roadB:0);else if(vm===2)d=roadB!=null?roadB:(lastHead!=null?lastHead:0);d=vm?smoothV(d):0;if(!vm)viewDeg=0;
 var tl=vm===2?42:0,ty=vm===2?Math.round(el.clientHeight*.2):(vm===1?Math.round(el.clientHeight*.12):0);
 el.style.setProperty("--un",d+"deg");el.style.setProperty("--sy",tl?(1/Math.cos(tl*Math.PI/180)).toFixed(3):"1");
 m.style.transform="translateY("+ty+"px) perspective(1000px) rotateX("+tl+"deg) rotate("+(-d)+"deg)";
 var c=$(".cmp .cn");if(c)c.style.transform="rotate("+(-d)+"deg)"}
function setVM(n){if(!map||!el)return;vm=n;var c=map.getCenter(),z=map.getZoom();el.classList.toggle("rot",vm>0);el.classList.toggle("tilt",vm===2);map.invalidateSize({animate:false});
 if(vm>0){map.dragging.disable();map.touchZoom.disable();map.doubleClickZoom.disable();follow=true;var t=lastP||[c.lat,c.lng];map.setView(t,Math.max(z,vm===2?17:16),{animate:false})}
 else{map.dragging.enable();map.touchZoom.enable();map.doubleClickZoom.enable();map.setView(c,z,{animate:false});viewDeg=0;if(!driving&&line)fit()}
 var b=$(".cmp");if(b){b.classList.remove("m1","m2");if(vm)b.classList.add("m"+vm)}
 applyView();status(true,["North up","Heading up","Road ahead · 3D"][vm]);setTimeout(function(){status(false)},1300)}
/* ---- AI road assistant: talk (voice) or type, reply in text ---- */
var SRC=window.SpeechRecognition||window.webkitSpeechRecognition;
function aiLang(){var m={en:"en-US",fa:"fa-IR",ar:"ar-SA",de:"de-DE",es:"es-ES",fr:"fr-FR",nl:"nl-NL",tr:"tr-TR"},l="en";try{l=localStorage.getItem("xmm.lang")||"en"}catch(e){}return m[l]||(l.length>2?l:navigator.language||"en-US")}
function aiCtx(){var o=[];o.push("Destination: "+(info&&info.full?info.full:q));if(lastP)o.push("Driver position: "+lastP[0].toFixed(5)+", "+lastP[1].toFixed(5));
 o.push("Mode: "+(driving?"driving now":"previewing the route"));
 if(straight)o.push("ROUTE STATUS: no drivable road route could be found (only a straight dashed line is shown). Tell the user honestly that no road connection was found or the routing service did not answer.");
 else if(coords.length){o.push("ROUTE STATUS: a drivable road route exists.");o.push("Remaining: "+fmtD(remM||total)+", about "+fmtT(remT||dur)+" (typical speed, no live traffic).");
  if(roads.length)o.push("Roads on the route in order: "+roads.slice(0,14).join(" > "));
  o.push(alts.length?"Alternative routes available: "+alts.slice(0,2).map(function(a,i){return(i+1)+") "+fmtD(a.d)+", "+fmtT(a.t)}).join("; ")+" (main route is "+fmtD(total)+", "+fmtT(dur)+")":"No alternative route was offered by the router.")}
 else o.push("ROUTE STATUS: still calculating.");
 if(lastTurn)o.push("Current instruction: "+lastTurn);if(driving)o.push("Speed: "+lastSpd+" km/h");var w=$(".wx");if(w&&w.textContent)o.push("Weather: "+w.textContent);return o.join("\n")}
function aiSay(t,cls){var b=$(".aio");if(!b)return;b.innerHTML=(aiHist.length&&aiHist[aiHist.length-1].role==="user"?'<div class="u">'+esc(aiHist[aiHist.length-1].content)+'</div>':"")+'<div class="'+(cls||"")+'">'+esc(t)+'</div>';b.scrollTop=b.scrollHeight}
function aiStop(){if(rec){try{rec.onresult=rec.onend=rec.onerror=null;rec.stop()}catch(e){}rec=null}recOn=false;var m=$(".mic");if(m)m.classList.remove("on")}
function aiAsk(text){text=String(text||"").trim();if(!text)return;aiStop();var G=window.XMM_GROQ||(window.XMM_API&&window.XMM_API.groq);
 aiHist.push({role:"user",content:text});aiHist=aiHist.slice(-6);var inp=$(".air input");if(inp)inp.value="";
 if(!G){aiSay("The AI is not available right now.","e");return}
 if(aiAbort)try{aiAbort.abort()}catch(e){}aiAbort=new AbortController();var my=aiAbort;aiSay("…");
 var sys="You are the road assistant inside the XMM AI maps app. Answer the driver's question about the road, route, roads available, alternatives, distance, time, next turn or the trip, using ONLY the live trip data below plus general road knowledge. Be very short: 1 to 3 plain sentences, no markdown, no emojis. Reply in the same language the user spoke. You have no live traffic, closure or police data: if asked, say so briefly and suggest checking a live traffic app. Never invent road names, speeds or times that are not in the data. If the user is driving, keep it extra short.\n\nTRIP DATA:\n"+aiCtx();
 var msgs=[{role:"system",content:sys}].concat(aiHist.slice(-5));var cfg=(window.XMM_API&&window.XMM_API.CFG)||{};
 G(msgs,{model:cfg.FAST_MODEL||cfg.TEXT_MODEL,maxTokens:260,temp:.3,stream:true,signal:my.signal,onDelta:function(t){if(my!==aiAbort)return;aiSay(String(t||"").replace(/<think>[\s\S]*?(<\/think>|$)/g,"").trim()||"…")}}).then(function(r){if(my!==aiAbort)return;r=String(r||"").replace(/<think>[\s\S]*?<\/think>/g,"").trim();aiHist.push({role:"assistant",content:r});aiHist=aiHist.slice(-6);aiSay(r||"I could not answer that.")}).catch(function(e){if(my!==aiAbort||(e&&e.name==="AbortError"))return;aiSay((e&&e.message)||"Could not reach the AI. Try again.","e")})}
function aiMic(){if(recOn){aiStop();return}if(!SRC){aiSay("Voice is not supported in this browser. Type your question instead.","e");return}
 var r=new SRC(),got="",m=$(".mic");rec=r;recOn=true;r.lang=aiLang();r.interimResults=true;r.continuous=false;r.maxAlternatives=1;if(m)m.classList.add("on");var inp=$(".air input");
 r.onresult=function(e){got="";for(var i=0;i<e.results.length;i++)got+=e.results[i][0].transcript;if(inp)inp.value=got;if(e.results[e.results.length-1].isFinal){var t=got;aiStop();aiAsk(t)}};
 r.onerror=function(e){var c=e&&e.error;aiStop();if(c==="not-allowed"||c==="service-not-allowed")aiSay("Allow the microphone to talk to the AI, or type your question.","e");else if(c&&c!=="no-speech"&&c!=="aborted")aiSay("Could not hear you. Try again or type.","e")};
 r.onend=function(){var t=got;aiStop();if(t&&t.trim())aiAsk(t)};
 try{r.start()}catch(e){aiStop()}}
function aiOpen(){var p=$(".aip");if(!p)return;p.classList.add("on");sh();var b=$(".aio");if(b&&!aiHist.length)b.innerHTML='<div class="u">Ask about the road, the route or other roads.</div>';aiMic()}
function aiClose(){aiStop();if(aiAbort){try{aiAbort.abort()}catch(e){}aiAbort=null}var p=$(".aip");if(p)p.classList.remove("on")}
function close(){aiStop();if(aiAbort){try{aiAbort.abort()}catch(e){}aiAbort=null}aiHist=[];if(wid!=null)navigator.geolocation.clearWatch(wid);wid=null;if(ro){ro.disconnect();ro=null}if(ro2){ro2.disconnect();ro2=null}if(onRz){window.removeEventListener("resize",onRz);window.removeEventListener("orientationchange",onRz);if(window.visualViewport)window.visualViewport.removeEventListener("resize",onRz);onRz=null}chev=null;if(map){map.remove();map=null}if(el){el.remove();el=null}lastP=null;coords=[];steps=[];dest=null;me=null}
/* mini map preview inside chat place boxes */
function mini(){var n=document.querySelectorAll(".xe-mini[data-q]:not([data-done])");if(!n.length)return;load(function(){[].forEach.call(n,function(b){if(b.dataset.done)return;b.dataset.done=1;var qq=b.getAttribute("data-q"),ll=b.getAttribute("data-ll"),nm=b.getAttribute("data-n")||String(qq).split(",")[0];
 var go=function(d){try{var m=L.map(b,{zoomControl:false,attributionControl:true,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,tap:false}).setView([d[0]+0.0006,d[1]],15);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(m);L.marker(d,{icon:opIcon(nm)}).addTo(m)}catch(e){}};
 if(ll)go(ll.split(",").map(Number));else geo(qq,go,function(){b.textContent="Map not found"})})})}
var _mq=0;new MutationObserver(function(){if(_mq)return;_mq=setTimeout(function(){_mq=0;css();mini()},300)}).observe(document.body,{childList:true,subtree:true});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xe=nav]");if(!b)return;e.preventDefault();e.stopPropagation();var ll=b.getAttribute("data-ll");open(b.getAttribute("data-q"),ll?ll.split(",").map(Number):null)},true);
window.XMM_NAV={open:open,close:close};
})();
