"""Actual pulse/game/reward path records the final note and isolates successive rounds."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?lugar=lago');p.wait_for_function('!!window.__r?.journeyPulse&&__r.placeRun()?.id==="lago"')
  p.evaluate("()=>{__r.S.sound=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}")
  for i in range(5):p.evaluate("__r.sonar('player')");p.wait_for_timeout(300)
  p.evaluate("()=>{__r.abandonPlace();__r.startPlace('lago');}")
  p.evaluate("__r.sonar('player')");p.wait_for_timeout(300)
  # Accelerate only the existing goal. The real game's gold pulse commits the phrase and reward.
  p.evaluate('__r.S.journey.chain.points=340');p.wait_for_function('__r.journeyChain().flower')
  p.evaluate("__r.sonar('player')");p.wait_for_function('!__r.placeRun()')
  got=p.evaluate('({kept:__r.S.lugares.notes.lago,steps:__r.S.lugares.noteSteps.lago,live:__r.journeyPulseState().notes.slice(-2)})')
  assert got['kept']==got['live'] and len(got['kept'])==2 and len(got['steps'])==2,got
  p.wait_for_function('!document.getElementById("mPlace").hidden');assert 'Tu frase' in p.inner_text('#placeRows')
  p.locator('#placeAgain').click();p.evaluate('__r.S.journey.chain.points=340');p.wait_for_function('__r.journeyChain().flower');p.wait_for_timeout(300);p.evaluate("__r.sonar('player')");p.wait_for_function('!__r.placeRun()')
  assert p.evaluate('__r.S.lugares.notes.lago')==p.evaluate('__r.journeyPulseState().notes.slice(-1)')
  assert not errors,errors;b.close()
 print('PASS actual gold close: last pulse retained, previous global phrase excluded and successive rounds isolated',flush=True)
finally:srv.shutdown();srv.server_close()
