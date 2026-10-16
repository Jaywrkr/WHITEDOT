"""Actual creature voices in the production mix; no subjective beauty claim."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page()
  page.route('**/src/main.js',lambda route:route.fulfill(body='',content_type='text/javascript'));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const [i,role]of ['perc','bajo','lead','acorde'].entries())for(const sampleRate of [44100,48000])out.push(await renderMix(['minimal','deep','afro','nudisco'][i],{productionFoundation:true,scene:'inhabitant:'+role,renderSeconds:8,sampleRate}));return out;}''')
  for row in rows:
   assert row['referenceOrigin']=='acd766f' and row['inhabitantNotes'],row
   assert all(n['voice']['role']==row['scene'].split(':')[1] and n['gridError']<.01 for n in row['inhabitantNotes']),row
   assert 0<row['fullPeak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
  Path('/tmp/whitedot-inhabitants-audio.json').write_text(json.dumps(rows,indent=2)+'\n');print('PASS eight actual inhabitant mixes: four musical roles, shared clock, 44.1/48 kHz and protected output',flush=True);b.close()
finally:server.shutdown()
