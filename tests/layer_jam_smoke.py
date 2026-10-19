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
  page.evaluate("""()=>{const r=window.__testRuntime,assert=(ok,msg)=>{if(!ok)throw Error(msg);};
   r.MU.near=[{x:r.S.wx,y:r.S.wy,snd:()=>{}}];r.MU.singers=[{s:r.regionOfPos(r.S.wx,r.S.wy).species[0]}];
   r.enterLayer('bajo');assert(!r.MU.near.length&&!r.MU.singers.length,'surface sources leaked');
   const d=r.activeLayerRegion();assert(d.key.startsWith('bajo:'),'missing layer recipe');
   r.enterStudio();r.exitStudio();assert(r.S.layer==='bajo'&&r.MU.dnaT.key===d.key,'studio return lost layer music');
   const t=r.ac.currentTime+.1,source={id:'stable-source',x:r.S.wx,y:r.S.wy,personality:{period:1200,spin:5,degree:2}};
   r.loopButton();r.loopStep(0,0,t);assert(!!r.jam.loop.rec,'recording not armed');
   r.loopTap('pulso',0,t,d,false,1,source,'ambient');r.loopTap('pulso',0,t,d,false,1,source,'band');
   r.loopTap('pulso',0,t,d,false,1,source,'player');assert(r.jam.loop.rec.events.length===1,'captured ambient or band');
   r.loopStep(0,32,t+32*r.SIX);const e=r.jam.loop.ecos[0];assert(e.layer==='bajo'&&e.events[0].region.key===d.key,'echo lost synthetic region');
   assert(e.events[0].source.id===source.id,'echo lost source identity');r.loopStep(0,64,t+64*r.SIX);
   r.surfaceLayer(r.S.wx,r.S.wy);let emitted=0;const ac=r.ac,original=ac.createOscillator.bind(ac);ac.createOscillator=()=>{emitted++;return original();};
   try{r.loopStep(0,96,ac.currentTime+.1);}finally{ac.createOscillator=original;}assert(emitted===0,'underground echo sounded on surface');
   r.loopButton();assert(r.jam.loop.armed,'arm on surface');r.enterLayer('cielo');assert(!r.jam.loop.rec&&!r.jam.loop.armed,'recording crossed layer');
   const sky=r.activeLayerRegion();r.enterStudio();r.exitStudio();assert(r.MU.dnaT.key===sky.key,'sky music lost after studio');
   r.surfaceLayer(r.S.wx,r.S.wy);r.resetJam();
  }""")
  assert not errors,errors
  print(label+': layer source isolation, Studio restoration, player-only looper, synthetic recipes and layer-specific echoes PASS',flush=True);c.close()
 b.close()
server.shutdown()
