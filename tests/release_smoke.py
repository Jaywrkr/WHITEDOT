"""Version badge, real timestamp rendering, responsive layout and silent information."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1];version=json.loads((ROOT/'package.json').read_text())['version']
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for size in [{'width':320,'height':640},{'width':390,'height':844},{'width':844,'height':390}]:
   page=b.new_page(viewport=size,has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null'),content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=release&layout=wide&generation=2');page.wait_for_function('document.body.classList.contains("world-mode")')
   assert page.locator('#releaseVersion').inner_text()=='v'+version
   assert page.locator('#releaseDeploy').inner_text()=='deploy sin registrar'
   # Estilo J: the world HUD stays clear; version and deploy live at the foot of the menu.
   assert not page.locator('#releaseBadge').is_visible()
   assert not page.locator('.hud').evaluate('(h)=>h.contains(document.getElementById("releaseBadge"))')
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.locator('#releaseBadge').scroll_into_view_if_needed()
   rect=page.locator('#releaseBadge').bounding_box();assert rect['x']>=0 and rect['x']+rect['width']<=size['width'] and rect['y']+rect['height']<=size['height'],rect
   assert page.locator('#releaseBadge').evaluate('(e)=>getComputedStyle(e).pointerEvents')=='none'
   assert page.locator('#releaseBadge').is_visible();assert not errors,errors;page.close()
  page=b.new_page(viewport={'width':390,'height':844})
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null'),content_type='text/javascript'))
  stamp={'version':version,'deployedAt':'2026-10-14T12:04:00.000Z','revision':'abcdef0'}
  page.route('**/src/release-info.js',lambda route:route.fulfill(body='export const RELEASE='+json.dumps(stamp)+';',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=release&layout=wide&generation=2');page.wait_for_function('document.body.classList.contains("world-mode")')
  assert '2026-10-14T12:04:00.000Z' in page.locator('#releaseBadge').get_attribute('title')
  assert 'sin registrar' not in page.locator('#releaseDeploy').inner_text()
  page.screenshot(path='/tmp/whitedot-release-mobile.png');b.close();print('PASS release/deploy metadata in the menu on 320/390/844 px, clear world HUD, unknown dates honest, host timestamp localized and no interactive controls',flush=True)
finally:server.shutdown()
