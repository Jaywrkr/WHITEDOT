"""Actual walker replies over dense native styles, with bounded register and headroom."""
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
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const id of [0,12,24,36,48])for(const genre of ['deep','dub'])out.push(await renderMix(genre,{scene:'walker:'+id,renderSeconds:6,dense:true,soft:genre==='dub',sampleRate:genre==='dub'?44100:48000}));return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0,row
   assert row['walkerNotes'],row
   assert len(row['walkerNotes'])<=6,row
   assert all(0<=n['index']<7 and n['at']>=0 for n in row['walkerNotes']),row
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'sampleRates':[44100,48000],'rows':rows};(ROOT/'scripts/walkers-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print('PASS ten actual walker-response renders at 44.1/48 kHz; peak '+str(report['maxPeak']),flush=True);browser.close()
finally:server.shutdown()
