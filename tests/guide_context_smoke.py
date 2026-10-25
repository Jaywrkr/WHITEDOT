"""Recover active campaign rules and accurate loop actions without auto overlays."""
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
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for W,H in [(320,568),(390,844),(1280,800)]:
   p=b.new_page(viewport={'width':W,'height':H});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?capitulo=bosque');p.wait_for_function('!!window.__r?.journeyChapter&&__r.journeyChapter().id==="bosque"')
   p.evaluate("()=>{__r.S.sound=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);__r.$('bGuide').click();}")
   assert p.locator('#guidePlaceLesson').is_visible();assert p.inner_text('#guidePlaceName')=='Bosque';assert 'Rodea' in p.inner_text('#guidePlaceSteps')
   assert 'Rodea' in p.inner_text('#guideNext');assert p.locator('#guidePlaceDemo').is_hidden()
   p.locator('#guideClose').click()
   p.evaluate("()=>{const r=__r;r.S.journey.finished=true;r.setJourneyMode('libre');r.jam.loop.ecos.push({x:r.S.wx,y:r.S.wy,events:[],layer:r.S.layer});r.jamUI();}")
   assert p.locator('#bLoop').get_attribute('aria-label')=='Borrar eco cercano'
   p.evaluate('__r.loopButton()');assert p.locator('#bLoop').get_attribute('aria-label')=='Grabar un eco'
   p.evaluate('__r.loopButton()');assert p.locator('#bLoop').get_attribute('aria-label')=='Cancelar grabación'
   assert not errors,errors;p.close()
  b.close()
 print('PASS campaign help and actual Eco action at phone/desktop sizes',flush=True)
finally:srv.shutdown();srv.server_close()
