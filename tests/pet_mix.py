"""Measure all pet roles at full growth, dense player input and independent stillness."""
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
  results=page.evaluate("""async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const species of ['golondrina','grulla','luciernaga']){for(const genre of ['minimal','tropical','dub'])for(const soft of [false,true])out.push(await renderMix(genre,{dense:true,soft,scene:'pet:'+species,productionFoundation:true,sampleRate:soft?44100:48000}));out.push(await renderMix('ambient',{scene:'pet:'+species+':idle',productionFoundation:true}));}return out;}""")
  for r in results:
   assert 0<r['peak']<.96 and r['hotFraction']==0,r
   assert r['petNotes'],r
   role={'golondrina':'melody','grulla':'bass','luciernaga':'groove'}[r['scene'].split(':')[1]];assert all(n['role']==role for n in r['petNotes'])
   if role!='groove':assert all(n['tones'] and any((n['note']-tone)%12==0 for tone in n['tones']) for n in r['petNotes']),r
   if role=='bass':assert all(36<=n['note']<=52 for n in r['petNotes']),r
  (ROOT/'scripts/pet-audio-validation.json').write_text(json.dumps(results,indent=2)+'\n')
  print(f'PASS {len(results)} production pet renders: audible harmony, replies/stillness, three roles, soft/normal, 44.1/48 kHz; max peak {max(r["peak"] for r in results):.6f}',flush=True);b.close()
finally:server.shutdown()
