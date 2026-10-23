"""The ring (plan F5): ?anillo=1 opens the free World after the Journey on its own save. Eleven portals around the Refugio; walking into an open one starts its round, a closed one asks for stars, one with ★★ asks Jugar or Maestro; «Dejar la ronda» in the menu and a reload both bring you back beside the portal; the map lists the portals entered for fast travel."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,math
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
def spot(page,id):return next(s for s in page.evaluate('__r.ringState().spots') if s['id']==id)
def walk_in(page,id):
 s=spot(page,id);page.evaluate(f"()=>{{__r.S.wx={s['x']+60};__r.S.wy={s['y']};}}");page.wait_for_timeout(250);page.evaluate(f"()=>{{__r.S.wx={s['x']};__r.S.wy={s['y']};}}")
def near(page,id,limit=200):
 s=spot(page,id);x,y=page.evaluate('[__r.S.wx,__r.S.wy]');return math.hypot(x-s['x'],y-s['y'])<limit
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   base=f'http://127.0.0.1:{server.server_port}/'
   page.goto(base+'?anillo=1');page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   assert page.evaluate('__r.accountClient')==None and not page.evaluate("localStorage.getItem('pixel-blanco-v4')"),'a test save of its own'
   ring=page.evaluate('__r.ringState()');assert len(ring['spots'])==11 and ring['next'],ring
   c=ring['center']
   for s in ring['spots']:assert 5000<math.hypot(s['x']-c['x'],s['y']-c['y'])<8000,s
   # A portal on screen, and the arrow to the nearest one from the centre.
   s=spot(page,'lago');page.evaluate(f"()=>{{__r.S.wx={s['x']};__r.S.wy={s['y']+150};}}");page.wait_for_timeout(500)
   if os.environ.get('RING_SHOT'):page.screenshot(path=os.environ['RING_SHOT'].replace('.png',f'-{width}.png'))
   # Into the Lago: its round starts, and the portal is remembered for fast travel.
   walk_in(page,'lago');page.wait_for_function("__r.places().run?.id==='lago'",timeout=5000)
   assert page.evaluate('__r.S.lugares.seen.lago')==True
   # «Dejar la ronda» shows only during a round and brings you back to the portal.
   page.locator('#bMenu').click();assert page.locator('#bLeavePlace').is_visible();page.locator('#bLeavePlace').click()
   page.wait_for_function("!__r.places().run",timeout=3000);assert near(page,'lago'),'back beside the Lago portal'
   page.wait_for_timeout(400);assert not page.evaluate('__r.places().run'),'standing beside it does not open it again'
   page.locator('#bMenu').click();assert not page.locator('#bLeavePlace').is_visible();page.locator('#mnClose').click()
   # A closed portal asks for stars.
   walk_in(page,'jardin');page.wait_for_timeout(400);assert not page.evaluate('__r.places().run')
   # With ★★, a portal asks Jugar or Maestro.
   page.evaluate("()=>{__r.S.lugares.stars.bosque[1]=true;}");walk_in(page,'bosque');page.wait_for_function("!document.getElementById('mPortal').hidden",timeout=3000)
   assert page.locator('#portalStars .got').count()==2;page.locator('#portalMaestro').click();page.wait_for_function("__r.places().run?.maestro===true&&__r.places().run.id==='bosque'",timeout=5000)
   # A reload in a round drops it and brings you back beside its portal.
   page.wait_for_timeout(300);page.evaluate('__r.save()');page.reload();page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   assert not page.evaluate('__r.places().run') and near(page,'bosque'),'back at the Bosque portal after a reload'
   # The map: portals entered, for fast travel.
   page.evaluate('__r.openMap()');page.wait_for_function("!document.getElementById('ringTravel').hidden",timeout=3000)
   labels=page.locator('#ringTravel button').all_inner_texts();assert any(l.startswith('Lago') for l in labels) and any(l.startswith('Bosque') for l in labels),labels
   page.locator('#ringTravel button',has_text='Lago').click();assert page.evaluate("document.getElementById('mJournal').hidden") and near(page,'lago'),'fast travel to the Lago'
   # The ring follows the Refugio.
   page.evaluate("()=>{__r.S.studio.x=__r.S.wx+20000;__r.S.studio.y=__r.S.wy;}");moved=page.evaluate('__r.ringState().center');assert abs(moved['x']-c['x'])>15000,moved
   assert not errors,errors;page.close()
  browser.close()
 print('PASS places ring on phone and desktop: eleven portals around the Refugio, walking in starts a round, closed ones ask for stars, ★★ asks Jugar or Maestro, leaving and reloading bring you back to the portal, fast travel from the map, the ring follows the Refugio',flush=True)
finally:server.shutdown()
