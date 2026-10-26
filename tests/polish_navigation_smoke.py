"""Find the next place, scroll by keyboard and explicitly leave the finale."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for w,h in [(320,568),(390,844),(844,390),(1280,800)]:
   p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.openLugares')
   p.evaluate("()=>{__r.S.sound=false;__r.stopAutopilot?.();document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);__r.openLugares();}")
   p.wait_for_function("()=>{const l=document.getElementById('lugaresList'),t=l.querySelector('[aria-current=step]');return t&&t.getBoundingClientRect().top>=l.getBoundingClientRect().top-1&&t.getBoundingClientRect().bottom<=l.getBoundingClientRect().bottom+1;}")
   assert p.locator('#lugaresList [aria-current=step] .lugar-name').inner_text()=='Jardín'
   assert p.locator('#lugaresList').get_attribute('tabindex')=='0'
   pos=p.evaluate('[__r.S.wx,__r.S.wy]');p.locator('#lugaresList').focus();p.keyboard.press('ArrowDown');p.wait_for_timeout(180)
   assert pos==p.evaluate('[__r.S.wx,__r.S.wy]'),'list navigation never walks the cube'
   p.locator('#lugaresList').evaluate('e=>e.scrollTop=e.scrollHeight');p.wait_for_function('document.getElementById("lugaresScrollHint").hidden')
   p.locator('#mLugares header button').click();assert p.locator('#mLugares').is_hidden()
   p.evaluate("()=>{__r.S.journey.finished=false;__r.S.journey.notes={llanura:[60,62,64]};__r.journeyFinale();}")
   p.wait_for_function('!document.getElementById("journeySkip").disabled')
   p.locator('#journeyFinale canvas').click(position={'x':20,'y':20});assert p.evaluate('__r.journeyFinaleState().running'),'background never skips'
   rect=p.locator('#journeySkip').bounding_box();assert rect['x']>=0 and rect['y']>=0 and rect['x']+rect['width']<=w+1 and rect['y']+rect['height']<=h+1,rect
   p.locator('#journeySkip').click();p.wait_for_function('!__r.journeyFinaleState().running')
   assert p.evaluate('__r.inWorld()&&!__r.houseActive()&&__r.S.journey.finished')
   assert not errors,errors;p.close()
  b.close()
 print('PASS next-place visibility, keyboard scrolling, consistent close and explicit finale exit at four sizes')
finally:srv.shutdown();srv.server_close()
