"""T3 «la carga» (decision 4 of Jay): a box gives one power and no surprise. At phone, landscape and desktop sizes no
box (natural or gifted, of every power) gives a surprise, none can be given, the surprise HUD (its id kept) never shows,
and a save with a surprise active loads fine: it simply ends, the cube stays a small cube and the save keeps its data."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal').forEach(m=>m.hidden=true)"
WORLD="()=>{const r=__r;"+HIDE+";r.S.mode='world';r.S.todayLight=1;r.S.sound=false;r.hud();}"
OLD={'version':1,'remaining':{'pequeno':12000,'salto':8000},'elapsed':{'pequeno':400},'returnPoint':{'x':5,'y':6,'layer':'superficie'},'unknown':'keep'}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height})
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=sorpresas-{width}');page.wait_for_function('!!window.__r?.giveSurprise&&!!window.__r?.spawnBox')
   page.evaluate(WORLD)
   # Nothing can be given; the HUD never shows.
   assert page.evaluate("()=>['pequeno','redondo','lento','salto','grande','prisma'].every(id=>__r.giveSurprise(id)===false)")
   page.wait_for_timeout(200);assert page.locator('#surpriseHud').is_hidden();assert page.evaluate('__r.surpriseStyle.scale')==1 and page.evaluate('__r.surpriseStyle.shape')=='cube'
   # Every power's box opens with its power only.
   for power in ['campo','cometa','brujula','iman','pincel','companero']:
    page.evaluate("(power)=>{const r=__r;"+HIDE+";r.clearPowers?.();r.spawnBox(r.S.wx,r.S.wy,power);}",power)
    page.wait_for_function("(power)=>__r.hasPower(power)",arg=power,timeout=8000)
    assert page.evaluate('__r.surpriseState.ids.length')==0,power
    page.wait_for_timeout(150);assert page.locator('#surpriseHud').is_hidden(),power
    if page.locator('#celebration').is_visible():
     assert page.locator('#celebrationSurpriseName').inner_text().strip()=='',power
     page.locator('#celebrationDismiss').click();page.wait_for_function("document.getElementById('celebration').hidden",timeout=5000)
   # A save with a surprise active (from before T3) loads fine: it ends, the cube is a cube, the save keeps it.
   page.evaluate("(old)=>{const r=__r;r.clearPowers?.();r.S.boxSurprises=old;r.save();}",OLD);page.reload()
   page.wait_for_function('!!window.__r?.giveSurprise');page.evaluate(WORLD);page.wait_for_timeout(300)
   assert page.locator('#surpriseHud').is_hidden();assert page.evaluate('__r.surpriseState.ids.length')==0
   assert page.evaluate('__r.surpriseStyle.scale')==1 and page.evaluate('__r.surpriseStyle.shape')=='cube'
   kept=page.evaluate('__r.snapshotBoxSurprises()');assert kept['remaining']==OLD['remaining'] and kept['returnPoint']==OLD['returnPoint'] and kept['unknown']=='keep',kept
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   print(f'PASS no box surprise at {width}: six powers, one each, the HUD hidden, an old active surprise ends and stays in the save',flush=True)
  browser.close()
finally:server.shutdown()
