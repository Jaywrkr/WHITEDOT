"""Jay's fixes after alpha.229 (28 Oct 2026, alpha.230), on a 390×844 phone, after the Journey with five of the eleven
places: B · no «Otro paisaje» and no «Viajar a otra tierra» anywhere (dock, «Más», Tu cubo, by code) until the eleven
are complete; then both, the first jump free. C · «Estilos» is in no view or menu. E · Lugares offers «Volver al anillo»,
free: from 77 km away it comes first and lands at the ring's centre, the compass points to the next place, and «Volver
al punto anterior» brings you back where you were."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
VISIBLE="sel=>[...document.querySelectorAll(sel)].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('.devbox')).map(e=>e.id)"
RING="(()=>{const d=__r.placesData();for(const k of Object.keys(d.stars))d.stars[k][0]=true;__r.save();})()"
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function('!!window.__r?.ringHome&&__r.inWorld()&&!!__r.ringState?.().active',timeout=20000)
  # The full view, as after the Journey; a player's page is not «dev» (a local server is, and keeps the seed tools).
  page.evaluate("()=>{"+HIDE+";const r=__r;r.S.sound=false;r.setJourneyMode('libre');r.stopAutopilot?.();r.S.sparks=60;r.sparkEconomy.earned=60;r.save();document.body.classList.remove('dev');}")
  page.wait_for_timeout(500);page.evaluate(HIDE)
  assert page.evaluate('__r.S.journey.finished') and page.evaluate('__r.places().count')<11 and not page.evaluate('__r.placesAllComplete()')
  def menu():
   page.evaluate(HIDE);page.locator('#bMenu').click();page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')");page.wait_for_timeout(80)
   ids=page.evaluate(VISIBLE,'#mMenu button');page.locator('#mnClose').click();return ids
  # B and C before the eleven: the World's screen has neither «Otro paisaje» nor «Estilos», «Más» no jump or other land.
  dock=page.evaluate(VISIBLE,'#dock button');assert 'bJump' not in dock and 'bStyles' not in dock,dock
  assert page.locator('#bJump').is_hidden() and page.locator('#bStyles').is_hidden() and page.evaluate("getComputedStyle(document.getElementById('bStyles')).display")=='none'
  ids=menu();assert not {'bJump','bWorlds','bStyles'}&set(ids),ids
  assert page.evaluate('__r.jumpPracticePlace()')==False and not page.evaluate('__r.S.journey.freeJumpUsed'),'the code refuses it too'
  page.evaluate("__r.openSparks('travel')");page.wait_for_timeout(100)
  assert page.locator('#sparkJump').is_hidden() and 'saltar' not in page.locator('#sparkStatus').inner_text().lower()
  page.locator('#cubeClose').click();page.evaluate(HIDE);page.wait_for_timeout(200)
  assert 'paisaje' not in (page.locator('#sparkGoal').inner_text() if page.locator('#sparkGoal').is_visible() else '').lower()
  world=SHOTS/'kubono-ae-mundo-390.png';page.screenshot(path=str(world))
  # «Estilos» by code still opens its sheet (for tests); nothing in the page leads to it.
  page.evaluate('__r.openMusicTravel()');assert page.locator('#mMusicTravel').is_visible();page.locator('#musicTravelClose').click()
  # E · 77 km away: Lugares puts «Volver al anillo» first; it lands at the ring's centre, the compass points to the next place.
  far=page.evaluate("()=>{const r=__r;r.S.wx+=77000;r.S.wy+=1200;r.save();return {x:r.S.wx,y:r.S.wy};}");page.wait_for_timeout(300)
  assert page.evaluate('__r.ringAway()')
  page.locator('#bMenu').click();page.locator('#bLugares').click();page.wait_for_function("!document.getElementById('mLugares').hidden")
  back=page.locator('#lugaresRing');assert back.is_visible() and back.inner_text()=='Volver al anillo' and 'next' in back.get_attribute('class'),back.get_attribute('class')
  door=page.locator('#lugaresDoor').bounding_box();box=back.bounding_box();assert box['y']<door['y'] and box['width']>=door['width']-1,(box,door)
  # «Ir» from far reaches only the next place on the path, beside its portal: not a free jump.
  goes=page.evaluate("[...document.querySelectorAll('#lugaresList li')].filter(li=>[...li.querySelectorAll('button')].some(b=>b.textContent==='Ir')).map(li=>li.dataset.placeId)")
  nxt=page.evaluate('__r.placeNext()');assert set(goes)<=set(page.evaluate("Object.entries(__r.places().stars).filter(([k,v])=>v[0]).map(([k])=>k)"))|{nxt},goes
  # One more row, and «Cerrar» still whole on the phone.
  close=page.locator('#lugaresClose').bounding_box();assert close['y']+close['height']<=844 and page.locator('#lugaresClose').is_visible(),close
  lugares=SHOTS/'kubono-ae-lugares-volver-390.png';page.screenshot(path=str(lugares))
  sparks=page.evaluate('__r.S.sparks');back.click();page.wait_for_function("document.getElementById('mLugares').hidden")
  st=page.evaluate("(()=>{const r=__r,c=r.ringState().center,route=r.ringRoute();return {d:Math.hypot(r.S.wx-c.x,r.S.wy-c.y),next:route&&route.id,away:r.ringAway(),prev:r.S.practiceTravel.previous,sparks:r.S.sparks,layer:r.S.layer||'superficie'}})()")
  assert st['d']<=200 and st['next']==nxt and not st['away'] and st['sparks']==sparks and st['layer']=='superficie',st
  assert abs(st['prev']['x']-far['x'])<1 and abs(st['prev']['y']-far['y'])<1,'«Volver al punto anterior» knows where you were'
  page.wait_for_timeout(300);page.evaluate(HIDE);ring_shot=SHOTS/'kubono-ae-anillo-390.png';page.screenshot(path=str(ring_shot))
  # Inside the ring it stays (free, a whole row) under «Seguir hacia …».
  page.locator('#bMenu').click();page.locator('#bLugares').click();page.wait_for_function("!document.getElementById('mLugares').hidden")
  assert back.is_visible() and 'next' not in (back.get_attribute('class') or '');assert back.bounding_box()['y']>page.locator('#lugaresDoor').bounding_box()['y']
  page.locator('#lugaresClose').click()
  ids=menu();assert 'bJumpBack' in ids and 'bJump' not in ids,ids
  page.locator('#bMenu').click();page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')");page.locator('#bJumpBack').click()
  page.wait_for_function("p=>Math.hypot(__r.S.wx-p.x,__r.S.wy-p.y)<2",arg=far,timeout=3000)
  # B after the eleven: «Otro paisaje · gratis» in the dock, in Tu cubo, and «Viajar a otra tierra» in «Más»; the first jump free.
  page.evaluate(RING);page.evaluate(HIDE)
  page.wait_for_function("!document.getElementById('bJump').hidden",timeout=3000);assert page.locator('#bJump').inner_text()=='Otro paisaje · gratis' and page.locator('#bJump').is_visible()
  ids=menu();assert 'bWorlds' in ids and 'bStyles' not in ids,ids
  page.evaluate("__r.openSparks('travel')");page.wait_for_timeout(100);assert page.locator('#sparkJump').is_visible() and 'gratis' in page.locator('#sparkJump').inner_text();page.locator('#cubeClose').click();page.evaluate(HIDE)
  before=page.evaluate('[__r.S.wx,__r.S.wy,__r.S.sparks]');page.locator('#bJump').click();page.wait_for_function('__r.S.journey.freeJumpUsed===true')
  after=page.evaluate('[__r.S.wx,__r.S.wy,__r.S.sparks]');assert after[2]==before[2] and after[:2]!=before[:2],(before,after)
  assert not errors,errors;browser.close()
 print('PASS Jay\'s fixes B, C, E on 390×844: no jump or other land before the eleven places (dock, «Más», Tu cubo, code), then both and the first jump free; «Estilos» nowhere; «Volver al anillo» first from 77 km, free, to the ring\'s centre with the compass on the next place, and back with «Volver al punto anterior»',flush=True)
 print('\n'.join(map(str,[world,lugares,ring_shot])),flush=True)
finally:server.shutdown()
