"""Temporary box UI stays reversible, silent and within phone/desktop bounds."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height})
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=sorpresas');page.wait_for_function('!!window.__r?.giveSurprise')
   page.evaluate('''()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.mode='world';r.S.todayLight=1;r.S.sound=false;r.giveSurprise('pequeno');r.hud();}''');page.wait_for_function('!document.getElementById("surpriseHud").hidden')
   assert page.evaluate('__r.surpriseStyle.scale')==.55;rect=page.locator('#surpriseHud').bounding_box();assert rect['x']>=0 and rect['x']+rect['width']<=width
   page.locator('#surpriseUndo').click();assert page.locator('#surpriseHud').is_hidden();assert page.evaluate('__r.surpriseStyle.scale')==1
   page.evaluate('__r.giveSurprise("redondo");__r.save()');page.reload();page.wait_for_function('window.__r?.surpriseStyle.shape==="round"')
   page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__r.S.mode="world";__r.hud()');page.wait_for_function('!document.getElementById("surpriseHud").hidden')
   page.locator('#bMenu').click();page.wait_for_function('document.getElementById("surpriseHud").hidden');before=page.evaluate('__r.snapshotBoxSurprises().remaining.redondo');page.wait_for_timeout(250);assert page.evaluate('__r.snapshotBoxSurprises().remaining.redondo')==before
   page.locator('#mnClose').click();page.wait_for_function('!document.getElementById("surpriseHud").hidden');page.locator('#surpriseUndo').click()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   print(f'PASS temporary surprise control, pause, persistence and undo at {width}',flush=True)
  browser.close()
finally:server.shutdown()
