from browser_helpers import complete_path_fixture
# Navegador: el eco graba lo que suena por tus acciones y lo repite en bucle; la banda se arma tocando criaturas.
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
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(15000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.locator('#bMenu').click();page.locator('#bTools').click();assert page.locator('#bLoop').is_visible()
  # Eco: armar, tocar durante la grabación, y comprobar que el bucle se repite.
  page.locator('#bMenu').click();page.locator('#bTools').click();page.locator('#bLoop').click();page.wait_for_function('!!window.__testRuntime.jam.loop.rec')
  for i in range(4):page.evaluate('window.__testRuntime.sonar()');page.wait_for_timeout(750)
  page.wait_for_function('window.__testRuntime.jam.loop.ecos.length===1',timeout=20000)
  n=page.evaluate('window.__testRuntime.jam.loop.ecos[0].events.length');assert n>=1,n
  calls=page.evaluate('''async()=>{const r=window.__testRuntime;let k=0;const ac=r.ac,o=ac.createOscillator.bind(ac);ac.createOscillator=()=>{k++;return o();};const e=r.jam.loop.ecos[0];
   for(let i=0;i<32;i++)r.loopStep(i%16,e.start+32+i,ac.currentTime+.05);ac.createOscillator=o;return k;}''')
  assert calls>0,'eco replays'
  page.wait_for_timeout(300);page.screenshot(path=f'/tmp/whitedot-eco-{label}.png')
  # Arrastrar sobre el anillo mueve al jugador; no borra. Un toque breve sí borra.
  page.mouse.move(size['width']/2,size['height']/2);page.mouse.down();page.mouse.move(size['width']/2+35,size['height']/2,steps=5);page.mouse.up()
  assert page.evaluate('window.__testRuntime.jam.loop.ecos.length')==1
  point=page.evaluate('()=>{const r=window.__testRuntime,e=r.jam.loop.ecos[0];return {x:r.W/2+e.x-r.S.wx,y:r.H/2+e.y-r.S.wy};}')
  if label=='mobile':page.touchscreen.tap(point['x'],point['y'])
  else:page.mouse.click(point['x'],point['y'])
  assert page.evaluate('window.__testRuntime.jam.loop.ecos.length')==0
  # El botón junto a otro eco sigue sirviendo de alternativa.
  page.evaluate('()=>{const r=window.__testRuntime;r.jam.loop.ecos.push({x:r.S.wx,y:r.S.wy,layer:r.S.layer||"superficie",events:[],start:r.MU.step});}')
  page.locator('#bMenu').click();page.locator('#bTools').click();page.locator('#bLoop').click();assert page.evaluate('window.__testRuntime.jam.loop.ecos.length')==0
  page.locator('#bMenu').click();page.locator('#bMusicSettings').click();page.locator('#bAutoPins').click();page.locator('#muClose').click()
  # Banda: unir criaturas de distintos papeles y comprobar que tocan a tempo.
  roles=page.evaluate('''()=>{const r=window.__testRuntime,got=new Set();for(let x=-3;x<=3&&got.size<4;x++)for(let y=-3;y<=3&&got.size<4;y++){const d=r.regionOfPos(x*3600+1800,y*3600+1800);
    for(const sp of d.species){const v=r.getVoice('forma:'+sp.id,d);const slot=v.role==='bajo'?'bajo':v.role==='perc'?'perc':v.role==='acorde'?'acorde':'melodia';if(got.has(slot))continue;got.add(slot);r.bandJoin({x:r.S.wx,y:r.S.wy,personality:null},sp);}}return [...got];}''')
  assert len(roles)>=3,roles
  made=page.evaluate('()=>{const r=window.__testRuntime,ac=r.ac,o=ac.createOscillator.bind(ac);let k=0;ac.createOscillator=()=>{k++;return o();};for(let s=0;s<16;s++)r.bandStep(s,1,ac.currentTime+.05);ac.createOscillator=o;return k;}')
  assert made>0,'band plays'
  page.wait_for_timeout(500);page.screenshot(path=f'/tmp/whitedot-band-{label}.png')
  point=page.evaluate('()=>{const r=window.__testRuntime,m=Object.values(r.jam.band.members)[0];window.__releasedSource=m.source;m.source.follow=10;return {x:r.W/2+m.x-r.S.wx,y:r.H/2+m.y-r.S.wy,count:Object.keys(r.jam.band.members).length};}')
  page.mouse.click(point['x'],point['y']);assert page.evaluate('Object.keys(window.__testRuntime.jam.band.members).length')==point['count']-1
  assert page.evaluate('window.__releasedSource.follow')==0
  page.locator('#bMenu').click();page.locator('#bWorld').click();assert page.evaluate('Object.keys(window.__testRuntime.jam.band.members).length')==0
  assert not errors,errors
  print(label+': eco records your sounds and loops them, delete, band joins by role and plays PASS',flush=True);c.close()
 b.close()
server.shutdown()
