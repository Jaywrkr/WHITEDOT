# Navegador: abrir el Atlas desde el Camino, viajar a dos ritmos y comprobar la región real.
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
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  assert page.evaluate('window.__testRuntime.S.mode')=='camino'
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dAtlas').click()
  page.wait_for_function('document.querySelectorAll("#atlasBody button[data-atlas]").length>0')
  rows=page.locator('#atlasBody button[data-atlas]').count();n=page.evaluate('Object.keys(window.__testRuntime.GEN).length');assert rows==n,(rows,n)
  assert 'verificados' in page.locator('#atlasSummary').inner_text()
  page.locator('#atlasFilters button[data-atlas-filter="afroamericana"]').click()
  fam=page.evaluate('Object.keys(window.__testRuntime.GEN).filter(id=>window.__testRuntime.GEN[id].family==="afroamericana").length')
  assert page.locator('#atlasBody button[data-atlas]').count()==fam and fam>=18
  page.locator('#atlasBody button[data-atlas-test="footwork"]').click()
  assert page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).atlasTested.footwork===1')
  assert 'probados' in page.locator('#atlasSummary').inner_text()
  page.locator('#atlasFilters button[data-atlas-filter="untested"]').click()
  assert page.locator('#atlasBody button[data-atlas="footwork"]').count()==0
  page.locator('#atlasFilters button[data-atlas-filter="afroamericana"]').click()
  page.screenshot(path=f'/tmp/whitedot-atlas-{label}.png')
  for gid in ['footwork','amapiano','trap']:
   if not page.locator('#mAtlas').is_visible():
    page.locator('#bMenu').click();page.locator('#dAtlas').click();page.wait_for_function('document.querySelectorAll("#atlasBody button[data-atlas]").length>0')
    page.locator('#atlasFilters button[data-atlas-filter="all"]').click()
   page.locator(f'#atlasBody button[data-atlas="{gid}"]').click()
   if page.locator('#mHelpW').is_visible():page.locator('#hwGo').click()
   page.wait_for_function(f'window.__testRuntime.S.mode==="world" && window.__testRuntime.MU.dnaT && window.__testRuntime.MU.dnaT.genre==="{gid}"')
   assert page.evaluate('window.__testRuntime.regionOfPos(window.__testRuntime.S.wx,window.__testRuntime.S.wy).genre')==gid
   page.wait_for_timeout(600);page.screenshot(path=f'/tmp/whitedot-atlas-{gid}-{label}.png')
  assert not errors,errors
  print(label+': rhythm atlas lists every genre and travels from Camino and World PASS',flush=True);c.close()
 b.close()
server.shutdown()
