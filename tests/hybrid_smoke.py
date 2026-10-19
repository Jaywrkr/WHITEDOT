"""All compositional influences reached through the real mobile laboratory."""
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
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&lab=1&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  ids=page.evaluate('import("/src/musical-hybrids.js").then(m=>m.HYBRID_STYLES.map(h=>h.id))')
  for id in ids:
   page.evaluate('(id)=>__testRuntime.labGo("hybrid:"+id)',id)
   page.wait_for_function('(id)=>__testRuntime.MU.radio?.hybrid?.id===id',arg=id,timeout=15000)
   assert page.evaluate('''()=>{const r=__testRuntime,f=r.MU.radio;return f.hook.filter(n=>n>=0).length<=4&&f.grammar.brightness<=f.hybrid.brightness&&document.documentElement.scrollWidth<=innerWidth;}''')
  assert not errors,errors
  page.screenshot(path='/tmp/whitedot-f5-cruces.png');print('PASS all actual hybrid destinations, native regions, contained phrases and mobile layout',flush=True);b.close()
finally:server.shutdown()
