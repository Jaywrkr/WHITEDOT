"""Visits and closing of the living house: a WH2 code opens another house read-only and counts once, the keyboard uses the capsule machine, the room is told in words, the Bitácora leads to the house and the menu card says what is new."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
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
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.enterHouse&&!!window.__r?.houseGuideTick')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   # A friend's house: an object, three capsule prizes and a colour, shared as WH2.
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=false;s.totalDays=14;s.sparks=300;s.sparkEconomy.earned=s.sparkEconomy.spent+300;s.house={...s.house,objects:[{kind:'obj:origen',room:'sala',x:.5,y:.4}],decor:[],tints:{},playerRoom:'sala'};r.save();r.enterHouse();for(let i=0;i<3;i++)r.openHouseCapsule();}")
   page.wait_for_function('__r.houseSettled()');page.evaluate(hide);page.locator('#houseShare').click();code=page.locator('#houseCode').input_value();assert code.startswith('WH2-'),code
   friend=page.evaluate('JSON.stringify(__r.currentHouse().decor)');page.locator('#houseCodeClose').click()
   # Our own code does not count as a visit.
   page.locator('#houseShare').click();page.locator('#houseVisit').click();assert page.evaluate('Object.keys(__r.S.house.visitedHouses||{}).length')==0;page.locator('#houseExit').click()
   # Back home the house is bare again; the friend's code opens theirs, read-only, and counts once.
   page.evaluate("()=>{const r=__r,s=r.S;s.house.decor=[];s.house.tints={};s.house.capsules={count:0,items:{}};r.save();}")
   mine=page.evaluate('JSON.stringify({o:__r.S.house.objects,d:__r.S.house.decor,t:__r.S.house.tints})');sparks=page.evaluate('__r.S.sparks')
   for _ in range(2):
    page.evaluate("()=>{"+hide+";document.getElementById('mHouseCode').hidden=false;}");page.locator('#houseCode').fill(code);page.locator('#houseVisit').click();page.wait_for_function('__r.houseSettled()')
   assert page.evaluate('__r.houseVisiting()') and page.evaluate('JSON.stringify(__r.currentHouse().decor)')==friend
   assert page.evaluate('Object.keys(__r.S.house.visitedHouses||{}).length')==1;assert page.locator('#housePlace').is_disabled()
   page.evaluate(hide);spot=page.evaluate('__r.houseToScreen(204,505)');page.locator('#w').click(force=True,position=spot);page.locator('#w').click(force=True,position=spot);page.wait_for_timeout(200)
   assert page.evaluate('__r.S.sparks')==sparks,'a visit never spends'
   page.evaluate("__r.houseWalkTo('jardin',.5)");page.wait_for_function("__r.houseStand().room==='jardin'",timeout=8000)
   assert page.evaluate('JSON.stringify({o:__r.S.house.objects,d:__r.S.house.decor,t:__r.S.house.tints})')==mine,'visiting changes nothing at home'
   page.locator('#houseExit').click()
   # Keyboard: walk to the machine, Enter asks, Enter again turns it; the room is told in words.
   page.evaluate("()=>{"+hide+";__r.enterHouse();__r.houseWalkTo('sala',.34);}");page.wait_for_function("__r.houseSettled()&&__r.houseStand().room==='sala'",timeout=8000)
   page.wait_for_function("document.getElementById('houseSummary').textContent.includes('Cerca: máquina de cápsulas')")
   page.evaluate(hide);page.locator('#w').focus();page.keyboard.press('Enter');assert page.evaluate('__r.currentHouse().capsules.count')==0;page.keyboard.press('Enter');page.wait_for_function('__r.currentHouse().capsules.count===1')
   assert page.evaluate("document.getElementById('houseSummary').textContent").startswith('Sala: 1 objeto')
   # The menu card says what is new; the Bitácora leads into the house.
   page.locator('#houseExit').click();page.evaluate("()=>{"+hide+";__r.S.ach['test:nuevo']='2026-10-21';}");page.locator('#bMenu').click();assert page.locator('#bStudio small').inner_text()=='Trofeos nuevos'
   page.evaluate("()=>{"+hide+";__r.openJournal('achievements');}");page.locator('[data-journal-house]').first.click();page.wait_for_function('__r.houseActive()');assert page.locator('#mJournal').is_hidden()
   page.evaluate(hide);page.locator('#houseExit').click();page.locator('#bMenu').click();assert page.locator('#bStudio small').inner_text()!='Trofeos nuevos','seen once you are in'
   assert not errors,errors;page.close()
  browser.close()
 print('PASS house visits and closing on phone and desktop: WH2 visit read-only and kept once, own code not counted, no spending or changes at home, Enter uses the machine, room summary, menu news and Bitácora link',flush=True)
finally:server.shutdown()
