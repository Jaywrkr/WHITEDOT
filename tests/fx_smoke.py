from browser_helpers import complete_path_fixture
# Navegador: mesa de efectos. El pad filtra y da espacio, vuelve a limpio al soltar, Fijar lo mantiene, Stop frena y no mueve al pixel.
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/'
CHROMIUM = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.locator('#bMenu').click();(page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bTools').click();page.locator('#bFx').click();assert page.locator('#fxPanel').is_visible()
  box=page.locator('#fxPad').bounding_box();before=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')
  page.mouse.move(box['x']+box['width']*.1,box['y']+box['height']*.2);page.mouse.down();page.wait_for_timeout(400)
  st=page.evaluate('(()=>{const f=window.__testRuntime.fx;return [f.lp.frequency.value,f.verbSend.gain.value]})()');assert st[0]<1500 and st[1]>.4,st
  page.screenshot(path=f'/tmp/whitedot-fx-{label}.png')
  page.mouse.move(box['x']+box['width']*.95,box['y']+box['height']*.5);page.wait_for_timeout(300)
  assert page.evaluate('window.__testRuntime.fx.hp.frequency.value')>1500
  page.mouse.up();page.wait_for_timeout(900)
  st=page.evaluate('(()=>{const f=window.__testRuntime.fx;return [f.lp.frequency.value,f.hp.frequency.value,f.verbSend.gain.value]})()');assert st[0]>15000 and st[1]<30 and st[2]<.05,('release returns to clean',st)
  after=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]');assert abs(after[0]-before[0])<1 and abs(after[1]-before[1])<1,'pad must not move the pixel'
  page.locator('#fxHold').click();page.mouse.move(box['x']+box['width']*.2,box['y']+box['height']*.3);page.mouse.down();page.wait_for_timeout(200);page.mouse.up();page.wait_for_timeout(600)
  assert page.evaluate('window.__testRuntime.fx.lp.frequency.value')<5000,'hold keeps the effect'
  page.locator('#fxHold').click();page.locator('#fxEco').click();page.locator('#fxRobot').click();page.wait_for_timeout(300)
  assert page.evaluate('window.__testRuntime.fx.crushSend.gain.value')>.3 and page.evaluate('window.__testRuntime.fx.fb.gain.value')>.6
  page.locator('#fxStop').click();page.wait_for_timeout(250);assert page.evaluate('window.__testRuntime.fx.dry.gain.value')<.6
  assert page.evaluate('!!window.__testRuntime.S.ach.robot && !!window.__testRuntime.S.ach.cinta')
  page.locator('#fxClose').click();assert not page.locator('#fxPanel').is_visible()
  page.locator('#bMenu').click();page.locator('#bWorld').click();page.wait_for_function('document.getElementById("bFx").hidden')
  assert not errors,errors
  print(label+': fx pad filters and space, clean on release, hold, eco, robot, tape stop, does not move the pixel PASS',flush=True);c.close()
 b.close()
server.shutdown()
