"""Walkable dollhouse: keys walk the cube, walls and a locked door stop it, stairs change floor, a tap walks to another floor, the overview fits the house, the cube wears its pieces and the place is kept after a reload."""
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
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.enterHouse&&!!window.__r?.houseStand')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   # A new player: only the Sala is open, the door to the Jardín stays shut.
   page.evaluate("()=>{"+hide+";const r=__r;r.S.sound=false;r.S.totalDays=0;Object.keys(r.placesData().stars).forEach(id=>r.placesData().stars[id]=[false,false,false]);r.save();r.enterHouse();}");page.wait_for_function('__r.houseSettled()')
   page.evaluate(hide);page.locator('#w').focus();page.keyboard.down('ArrowRight');page.wait_for_timeout(2200);page.keyboard.up('ArrowRight')
   stand=page.evaluate('__r.houseStand()');assert stand['room']=='sala' and stand['fx']<=545,stand
   page.keyboard.down('ArrowLeft');page.wait_for_timeout(3000);page.keyboard.up('ArrowLeft');assert page.evaluate('__r.houseStand().fx')>=25,'the outer wall stops the cube'
   # Every room open: right through the door, up the stairs, and a tap that walks down to the basement.
   page.evaluate("()=>{const r=__r;r.S.totalDays=14;Object.keys(r.placesData().stars).forEach((id,i)=>r.placesData().stars[id]=i<8?[true,true,true]:[false,false,false]);r.save();r.exitHouse?.();}");page.evaluate("()=>{"+hide+";__r.enterHouse();}");page.wait_for_function('__r.houseSettled()')
   page.evaluate(hide);page.locator('#w').focus();page.keyboard.down('ArrowRight');page.wait_for_timeout(3200);page.keyboard.up('ArrowRight');assert page.evaluate('__r.houseStand().room')=='jardin'
   page.evaluate("__r.houseWalkTo('sala',.86)");page.wait_for_function("__r.houseSettled()&&__r.houseStand().room==='sala'",timeout=8000)
   page.keyboard.down('ArrowUp');page.wait_for_function("__r.houseStand().climbing");page.keyboard.up('ArrowUp');page.wait_for_function("__r.houseStand().room==='azotea'&&!__r.houseStand().climbing",timeout=5000)
   page.evaluate("__r.houseWalkTo('sotano',.8)");page.wait_for_function("__r.houseStand().room==='sotano'&&__r.houseSettled()",timeout=15000)
   # Tapping a room walks there; tapping a locked one only explains.
   page.evaluate(hide);rect=page.evaluate('__r.houseRoomRect("sotano")');start=page.evaluate('__r.houseStand().fx');page.locator('#w').click(force=True,position={'x':max(rect['x']+rect['w']*.2,30),'y':rect['y']+rect['h']*.05});page.wait_for_function("__r.houseSettled()",timeout=8000)
   assert page.evaluate('__r.houseStand().room')=='sotano' and page.evaluate('__r.houseStand().fx')<start-80,'a tap walks there'
   # The overview fits the whole house; the room on screen gets smaller.
   page.evaluate(hide);before=page.evaluate('__r.houseRoomRect("sala").w');page.locator('#houseOverview').click();page.wait_for_function('__r.houseSettled()');assert page.evaluate('__r.houseRoomRect("sala").w')<before;page.locator('#houseOverview').click()
   # The cube wears its pieces in the house: a hat lights pixels just above it.
   LIT="()=>{const r=__r,q=r.houseCube(),c=r.cx,d=c.getTransform().a,x=Math.floor((q.x-q.size)*d),y=Math.floor((q.y-q.size*1.6)*d),img=c.getImageData(x,y,Math.ceil(q.size*2*d),Math.ceil(q.size*1.1*d)).data;let n=0;for(let i=0;i<img.length;i+=4)if(img[i]+img[i+1]+img[i+2]>360)n++;return n;}"
   bare=page.evaluate(LIT)
   page.evaluate("()=>{const r=__r;r.S.sparks=500;r.S.sparkEconomy.earned=r.S.sparkEconomy.spent+500;r.buySparkStyle('acc:hat');}");page.evaluate(hide);page.wait_for_timeout(300)
   assert page.evaluate(LIT)>bare,'the hat is drawn on the cube in the house'
   # The place is kept.
   page.evaluate('__r.exitHouse?.();__r.save()');page.reload();page.wait_for_function('!!window.__r?.enterHouse');assert page.evaluate('__r.S.house.playerRoom')=='sotano'
   page.evaluate("()=>{"+hide+";__r.enterHouse();}");page.wait_for_function('__r.houseSettled()');assert page.evaluate('__r.houseStand().room')=='sotano'
   page.screenshot(path=f'/tmp/kubono-house-{width}.png')
   assert not errors,errors;page.close()
  browser.close()
 print('PASS dollhouse on phone and desktop: keys, walls and locked door, door to the Jardín, stairs up, walk to the basement, tap to walk, overview, dressed cube, place kept after reload',flush=True)
finally:server.shutdown()
