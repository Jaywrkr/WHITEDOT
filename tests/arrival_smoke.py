"""Real main-save launches differ; resume, share addresses and exact return stay safe."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.dailyArrival')
  old=page.evaluate("""()=>{const r=__r;document.querySelectorAll('.modal').forEach(e=>e.hidden=true);r.S.help.mundo=true;r.S.help.camino=true;r.S.todayLight=1;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:path:'+i);r.S.mode='world';r.S.lastWorldDay=r.S.todayKey;r.S.ach.arrival_test='earned';r.S.arrivalMode='discover';r.save();return {x:r.S.wx,y:r.S.wy,layer:r.S.layer||'superficie'};}""")
  page.reload();page.wait_for_function('!!window.__r?.dailyArrival')
  assert page.evaluate('__r.S.practiceTravel.previous')==old
  at=page.evaluate('({x:__r.S.wx,y:__r.S.wy,layer:__r.S.layer})');assert at!=old
  assert page.evaluate('__r.S.ach.arrival_test')=='earned'
  assert 'addr=' not in page.url,'automatic arrival must not turn the next launch into an explicit destination'
  page.evaluate("document.dispatchEvent(new Event('visibilitychange'))");assert page.evaluate('({x:__r.S.wx,y:__r.S.wy,layer:__r.S.layer})')==at
  page.reload();page.wait_for_function('!!window.__r?.dailyArrival');assert page.evaluate('__r.S.practiceTravel.arrivals')==2
  assert page.evaluate('__r.returnPracticePlace()');assert page.evaluate('({x:__r.S.wx,y:__r.S.wy,layer:__r.S.layer})')==at
  # WD1 links intentionally encode whole pixels; return itself retains exact floats.
  page.reload();page.wait_for_function('!!window.__r?.dailyArrival')
  after=page.evaluate('({x:__r.S.wx,y:__r.S.wy,layer:__r.S.layer})')
  assert abs(after['x']-at['x'])<=.5
  assert abs(after['y']-at['y'])<=.5 and after['layer']==at['layer']
  assert page.evaluate('__r.S.practiceTravel.arrivals')==2,'explicit link does not trigger another arrival'
  assert not errors,errors
  print('PASS native arrivals, silent resume, coordinate return, persisted rewards and addressed reload');browser.close()
finally:server.shutdown()
