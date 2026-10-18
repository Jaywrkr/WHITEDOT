"""Real manual pulses break crystals, collect sparks and persist the wallet."""
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
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&layout=wide&generation=2&travel=1')
  page.wait_for_function('!!window.__r?.crystalTick')
  page.evaluate("""()=>{
   const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.wx=5000;r.S.wy=5200;r.stopAutopilot?.();
   document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
   r.crystalTick(.02);
   const o=r.crystalState.near.find(o=>o.size===2);
   if(!o)throw Error('No medium crystal fixture');
   window.crystal=o;window.startSparks=r.S.sparks;
   r.S.wx=o.x;r.S.wy=o.y-45;
  }""")
  page.wait_for_timeout(800)
  page.evaluate("__r.sonar('ambient')")
  page.wait_for_timeout(900)
  assert page.evaluate("!__r.crystalState.near.find(o=>o.id===crystal.id).hits")
  # Use the real pointer gesture, not a fabricated wave.
  for i in range(2):
   page.mouse.click(30, page.viewport_size['height']//2)
   page.wait_for_timeout(900)
  page.wait_for_function('__r.S.sparks>=startSparks+3')
  assert page.evaluate('__r.crystalState.near.find(o=>o.id===crystal.id).collected')
  page.screenshot(path=str(ROOT.parent/'crystal-mobile.png'))
  before=page.evaluate('__r.S.sparks')
  from browser_helpers import keep_place_on_reload
  keep_place_on_reload(page)
  page.reload();page.wait_for_function('!!window.__r?.crystalTick')
  assert page.evaluate('__r.S.sparks')==before
  page.set_viewport_size({'width':1280,'height':800})
  page.wait_for_timeout(400)
  page.screenshot(path=str(ROOT.parent/'crystal-desktop.png'))
  assert not errors, errors
  browser.close()
 print('PASS real pointer pulses, ambient rejection, crystal collection, saved wallet and mobile/desktop rendering')
finally:
 server.shutdown();server.server_close()
