"""Real app entry wiring and bounded localized visuals on phone and desktop."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading, shutil, os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.emulate_media(reduced_motion='no-preference')
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=visuales');page.wait_for_function('!!window.__r?.drawVJWorld')
   page.evaluate('''()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.mode='camino';r.S.sound=false;r.S.todayLight=1;r.S.help.mundo=true;r.S.help.camino=true;r.hud();}''')
   page.locator('#bPrimary').click();page.wait_for_function('__r.inWorld()');assert page.locator('#bPrimary').is_enabled()
   page.evaluate('''()=>{const r=__r;let found;for(let i=0;i<30&&!found;i++){r.S.wx=i*1000;r.S.wy=0;found=r.nearbyVisualSegments()[0];}if(!found)throw Error('missing terrain');r.S.wx=found.x;r.S.wy=found.y;}''')
   page.wait_for_timeout(250);before=page.evaluate('JSON.stringify(__r.S.boxes||{})')
   page.evaluate('__r.visualGesture()');page.wait_for_timeout(80);assert page.evaluate('__r.vjState.gestures')>=1
   page.screenshot(path=f'/tmp/whitedot-vj-{width}.png')
   page.locator('#bMenu').click();page.wait_for_timeout(100);seconds=page.evaluate('__r.vjState.seconds');page.wait_for_timeout(200);assert page.evaluate('__r.vjState.seconds')==seconds
   page.locator('#mnClose').click();page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(100)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert before==page.evaluate('JSON.stringify(__r.S.boxes||{})')
   assert not errors,errors;print(f'PASS real entry, silent visuals, pause and reduced motion at {width}',flush=True)
  browser.close()
finally:server.shutdown()
