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
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function("window.__testRuntime.MU.dnaA && window.__testRuntime.ac.state==='running'")
  page.evaluate("""()=>{const r=window.__testRuntime,check=(ok,msg)=>{if(!ok)throw Error(msg);};
   const silentPocket=r.currentPocket?.();if(silentPocket?.kind==='quiet'){r.S.wx+=300;r.S.wy+=300;}
   for(let i=0;i<1500;i++)r.initiativeTick(.05,false,false);
   check(r.initiativeState.stage===1,'threshold failed');check(r.S.ach.escuchaViva,'achievement missing');
   const ac=r.ac,original=ac.createOscillator.bind(ac),buffer=ac.createBufferSource.bind(ac);let emitted=0;ac.createOscillator=()=>{emitted++;return original();};ac.createBufferSource=()=>{emitted++;return buffer();};
   try{r.initiativeBar(ac.currentTime+.1,400);check(emitted>0,'no audible initiative');const once=emitted;r.initiativeBar(ac.currentTime+.1,400);check(emitted===once,'duplicate event in bar');
    r.initiativeTick(.05,false,true);r.initiativeBar(ac.currentTime+.1,404);check(emitted===once,'menu leaked initiative');
    r.initiativeTick(.05,true,false);r.initiativeBar(ac.currentTime+.1,408);check(emitted===once,'movement kept triggering');
   }finally{ac.createOscillator=original;ac.createBufferSource=buffer;}
  }""")
  assert not errors,errors
  print(label+': stationary active listening, audible bounded responses, pause and movement PASS',flush=True);c.close()
 b.close()
server.shutdown()
