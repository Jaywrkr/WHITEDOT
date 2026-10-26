"""The explicit cube gesture emits on down, empty-space gestures stay disambiguated."""
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
   p=b.new_page(viewport=size);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?capitulo=llanura');p.wait_for_function('!!window.__r?.sonar')
   p.evaluate("()=>{__r.S.sound=false;__r.fingerTouch=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}")
   p.mouse.move(size['width']/2,size['height']/2);p.mouse.down();p.wait_for_timeout(230)
   assert p.evaluate('__inputs.length')==1,'explicit pulse already dispatched while finger remains down'
   assert p.evaluate('__inputs[0].at-__inputs[0].touch')<40
   p.mouse.up();assert p.evaluate('__inputs.length')==1,'release never emits twice'
   p.wait_for_timeout(300);p.mouse.move(size['width']*.75,size['height']*.55);p.mouse.down();p.wait_for_timeout(100)
   assert p.evaluate('__inputs.length')==1,'empty-space intent waits'
   p.mouse.move(size['width']*.85,size['height']*.55,steps=5);p.wait_for_timeout(200);p.mouse.up();assert p.evaluate('__inputs.length')==1,'drag never emits pulse'
   p.wait_for_timeout(300);p.mouse.move(size['width']*.75,size['height']*.55);p.mouse.down();p.wait_for_timeout(600)
   assert p.evaluate('__r.scanning'),'hold outside cube opens scanner';p.mouse.up()
   assert p.evaluate('__inputs.length')==1
   p.evaluate("""()=>{const el=document.createElement('span');document.body.append(el);const o={bubbles:true,pointerId:77,isPrimary:true,clientX:100,clientY:200};el.dispatchEvent(new PointerEvent('pointerdown',o));document.getElementById('w').dispatchEvent(new PointerEvent('pointerdown',{...o,pointerId:78,isPrimary:false}));window.dispatchEvent(new PointerEvent('pointerup',o));el.remove();}""")
   assert p.evaluate('__inputs.length')==1,'secondary canvas finger never changes overlay gesture intent'
   assert not errors,errors;p.close()
  b.close()
 print('PASS explicit cube emits on down under40ms, no duplicate release, blank drag/hold preserve movement/scanner',flush=True)
finally:srv.shutdown();srv.server_close()
