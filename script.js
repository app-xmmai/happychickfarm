const PHONE="+989038232925";
const wa=t=>"https://wa.me/989038232925?text="+encodeURIComponent(t);
const WA='<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.5 3.5A11.9 11.9 0 0012 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a12 12 0 005.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 01-1.5-5.2c0-5.4 4.4-9.8 9.9-9.8 2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 012.9 6.9c0 5.4-4.4 9.8-9.8 9.8zm5.4-7.3c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a8 8 0 01-4-3.5c-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.5l-.9-2.1c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>';
const fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const breeds=[
["امروک","Amrock",["Plymouth Rock chicken"],"نوع تولیدی و خودجنسیت‌شونده از راک راه‌راه که در اروپا اصلاح شده؛ نام آن از «American Rock» گرفته شده اما بیشتر در اروپا پرورش می‌یابد، نه یک نژاد آمریکایی نمایشی. آرام، مقاوم به سرما و تخم‌گذار پایدار.",["منشأ: اروپا (آلمان/انگلستان)","حدود ۲۲۰ تخم در سال","تخم قهوه‌ای روشن","جنسیت جوجه در یک‌روزگی قابل تشخیص"]],
["پیلموت راک","Plymouth Rock",["Plymouth Rock chicken"],"نژاد اصیل آمریکایی از ایالت ماساچوست (قرن نوزدهم) و یکی از محبوب‌ترین مرغ‌های دو منظوره جهان. بدنی کمی درشت‌تر و ساختاری متفاوت‌تر از امروک دارد.",["منشأ: آمریکا (ماساچوست)","حدود ۱۸۰ تا ۲۰۰ تخم در سال","تخم قهوه‌ای","دو منظوره، آرام و اهلی"]],
["فیومی","Fayoumi",["Fayoumi chicken","Fayoumi"],"نژاد کوچک‌جثه و چابک از منطقهٔ فیوم مصر؛ زود بالغ می‌شود، در برابر بیماری و گرما مقاوم است و خوراک کمی مصرف می‌کند.",["منشأ: مصر (فیوم)","تخم‌های کوچک و فراوان","بلوغ زودرس","مقاوم در برابر گرما و بیماری"]],
["لگهورن","Leghorn",["Leghorn chicken"],"نژاد ایتالیایی و شناخته‌شده‌ترین تخم‌گذار صنعتی جهان؛ سبک‌وزن، فعال و با مصرف خوراک اقتصادی.",["منشأ: ایتالیا (لیورنو)","حدود ۲۵۰ تا ۳۰۰ تخم در سال","تخم سفید","فعال و سبک‌وزن"]],
["اورپینگتون","Orpington",["Orpington chicken"],"نژاد درشت و پرپشت انگلیسی با اندامی زیبا؛ بسیار آرام و اهلی، مناسب پرورش خانگی و مادر خوبی برای جوجه‌هاست.",["منشأ: انگلستان","حدود ۱۷۰ تا ۲۰۰ تخم در سال","تخم قهوه‌ای","درشت‌جثه، آرام و مقاوم به سرما"]],
["استرالوپ","Australorp",["Australorp"],"نژاد استرالیایی با پر مشکی براق که در رکوردهای جهانی تخم‌گذاری شناخته شده است؛ مقاوم، آرام و سازگار با شرایط مختلف.",["منشأ: استرالیا","حدود ۲۵۰ تخم در سال","تخم قهوه‌ای","پر مشکی براق و مقاوم"]],
["ویاندوت","Wyandotte",["Wyandotte chicken"],"نژاد آمریکایی با پرهای حلقه‌دار زیبا و تاج گلی که به سرما مقاوم است؛ هم تخم‌گذار خوب است و هم گوشت مناسب دارد.",["منشأ: آمریکا (ایالت نیویورک)","حدود ۲۰۰ تخم در سال","تخم قهوه‌ای","زیبا، دو منظوره و مقاوم به سرما"]]
];
const grid=document.getElementById("breedgrid");
const imgs=[];
breeds.forEach((b,i)=>{
  const c=document.createElement("article");c.className="card";
  c.innerHTML=`<div class="im"><img alt="جوجه ${b[0]}" loading="lazy" referrerpolicy="no-referrer"><span class="idx">${fa(i+1).padStart?fa(String(i+1).padStart(2,"0")):fa(i+1)}</span></div><div class="bd"><div class="hd"><h3>${b[0]}</h3><span class="en">${b[1]}</span></div><p>${b[3]}</p><ul class="chips">${b[4].map(x=>`<li>${x}</li>`).join("")}</ul><div class="act"><a class="btn sm wa" target="_blank" rel="noopener" href="${wa("سلام، می‌خواهم جوجه "+b[0]+" سفارش بدهم.")}">${WA}سفارش در واتساپ</a><a class="call" href="tel:${PHONE}" aria-label="تماس"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.300 1.800.6 2.8.7a2 2 0 011.7 2z"/></svg></a></div></div>`;
  grid.appendChild(c);imgs.push(c.querySelector("img"));
});
const fallback=el=>{el.onerror=null;el.src="icon.png";el.style.objectFit="contain";el.style.padding="40px"};
async function lookup(titles){
  const u="https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=700&titles="+encodeURIComponent(titles.join("|"));
  const r=await fetch(u);const j=await r.json();const out={};
  const q=j.query||{};const map={};
  (q.normalized||[]).forEach(n=>map[n.from]=n.to);(q.redirects||[]).forEach(n=>map[n.from]=n.to);
  Object.values(q.pages||{}).forEach(p=>{if(p.thumbnail)out[p.title]=p.thumbnail.source});
  const res={};
  titles.forEach(t=>{let k=t;for(let i=0;i<3;i++)if(map[k])k=map[k];if(out[k])res[t]=out[k]});
  return res;
}
(async()=>{
  const all=[...new Set(breeds.flatMap(b=>b[2]).concat(["Chicken"]))];
  let found={};
  try{found=await lookup(all)}catch(e){}
  breeds.forEach((b,i)=>{
    const t=b[2].find(x=>found[x]);const el=imgs[i];
    el.onerror=()=>fallback(el);
    if(t)el.src=found[t];else fallback(el);
  });
})();

// starfield
(()=>{const c=document.getElementById("bg"),x=c.getContext("2d");let w,h,P=[],m={x:.5,y:.5};
const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight;P=Array.from({length:Math.min(140,w/9|0)},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.3,s:Math.random()*.25+.05,a:Math.random()}))};
addEventListener("resize",rs);rs();
addEventListener("pointermove",e=>{m.x=e.clientX/w;m.y=e.clientY/h});
(function f(){x.clearRect(0,0,w,h);for(const p of P){p.y-=p.s;p.a+=.02;if(p.y<-5){p.y=h+5;p.x=Math.random()*w}
x.globalAlpha=.35+Math.sin(p.a)*.3;x.fillStyle=p.r>1.1?"#ffc233":"#cfe9ff";x.beginPath();x.arc(p.x+(m.x-.5)*p.r*18,p.y+(m.y-.5)*p.r*18,p.r,0,7);x.fill()}requestAnimationFrame(f)})()})();
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".rv,.card").forEach(el=>io.observe(el));
// nav state
const hd=document.querySelector("header");addEventListener("scroll",()=>hd.classList.toggle("sc",scrollY>20),{passive:true});

document.querySelectorAll("[data-wa]").forEach(a=>a.href=wa(a.dataset.wa));
