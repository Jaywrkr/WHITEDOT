"""Render the actual bounded group reply over the existing dense scheduler."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, threading, json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs');const out=[];for(const [i,genre]of ['minimaltechno','ambient','dnb'].entries())out.push(await renderMix(genre,{dense:true,totems:i%2?['hourglass','diamond','spire']:['stack','orb','bottle'],sampleRate:i%2?44100:48000}));return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0,row
   assert len(row['totemNotes'])==3,row['totemNotes']
   assert max(n['gain'] for n in row['totemNotes'])<=.28
   assert all(b['at']>a['at'] for a,b in zip(row['totemNotes'],row['totemNotes'][1:]))
  report={'renders':3,'maxPeak':max(r['peak'] for r in rows),'sampleRates':[44100,48000],'notes':[r['totemNotes'] for r in rows]}
  (ROOT.parent/'totems-audio.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
  print('PASS three dense actual scheduler renders, six sculpture voices, bounded delayed replies, no clipping; peak '+str(report['maxPeak']),flush=True)
  browser.close()
finally:server.shutdown();server.server_close()
