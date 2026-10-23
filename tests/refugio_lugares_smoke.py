"""The Refugio as the centre (plan F6): in your own Refugio, the Sala shows LUGARES · ★ N / 33 and a shelf of eleven trophies; touching one says its place and stars, touching the wall or «★ N / 33» in the house bar opens Lugares with every place, what it asks and «Ir» to the ones entered; «Ir» and «Salir al anillo» leave the Refugio for the World."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,math
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   page.evaluate("()=>{__r.S.lugares.stars.lago=[true,true,false];__r.S.lugares.seen.lago=true;__r.landHouse();}")
   page.wait_for_function("__r.houseActive()&&!__r.houseLanding()&&__r.houseLugaresState().hits.length===12",timeout=10000)
   assert page.locator('#houseStars').is_visible() and page.inner_text('#houseStars')=='★ 6 / 33',page.inner_text('#houseStars')
   if os.environ.get('REFUGIO_SHOT'):page.screenshot(path=os.environ['REFUGIO_SHOT'].replace('.png',f'-{width}.png'))
   # A trophy: its place and stars.
   hit=next(h for h in page.evaluate('__r.houseLugaresState().hits') if h.get('id')=='lago')
   page.mouse.click(hit['x']+hit['w']/2,hit['y']+hit['h']/2);page.wait_for_function("__r.houseLugaresState().last==='lago'",timeout=3000)
   page.wait_for_function("document.getElementById('toast').textContent.startsWith('Lago ★★☆')",timeout=10000)
   # The wall opens Lugares.
   wall=next(h for h in page.evaluate('__r.houseLugaresState().hits') if h.get('open'))
   page.mouse.click(wall['x']+20,wall['y']+wall['h']/2);page.wait_for_function("!document.getElementById('mLugares').hidden",timeout=3000)
   rows=page.locator('#lugaresList li');assert rows.count()==11
   assert 'Dunas se abre con 8 ★. Faltan 2.' in page.inner_text('#lugaresNext')
   assert page.locator('#lugaresList button').count()==1,'Ir only to the places already entered'
   page.locator('#lugaresClose').click();assert page.evaluate("document.getElementById('mLugares').hidden")
   # The house bar opens it too; «Ir» leaves the Refugio beside the Lago's portal.
   page.locator('#houseStars').click();page.wait_for_function("!document.getElementById('mLugares').hidden",timeout=3000)
   page.locator('#lugaresList button',has_text='Ir').click()
   page.wait_for_function("!__r.houseActive()&&__r.S.mode==='world'",timeout=5000)
   s=next(q for q in page.evaluate('__r.ringState().spots') if q['id']=='lago');x,y=page.evaluate('[__r.S.wx,__r.S.wy]');assert math.hypot(x-s['x'],y-s['y'])<200,'beside the Lago portal'
   # «Salir al anillo»: out to the World.
   page.evaluate('__r.landHouse()');page.wait_for_function("__r.houseActive()",timeout=5000);page.evaluate('__r.openLugares()');page.locator('#lugaresDoor').click()
   page.wait_for_function("!__r.houseActive()&&__r.S.mode==='world'",timeout=5000)
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Refugio as the centre on phone and desktop: ★ N / 33 on the wall and in the house bar, a shelf of eleven trophies that answer when touched, Lugares with what each place asks and «Ir» to the ones entered, and the door to the ring',flush=True)
finally:server.shutdown()
