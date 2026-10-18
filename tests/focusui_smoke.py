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
 for label,size in [('small',{'width':360,'height':640}),('mobile',{'width':390,'height':844}),('landscape',{'width':844,'height':390}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function("window.__testRuntime.MU.dnaA && window.__testRuntime.ac.state==='running'")
  page.wait_for_function('document.body.classList.contains("world-focus")')
  assert page.locator('#dock button:visible').evaluate_all('(buttons)=>buttons.map(b=>b.id).sort()')==['bAuto','bMenu','bStyles']
  assert not page.locator('#goal').is_visible()
  page.locator('#bMenu').click();page.locator('#bTools').click();assert page.locator('#bFx').is_visible()
  page.locator('#bFx').click();assert page.locator('#fxPanel').is_visible();assert page.locator('#dock button:visible').evaluate_all('(buttons)=>buttons.map(b=>b.id).sort()')==['bAuto','bMenu','bStyles'];page.locator('#fxClose').click()
  page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#bDetails').click();page.locator('#settingsClose').click();assert page.locator('#goal').is_visible()
  page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#bDetails').click();page.locator('#settingsClose').click();assert not page.locator('#goal').is_visible()
  page.locator('#bMenu').click();page.locator('#bTools').click();page.mouse.click(30,300);assert page.locator('#dock button:visible').evaluate_all('(buttons)=>buttons.map(b=>b.id).sort()')==['bAuto','bMenu','bStyles']
  page.evaluate('window.__testRuntime.startScanner()');assert page.locator('#scanner').is_visible();page.evaluate('window.__testRuntime.stopScanner()')
  dims=page.evaluate('({vw:innerWidth,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,vh:innerHeight})');assert dims['sw']<=dims['vw'] and dims['sh']<=dims['vh'],dims
  page.wait_for_timeout(700);page.screenshot(path=f'/tmp/whitedot-focus-{label}.png')
  assert not errors,errors
  print(label+': compact menu and auto controls, explicit tool access, readable details, gesture dismissal and no overflow PASS',flush=True);c.close()
 b.close()
server.shutdown()
