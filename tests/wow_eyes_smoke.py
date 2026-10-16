"""Regression: real inhabitants and animation keep rendering on static hosting."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, threading
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
 with sync_playwright() as pw:
  browser = pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'), args=['--no-sandbox'])
  page = browser.new_page(viewport={'width':390,'height':844})
  errors, sessions = [], []
  page.on('pageerror', lambda e: errors.append(str(e)))
  page.on('response', lambda r: sessions.append(r.status) if r.url.endswith('/api/session') else None)
  page.route('**/src/main.js', lambda route: route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;', content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2')
  page.wait_for_function('!!window.__r?.labMode')
  page.evaluate("""async()=>{
   const r=__r,{inhabitantPractice}=await import('/src/pixel-life-model.js');
   r.S.sound=false;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
   r.labGo('rhythm:fossil');document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
   const p=inhabitantPractice(r);r.S.wx=p.x;r.S.wy=p.y-50;r.inhabitantTick(.02);
   window.eyeDraws=0;const fill=r.cx.fillRect.bind(r.cx);
   r.cx.fillRect=(x,y,w,h)=>{if(w===1.4&&h===1.4)window.eyeDraws++;return fill(x,y,w,h);};
  }""")
  page.wait_for_function('eyeDraws>4')
  before=page.evaluate('({eyes:eyeDraws,time:__r.wowState.seconds})')
  page.wait_for_function('(eyeDraws>'+str(before['eyes'])+'+10)&&(__r.wowState.seconds>'+str(before['time'])+'+.3)')
  assert page.evaluate('__r.inhabitantsNear(130).length')>0
  assert 404 in sessions, sessions
  assert page.locator('#bConnection').is_hidden()
  assert not errors, errors
  browser.close()
 print('PASS real inhabitant eyes and successive animation frames despite independent /api/session 404')
finally:
 server.shutdown();server.server_close()
