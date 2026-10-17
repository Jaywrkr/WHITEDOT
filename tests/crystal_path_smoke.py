"""Real Camino crystals gate entry, preserve partial progress and place the wallet below distance."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, threading
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
 with sync_playwright() as pw:
  browser = pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'), args=['--no-sandbox'])
  page = browser.new_page(viewport={'width':390,'height':844})
  errors, sessions = [], []
  page.on('pageerror', lambda e: errors.append(str(e)))
  page.on('response', lambda r: sessions.append(r.status) if r.url.endswith('/api/session') else None)
  page.route('**/src/main.js', lambda route: route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;', content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/')
  page.wait_for_function('!!window.__r?.sparkTick')
  assert page.locator('#mHelpC .firma').inner_text()=='.simple'
  page.locator('#hcGo').click()
  assert page.evaluate('__r.S.mode')=='camino'
  assert not page.evaluate('__r.worldReady()')
  # A real tap breaks path crystals; walking alone never does.
  page.wait_for_timeout(800)
  assert page.evaluate('__r.S.pathCrystals.length')==0
  page.mouse.click(30,422);page.wait_for_timeout(1000)
  partial=page.evaluate('__r.S.pathCrystals.length')
  assert 0<partial<10
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkTick')
  assert page.evaluate('__r.S.pathCrystals.length')==partial
  assert page.evaluate('__r.S.mode')=='camino'
  for i in range(10):
   if page.evaluate('__r.inWorld()'):break
   page.evaluate("""()=>{const r=__r,o=r.crystalState.near.find(o=>!r.S.pathCrystals.includes(o.id)&&!o.broken);if(!o)throw Error('No path crystal');r.S.px=o.x;r.S.py=o.y-25;}""")
   page.mouse.click(30,422);page.wait_for_timeout(1000)
   n=page.evaluate('__r.S.pathCrystals.length')
   assert page.evaluate('__r.inWorld()')==(n==10)
  assert page.evaluate('__r.inWorld()')
  assert page.locator('#mHelpW').is_hidden()
  assert page.locator('#mCap').is_hidden()
  assert page.evaluate('__r.S.sparks')>=10
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(300)
   distance=page.locator('#walkDistance').bounding_box();wallet=page.locator('#sparkCount').bounding_box()
   assert wallet['y']>=distance['y']+distance['height']-1
   assert wallet['x']+wallet['width']<=width
   page.screenshot(path=str(ROOT.parent/f'crystal-path-{width}.png'))
  page.evaluate("""()=>{__r.S.firstJourney.skipped=true;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}""")
  page.reload();page.wait_for_function('!!window.__r?.showReturnEntrance')
  page.evaluate("""()=>{__r.S.help.camino=true;__r.S.firstJourney.skipped=true;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__r.showReturnEntrance();}""")
  assert page.locator('#returnEntrance .return-signature').inner_text()=='.simple'
  assert not errors,errors
  browser.close()
 print('PASS real Camino pulses, partial reload, automatic tenth-crystal entry, no prompts, responsive wallet and .simple signature')
finally:
 server.shutdown();server.server_close()
