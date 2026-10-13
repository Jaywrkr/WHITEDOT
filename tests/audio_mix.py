"""Offline Web Audio measurements; no speaker recording or artistic quality assertion."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading, json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
chromium=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser')
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=chromium,args=['--no-sandbox'])
  page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/',wait_until='domcontentloaded')
  results=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs');const out=[];
   for(const genre of ['minimal','dub','ambient','tropical','nudisco','amapiano','trap','dnb'])out.push(await renderMix(genre));
   for(const genre of ['nudisco','amapiano','dub','dnb'])out.push(await renderMix(genre,{dense:true,influenced:true}));
   for(const options of [{dense:true},{dense:true,fx:true},{soft:true},{dense:true,soft:true},{dense:true,sampleRate:44100},{dense:true,influenced:true},{dense:true,influenced:true,soft:true}])out.push(await renderMix('minimal',options));return out;}''')
  for result in results:
   assert 0 < result['peak'] < .96 and result['hotFraction']==0,result
  color=page.evaluate("async()=>{const {measureOutputColor}=await import('/tests/audio_mix.mjs');return measureOutputColor();}")
  assert color['distortionDb'] < -80 and color['distortionDb'] < color['oldDistortionDb']-30,color
  assert color['returnBassDb'] < -20 and abs(color['returnMidDb']) < .2,color
  normal=next(r for r in results if r['genre']=='minimal' and not r['dense'] and not r['soft'])
  soft=next(r for r in results if r['soft'] and not r['dense'])
  assert soft['rmsDb'] < normal['rmsDb']-3,(normal,soft)
  print(json.dumps({'renders':results,'color':color},indent=2),flush=True)
  print('PASS: real scheduler at 44.1/48 kHz, peak headroom, soft mode, linear output and cleaner effect returns',flush=True)
  browser.close()
finally:server.shutdown()
