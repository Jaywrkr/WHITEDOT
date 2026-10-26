"""Real result cards never imply an unearned threshold or wrap the clock early."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for w,h in [(390,844),(844,390),(1280,800)]:
   p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?lugar=lago');p.wait_for_function('__r?.placeRun()?.id==="lago"')
   p.evaluate('''()=>{const r=__r;document.querySelectorAll('.modal').forEach(e=>e.hidden=true);r.S.sound=true;r.S.lugares.stars.lago=[true,false,false];for(let i=0;i<500;i++)r.placeHear('lago',i<373,{});const real=Date.now,now=real();r.S.lugares.run.startedAt=now-59999;Date.now=()=>now;try{if(!r.placeFinish('lago'))throw Error('Round did not commit');}finally{Date.now=real;}}''')
   p.wait_for_function('!document.getElementById("mPlace").hidden')
   assert '74,6 % / 75 % a tiempo' in p.inner_text('#placeRows')
   assert not p.evaluate('__r.places().last.stars[1]')
   assert p.inner_text('#placeEarned').startswith('0:59 ·'),p.inner_text('#placeEarned')
   assert p.locator('#mPlace .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2')
   p.locator('#placeAgain').click();p.wait_for_function('__r.placeRun()?.id==="lago"')
   p.evaluate("()=>{for(let i=0;i<4;i++)__r.placeHear('lago',i<3,{});__r.placeFinish('lago');}")
   p.wait_for_function('!document.getElementById("mPlace").hidden')
   assert '75 % / 75 % a tiempo' in p.inner_text('#placeRows') and p.evaluate('__r.places().last.stars[1]')
   assert not errors,errors;p.close()
  b.close()
 print('PASS result threshold, earned stars and minute boundary on mobile/landscape/desktop')
finally:srv.shutdown();srv.server_close()
