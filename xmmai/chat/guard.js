/* XMM safety guard: chat lock (swearing / inappropriate / illegal) and 2-hour ban (minor sexual content / jailbreak) */
(function(){
var BK="xmm.ban",CK="xmm_ban",HOURS=2,H2=HOURS*3600*1000;
function norm(s){return String(s||"").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/[​-‏‪-‮]/g,"").replace(/[@4]/g,"a").replace(/[3]/g,"e").replace(/[1!|]/g,"i").replace(/[0]/g,"o").replace(/\$/g,"s").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim()}
var MIN="(child|children|kid|kids|minor|minors|underage|under age|toddler|baby|boy|girl|teen|teenager|preteen|schoolgirl|schoolboy|loli|lolita|shota|kind|kinder|junge|madchen|nino|nina|ninos|ninas|menor|بچه|کودک|بچگانه|دختربچه|پسربچه|نوجوان|طفل|اطفال|قاصر)";
var SEX="(sex|sexy|sexual|porn|porno|pornography|nude|nudes|naked|rape|erotic|nsfw|xxx|fuck|molest|abuse|incest|sexo|desnud|violacion|vergewalt|nackt|sexuell|سکس|سکسی|پورن|برهنه|لخت|تجاوز|جنسی|اغتصاب|جنس|عاري|عارية|اباحي)";
var RE_MINOR=[new RegExp(MIN+".{0,40}"+SEX),new RegExp(SEX+".{0,40}"+MIN),/\b(child|kid|teen)\s*(porn|sex|nudes?)\b/,/\bcp\b.{0,20}(link|video|pic|porn|folder)/,/\b(loli|lolicon|shotacon|pedo|pedophil\w*|paedo\w*)\b/,/\b1[0-7]\s*(yo|y o|year old|years old|yr old|jahre alt|anos)\b.{0,40}(sex|nude|naked|porn|fuck)/];
var VIO="(kill|killing|murder|murdering|shoot|shooting|stab|stabbing|rape|raping|molest|hurt|torture|strangle|behead|beat up|abuse|bomb|massacre|kidnap|بکش|بکشم|کشتن|بکشی|قتل|بزنم|اعدام|اقتل|قتل|اذبح|töten|ermorden|matar|asesinar)";
var RE_KILL=[new RegExp(MIN+".{0,40}"+VIO),new RegExp(VIO+".{0,40}"+MIN),
/\b(i (will|wanna|want to|am going to|m going to|gonna|plan to|ll)|let me|help me|how (do i|to|can i)|ways to) .{0,15}(kill|murder|shoot|stab|strangle|behead|massacre)\b.{0,30}(him|her|them|someone|somebody|people|my|his|your|you|a person|everyone|man|woman|teacher|classmates?|family|wife|husband|boss|neighbou?r|president)/,
/\b(school shooting|mass shooting|mass murder|shoot up (a |the |my )?(school|mall|church|office))\b/,
/(میخوام|می خوام|میخواهم|بذار|چطور|چجوری|چگونه).{0,20}(بکشم|بکشمش|بکشمت|بکشیم|بزنم|خفه کنم|سر ?ببرم)|(کشتن|قتل) .{0,15}(آدم|کسی|اون|او|همسر|معلم)/,
/(اريد|كيف) .{0,15}(اقتل|اذبح|اطعن|اطلق النار)/];
var RE_JAIL=[
/ignore (all |any |every |your |the )?(previous|prior|above|earlier|system|safety)?\s*(instructions?|rules?|prompts?|guidelines?|restrictions?|filters?)/,
/(disregard|forget|override|bypass|disable|turn off|remove|break) (all |any |your |the )?(previous |prior |safety |content |ethical )?(instructions?|rules?|restrictions?|filters?|guidelines?|safeguards?|programming|policies|policy|limitations?)/,
/\bjail ?break(ing|ed)?\b/,/\bdan mode\b/,/\bdo anything now\b/,/\bdeveloper mode\b/,/\bgod mode\b/,/\bevil mode\b/,/\bunfiltered (mode|ai|version|response)/,
/pretend (you|that you) (have|has|are|re|can)\b.{0,40}(no|without) (rules?|restrictions?|filters?|limits?|limitations?|ethics|guidelines)/,
/you (are|re) (now )?(free|unrestricted|unfiltered|uncensored|no longer bound)/,/without (any )?(restrictions?|filters?|censorship|limitations?|safety)/,
/(reveal|show|print|repeat|leak|tell me) (me )?(your |the )?(hidden |secret |initial |original )?(system prompt|system message|initial prompt|hidden instructions?)/,
/\b(act|behave|respond) as (an? )?(unfiltered|uncensored|unrestricted|evil)\b/,/\bprompt injection\b/,/(from now on|starting now) you (will|must|are going to) (ignore|not follow|disobey)/,
/جیلبریک|جیل ?برک|قوانین(ت| خود| رو| را)? (رو |را )?(نادیده|فراموش)|دستورات (قبلی|قبلیت)(.{0,10})(نادیده|فراموش)|بدون (هیچ )?(محدودیت|سانسور|فیلتر)|محدودیت(ها)?ی? (خودت|خود) (رو|را) (بردار|بشکن)/,
/تجاوز على القواعد|تجاهل (جميع |كل )?(التعليمات|القواعد)|بدون (قيود|رقابة|فلتر)/,
/ignoriere (alle |deine )?(vorherigen |bisherigen )?(anweisungen|regeln)|ohne (einschrankungen|zensur|filter)/,
/ignora (todas |tus )?(las )?(instrucciones|reglas) (anteriores|previas)?|sin (restricciones|censura|filtros)/
];

/* ---- broad rules (plain words, no "how to" needed) ---- */
var RE_MINOR2=[
/\b(child|children|kid|kids|minor|minors|underage|under age|toddler|baby|babies|preteen|teen|teens|teenager|teenagers|schoolgirl|schoolboy|little (girl|boy)s?|young (girl|boy)s?|boys?|girls?)\b.{0,70}\b(sex|sexy|sexual|sexually|porn|porno|nude|nudes|naked|rape|raped|raping|molest\w*|erotic|nsfw|xxx|fuck\w*|incest|touch\w* (them|her|him)|grooming|groom|seduce|undress\w*|strip\w*|horny|pervert\w*|abuse\w*|abusing)\b/,
/\b(sex|sexy|sexual|sexually|porn|porno|nude|nudes|naked|rape|raped|raping|molest\w*|erotic|nsfw|xxx|fuck\w*|incest|grooming|groom|seduce|undress\w*|horny|pervert\w*|abuse\w*)\b.{0,70}\b(child|children|kid|kids|minor|minors|underage|under age|toddler|baby|babies|preteen|teen|teens|teenager|teenagers|schoolgirl|schoolboy|little (girl|boy)s?|young (girl|boy)s?|boys?|girls?)\b/,
/\b(child|kid|minor|underage|teen)\s*(abuse|abusers?|molest\w*|porn\w*|sex\w*|rape\w*|exploitation|trafficking|nudes?|predator)\b/,
/\b([1-9]|1[0-7])\s*(yo|y\/o|y o|yrs? old|years? old|year-old|jahre alt|anos)\b.{0,70}\b(sex|nude|naked|porn|fuck\w*|rape|horny|kiss|date|dating|bed)\b/,
/\b(sex|nude|naked|porn|fuck\w*|rape|horny)\b.{0,70}\b([1-9]|1[0-7])\s*(yo|y\/o|y o|yrs? old|years? old|year-old)\b/,
/(بچه|کودک|دختر ?بچه|پسر ?بچه|نوجوان|دختر|پسر|طفل|اطفال|قاصر|صغیر).{0,40}(سکس|سکسی|پورن|برهنه|لخت|تجاوز|جنسی|اغتصاب|آزار|کتک|بکش|قتل|سوءاستفاده)|(سکس|سکسی|پورن|برهنه|لخت|تجاوز|جنسی|اغتصاب|آزار جنسی|سوءاستفاده).{0,40}(بچه|کودک|دختر ?بچه|پسر ?بچه|نوجوان|طفل|اطفال|قاصر)/,
/(طفل|اطفال|قاصر|صغير|بنت|ولد|اولاد|اطفال).{0,40}(جنس|سكس|اباح|عار|اغتصاب|تحرش|قتل)|(جنس|سكس|اباح|اغتصاب|تحرش).{0,40}(طفل|اطفال|قاصر|صغير)/
];
var RE_KILL2=[
/\b(how (do i|to|can i|would i)|ways? to|best way to|help me|teach me|i (will|want to|wanna|am going to|m going to|gonna|plan to|ll|need to|should)|let me|going to|gonna|lets|let's|we (will|should|must)|you (should|must|will|need to)|im going to)\s+(\w+\s+){0,3}(kill|murder|assassinate|strangle|stab|shoot|behead|slaughter|massacre|poison|execute|hang|burn alive|suffocate|drown)\b(?!\s+(the\s+)?(process|processes|app|apps|task|tasks|switch|time|server|session|port|ports|job|jobs|daemon|script|container|it\b|thread|threads|service|command|window|tab|browser))/,
/\b(kill|murder|assassinate|strangle|stab|shoot|behead|slaughter|massacre)\s+(him|her|them|you|someone|somebody|everyone|everybody|people|a person|a man|a woman|my (mom|mother|dad|father|brother|sister|teacher|boss|wife|husband|friend|friends|family|neighbou?r|classmates?|ex|girlfriend|boyfriend|parents?)|your (mom|mother|dad|father|family)|the (president|teacher|boss|neighbou?r|police|cops?|kids?|children|people))\b/,
/\b(school shooter|school shooting|mass shooting|mass murder|serial kill\w*|shoot up|kill spree|murder spree|hit ?man|contract kill\w*|hire a (killer|hitman))\b/,
/\b(want|going|gonna|will|wanna)\s+(to\s+)?(kill|murder)\b/,
/(میخوام|می ?خوام|میخواهم|می ?خواهم|میرم|می ?رم|باید|بذار|چطور|چجوری|چگونه|طریقه).{0,25}(بکشم|بکشمش|بکشمت|بکشیم|بکشن|کشتن|خفه کنم|سر ?ببرم|بزنمش|بزنمت|ترور|قتل)|(بکشمت|می ?کشمت|میکشمت|بکشمش|می ?کشمش|میکشمش|سرتو میبرم|ترور کن)/,
/(اريد|اود|سوف|كيف|طريقة).{0,20}(اقتل|اذبح|اطعن|اطلق النار|اخنق|قتل)|(سأقتلك|ساقتلك|اقتلك|اقتله|اقتلها)/,
/\b(ich (werde|will|moechte|möchte)|wie (kann|soll) ich)\b.{0,20}\b(toeten|töten|ermorden|umbringen)\b|(voy a|quiero|como (puedo|debo))\s+(matar|asesinar)/
];
var RE_WEAPON=[
/\b(gun|guns|handgun|handguns|shotgun|shotguns|pistol|pistols|revolver|revolvers|rifle|rifles|sniper|firearm|firearms|machine ?gun|submachine|smg|uzi|glock|beretta|ak ?-?47|ak ?-?74|ar ?-?15|m16|m4a1|kalashnikov|rpg|bazooka|grenade|grenades|landmine|landmines|missile|missiles|rocket launcher|howitzer|artillery|tank shell|ammo|ammunition|silencer|suppressor|ghost gun|3d printed gun|auto sear|weapon|weapons|bioweapon|chemical weapon|nerve agent|nuke|nukes|nuclear (bomb|weapon)|bomb|bombs|bombing|explosive|explosives|dynamite|tnt|c-?4|semtex|detonator|pipe bomb|molotov|ied|napalm|thermite|crossbow|machete|brass knuckles|taser|stun gun|bulletproof|bullets?(?! points?| list| journal))\b/,
/(اسلحه|اسلحه ها|سلاح|سلاح ها|تفنگ|کلاشینکف|نارنجک|مسلسل|کلت|تپانچه|مهمات|فشنگ|گلوله|بمب|مواد منفجره|دینامیت|خمپاره|موشک|تیر و کمان|قمه|چاقو ?کشی|سلاح سرد|سلاح گرم|خفه ?کن)/,
/(سلاح|اسلحة|مسدس|بندقية|رشاش|قنبلة|قنابل|ذخيرة|متفجرات|رصاص|كلاشنكوف|صاروخ|ديناميت)/,
/\b(waffe|waffen|pistole|gewehr|granate|munition|sprengstoff|bombe|schusswaffe)\b|\b(arma|armas|pistola|fusil|granada|municion|munición|explosivo|explosivos|bomba|escopeta)\b/
];
var BAD="fuck|fucking|fucker|motherfucker|shit|bullshit|bitch|asshole|bastard|cunt|dick|dickhead|pussy|slut|whore|wtf|stfu|retard|nigger|nigga|faggot|scheisse|scheiße|arschloch|fick|ficken|hurensohn|wichser|puta|mierda|joder|cabron|pendejo|coño|verga|hijo de puta";
var BADFA="کیر|کص|کون|کسکش|کس ?کش|جنده|جندع|مادر ?جنده|مادر ?قحبه|قحبه|کسننه|کس ?ننه|ننه ?جنده|گوه|گه |حرومزاده|حروم ?زاده|پدرسگ|پدر ?سگ|بیناموس|بی ?ناموس|کصافت|گایید|بکنمت|میکنمت|دیوث|کونی|کسخل|ننتو|ننت رو|تخمی|جاکش|اوبی|عن ?تو|کسمادر|مادرتو|خارکسه";
var BADAR="شرموط|شرموطة|كس امك|كسمك|منيك|متناك|ابن الكلب|ابن العاهرة|عاهرة|قحبة|زب|طيز|لعنة عليك|حمار|كلب";
var ILLEGAL=[
/(how (do i|to|can i)|teach me|show me|help me|steps to|guide to) .{0,30}(make|build|buy|get|3d print|print|assemble|convert|modify|smuggle|hide|use)\b.{0,30}(gun|guns|pistol|rifle|firearm|firearms|ak ?47|ar ?15|glock|grenade|bullet|bullets|ammo|ammunition|knife attack|machete|crossbow|taser|landmine|silencer|suppressor|auto sear|switch|weapon|weapons)/,
/\b(buy|sell|order|get|find|where (to|can i) buy) .{0,20}(gun|guns|pistol|rifle|firearm|firearms|ak ?47|glock|grenade|ammo|ammunition|weapon|weapons|explosives?)\b/,
/\b(gun|weapon|firearm|bomb|grenade)s? (for sale|dealer|shop|market)\b/,
/(اسلحه|سلاح|تفنگ|کلاشینکف|نارنجک|مسلسل|کلت|تپانچه|مهمات|تیر و کمان).{0,25}(بساز|ساخت|درست کن|بخر|بفروش|بخرم|تهیه|قاچاق)|(ساخت|خرید|فروش|تهیه) .{0,15}(اسلحه|سلاح|تفنگ|نارنجک|مهمات)/,
/(سلاح|اسلحة|مسدس|بندقية|رشاش|قنبلة|ذخيرة).{0,20}(اصنع|صنع|اشتري|شراء|بيع)|(صنع|شراء|بيع) .{0,15}(سلاح|مسدس|بندقية|قنبلة)/,
/(waffe|waffen|pistole|gewehr|granate|munition).{0,20}(bauen|kaufen|verkaufen|herstellen)|(arma|armas|pistola|fusil|granada|municion).{0,20}(fabricar|comprar|vender|construir|hacer)/,
/(how (do i|to|can i)|teach me|show me|guide to|steps to|make me) .{0,30}(make|build|cook|synthesi[sz]e|produce|manufacture|create)\b.{0,30}(bomb|explosive|meth|methamphetamine|cocaine|heroin|fentanyl|lsd|nerve gas|sarin|poison|napalm|molotov|thermite|ricin|anthrax|ied|silencer|ghost gun)/,
/(buy|sell|get|order|find) .{0,20}(drugs?|cocaine|heroin|meth|fentanyl|weed|mdma|ecstasy|illegal guns?|stolen (cards?|credit)|fake id|counterfeit|passport)/,
/(how (do i|to|can i)|help me) .{0,20}(hack|crack|ddos|phish|steal|dox|doxx|stalk|blackmail|extort|launder|swat|poison|kill|murder|stab|shoot|kidnap|traffic)\b.{0,40}(account|password|wifi|bank|card|person|someone|wife|husband|girlfriend|boyfriend|neighbou?r|people|money|him|her|them)/,
/(write|make|create|build|give me) .{0,20}(malware|ransomware|keylogger|ddos|botnet|virus|trojan|exploit|phishing (page|site|email)|stealer|rat\b)/,
/\b(child|human|sex) traffick/,/\bhitman\b|\bhire a killer\b/,/(how to|ways to) (commit )?(suicide|kill myself|self harm)\b/,


/(بمب|مواد منفجره|متامفتامین|شیشه|هروئین|کراک|کوکائین)\b.{0,25}(بساز|ساخت|درست کن|بخر|بفروش)|(ساخت|درست کردن) .{0,15}(بمب|مواد منفجره|مواد مخدر|شیشه|هروئین|سم)|(هک کردن|هک) .{0,20}(اکانت|حساب|پسورد|رمز|اینستاگرام)/,
/(صنع|اصنع|كيف اصنع|طريقة صنع) .{0,15}(قنبلة|متفجرات|مخدرات|سم)/,
/(wie (baue|mache|stelle) ich) .{0,20}(bombe|sprengstoff|drogen|meth)/,
/(como (hacer|fabricar|preparar)) .{0,20}(bomba|explosivo|droga|metanfetamina|veneno)/
];
function hit(list,t,raw){for(var i=0;i<list.length;i++){if(list[i].test(t)||list[i].test(raw))return true}return false}
function wordHit(t,raw){
 var re=new RegExp("(^|\\s)("+BAD+")(\\s|$)");if(re.test(t))return true;
 if(new RegExp("("+BADFA+")").test(raw))return true;
 if(new RegExp("(^|\\s)("+BADAR+")(\\s|$)").test(raw))return true;return false}
function check(text){
 var tech=/\b(child|children|kid|kids)\s+(process|processes|node|nodes|element|elements|class|classes|component|components|thread|threads|window|windows|view|views|theme|selector|table|task|tasks|pid|proc)\b/g;var raw=String(text||"").toLowerCase().replace(tech,"chxld"),t=norm(raw);if(!t)return null;
 if(hit(RE_MINOR,t,raw)||hit(RE_MINOR2,t,raw)||hit(RE_KILL,t,raw)||hit(RE_KILL2,t,raw))return"ban";
 if(hit(RE_JAIL,t,raw))return"ban";
 if(hit(ILLEGAL,t,raw)||hit(RE_WEAPON,t,raw)||wordHit(t,raw))return"lock";
 return null}

/* ---- ban storage: localStorage + cookie, survives logout / cache clear / rebuilds ---- */
function getCookie(){var m=document.cookie.match(/(?:^|;\s*)xmm_ban=(\d+)/);return m?+m[1]:0}
function getBan(){try{localStorage.removeItem(BK)}catch(e){}document.cookie="xmm_ban=;max-age=0;path=/";return 0}
function setCookie(u){document.cookie="xmm_ban="+u+";expires="+new Date(u+86400000).toUTCString()+";path=/;SameSite=Lax"}
function logoutNow(){try{Object.keys(localStorage).filter(function(k){return/^xmm\./.test(k)&&k!==BK&&k!=="xmm.lang"}).forEach(function(k){localStorage.removeItem(k)})}catch(e){}}
function ban(){/* suspensions disabled */} 

/* ---- ban screen ---- */
var ov=null,tick=null,css=null;
function fmt(ms){var s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);s=s%60;return(h?h+":":"")+(h?String(m).padStart(2,"0"):m)+":"+String(s).padStart(2,"0")}
function show(u){
 if(!css){css=document.createElement("style");css.id="xmmBanCss";css.textContent="html.xmm-banned body>*:not(#xmmBan){visibility:hidden!important;pointer-events:none!important}#xmmBan{position:fixed;inset:0;z-index:2147483647;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:28px 24px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;pointer-events:auto;visibility:visible}#xmmBan h1{margin:0;font-size:24px;letter-spacing:-.02em}#xmmBan p{margin:0;max-width:320px;color:rgba(255,255,255,.62);font-size:15px;line-height:1.5}#xmmBan b{font-size:40px;font-variant-numeric:tabular-nums;letter-spacing:.02em;margin-top:6px}";document.head.appendChild(css)}
 document.documentElement.classList.add("xmm-banned");
 function mk(){if(document.getElementById("xmmBan"))return;ov=document.createElement("div");ov.id="xmmBan";ov.innerHTML="<h1>Access suspended</h1><p>Your account was suspended for 2 hours because of a safety violation. You have been logged out.</p><b id=\"xmmBanT\"></b><p>You can use XMM AI again when the timer ends.</p>";document.body.appendChild(ov)}
 mk();
 function upd(){var left=u-Date.now();if(left<=0){clearInterval(tick);try{localStorage.removeItem(BK)}catch(e){}document.cookie="xmm_ban=;max-age=0;path=/";location.reload();return}
  var cur=getBan();if(!cur){location.reload();return}mk();var t=document.getElementById("xmmBanT");if(t)t.textContent=fmt(left);document.documentElement.classList.add("xmm-banned")}
 clearInterval(tick);upd();tick=setInterval(upd,500);
 new MutationObserver(function(){if(!document.getElementById("xmmBan")||!document.documentElement.classList.contains("xmm-banned")){mk();document.documentElement.classList.add("xmm-banned")}}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
 /* block every interaction at the earliest phase */
 ["click","keydown","keyup","pointerdown","touchstart","submit"].forEach(function(ev){window.addEventListener(ev,function(e){if(!getBan())return;if(e.target&&e.target.closest&&e.target.closest("#xmmBan"))return;e.stopImmediatePropagation();e.preventDefault()},true)})}

/* ---- locked chat box ---- */
function lockBox(){var b=document.getElementById("xmmLock");if(b)return b;var dock=document.querySelector("#viewChat .dock");if(!dock)return null;
 b=document.createElement("div");b.id="xmmLock";b.setAttribute("role","status");b.textContent="Sorry, you can't message in this chat anymore. You can open a new chat.";dock.insertBefore(b,dock.firstChild);return b}
function sync(){try{var c=window.XMM_API&&XMM_API.cur&&XMM_API.cur();var on=!!(c&&c.locked);document.body.classList.toggle("chat-locked",on);if(on)lockBox()}catch(e){}}

window.XMM_GUARD={check:check,ban:ban,sync:sync,banned:getBan};

var st=document.createElement("style");st.textContent="#xmmLock{display:none}body.chat-locked #xmmLock{display:block;margin:0 14px 6px;padding:16px 18px;border-radius:22px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.85);font:500 15px/1.45 -apple-system,BlinkMacSystemFont,system-ui,sans-serif;text-align:center;-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px)}body.chat-locked #viewChat .composer,body.chat-locked #viewChat .chips,body.chat-locked #viewChat .vchips,body.chat-locked #viewChat .atts{display:none!important}";document.head.appendChild(st);

/* ---- other inputs (builder, image studio, voice text): ban on severe, block on moderate ---- */
function valueNear(el){var f=document.activeElement;if(f&&/^(TEXTAREA|INPUT)$/.test(f.tagName)&&f.value)return f.value;var c=el&&el.closest&&el.closest(".composer,.cd-in,.sv-bar,form,.dock");var i=c&&c.querySelector("textarea,input[type=text],input:not([type])");return i?i.value:""}
function gate(e,txt){var v=check(txt);if(!v)return;if(v==="ban"){e.stopImmediatePropagation();e.preventDefault();ban();return}
 var inChat=e.target&&e.target.closest&&e.target.closest("#viewChat");if(inChat)return;e.stopImmediatePropagation();e.preventDefault();try{XMM_API.toast("Message blocked")}catch(x){}}
document.addEventListener("keydown",function(e){if(e.key!=="Enter"||e.shiftKey||e.isComposing)return;var f=e.target;if(!f||!/^(TEXTAREA|INPUT)$/.test(f.tagName))return;gate(e,f.value)},true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".send,#sendBtn,#svGo,.sv-go,[data-act=send],button[type=submit]");if(!b)return;gate(e,valueNear(b))},true);

var u=getBan();
function boot(){getBan();sync()}
if(u){logoutNow();if(document.body)show(u);else document.addEventListener("DOMContentLoaded",function(){show(u)})}
document.addEventListener("DOMContentLoaded",boot);
if(document.readyState!=="loading")sync();
})();
