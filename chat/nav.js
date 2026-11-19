/* XMM live navigation v3: Leaflet + OpenStreetMap tiles, OSRM route (blue line), Nominatim search, XMM UI on top */
(function(){
var L0="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet";
var el,map,me,dest,line,casing,wid=null,total=0,dur=0,coords=[],q="",destLL=null,lastRoute=0,follow=true,started=false,driving=false,lastP=null,failed=0;
var GC={};
function css(){if(document.getElementById("nv-css"))return;var s=document.createElement("style");s.id="nv-css";s.textContent=
"#nv{position:fixed;inset:0;z-index:100000;background:#e8e6e1;font-family:-apple-system,system-ui,'SF Pro Text',sans-serif;color:#fff;overflow:hidden}"+
"#nv .map{position:absolute;inset:0}#nv .leaflet-container{background:#e8e6e1;font-family:inherit}"+
"#nv .leaflet-control-attribution{font-size:9px;background:rgba(255,255,255,.7);margin-bottom:0}"+
"#nv .gl{background:rgba(24,24,28,.86);-webkit-backdrop-filter:blur(22px) saturate(1.6);backdrop-filter:blur(22px) saturate(1.6);box-shadow:0 8px 30px rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.08)}"+
"#nv .top{position:absolute;z-index:1000;left:12px;right:12px;top:calc(env(safe-area-inset-top,0px) + 12px);border-radius:22px;padding:12px 14px;display:flex;align-items:center;gap:12px}"+
"#nv .top .ic{width:42px;height:42px;border-radius:14px;background:#2f7bff;display:grid;place-items:center;flex:none}"+
"#nv .top .ic svg{width:22px;height:22px}"+
"#nv .top .tx{min-width:0;flex:1}#nv .top small{display:block;font-size:12px;opacity:.6;font-weight:600;letter-spacing:.2px}"+
"#nv .top b{display:block;font-size:17px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
"#nv .bot{position:absolute;z-index:1000;left:10px;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);border-radius:28px;padding:16px 16px 14px}"+
"#nv .stats{display:flex;align-items:flex-end;gap:6px}"+
"#nv .stats .big{flex:1.3}#nv .stats .sm{flex:1}"+
"#nv .stats b{display:block;font-size:30px;font-weight:800;letter-spacing:-.5px;line-height:1.05;font-variant-numeric:tabular-nums}"+
"#nv .stats .sm b{font-size:22px}#nv .stats small{font-size:12px;opacity:.6;font-weight:600}"+
"#nv .stats .big b.tm{color:#4ade80}"+
"#nv .btns{display:flex;gap:10px;margin-top:14px}"+
"#nv .btns button{flex:1;border:0;border-radius:18px;padding:15px 0;font:700 17px -apple-system,system-ui,sans-serif;color:#fff;touch-action:manipulation;transition:transform .12s,opacity .12s}"+
"#nv .btns button:active{transform:scale(.96);opacity:.85}"+
"#nv .st{background:#2f7bff;flex:2!important}#nv .ex{background:rgba(255,255,255,.14)}#nv:not(.pre) .ex{background:#e5484d}#nv:not(.pre) .st{display:none}"+
"#nv .fab{position:absolute;z-index:1000;right:12px;width:46px;height:46px;border-radius:50%;border:0;color:#fff;font-size:22px;display:grid;place-items:center;touch-action:manipulation}"+
"#nv .fab:active{transform:scale(.92)}#nv .rc{bottom:calc(env(safe-area-inset-bottom,0px) + 170px)}#nv .zi{bottom:calc(env(safe-area-inset-bottom,0px) + 228px)}#nv .zo{bottom:calc(env(safe-area-inset-bottom,0px) + 282px)}"+
"#nv .spd{position:absolute;z-index:1000;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 170px);width:62px;height:62px;border-radius:50%;display:none;flex-direction:column;align-items:center;justify-content:center}"+
"#nv:not(.pre) .spd{display:flex}#nv .spd b{font-size:21px;line-height:1;font-weight:800}#nv .spd small{font-size:9px;opacity:.6;font-weight:700}"+
".nv-me{position:relative;width:22px;height:22px}.nv-me i{position:absolute;inset:0;border-radius:50%;background:rgba(47,123,255,.28);animation:nvp 2s infinite}.nv-me u{position:absolute;inset:3px;border-radius:50%;background:#2f7bff;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)}"+
"@keyframes nvp{0%{transform:scale(.8);opacity:1}100%{transform:scale(2.4);opacity:0}}"+
".nv-pin{width:34px;height:42px;filter:drop-shadow(0 4px 5px rgba(0,0,0,.4))}"+
".xe-mini{width:100%;height:190px;border-radius:14px;margin:8px 0;overflow:hidden;background:#e8e6e1;position:relative;z-index:0}.xe-mini .leaflet-control-attribution{font-size:8px}";
document.head.appendChild(s)}
function load(cb){if(window.L)return cb();var l=document.createElement("link");l.rel="stylesheet";l.href=L0+".min.css";document.head.appendChild(l);var s=document.createElement("script");s.src=L0+".min.js";s.onload=cb;s.onerror=function(){alert("Could not load the map");close()};document.head.appendChild(s)}
function hav(a,b){var R=6371000,r=Math.PI/180,dl=(b[0]-a[0])*r,dg=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dg/2)*Math.sin(dg/2);return 2*R*Math.asin(Math.sqrt(x))}
function fmtT(s){s=Math.max(0,Math.round(s/60));if(s>=60){var h=Math.floor(s/60),m=s%60;return h+" h "+(m?m+" min":"")}return(s<1?"<1":s)+" min"}
function fmtD(m){return m>=1000?(m/1000).toFixed(m>=10000?0:1)+" km":Math.round(m/10)*10+" m"}
function $(s){return el&&el.querySelector(s)}
function setSt(a,b){var x=$(".top small"),y=$(".top b");if(x&&a!=null)x.textContent=a;if(y&&b!=null)y.textContent=b}
function geo(query,cb,err){if(GC[query])return cb(GC[query]);fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(query)).then(function(r){return r.json()}).then(function(j){if(!j[0]){err&&err();return}GC[query]=[+j[0].lat,+j[0].lon];cb(GC[query])}).catch(function(){err&&err()})}
var PIN='<svg class="nv-pin" viewBox="0 0 34 42"><path d="M17 41C17 41 2 26 2 15a15 15 0 0130 0c0 11-15 26-15 26z" fill="#e5484d" stroke="#fff" stroke-width="3"/><circle cx="17" cy="15" r="5.5" fill="#fff"/></svg>';
function draw(pts){if(line){map.removeLayer(line);map.removeLayer(casing)}
 casing=L.polyline(pts,{color:"#fff",weight:13,opacity:1,lineCap:"round",lineJoin:"round"}).addTo(map);
 line=L.polyline(pts,{color:"#1a73ff",weight:8,opacity:1,lineCap:"round",lineJoin:"round"}).addTo(map)}
