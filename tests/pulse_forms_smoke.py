"""The earned pulse editor uses real controls, draft/apply and silent preview."""
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
  page.add_init_script("localStorage.setItem('pixel-blanco-v4:preview-wide:v2:pulses',JSON.stringify({sound:false}))")
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=pulses&layout=wide&generation=2');page.wait_for_function('!!window.__r?.cubeSettings')
   page.evaluate('''async()=>{const r=__r,{DISCOVERY_ELEMENTS}=await import('/src/element-book-model.js');r.S.sound=false;r.S.elementBook={version:1,found:Object.fromEntries(DISCOVERY_ELEMENTS.map(e=>[e.id,{day:'2026-10-16'}]))};document.querySelectorAll('.modal').forEach(m=>m.hidden=true);document.getElementById('bCube').click();}''')
   assert page.locator('#cubePulseCount').inner_text()=='Ondas 50/50';assert page.locator('#cubePulses button').count()==5
   page.locator('#cubePulseFamily').select_option('laser');page.locator('[data-pulse-form="laser-3"]').click();assert page.locator('[data-pulse-form="laser-3"]').get_attribute('aria-pressed')=='true';assert page.locator('#cubePulses').evaluate('e=>e.contains(document.activeElement)')
   assert page.evaluate('!__r.ac'),'the preview must never start Web Audio'
   page.locator('#cubeClose').click();assert page.evaluate('__r.cubeSettings().pulse==="laser-3"'),'choosing a pulse wears it at once'
   page.evaluate('document.getElementById("bCube").click()');assert page.locator('#cubePulseFamily').input_value()=='laser';assert page.locator('[data-pulse-form="laser-3"]').get_attribute('aria-pressed')=='true'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;page.screenshot(path=f'/tmp/whitedot-pulses-{width}.png');print('PASS earned pulse families, five options, silent instant choice and focus at '+str(width),flush=True)
  b.close()
finally:server.shutdown()
