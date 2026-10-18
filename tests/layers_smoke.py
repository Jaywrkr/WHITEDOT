from browser_helpers import complete_path_fixture
# Navegador: ritual de portal, Subsuelo (1 paso = 8 arriba) con salida, Cielo con vista del continente y bajada.
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
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  # Grieta de la región (1,1): el ritual exige pulsos seguidos en el beat; uno fuera de tiempo reinicia.
  need=page.evaluate('''()=>{const r=window.__testRuntime;r.S.wx=3600*1.5;r.S.wy=3600*1.5;const g=r.nearPortals().find(p=>p.kind==='grieta');r.S.wx=g.x+30;r.S.wy=g.y;return g.need;}''')
  page.wait_for_timeout(300);page.screenshot(path=f'/tmp/whitedot-portal-{label}.png')
  page.evaluate(f'()=>{{const r=window.__testRuntime;for(let i=0;i<{need}-1;i++)r.portalPulse(true);r.portalPulse(false);}}')
  assert page.evaluate("window.__testRuntime.S.layer||'superficie'")=='superficie','off-beat must reset the ritual'
  page.evaluate(f'()=>{{const r=window.__testRuntime;for(let i=0;i<{need};i++)r.portalPulse(true);}}')
  page.wait_for_function('window.__testRuntime.S.layer==="bajo" && window.__testRuntime.MU.dnaT.key.startsWith("bajo:")')
  # Moverse abajo avanza ocho veces más arriba.
  sx=page.evaluate('window.__testRuntime.S.wx');ux=page.evaluate('window.__testRuntime.S.under.x')
  page.keyboard.down('d');page.wait_for_timeout(500);page.keyboard.up('d')
  du=page.evaluate('window.__testRuntime.S.under.x')-ux;dw=page.evaluate('window.__testRuntime.S.wx')-sx
  assert du>20 and abs(dw-du*8)<1,(du,dw)
  page.wait_for_timeout(300);page.screenshot(path=f'/tmp/whitedot-under-{label}.png')
  # Salida: una columna de luz cercana devuelve a la superficie, en tierra.
  page.evaluate('''async()=>{const r=window.__testRuntime,{exitIn,UNDER_CELL}=await import('/src/layers.js');const sea=(x,y)=>r.continents.at(Math.floor(x/3600),Math.floor(y/3600)).sea;
   const ci=Math.floor(r.S.under.x/UNDER_CELL),cj=Math.floor(r.S.under.y/UNDER_CELL);for(let i=ci-3;i<=ci+3;i++)for(let j=cj-3;j<=cj+3;j++){const e=exitIn(i,j,sea,r.seedOf,r.rng);if(e){r.S.under.x=e.x+10;r.S.under.y=e.y;return;}}throw Error('no exit');}''')
  page.wait_for_function('window.__testRuntime.S.layer==="superficie"')
  assert not page.evaluate('window.__testRuntime.continents.at(Math.floor(window.__testRuntime.S.wx/3600),Math.floor(window.__testRuntime.S.wy/3600)).sea')
  # Escalera de luz junto a la torre (2,0): sube al Cielo; un toque baja.
  page.evaluate('''()=>{const r=window.__testRuntime;r.S.wx=3600*2.5;r.S.wy=1800;const e=r.nearPortals().find(p=>p.kind==='escalera');r.S.wx=e.x;r.S.wy=e.y;for(let i=0;i<e.need;i++)r.portalPulse(true);}''')
  page.wait_for_function('window.__testRuntime.S.layer==="cielo"')
  page.keyboard.down('s');page.wait_for_timeout(300);page.keyboard.up('s');page.wait_for_timeout(300)
  page.screenshot(path=f'/tmp/whitedot-sky-{label}.png')
  page.evaluate('''()=>{const r=window.__testRuntime;for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)if(!r.continents.at(x,y).sea){r.S.wx=x*3600+1800;r.S.wy=y*3600+1800;return;}}''')
  page.evaluate('window.__testRuntime.layerPulse()');page.wait_for_function('window.__testRuntime.S.layer==="superficie"')
  assert page.evaluate('!!window.__testRuntime.S.ach.bajo1 && !!window.__testRuntime.S.ach.cielo1')
  assert not errors,errors
  print(label+': portal ritual, underground 1:8 with exits, sky view and landing PASS',flush=True);c.close()
 b.close()
server.shutdown()
