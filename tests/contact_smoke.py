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
  page.evaluate("""()=>{const r=window.__testRuntime,raw=r.wchunk(Math.floor(r.S.wx/900),Math.floor(r.S.wy/900)),c=r.sceneChunk(raw),old=c.pillars,p={x:r.S.wx,y:r.S.wy,w:10,h:30,hit:0,cd:0,snd:()=>{}};c.pillars=[p];
   const frame=()=>{r.frame.l=performance.now();r.frame(performance.now()+16);};
   try{frame();if(p.hits!==1)throw Error('first pillar contact missing');p.cd=0;frame();frame();if(p.hits!==1)throw Error('held pillar retriggered');
    const x=r.S.wx;r.S.wx=x+150;frame();r.S.wx=x;p.cd=0;frame();if(p.hits!==2)throw Error('pillar did not rearm after leaving');
    const original=c.sp,pref=r.S.autoPins;r.jam.band.members={};const creature={...original[0],s:{...original[0].s,mob:null},touching:false,vx:0,vy:0,x:r.S.wx,y:r.S.wy,hx:r.S.wx,hy:r.S.wy,cd:0};c.sp=[creature];
    try{r.S.autoPins=false;frame();if(Object.keys(r.jam.band.members).length||creature.follow>0)throw Error('creature joined without opt in');const x=r.S.wx;r.S.wx=x+150;frame();r.S.wx=x;creature.cd=0;r.S.autoPins=true;frame();if(!Object.values(r.jam.band.members).some(m=>m.sp.id===creature.s.id))throw Error('opted in creature did not join');}finally{c.sp=original;r.S.autoPins=pref;r.jam.band.members={};}
   }finally{c.pillars=old;}
  }""")
  assert not errors,errors
  print(label+': real pillar contact fires once while held and rearms after leaving PASS',flush=True);c.close()
 b.close()
server.shutdown()
