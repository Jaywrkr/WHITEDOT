"""Real expanded-world scheduler plus dense native and ecological interaction voices."""
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
  results=page.evaluate("""async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];
   const genres=['minimal','tropical','dub','amapiano','nudisco','ambient'],seeds=['micelio-01','humedal-01','salinas-01','basalto-01'];
   for(let i=0;i<genres.length;i++)for(const soft of [false,true])out.push(await renderMix(genres[i],{dense:true,influenced:true,soft,worldSeed:seeds[i%4],generation:2,ecology:true,sampleRate:soft?44100:48000}));return out;}""")
  print(json.dumps(results,indent=2),flush=True)
  for r in results:assert 0<r['peak']<.96 and r['hotFraction']==0 and r['ecologyNotes']>=20,r
  print('PASS expanded worlds: real radio/grammar plus dense bass, groove and harmony gestures, soft mode and 44.1/48 kHz headroom',flush=True);b.close()
finally:server.shutdown()
