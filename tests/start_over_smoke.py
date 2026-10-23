"""Starting over (phase 6 of the plan): from Ajustes, two taps start a new game on this device and keep the current one
as the previous game; one tap brings it back. With an account open it is not offered, so the cloud never takes the
empty game as the newest."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.startOver')
  page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.firstJourney.skipped=true;s.sparks=57;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();}")
  page.wait_for_timeout(500);page.evaluate(hide)
  # The menu button waits for the first touch in a new Camino; Ajustes is opened the way the menu opens it.
  def settings():page.evaluate(hide);page.evaluate("__r.$('bSettings').click()");page.wait_for_selector('#mSettings:not([hidden])')
  settings();assert page.locator('#bStartOver').is_enabled() and page.locator('#bPreviousSave').is_hidden()
  # One tap only asks; the second starts over.
  page.locator('#bStartOver').click();assert page.locator('#bStartOver').inner_text().startswith('¿Seguro?') and page.evaluate('__r.S.sparks')==57
  with page.expect_navigation():page.locator('#bStartOver').click()
  page.wait_for_function('!!window.__r?.startOver');s=page.evaluate('({sparks:__r.S.sparks,crystals:__r.S.pathCrystals.length,mode:__r.S.mode})');assert s['sparks']==0 and s['crystals']==0 and s['mode']=='camino',s
  # The previous game comes back with one tap.
  settings();assert page.locator('#bPreviousSave').is_visible()
  with page.expect_navigation():page.locator('#bPreviousSave').click()
  page.wait_for_function('!!window.__r?.startOver');assert page.evaluate('__r.S.sparks')==57 and page.evaluate('__r.S.pathCrystals.length')==10
  assert not errors,errors;browser.close()
 print('PASS start over: two taps in Ajustes start a new game and keep the current one, one tap brings it back (with an account open it is not offered: tests/start-over.mjs)',flush=True)
finally:server.shutdown()
