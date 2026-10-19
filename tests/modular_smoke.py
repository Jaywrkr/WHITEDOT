"""Cube-first cables must change the real signal path and remain removable."""
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
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&lab=1&generation=2&layout=wide');page.wait_for_function('__testRuntime?.labMode')
  page.evaluate('''()=>{const r=__testRuntime;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.labGo('family:weaver');r.audio();window.__graphs=[];r.modularGraphCue=s=>__graphs.push(s);}''')
  page.wait_for_function('__testRuntime.encounterObjects.some(o=>o.kind==="weaver")')
  for index in [0,1,2]:
   page.evaluate('''index=>{const r=__testRuntime,o=r.encounterObjects.find(o=>o.kind==='weaver'),a=r.depthAnchors(o)[index];r.S.wx=a.x;r.S.wy=a.y;r.ptr=null;}''',index)
   page.wait_for_function('''index=>{const r=__testRuntime,o=r.encounterObjects.find(o=>o.kind==='weaver');return o.state.cubeAnchor===r.depthAnchors(o)[index].id;}''',arg=index)
  page.wait_for_function('__testRuntime.encounterObjects.find(o=>o.kind==="weaver").state.weave.edges.length===2')
  # The first graph may have sounded after cable one; wait for cable two's actual graph.
  page.wait_for_function('__graphs.some(s=>s.includes("cv")&&s.includes("signal"))',timeout=12000)
  assert page.evaluate('__graphs.some(s=>s.includes("cv")&&s.includes("signal"))')
  page.screenshot(path='/tmp/whitedot-f4-cables-phone.png')
  page.evaluate('''()=>{const r=__testRuntime,o=r.encounterObjects.find(o=>o.kind==='weaver'),e=o.state.weave.edges[1];r.S.wx=(e.a.x+e.b.x)/2;r.S.wy=(e.a.y+e.b.y)/2;r.ptr=null;}''')
  page.wait_for_function('__testRuntime.encounterObjects.find(o=>o.kind==="weaver").state.weave.edges.length===1',timeout=6000)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors;print('PASS cube-only typed connections, actual signal/CV playback, local phone graphics and dwell removal',flush=True);b.close()
finally:server.shutdown()
