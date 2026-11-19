/* XMM live navigation: Leaflet + OpenStreetMap tiles, OSRM routing, Nominatim search, browser live location */
(function(){
var L0="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet";
var el,map,me,meDot,dest,route,line,wid=null,total=0,dur=0,coords=[],q="",destLL=null,lastRoute=0,follow=true,started=false;
function css(){if(document.getElementById("nv-css"))return;var s=document.createElement("style");s.id="nv-css";s.textContent="#nv{position:fixed;inset:0;z-index:100000;background:#111;display:flex;flex-direction:column}#nv .map{flex:1}#nv .top{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);left:12px;right:12px;z-index:1000;background:rgba(20,20,22,.92);color:#fff;border-radius:16px;padding:12px 14px;font:600 15px system-ui;box-shadow:0 4px 20px rgba(0,0,0,.4)}#nv .bot{position:absolute;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 14px);z-index:1000;background:rgba(20,20,22,.94);color:#fff;border-radius:20px;padding:14px 16px;display:flex;align-items:center;gap:16px;font-family:system-ui}#nv .bot div{flex:1}#nv .bot b{font-size:24px;display:block}#nv .bot small{opacity:.6}#nv .ex{background:#e5484d;color:#fff;border:0;border-radius:14px;padding:12px 18px;font:600 15px system-ui}#nv .rc{position:absolute;right:14px;bottom:calc(env(safe-area-inset-bottom,0px) + 110px);z-index:1000;width:44px;height:44px;border-radius:50%;border:0;background:#fff;font-size:20px}.nv-me{width:18px;height:18px;border-radius:50%;background:#2f7bff;border:3px solid #fff;box-shadow:0 0 0 6px rgba(47,123,255,.25)}";document.head.appendChild(s)}
function load(cb){if(window.L)return cb();var l=document.createElement("link");l.rel="stylesheet";l.href=L0+".min.css";document.head.appendChild(l);var s=document.createElement("script");s.src=L0+".min.js";s.onload=cb;s.onerror=function(){alert("Could not load the map");close()};document.head.appendChild(s)}
function hav(a,b){var R=6371000,r=Math.PI/180,dl=(b[0]-a[0])*r,dg=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dg/2)*Math.sin(dg/2);return 2*R*Math.asin(Math.sqrt(x))}
function fmtT(s){s=Math.max(0,Math.round(s/60));return s>=60?Math.floor(s/60)+" h "+(s%60)+" min":s+" min"}
function setTxt(m){el.querySelector(".top").textContent=m}
function geocode(cb){if(destLL)return cb(destLL);fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(q)).then(function(r){return r.json()}).then(function(j){if(!j[0]){setTxt("Place not found");return}destLL=[+j[0].lat,+j[0].lon];cb(destLL)}).catch(function(){setTxt("Search failed")})}
function getRoute(from){lastRoute=Date.now();fetch("https://router.project-osrm.org/route/v1/driving/"+from[1]+","+from[0]+";"+destLL[1]+","+destLL[0]+"?overview=full&geometries=geojson").then(function(r){return r.json()}).then(function(j){var r=j.routes&&j.routes[0];if(!r){setTxt("No route found");return}coords=r.geometry.coordinates.map(function(c){return[c[1],c[0]]});total=r.distance;dur=r.duration;if(line)map.removeLayer(line);line=L.polyline(coords,{color:"#2f7bff",weight:7,opacity:.95}).addTo(map);if(!started){map.fitBounds(line.getBounds(),{padding:[60,60]});started=true}upd(from)}).catch(function(){setTxt("Routing failed")})}
function upd(p){if(!coords.length)return;var bi=0,bd=1e12;for(var i=0;i<coords.length;i++){var d=hav(p,coords[i]);if(d<bd){bd=d;bi=i}}
 if(bd>80&&Date.now()-lastRoute>8000){getRoute(p);return}
 var rem=bd;for(var j=bi;j<coords.length-1;j++)rem+=hav(coords[j],coords[j+1]);
 var t=total?dur*rem/total:0;el.querySelector(".km").textContent=(rem>=1000?(rem/1000).toFixed(1)+" km":Math.round(rem)+" m");el.querySelector(".tm").textContent=fmtT(t);
 setTxt(rem<30?"You have arrived":"Heading to "+q);
 if(line)line.setLatLngs(coords.slice(bi))}
function onPos(pos){var p=[pos.coords.latitude,pos.coords.longitude];if(!me){me=L.marker(p,{icon:L.divIcon({className:"",html:'<div class="nv-me"></div>',iconSize:[18,18]})}).addTo(map)}else me.setLatLng(p);
 if(!coords.length){if(Date.now()-lastRoute>3000)geocode(function(){getRoute(p)});return}
 upd(p);if(follow)map.panTo(p,{animate:true})}
function open(query,ll){q=query;destLL=ll||null;started=false;coords=[];me=null;line=null;if(!navigator.geolocation){alert("Location is not supported");return}
 css();el=document.createElement("div");el.id="nv";el.innerHTML='<div class="top">Getting your location…</div><div class="map"></div><button class="rc" aria-label="Recenter">◎</button><div class="bot"><div><b class="tm">--</b><small>time left</small></div><div><b class="km">--</b><small>left</small></div><button class="ex">Exit</button></div>';document.body.appendChild(el);
 el.querySelector(".ex").onclick=close;el.querySelector(".rc").onclick=function(){follow=true;me&&map.setView(me.getLatLng(),17)};
 load(function(){map=L.map(el.querySelector(".map"),{zoomControl:false}).setView([20,0],3);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(map);map.on("dragstart",function(){follow=false});
  geocode(function(d){dest=L.marker(d).addTo(map)});
  wid=navigator.geolocation.watchPosition(onPos,function(e){setTxt(e.code===1?"Location access denied — allow it in settings":"Can't get your location")},{enableHighAccuracy:true,maximumAge:2000,timeout:20000})})}
function close(){if(wid!=null)navigator.geolocation.clearWatch(wid);wid=null;if(map){map.remove();map=null}if(el){el.remove();el=null}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xe=nav]");if(!b)return;e.preventDefault();e.stopPropagation();var ll=b.getAttribute("data-ll");open(b.getAttribute("data-q"),ll?ll.split(",").map(Number):null)},true);
window.XMM_NAV={open:open,close:close};
})();
