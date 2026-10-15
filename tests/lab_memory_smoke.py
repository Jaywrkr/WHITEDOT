"""New place codes restore live/classic character without replacing world identity or progress."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=lab-memory&generation=2&layout=wide&travel=1');page.wait_for_function('window.__testRuntime?.inWorld()');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  saved=page.evaluate('''()=>{const r=__testRuntime;r.S.livingMusic=false;r.S.cat.held=true;const point=r.addFavorite('Recuerdo grave'),legacy={...point,address:{...point.address,musicMode:'classic'},musicStamp:{...point.musicStamp,mode:'classic'}};return {code:r.encodeFavorite(legacy),address:legacy.address,stamp:legacy.musicStamp};}''')
  assert saved['stamp']['version']==2 and saved['stamp']['mode']=='classic';assert saved['address']['musicMode']=='classic'
  page.evaluate('__testRuntime.S.livingMusic=true;__testRuntime.save()')
  page.evaluate('''async code=>{const {decodePlace}=await import('/src/share-tools.js');__testRuntime.visitWorldAddress(decodePlace(code).address);}''',saved['code'])
  page.wait_for_function('window.__testRuntime?.S.livingMusic===false&&__testRuntime.S.cat.held')
  assert page.evaluate('__testRuntime.S.wx')==round(saved['address']['x'])
  page.locator('#bMenu').click();page.locator('#bMusicSettings').click();assert page.locator('#bLivingMusic').is_hidden()
  page.locator('#muClose').click();page.locator('#w').click(position={'x':30,'y':300});page.wait_for_function('__testRuntime.MU.radio?.labScore?.electronic')
  assert not errors,errors;print('PASS legacy music addresses retain coordinates and progress while production uses one electronic foundation',flush=True);b.close()
finally:server.shutdown()
