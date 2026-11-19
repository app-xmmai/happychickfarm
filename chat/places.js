/* Place picker: up to 5 results, ranked by closeness + fame; tap one to get the map + Directions. */
(function(){
var CACHE={},POS=null,POSP=null;
var CASP=/caspian\s*mall|caspian\s*complex|کاسپین\s*مال|مجتمع\s*(تجاری\s*)?کاسپین|کاسپین\s*انزلی/i;
var ANZ=[49.30,37.58,49.66,37.34]; /* Bandar Anzali box: left,top,right,bottom */
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function getPos(){if(POS)return Promise.resolve(POS);if(POSP)return POSP;
 POSP=new Promise(function(res){if(!navigator.geolocation)return res(null);var done=0,f=function(p){if(done)return;done=1;res(p)};setTimeout(function(){f(null)},1800);
  try{navigator.geolocation.getCurrentPosition(function(p){POS=[p.coords.latitude,p.coords.longitude];f(POS)},function(){f(null)},{maximumAge:600000,timeout:1700})}catch(e){f(null)}});return POSP}
function hav(a,b){var r=Math.PI/180,dl=(b[0]-a[0])*r,dg=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dg/2)*Math.sin(dg/2);return 12742*Math.asin(Math.sqrt(x))}
function url(q,n,pos,box){var u="https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit="+n+"&q="+encodeURIComponent(q);
 if(box)u+="&viewbox="+box.join(",")+"&bounded=1";else if(pos){var d=.6;u+="&viewbox="+[pos[1]-d,pos[0]+d,pos[1]+d,pos[0]-d].join(",")+"&bounded=0"}return u}
function fetchJ(u){return fetch(u).then(function(r){return r.json()}).catch(function(){return[]})}
function search(q,pos){var key=q+"|"+(pos?pos.map(function(v){return v.toFixed(1)}):"");if(CACHE[key])return CACHE[key];
 var jobs=[];
 if(CASP.test(q)){jobs.push(fetchJ(url("Caspian Mall",8,null,ANZ)),fetchJ(url("مجتمع تجاری کاسپین",8,null,ANZ)),fetchJ(url("Caspian Mall Bandar Anzali",5)))}
 jobs.push(fetchJ(url(q.replace(/\banzali\b/i,"Bandar Anzali"),10,pos)));
 return CACHE[key]=Promise.all(jobs).then(function(a){var seen={},out=[];[].concat.apply([],a).forEach(function(o){if(!o||!o.lat)return;var k=(o.display_name||"").split(",").slice(0,2).join("|")+Math.round(o.lat*200)+Math.round(o.lon*200);if(seen[k])return;seen[k]=1;
   var ll=[+o.lat,+o.lon],km=pos?hav(pos,ll):null,imp=+o.importance||0,boost=CASP.test(q)&&CASP.test(o.display_name||"")?1:0;
   var sc=boost*2+imp*.65+(km==null?0:.35/(1+km/15));out.push({o:o,ll:ll,km:km,sc:sc})});
  out.sort(function(x,y){return y.sc-x.sc});return out.slice(0,5)})}
function fmtKm(k){return k==null?"":(k<1?Math.round(k*1000)+" m":k<100?k.toFixed(1)+" km":Math.round(k)+" km")}
function nameOf(o){return o.name||(o.display_name||"").split(",")[0]}
function render(box,res){var q=box.getAttribute("data-q");
 if(!res.length){box.innerHTML='<div class="xp-empty">No places found for “'+esc(q)+'”.</div>';return}
 box.innerHTML='<div class="xp-h">Pick a place</div><div class="xp-list">'+res.map(function(r,i){var o=r.o,sub=(o.display_name||"").split(",").slice(1,4).join(",").trim();
  return'<button type="button" class="xp-row" data-i="'+i+'"><span class="xp-n"><b>'+esc(nameOf(o))+'</b>'+(i===0?'<em>Best match</em>':'')+'<small>'+esc(sub)+'</small></span><span class="xp-d">'+esc(fmtKm(r.km))+'</span></button>'}).join("")+'</div>';
 box._res=res}
function pick(box,i){var r=box._res&&box._res[i];if(!r)return;var o=r.o,nm=nameOf(o),full=o.display_name||nm,sub=full.split(",").slice(1,4).join(",").trim();
 var CAR='<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11h.5A1.5 1.5 0 0 1 21 12.5V17a1 1 0 0 1-1 1h-1.2a1.8 1.8 0 0 1-3.6 0H8.8a1.8 1.8 0 0 1-3.6 0H4a1 1 0 0 1-1-1v-4.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-2.8a.5.5 0 0 0-.5-.3H8.6a.5.5 0 0 0-.5.3L7.1 11z"/></svg>';
 var ll=r.ll[0]+","+r.ll[1],g="https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(ll)+"&travelmode=driving";
 box.innerHTML='<div class="xe-mini" data-q="'+esc(full)+'" data-n="'+esc(nm)+'" data-ll="'+esc(ll)+'"></div><div class="xp-b"><div class="xp-t"><b>'+esc(nm)+'</b><small>'+esc(sub)+'</small></div></div><div class="xp-a"><button class="xp-go" data-xe="nav" data-q="'+esc(full)+'" data-ll="'+esc(ll)+'">'+CAR+'Directions</button><a class="xp-gm" href="'+esc(g)+'" target="_blank" rel="noopener">Google Maps</a></div><button type="button" class="xp-back">‹ Other results</button>';
 box.classList.add("sel")}
function hydrate(){var n=document.querySelectorAll(".xp-pick:not([data-done])");if(!n.length)return;
 [].forEach.call(n,function(b){b.dataset.done=1;b.innerHTML='<div class="xp-empty">Finding places…</div>';var q=b.getAttribute("data-q");
  getPos().then(function(pos){return search(q,pos)}).then(function(r){render(b,r)}).catch(function(){b.innerHTML='<div class="xp-empty">Could not search places.</div>'})})}
document.addEventListener("click",function(e){var t=e.target,row=t.closest&&t.closest(".xp-row");
 if(row){var b=row.closest(".xp-pick");if(b){e.preventDefault();pick(b,+row.dataset.i)}return}
 var back=t.closest&&t.closest(".xp-back");if(back){var b2=back.closest(".xp-pick");if(b2&&b2._res){b2.classList.remove("sel");render(b2,b2._res)}}});
var _t=0;new MutationObserver(function(){if(_t)return;_t=setTimeout(function(){_t=0;hydrate()},50)}).observe(document.body,{childList:true,subtree:true});
hydrate();
window.XMM_PLACES={search:search,pos:getPos,alias:function(q){return CASP.test(q)&&!/anzali|انزلی|enzeli/i.test(q)?q+" Bandar Anzali":q}};
})();
