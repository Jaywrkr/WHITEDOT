"""Native instrument destination, real cube contact, audible onset and preserved collection."""
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
  for width,height in [(390,844),(844,390),(1280,800)]:
   browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:(errors.append(str(e)),print(str(e),flush=True)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.set_viewport_size({'width':width,'height':height});page.emulate_media(reduced_motion='no-preference');page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=micro-{width}&travel=1')
   page.wait_for_function('!!window.__r?.microNear');page.evaluate("()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.todayLight=1;r.S.mode='world';r.S.help.mundo=true;r.hud();window.__notes=[];r.microVoiceCue=n=>__notes.push(n);}")
   page.locator('#bStyles').click();page.locator('#musicTravelMicro').click();page.wait_for_function('document.getElementById("mMusicTravel").hidden',timeout=45000)
   assert page.evaluate('__r.microNear(150).length')>0
   page.evaluate("()=>{const r=__r;r.S.sound=true;r.audio();window.__source=r.microNear(150)[0];r.S.wx=__source.x-45;r.S.wy=__source.y;r.stopAutopilot?.();}");page.wait_for_timeout(180)
   page.evaluate('__r.S.wx=__source.x;__r.S.wy=__source.y');page.wait_for_function('__notes.length>0',timeout=15000)
   # The collection is written a moment after the first note sounds: wait for it rather than read it at once.
   page.wait_for_function("Object.keys(__r.S.elementBook.found).some(k=>k.startsWith('micro:'))",timeout=5000)
   assert page.evaluate('__notes.every(n=>Number.isFinite(n.note)&&n.note>=30&&n.note<=81)')
   page.screenshot(path=f'/tmp/whitedot-micro-{width}.png')
   page.locator('#bMenu').click();page.wait_for_timeout(250);count=page.evaluate('__notes.length');page.wait_for_timeout(350);assert page.evaluate('__notes.length')==count,'menus cannot keep triggering the held instrument'
   page.locator('#mnClose').click();page.evaluate('__r.S.sound=false;__r.save()');found=page.evaluate('Object.keys(__r.S.elementBook.found).filter(k=>k.startsWith("micro:"))');page.evaluate('async()=>{await __r.ac?.close()}');page.reload();page.wait_for_function('!!window.__r?.microNear');assert page.evaluate('Object.keys(__r.S.elementBook.found).filter(k=>k.startsWith("micro:"))')==found
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;print(f'PASS native destination, cube contact/audio, collection, modal pause, persistence at {width}',flush=True);browser.close()
finally:server.shutdown()
