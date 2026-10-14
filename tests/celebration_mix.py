"""Timed native intro over the dense real scheduler; no synthetic stubs."""
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
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const [i,genre]of ['minimaltechno','deep','afro','ambient','dnb','nudisco'].entries())out.push(await renderMix(genre,{celebration:true,dense:true,soft:i%2===1,sampleRate:i%2===1?44100:48000}));return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0,row
   assert len(row['celebrationNotes'])==1,row
   cue=row['celebrationNotes'][0];assert 36<=cue['bass']<=52 and cue['at']>=1.5,cue
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'sampleRates':[44100,48000],'rows':rows};(ROOT/'scripts/celebration-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print('PASS six box remates over dense native genres at 44.1/48 kHz; peak '+str(report['maxPeak']),flush=True);browser.close()
finally:server.shutdown()
