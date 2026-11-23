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
  c.innerHTML=`<div class="im"><img alt="جوجه ${b[0]}" loading="lazy" referrerpolicy="no-referrer"></div><div class="bd"><h3>${fa(i+1)}. ${b[0]}</h3><div class="en">${b[1]}</div><p>${b[3]}</p><ul class="chips">${b[4].map(x=>`<li>${x}</li>`).join("")}</ul><a class="btn" href="tel:${PHONE}">📞 سفارش جوجه ${b[0]}</a></div>`;
  grid.appendChild(c);imgs.push(c.querySelector("img"));
});
const fallback=el=>{el.onerror=null;el.src="icon.png";el.style.objectFit="contain";el.style.padding="30px"};
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
