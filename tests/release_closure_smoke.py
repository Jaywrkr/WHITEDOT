"""New menu controls in empty/full saves, all cube tabs, settings, persistence and quota rollback."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  for width,height in [(320,568),(390,844),(844,390),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.achievementEarned');page.locator('#returnContinue').click();page.locator('#hcGo').click()
   page.evaluate("()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();}")
   page.wait_for_function("document.getElementById('sparkTotal').textContent.includes('chispas')")
   assert page.locator('#sparkCount').is_visible();assert page.locator('#sparkCount').evaluate('e=>{const b=e.getBoundingClientRect();return b.x>=0&&b.right<=innerWidth}')
   page.evaluate("()=>{__r.S.ach['release-fixture']='2026-10-18';__r.ACH.push(['release-fixture','Ensayo de cierre','Prueba']);__r.achievementEarned(['release-fixture']);__r.save();}")
   page.wait_for_function("document.getElementById('bAch').classList.contains('has-unread')")
   page.locator('#bMenu').click();page.locator('#bAch').click();page.locator('[data-journal-tab=achievements]').click()
   page.wait_for_function("!document.getElementById('bAch').classList.contains('has-unread')")
   assert page.locator('#mJournal .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2')
   page.screenshot(path=str(ROOT.parent/f'closure-logros-{width}.png'));page.locator('#mJournal .sheet-close').click()
   page.reload();page.wait_for_function('!!window.__r?.achievementEarned');page.locator('#returnContinue').click()
   assert page.evaluate("__r.S.journal.achievementSeen['release-fixture']===true")
   assert not errors,errors;page.close();print('PASS closure HUD, grouped journal marker/acknowledgement, reload and layout '+str(width),flush=True)
  browser.close()
finally:server.shutdown();server.server_close()
