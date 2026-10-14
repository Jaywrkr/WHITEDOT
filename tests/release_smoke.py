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
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=release&layout=wide&generation=2');page.wait_for_function('document.body.classList.contains("world-mode")')
   assert page.locator('#releaseVersion').inner_text()=='v'+version
   assert page.locator('#releaseDeploy').inner_text()=='deploy sin registrar'
   rect=page.locator('#releaseBadge').bounding_box();assert rect['x']>=size['width']/2 and rect['x']+rect['width']<=size['width'] and rect['y']<40,rect
   assert page.locator('#releaseBadge').evaluate('(e)=>getComputedStyle(e).pointerEvents')=='none'
   clock=page.locator('.goal').bounding_box();assert not (rect['x']<clock['x']+clock['width'] and clock['x']<rect['x']+rect['width'] and rect['y']<clock['y']+clock['height'] and clock['y']<rect['y']+rect['height']),('release overlaps clock',rect,clock)
   assert page.locator('#releaseBadge').is_visible();assert not errors,errors;page.close()
  page=b.new_page(viewport={'width':390,'height':844})
  stamp={'version':version,'deployedAt':'2026-10-14T12:04:00.000Z','revision':'abcdef0'}
  page.route('**/src/release-info.js',lambda route:route.fulfill(body='export const RELEASE='+json.dumps(stamp)+';',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=release&layout=wide&generation=2');page.wait_for_function('document.body.classList.contains("world-mode")')
  assert '2026-10-14T12:04:00.000Z' in page.locator('#releaseBadge').get_attribute('title')
  assert 'sin registrar' not in page.locator('#releaseDeploy').inner_text()
  page.screenshot(path='/tmp/whitedot-release-mobile.png');b.close();print('PASS visible release/deploy metadata on 320/390/844 px, unknown dates honest, host timestamp localized and no interactive controls',flush=True)
finally:server.shutdown()
