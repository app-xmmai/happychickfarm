/* XMM live navigation v4 (Apple Maps style): Leaflet + OSM tiles, OSRM route with blue line, turn banner, "Recalculating…" */
(function(){
var L0="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet";
var el,map,me,dest,line,casing,wid=null,total=0,dur=0,coords=[],steps=[],q="",destLL=null,info=null,lastRoute=0,follow=true,started=false,driving=false,lastP=null,failed=0,routing=false,offCount=0,wxDone=false,ro=null;
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
 search:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.500-3.500"/></svg>'
};
function css(){if(document.getElementById("nv-css"))return;var s=document.createElement("style");s.id="nv-css";s.textContent=
"#nv{--bg:rgba(255,255,255,.82);--fg:#111;--mu:rgba(60,60,67,.62);--sep:rgba(60,60,67,.16);--chip:rgba(118,118,128,.14);--blue:#0a84ff;position:fixed;inset:0;z-index:100000;background:#e9e7e2;font-family:-apple-system,system-ui,'SF Pro Text','Segoe UI',Roboto,sans-serif;color:var(--fg);overflow:hidden;-webkit-font-smoothing:antialiased}"+
"@media(prefers-color-scheme:dark){#nv{--bg:rgba(34,34,38,.84);--fg:#fff;--mu:rgba(235,235,245,.6);--sep:rgba(235,235,245,.16);--chip:rgba(120,120,128,.32)}}"+
"#nv .map,#nv .leaflet-container{position:absolute;inset:0;background:#e9e7e2;font-family:inherit}"+
"#nv .leaflet-control-attribution{font-size:9px;background:rgba(255,255,255,.7);margin:0 0 calc(var(--sh,0px) + 4px) 0}"+
"#nv .gl{background:var(--bg);-webkit-backdrop-filter:blur(26px) saturate(1.8);backdrop-filter:blur(26px) saturate(1.8);box-shadow:0 8px 32px rgba(0,0,0,.16),0 0 0 .5px rgba(255,255,255,.5) inset;border:.5px solid var(--sep)}"+
"#nv button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}"+
"#nv .top{position:absolute;z-index:1000;left:12px;right:12px;top:calc(env(safe-area-inset-top,0px) + 10px);display:flex;flex-direction:column;gap:8px;pointer-events:none}"+
"#nv .top>*{pointer-events:auto}"+
"#nv .wx{align-self:flex-start;display:none;align-items:center;gap:6px;border-radius:99px;padding:7px 13px 7px 10px;font-weight:600;font-size:15px}"+
"#nv .wx.on{display:flex}"+
"#nv .turn{display:none;align-items:center;gap:14px;border-radius:22px;padding:12px 16px;background:linear-gradient(135deg,#0a84ff,#2563eb)!important;color:#fff;border:0}"+
"#nv:not(.pre) .turn{display:flex}"+
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
function load(cb){if(window.L)return cb();var l=document.createElement("link");l.rel="stylesheet";l.href=L0+".min.css";document.head.appendChild(l);var s=document.createElement("script");s.src=L0+".min.js";s.onload=cb;s.onerror=function(){alert("Could not load the map");close()};document.head.appendChild(s)}
function hav(a,b){var R=6371000,r=Math.PI/180,dl=(b[0]-a[0])*r,dg=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dg/2)*Math.sin(dg/2);return 2*R*Math.asin(Math.sqrt(x))}
function fmtT(s){s=Math.max(0,Math.round(s/60));if(s>=60){var h=Math.floor(s/60),m=s%60;return h+" h "+(m?m+" min":"")}return(s<1?"<1":s)+" min"}
function fmtD(m){return m>=1000?(m/1000).toFixed(m>=10000?0:1)+" km":Math.max(10,Math.round(m/10)*10)+" m"}
function $(s){return el&&el.querySelector(s)}
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function opIcon(name){return L.divIcon({className:"",html:'<div class="nv-op"><i>'+IC.pin+'</i><span>'+esc(name||"")+'</span></div>',iconSize:[120,74],iconAnchor:[60,53]})}
function geoFull(query,cb,err){if(GI[query])return cb(GI[query]);fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&extratags=1&q="+encodeURIComponent(query)).then(function(r){return r.json()}).then(function(j){if(!j[0]){err&&err();return}var o=j[0],x=o.extratags||{};GI[query]={ll:[+o.lat,+o.lon],full:o.display_name||"",phone:x.phone||x["contact:phone"]||"",web:x.website||x["contact:website"]||"",hours:x.opening_hours||""};GC[query]=GI[query].ll;cb(GI[query])}).catch(function(){err&&err()})}
function geo(query,cb,err){if(GC[query])return cb(GC[query]);geoFull(query,function(i){cb(i.ll)},err)}
function status(on,txt){var r=$(".rcl");if(!r)return;r.classList.toggle("on",!!on);if(txt)r.querySelector("span").textContent=txt}
function draw(pts){if(line){map.removeLayer(line);map.removeLayer(casing)}
 casing=L.polyline(pts,{color:"#fff",weight:12,opacity:1,lineCap:"round",lineJoin:"round"}).addTo(map);
 line=L.polyline(pts,{color:"#0a84ff",weight:7.5,opacity:1,lineCap:"round",lineJoin:"round"}).addTo(map)}
function near(pt){var bi=0,bd=1e12;for(var i=0;i<coords.length;i++){var d=hav(pt,coords[i]);if(d<bd){bd=d;bi=i}}return[bi,bd]}
function getRoute(from){lastRoute=Date.now();routing=true;var re=coords.length>0;status(true,re?"Recalculating…":"Calculating route…");if(re&&driving)setTurn("Recalculating…","Finding a new route",0,"arr");
 fetch("https://router.project-osrm.org/route/v1/driving/"+from[1]+","+from[0]+";"+destLL[1]+","+destLL[0]+"?overview=full&geometries=geojson&steps=true").then(function(r){return r.json()}).then(function(j){var r=j.routes&&j.routes[0];if(!r)throw 0;failed=0;offCount=0;
  coords=r.geometry.coordinates.map(function(c){return[c[1],c[0]]});total=r.distance;dur=r.duration;
  steps=[];((r.legs&&r.legs[0]&&r.legs[0].steps)||[]).forEach(function(s){var m=s.maneuver||{};if(!m.location||m.type==="depart")return;steps.push({ll:[m.location[1],m.location[0]],type:m.type,mod:m.modifier||"",name:s.name||"",exit:m.exit,idx:near([m.location[1],m.location[0]])[0]})});
  draw(coords);routing=false;status(false);var sub=$(".top .rcl span");
  if(!started){started=true;fit()}else if(!driving)fit();upd(from)}).catch(function(){routing=false;status(false);if(++failed>2||!coords.length){coords=[from,destLL];steps=[];total=hav(from,destLL);dur=total/13;draw(coords);if(line)line.setStyle({dashArray:"2 14"});if(!started){started=true;fit()}upd(from)}})}
function fit(){if(!line||driving||!map)return;var h=($(".sheet")||{}).offsetHeight||200;map.fitBounds(line.getBounds(),{paddingTopLeft:[40,130],paddingBottomRight:[40,h+40],maxZoom:17})}
function rot(mod,type){if(/roundabout|rotary/.test(type))return 0;return({"straight":0,"slight right":35,"right":90,"sharp right":135,"uturn":180,"sharp left":-135,"left":-90,"slight left":-35})[mod]||0}
function words(s){var m=s.mod,t=s.type,nm=s.name?(" onto "+s.name):"";
 if(t==="arrive")return"Arrive at destination";
 if(/roundabout|rotary/.test(t))return"Take the roundabout"+(s.exit?" · exit "+s.exit:"");
 if(t==="fork")return"Keep "+(/left/.test(m)?"left":"right")+nm;
 if(m==="uturn")return"Make a U-turn";
 if(m==="straight"||!m)return"Continue straight"+(s.name?" on "+s.name:"");
 return(/slight/.test(m)?"Bear ":/sharp/.test(m)?"Sharp ":"Turn ")+(m.replace(/slight |sharp /,""))+nm}
function setTurn(a,b,deg,ic){var t=$(".turn");if(!t)return;t.querySelector("small").textContent=a;t.querySelector("b").textContent=b;var i=t.querySelector(".ti");i.innerHTML=ic==="flag"?IC.flag:IC.arr;var s=i.firstChild;if(s&&ic!=="flag")s.style.transform="rotate("+deg+"deg)"}
function upd(p){if(!coords.length||!el)return;var n=near(p),bi=n[0],bd=n[1];
 if(bd>80&&!routing&&Date.now()-lastRoute>6000){if(++offCount>=2||!driving){getRoute(p);return}}else if(bd<=80)offCount=0;
 var rem=bd;for(var j=bi;j<coords.length-1;j++)rem+=hav(coords[j],coords[j+1]);
 var t=total?dur*rem/total:0;$(".km").textContent=fmtD(rem);$(".tm").textContent=fmtT(t);
 var eta=new Date(Date.now()+t*1000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
 $(".eta").textContent=eta;var s1=$(".s-km"),s2=$(".s-eta"),s3=$(".st b");if(s1)s1.textContent=fmtD(rem);if(s2)s2.textContent=eta;if(s3)s3.textContent=fmtT(t);
 if(driving&&!routing){
  if(rem<30){setTurn("You have arrived",title(),0,"flag")}
  else{var nx=null;for(var k=0;k<steps.length;k++)if(steps[k].idx>bi){nx=steps[k];break}
   if(nx){var dd=hav(p,coords[Math.min(coords.length-1,bi+1)]);for(var m=bi+1;m<nx.idx;m++)dd+=hav(coords[m],coords[m+1]);setTurn("In "+fmtD(dd),words(nx),rot(nx.mod,nx.type),nx.type==="arrive"?"flag":"arr")}
   else setTurn("Continue",fmtD(rem)+" to "+title(),0,"arr")}
  var rest=[p].concat(coords.slice(bi+1));casing.setLatLngs(rest);line.setLatLngs(rest)}}
function title(){return String(q).split(",")[0]}
function weather(p){if(wxDone||!p)return;wxDone=true;fetch("https://api.open-meteo.com/v1/forecast?latitude="+p[0]+"&longitude="+p[1]+"&current=temperature_2m,weather_code").then(function(r){return r.json()}).then(function(j){var c=j.current;if(!c||!el)return;var w=c.weather_code,e=w===0?"☀️":w<3?"⛅":w<50?"☁️":w<70?"🌧️":w<80?"🌨️":w<95?"🌦️":"⛈️";var x=$(".wx");x.textContent=e+" "+Math.round(c.temperature_2m)+"°";x.classList.add("on")}).catch(function(){})}
function onPos(pos){var p=[pos.coords.latitude,pos.coords.longitude];lastP=p;weather(p);
 if(!me){me=L.marker(p,{icon:L.divIcon({className:"",html:'<div class="nv-me"><i></i><u></u></div>',iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:900}).addTo(map)}else me.setLatLng(p);
 if(!coords.length){if(!routing&&Date.now()-lastRoute>3000&&destLL)getRoute(p);else if(!destLL&&!routing&&Date.now()-lastRoute>3000)geo(q,function(d){destLL=d;getRoute(p)});return}
 upd(p);var s=$(".spv");if(s)s.textContent=Math.round((pos.coords.speed||0)*3.6);
 if(driving&&follow)map.setView(p,Math.max(map.getZoom(),17),{animate:true})}
function sh(){if(!el)return;var b=$(".sheet"),d=$(".drv"),h=(el.classList.contains("pre")?b:d).offsetHeight+8;el.style.setProperty("--sh",h+"px")}
function setDest(d,inf){destLL=d;info=inf||info;if(!el||!map)return;if(dest)map.removeLayer(dest);dest=L.marker(d,{icon:opIcon(title()),zIndexOffset:500}).addTo(map);if(!lastP)map.setView(d,14);
 if(info){var sub=$(".nm small");if(sub){var rest=String(q).split(",").slice(1).join(",").trim()||String(info.full||"").split(",").slice(1,4).join(",").trim();sub.textContent=rest}
  var c=$(".acts .call"),w=$(".acts .web");if(c&&info.phone){c.href="tel:"+info.phone.split(/[;,]/)[0].replace(/\s/g,"");c.classList.remove("off")}
  if(w&&info.web){w.href=/^https?:/i.test(info.web)?info.web:"https://"+info.web;w.classList.remove("off")}
  if(info.hours){var hb=$(".s-hr");if(hb){hb.parentNode.style.display="";hb.textContent=info.hours.split(";")[0].slice(0,22)}}}}
function open(query,ll){close();q=query;destLL=ll||null;info=null;started=false;driving=false;follow=true;coords=[];steps=[];me=null;line=null;casing=null;failed=0;lastRoute=0;routing=false;offCount=0;wxDone=false;
 if(!navigator.geolocation){alert("Location is not supported");return}
 css();el=document.createElement("div");el.id="nv";el.className="pre";
 el.innerHTML='<div class="map"></div>'+
 '<div class="top"><div class="wx gl"></div>'+
 '<div class="turn gl"><div class="ti">'+IC.arr+'</div><div class="tt"><small>Starting…</small><b>Calculating route…</b></div></div><div class="rcl gl"><i></i><span>Calculating route…</span></div></div>'+
 '<div class="spd gl"><b class="spv">0</b><small>KM/H</small></div>'+
 '<div class="fabs gl"><button class="rc" aria-label="My location">'+IC.loc+'</button><button class="zi" aria-label="Zoom in">+</button><button class="zo" aria-label="Zoom out">−</button></div>'+
 '<div class="sheet gl"><div class="hd"><button class="rb shr" aria-label="Share">'+IC.share+'</button><div class="nm"><b></b><small></small></div><button class="rb cls" aria-label="Close">'+IC.x+'</button></div>'+
 '<div class="acts"><button class="st">'+IC.car+'<b>--</b></button><a class="call off" role="button">'+IC.call+'Call</a><a class="web off" target="_blank" rel="noopener" role="button">'+IC.web+'Website</a></div>'+
 '<div class="stats"><div><small>Distance</small><b class="s-km">--</b></div><div><small>Arrive</small><b class="s-eta">--</b></div><div style="display:none"><small>Hours</small><b class="s-hr"></b></div></div></div>'+
 '<div class="drv gl"><div class="row"><div><b class="tm">--</b><small>time left</small></div><div><b class="km">--</b><small>distance</small></div><div><b class="eta">--</b><small>arrive</small></div><button class="ex">End</button></div></div>';
 document.body.appendChild(el);$(".nm b").textContent=title();
 $(".cls").onclick=close;$(".ex").onclick=close;
 $(".shr").onclick=function(){var u="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);if(navigator.share)navigator.share({title:title(),url:u}).catch(function(){});else if(navigator.clipboard){navigator.clipboard.writeText(u);status(true,"Link copied");setTimeout(function(){status(false)},1500)}};
 $(".st").onclick=function(){if(!coords.length)return;driving=true;follow=true;el.classList.remove("pre");sh();setTurn("Starting…","Follow the blue line",0,"arr");if(lastP){map.setView(lastP,17);var r=[lastP].concat(coords);casing.setLatLngs(r);line.setLatLngs(r);upd(lastP)}};
 $(".rc").onclick=function(){follow=true;if(lastP){if(driving)map.setView(lastP,17);else map.setView(lastP,15)}else if(line)fit()};
 $(".zi").onclick=function(){map.zoomIn()};$(".zo").onclick=function(){map.zoomOut()};
 if(window.ResizeObserver){ro=new ResizeObserver(sh);ro.observe($(".sheet"));ro.observe($(".drv"))}setTimeout(sh,60);
 load(function(){if(!el)return;map=L.map($(".map"),{zoomControl:false,attributionControl:true}).setView([52.1,5.3],6);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(map);
  map.on("dragstart",function(){follow=false});
  if(destLL)setDest(destLL);
  geoFull(q,function(i){if(!el)return;if(!destLL)setDest(i.ll,i);else setDest(destLL,i)},function(){if(!destLL)status(true,"Place not found")});
  wid=navigator.geolocation.watchPosition(onPos,function(e){status(true,e.code===1?"Allow location in settings":"Can't get your location")},{enableHighAccuracy:true,maximumAge:2000,timeout:20000})})}
function close(){if(wid!=null)navigator.geolocation.clearWatch(wid);wid=null;if(ro){ro.disconnect();ro=null}if(map){map.remove();map=null}if(el){el.remove();el=null}lastP=null;coords=[];steps=[];dest=null;me=null}
/* mini map preview inside chat place boxes */
function mini(){var n=document.querySelectorAll(".xe-mini[data-q]:not([data-done])");if(!n.length)return;load(function(){[].forEach.call(n,function(b){if(b.dataset.done)return;b.dataset.done=1;var qq=b.getAttribute("data-q"),ll=b.getAttribute("data-ll"),nm=b.getAttribute("data-n")||String(qq).split(",")[0];
 var go=function(d){try{var m=L.map(b,{zoomControl:false,attributionControl:true,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,tap:false}).setView([d[0]+0.0006,d[1]],15);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(m);L.marker(d,{icon:opIcon(nm)}).addTo(m)}catch(e){}};
 if(ll)go(ll.split(",").map(Number));else geo(qq,go,function(){b.textContent="Map not found"})})})}
var _mq=0;new MutationObserver(function(){if(_mq)return;_mq=setTimeout(function(){_mq=0;css();mini()},300)}).observe(document.body,{childList:true,subtree:true});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xe=nav]");if(!b)return;e.preventDefault();e.stopPropagation();var ll=b.getAttribute("data-ll");open(b.getAttribute("data-q"),ll?ll.split(",").map(Number):null)},true);
window.XMM_NAV={open:open,close:close};
})();
