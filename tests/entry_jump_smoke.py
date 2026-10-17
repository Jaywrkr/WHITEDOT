"""Entry is visible before guidance; earning the first fare reveals a persistent dock jump."""
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
  for width,height in [(320,568),(390,844),(844,390),(1280,800)]:
   page = browser.new_page(viewport={'width':width,'height':height},has_touch=True)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.showReturnEntrance')
   assert page.locator('#returnEntrance').is_visible()
   assert page.locator('#mHelpC').is_hidden()
   page.wait_for_timeout(1400)
   assert page.locator('#returnEntrance').is_visible()
   assert page.locator('#returnPhrase').inner_text()
   assert page.locator('.return-signature').inner_text()=='.simple'
   assert float(page.locator('.return-signature').evaluate('e=>getComputedStyle(e).opacity'))>.9
   assert page.locator('#returnContinue').evaluate('e=>e===document.activeElement')
   page.locator('#returnEntrance').wait_for(state='hidden')
   assert page.locator('#mHelpC').is_visible(),'auto close must restore the first guide'
   page.locator('#hcGo').click()
   assert page.evaluate('__r.firstJourneyState.next') is not None
   page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.showReturnEntrance')
   assert page.locator('#returnEntrance').is_visible(),'unfinished guidance must not suppress the return intro'
   page.keyboard.press('Escape');page.locator('#returnEntrance').wait_for(state='hidden')
   page.wait_for_function('!document.getElementById("w").inert')
   assert page.locator('#bJump').is_hidden()
   # Supply nineteen earlier earned sparks; the final spark comes from a real manual pulse.
   page.evaluate('''async()=>{const r=__r;r.S.sound=false;r.S.help.mundo=true;r.S.ach.mundo=r.S.todayKey;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'entry:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.S.sparks=19;r.sparkEconomy.earned=19;r.save();const {crystalField}=await import('/src/crystal-sparks.js');let crystal=null;for(let i=0;i<500&&!crystal;i++){const field=crystalField(i*1200,0,r.seedOf);crystal=field.find(c=>c.size===1&&!c.rare&&field.every(o=>o.id===c.id||Math.hypot(o.x-c.x,o.y-c.y)>240));}if(!crystal)throw Error('No native small crystal');r.S.wx=crystal.x;r.S.wy=crystal.y-30;window.site=crystal.id;}''')
   page.wait_for_timeout(700);assert page.locator('#bJump').is_hidden()
   page.mouse.click(25,height/2);page.wait_for_function('__r.S.sparks===20')
   page.locator('#bJump').wait_for(state='visible')
   assert page.locator('#bJump').is_enabled()
   assert page.locator('#sparkTotal').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=14
   assert page.locator('#sparkTotal').evaluate('e=>getComputedStyle(e).color')=='rgb(240, 210, 122)'
   assert page.locator('#bJump').evaluate('e=>e.parentElement.id')=='dock'
   rect=page.locator('#bJump').bounding_box()
   assert rect['width']>=44 and rect['height']>=44 and rect['y']+rect['height']<=height
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   before=page.evaluate('({x:__r.S.wx,y:__r.S.wy,pulses:__r.S.session.pulses})')
   page.locator('#bJump').tap();page.wait_for_function('__r.S.sparks===0&&__r.sparkEconomy.stats.jumps===1')
   assert page.evaluate('__r.S.session.pulses')==before['pulses'],'dock jump is silent and does not mine'
   assert page.evaluate('p=>Math.hypot(__r.S.wx-p.x,__r.S.wy-p.y)>500',before)
   page.wait_for_function('document.getElementById("bJump").disabled')
   assert page.locator('#bJump').is_visible(),'spending the fare must not hide the earned button'
   from browser_helpers import keep_place_on_reload
   keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.sparkTick')
   page.locator('#returnContinue').click();page.locator('#bJump').wait_for(state='visible')
   assert page.locator('#bJump').is_disabled()
   page.locator('#bMenu').click();page.locator('#bJumpBack').click()
   assert page.evaluate('__r.S.sparks')==0
   assert page.evaluate('p=>Math.hypot(__r.S.wx-p.x,__r.S.wy-p.y)<1',before)
   page.screenshot(path=str(ROOT.parent/f'entry-earned-jump-{width}.png'))
   assert not errors,errors
   print(f'PASS {width}: readable intro/signature, guide restore, pending tutorial reload, native earning, paid dock jump, reload and free return',flush=True)
   page.close()
  page=browser.new_page(reduced_motion='reduce')
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.showReturnEntrance')
  assert page.locator('#returnEntrance').is_visible()
  assert page.locator('.return-signature').evaluate('e=>getComputedStyle(e).animationName')=='none'
  page.locator('#returnContinue').click();assert page.locator('#mHelpC').is_visible()
  page.close();browser.close()
finally:
 server.shutdown();server.server_close()
