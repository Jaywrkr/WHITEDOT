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
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.wonderTick');page.locator('#returnContinue').click();page.locator('#hcGo').click()
   page.evaluate('''()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();}''')
   page.locator('#bStyles').click();page.locator('#musicTravelSearch').fill('bossa');assert page.locator('#musicTravelList [data-music-genre]').count()>0;assert 'Jazz y bossa' in page.locator('#musicTravelList').inner_text();assert page.locator('#mMusicTravel .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2');page.locator('#musicTravelClose').click();page.locator('#bMenu').click();page.locator('#bCube').click()
   assert page.locator('#cubeWonder').is_disabled();assert '0 de 20' in page.locator('#cubeGiftCount').inner_text()
   page.locator('#cubeGiftStatus').scroll_into_view_if_needed();page.screenshot(path=str(ROOT.parent/f'menu-empty-{width}.png'))
   page.locator('#cubeClose').click()
   page.evaluate('''async()=>{const {WONDERS}=await import('/src/musical-wonders-model.js');__r.S.musicalWonders={version:1,found:Object.fromEntries(WONDERS.map(d=>[d.id,true])),totems:{}};__r.save();}''')
   page.locator('#bMenu').click();page.locator('#bCube').click();assert page.locator('#cubeWonder option').count()==21
   page.locator('#cubeWonder').select_option('star-seed');assert page.locator('#cubeGiftStatus').inner_text()=='Lo llevas';assert page.locator('#cubeGiftPortrait svg').count()==1
   for tab in ['#cubeTabShop','#cubeTabTravel','#cubeTabWear']:
    page.locator(tab).click();assert page.locator('#mCube .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2')
   page.locator('#cubeWonder').scroll_into_view_if_needed();page.screenshot(path=str(ROOT.parent/f'menu-gifts-{width}.png'));page.locator('#cubeClose').click()
   assert page.evaluate('__r.S.cube.wonder')=='star-seed'
   page.locator('#bMenu').click();page.locator('#bCube').click();assert page.locator('#cubeGiftStatus').inner_text()=='Lo llevas'
   page.evaluate("()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota')};}");page.locator('#cubeWonder').select_option('dawn-mirror');assert page.evaluate('__r.S.cube.wonder')=='star-seed';page.evaluate('()=>{Storage.prototype.setItem=originalSet;}');page.locator('#cubeClose').click()
   page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#universeTexts').uncheck();assert page.evaluate('__r.S.universeTexts===false');assert page.locator('#universeTexts').evaluate('e=>e.getBoundingClientRect().width<=24');assert page.locator('#universeTextsHint').is_visible();page.screenshot(path=str(ROOT.parent/f'menu-settings-before-{width}.png'));assert page.locator('#mSettings .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2'),page.locator('#mSettings .sheet').evaluate('e=>({sw:e.scrollWidth,cw:e.clientWidth,children:[...e.querySelectorAll("*")].map(n=>({id:n.id,tag:n.tagName,x:n.getBoundingClientRect().x,w:n.getBoundingClientRect().width})).filter(n=>n.x+n.w>innerWidth)})');page.locator('#settingsClose').scroll_into_view_if_needed();page.screenshot(path=str(ROOT.parent/f'menu-settings-{width}.png'));page.locator('#settingsClose').click()
   page.reload();page.wait_for_function('!!window.__r?.wonderTick');page.locator('#returnContinue').click();assert page.evaluate('__r.S.cube.wonder')=='star-seed';assert page.evaluate('__r.S.universeTexts===false')
   for button,modal in [('bMusicSettings','mMusic'),('bAch','mJournal'),('bMap','mJournal'),('bGuide','mGuide'),('bSaveTools','mSaveTools')]:
    page.locator('#bMenu').click();page.evaluate("document.getElementById('mMenu').hidden=true;(window.__r||window.__testRuntime).openSaveTools()") if button=='bSaveTools' else page.locator('#'+button).click();sheet=page.locator('#'+modal+' .sheet');assert sheet.is_visible();assert sheet.evaluate('e=>e.scrollWidth<=e.clientWidth+2'),modal
    assert sheet.evaluate('e=>{const b=e.getBoundingClientRect();return b.x>=0&&b.right<=innerWidth+1&&b.y>=0&&b.bottom<=innerHeight+1}'),modal
    if width==390:page.screenshot(path=str(ROOT.parent/f'menu-review-{modal}.png'))
    page.locator('#'+modal+' .sheet-close').click();page.wait_for_function('!document.getElementById("w").inert')
   assert not errors,errors;page.close();print('PASS menu empty/full gifts, preview/equip, all tabs, quota rollback, text preference and reload '+str(width),flush=True)
  browser.close()
finally:server.shutdown();server.server_close()
