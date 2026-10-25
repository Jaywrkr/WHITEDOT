"""Entering the Journey as a new player: no account sheet and no welcome window, a quiet screen (no counters, no shop, a short menu), the free World one tap away and remembered."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
QUIET=['day','era','walkDistance','sparkCount','goal','bJump','bStyles']
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   # A real player's browser, not an automated one: new saves start in the Journey.
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});")
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyMode');page.wait_for_timeout(600)
   assert page.locator('#mConnection').is_hidden() and page.locator('#mHelpC').is_hidden(),'no sheet and no window before playing'
   assert page.evaluate('__r.journeyMode()')=='viaje' and page.evaluate("document.body.classList.contains('journey-quiet')")
   for id in QUIET:assert page.evaluate(f"getComputedStyle(document.getElementById('{id}')).visibility")=='hidden',id
   # The menu is short: the shop, map, journal and creation tools wait in the free World.
   page.locator('#bMenu').click();assert all(page.locator('#'+i).is_hidden() for i in ['bCube','bMap','bAch','bRecord','bWorlds','bShare'])
   page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')")
   assert all(page.locator('#'+i).is_visible() for i in ['bWorld','bStudio','bSettings','bConnection'])
   # The free World is closed until the Journey ends (decision 6A): no switch, and asking for it does nothing.
   assert (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bJourneyMode').is_hidden() and page.evaluate("__r.setJourneyMode('libre')")==False and page.evaluate('__r.journeyMode()')=='viaje'
   page.evaluate("()=>{__r.S.journey.finished=true;__r.applyJourneyMode();}");assert (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bJourneyMode').is_visible()
   assert (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bJourneyMode').inner_text().startswith('Vista tranquila')
   # At the end, one tap to the free World: everything is back, and it is remembered.
   (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bJourneyMode').click();assert page.evaluate('__r.journeyMode()')=='libre' and not page.evaluate("document.body.classList.contains('journey-quiet')")
   assert page.evaluate("getComputedStyle(document.getElementById('sparkCount')).visibility")=='visible'
   page.reload();page.wait_for_function('!!window.__r?.journeyMode');assert page.evaluate('__r.journeyMode()')=='libre'
   page.wait_for_timeout(800);assert page.locator('#mHelpC').is_hidden(),'coming from the Journey, no Camino welcome';page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();assert page.locator('#bCube').is_visible() and (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bJourneyMode').inner_text().startswith('Vista completa')
   (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bJourneyMode').click();assert page.evaluate('__r.journeyMode()')=='viaje'
   assert not errors,errors;page.close()
  browser.close()
 print('PASS entering the Journey on phone and desktop: no account sheet or welcome window, quiet HUD, short menu, free World closed until the end of the Journey, then one tap away and remembered, and back',flush=True)
finally:server.shutdown()
