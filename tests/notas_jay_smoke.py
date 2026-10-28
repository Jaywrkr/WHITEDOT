"""Jay's notes on alpha.225 (27 Oct 2026): no jump to another place inside a level; after the Journey the jump is there
from the first moment (the first one free) and the next place can be reached from far away; «Saltar» ends the Journey's
finale at once with the same state; the magic box says one short line, whole on a phone and on a desktop; «?rapido=1»
plays every goal at a fifth on a save of its own."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}/'
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
MORE="document.getElementById('menuMore')?.setAttribute('open','')"
def page_for(browser,width,height,query=''):
 page=browser.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 # A real player's browser: new saves start in the Journey.
 page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(URL+query);page.wait_for_function('!!window.__r?.journeyFinale&&!!window.__r?.jumpPracticePlace');return page,errors
def menu_ids(page):
 page.evaluate(HIDE);page.locator('#bMenu').click();page.evaluate(MORE);page.wait_for_timeout(80)
 ids=page.evaluate("()=>[...document.querySelectorAll('#mMenu button')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('.devbox')).map(e=>e.id)")
 page.locator('#mnClose').click();return ids
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  # 1 · Inside a chapter of the Journey: neither the jump nor «Volver al punto anterior», in the dock, the menu or by code.
  page,errors=page_for(browser,390,844)
  page.evaluate("()=>{"+HIDE+";const r=__r,s=r.S;s.sound=false;s.pathCrystals=Array.from({length:10},(_,i)=>'j:'+i);s.help.camino=s.help.mundo=true;s.sparks=60;r.sparkEconomy.earned=60;r.enterWorld({automatic:true});r.stopAutopilot?.();s.practiceTravel.previous={x:s.wx+5000,y:s.wy,layer:'superficie'};r.save();}")
  page.wait_for_timeout(400);assert page.evaluate('__r.journeyMode()')=='viaje' and page.evaluate('__r.inWorld()')
  assert page.locator('#bJump').is_hidden() and page.locator('#bJumpBack').is_hidden(),'no jump inside a level'
  ids=menu_ids(page);assert 'bJumpBack' not in ids and 'bJump' not in ids and 'bWorlds' not in ids,ids
  at=page.evaluate('[__r.S.wx,__r.S.wy]');assert page.evaluate('__r.jumpPracticePlace()')==False and page.evaluate('__r.returnPracticePlace()')==False and page.evaluate('[__r.S.wx,__r.S.wy]')==at
  assert page.evaluate('__r.canPracticeTravel()')==False,'no teleporting surprise inside a level either'
  # 2 · The Journey's finale: «Saltar», small and quiet in the corner, answers at once and leaves the same state as its end.
  page.evaluate("()=>{const j=__r.S.journey;j.chapter=6;j.done={llanura:true,lago:true,bosque:true,tormenta:true,vacio:true};j.notes={llanura:[57,59],vacio:[64]};__r.save();}")
  # The Refugio chapter starts the finale by itself (journey-chapters.js); asking again does nothing.
  page.evaluate('__r.journeyFinale()');page.wait_for_function('__r.journeyFinaleState().running',timeout=5000)
  st=page.evaluate('__r.journeyFinaleState()');assert st['seconds']<=.8+16+1+3.5+1e-6,st
  assert page.locator('#bJumpBack').is_hidden() and page.locator('#bJump').is_hidden(),'no jump under the finale'
  skip=page.locator('#journeySkip');assert skip.is_visible() and skip.inner_text()=='Saltar' and skip.get_attribute('aria-label')=='Saltar al Mundo libre'
  page.wait_for_function('!document.getElementById("journeySkip").disabled',timeout=3000)
  box=skip.bounding_box();assert box['x']+box['width']<=390 and box['y']<80 and box['x']>390/2 and box['height']>=44 and box['width']<140,box
  css=skip.evaluate("e=>{const s=getComputedStyle(e);return [s.backgroundColor,s.borderTopLeftRadius,s.fontFamily]}");assert css[0]=='rgb(0, 0, 0)' and css[1]=='0px' and 'Geist Mono' in css[2],css
  page.screenshot(path='/tmp/kubono-m1-saltar-390.png')
  waves=page.evaluate('__r.waves.length');skip.click();page.wait_for_function('!__r.journeyFinaleState().running',timeout=3000)
  assert page.evaluate('__r.waves.length')==waves,'«Saltar» is silent'
  state=page.evaluate("()=>{const r=__r,j=r.S.journey;return {finished:j.finished,mode:r.journeyMode(),free:j.free,skipped:r.journeyFinaleState().skipped,saved:JSON.parse(localStorage.getItem('pixel-blanco-v4')).journey.finished}}")
  assert state=={'finished':True,'mode':'libre','free':True,'skipped':True,'saved':True},state
  assert page.locator('#journeyFinale').is_hidden()
  # 3 · The free World from the first moment: the jump is there, free the first time, then «Volver al punto anterior».
  page.evaluate("()=>{"+HIDE+";const r=__r;if(!r.inWorld())r.exitHouse?.();if(!r.inWorld())r.enterWorld({automatic:true});r.S.sparks=0;r.S.practiceTravel.previous=null;r.save();}")
  page.wait_for_function('__r.inWorld()');page.evaluate(HIDE)
  page.wait_for_function("!document.getElementById('bJump').hidden&&!document.getElementById('bJump').disabled",timeout=3000)
  assert page.locator('#bJump').inner_text()=='Otro paisaje · gratis' and page.locator('#bJump').is_visible()
  before=page.evaluate('[__r.S.wx,__r.S.wy]');page.locator('#bJump').click();page.wait_for_function('!!__r.S.practiceTravel.previous')
  assert page.evaluate('__r.S.sparks')==0 and page.evaluate('__r.S.journey.freeJumpUsed')==True and page.evaluate('[__r.S.wx,__r.S.wy]')!=before
  page.wait_for_function("document.getElementById('bJump').textContent==='Otro paisaje · 20 ✦'&&document.getElementById('bJump').disabled",timeout=3000)
  assert page.locator('#bJump').is_visible(),'after the free one it stays in view, waiting for sparks'
  ids=menu_ids(page);assert 'bJumpBack' in ids,ids
  # Far from the ring, Lugares offers «Ir» to the next place, free, and lands beside its portal.
  page.evaluate(HIDE);far=page.evaluate("()=>{const r=__r,p=r.ringRoute();return p?p.distance:null}");assert far and far>9600,far
  page.locator('#bMenu').click();page.locator('#bLugares').click();page.wait_for_function("!document.getElementById('mLugares').hidden")
  row=page.locator('#lugaresList li[aria-current=step]');go=row.get_by_role('button',name='Ir',exact=True);assert go.count()==1,row.inner_text()
  go.click();page.wait_for_function("__r.ringRoute()&&__r.ringRoute().distance<300",timeout=3000)
  assert not errors,errors;page.close()
  # 4 · A round of a place: no jump, no «Volver al punto anterior», no other land.
  page,errors=page_for(browser,390,844,'?lugar=jardin');page.wait_for_function('!!__r.placeRun?.()',timeout=8000)
  page.evaluate("()=>{const s=__r.S;s.sparks=60;__r.sparkEconomy.earned=60;s.practiceTravel.previous={x:s.wx+5000,y:s.wy,layer:'superficie'};__r.setJourneyMode('libre');}")
  page.wait_for_timeout(400);assert page.locator('#bJump').is_hidden() and page.locator('#bJumpBack').is_hidden()
  ids=menu_ids(page);assert 'bJumpBack' not in ids and 'bWorlds' not in ids and 'bLeavePlace' in ids,ids
  assert page.evaluate('__r.jumpPracticePlace()')==False
  # «?lugar=» alone keeps the real goals.
  assert page.evaluate('__r.placeGoalScale()')==1
  assert not errors,errors;page.close()
  # 5 · The magic box: one short line, whole, small, at phone and desktop sizes.
  for width,height in [(390,844),(1280,800)]:
   page,errors=page_for(browser,width,height,'?testSeed=boxes-v2&layout=classic&generation=2')
   page.evaluate("()=>{"+HIDE+";const r=__r;r.S.sound=false;r.spawnBox(r.S.wx,r.S.wy,'cometa');}")
   page.wait_for_function("!document.getElementById('celebration').hidden",timeout=8000);page.wait_for_timeout(500)
   card=page.evaluate("""()=>{const p=document.getElementById('celebration'),r=p.getBoundingClientRect(),line=document.getElementById('celebrationLine'),shown=[...p.querySelectorAll('.celebration-card>*')].filter(e=>getComputedStyle(e).display!=='none'&&!e.hidden).map(e=>e.id);
    return {x:r.x,y:r.y,w:r.width,h:r.height,scroll:p.scrollHeight-p.clientHeight,text:line.innerText,lineCut:line.scrollWidth>line.clientWidth+1,shown,continueBottom:document.getElementById('celebrationContinue').getBoundingClientRect().bottom}}""")
   assert card['text'].startswith('¡Zum!') and card['text'].endswith('20 s') and len(card['text'])<=48,card
   assert card['shown']==['celebrationLine','celebrationDismiss','celebrationContinue'],card
   assert card['h']<=96 and card['w']<=300 and card['scroll']<=1 and not card['lineCut'] and card['x']>=0 and card['x']+card['w']<=width and card['continueBottom']<=card['y']+card['h']+1,card
   page.screenshot(path=f'/tmp/kubono-m1-caja-{width}.png')
   page.locator('#celebrationContinue').click();page.wait_for_function("document.getElementById('celebration').dataset.layout==='full'")
   assert page.locator('#celebrationEffect').is_visible() and page.locator('#celebrationLine').is_hidden(),'the details stay one tap away'
   assert not errors,errors;page.close()
  # 6 · «?rapido=1»: every goal at a fifth, on its own save; without it, the real goals and the player's save.
  page,errors=page_for(browser,390,844,'?rapido=1')
  assert page.evaluate('__r.placeGoalScale()')==.2 and page.evaluate('__r.saveScope.kind')=='main'
  page.evaluate("()=>{__r.S.sparks=7;__r.save();}");keys=page.evaluate('Object.keys(localStorage)')
  assert 'kubono:rapido' in keys and 'pixel-blanco-v4' not in keys,keys
  assert page.evaluate("JSON.parse(localStorage.getItem('kubono:rapido')).sparks")==7
  # «?rapido=2»: a twentieth, same save of its own.
  page.goto(URL+'?rapido=2');page.wait_for_function('!!window.__r?.placeGoalScale')
  assert page.evaluate('__r.placeGoalScale()')==.05 and page.evaluate("JSON.parse(localStorage.getItem('kubono:rapido')).sparks")==7
  page.goto(URL);page.wait_for_function('!!window.__r?.placeGoalScale')
  assert page.evaluate('__r.placeGoalScale()')==1 and page.evaluate('__r.S.sparks')!=7,'a normal game keeps its goals and its save'
  assert not errors,errors;page.close();browser.close()
 print('PASS Jay notes: no jump in chapters, rounds or finale; «Saltar» ends the finale with the same state; free first jump and «Ir» to the next place from far; whole short magic-box line at 390 and 1280; ?rapido=1 at a fifth on its own save',flush=True)
finally:server.shutdown()
