"""Arrangement intensity changes actual backing, with a neutral default and protected output."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.expose_function('__mixProgress',lambda r:print('Rendered '+str(r),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const energySetting of [0,.5,1,null]){const r=await renderMix('deep',{livingMusic:true,energySetting,renderSeconds:6});out.push({energySetting,peak:r.peak,rmsDb:r.rmsDb,hotFraction:r.hotFraction,genre:r.genre,instruments:r.instrumentHits});}return out;}''')
  for row in rows:assert 0<row['peak']<.96 and row['hotFraction']==0,row
  assert rows[2]['rmsDb']>rows[0]['rmsDb']+.01,rows
  # Separate convolution renders vary below 0.001 dB; the pure transfer is exactly neutral.
  assert abs(rows[1]['peak']-rows[3]['peak'])<1e-5 and abs(rows[1]['rmsDb']-rows[3]['rmsDb'])<.001,rows
  (ROOT/'scripts/pulido-06-energy-audio.json').write_text(json.dumps({'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows},indent=2)+'\n');print('PASS four actual arrangement intensity renders, neutral default, changed output and bounded peaks',flush=True);b.close()
finally:server.shutdown()
