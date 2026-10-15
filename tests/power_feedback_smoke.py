"""Draw a timed musical path with the real cube; its notes have source-specific focus."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390)]:
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=path-clarity&layout=classic&generation=2&travel=1');page.wait_for_function('!!window.__testRuntime?.givePower');page.evaluate('''()=>{const r=__testRuntime;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);window.__pathNotes=[];r.foregroundNoteCue=n=>__pathNotes.push(n);r.givePower('pincel');}''')
   page.mouse.move(width/2,height/2);page.mouse.down();page.mouse.move(width/2+100,height/2,steps=6);page.wait_for_timeout(1000);page.mouse.up();page.wait_for_function('__testRuntime.ac?.state==="running"');page.wait_for_function('__pathNotes.some(n=>n.source?.startsWith("power:pincel:"))',timeout=15000)
   assert page.evaluate('__testRuntime.accompanimentStage().until')>0;assert page.evaluate('__testRuntime.S.autoPins') is False;assert page.evaluate('()=>{__testRuntime.save();return __testRuntime.S.boxPowers.marks.length;}')>0
   page.screenshot(path=f'/tmp/whitedot-power-path-{width}.png');page.locator('#bMenu').click();before=page.evaluate('__pathNotes.length');page.wait_for_timeout(600);assert page.evaluate('__pathNotes.length')==before
   page.reload();page.wait_for_function('!!window.__testRuntime?.hasPower');assert page.evaluate('__testRuntime.hasPower("pincel")');assert page.evaluate('__testRuntime.S.boxPowers.marks.length')>0;assert not errors,errors
   print('PASS native cube-drawn notes have source onsets/focus, pause in menus and survive reload at '+str(width),flush=True);page.close()
  b.close()
finally:server.shutdown()
