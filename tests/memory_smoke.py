"""Actual edited instruments and creature phrases survive reload in their own world."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  url=f'http://127.0.0.1:{server.server_port}/?testSeed=memory-patch&encounter=weaver'
  page.goto(url);page.wait_for_function('__testRuntime?.encounterObjects.some(o=>o.id==="preview:weaver")')
  page.evaluate('''()=>{const r=__testRuntime,o=r.encounterObjects.find(o=>o.id==='preview:weaver');document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const a=r.depthAnchors(o);r.depthConnect(o,a[0],a[1]);r.depthConnect(o,a[1],a[2]);r.addFavorite('Mi tejido');r.save();}''')
  saved=page.evaluate('JSON.stringify(__testRuntime.S.worldMemory.patches["preview:weaver"])');stamp=page.evaluate('__testRuntime.favorites[0].musicStamp');assert stamp['version']==1
  page.reload();page.wait_for_function('__testRuntime?.encounterObjects.some(o=>o.id==="preview:weaver"&&o.state.weave?.edges.length===2)')
  assert page.evaluate('JSON.stringify(__testRuntime.S.worldMemory.patches["preview:weaver"])')==saved
  page.evaluate('''()=>{const r=__testRuntime,o=r.encounterObjects.find(o=>o.id==='preview:weaver');document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const a=r.depthAnchors(o);r.depthConnect(o,a[0],a[1]);r.save();}''')
  page.reload();page.wait_for_function('__testRuntime?.encounterObjects.some(o=>o.id==="preview:weaver"&&o.state.weave?.edges.length===1)')
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&lab=1&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
  page.evaluate('''()=>{const r=__testRuntime;r.labGo('living:moth');document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const o=r.livingNear()[0];o.phrase=[0,3,4];for(let i=0;i<3;i++)r.rememberCreature(o);r.save();}''')
  page.reload();page.wait_for_function('__testRuntime?.livingNear()[0]?.familiarity>=.5');assert page.evaluate('__testRuntime.livingNear()[0].phrase.slice(0,3)')==[0,3,4]
  # A different seed cannot inherit connections or bonds.
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=memory-other&encounter=weaver');page.wait_for_function('__testRuntime?.encounterObjects.some(o=>o.id==="preview:weaver")')
  assert page.evaluate('Object.keys(__testRuntime.S.worldMemory.patches).length')==0
  assert not errors,errors;print('PASS actual thread edits/removal and favorite stamp, reload, learned creature phrase/familiarity and isolated world scopes',flush=True);b.close()
finally:server.shutdown()
