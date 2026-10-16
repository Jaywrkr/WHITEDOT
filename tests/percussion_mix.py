"""Real dense cultural calls and Claude expansion layers."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  results=page.evaluate("""async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{RHYTHM_KINDS,RHYTHM_ELEMENTS}=await import('/src/percussion-model.js'),{initialize}=await import('/src/data.js'),r={},out=[];initialize(r);
   let i=0;for(const genre of Object.keys(r.GEN))out.push(await renderMix(genre,{dense:true,scene:'rhythm:'+RHYTHM_KINDS[i++%8]}));
   for(const kind of Object.keys(RHYTHM_ELEMENTS))out.push(await renderMix('ambient',{dense:true,scene:'rhythm:'+kind,soft:true,sampleRate:44100}));return out;}""")
  (ROOT/'scripts/percussion-audio-validation.json').write_text(json.dumps(results,indent=2)+'\n')
  for r in results:
   assert 0<r['peak']<.96 and r['hotFraction']==0,r
   assert len(r['percussionNotes'])>0,r
   assert r['materialStrikes'] and all(n['kind']==r['scene'].split(':')[1] for n in r['materialStrikes']),r
   assert all(n['instrument'] in ['kick','tom','conga','wood','rim','shaker','guiro','timbale','clap'] for n in r['percussionNotes']),r
  print(f'PASS {len(results)} real percussion mixes: 52 genres and twenty-seven soft ambient families, max peak {max(r["peak"] for r in results):.5f}, no clipping',flush=True);b.close()
finally:server.shutdown()
