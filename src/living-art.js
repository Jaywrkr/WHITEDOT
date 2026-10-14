// Original, small line glyphs. All color belongs to the encounter, never the background.
export function livingGlyph(c,o,t){
 const s=o.size,p=o.phase+Math.sin(t/1200+o.phase)*.12;c.beginPath();
 switch(o.shape){
 case 'branch':case 'roots':c.moveTo(0,s);c.quadraticCurveTo(Math.sin(p)*s*.3,0,0,-s);for(const side of [-1,1]){c.moveTo(0,-s*.2);c.quadraticCurveTo(side*s*.6,-s*.8,side*s,-s*.65);}break;
 case 'pods':for(let i=0;i<3;i++){const x=(i-1)*s*.6;c.moveTo(x,0);c.ellipse(x,-s*.2,s*.22,s*.38,p,0,Math.PI*2);}break;
 case 'vine':case 'worm':c.moveTo(-s,0);c.bezierCurveTo(-s*.5,-s,0,s,s,0);break;
 case 'network':for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=Math.cos(a)*s,y=Math.sin(a)*s;c.moveTo(0,0);c.lineTo(x,y);c.moveTo(x+3,y);c.arc(x,y,3,0,Math.PI*2);}break;
 case 'flower':for(let i=0;i<5;i++){const a=i*Math.PI*2/5;c.moveTo(0,0);c.quadraticCurveTo(Math.cos(a-.3)*s,Math.sin(a-.3)*s,Math.cos(a+.3)*s,Math.sin(a+.3)*s);}break;
 case 'reeds':for(let i=-1;i<=1;i++){c.moveTo(i*5,s);c.quadraticCurveTo(i*6+Math.sin(p)*6,0,i*5+Math.sin(p)*4,-s);}break;
 case 'moss':case 'lichen':for(let i=0;i<5;i++){const a=i*2.4;c.moveTo(Math.cos(a)*s*.6+3,Math.sin(a)*s*.5);c.arc(Math.cos(a)*s*.6,Math.sin(a)*s*.5,3,0,Math.PI*2);}break;
 case 'cactus':c.moveTo(0,s);c.lineTo(0,-s);c.moveTo(-s*.7,-s*.4);c.lineTo(-s*.7,0);c.lineTo(0,0);c.lineTo(s*.7,0);c.lineTo(s*.7,-s*.6);break;
 case 'seed':c.ellipse(0,0,s*.3,s*.65,p,0,Math.PI*2);c.moveTo(0,-s*.65);c.quadraticCurveTo(s*.8,-s,s,-s*.2);break;
 case 'manta':case 'moth':c.moveTo(-s,0);c.quadraticCurveTo(-s*.5,-s*Math.abs(Math.sin(p)),0,0);c.quadraticCurveTo(s*.5,-s*Math.abs(Math.sin(p)),s,0);c.moveTo(0,0);c.lineTo(0,s*.5);break;
 case 'deer':c.moveTo(-s*.6,s*.4);c.lineTo(-s*.4,-s*.3);c.lineTo(s*.3,-s*.3);c.lineTo(s*.6,-s);c.moveTo(-s*.2,-s*.3);c.lineTo(-s*.5,s);c.moveTo(s*.2,-s*.3);c.lineTo(s*.4,s);c.moveTo(s*.6,-s);c.lineTo(s*.25,-s*1.3);c.moveTo(s*.6,-s);c.lineTo(s,-s*1.4);break;
 case 'turtle':c.ellipse(0,0,s,s*.6,0,Math.PI,Math.PI*2);c.lineTo(s,0);c.lineTo(-s,0);c.moveTo(s,0);c.arc(s+3,0,3,0,Math.PI*2);break;
 case 'beetle':case 'crab':c.ellipse(0,0,s*.5,s*.6,0,0,Math.PI*2);for(let i=-1;i<=1;i++){c.moveTo(-s*.4,i*s*.35);c.lineTo(-s,i*s*.65);c.moveTo(s*.4,i*s*.35);c.lineTo(s,i*s*.65);}break;
 case 'jelly':c.ellipse(0,0,s,s*.5,0,Math.PI,Math.PI*2);for(let i=-1;i<=1;i++){c.moveTo(i*s*.6,0);c.quadraticCurveTo(i*s*.6+Math.sin(p)*5,s*.5,i*s*.6,s);}break;
 case 'whale':c.moveTo(-s,0);c.quadraticCurveTo(0,-s*.6,s,0);c.moveTo(s*.4,0);c.lineTo(s*.7,s*.5);break;
 case 'blob':for(let i=0;i<=24;i++){const a=i*Math.PI/12,r=s*(.75+.1*Math.sin(a*3+p));if(!i)c.moveTo(Math.cos(a)*r,Math.sin(a)*r);else c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}break;
 default:c.ellipse(0,0,s,s*.6,p,0,Math.PI*2);
 }
 c.stroke();
}
