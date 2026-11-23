(()=>{"use strict";
const S=document.getElementById("settings");if(!S)return;
const sh=S.querySelector(".sheet"),$=id=>document.getElementById(id);
const g=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}};
const st=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const fld=(l,el,h)=>{const d=mk("div","pf","<label>"+l+"</label>");d.appendChild(el);if(h)d.appendChild(mk("p","ph",h));return d};
const els={name:$("setName"),lang:$("setLang"),mem:$("setMem"),model:$("modelInfo"),pwa:$("pwaInfo"),out:$("logout"),clr:$("clearAll"),inst:sh.querySelector('[data-act="install"]')};
const head=sh.querySelector(".sheet-h"),brand=sh.querySelector(".brandline"),copy=sh.querySelector(".copy");
sh.classList.add("pro");
const SK=[["web","Web browsing","Let chat open websites you mention."],["image","Image creation","Make images from a chat description."],["code","Code agent","Write and fix code in the Code tab."],["voice","Voice","Talk and listen hands-free."],["notes","Notes and projects","Save notes and group your chats."],["memory","Use AI memory","Apply what you saved under Personalization."],["translate","Auto-translate","Reply in the language you write in."],["summary","Chat summaries","Short summaries of long chats."]];
const on=Object.assign({},...SK.map(k=>({[k[0]]:true})),g("xmm.skills",{}));window.XMM_SKILLS=on;
const tabs=[["General",()=>{const p=mk("div");p.append(fld("Your name",els.name),fld("Language",els.lang),fld("Model",els.model));return p}],
["Personalization",()=>{const p=mk("div");p.append(fld("AI memory",els.mem,"Things the AI should always remember about you."));return p}],
["Skills",()=>{const p=mk("div");p.appendChild(mk("p","ph","Turn features on or off. Choices are saved on this device.")).style.marginBottom="6px";SK.forEach(k=>{const r=mk("div","sk","<div><b>"+k[1]+"</b><span>"+k[2]+"</span></div>"),b=mk("button","sw"+(on[k[0]]?" on":""));b.type="button";b.setAttribute("aria-label",k[1]);b.onclick=()=>{on[k[0]]=!on[k[0]];b.classList.toggle("on",on[k[0]]);st("xmm.skills",on);dispatchEvent(new CustomEvent("xmm:skills",{detail:on}))};r.appendChild(b);p.appendChild(r)});return p}],
["Data",()=>{const p=mk("div");p.append(fld("Install check",els.pwa));if(els.inst)p.appendChild(els.inst);p.append(els.clr,els.out);return p}],
["About",()=>{const p=mk("div");if(brand)p.appendChild(brand);if(copy)p.appendChild(copy);const sup=mk("a","btn");sup.href="/support";sup.target="_blank";sup.rel="noopener";sup.textContent="Support · support@xmm-ai.com";sup.style.cssText="display:flex;margin:10px 0;text-decoration:none";p.appendChild(sup);p.appendChild(mk("p","ph","Your profile and chats are stored on this device."));
const ab=mk("div","ab-agree","<label class=\"ab-chk\"><input type=\"checkbox\" id=\"aboutAgree\"><span class=\"bx\"></span><span class=\"tx\">I agree to the <a href=\"/terms\" target=\"_blank\" rel=\"noopener\">Terms of Use</a> and <a href=\"/privacy\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a></span></label><div class=\"ab-legal\"><a href=\"/terms\" target=\"_blank\" rel=\"noopener\">Read Terms of Use</a><a href=\"/privacy\" target=\"_blank\" rel=\"noopener\">Read Privacy Policy</a></div>");
const cb=ab.querySelector("input");cb.checked=!!g("xmm.terms",0);cb.onchange=()=>st("xmm.terms",cb.checked?Date.now():0);p.appendChild(ab);return p}]];
const nav=mk("nav","stabs"),panes=mk("div","spanes");
tabs.forEach((t,i)=>{const b=mk("button",i?"":"on",t[0]),p=mk("div","pane"+(i?"":" on"));p.appendChild(t[1]());b.onclick=()=>{nav.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));panes.querySelectorAll(".pane").forEach(x=>x.classList.toggle("on",x===p))};nav.appendChild(b);panes.appendChild(p)});
sh.querySelectorAll(":scope>label,:scope>.hint").forEach(e=>e.remove());
const body=mk("div","sbody");body.append(nav,panes);sh.appendChild(body);
})();
