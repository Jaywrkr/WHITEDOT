const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const nonnegative=v=>Number.isFinite(v)&&v>=0?v:0;
const count=v=>object(v)?Object.keys(v).length:0;
export function normalizeProfile(raw,at=new Date().toISOString()){
 if(object(raw)&&Number.isInteger(raw.version)&&raw.version>1)return raw;
 const p=object(raw)?raw:{};
 return {...p,version:1,name:typeof p.name==='string'?p.name.trim().slice(0,24):'',since:typeof p.since==='string'&&Number.isFinite(Date.parse(p.since))?p.since:at,
  activeSeconds:nonnegative(p.activeSeconds),worldSeconds:nonnegative(p.worldSeconds),caminoSeconds:nonnegative(p.caminoSeconds),houseSeconds:nonnegative(p.houseSeconds),distanceUnits:nonnegative(p.distanceUnits),sessions:nonnegative(p.sessions)};
}
export function createProfileTracker(){
 let previous=null,owner=null,counted=false;
 return {reset(){previous=null;owner=null;counted=false;},tick(profile,s,{dt,active=true,maxSpeed=800,worldKey=''}={}){
  if(owner!==s){owner=s;previous=null;counted=false;}
  const point={x:s.mode==='camino'?s.px:s.wx,y:s.mode==='camino'?s.py:s.wy,mode:s.mode,layer:s.layer||'superficie',world:worldKey};
  const valid=Number.isFinite(point.x)&&Number.isFinite(point.y),seconds=Number.isFinite(dt)&&dt>0&&dt<=1?dt:0;
  if(profile.version===1&&active&&seconds&&['camino','world','studio'].includes(s.mode)){
   if(!counted){profile.sessions++;counted=true;}
   profile.activeSeconds+=seconds;profile[s.mode==='world'?'worldSeconds':s.mode==='studio'?'houseSeconds':'caminoSeconds']+=seconds;
   if(valid&&previous&&s.mode!=='studio'&&previous.mode===point.mode&&previous.layer===point.layer&&previous.world===point.world){const distance=Math.hypot(point.x-previous.x,point.y-previous.y);if(distance<=Math.max(0,maxSpeed)*seconds*1.5+4)profile.distanceUnits+=distance;}
  }
  previous=active&&seconds&&valid?point:null;
 }};
}
export function profileSummary(s){return {days:nonnegative(s.totalDays),places:count(s.places),genres:count(s.journal?.music?.genres),instruments:count(s.journal?.music?.instruments),elements:count(s.elementBook?.found),achievements:count(s.ach),cards:Array.isArray(s.rareBook?.items)?s.rareBook.items.filter(object).length:0,boxes:nonnegative(s.boxesOpened),favorites:Array.isArray(s.favorites?.items)?s.favorites.items.filter(object).length:0};}
export function formatPlayTime(seconds){const n=Math.floor(nonnegative(seconds));return n<60?n+' s':n<3600?Math.floor(n/60)+' min':Math.floor(n/3600)+' h '+Math.floor(n%3600/60)+' min';}
export function formatDistance(units){const meters=Math.floor(nonnegative(units)/10);return meters<1000?meters.toLocaleString('es-EC')+' m':(meters/1000).toLocaleString('es-EC',{maximumFractionDigits:1})+' km';}
