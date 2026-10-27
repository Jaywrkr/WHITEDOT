"""The explicit cube gesture emits on down. Since panel 11 (Q6, D11-B) empty space in the free World does too; in a Journey
chapter and a place's round (panel 10, P6, D2-A) a touch anywhere on the canvas is the pulse, on down, and a drag
still walks."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
 def do_GET(self):
  if self.path=='/src/main.js':
   s=(ROOT/'src/main.js').read_text()+'''\nwindow.__r=runtime;window.__inputs=[];window.__scans=0;const cv=document.getElementById('w');cv.addEventListener('pointerdown',()=>window.__down=performance.now());'''
   self.send_response(200);self.send_header('Content-Type','text/javascript');self.end_headers();self.wfile.write(s.encode());return
  if self.path=='/src/interactions.js':
   s=(ROOT/'src/interactions.js').read_text().replace("function sonar(origin='player',atMs=null){","function sonar(origin='player',atMs=null){window.__inputs?.push({at:performance.now(),touch:atMs});")
   self.send_response(200);self.send_header('Content-Type','text/javascript');self.end_headers();self.wfile.write(s.encode());return
  super().do_GET()
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for size in [{'width':390,'height':844},{'width':1280,'height':800}]:
   # The free World (the ring, the Journey finished): the cube on down, empty space waits for the release.
   p=b.new_page(viewport=size);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.sonar&&__r.inWorld()&&__r.S.journey?.finished===true',timeout=20000)
   p.evaluate("()=>{__r.S.sound=false;__r.fingerTouch=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}");p.wait_for_timeout(300)
   p.mouse.move(size['width']/2,size['height']/2);p.mouse.down();p.wait_for_timeout(230)
   assert p.evaluate('__inputs.length')==1,'explicit pulse already dispatched while finger remains down'
   assert p.evaluate('__inputs[0].at-__inputs[0].touch')<40
   p.mouse.up();assert p.evaluate('__inputs.length')==1,'release never emits twice'
   # Panel 11 (Q6, D11-B): one gesture in the whole game. Empty space in the open Universe pulses on down too; a drag
   # walks after that one pulse, a still finger opens the scanner at 500 ms, and the release never adds a pulse.
   p.wait_for_timeout(300);p.mouse.move(size['width']*.75,size['height']*.55);p.mouse.down();p.wait_for_timeout(100)
   assert p.evaluate('__inputs.length')==2,'empty space pulses on down'
   assert p.evaluate('__inputs[1].at-__inputs[1].touch')<40
   x0=p.evaluate('__r.S.wx');p.mouse.move(size['width']*.85,size['height']*.55,steps=5);p.wait_for_timeout(200);p.mouse.up();assert p.evaluate('__inputs.length')==2,'drag never emits a second pulse'
   assert p.evaluate('__r.S.wx')!=x0,'the drag walks'
   p.wait_for_timeout(300);p.mouse.move(size['width']*.75,size['height']*.55);p.mouse.down();p.wait_for_timeout(600)
   assert p.evaluate('__r.scanning'),'hold outside cube opens scanner';p.mouse.up()
   assert p.evaluate('__inputs.length')==3,'the held touch pulsed once, on down'
   p.wait_for_timeout(300);p.mouse.click(size['width']*.75,size['height']*.55);assert p.evaluate('__inputs.length')==4,'a blank tap pulses once'
   assert not errors,errors;p.close()
   # A Journey chapter: anywhere on the canvas, on down; a drag walks; a hold still opens the scanner.
   p=b.new_page(viewport=size);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?capitulo=llanura');p.wait_for_function('!!window.__r?.sonar&&__r.inWorld()&&__r.journeyQuiet()',timeout=20000)
   p.evaluate("()=>{__r.S.sound=false;__r.fingerTouch=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}");p.wait_for_timeout(300)
   p.mouse.move(size['width']/2,size['height']/2);p.mouse.down();p.wait_for_timeout(230)
   assert p.evaluate('__inputs.length')==1,'the cube on down';assert p.evaluate('__inputs[0].at-__inputs[0].touch')<40
   p.mouse.up();assert p.evaluate('__inputs.length')==1,'release never emits twice'
   p.wait_for_timeout(300);p.mouse.move(size['width']*.75,size['height']*.55);p.mouse.down();p.wait_for_timeout(30)
   assert p.evaluate('__inputs.length')==2,'empty space on down too';assert p.evaluate('__inputs[1].at-__down')<15,'within 15 ms of the finger'
   x0=p.evaluate('__r.S.wx');p.mouse.move(size['width']*.95,size['height']*.55,steps=8);p.wait_for_timeout(500);p.mouse.up()
   assert p.evaluate('__inputs.length')==2,'a drag adds no pulse';assert p.evaluate('__r.S.wx')>x0+10,('the drag walks',x0,p.evaluate('__r.S.wx'))
   p.wait_for_timeout(300);p.mouse.move(size['width']*.25,size['height']*.4);p.mouse.down();p.wait_for_timeout(600)
   assert p.evaluate('__r.scanning'),'a resting finger still opens the scanner';p.mouse.up();assert p.evaluate('__inputs.length')==3,'its pulse sounded on down, once'
   p.evaluate("""()=>{const el=document.createElement('span');document.body.append(el);const o={bubbles:true,pointerId:77,isPrimary:true,clientX:100,clientY:200};el.dispatchEvent(new PointerEvent('pointerdown',o));document.getElementById('w').dispatchEvent(new PointerEvent('pointerdown',{...o,pointerId:78,isPrimary:false}));window.dispatchEvent(new PointerEvent('pointerup',o));el.remove();}""")
   assert p.evaluate('__inputs.length')==3,'a secondary finger or an overlay never pulses'
   # Opening a control while a pointer rests never leaves a delayed scanner or pulse.
   p.mouse.move(size['width']*.75,size['height']*.55);p.mouse.down();p.locator('#bMenu').focus();p.wait_for_timeout(550);p.mouse.up()
   assert p.evaluate('!__r.scanning&&!__r.ptr&&__inputs.length===4')
   p.locator('#w').focus();p.keyboard.down('ArrowRight');assert p.evaluate('__r.keys.arrowright===1')
   p.evaluate("window.dispatchEvent(new Event('blur'))")
   assert p.evaluate('!__r.keys.arrowright&&!__r.ptr&&!__r.tapStart');p.keyboard.up('ArrowRight')
   # A cancelled pointer has no release action; the next gesture remains usable.
   p.evaluate("()=>{const cv=document.getElementById('w'),o={bubbles:true,pointerId:99,isPrimary:true,clientX:30,clientY:200};cv.dispatchEvent(new PointerEvent('pointerdown',o));window.dispatchEvent(new PointerEvent('pointercancel',o));window.dispatchEvent(new PointerEvent('pointerup',o));}")
   assert p.evaluate('__inputs.length')==5,'its pulse sounded on down; the cancel adds nothing'
   p.wait_for_timeout(300);p.mouse.click(size['width']/2,size['height']/2);assert p.evaluate('__inputs.length')==6
   assert not errors,errors;p.close()
  b.close()
 print('PASS explicit cube emits on down under 40 ms, no duplicate release; free World blank touch pulses on down (Q6, D11-B), drag walks and hold opens the scanner; in a chapter a blank touch pulses on down within 15 ms, a drag walks and a hold opens the scanner (P6, D2-A)',flush=True)
finally:srv.shutdown();srv.server_close()
