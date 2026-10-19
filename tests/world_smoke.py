from browser_helpers import complete_path_fixture
# Navegador: hitos que suenan desde lejos (paneo, filtro), mar de silencio y oasis, sin errores.
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
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function('window.__testRuntime.ac && window.__testRuntime.ac.state==="running"')
  # Horizonte: desde el Origen se oye la torre de la región (2,0), paneada a la derecha.
  res=page.evaluate('''()=>{const r=window.__testRuntime,lm=r.nearbyLandmarks(r.S.wx,r.S.wy).find(l=>l.id==='lm:2,0');if(!lm)throw Error('tower not audible from origin');
   const ac=r.ac,orig=ac.createStereoPanner.bind(ac),pans=[];ac.createStereoPanner=()=>{const p=orig();pans.push(p);return p;};
   try{for(let bar=0;bar<4;bar++)r.horizonBar(ac.currentTime+.1,bar);}finally{ac.createStereoPanner=orig;}
   return {pans:pans.map(p=>p.pan.value),d:lm.d};}''')
  assert res['pans'] and any(v>0 for v in res['pans']) and len(res['pans'])<=2*5,res  # la torre suena a la derecha; máximo dos hitos
  # Mar de silencio: bioma vacío, aviso y música adelgazada.
  page.evaluate('''()=>{const r=window.__testRuntime;let s;for(let x=-15;x<=15&&!s;x++)for(let y=-15;y<=15&&!s;y++){const c=r.continents.at(x,y);if(c.sea&&c.depth>.5)s=[x,y];}r.S.wx=s[0]*3600+1800;r.S.wy=s[1]*3600+1800;}''')
  page.wait_for_function('document.getElementById("zDo").textContent.includes("Mar de silencio")')
  page.wait_for_function('window.__testRuntime.MU.vit<.15')
  # Oasis después de un desierto: drop.
  page.evaluate('''()=>{const r=window.__testRuntime;let o;for(let x=-80;x<80&&!o;x++)for(let y=-80;y<80&&!o;y++){const px=x*900+450,py=y*900+450;if(!r.continents.at(Math.floor(x/4),Math.floor(y/4)).sea&&r.vitalityAt(px,py)>.95)o=[px,py];}window.__oasisBefore=r.S.oasisN||0;r.MU.lowT=20;r.S.wx=o[0];r.S.wy=o[1];r.MU.vit=.9;}''')
  page.wait_for_function('window.__testRuntime.S.oasisN>window.__oasisBefore')
  assert page.evaluate('window.__testRuntime.MU.lowT<.1 && window.__testRuntime.MU.E>.65'),'oasis must restore musical energy, even when routine notices are suppressed'
  assert page.evaluate('window.__testRuntime.S.help.oasis'),'oasis remains explained and remembered'
  # Al llegar a un hito queda registrado.
  page.evaluate('''()=>{const r=window.__testRuntime,lm=r.nearbyLandmarks(9000,1800,8000).find(l=>l.id==='lm:2,0');r.S.wx=lm.x;r.S.wy=lm.y+60;}''')
  page.wait_for_function('!!(window.__testRuntime.S.landmarks||{})["lm:2,0"]')
  page.screenshot(path=f'/tmp/whitedot-landmark-{label}.png')
  assert not errors,errors
  print(label+': sound horizon panned, silent seas, oasis drop and landmark arrival PASS',flush=True);c.close();b.close()
server.shutdown()
