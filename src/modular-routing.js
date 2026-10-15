// Existing threads become typed signal/CV routes. No recursive graph or arbitrary feedback.
export function compileThreadGraph(network,seedOf){
 const edges=(Array.isArray(network?.edges)?network.edges:[]).filter(e=>typeof e?.from==='string'&&typeof e?.to==='string'&&e.from.length<500&&e.to.length<500).slice(0,6),ports=id=>/anchor:0$/.test(id)?'source':/anchor:1$/.test(id)?'filter':/anchor:2$/.test(id)?'modulator':['resonator','sequencer','filter'][seedOf(id)%3],routes=[];
 for(const e of edges){const a=ports(e.from),b=ports(e.to),pair=[a,b];
  if(a===b)continue;
  if(pair.includes('modulator'))routes.push({from:'modulator',to:pair.find(p=>p!=='modulator')||'filter',type:'cv'});
  else if(pair.includes('sequencer'))routes.push({from:'sequencer',to:pair.find(p=>p!=='sequencer'),type:'cv'});
  else{const ordered=pair.sort((a,b)=>['source','filter','resonator'].indexOf(a)-['source','filter','resonator'].indexOf(b));routes.push({from:ordered[0],to:ordered[1],type:'signal'});}
 }
 return Object.freeze({version:1,routes:Object.freeze(routes.map(Object.freeze)),filter:routes.some(r=>r.to==='filter'||r.from==='filter'),resonator:routes.some(r=>r.to==='resonator'),
  modulation:routes.some(r=>r.type==='cv'),rate:.2+(edges.length%4)*.35,cutoff:900+edges.length*210,
  signature:routes.map(r=>`${r.from}>${r.to}:${r.type}`).sort().join('|')});
}
export function routeThreadGraph(ac,input,output,graph,time,end){
 const nodes=[],make=m=>{const n=ac[m]();nodes.push(n);return n;};let tail=input;
 if(graph.filter){const f=make('createBiquadFilter');f.type='lowpass';f.Q.value=.75;f.frequency.setValueAtTime(graph.cutoff,time);tail.connect(f);tail=f;
  if(graph.modulation){const lfo=make('createOscillator'),depth=make('createGain');lfo.frequency.value=graph.rate;depth.gain.value=graph.cutoff*.3;lfo.connect(depth).connect(f.frequency);lfo.start(time);lfo.stop(end);}}
 const dry=make('createGain');dry.gain.value=graph.resonator?.86:.95;tail.connect(dry).connect(output);
 if(graph.resonator){const delay=make('createDelay'),wet=make('createGain');delay.delayTime.value=.012+graph.rate*.008;wet.gain.value=.1;tail.connect(delay).connect(wet).connect(output);}
 if(graph.modulation&&!graph.filter){const lfo=make('createOscillator'),depth=make('createGain');lfo.frequency.value=graph.rate;depth.gain.value=.08;lfo.connect(depth).connect(dry.gain);lfo.start(time);lfo.stop(end);}
 return nodes;
}
