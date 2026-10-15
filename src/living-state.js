import {livingDefinition} from './living-catalog.js';import {VOICE_MODES} from './voice-guide.js';
export function normalizeLivingState(s){
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const seen={};if(object(s.livingSeen))for(const [kind,v]of Object.entries(s.livingSeen))if(livingDefinition(kind)&&object(v))seen[kind]={day:typeof v.day==='string'?v.day.slice(0,10):'',variant:Number.isInteger(v.variant)?Math.abs(v.variant)%256:0};s.livingSeen=seen;
 const sites={};if(object(s.livingSites))for(const [key,v]of Object.entries(s.livingSites).slice(-512))if(/^living:v1:-?\d+,-?\d+:\d+(?::(?:bajo|cielo))?$/.test(key)&&object(v))sites[key]={open:v.open===true,visits:Number.isInteger(v.visits)?Math.min(999,Math.max(0,v.visits)):0};s.livingSites=sites;
 const story={};for(const id of ['atencion','gesto','constancia','compartir'])if(object(s.jayStory)&&typeof s.jayStory[id]==='string')story[id]=s.jayStory[id].slice(0,10);s.jayStory=story;
 s.livingSeconds=Number.isFinite(s.livingSeconds)?Math.max(0,Math.min(1e9,s.livingSeconds)):0;
 s.voiceMode=VOICE_MODES.includes(s.voiceMode)?s.voiceMode:'discreta';s.autoIntent=['paisaje','vida','hallazgos','afinidad','contraste'].includes(s.autoIntent)?s.autoIntent:'paisaje';
 s.voiceDiary=Array.isArray(s.voiceDiary)?s.voiceDiary.filter(v=>object(v)&&typeof v.text==='string').slice(-80).map(v=>({text:v.text.slice(0,600),title:typeof v.title==='string'?v.title.slice(0,80):'Sistema',at:typeof v.at==='string'?v.at.slice(0,30):'',x:Number.isFinite(v.x)?v.x:null,y:Number.isFinite(v.y)?v.y:null,region:typeof v.region==='string'?v.region.slice(0,40):''})):[];
 const learned={};for(const role of ['bajo','perc','acorde','lead','agudo'])if(object(s.voiceLearned)&&s.voiceLearned[role]===true)learned[role]=true;s.voiceLearned=learned;return s;
}
