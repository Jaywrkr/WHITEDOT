"""Find each festive interpretation at a native address, keeping the UI silent."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2');page.wait_for_function('!!window.__testRuntime?.labMode');page.evaluate('__testRuntime.S.sound=false')
  for band in ['patio','aurora','verbena']:
   page.evaluate('(id)=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.labGo("band:"+id);}',band)
   page.wait_for_function('''async id=>{const r=__testRuntime,{labScore}=await import('/src/lab-score.js'),d=r.regionOfPos(r.S.wx,r.S.wy);return labScore(d,r.seedOf,r.rng)?.id===id&&r.livingNear(250).some(o=>o.festival?.id===id);}''',arg=band)
   assert not page.evaluate('__testRuntime.S.sound'),'selecting a territory must not enable sound'
   page.screenshot(path='/tmp/whitedot-festival-'+band+'.png')
  assert not errors,errors;print('PASS three native inhabited festive territories, local animation and silent laboratory selection');b.close()
finally:server.shutdown()
