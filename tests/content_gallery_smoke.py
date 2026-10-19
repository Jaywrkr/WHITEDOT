"""Internal gallery reaches the actual original sprites and instrument practices."""
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
  page.add_init_script("localStorage.setItem('pixel-blanco-v4:preview-wide:v2:laboratorio',JSON.stringify({sound:false}))")
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&layout=wide&generation=2&lab=1');page.wait_for_function('!!window.__r?.labGo')
   page.evaluate("__r.S.sound=false;document.querySelectorAll('.modal').forEach(e=>e.hidden=true)");page.wait_for_function('!document.getElementById("labBar").hidden');page.locator('#labGallery').click();page.wait_for_function('!document.getElementById("contentGallery").hidden');assert page.locator('#contentGallery').is_visible()
   page.evaluate("const input=document.getElementById('contentGallerySearch');input.value='Colonia pixelada';input.dispatchEvent(new Event('input'))")
   assert page.evaluate("document.querySelectorAll('.content-specimen').length===1&&!!document.querySelector('.content-specimen svg rect')")
   page.locator('.content-specimen button').click();assert page.locator('#contentGallery').is_hidden();assert page.evaluate("__r.labBook.current==='native:pixel'")
   assert page.evaluate("(()=>{const r=__r,d=r.regionOfPos(r.S.wx,r.S.wy+110);return d.worldFamily.id==='terraces';})()")
   if width==390:
    for style in ['pixel','membrane','filament','facets','anatomy']:
     page.evaluate('s=>__r.labGo("native:"+s)',style)
     assert page.evaluate('async s=>{const {nativeVisualFamily}=await import("/src/native-visual.js");return nativeVisualFamily(__r.regionOfPos(__r.S.wx,__r.S.wy+110),__r.seedOf)===s;}',style)
     page.wait_for_timeout(70);assert not errors,errors
   page.wait_for_timeout(120);assert page.evaluate('!__r.ac'),'gallery controls stay silent'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;page.screenshot(path=f'/tmp/whitedot-catalog-{width}.png');print('PASS searchable gallery, actual pixel colony, silent controls and contained UI at '+str(width),flush=True)
  b.close()
finally:server.shutdown()
