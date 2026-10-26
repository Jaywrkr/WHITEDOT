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
  page.wait_for_function("window.__testRuntime.MU.dnaA && window.__testRuntime.ac.state==='running'")
  before=page.evaluate('({q:window.__testRuntime.MU.q8.length,p:window.__testRuntime.MU.queue.length,w:window.__testRuntime.waves.length})')
  page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#bDetails').focus();page.keyboard.press('Space');page.keyboard.press('ArrowDown')
  assert page.evaluate('window.__testRuntime.waves.length')==before['w']
  assert page.evaluate('window.__testRuntime.keys.arrowdown||0')==0
  page.locator('#settingsClose').click();page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#bMusicSettings').click();page.locator('#bAutoPins').click();page.locator('#muClose').click();page.locator('#settingsClose').click()
  assert page.evaluate('window.__testRuntime.jam.loop.ecos.length')==0
  page.evaluate('()=>{const r=window.__testRuntime;r.MU.queue=[];r.exitWorld(false);r.enterWorld();if(r.MU.queue.length)throw Error("world entry queued a UI jingle");}')
  page.wait_for_timeout(200);page.locator('#w').click(position={'x':30,'y':300});page.wait_for_timeout(50);assert page.evaluate('window.__testRuntime.waves.length')>0
  assert not errors,errors
  print(label+': UI keyboard does not move or pulse, settings do not pin notes, entry has no jingle and canvas still plays PASS',flush=True);c.close()
 b.close()
server.shutdown()
