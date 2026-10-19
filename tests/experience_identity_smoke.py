"""Preserve a figure made from actual played sources, export and return address."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=identity-proof&layout=classic&generation=2&travel=1');page.wait_for_function('!!window.__testRuntime?.constellationBook');page.evaluate('''()=>{const r=__testRuntime;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.audio();r.S.sound=true;r.beginSession();let o;for(let i=0;i<15&&!o;i++){r.S.wx=(i+.5)*r.WCH;r.S.wy=r.WCH/2;o=r.livingNear(750)[0];}if(!o)throw Error('No native source');r.S.wx=o.x;r.S.wy=o.y;r.livingInteract(o);}''')
  page.wait_for_function('__testRuntime.S.session.constellation?.length>0');page.evaluate('__testRuntime.openJournal("music")');page.locator('[data-constellation-save]').click();assert page.evaluate('__testRuntime.constellationBook.items.length')==1
  memory=page.evaluate('__testRuntime.constellationBook.items[0]');assert memory['points'] and isinstance(memory['address']['x'],(int,float))
  page.locator('.musical-constellation summary').click();page.locator('[data-constellation-image]').click();page.wait_for_function('document.getElementById("shareImg").naturalWidth===1080');assert page.locator('#mShare').is_visible();page.locator('#sClose').click();page.reload();page.wait_for_function('!!window.__testRuntime?.constellationBook');assert page.evaluate('__testRuntime.constellationBook.items.length')==1
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.S.wx+=500;__testRuntime.openJournal("music")');page.locator('.musical-constellation summary').click()
  with page.expect_navigation(wait_until='domcontentloaded'):page.locator('[data-constellation-return]').click()
  page.wait_for_function('!!window.__testRuntime?.constellationBook');address=page.evaluate('({x:__testRuntime.S.wx,y:__testRuntime.S.wy,layer:__testRuntime.S.layer||"superficie"})');assert abs(address['x']-memory['address']['x'])<1 and abs(address['y']-memory['address']['y'])<1 and address['layer']==memory['address']['layer'],address
  assert not errors,errors;print('PASS actual played-source figure, independent memory, 1080px Geist export and exact saved return address');b.close()
finally:server.shutdown()
