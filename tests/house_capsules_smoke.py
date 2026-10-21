"""House that grows: rooms open by achievements too, the capsule machine asks then gives a prize for sparks, prizes stay after a reload, and the basement workbench opens the Taller and earns its achievement."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.enterHouse&&!!window.__r?.houseCapsuleTap')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   assert 'Taller' in page.locator('#oDeploy').inner_text()
   # Day one, but eight achievements: the Jardín is open, the Azotea is not.
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=false;s.totalDays=0;s.ach={};for(let i=0;i<8;i++)s.ach['old'+i]='2026-10-21';s.sparks=200;s.sparkEconomy.earned=s.sparkEconomy.spent+200;s.house={...s.house,objects:[{kind:'obj:origen',room:'sala',x:.5,y:.4}],unlocked:['sala'],playerRoom:'sala'};r.save();r.enterHouse();}")
   page.wait_for_function('__r.houseSettled()');assert page.evaluate('__r.currentHouse().unlocked')==['sala','jardin']
   # The machine: the first tap asks, the second turns the knob and takes 60 sparks.
   page.evaluate(hide);spot=page.evaluate('__r.houseToScreen(204,505)');page.locator('#w').click(force=True,position=spot);page.wait_for_timeout(150)
   assert page.evaluate('__r.currentHouse().capsules.count')==0;assert page.evaluate('__r.S.sparks')==200
   page.locator('#w').click(force=True,position=spot);page.wait_for_function('__r.currentHouse().capsules.count===1')
   assert page.evaluate('__r.S.sparks')==140;assert page.evaluate('__r.currentHouse().decor.length')==1
   page.evaluate("()=>{const r=__r;r.openHouseCapsule();r.openHouseCapsule();}");state=page.evaluate('__r.currentHouse()');assert state['capsules']['count']==3 and page.evaluate('__r.S.sparks')==20,state
   assert page.evaluate('__r.openHouseCapsule()') is None and page.evaluate('__r.currentHouse().capsules.count')==3,'no sparks, no capsule'
   page.wait_for_function("!!__r.S.ach['house:capsule:1']",timeout=6000)
   # Everything stays after a reload.
   kept=page.evaluate('JSON.stringify({d:__r.S.house.decor,t:__r.S.house.tints,c:__r.S.house.capsules.count})');page.evaluate('__r.exitHouse()');page.reload();page.wait_for_function('!!window.__r?.enterHouse')
   assert page.evaluate('JSON.stringify({d:__r.S.house.decor,t:__r.S.house.tints,c:__r.S.house.capsules.count})')==kept
   # The workbench: walk down to the basement and tap it to open the Taller.
   page.evaluate("()=>{"+hide+";const r=__r;r.S.totalDays=14;r.save();r.enterHouse();}");page.wait_for_function('__r.houseSettled()');page.evaluate("()=>{"+hide+";__r.houseWalkTo('sotano',.87);}");page.wait_for_function("__r.houseStand().room==='sotano'&&__r.houseSettled()",timeout=15000)
   page.screenshot(path=f'/tmp/kubono-house-capsules-{width}.png')
   page.evaluate(hide);bench=page.evaluate('__r.houseToScreen(846,700)');page.locator('#w').click(force=True,position=bench);page.wait_for_function("!document.getElementById('studioPanel').hidden")
   assert page.evaluate('__r.S.house.workbench')==True;page.wait_for_function("!!__r.S.ach['house:workbench']",timeout=6000)
   assert not errors,errors;page.close()
  browser.close()
 print('PASS house that grows on phone and desktop: Jardín by achievements, capsule machine asks then charges 60 sparks, no capsule without sparks, prizes kept after reload, workbench opens the Taller with its achievement',flush=True)
finally:server.shutdown()
