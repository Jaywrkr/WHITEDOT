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
  page.wait_for_function("window.__testRuntime.MU.dnaA && window.__testRuntime.ac.state==='running'")
  page.evaluate("""()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);r.playVoice('arbol',0,r.ac.currentTime+.05,d,false,1,{id:'pin:a',x:r.S.wx+30,y:r.S.wy},'player');if(r.jam.loop.ecos.length)throw Error('default pinned a sound');}""")
  page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#bMusicSettings').click();page.locator('#bAutoPins').click();page.locator('#muClose').click();page.locator('#settingsClose').click()
  page.evaluate("""()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy),play=(id,origin)=>r.playVoice('arbol',2,r.ac.currentTime+.05,d,false,1,{id,x:r.S.wx+30,y:r.S.wy},origin);
   play('pin:a','ambient');if(r.jam.loop.ecos.length)throw Error('ambient pinned');
   play('pin:a','player');if(r.jam.loop.ecos.length!==1||!r.jam.loop.ecos[0].auto)throw Error('pin missing');
   play('pin:b','player');if(r.jam.loop.ecos.length!==1||!r.jam.loop.ecos[0].sourceKey.endsWith('pin:b'))throw Error('same role did not replace');
  }""")
  if label=='mobile':page.touchscreen.tap(size['width']/2+30,size['height']/2)
  else:page.mouse.click(size['width']/2+30,size['height']/2)
  assert page.evaluate('window.__testRuntime.jam.loop.ecos.length')==0
  page.evaluate("""()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);r.loopStep(0,r.MU.step,r.ac.currentTime+.05);r.playVoice('arbol',2,r.ac.currentTime+.05,d,false,1,{id:'pin:b',x:r.S.wx+30,y:r.S.wy},'player');if(r.jam.loop.ecos.length)throw Error('released pin restarted while standing here');r.save();}""")
  page.reload(wait_until='domcontentloaded');page.wait_for_function('window.__testRuntime?.S.autoPins===true');assert page.evaluate('window.__testRuntime.jam.loop.ecos.length')==0
  page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#bMusicSettings').click();page.locator('#bAutoPins').click();page.locator('#muClose').click();page.locator('#settingsClose').click();assert page.evaluate('window.__testRuntime.S.autoPins')==False
  assert not errors,errors
  print(label+': sound pins opt in only, ignore ambient, replace same role, release by touch and stay released PASS',flush=True);c.close()
 b.close()
server.shutdown()
