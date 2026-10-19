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
  point=page.evaluate("()=>{const r=window.__testRuntime;return r.addFavorite('Regreso de prueba');}")
  page.evaluate("window.__testRuntime.S.wx+=500;window.__testRuntime.S.wy-=300")
  page.locator('#bMenu').click();page.locator('#bFavorites').click();page.locator('[data-favorite] summary').click();page.locator('[data-favorite] button').filter(has_text='Orientar').click()
  page.wait_for_function('!document.getElementById("routeHud").hidden');assert 'pasos' in page.locator('#routeDetail').inner_text()
  page.screenshot(path=f'/tmp/whitedot-navigation-{label}.png')
  page.evaluate("()=>{const r=window.__testRuntime,p=r.favorites[0];r.S.wx=p.x;r.S.wy=p.y;r.navigationTick();}")
  assert page.locator('#routeDetail').inner_text()=='Llegaste'
  assert page.evaluate('!!window.__testRuntime.S.ach.regresoMusical')
  page.locator('#navCancel').click();assert page.locator('#routeHud').is_hidden()
  page.evaluate("()=>{const r=window.__testRuntime;r.enterLayer('bajo');r.activeLayerRegion();r.selectDestination(r.favorites[0].id);}")
  assert 'Superficie' in page.locator('#routeDetail').inner_text();assert page.locator('#routeArrow').is_hidden()
  page.evaluate("window.__testRuntime.removeFavorite(window.__testRuntime.favorites[0].id)");assert page.locator('#routeHud').is_hidden()
  page.evaluate("window.__testRuntime.surfaceLayer(window.__testRuntime.S.wx,window.__testRuntime.S.wy)")
  assert not errors,errors
  print(label+': favorite direction, arrival, cancel, other layers and deletion PASS',flush=True);c.close()
 b.close()
server.shutdown()
