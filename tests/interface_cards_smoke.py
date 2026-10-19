"""Actual earned cards, focus, manual reading and power pause across four sizes."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(viewport={'width':320,'height':640},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(320,640),(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=interface-{width}');page.wait_for_function('!!window.__r?.celebrateBox')
   page.evaluate("()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.mode='world';r.S.sound=false;r.collectRareCard('fossil',{id:'interface:'+innerWidth,x:r.S.wx,y:r.S.wy},{forced:true});}")
   page.wait_for_function('!document.getElementById("rareNotice").hidden',timeout=45000);page.wait_for_timeout(400)
   rect=page.locator('#rareNotice').bounding_box();assert rect['width']<=width-32 and rect['height']<=180
   assert page.locator('#rareNotice').get_attribute('data-inspect')=='false';assert page.locator('.rare-reveal-card').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
   page.wait_for_timeout(300);assert page.locator('#rareNotice').is_visible();page.locator('#rareNoticeDismiss').click();page.wait_for_function('document.getElementById("rareNotice").hidden')
   page.evaluate("()=>{const r=__r;r.givePower('cometa');r.celebrateBox({id:'interface-box:'+innerWidth,x:r.S.wx,y:r.S.wy,power:'cometa',gift:true});}")
   page.wait_for_function('!document.getElementById("celebration").hidden',timeout=45000);page.wait_for_timeout(400)
   assert page.locator('#celebration').get_attribute('data-inspect')=='false';page.locator('#celebrationContinue').click()
   assert page.locator('#celebration').evaluate('e=>e.contains(document.activeElement)');assert page.locator('.celebration-card').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
   a=page.locator('#celebrationShare').bounding_box();b=page.locator('#celebrationContinue').bounding_box();assert abs(a['y']-b['y'])<2 and a['x']<b['x'],[a,b]
   left=page.evaluate('__r.powerSecondsLeft("cometa")');page.wait_for_timeout(250);assert page.evaluate('__r.powerSecondsLeft("cometa")')==left
   page.locator('#celebrationContinue').click();page.wait_for_function('document.getElementById("celebration").hidden');page.evaluate('__r.clearPowers()')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   print(f'PASS compact notices, explicit details, focus, manual power pause and aligned actions at {width}',flush=True)
  browser.close()
finally:server.shutdown()
