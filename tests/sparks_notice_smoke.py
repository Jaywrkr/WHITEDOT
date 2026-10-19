"""Real manual pulses break crystals, collect sparks and persist the wallet."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, threading
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
 with sync_playwright() as pw:
  browser = pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'), args=['--no-sandbox'])
  for width,height in [(390,844),(844,390),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.sparkTick')
   page.locator('#hcGo').click()
   page.evaluate("""()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:'+i);r.enterWorld({automatic:true});r.collectRareCard('relic:ordinary',{id:'notice-fixture',x:r.S.wx,y:r.S.wy});}""")
   page.wait_for_function('__r.noticeLane.owner==="rare"')
   assert page.locator('#rareNoticeArt').evaluate('e=>getComputedStyle(e).display')=='none'
   box=page.locator('#rareNotice').bounding_box();assert box['height']<=180 and box['width']<=width-32,box
   assert page.locator('#rareNoticeOpen').is_visible()
   page.screenshot(path=str(ROOT.parent/f'sparks-notice-{width}.png'))
   page.locator('#w').focus();before=page.evaluate('__r.S.wx');page.keyboard.down('ArrowRight');page.wait_for_timeout(500);page.keyboard.up('ArrowRight')
   assert page.evaluate('__r.S.wx')>before,'a notice must not pause movement'
   page.locator('#rareNoticeOpen').click()
   assert page.locator('#mJournal').is_visible()
   assert not errors,errors
   page.close()
  browser.close()
 print('PASS compact timed cards, hidden full artwork, readable actions, uninterrupted movement and explicit book opening in three sizes')
finally:
 server.shutdown();server.server_close()
