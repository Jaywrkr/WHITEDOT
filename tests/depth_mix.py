"""Dense real audio renders of the deep interaction stage."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  results=page.evaluate("""async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];
   for(const encounter of ['weaver','box','animal'])for(const genre of ['minimal','tropical','dub','amapiano'])out.push(await renderMix(genre,{dense:true,influenced:true,encounter,deep:true}));
   out.push(await renderMix('nudisco',{dense:true,encounter:'box',deep:true,soft:true}));out.push(await renderMix('ambient',{encounter:'animal',deep:true,sampleRate:44100}));return out;}""")
  for r in results:assert 0<r['peak']<.96 and r['hotFraction']==0,r
  print(json.dumps(results,indent=2),flush=True);print('PASS deep threads, dense editable boxes and learned replies: bounded real audio at 44.1/48 kHz',flush=True)
  b.close()
finally:server.shutdown()
