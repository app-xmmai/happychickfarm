/* bg.js: space background (white dot stars + living spiral galaxy). Stars orbit the AI bubble.
   Drag stars on the empty background 3 times -> unlocks XMMGPT-7 Galaxy. */
(function(){"use strict";
var cv=document.createElement("canvas");cv.id="xmmBg";document.body.insertBefore(cv,document.body.firstChild);
var x=cv.getContext("2d"),W=0,H=0,D=1,PI2=Math.PI*2,rnd=Math.random,P=[],F=[],O=[],T0=performance.now(),raf=0;
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var ptr={x:-999,y:-999,down:false,moved:0,sx:0,sy:0,counted:false,pushed:false};
var KEY="xmm.gal.n";
function gal(){try{return +localStorage.getItem(KEY)||0}catch(e){return 0}}
function size(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0);
 var n=Math.round(Math.max(1200,Math.min(2600,W*H/700)));P=[];
 var gx=W*.7,gy=H*.38,R=Math.min(W,H)*.42;
 for(var i=0;i<n;i++){var r=Math.pow(rnd(),.8),arm=rnd()<.5?0:Math.PI,th=arm+r*5+(rnd()+rnd()-1)*(.25+.3*(1-r));
  P.push({r:r,th:th,w:.05/(.15+r),gx:gx,gy:gy,R:R,dx:0,dy:0,vx:0,vy:0,s:.5+rnd()*1.1,p:rnd()*PI2,v:.6+rnd()*2,c:rnd()<.25?"#bcd4ff":"#fff"})}
 F=[];for(var j=0;j<Math.round(W*H/2600);j++)F.push({x:rnd()*W,y:rnd()*H,dx:0,dy:0,vx:0,vy:0,hx:0,hy:0,s:.4+rnd()*1.2,p:rnd()*PI2,v:.4+rnd()*2.2,dr:(rnd()-.5)*.012});
 F.forEach(function(f){f.hx=f.x;f.hy=f.y});
 O=[];for(var k=0;k<16;k++)O.push({u:rnd(),v:.00006+rnd()*.00006,o:6+rnd()*14,s:.8+rnd()*1.4,p:rnd()*PI2})}
function bubble(){var l=document.querySelectorAll("#msgs .m-bot>.body");if(!l.length)return null;var b=l[l.length-1].getBoundingClientRect();
 if(b.width<20||b.bottom<0||b.top>H)return null;return b}
function push(o){var ex=o.px-ptr.x,ey=o.py-ptr.y,d=Math.sqrt(ex*ex+ey*ey);
 if(ptr.down&&d<150&&d>.1){var f=(1-d/150)*2.2;o.vx+=ex/d*f;o.vy+=ey/d*f;ptr.pushed=true}}
function step(o,hx,hy){o.vx+=(hx-(o.px-o.dx))*0;o.dx+=o.vx;o.dy+=o.vy;o.vx*=.9;o.vy*=.9;o.vx-=o.dx*.012;o.vy-=o.dy*.012}
function frame(now){raf=requestAnimationFrame(frame);if(document.hidden)return;
 var t=(now-T0)/1000;x.clearRect(0,0,W,H);
 var tilt=.55,gxm=W*.7,gym=H*.38;
 /* galaxy glow */
 var g=x.createRadialGradient(gxm,gym,0,gxm,gym,Math.min(W,H)*.35);g.addColorStop(0,"rgba(190,210,255,.22)");g.addColorStop(1,"rgba(0,0,0,0)");x.globalAlpha=1;x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle="#fff";
 for(var i=0;i<F.length;i++){var f=F[i];f.hx+=f.dr;if(f.hx>W+5)f.hx=-5;if(f.hx<-5)f.hx=W+5;f.px=f.hx+f.dx;f.py=f.hy+f.dy;push(f);f.dx+=f.vx;f.dy+=f.vy;f.vx*=.9;f.vy*=.9;f.vx-=f.dx*.012;f.vy-=f.dy*.012;
  x.globalAlpha=.25+.75*Math.abs(Math.sin(t*f.v+f.p));x.beginPath();x.arc(f.hx+f.dx,f.hy+f.dy,f.s*.7,0,PI2);x.fill()}
 for(i=0;i<P.length;i++){var p=P[i],a=p.th+p.w*t*(reduce?0:1),X=Math.cos(a)*p.r*p.R,Z=Math.sin(a)*p.r*p.R*tilt;
  p.px=p.gx+X*.94-Z*.34+p.dx;p.py=p.gy+X*.34+Z*.94+p.dy;push(p);p.dx+=p.vx;p.dy+=p.vy;p.vx*=.9;p.vy*=.9;p.vx-=p.dx*.012;p.vy-=p.dy*.012;
  x.globalAlpha=Math.min(1,(.35+.65*Math.abs(Math.sin(t*p.v+p.p)))*(1.05-p.r*.5));x.fillStyle=p.c;x.beginPath();x.arc(p.px,p.py,p.s*(1.2-p.r*.5),0,PI2);x.fill()}
 /* stars orbiting the AI bubble */
 var b=bubble();
 if(b){var pad=10,w=b.width+pad*2,h=b.height+pad*2,per=2*(w+h);x.fillStyle="#fff";
  for(i=0;i<O.length;i++){var o=O[i];o.u=(o.u+o.v*(reduce?0:16))%1;var d=o.u*per,px,py,off=Math.sin(t*1.3+o.p)*3;
   if(d<w){px=b.left-pad+d;py=b.top-pad-off}else if(d<w+h){px=b.right+pad+off;py=b.top-pad+(d-w)}else if(d<2*w+h){px=b.right+pad-(d-w-h);py=b.bottom+pad+off}else{px=b.left-pad-off;py=b.bottom+pad-(d-2*w-h)}
   x.globalAlpha=.25;x.beginPath();x.arc(px,py,o.s*3,0,PI2);x.fill();x.globalAlpha=.5+.5*Math.sin(t*2+o.p);x.beginPath();x.arc(px,py,o.s,0,PI2);x.fill()}}
 x.globalAlpha=1}
/* interaction: drag on the empty background */
function empty(e){var t=e.target;if(!t||!t.closest)return false;
 if(t.closest("button,a,input,textarea,select,label,.composer,.dock,.topbar,#sideChat,.sheet,.modal,.m-bot,.m-user,.m-uw,.sunpop,pre,[contenteditable]"))return false;
 return !!t.closest("#viewChat,#mainChat,.convo,.msgs,body")}
addEventListener("pointerdown",function(e){if(!empty(e))return;ptr.down=true;ptr.x=e.clientX;ptr.y=e.clientY;ptr.sx=e.clientX;ptr.sy=e.clientY;ptr.moved=0;ptr.counted=false;ptr.pushed=false},{passive:true});
addEventListener("pointermove",function(e){if(!ptr.down)return;ptr.moved+=Math.abs(e.clientX-ptr.x)+Math.abs(e.clientY-ptr.y);ptr.x=e.clientX;ptr.y=e.clientY;
 if(!ptr.counted&&ptr.moved>70&&ptr.pushed){ptr.counted=true;hit()}},{passive:true});
function up(){ptr.down=false;ptr.x=ptr.y=-999}
addEventListener("pointerup",up,{passive:true});addEventListener("pointercancel",up,{passive:true});
function hit(){var n=gal()+1;try{localStorage.setItem(KEY,String(n))}catch(e){}
 if(n>=3&&window.XMM_SUN&&!XMM_SUN.galOk())XMM_SUN.unlockGalaxy()}
addEventListener("resize",size);size();raf=requestAnimationFrame(frame);
})();