function getRoute(from){lastRoute=Date.now();
 fetch("https://router.project-osrm.org/route/v1/driving/"+from[1]+","+from[0]+";"+destLL[1]+","+destLL[0]+"?overview=full&geometries=geojson").then(function(r){return r.json()}).then(function(j){var r=j.routes&&j.routes[0];if(!r)throw 0;failed=0;
  coords=r.geometry.coordinates.map(function(c){return[c[1],c[0]]});total=r.distance;dur=r.duration;draw(coords);
  if(!started){started=true;fit()}upd(from)}).catch(function(){if(++failed>2||!coords.length){coords=[from,destLL];total=hav(from,destLL);dur=total/13;draw(coords);if(line)line.setStyle({dashArray:"2 14"});if(!started){started=true;fit()}upd(from);setSt("Straight-line route","To "+q)}})}
function fit(){if(!line||driving)return;var h=el.querySelector(".bot").offsetHeight+30;map.fitBounds(line.getBounds(),{paddingTopLeft:[40,120],paddingBottomRight:[40,h+30],maxZoom:17})}
function upd(p){if(!coords.length)return;var bi=0,bd=1e12;for(var i=0;i<coords.length;i++){var d=hav(p,coords[i]);if(d<bd){bd=d;bi=i}}
 if(bd>90&&Date.now()-lastRoute>8000){getRoute(p);return}
 var rem=bd;for(var j=bi;j<coords.length-1;j++)rem+=hav(coords[j],coords[j+1]);
 var t=total?dur*rem/total:0;$(".km").textContent=fmtD(rem);$(".tm").textContent=fmtT(t);
 $(".eta").textContent=new Date(Date.now()+t*1000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
 if(rem<30){setSt("Arrived","You have arrived")}else setSt(driving?"Driving to":"Route to",q);
 if(line&&driving){var rest=[p].concat(coords.slice(bi+1));casing.setLatLngs(rest);line.setLatLngs(rest)}}
function onPos(pos){var p=[pos.coords.latitude,pos.coords.longitude];lastP=p;
 if(!me){me=L.marker(p,{icon:L.divIcon({className:"",html:'<div class="nv-me"><i></i><u></u></div>',iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:900}).addTo(map)}else me.setLatLng(p);
 if(!coords.length){if(Date.now()-lastRoute>3000)geo(q,function(d){destLL=d;getRoute(p)});return}
 upd(p);var s=$(".spv");if(s)s.textContent=Math.round((pos.coords.speed||0)*3.6);
 if(driving&&follow)map.setView(p,Math.max(map.getZoom(),17),{animate:true})}
function open(query,ll){close();q=query;destLL=ll||null;started=false;driving=false;follow=true;coords=[];me=null;line=null;casing=null;failed=0;lastRoute=0;
 if(!navigator.geolocation){alert("Location is not supported");return}
 css();el=document.createElement("div");el.id="nv";el.className="pre";
 el.innerHTML='<div class="map"></div>'+
 '<div class="top gl"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8z"/></svg></div><div class="tx"><small>Finding your location…</small><b></b></div></div>'+
 '<div class="spd gl"><b class="spv">0</b><small>KM/H</small></div>'+
 '<button class="fab gl rc" aria-label="Recenter">◎</button><button class="fab gl zi" aria-label="Zoom in">+</button><button class="fab gl zo" aria-label="Zoom out">−</button>'+
 '<div class="bot gl"><div class="stats"><div class="big"><b class="tm">--</b><small>time left</small></div><div class="sm"><b class="km">--</b><small>distance</small></div><div class="sm"><b class="eta">--</b><small>arrive</small></div></div><div class="btns"><button class="ex">Exit</button><button class="st">Start</button></div></div>';
 document.body.appendChild(el);$(".top b").textContent=q;
 $(".ex").onclick=close;
 $(".st").onclick=function(){driving=true;follow=true;el.classList.remove("pre");setSt("Driving to",q);if(lastP){map.setView(lastP,17);if(coords.length){casing.setLatLngs([lastP].concat(coords));line.setLatLngs([lastP].concat(coords))}}};
 $(".rc").onclick=function(){follow=true;if(driving&&lastP)map.setView(lastP,17);else if(line)fit()};
 $(".zi").onclick=function(){map.zoomIn()};$(".zo").onclick=function(){map.zoomOut()};
 load(function(){if(!el)return;map=L.map($(".map"),{zoomControl:false,attributionControl:true}).setView([52.1,5.3],6);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(map);
  map.on("dragstart",function(){follow=false});
  geo(q,function(d){destLL=d;if(!el)return;dest=L.marker(d,{icon:L.divIcon({className:"",html:PIN,iconSize:[34,42],iconAnchor:[17,40]}),zIndexOffset:500}).addTo(map);if(!lastP)map.setView(d,13)},function(){setSt("Place not found",q)});
  wid=navigator.geolocation.watchPosition(onPos,function(e){setSt(e.code===1?"Location blocked":"Can't get location",e.code===1?"Allow location in settings":q)},{enableHighAccuracy:true,maximumAge:2000,timeout:20000})})}
function close(){if(wid!=null)navigator.geolocation.clearWatch(wid);wid=null;if(map){map.remove();map=null}if(el){el.remove();el=null}lastP=null;coords=[]}
/* mini map preview inside chat place boxes */
function mini(){var n=document.querySelectorAll(".xe-mini[data-q]:not([data-done])");if(!n.length)return;load(function(){[].forEach.call(n,function(b){if(b.dataset.done)return;b.dataset.done=1;var qq=b.getAttribute("data-q"),ll=b.getAttribute("data-ll");
 var go=function(d){try{var m=L.map(b,{zoomControl:false,attributionControl:true,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,tap:false}).setView(d,15);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(m);L.marker(d,{icon:L.divIcon({className:"",html:PIN,iconSize:[34,42],iconAnchor:[17,40]})}).addTo(m)}catch(e){}};
 if(ll)go(ll.split(",").map(Number));else geo(qq,go,function(){b.textContent="Map not found"})})})}
var _mq=0;new MutationObserver(function(){if(_mq)return;_mq=setTimeout(function(){_mq=0;css();mini()},300)}).observe(document.body,{childList:true,subtree:true});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xe=nav]");if(!b)return;e.preventDefault();e.stopPropagation();var ll=b.getAttribute("data-ll");open(b.getAttribute("data-q"),ll?ll.split(",").map(Number):null)},true);
window.XMM_NAV={open:open,close:close};
})();
