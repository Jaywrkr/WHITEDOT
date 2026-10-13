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
  results=page.evaluate("""async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];
   const {CULTURE_IDS}=await import('/src/culture-model.js');for(const id of CULTURE_IDS)out.push(await renderMix('dub',{dense:true,scene:'culture:'+id}));
   for(const scene of ['mirror','birds','quiet','power:campo','power:cometa','power:pincel','power:companero','experimental:glitch','experimental:micro'])for(const soft of [false,true])out.push(await renderMix('minimal',{dense:true,scene,soft,sampleRate:soft?44100:48000}));return out;}""")
  print(json.dumps(results,indent=2),flush=True)
  for r in results:
   assert 0<r['peak']<.96 and r['hotFraction']==0,r
   if r['scene'].startswith('culture:'):assert r['cultureHeard'],r
  print('PASS cultural calls, mirrors, cranes, powers, stillness and experimental layers: finite dense audio with headroom',flush=True);b.close()
finally:server.shutdown()
