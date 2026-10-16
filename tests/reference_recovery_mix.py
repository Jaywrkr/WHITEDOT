"""Render restored acd766f musical character with the actual production graph."""
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
  page.expose_function('__journeyProgress',lambda text:print(text,flush=True))
  page.route('**/src/main.js',lambda route:route.fulfill(body='',content_type='text/javascript'));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const [genre,sampleRate]of [['deep',48000],['afro',44100],['nudisco',48000],['ambient',44100]])out.push(await renderMix(genre,{productionFoundation:true,dense:true,renderSeconds:8,sampleRate}));return out;}''')
  for row in rows:
   assert row['referenceOrigin']=='acd766f',row
   assert 0<row['fullPeak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
   assert row['instrumentHits'] and all(n['errorSeconds']<.01 for n in row['conductorOnsets']),row
  Path('/tmp/whitedot-reference-audio.json').write_text(json.dumps(rows,indent=2)+'\n')
  print('PASS four actual acd766f production mixes at 44.1/48 kHz, protected output and shared timing',flush=True);browser.close()
finally:server.shutdown()
