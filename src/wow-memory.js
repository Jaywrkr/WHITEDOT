// Visual signatures use saved addresses only; never sample another world's generator.
function hash(text){let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return h>>>0;}
export function favoriteSignature(point={}){
 point=point&&typeof point==='object'?point:{};
 const a=point.address||point,text=v=>String(v??'').slice(0,100),number=v=>Number.isFinite(v)?v:0;
 let h=hash(JSON.stringify([text(a.seed),text(a.layout),number(a.generatorVersion),number(a.x??point.x),number(a.y??point.y),text(a.layer??point.layer),text(point.genre),text(point.material),text(point.character)]));
 const next=()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return (h>>>0)/4294967296;};
 const hue=[180,205,245,280,330][h%5],nodes=Array.from({length:6+h%3},()=>({x:(next()-.5)*1.7,y:(next()-.5)*1.6}));
 const edges=nodes.slice(1).map((_,i)=>[i,i+1]);if(nodes.length>6)edges.push([0,3]);
 return {nodes,edges,hue};
}
export function favoriteSignatureSVG(point){
 const s=favoriteSignature(point),x=p=>(32+p.x*30).toFixed(2),y=p=>(21+p.y*22).toFixed(2);
 return '<svg viewBox="0 0 64 42" aria-hidden="true" focusable="false"><g fill="none" stroke="hsl('+s.hue+' 45% 72%)" stroke-width=".7" opacity=".55">'+s.edges.map(([a,b])=>'<path d="M'+x(s.nodes[a])+' '+y(s.nodes[a])+'L'+x(s.nodes[b])+' '+y(s.nodes[b])+'"/>').join('')+'</g><g fill="#fff">'+s.nodes.map(p=>'<circle cx="'+x(p)+'" cy="'+y(p)+'" r="1.15"/>').join('')+'</g></svg>';
}
