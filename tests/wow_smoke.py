"""Real card and favorite UI at mobile, landscape and desktop sizes; no audition."""
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
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390),(1280,800)]:
   context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
   page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2')
   page.wait_for_function('!!window.__r?.labMode')
   page.evaluate("""()=>{const r=__r;r.S.sound=false;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.labGo('rhythm:fossil');}""")
   page.evaluate("""()=>{const r=__r,o=r.nearbyPercussion()[0];r.S.wx=o.x;r.S.wy=o.y;}""")
   page.wait_for_function("!document.getElementById('rareNotice').hidden")
   assert page.locator('#rareNotice').get_attribute('data-earned')=='false','forced lab samples never receive acquisition shine'
   page.locator('#rareNoticeOpen').click()
   portrait=page.locator('.rare-card .rare-portrait').first
   box=portrait.bounding_box();assert box and box['width']>20
   event={'pointerId':1,'pointerType':'touch','clientX':box['x']+box['width']*.9,'clientY':box['y']+box['height']*.1}
   portrait.dispatch_event('pointerdown',event)
   assert portrait.evaluate("e=>e.classList.contains('wow-depth')")
   assert abs(portrait.evaluate("e=>parseFloat(e.style.getPropertyValue('--wow-tilt-x'))"))<=3
   portrait.dispatch_event('pointercancel',event)
   assert not portrait.evaluate("e=>e.classList.contains('wow-depth')")
   page.locator('.rare-card').first.locator('button').first.focus()
   assert page.locator('.rare-card.wow-selected').count()==1
   page.emulate_media(reduced_motion='reduce')
   assert page.locator('.rare-card.wow-selected .rare-glyph').evaluate("e=>getComputedStyle(e).animationName")=='none'
   page.evaluate("""()=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__r.cardFocusTick();__r.addFavorite('Mi constelación');__r.openFavorites();}""")
   assert page.locator('.rare-card.wow-selected').count()==0
   thumb=page.locator('.favorite-signature svg').first
   assert thumb.is_visible()
   assert page.locator('#mJournal .sheet').evaluate("e=>e.scrollWidth<=e.clientWidth+2")
   assert thumb.get_attribute('aria-hidden')=='true'
   page.evaluate("()=>{if(__r.S.sound)throw Error('UI changed sound setting')}")
   page.screenshot(path=f'/tmp/whitedot-wow-{width}.png')
   assert not errors,errors
   context.close()
  browser.close()
 print('PASS card touch depth, focus, reduced motion, silent UI and favorite signatures in three sizes')
finally:server.shutdown();server.server_close()
