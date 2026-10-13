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
  page.evaluate("""()=>{const r=window.__testRuntime,d=r.activeLayerRegion()||r.regionOfPos(r.S.wx,r.S.wy),o={id:'test:growth',kind:'resonator',x:r.S.wx+25,y:r.S.wy,hx:r.S.wx+25,hy:r.S.wy,size:8,phase:0,rotation:0,lit:0,jump:0,vx:0,vy:0,cd:0,snd:()=>{}};r.MU.speed=0;
   for(let i=0;i<140;i++){r.influenceTick(.05,false);r.drawPlaythings({playthings:[o]},0,.05,-r.S.wx+r.W/2,-r.S.wy+r.H/2,350,[]);}
   if(o.growth<.95||!r.S.ach.cultivarMusica)throw Error('tending did not grow');
   r.driveInfluence(d,'bass',1,1);for(let i=0;i<100;i++)r.influenceTick(.05,false);
   const changed=r.shapeInfluence(d,r.MU.radio);if(JSON.stringify(changed.bass)===JSON.stringify(r.MU.radio.bass))throw Error('main bass unchanged');
   const before=JSON.stringify(r.influenceState);r.influenceTick(.25,true);if(JSON.stringify(r.influenceState)!==before)throw Error('paused state changed');
  }""")
  assert not errors,errors
  print(label+': tending grows a source, changes the main bass arrangement and pauses with overlays PASS',flush=True);c.close()
 b.close()
server.shutdown()
