"""Earned power cards: explicit secondary duration, aligned actions and manual inspection."""
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
  for width,height in [(320,640),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=tarjetas-{width}');page.wait_for_function('!!window.__r?.giveSurprise')
   page.evaluate("()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.mode='world';r.S.sound=false;r.givePower('cometa');r.giveSurprise('lento');r.celebrateBox({id:'card:'+innerWidth,x:r.S.wx,y:r.S.wy,power:'cometa',surprise:'lento',gift:true});}")
   page.wait_for_function('!document.getElementById("celebration").hidden',timeout=45000);page.wait_for_timeout(400)
   assert '10 s' in page.locator('#celebrationSurpriseName').inner_text();assert '20 s' in page.locator('#celebrationTime').inner_text()
   assert page.locator('#celebration').get_attribute('data-inspect')=='false';page.locator('#celebrationContinue').click()
   assert page.locator('.celebration-card').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
   a=page.locator('#celebrationShare').bounding_box();b=page.locator('#celebrationContinue').bounding_box();assert abs(a['y']-b['y'])<2 and a['x']<b['x'],[a,b]
   page.wait_for_function('Number(getComputedStyle(document.getElementById("celebration")).opacity)>.99')
   assert page.locator('#celebration').evaluate('e=>Number(getComputedStyle(e).opacity)>.99')
   left=page.evaluate('__r.snapshotBoxSurprises().remaining.lento');page.wait_for_timeout(250);assert page.evaluate('__r.snapshotBoxSurprises().remaining.lento')==left
   page.screenshot(path=f'/tmp/whitedot-box-polished-{width}.png');page.locator('#celebrationContinue').click();page.wait_for_function('document.getElementById("celebration").hidden')
   assert not errors,errors;print(f'PASS inspectable power card, independent durations, paused power and aligned actions at {width}',flush=True)
  browser.close()
finally:server.shutdown()
