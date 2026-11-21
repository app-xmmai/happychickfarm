(()=>{"use strict";
const R=document.getElementById("settings");if(!R)return;
const sh=R.querySelector(".sheet"),nav=sh&&sh.querySelector(".stabs"),panes=sh&&sh.querySelector(".spanes");if(!nav||!panes)return;
const g=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}};
const st=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const toast=m=>{try{window.XMM_API.toast(m)}catch{}};
const paneOf=label=>{const b=[...nav.querySelectorAll("button")].find(x=>x.textContent.trim()===label);return b?panes.children[[...nav.children].indexOf(b)]:null};
const fld=(l,el,h)=>{const d=mk("div","pf","<label>"+l+"</label>");d.appendChild(el);if(h)d.appendChild(mk("p","ph",h));return d};

/* ---- profile header: app icon circle + name + pencil ---- */
const head=mk("div","sp-prof");
head.innerHTML='<div class="sp-circ"><img src="icon.svg?v=gpu6" alt=""></div><div class="sp-nm"><span class="sp-n"></span><button type="button" class="sp-pen" aria-label="Edit name"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button></div>';
sh.insertBefore(head,sh.querySelector(".sbody"));
const nSpan=head.querySelector(".sp-n"),pen=head.querySelector(".sp-pen"),nm=head.querySelector(".sp-nm");
const curName=()=>String(g("xmm.name","")||"").trim();
const showName=()=>{nSpan.textContent=curName()||"XMM User"};
const applyName=v=>{v=String(v||"").trim().slice(0,40);try{window.XMM_API.setName(v)}catch{st("xmm.name",v)}const si=document.getElementById("setName");if(si)si.value=v;showName()};
pen.onclick=()=>{const i=mk("input","sp-edit");i.maxLength=40;i.value=curName();i.setAttribute("enterkeyhint","done");nm.replaceChildren(i);i.focus();i.select();
 const done=()=>{if(!i.isConnected)return;applyName(i.value);nm.replaceChildren(nSpan,pen)};
 i.onblur=done;i.onkeydown=e=>{if(e.key==="Enter")i.blur()}};

/* ---- personalization: what I need to know / how I should respond ---- */
const pp=paneOf("Personalization");
const know=mk("textarea","field"),resp=mk("textarea","field");
know.rows=4;resp.rows=4;know.maxLength=1500;resp.maxLength=1500;know.dir="auto";resp.dir="auto";
know.placeholder="Your job, hobbies, goals, anything that helps the AI know you…";
resp.placeholder="e.g. Short answers, friendly tone, use examples, no emojis…";
if(pp){pp.append(fld("What I need to know",know,"The AI uses this to understand you."),fld("How I should respond",resp,"Style, tone and length of replies."))}

/* ---- events ---- */
const evNav=mk("button","","Events"),evPane=mk("div","pane");
nav.appendChild(evNav);panes.appendChild(evPane);
evNav.onclick=()=>{nav.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===evNav));panes.querySelectorAll(".pane").forEach(x=>x.classList.toggle("on",x===evPane))};
const today=()=>new Date().toISOString().slice(0,10);
const iso=t=>new Date(t-new Date(t).getTimezoneOffset()*6e4).toISOString().slice(0,10);
const sunEv=()=>{const u=+g("xmm.sun.unlock",0)||0;if(!u||Date.now()>=u+30*864e5)return[];return[{name:"XMMGPT Sun 6.2",claimed:iso(u),end:iso(u+30*864e5)}]};
const evs=()=>{const l=g("xmm.events",[]);return sunEv().concat(Array.isArray(l)?l.filter(e=>e&&e.name&&e.name!=="XMMGPT Sun 6.2"&&(!e.end||e.end>=today())):[])};
const fmt=d=>{try{return new Date(d+"T00:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}catch{return d}};
function renderEv(){const l=evs();
 evPane.innerHTML=l.length?l.map(e=>'<div class="sp-ev"><b>'+esc(e.name)+'</b><span>Claimed '+esc(e.claimed?fmt(e.claimed):"—")+'</span><span>Ends '+esc(e.end?fmt(e.end):"no end date")+'</span></div>').join(""):'<div class="sp-none">No events</div>'}
window.XMM_EVENTS={list:evs,claim(name,end){const l=g("xmm.events",[]);if(l.some(e=>e.name===name))return false;l.push({name:String(name).slice(0,60),end:end||"",claimed:today()});st("xmm.events",l);renderEv();return true}};

/* ---- save button ---- */
const bar=mk("div","sp-bar");const save=mk("button","btn wide sp-save","Save");save.type="button";bar.appendChild(save);sh.appendChild(bar);
function load(){showName();know.value=g("xmm.know","");resp.value=g("xmm.resp","");const m=document.getElementById("setMem"),lg=document.getElementById("setLang");if(m)m.value=g("xmm.mem","");renderEv()}
save.onclick=()=>{
 st("xmm.know",know.value.slice(0,1500));st("xmm.resp",resp.value.slice(0,1500));
 const m=document.getElementById("setMem");if(m)st("xmm.mem",m.value.slice(0,2000));
 const n=document.getElementById("setName");if(n&&n.value.trim()!==curName())applyName(n.value);
 const lg=document.getElementById("setLang");if(lg)try{localStorage.setItem("xmm.lang",lg.value)}catch{}
 dispatchEvent(new CustomEvent("xmm:saved"));save.textContent="Saved ✓";setTimeout(()=>save.textContent="Save",1400);toast("Settings saved")};
new MutationObserver(()=>{if(!R.hidden)load()}).observe(R,{attributes:true,attributeFilter:["hidden"]});
load();
})();
