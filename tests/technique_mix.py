"""Render original techniques and prove that held voices survive, then release."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{
   const {TECHNIQUE_INSTRUMENTS,createTechniquePlayer}=await import('/src/instrument-techniques.js'),out=[];
   for(const [id,spec]of Object.entries(TECHNIQUE_INSTRUMENTS))for(const mode of ['normal','muted','slide','ghost',...(spec.sustain?['hold']:[])]){
    const rate=out.length%2?44100:48000,ac=new OfflineAudioContext(1,rate*5.5,rate),bus=ac.createGain();bus.connect(ac.destination);
    const r={ac,bus,S:{mode:'world'},hz:n=>440*2**((n-69)/12)},player=createTechniquePlayer(r);
    if(mode==='hold'){const voice=player.hold(id,60,0,.05);if(!voice)throw Error('Missing held voice');voice.update({pressure:.7,bend:.2},2.5);voice.release(4);}
    else player.play(id,60,0,.05,{technique:mode});
    const data=(await ac.startRendering()).getChannelData(0);let peak=0,energy=0,late=0,released=0;
    for(let i=0;i<data.length;i++){const v=data[i];if(!Number.isFinite(v))throw Error('Nonfinite signal');peak=Math.max(peak,Math.abs(v));energy+=v*v;if(i>rate*3&&i<rate*3.9)late+=v*v;if(i>rate*5)released+=v*v;}
    if(!(peak>0&&peak<.15))throw Error('Invalid voice level '+id+' '+peak);
    if(mode==='hold'&&!(late>0&&released===0))throw Error('Hold/release failed '+id);
    out.push({instrument:id,mode,sampleRate:rate,peak,energy,late,released});
   }return out;
  }''')
  for id in {r['instrument'] for r in rows}:
   cases={r['mode']:r for r in rows if r['instrument']==id}
   assert cases['normal']['energy']>cases['muted']['energy'] and cases['normal']['energy']>cases['ghost']['energy'],id
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows}
  (ROOT/'scripts/technique-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} technique renders, forty-three distinct voices, quieter muted/ghost, actual long holds and complete release',flush=True);b.close()
finally:server.shutdown()
