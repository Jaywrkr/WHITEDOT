# Navegador: viaje largo (récord, tierras raras desafinadas), mapa con dos zooms y tarjeta para compartir.
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
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click()
  # Recorrido: una diagonal larga, región por región, hasta las tierras raras.
  for i in range(0,13):
   page.evaluate(f'()=>{{const r=window.__testRuntime;r.S.wx={i*5}*3600+1800;r.S.wy={-i*2}*3600+1800;}}');page.wait_for_timeout(120)
  page.wait_for_function('window.__testRuntime.S.maxRing>=60')
  assert page.evaluate('Math.abs(window.__testRuntime.MU.tune)>0 || window.__testRuntime.regionOfPos(window.__testRuntime.S.wx,window.__testRuntime.S.wy).tuneCents===0')
  assert page.evaluate('!!window.__testRuntime.S.ach.lejos10 && !!window.__testRuntime.S.ach.lejos30 && !!window.__testRuntime.S.ach.lejos60')
  page.wait_for_timeout(800);page.screenshot(path=f'/tmp/whitedot-farlands-{label}.png')
  # Afinación: hz desplaza la nota según MU.tune solo en el Mundo.
  assert page.evaluate('(()=>{const r=window.__testRuntime,old=r.MU.tune;r.MU.tune=50;const a=r.hz(69);r.MU.tune=old;return Math.abs(a-440*Math.pow(2,50/1200))<1e-6})()')
  page.locator('#bMenu').click();page.locator('#bMap').click();assert page.locator('#mMap').is_visible()
  assert int(page.locator('#mRegions').inner_text())>=10 and int(page.locator('#mRecord').inner_text())>=60
  page.screenshot(path=f'/tmp/whitedot-map-{label}.png')
  page.locator('#mapZoom').click();page.screenshot(path=f'/tmp/whitedot-map-near-{label}.png')
  page.locator('#mapShare').click();page.wait_for_function('document.getElementById("shareImg").naturalWidth===1080')
  assert page.locator('#mShare').is_visible();page.locator('#sClose').click()
  assert page.evaluate('!!window.__testRuntime.S.ach.mapa1')
  assert not errors,errors
  print(label+': long journey record, far-lands tuning, map zooms and shareable map PASS',flush=True);c.close()
 b.close()
server.shutdown()
