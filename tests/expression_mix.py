"""Focused real-audio regression: native bodies, four snares, four complete bands."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page()
  page.route('**/src/main.js',lambda route:route.fulfill(body='',content_type='text/javascript'));page.goto(f'http://127.0.0.1:{server.server_port}/')
  result=page.evaluate('''async()=>{
   const {initialize:instruments}=await import('/src/instruments.js'),{initialize:synthesis}=await import('/src/living-synthesis.js'),{electronicDrum}=await import('/src/electronic-ensemble.js'),rows=[],waves=[];
   for(const [i,id]of ['p_gutguitar','p_tinepiano','p_panreed','p_cellobody','velvetbass','phasekeys','snare:0','snare:1','snare:2','snare:3'].entries()){
    const rate=id.startsWith('snare:')?48000:i%2?44100:48000,ac=new OfflineAudioContext(1,rate*2,rate),bus=ac.createGain();bus.connect(ac.destination);
    const proxy=new Proxy(ac,{get(t,k){if(k==='state')return 'running';const v=Reflect.get(t,k,t);return typeof v==='function'?v.bind(t):v;}}),heard=[],r={ac:proxy,bus,verbIn:bus,dsend:bus,S:{mode:'world'},SIX:.125,hz:n=>440*2**((n-69)/12),recordInstrument:id=>heard.push(id),livingNoteCue:()=>{}};
    r.env=(g,t,a,v,d)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.00001,t+a+d);};
    r.noiseHit=(time,type,f,q,level,tail)=>{const b=ac.createBuffer(1,Math.ceil(rate*.5),rate),data=b.getChannelData(0);let s=123;for(let n=0;n<data.length;n++){s=(Math.imul(s,1664525)+1013904223)>>>0;data[n]=s/2147483648-1;}const o=ac.createBufferSource(),g=ac.createGain(),filter=ac.createBiquadFilter();o.buffer=b;filter.type=type;filter.frequency.value=f;filter.Q.value=q;r.env(g,time,.001,level,tail);o.connect(filter).connect(g).connect(bus);o.start(time);o.stop(time+tail+.02);};
    if(id.startsWith('snare:'))electronicDrum(r,'snare',.05,.045,{seed:0,snareStyle:Number(id.slice(-1)),body:176,snap:2400,tail:.13});
    else{instruments(r);synthesis(r);r.livingSynthesis({role:id==='velvetbass'?'bajo':'lead',instrument:id},id==='velvetbass'?43:60,.05,.045,{id:'native:'+id,variant:4});if(!heard.includes(id))throw Error('Native instrument replaced '+id);}
    const samples=(await ac.startRendering()).getChannelData(0);let peak=0,energy=0,late=0;for(let n=0;n<samples.length;n++){const v=samples[n];if(!Number.isFinite(v))throw Error('Nonfinite');peak=Math.max(peak,Math.abs(v));energy+=v*v;if(n>rate*1.8)late+=v*v;}
    if(!(peak>0&&peak<.2&&late<energy*.02))throw Error('Unbounded/inaudible voice '+id);
    if(id.startsWith('snare:'))waves.push(Array.from(samples.slice(Math.round(rate*.05),Math.round(rate*.1)),n=>Math.round(n*10000)));
    rows.push({instrument:id,sampleRate:rate,peak,energy,late});
   }
   if(new Set(waves.map(w=>JSON.stringify(w))).size!==4)throw Error('Snares collapsed to one waveform');
   const {renderMix}=await import('/tests/audio_mix.mjs'),mixes=[];
   for(const [i,[genre,source]]of [['minimaltechno','deer'],['garage','breath-tree'],['afro','reeds'],['nudisco','moth']].entries())mixes.push(await renderMix(genre,{scene:'living:'+source,dense:true,productionFoundation:true,sampleRate:i%2?44100:48000,renderSeconds:8}));
   return {voices:rows,mixes};
  }''')
  for row in result['mixes']:
   assert 0<row['peak']<.96 and row['hotFraction']==0 and -55<row['rmsDb']<-3,row
   assert sum(v for k,v in row['instrumentHits'].items() if k.startswith('living:'))>0,row
   assert row['conductorOnsets'] and max(n['errorSeconds'] for n in row['conductorOnsets'])<.009,row
  report={'voices':result['voices'],'mixes':[{k:r[k] for k in ['genre','scene','sampleRate','peak','rmsDb','hotFraction','instrumentHits']}|{'onsets':len(r['conductorOnsets']),'maxOnsetError':max(n['errorSeconds'] for n in r['conductorOnsets'])} for r in result['mixes']]}
  (ROOT/'scripts/juego-02-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print('PASS 10 native/kit renders and 4 dense bands, 44.1/48 kHz, preserved native timbres, four dry snares, grid, finite unclipped output and bounded tails',flush=True);browser.close()
finally:server.shutdown()
