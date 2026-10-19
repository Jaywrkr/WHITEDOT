from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 for width,height in [(390,844),(844,390),(1280,800)]:
  context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=blobs-creative&layout=wide');page.wait_for_function('window.__testRuntime?.inWorld()')
  page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  page.touchscreen.tap(width/2,height/2);page.wait_for_timeout(150)
  assert page.evaluate("__testRuntime.influenceState.targets.melody<-.7"),'white point should subtract, not emit'
  # First challenge can be completed in several orders, without recording.
  page.evaluate("__testRuntime.creativeAction('bass','touch');__testRuntime.creativeAction('groove','model')")
  assert page.evaluate("!!__testRuntime.S.ach.composicionAbierta")
  page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#bCreateMode').click();page.locator('#settingsClose').click()
  assert page.evaluate('__testRuntime.S.relaxedCreate')
  if page.locator('#mMenu').is_visible():page.locator('#mnClose').click()
  page.evaluate('__testRuntime.S.lampUsed=__testRuntime.lampMax()+1')
  page.wait_for_timeout(300);assert page.evaluate('__testRuntime.inWorld()'),'relaxed mode must not end on empty lamp'
  # Place a real existing prism next to the player; drag models without movement.
  pos=page.evaluate("""()=>{const r=__testRuntime,c=r.sceneChunk(r.wchunk(Math.floor(r.S.wx/r.WCH),Math.floor(r.S.wy/r.WCH)));const o=c.playthings.find(o=>o.kind==='rotor'||o.kind==='resonator')||c.playthings[0];o.kind='rotor';o.x=o.hx=r.S.wx+70;o.y=o.hy=r.S.wy;o.vx=o.vy=0;window.prism=o;return {x:r.S.wx,y:r.S.wy};}""")
  page.wait_for_timeout(100);page.mouse.move(width/2+70,height/2);page.mouse.down();page.mouse.move(width/2+110,height/2-50,steps=10);page.mouse.up();page.wait_for_timeout(100)
  assert page.evaluate('prism.rotation>.5'),page.evaluate('({rotation:prism.rotation,near:__testRuntime.MU.near.includes(prism),mode:__testRuntime.S.mode,layer:__testRuntime.S.layer,modals:[...document.querySelectorAll(".modal:not([hidden])")].map(m=>m.id),ptr:__testRuntime.ptr,point:{x:prism.x-__testRuntime.S.wx,y:prism.y-__testRuntime.S.wy}})')
  assert page.evaluate(f'Math.hypot(__testRuntime.S.wx-{pos["x"]},__testRuntime.S.wy-{pos["y"]})<1'),'instrument drag moved player'
  page.locator('#bMenu').click();page.locator('#bAch').click();page.locator('[data-journal-detail="Tu recorrido creativo"] > summary').click();assert page.locator('#journalBody').inner_text().find('Tu recorrido creativo')>=0
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print(f'PASS creative gestures, subtraction, open challenge, quiet composing and journal at {width}x{height}',flush=True)
  context.close()
 browser.close()
server.shutdown()
