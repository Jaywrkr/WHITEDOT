"""Integrated real-app visual closure: one context, responsive UI, cards, profile and surprises."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':390,'height':844},has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:(errors.append(str(e)),print('PAGEERROR '+str(e),flush=True)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(320,640),(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cierre-{width}');page.wait_for_function('!!window.__r?.openProfile')
   page.evaluate('''()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.mode='camino';r.S.sound=false;r.S.todayLight=1;r.S.help.camino=true;r.S.help.mundo=true;r.hud();}''')
   page.locator('#bPrimary').click();page.wait_for_function('__r.inWorld()');assert page.locator('#bPrimary').is_enabled()
   # Existing profile UI is silent and uses the current collection, never generated awards.
   before=page.evaluate('__r.waves.length');page.locator('#bMenu').click();page.locator('#bAch').click();page.locator('[data-journal-tab="you"]').click();assert page.locator('#journalYouPart').is_visible();page.locator('#profileName').fill('Jay '+str(width));page.locator('#profileNameSave').click();assert 'guardado' in page.locator('#profileSaveStatus').inner_text()
   assert page.locator('#mJournal').evaluate('e=>e.contains(document.activeElement)');assert page.evaluate('__r.waves.length')<=before
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('.profile-sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
   page.screenshot(path=f'/tmp/whitedot-profile-{width}.png');page.locator('#journalClose').click()
   # Guide actions remain reachable while its descriptive content scrolls.
   page.locator('#bMenu').click();page.locator('#bGuide').click();assert page.locator('#guideJourney li').count()==4
   page.locator('#guideGlossary').click();assert page.locator('#guideClose').bounding_box()['y']+page.locator('#guideClose').bounding_box()['height']<=height
   assert 'Geist Mono' in page.locator('#guideClose').evaluate('e=>getComputedStyle(e).fontFamily');page.locator('#guideClose').click()
   # One reversible temporary effect; menu pauses its active-time clock.
   page.evaluate('__r.giveSurprise("pequeno")');page.wait_for_function('!document.getElementById("surpriseHud").hidden');assert page.evaluate('__r.surpriseStyle.scale')==.55
   rect=page.locator('#surpriseHud').bounding_box();assert rect['x']>=0 and rect['x']+rect['width']<=width
   page.locator('#bMenu').click();page.wait_for_timeout(100);left=page.evaluate('__r.snapshotBoxSurprises().remaining.pequeno');page.wait_for_timeout(250);assert page.evaluate('__r.snapshotBoxSurprises().remaining.pequeno')==left;page.locator('#mnClose').click();page.wait_for_function('!document.getElementById("surpriseHud").hidden');page.locator('#surpriseUndo').click();assert page.evaluate('__r.surpriseStyle.scale')==1
   # Seeded terrain is actually rendered by the app; silence leaves it interactive.
   page.evaluate('''()=>{const r=__r;let q;for(let i=0;i<40&&!q;i++){r.S.wx=i*1000;r.S.wy=0;q=r.nearbyVisualSegments()[0];}if(!q)throw Error('visual fixture missing');r.S.wx=q.x;r.S.wy=q.y;r.visualGesture();}''');page.wait_for_timeout(100);assert page.evaluate('__r.vjState.cache')<=48
   page.screenshot(path=f'/tmp/whitedot-vj-final-{width}.png')
   # A compact reveal keeps one lane and leaves movement available.
   page.evaluate('''()=>{const r=__r;r.collectRareCard('fossil',{id:'visual-closure:'+innerWidth,x:r.S.wx,y:r.S.wy},{forced:true});}''');page.wait_for_function('!document.getElementById("rareNotice").hidden',timeout=45000)
   rect=page.locator('#rareNotice').bounding_box();assert rect['width']<=width-32 and rect['height']<=180
   assert page.locator('.rare-reveal-card').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
   page.wait_for_timeout(350);assert page.locator('#rareNotice').is_visible();assert page.locator('#rareNotice').get_attribute('data-inspect')=='false'
   page.screenshot(path=f'/tmp/whitedot-card-final-{width}.png');page.locator('#rareNoticeDismiss').click();page.wait_for_function('document.getElementById("rareNotice").hidden')
   # A real gifted box opens its earned presentation, including a secondary duration.
   page.evaluate("()=>{const r=__r;r.givePower('cometa');r.giveSurprise('lento');r.celebrateBox({id:'closure-box:'+innerWidth,x:r.S.wx,y:r.S.wy,power:'cometa',surprise:'lento',gift:true});}")
   page.wait_for_function('!document.getElementById("celebration").hidden',timeout=45000)
   assert '10 s' in page.locator('#celebrationSurpriseName').inner_text()
   assert page.locator('.celebration-card').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
   page.screenshot(path=f'/tmp/whitedot-box-card-{width}.png')
   page.locator('#celebrationDismiss').click();page.wait_for_function('document.getElementById("celebration").hidden')
   page.evaluate('__r.clearSurprise();__r.clearPowers()')
   # Persistence and reduced motion use production paths without resetting the save.
   page.evaluate('__r.save()');page.reload();page.wait_for_function('window.__r?.playerProfile');assert page.evaluate('__r.playerProfile.name')=='Jay '+str(width)
   page.emulate_media(reduced_motion='reduce');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__r.openProfile()');page.wait_for_timeout(100)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   print(f'PASS integrated entry/profile/surprise/VJ/card/persistence/reduced motion at {width}',flush=True)
  browser.close()
finally:server.shutdown()
