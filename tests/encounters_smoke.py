from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 kinds=[]
 page=context.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=creative-lab&encounter=cloud');page.wait_for_function('window.__testRuntime?.encounterObjects.length>0')
 kinds=page.evaluate("import('./src/encounter-families.js').then(m=>Object.keys(m.FAMILIES))")
 browser.close()
 for kind in kinds:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  kinds=[]
  page=context.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=creative-lab&encounter={kind}');page.wait_for_function(f'window.__testRuntime?.encounterObjects.some(o=>o.id==="preview:{kind}")')
  page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  before=page.evaluate(f"(()=>{{const r=__testRuntime,o=r.encounterObjects.find(o=>o.id==='preview:{kind}');window.enc=o;return {{x:r.S.wx,y:r.S.wy,a:o.state.a,b:o.state.b,c:o.state.c}};}})()")
  page.touchscreen.tap(295,422);page.wait_for_timeout(100)
  assert page.evaluate(f"__testRuntime.S.journal.encounters['{kind}']===1"),kind+' not discovered'
  snapshot=page.evaluate('({a:enc.state.a,b:enc.state.b,c:enc.state.c,box:enc.state.box})')
  page.mouse.move(295,422);page.mouse.down();page.mouse.move(350,370,steps=8);page.mouse.up();page.wait_for_timeout(100)
  after=page.evaluate('({a:enc.state.a,b:enc.state.b,c:enc.state.c,box:enc.state.box})');assert after!=snapshot,(kind,snapshot,after)
  assert page.evaluate(f'Math.hypot(__testRuntime.S.wx-{before["x"]},__testRuntime.S.wy-{before["y"]})<1'),kind+' moved player'
  assert page.evaluate('!__testRuntime.scanning')
  page.locator('#bMenu').click();page.wait_for_timeout(100);frozen=page.evaluate('JSON.stringify(enc.state)');page.wait_for_timeout(250);assert page.evaluate('JSON.stringify(enc.state)')==frozen,kind+' changed during menu'
  page.locator('#mnClose').click();page.locator('#bMenu').click();(page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bAch').click();assert kind=='cloud' or len(page.locator('#journalBody').inner_text())>0
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print('PASS mobile encounter '+kind+': touch, drag, no unwanted movement, menu pause, journal and no runtime error',flush=True)
  if kind=='cloud':page.locator('#journalClose').click();page.screenshot(path='/tmp/whitedot-creative-cloud.png')
  browser.close()
 browser.close()
server.shutdown()
