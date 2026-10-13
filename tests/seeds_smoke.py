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
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function("window.__testRuntime.MU.dnaA && window.__testRuntime.ac.state==='running'")
  baseline=page.evaluate('localStorage.getItem("pixel-blanco-v4")')
  page.locator('#bMenu').click();page.locator('summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();assert page.locator('#mSeeds').is_visible()
  baseline=page.evaluate('()=>{window.__testRuntime.save();return localStorage.getItem("pixel-blanco-v4");}')
  page.locator('[data-seed="blobs-01"]').click();page.wait_for_url('**testSeed=blobs-01*');page.wait_for_function('window.__testRuntime?.S.previewSeed==="blobs-01" && window.__testRuntime.S.mode==="world"')
  first=page.evaluate('()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);if(r.S.wx!==r.REG*r.WCH/2||r.S.wy!==r.S.wx)throw Error("not centered");return JSON.stringify([d.z,d.genre,d.track,d.species,d.ground,d.air]);}')
  assert page.evaluate('localStorage.getItem("pixel-blanco-v4")')==baseline
  page.evaluate('window.__testRuntime.S.wx+=400');page.locator('#bMenu').click();page.locator('summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();page.locator('#seedCenter').click();page.wait_for_function('window.__testRuntime && window.__testRuntime.S.wx===window.__testRuntime.REG*window.__testRuntime.WCH/2')
  page.locator('#bMenu').click();page.locator('summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();page.locator('[data-seed="blobs-02"]').click();page.wait_for_url('**testSeed=blobs-02*');page.wait_for_function('window.__testRuntime?.S.previewSeed==="blobs-02"')
  second=page.evaluate('()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);return JSON.stringify([d.z,d.genre,d.track,d.species,d.ground,d.air]);}');assert first!=second
  page.locator('#bMenu').click();page.locator('summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();page.locator('#seedOriginal').click();page.wait_for_function('window.__testRuntime && !window.__testRuntime.S.previewSeed');assert page.evaluate('localStorage.getItem("pixel-blanco-v4")')==baseline
  assert not errors,errors
  print(label+': prototype seed switching, whole-world variation, center, preview save isolation and return to main save PASS',flush=True);c.close()
 b.close()
server.shutdown()
