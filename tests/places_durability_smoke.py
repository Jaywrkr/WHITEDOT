"""Real storage write failure through the gold handler: safe retry, durable single reward and no stale card."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},service_workers='block');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=llanura');page.wait_for_function("!!window.__r?.journeyStick&&__r.placeRun()?.id==='llanura'&&__r.journeyGamePlaying('llanura')")
  before=page.evaluate("async()=>{const r=__r,m=await import('/src/journey-stick.js');r.S.sound=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);r.journeyStick();r.S.journey.stick.points=m.STICK_GOAL;r.save();const original=Storage.prototype.setItem;window.__restoreStorage=()=>Storage.prototype.setItem=original;window.__denyWrites=true;Storage.prototype.setItem=function(k,v){if(window.__denyWrites&&k===r.saveStore.key)throw new DOMException('fixture','QuotaExceededError');return original.call(this,k,v);};return r.S.sparks;}")
  page.evaluate("__r.journeyGamePulse(true,{step:0,silent:true})")
  assert page.evaluate("__r.placeRun()?.id==='llanura'&&!__r.S.journey.stick.swallowed")
  assert page.evaluate('__r.S.sparks')==before and page.locator('#mPlace').is_hidden()
  page.evaluate("()=>{window.__denyWrites=false;__r.journeyGamePulse(true,{step:0,silent:true});}")
  page.wait_for_function("!document.getElementById('mPlace').hidden")
  assert page.evaluate('__r.S.sparks')==before+170 and page.evaluate('__r.S.lugares.best.llanura.rounds')==1
  assert page.evaluate("JSON.parse(localStorage.getItem(__r.saveStore.key)).sparks")==before+170
  page.evaluate("()=>{window.__restoreStorage();__r.S=structuredClone(__r.S);__r.places();}")
  assert page.locator('#mPlace').is_hidden() and page.evaluate('__r.places().last') is None
  assert not errors,errors;browser.close()
 print('PASS real gold handler rolls back a storage-write failure, retries once, persists one reward and closes stale results on save replacement',flush=True)
finally:server.shutdown();server.server_close()
