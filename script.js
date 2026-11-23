const PHONE="+989038232925";
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
  c.innerHTML=`<div class="im"><img alt="جوجه ${b[0]}" loading="lazy" referrerpolicy="no-referrer"><span class="idx">${fa(i+1)}</span></div><div class="bd"><h3>${b[0]}</h3><div class="en">${b[1]}</div><p>${b[3]}</p><ul class="chips">${b[4].map(x=>`<li>${x}</li>`).join("")}</ul><a class="btn sm" href="tel:${PHONE}">سفارش جوجه ${b[0]}</a></div>`;
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
// tilt
document.querySelectorAll(".card,.glass.tilt").forEach(el=>{el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.setProperty("--rx",(-py*6)+"deg");el.style.setProperty("--ry",(px*6)+"deg");el.style.setProperty("--mx",(px+.5)*100+"%");el.style.setProperty("--my",(py+.5)*100+"%")});el.addEventListener("pointerleave",()=>{el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg")})});
// nav state
const hd=document.querySelector("header");addEventListener("scroll",()=>hd.classList.toggle("sc",scrollY>20),{passive:true});
