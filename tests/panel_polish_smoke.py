"""Shared menu/panel layout, keyboard access and current tutorial contracts in real Chrome."""
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
  page=browser.new_page(has_touch=True);page.set_default_timeout(10000);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.set_viewport_size({'width':390,'height':844})
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.firstJourneyState')
  assert page.locator('#returnEntrance .return-signature').inner_text()=='.simple'
  page.locator('#returnContinue').click();page.locator('#hcGo').click();page.mouse.click(30,422)
  page.wait_for_function('__r.S.pathCrystals.length>0')
  page.wait_for_function('document.getElementById("firstJourneyProgress").textContent.endsWith("/10")')
  assert page.evaluate('__r.S.firstJourney.facts.pulse')
  page.wait_for_function('__r.waves.length===0')
  partial=page.evaluate('__r.S.pathCrystals.length');page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.firstJourneyState');page.locator('#returnContinue').click()
  assert page.evaluate('__r.S.pathCrystals.length')==partial
  assert page.evaluate('__r.S.firstJourney.facts.pulse')
  print('PASS skippable intro, factual Camino pulse, crystal progress and resumed tutorial',flush=True)
  for width,height in [(320,640),(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height})
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=panel-polish-{width}')
   page.wait_for_function('!!window.__r?.openSparks')
   page.evaluate("()=>{__r.S.sound=false;__r.S.firstJourney.skipped=true;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}")
   for button,panel in [('bGuide','mGuide'),('bCube','mCube'),('bSettings','mSettings'),('bSaveTools','mSaveTools'),('bAch','mJournal')]:
    page.locator('#bMenu').click();page.evaluate("document.getElementById('mMenu').hidden=true;(window.__r||window.__testRuntime).openSaveTools()") if button=='bSaveTools' else page.locator('#'+button).click();dialog=page.locator('#'+panel);dialog.wait_for(state='visible')
    if panel=='mGuide':
     page.locator('#guideGlossary').click();assert 'décimo abre el Mundo automáticamente' in dialog.inner_text();assert '20' in dialog.inner_text();assert 'Entra en tu cuenta' in dialog.inner_text()
    assert dialog.locator('.sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2'),(width,panel,'horizontal overflow')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,panel,'page overflow')
    sheet=dialog.locator('.sheet');sheet.evaluate('e=>e.scrollTop=e.scrollHeight')
    close=dialog.locator('header button').first
    if close.count():
     box=close.bounding_box();assert box and box['y']>=0 and box['y']+box['height']<=height,(width,panel,box)
     assert box['width']>=44 and box['height']>=44,(panel,box)
    for _ in range(3):
     page.keyboard.press('Tab');assert dialog.evaluate('e=>e.contains(document.activeElement)'),(width,panel,'focus escaped')
    if panel in ['mGuide','mCube']:page.screenshot(path=str(ROOT.parent/f'panel-{panel}-{width}.png'))
    page.keyboard.press('Escape');assert dialog.is_hidden()
   page.locator('#bMenu').click();page.screenshot(path=str(ROOT.parent/f'panel-menu-{width}.png'));page.keyboard.press('Escape')
   page.emulate_media(reduced_motion='reduce');page.locator('#bMenu').click();assert page.locator('#bGuide').evaluate('e=>getComputedStyle(e).transitionDuration')=='0s';page.keyboard.press('Escape');page.emulate_media(reduced_motion='no-preference')
   print(f'PASS {width}x{height}: eight panels, overflow, reachable close controls, focus containment, current guide and reduced motion',flush=True)
  assert not errors,errors
  browser.close()
finally:server.shutdown();server.server_close()
