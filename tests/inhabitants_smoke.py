"""Actual world inhabitants and distant backgrounds at phone/desktop sizes."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page(has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=inhabitants&layout=wide&generation=2');page.wait_for_function('!!window.__r?.inhabitantTick')
   page.evaluate('''async()=>{const r=__r,{inhabitantPractice}=await import('/src/pixel-life-model.js');document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.sound=false;r.S.mode='world';const p=inhabitantPractice(r);r.S.wx=p.x;r.S.wy=p.y-80;r.inhabitantTick(.05);window.__inhabitantId=p.id;}''');page.wait_for_timeout(150)
   assert page.evaluate('__r.inhabitantsNear(300).some(o=>o.id===__inhabitantId)')
   assert page.evaluate('''()=>{const r=__r,o=r.inhabitantsNear(300).find(o=>o.id===__inhabitantId);return r.inhabitantTouch(o)&&o.lit===1;}''')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=f'/tmp/whitedot-inhabitants-{width}.png')
   page.evaluate('''async()=>{const r=__r,{inhabitantPractice}=await import('/src/pixel-life-model.js'),p=inhabitantPractice(r,'traveller');r.S.wx=p.x;r.S.wy=p.y-80;r.inhabitantTick(.05);window.__traveller=r.inhabitantsNear().find(o=>o.kind==='viajero');window.__travellerX=__traveller.x;}''')
   page.wait_for_timeout(600);assert page.evaluate('Math.abs(__traveller.x-__travellerX)>.1'),'travellers move without touching or following the cube'
   page.evaluate('__r.S.reducedMotion=true;window.__travelSeconds=__r.inhabitantState.travelSeconds');page.wait_for_timeout(150);assert page.evaluate('__r.inhabitantState.travelSeconds===__travelSeconds')
   assert not errors,errors;print('PASS actual inhabitants, autonomous travellers, motion setting and contained world at '+str(width),flush=True)
  b.close()
finally:server.shutdown()
