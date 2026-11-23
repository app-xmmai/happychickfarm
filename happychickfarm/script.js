const PHONE="+989038232925";
const fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const breeds=[
["امروک","Barred Plymouth Rock",["Barred_Plymouth_Rock_(chicken)","Plymouth_Rock_chicken"],"مرغ پرقدرت و مقاوم با پرهای راه‌راه، تخم‌گذاری پایدار و سازگاری عالی با آب‌وهوای مختلف."],
["پیلموت راک","Plymouth Rock",["Plymouth_Rock_chicken"],"نژاد آمریکایی دو منظوره، آرام و اهلی، مناسب پرورش خانگی و صنعتی."],
["فیومی","Fayoumi",["Fayoumi_chicken","Fayoumi"],"نژاد چابک و مقاوم در برابر بیماری، با تخم‌گذاری مناسب و نیاز غذایی کم."],
["لگهورن","Leghorn",["Leghorn_chicken"],"ملکهٔ تخم‌گذاری؛ بیشترین تولید تخم‌مرغ سفید در سال با مصرف خوراک اقتصادی."],
["اورپینگتون","Orpington",["Orpington_chicken"],"نژاد درشت و پرپشت با اندامی زیبا، آرام و بسیار اهلی، تخم‌گذار خوب."],
["استرالوپ","Australorp",["Australorp"],"رکورددار تخم‌گذاری؛ پر مشکی براق، مقاوم و سازگار با شرایط گوناگون."],
["ویاندوت","Wyandotte",["Wyandotte_chicken"],"نژاد زینتی و مولد با پرهای حلقه‌دار زیبا، مقاوم در برابر سرما."]
];
const API="https://en.wikipedia.org/api/rest_v1/page/summary/";
async function img(titles){
  for(const t of titles){
    try{const r=await fetch(API+t);if(!r.ok)continue;const j=await r.json();
      const s=(j.originalimage&&j.thumbnail)?j.thumbnail.source.replace(/\/\d+px-/,"/640px-"):(j.thumbnail&&j.thumbnail.source);
      if(s)return s;}catch(e){}
  }return null;
}
const grid=document.getElementById("breedgrid");
breeds.forEach(async(b,i)=>{
  const c=document.createElement("article");c.className="card";
  c.innerHTML=`<div class="im"><img alt="جوجه ${b[0]}" loading="lazy"></div><div class="bd"><h3>${fa(i+1)}. ${b[0]}</h3><div class="en">${b[1]}</div><p>${b[3]}</p><a class="btn" href="tel:${PHONE}">📞 سفارش جوجه ${b[0]}</a></div>`;
  grid.appendChild(c);
  const el=c.querySelector("img");
  const s=await img(b[2]);
  if(s)el.src=s;else el.src="assets/icon.svg";
});
img(["Chicken"]).then(s=>{if(s)document.getElementById("heroimg").src=s});
