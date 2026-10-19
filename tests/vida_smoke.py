from browser_helpers import complete_path_fixture
# Navegador: bandada (quieto → confianza, tocar un ave → te devuelve la llamada, correr → dispersión) y
# flora (crece contigo, tocarla suena y riega, el crecimiento se guarda). Los gestos no mueven al pixel.
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
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(15000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function('window.__testRuntime.ac&&window.__testRuntime.ac.state==="running"')
  R='window.__testRuntime'
  # Bandada del Origen: quieto cerca → confían y se acercan.
  page.evaluate(f"(()=>{{const r={R};r.S.wx=2800;r.S.wy=1650;}})()");page.wait_for_function(f"{R}.nearbyFlocks(400).some(f=>f.species==='golondrina')")
  page.wait_for_function(f"{R}.nearbyFlocks(400)[0].trust>=.6",timeout=20000)
  assert page.evaluate(f"!!{R}.S.ach.bandadaAmiga && {R}.S.vida.seen.golondrina")
  page.screenshot(path=f'/tmp/whitedot-flock-{label}.png')
  # Tocar un ave: suena tu nota y, dos compases después, la bandada te devuelve la llamada.
  before=page.evaluate(f"[{R}.S.wx,{R}.S.wy]")
  for k in range(3):
   pt=page.evaluate(f"(()=>{{const r={R},f=r.nearbyFlocks(400)[0],m=f.members[{k}];return {{x:r.W/2+m.x-r.S.wx,y:r.H/2+m.y-r.S.wy}};}})()")
   page.mouse.click(pt['x'],pt['y']);page.wait_for_timeout(120)
  assert page.evaluate(f"{R}.nearbyFlocks(400)[0].learned.length")>=1,'the flock learned the call'
  assert page.evaluate(f"[{R}.S.wx,{R}.S.wy]")==before,'tapping a bird does not move the player'
  page.wait_for_function(f"!!{R}.S.ach.bandada1",timeout=20000)
  # Correr a través: se dispersan.
  page.evaluate(f"(()=>{{const r={R},f=r.nearbyFlocks(400)[0];window.__f=f;}})()")
  for i in range(12):
   page.evaluate(f"(()=>{{const r={R};r.S.wx=window.__f.x-200+i*35;r.S.wy=window.__f.y;}})()".replace('i*35',str(i*35)));page.wait_for_timeout(16)
  page.wait_for_function("window.__f.scatter>.3")
  # Flora: quedarse cerca la hace crecer; tocarla suena y riega; el crecimiento queda guardado.
  page.evaluate(f"(()=>{{const r={R};r.S.wx=620;r.S.wy=1700-120;}})()");page.wait_for_timeout(300)
  g0=page.evaluate(f"(()=>{{const r={R},p=r.nearbyPlants(300).find(p=>p.id==='plant:0,0:0');return r.S.vida.plants[p.id]?.g||0}})()")
  page.wait_for_timeout(3500)
  g1=page.evaluate(f"{R}.S.vida.plants['plant:0,0:0']?.g||0");assert g1>g0,(g0,g1)
  page.evaluate(f"{R}.vidaPlayed.length=0")
  pt=page.evaluate(f"(()=>{{const r={R},p=r.nearbyPlants(300).find(p=>p.id==='plant:0,0:0');return {{x:r.W/2+p.x-r.S.wx,y:r.H/2+p.y-r.S.wy-12}};}})()")
  page.mouse.click(pt['x'],pt['y'])
  page.wait_for_function(f"{R}.vidaPlayed.some(v=>v.startsWith('vida:plant:'))")
  g2=page.evaluate(f"{R}.S.vida.plants['plant:0,0:0'].g");assert g2>=g1+.3,(g1,g2)
  page.evaluate(f"{R}.S.vida.plants['plant:0,0:0']={{g:4,t:Date.now()}}");page.wait_for_timeout(400)
  page.screenshot(path=f'/tmp/whitedot-flora-{label}.png')
  page.evaluate(f"{R}.save()");saved=page.evaluate("Object.values(localStorage).some(v=>typeof v==='string'&&v.includes('plant:0,0:0'))");assert saved
  assert not errors,errors
  print(label+': flock trust/gather, call answered, scatter, flora grows/waters/persists PASS',flush=True);c.close()
 b.close()
server.shutdown()
