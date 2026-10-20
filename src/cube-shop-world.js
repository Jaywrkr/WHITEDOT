import {normalizeRoute,rollRoute,ROUTE_TODAY} from './cube-shop-model.js';
// Cube shop batch 3: trails under the cube and companions around it. Drawing only: reach, collisions and music are untouched.
// Only Huellas del día and Fantasma de ayer keep data (S.cubeRoute, bounded); the rest lives in memory and resets on a jump.
export function initialize(runtime){
 let owner=null,lastT=null,last=null,layer='',moved=0,routeStep=0,paint=[],comet=[],flowers=[],history=[],rainbowUntil=-1,breaks=[],lastBroken=null,stopped=0,bird={x:0,y:0,perch:0},cloud={x:0,y:0},dj={a:0,target:0,lastBeat:0};
 const q=()=>runtime.sparkEconomy||{},on=slot=>runtime.inWorld()?q().wear?.[slot]||'':'';
 const still=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 const ink=(part='lead')=>runtime.musicInk?.(null,part)||'#fff';
 const surface=()=>!runtime.S.layer||runtime.S.layer==='superficie';
 function reset(){paint=[];comet=[];flowers=[];history=[];last=null;moved=0;routeStep=0;}
 function route(){const S=runtime.S;if(!S.cubeRoute||S.cubeRoute.version!==1)S.cubeRoute=normalizeRoute(S.cubeRoute);const r=rollRoute(S.cubeRoute,S.todayKey);if(r!==S.cubeRoute)S.cubeRoute=r;return r;}
 // Once per frame: where the cube is in the world and how far it went.
 function sample(t){
  const S=runtime.S,x=runtime.camX??S.wx,y=runtime.camY??S.wy,key=(S.layer||'superficie')+'|'+(S.worldSeed||'');
  if(owner!==S||layer!==key){owner=S;layer=key;reset();}
  if(lastT===null||t<lastT||t-lastT>500){lastT=t;last={x,y};return 0;}
  const dt=(t-lastT)/1000,d=Math.hypot(x-last.x,y-last.y);lastT=t;
  if(d>400){reset();last={x,y};return dt;}
  moved=d;last={x,y};stopped=d<.4?stopped+dt:0;
  const broken=q().stats?.broken||0;if(lastBroken===null)lastBroken=broken;for(let i=lastBroken;i<broken;i++)breaks.push(t);lastBroken=broken;breaks=breaks.filter(b=>t-b<1200);if(breaks.length>=3){rainbowUntil=t+12000;breaks=[];}
  return dt;
 }
 // Trails: drawn before the cube, in world space.
 function trails(c,x,y,s,t){
  if(!runtime.inWorld())return;const dt=sample(t),piece=on('trail'),pet=on('companion'),calm=still(),S=runtime.S,wx=last?.x??S.wx,wy=last?.y??S.wy,ox=x-wx,oy=y-wy;
  if(dt&&moved>0){history.push({x:wx,y:wy,t});if(history.length>240)history.shift();}
  if(dt&&(piece==='trail:steps'||pet==='pet:ghost')&&surface()){const r=route();routeStep+=moved;if(routeStep>=26||!r.today.length){routeStep=0;const p=r.today.at(-1);if(!p||Math.hypot(p[0]-wx,p[1]-wy)>=20){r.today.push([Math.round(wx),Math.round(wy)]);if(r.today.length>ROUTE_TODAY)r.today.shift();}}}
  if(!piece)return;c.save();
  if(piece==='trail:graffiti'){
   if(dt&&moved>0){const p=paint.at(-1);if(!p||Math.hypot(p.x-wx,p.y-wy)>=12){paint.push({x:wx,y:wy,t,color:ink(paint.length%9<3?'perc':'lead'),join:!!p&&Math.hypot(p.x-wx,p.y-wy)<40});if(paint.length>220)paint.shift();}}
   paint=paint.filter(p=>t-p.t<25000);c.lineCap='round';c.lineWidth=3;
   for(let i=1;i<paint.length;i++){const a=paint[i-1],b=paint[i];if(!b.join)continue;c.globalAlpha=.45*(1-(t-b.t)/25000);c.strokeStyle=b.color;c.beginPath();c.moveTo(a.x+ox,a.y+oy);c.lineTo(b.x+ox,b.y+oy);c.stroke();}
  }
  if(piece==='trail:comet'){
   const tail=history.filter(p=>t-p.t<(calm?400:1300));
   if(calm){const p=tail[0];if(p&&Math.hypot(p.x-wx,p.y-wy)>2){const k=Math.hypot(p.x-wx,p.y-wy);c.strokeStyle=ink();c.globalAlpha=.5;c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+(p.x-wx)/k*s*3,y+(p.y-wy)/k*s*3);c.stroke();}else{c.fillStyle=ink();c.globalAlpha=.5;c.fillRect(x-s*1.6,y-1,s,2);}}
   else for(let i=1;i<tail.length;i++){const a=tail[i-1],b=tail[i],k=i/tail.length;c.strokeStyle=k>.8?'#fff':ink();c.globalAlpha=.65*k;c.lineWidth=Math.max(.6,k*Math.min(5,s*.45));c.beginPath();c.moveTo(a.x+ox,a.y+oy);c.lineTo(b.x+ox,b.y+oy);c.stroke();}
  }
  if(piece==='trail:steps'){
   const list=surface()?route().today:[];c.fillStyle='#fff';
   for(let i=1;i<list.length;i++){const [ax,ay]=list[i-1],[bx,by]=list[i],sx=bx+ox,sy=by+oy;if(sx<-10||sy<-10||sx>runtime.W+10||sy>runtime.H+10)continue;const k=Math.hypot(bx-ax,by-ay)||1,nx=-(by-ay)/k*3*(i%2?1:-1),ny=(bx-ax)/k*3*(i%2?1:-1);c.globalAlpha=.55;c.fillRect(Math.round(sx+nx-1),Math.round(sy+ny-1),2,2);c.fillRect(Math.round(sx+nx-1+(bx-ax)/k*3),Math.round(sy+ny-1+(by-ay)/k*3),2,1);}
   if(calm||!list.length){c.globalAlpha=.55;for(const [dx,dy] of [[-12,6],[-7,10],[-17,10]])c.fillRect(x+dx,y+dy,2,3);}
  }
  if(piece==='trail:garden'){
   if(dt&&moved>0){const p=flowers.at(-1);if(!p||Math.hypot(p.x-wx,p.y-wy)>=22){flowers.push({x:wx+(flowers.length%2?6:-6),y:wy+s/2+4,t:calm?t-2000:t,color:ink(flowers.length%3?'lead':'perc')});if(flowers.length>90)flowers.shift();}}
   flowers=flowers.filter(f=>t-f.t<45000);
   for(const f of flowers){const age=(t-f.t)/1000,grow=Math.min(1,age/1.2),wilt=Math.max(0,(age-40)/5),fx=Math.round(f.x+ox),fy=Math.round(f.y+oy),h=Math.round(1+grow*4);c.globalAlpha=.9*(1-wilt);c.fillStyle='#7fae7a';c.fillRect(fx,fy-h,1,h);c.fillRect(fx+1,fy-2,1,1);if(grow>=.6){c.fillStyle=f.color;c.fillRect(fx-2,fy-h-3,5,3);c.fillRect(fx-1,fy-h-4,3,5);c.fillStyle='#fff';c.fillRect(fx,fy-h-2,1,1);}}
   if(!flowers.length){c.globalAlpha=.8;for(const dx of [-10,10]){c.fillStyle='#7fae7a';c.fillRect(x+dx,y+s/2,1,3);c.fillStyle=ink();c.fillRect(x+dx-1,y+s/2-1,3,1);}}
  }
  if(piece==='trail:rainbow'&&t<rainbowUntil){
   const colors=['#ff5d5d','#ffb347','#fff26b','#7be07b','#6bb8ff','#b07bff'],fade=Math.min(1,(rainbowUntil-t)/2000);c.lineWidth=1;
   if(calm){colors.forEach((col,i)=>{c.strokeStyle=col;c.globalAlpha=.7*fade;c.beginPath();c.arc(x,y+s,s+8-i,Math.PI,0);c.stroke();});}
   else{const tail=history.filter(p=>t-p.t<1500);colors.forEach((col,i)=>{const off=(i-2.5)*1.2;c.strokeStyle=col;c.globalAlpha=.6*fade;c.beginPath();tail.forEach((p,j)=>{const n=tail[Math.min(tail.length-1,j+1)],k=Math.hypot(n.x-p.x,n.y-p.y)||1,px=p.x+ox-(n.y-p.y)/k*off,py=p.y+oy+(n.x-p.x)/k*off;j?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();});}
  }
  c.restore();
 }
 // Companions: drawn after the cube, around it.
 function companion(c,x,y,s,t){
  if(!runtime.inWorld())return;const pet=on('companion'),calm=still();if(!pet||!pet.startsWith('pet:'))return;c.save();
  if(pet==='pet:cloud'){
   const tx=x,ty=y-s/2-16;cloud.x+=(tx-cloud.x)*(calm?1:.12);cloud.y+=(ty-cloud.y)*(calm?1:.12);if(Math.hypot(cloud.x-tx,cloud.y-ty)>80){cloud.x=tx;cloud.y=ty;}
   const cx=Math.round(cloud.x),cy=Math.round(cloud.y);c.fillStyle='#cfd6dd';c.globalAlpha=.85;c.fillRect(cx-7,cy-1,14,4);c.fillRect(cx-4,cy-4,7,3);c.fillRect(cx+1,cy-3,4,2);
   c.fillStyle=ink('pad');c.globalAlpha=.75;const drop=Math.max(4,Math.round(y-s/2-cy-6));for(let i=0;i<4;i++){const fall=calm?(i*3)%drop:(t/12+i*37)%drop;c.fillRect(cx-5+i*3,cy+4+Math.round(fall),1,2);}
  }
  if(pet==='pet:bird'){
   const perch=stopped>1.5,tx=perch?x+1:x-s-10,ty=perch?y-s/2-2:y-s-10+(calm?0:Math.sin(t/260)*2);bird.x+=(tx-bird.x)*(calm?1:perch?.2:.1);bird.y+=(ty-bird.y)*(calm?1:perch?.2:.1);if(Math.hypot(bird.x-tx,bird.y-ty)>90){bird.x=tx;bird.y=ty;}
   const bx=Math.round(bird.x),by=Math.round(bird.y);c.fillStyle='#fff';c.globalAlpha=.95;
   if(perch&&Math.hypot(bird.x-tx,bird.y-ty)<2){c.fillRect(bx-2,by-2,4,2);c.fillRect(bx+1,by-3,2,1);c.fillStyle='#f0d27a';c.fillRect(bx+3,by-3,1,1);c.fillStyle='#000';c.fillRect(bx+1,by-3,1,1);}
   else{const up=calm||Math.sin(t/90)>0;c.fillRect(bx,by,1,1);c.fillRect(bx-2,by+(up?-1:1),2,1);c.fillRect(bx+1,by+(up?-1:1),2,1);c.fillRect(bx-3,by+(up?-2:1),1,1);c.fillRect(bx+3,by+(up?-2:1),1,1);}
  }
  if(pet==='pet:mimic'){
   const m=Math.max(4,Math.round(s*.6)),S=runtime.S,wx=last?.x??S.wx,wy=last?.y??S.wy;let px=x-s-6,py=y+s*.4,a=0;
   if(!calm){const back=history.filter(p=>t-p.t>=700),p=back.at(-1);if(p){px=p.x+x-wx;py=p.y+y-wy;const n=history[history.indexOf(p)+1];if(n)a=Math.atan2(n.y-p.y,n.x-p.x);const k=Math.hypot(px-x,py-y)||1,near=s*.9+m,far=s+18;if(k<near||k>far){const to=k<near?near:far;px=x+(px-x)/k*to;py=y+(py-y)/k*to;}}}
   c.translate(Math.round(px),Math.round(py));c.rotate(calm?0:a*.15);c.fillStyle=runtime.cubeColor?.()||'#fff';c.globalAlpha=.9;c.fillRect(-m/2,-m/2,m,m);c.globalAlpha=.4;c.strokeStyle=c.fillStyle;c.strokeRect(-m/2-1.5,-m/2-1.5,m+3,m+3);
  }
  if(pet==='pet:dj'){
   const b=runtime.beat?.()||0,r=s/2+11;if(calm)dj.a=-.8;else{if(b>.85&&dj.lastBeat<=.85)dj.target+=Math.PI/4;else if(!b)dj.target+=.012;dj.lastBeat=b;dj.a+=(dj.target-dj.a)*.18;}
   const dx=Math.round(x+Math.cos(dj.a)*r),dy=Math.round(y+Math.sin(dj.a)*r*.6),dr=4+(calm?0:b*1.5);c.strokeStyle='#fff';c.lineWidth=1;c.globalAlpha=.9;c.beginPath();c.arc(dx,dy,dr,0,6.283);c.stroke();c.fillStyle=ink();c.fillRect(dx-1,dy-1,2,2);c.globalAlpha=.6;c.beginPath();c.moveTo(dx,dy);c.lineTo(dx+Math.cos(dj.a*3)*dr,dy+Math.sin(dj.a*3)*dr);c.stroke();
  }
  if(pet==='pet:ghost'){
   const r=surface()?route():null,list=r?.yesterday?.length>1?r.yesterday:null;c.strokeStyle=c.fillStyle='#fff';c.lineWidth=1;
   if(list){let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;for(const [px,py] of list){x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px);y1=Math.max(y1,py);}
    const k=34/Math.max(1,x1-x0,y1-y0),mx=(x0+x1)/2,my=(y0+y1)/2,at=p=>[x+(p[0]-mx)*k,y+(p[1]-my)*k];c.globalAlpha=.14;c.beginPath();list.forEach((p,i)=>{const [px,py]=at(p);i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();
    const f=calm?0:(t/30000%1)*(list.length-1),i=Math.floor(f),a=at(list[i]),b=at(list[Math.min(list.length-1,i+1)]),g=f-i;c.globalAlpha=.45;c.fillRect(Math.round(a[0]+(b[0]-a[0])*g-2),Math.round(a[1]+(b[1]-a[1])*g-2),4,4);}
   else{const p=calm?null:history.find(p=>t-p.t<=1600),gx=p?p.x+x-(last?.x??0):x-s-6,gy=p?p.y+y-(last?.y??0):y-s*.6;c.globalAlpha=.35;c.fillRect(Math.round(gx-2),Math.round(gy-2),4,4);}
  }
  c.restore();
 }
 Object.defineProperties(runtime,{drawCubeShopTrails:{get:()=>trails},drawCubeShopCompanion:{get:()=>companion},cubeShopRainbow:{get:()=>()=>performance.now()<rainbowUntil}});
}
