// Reproducible topology, independent of placement RNG. The same descriptor draws a card/world.
export const ANATOMY_VERSION=1;
const shapes=new Set('frond chime cap fan cluster kite ribbon spinner spiral hare lantern centipede harp cairn gate nest wheel branch roots pods vine worm network flower reeds moss lichen cactus seed manta moth deer turtle beetle crab jelly whale blob mill arches orbit plaza mirrors bridge shelter'.split(' '));
const hash=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;};
const fraction=(seed,n)=>{let v=Math.imul(seed^(n*374761393),668265263);v=Math.imul(v^v>>>13,1274126177);return ((v^v>>>16)>>>0)/4294967296;};
export function normalizeAnatomy(raw){
 if(raw?.version!==1||!shapes.has(raw.shape)||!['flora','fauna','architecture'].includes(raw.group)||!Number.isInteger(raw.lineage)||raw.lineage<0||raw.lineage>4294967295||!Number.isInteger(raw.individual)||raw.individual<0||raw.individual>4294967295)return null;
 return Object.freeze({version:1,shape:raw.shape,group:raw.group,lineage:raw.lineage,individual:raw.individual,
  role:['bajo','perc','acorde','lead','agudo'].includes(raw.role)?raw.role:'lead'});
}
export function anatomyOf(object,family=null,seedOf=hash){
 const shape=shapes.has(object.shape)?object.shape:object.group==='flora'?'branch':'blob',kind=object.kind||shape;
 return normalizeAnatomy({version:1,shape,group:object.group||'fauna',role:object.role||'lead',
  lineage:seedOf(`anatomy:lineage:v1:${kind}:${family?.id||'native'}:${family?.key||''}`),
  individual:seedOf(`anatomy:individual:v1:${object.id||kind}:${object.variant||0}`)});
}
export function anatomyGenes(a){
 const r=n=>fraction(a.lineage,n),i=n=>fraction(a.individual,n);
 return {width:.66+r(1)*.26+(i(1)-.5)*.12,height:.65+r(2)*.28+(i(2)-.5)*.12,
  limbs:2+Math.floor(r(3)*4),segments:3+Math.floor(r(4)*4),lobes:3+Math.floor(r(5)*4),
  spread:.4+r(6)*.45,organ:a.role==='bajo'?.18:a.role==='perc'?.08:.11,
  lean:(i(3)-.5)*.16,ribs:r(7)>.5,phase:i(4)*Math.PI*2};
}
export function anatomyPath(a,phase=0){
 const g=anatomyGenes(a),w=g.width,h=g.height,sway=Math.sin(phase+g.phase)*.035,p=[];
 const put=(op,...v)=>p.push(op+v.map(n=>Number(n.toFixed(4))).join(' '));
 const M=(x,y)=>put('M',x,y),L=(x,y)=>put('L',x,y),Q=(x,y,a,b)=>put('Q',x,y,a,b),C=(...v)=>put('C',...v);
 const ellipse=(x,y,rx,ry)=>{M(x+rx,y);C(x+rx,y+ry*.56,x+rx*.56,y+ry,x,y+ry);C(x-rx*.56,y+ry,x-rx,y+ry*.56,x-rx,y);C(x-rx,y-ry*.56,x-rx*.56,y-ry,x,y-ry);C(x+rx*.56,y-ry,x+rx,y-ry*.56,x+rx,y);};
 // Flora is seen from above (docs/UNIVERSO.md): arms spread out from a centre instead of rising from a ground line.
 const branch=(n,root=false)=>{for(let k=0;k<n+2;k++){const a=k*6.283/(n+2)+g.lean+sway,x=Math.cos(a)*w,y=Math.sin(a)*h;M(0,0);Q(Math.cos(a+.35)*w*.5,Math.sin(a+.35)*h*.5,x,y);if(root){M(x,y);L(Math.cos(a+.3)*w*1.15,Math.sin(a+.3)*h*1.15);M(x,y);L(Math.cos(a-.3)*w*1.15,Math.sin(a-.3)*h*1.15);}}};
 switch(a.shape){

 case 'frond':for(let k=0;k<=g.limbs*4+8;k++){const a=k*.42+g.lean,r=k/(g.limbs*4+8),x=Math.cos(a)*w*r,y=Math.sin(a)*h*r;k?L(x,y):M(x,y);if(k%3===2){M(x,y);L(x+Math.cos(a+1.6)*.12,y+Math.sin(a+1.6)*.12);M(x,y);}}break;
 case 'chime':M(-w,-h*.8);Q(0,-h,w,-h*.8);for(let k=0;k<g.limbs;k++){const x=-w+2*w*(k+.5)/g.limbs;M(x,-h*.8);L(x,h*(.3+k/g.limbs*.5));ellipse(x,h*(.3+k/g.limbs*.5),.08,.06);}break;
 case 'cap':ellipse(0,0,w,h*.85);ellipse(0,0,w*.35,h*.3);for(let k=0;k<g.limbs+4;k++){const a=k*6.283/(g.limbs+4);M(Math.cos(a)*w*.35,Math.sin(a)*h*.3);L(Math.cos(a)*w*.95,Math.sin(a)*h*.8);}break;
 case 'fan':for(let k=0;k<g.limbs+2;k++){const a=-Math.PI+(k+.5)*Math.PI/(g.limbs+2);M(0,h*.5);Q(Math.cos(a)*w*.3,0,Math.cos(a)*w,Math.sin(a)*h);}break;
 case 'cluster':for(let k=0;k<g.lobes;k++){const a=k*2.4;ellipse(Math.cos(a)*w*.55,Math.sin(a)*h*.45,.1+(k%2)*.08,.12);}break;
 case 'kite':M(0,-h);Q(w*.4,-h*.2,w,0);Q(w*.4,h*.2,0,h*.45);Q(-w*.4,h*.2,-w,0);Q(-w*.4,-h*.2,0,-h);M(0,h*.4);Q(-w*.3,h*.8,0,h);break;
 case 'ribbon':M(-w,0);C(-w*.3,-h,w*.3,h,w,0);C(w*.3,h*.6,-w*.3,-h*.6,-w,0);M(w*.8,0);L(w,h*.4);break;
 case 'spinner':ellipse(0,0,w*.25,h*.3);for(let k=0;k<4;k++)for(const side of [-1,1]){M(side*w*.2,(k-1.5)*.12);L(side*w*.7,(k-1.5)*h*.4);L(side*w,(k-1.5)*h*.65);}break;
 case 'spiral':for(let k=0;k<28;k++){const a=k*.35,r=(1-k/32);const x=Math.cos(a)*w*r,y=Math.sin(a)*h*r;k?L(x,y):M(x,y);}M(-w,h*.5);L(w,h*.5);break;
 case 'hare':ellipse(0,0,w*.7,h*.45);M(w*.4,-h*.15);Q(w*.2,-h*1.3,w*.55,-h*.9);M(w*.65,-h*.2);Q(w*.7,-h*1.2,w*.9,-h*.8);M(-w*.5,h*.3);L(-w*.8,h*.65);break;
 case 'lantern':M(0,-h);Q(w,-h*.3,w*.5,h*.6);Q(0,h,-w*.5,h*.6);Q(-w,-h*.3,0,-h);M(-w*.4,0);L(w*.4,0);M(0,-h*.7);L(0,h*.6);break;
 case 'centipede':for(let k=0;k<g.segments;k++){const x=-w+2*w*k/g.segments,y=Math.sin(k+phase*.2)*h*.15;ellipse(x,y,.13,.13);M(x,y);L(x-.1,y+h*.5);M(x,y);L(x+.1,y-h*.5);}break;
 case 'harp':M(-w,h);Q(-w,-h,w,-h);L(w,h);L(-w,h);for(let k=1;k<g.limbs+1;k++){const x=-w+2*w*k/(g.limbs+1);M(x,h);L(x,-h*.6);}break;
 case 'cairn':for(let k=0;k<3;k++)ellipse(k%2?.1:0,h*.7-k*h*.5,w*(.9-k*.2),h*.2);break;
 case 'gate':M(-w,h);L(-w,-h);Q(0,-h*.7,w,-h);L(w,h);M(-w*.7,h);L(-w*.7,-h*.6);M(w*.7,h);L(w*.7,-h*.6);break;
 case 'nest':for(let k=0;k<3;k++){M(-w,h*.1+k*.16);Q(0,h,w,-h*.1+k*.16);}ellipse(0,0,w*.35,h*.3);break;
 case 'wheel':ellipse(0,0,w,h);for(let k=0;k<g.limbs+2;k++){const a=k*6.283/(g.limbs+2)+phase*.1;M(0,0);L(Math.cos(a)*w,Math.sin(a)*h);}break;
 case 'branch':branch(g.limbs);break;
 case 'roots':branch(g.limbs,true);M(-w,h*.6);Q(0,-h*1.1,w,h*.6);break;
 case 'pods':for(let k=0;k<g.limbs;k++){const a=k*6.283/g.limbs+sway,x=Math.cos(a)*w*.7,y=Math.sin(a)*h*.7;M(0,0);L(x*.6,y*.6);ellipse(x,y,.1+(k%2)*.05,.1+(k%2)*.05);}break;
 case 'vine':M(-w,h*.6);C(-w*.2,-h,w*.2,h,w,-h*.5);for(let k=0;k<g.limbs;k++){const x=-w+2*w*k/g.limbs;M(x,Math.sin(k)*.2);Q(x+.2,-.35,x+.35,-.15);}break;
 case 'worm':for(let k=0;k<g.segments;k++){const x=(k-(g.segments-1)/2)*.24,y=Math.sin(k*.9+phase*.3)*.16;ellipse(x,y,.14,.17*(1-k/g.segments*.35));}break;
 case 'network':for(let k=0;k<g.limbs+1;k++){const a=k*6.283/(g.limbs+1),x=Math.cos(a)*w,y=Math.sin(a)*h;M(0,0);Q(x*.2+sway,y*.8,x,y);ellipse(x,y,.08,.06);}break;
 case 'flower':for(let k=0;k<g.lobes;k++){const a=k*6.283/g.lobes+sway,x=Math.cos(a)*w,y=Math.sin(a)*h;M(0,0);L(x,y);ellipse(x,y,.05,.05);}ellipse(0,0,.1,.1);break;
 case 'reeds':for(let k=0;k<g.limbs;k++){const a=k*6.283/g.limbs+g.lean,r=.4+k/g.limbs*.5;ellipse(Math.cos(a)*w*r,Math.sin(a)*h*r,.06,.06);}ellipse(0,0,w*.25,h*.25);break;
 case 'moss':for(let k=0;k<g.segments;k++){const a=k*2.4;ellipse(Math.cos(a)*w*.65,Math.sin(a)*h*.4,.14,.09);}break;
 case 'lichen':for(let k=0;k<g.limbs+1;k++){const a=k*2.4,x=Math.cos(a)*w*.6,y=Math.sin(a)*h*.5;M(x-.13,y);L(x,y-.15);L(x+.16,y+.03);L(x-.06,y+.15);put('Z');}break;
 case 'cactus':ellipse(0,0,.18,.18);for(let k=0;k<g.limbs+3;k++){const a=k*6.283/(g.limbs+3)+g.lean;M(Math.cos(a)*.18,Math.sin(a)*.18);L(Math.cos(a)*w,Math.sin(a)*h);M(Math.cos(a)*w*.7,Math.sin(a)*h*.7);L(Math.cos(a+.25)*w*.85,Math.sin(a+.25)*h*.85);}break;
 case 'seed':ellipse(0,0,w*.45,h);M(0,-h);Q(w*.8,-h,w,-h*.25);break;
 case 'manta':for(const side of [-1,1]){M(0,-h*.2);Q(side*w*.5,-h*(g.spread+sway),side*w,0);Q(side*w*.4,h*.3,0,h*.15);}M(0,h*.1);Q(w*.2,h*.6,0,h);break;
 case 'moth':for(const side of [-1,1]){M(0,0);C(side*w,-h,side*w*1.1,h*.1,side*.1,0);M(0,0);Q(side*w*.85,h,side*.13,h*.6);}M(0,-h*.3);L(0,h*.8);break;
 case 'deer':M(-w,h*.2);L(-w*.6,-h*.3);L(w*.25,-h*.2);L(w*.5,-h*.8);for(const x of [-w*.5,w*.2]){M(x,-h*.2);L(x+.1,h);}for(let k=0;k<g.limbs;k++){M(w*.5,-h*.8);L(w*.5+(k-(g.limbs-1)/2)*.17,-h*1.12);}break;
 case 'turtle':M(-w,0);Q(0,-h*1.2,w,0);L(-w,0);ellipse(w,0,.12,.1);for(const side of [-1,1]){M(side*w*.55,0);L(side*w*.7,h*.25);}if(g.ribs){M(0,0);L(0,-h*.55);}break;
 case 'beetle':ellipse(0,0,w*.5,h*.8);M(0,-h*.8);L(0,h*.8);for(let k=0;k<3;k++)for(const side of [-1,1]){M(side*w*.4,(k-1)*h*.4);L(side*w,(k-1)*h*.7);}break;
 case 'crab':ellipse(0,0,w,h*.4);for(const side of [-1,1]){M(side*w*.7,-h*.1);L(side*w*1.1,-h*.7);L(side*w*.8,-h*.8);for(let k=0;k<g.limbs;k++){M(side*w*.6,k*.12);L(side*w*(1-k*.05),h*.5+k*.1);}}break;
 case 'jelly':M(-w,0);C(-w,-h,w,-h,w,0);L(-w,0);for(let k=0;k<g.limbs;k++){const x=(k-(g.limbs-1)/2)*.3;M(x,0);Q(x+sway*3,h*.5,x,h);}break;
 case 'whale':M(-w,0);C(-w,-h*.5,w*.7,-h*.7,w,0);Q(w*.3,h*.35,-w,0);M(w*.6,0);L(w,h*.6);L(w*.95,-h*.2);break;
 case 'blob':for(let k=0;k<=24;k++){const a=k*6.283/24,r=.8+Math.sin(a*g.lobes+phase*.2)*.13;const x=Math.cos(a)*w*r,y=Math.sin(a)*h*r;k?L(x,y):M(x,y);}put('Z');break;
 case 'mill':ellipse(0,0,.18,.18);for(let k=0;k<g.limbs+1;k++){const a=k*6.283/(g.limbs+1)+phase*.12;M(Math.cos(a)*.2,Math.sin(a)*.2);L(Math.cos(a)*w,Math.sin(a)*h);L(Math.cos(a+.2)*w*.7,Math.sin(a+.2)*h*.7);}break;
 case 'arches':for(let k=0;k<g.limbs;k++){const x=(k-(g.limbs-1)/2)*.32;M(x-.13,h*.6);Q(x,-h,x+.13,h*.6);}break;
 case 'orbit':ellipse(0,0,w,h*.45);for(let k=0;k<g.limbs;k++){const a=k*6.283/g.limbs;ellipse(Math.cos(a)*w,Math.sin(a)*h*.45,.06,.06);}break;
 case 'plaza':for(let k=0;k<g.limbs+2;k++){const a=k*6.283/(g.limbs+2);ellipse(Math.cos(a)*w,Math.sin(a)*h,.1,.08);}break;
 case 'mirrors':for(let k=0;k<g.limbs;k++){const x=(k-(g.limbs-1)/2)*.3;M(x-.08,-h*.8);L(x+.08,-h*.6);L(x+.08,h*.8);L(x-.08,h*.6);put('Z');}break;
 case 'bridge':M(-w,h*.3);Q(0,-h*.5,w,h*.3);for(let k=0;k<g.limbs;k++)ellipse(-w+2*w*(k+.5)/g.limbs,0,.06,.06);break;
 case 'shelter':M(-w,h*.6);Q(0,-h,w,h*.6);M(-w,h*.6);Q(0,-h*.2,w,h*.6);for(let k=0;k<g.limbs;k++){M(-w+2*w*k/g.limbs,h*.6);L(-w+2*w*k/g.limbs,h*.75);}break;
 }
 // An organ signals register/role without a label or permanent glow.
 ellipse(g.lean,0,g.organ,a.role==='perc'?g.organ*.55:g.organ);
 return p.join('');
}
const paths=new Map();
export function drawAnatomy(c,a,size,phase=0){
 const key=JSON.stringify(a);let path=paths.get(key);if(!path){path=new Path2D(anatomyPath(a));paths.set(key,path);while(paths.size>192)paths.delete(paths.keys().next().value);}
 const s=Math.max(1,Math.min(28,size)),breath=Math.sin(phase)*.018;
 c.save();c.scale(s*(1+breath),s*(1-breath));c.lineWidth/=s;c.stroke(path);c.restore();
}
