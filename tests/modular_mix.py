"""Original deeper engines and actual connected/disconnected signal paths."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{ADVANCED_INSTRUMENTS}=await import('/src/modular-synth.js'),out=[];
   for(const [i,id]of Object.keys(ADVANCED_INSTRUMENTS).entries())for(const dense of [false,true])out.push(await renderMix(['deep','ambient','organic','electro'][i%4],{scene:'synth:'+id,dense,soft:dense,renderSeconds:6,sampleRate:dense?44100:48000}));
   for(const genre of ['minimal','deep'])for(const deep of [false,true])out.push(await renderMix(genre,{encounter:'weaver',deep,dense:true,renderSeconds:6}));return out;
  }''')
  for r in rows:
   assert 0<r['peak']<.96 and r['hotFraction']==0 and -65<r['rmsDb']<-3,r
   if r['scene']:assert any(n['instrument']==r['scene'][6:] for n in r['advancedNotes']),r
   elif r['deep']:assert r['modularGraphs'] and all('cv' in s and 'signal' in s for s in r['modularGraphs']),r
   else:assert not r['modularGraphs'],r
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows};(ROOT/'scripts/modular-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} advanced-engine/cable renders, real DSP events, dense/soft, 44.1/48 kHz, peak {report["maxPeak"]:.6f}',flush=True);b.close()
finally:server.shutdown()
