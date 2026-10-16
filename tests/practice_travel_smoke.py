"""Accessible silent jumps, real contrast, progress preservation and reload/return."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  for width,height in [(320,568),(390,844),(844,390)]:
   b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=sonidos&generation=2&layout=vasto');page.wait_for_function('__testRuntime?.inWorld()')
   page.evaluate('''()=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const r=__testRuntime;r.S.cat.held=true;r.S.ach.held=r.S.todayKey;window.__pulses=0;const original=r.sessionAction;window.__point={x:r.S.wx,y:r.S.wy,layer:r.S.layer||'superficie'};}''')
   page.wait_for_function('!document.getElementById("w").inert');page.wait_for_function('!document.getElementById("bJump").hidden')
   before=page.evaluate('__point');old=page.evaluate('__testRuntime.regionOfPos(__point.x,__point.y).genre')
   page.locator('#bJump').tap();page.wait_for_function('__testRuntime.S.practiceTravel.previous!==null&&__testRuntime.MU.dnaA?.genre!=='+repr(old))
   state=page.evaluate('''()=>{const r=__testRuntime,b=document.getElementById('bJump').getBoundingClientRect();return {x:r.S.wx,y:r.S.wy,layer:r.S.layer,previous:r.S.practiceTravel.previous,kept:r.S.cat.held&&r.S.ach.held,overflow:document.documentElement.scrollWidth>innerWidth,button:{x:b.x,y:b.y,width:b.width,height:b.height},waves:r.waves.length};}''')
   assert state['previous']==before and state['kept'] and not state['overflow'],state
   assert state['button']['width']>=44 and state['button']['height']>=44 and state['button']['y']>=0 and state['button']['y']+state['button']['height']<=height,state
   assert state['waves']==0,'jumping UI launched a musical pulse'
   if width==390:page.screenshot(path='/tmp/whitedot-m1-jump-phone.png')
   page.reload();page.wait_for_function('__testRuntime?.inWorld()');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
   current=page.evaluate('({x:__testRuntime.S.wx,y:__testRuntime.S.wy})');assert abs(current['x']-state['x'])<1 and abs(current['y']-state['y'])<1,(state,current)
   page.locator('#bMenu').click();page.locator('#bJumpBack').click();page.wait_for_function('document.getElementById("mMenu").hidden')
   back=page.evaluate('({x:__testRuntime.S.wx,y:__testRuntime.S.wy,layer:__testRuntime.S.layer,kept:__testRuntime.S.cat.held})')
   assert abs(back['x']-before['x'])<1 and abs(back['y']-before['y'])<1 and back['layer']==before['layer'] and back['kept'],back
   assert not errors,errors;page.close();b.close()
  print('PASS three phone sizes: one-touch contrast, visible 44px jump, silent UI, saved progress, exact reloaded location and menu return',flush=True)
finally:server.shutdown()
