from browser_helpers import complete_path_fixture
# Navegador: tormenta que llueve notas y truena, estación en la tarjeta, huellas y campamentos, confluencia que mezcla música.
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
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click();page.locator('#firstJourneySkip').click()
  # Tormenta: buscar el centro de una tormenta activa ahora mismo y entrar.
  page.evaluate('''async()=>{const r=window.__testRuntime,{stormsNear}=await import('/src/alive.js');let best=null;for(let u=-40;u<=40;u+=10)for(let v=-40;v<=40;v+=10){for(const s of stormsNear(u,v,Date.now()))if(s.life>.5&&(!best||s.r>best.r))best=s;}
   if(!best)throw Error('no storm');r.S.wx=best.x*3600;r.S.wy=best.y*3600;}''')
  page.wait_for_function('window.__testRuntime.MU.storm>.3')
  page.wait_for_function('window.__testRuntime.rain.length>0')
  made=page.evaluate('()=>{const r=window.__testRuntime,ac=r.ac,o=ac.createBufferSource.bind(ac);let n=0;ac.createBufferSource=()=>{n++;return o();};const rnd=Math.random;Math.random=()=>0;try{r.stormBar(ac.currentTime+.1);}finally{ac.createBufferSource=o;Math.random=rnd;}return n;}')
  assert made>0,'thunder'
  page.wait_for_timeout(400);page.screenshot(path=f'/tmp/whitedot-storm-{label}.png')
  # Estación en la tarjeta de zona.
  page.evaluate('()=>{const r=window.__testRuntime;r.S.wx=1800;r.S.wy=1800;}');page.wait_for_timeout(300)
  page.evaluate('()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);r.showRegion(d,true);}')
  page.wait_for_function('["Primavera","Verano","Otoño","Invierno"].some(s=>document.getElementById("zMood").textContent.includes(s))',timeout=30000)
  # Huellas y campamento anterior.
  for i in range(6):page.evaluate(f'()=>{{const r=window.__testRuntime;r.S.wx+=200;}}');page.wait_for_timeout(60)
  assert page.evaluate('window.__testRuntime.S.steps.length')>=5
  page.evaluate('()=>{const r=window.__testRuntime;r.S.studio.x=0;r.S.studio.y=0;}');page.locator('#bMenu').click();page.locator('#bTools').click();page.locator('#bDeploy').click();page.wait_for_timeout(300)
  assert page.evaluate('(window.__testRuntime.S.camps||[]).length')>=1;assert page.evaluate('window.__testRuntime.houseActive()'),'opening the house here lands it';page.locator('#houseExit').click()
  # Confluencia: dos ríos, la música del otro río se mezcla.
  page.evaluate('''()=>{const r=window.__testRuntime;const size=r.REG*r.WCH,x=-298777.2998213768/3600*size,y=-89475.62042623758/3600*size,q=r.riverAt(x,y);if(!q?.conf)throw Error('verified native confluence changed');r.S.wx=x;r.S.wy=y;}''')
  page.wait_for_function('!!window.__testRuntime.MU.confNb && !!window.__testRuntime.S.ach.confluencia')
  page.locator('#bMenu').click();page.locator('#bMap').click();page.locator('#journalClose').click()
  assert not errors,errors
  print(label+': moving storm with rain and thunder, season card, footprints and camps, confluence mix PASS',flush=True);c.close();b.close()
server.shutdown()
