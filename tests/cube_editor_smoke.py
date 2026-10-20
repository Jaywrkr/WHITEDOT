"""Reversible mobile customization, actual save failure, keyboard tabs and future-data protection."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page(has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  for width,height in [(320,568),(390,844),(844,390)]:
   if page.url!='about:blank':page.evaluate('localStorage.clear()')
   page.set_viewport_size({'width':width,'height':height})
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('__testRuntime?.cubeSettings');page.evaluate("()=>{document.getElementById('returnContinue').click();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const r=__testRuntime;r.awardReward('cube:material:metal');r.cubeSettings().extra={keep:true};r.save();window.__cube=JSON.stringify(r.cubeSettings());document.getElementById('bCube').click();}")
   assert page.locator('#cubePreview').evaluate('e=>e.clientHeight>=70'),'preview must retain its complete drawing area'
   # Choosing is wearing: the change is saved at once and unknown cube fields survive.
   page.locator('#cubeMaterials [data-cube-style-value="metal"]').click();assert page.evaluate('__testRuntime.S.cube.material')=='metal';assert page.evaluate('__testRuntime.S.cube.extra.keep')
   assert page.locator('#cubePreview').get_attribute('data-material')=='metal';assert page.locator('#mCube').evaluate('e=>e.contains(document.activeElement)')
   page.locator('#cubeClose').click();page.evaluate("document.getElementById('bCube').click()");assert page.locator('#cubePreview').get_attribute('data-material')=='metal'
   page.locator('#cubeTabWear').focus();page.keyboard.press('ArrowRight');assert page.locator('#cubeTabShop').get_attribute('aria-selected')=='true'
   page.keyboard.press('End');assert page.locator('#cubePanelTravel').is_visible();page.keyboard.press('Home');assert page.locator('#cubePanelWear').is_visible()
   # A locked piece explains how to earn it and changes nothing.
   page.locator('#cubeMaterials [data-locked="true"]').first.click();assert page.evaluate('__testRuntime.S.cube.material')=='metal';assert page.locator('#cubeHint').inner_text()
   page.locator('#cubeRestore').click();assert page.evaluate('__testRuntime.S.cube.material')=='plain'
   page.evaluate("()=>{window.__set=Storage.prototype.setItem;const key=__testRuntime.saveStore.key;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Full','QuotaExceededError');return __set.call(this,k,v);};}")
   assert not page.evaluate("__testRuntime.chooseCubeStyle('material','metal')"),'direct legacy selection must also roll back failed storage'
   assert page.evaluate('__testRuntime.S.cube.material')=='plain'
   page.locator('#cubeMaterials [data-cube-style-value="metal"]').click();assert page.locator('#mCube').is_visible();assert page.evaluate('__testRuntime.S.cube.material')=='plain';assert 'No se guardó' in page.locator('#cubeHint').inner_text();page.evaluate('()=>{Storage.prototype.setItem=__set;}')
   assert page.evaluate('!__testRuntime.ac&&__testRuntime.waves.length===0'),'customization must not start music'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   if width==390:page.screenshot(path='/tmp/whitedot-cube-editor.png')
   page.locator('#cubeClose').click();page.evaluate("()=>{const r=__testRuntime;window.__futureCube={version:7,color:'#123456',future:{owned:'keep'}};r.S.cube=structuredClone(__futureCube);document.getElementById('bCube').click();}")
   assert page.locator('#cubeRestore').is_disabled();assert page.locator('#cubeMaterials button').first.is_disabled();assert page.evaluate('JSON.stringify(__testRuntime.S.cube)===JSON.stringify(__futureCube)');page.locator('#cubeClose').click();assert page.evaluate('JSON.stringify(__testRuntime.S.cube)===JSON.stringify(__futureCube)')
   assert not errors,errors;print('PASS cube editor '+str(width),flush=True)
  print('PASS three phone sizes: instant wear, restore, tabs by keyboard, locked hints, silent preview, save rollback and exact future cube retention');b.close()
finally:server.shutdown()
