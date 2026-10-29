"""Refugio simple (alpha.234), once the walkable dollhouse: one screen with every room at a glance (closed ones say what
opens them), keys and taps move nothing, the cube wears its pieces and its place is kept after a reload."""
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
   # Refugio simple (alpha.234): one screen. A new player: only Eco is open; the other rooms are silhouettes that say what
   # opens them; arrows and taps move nothing.
   page.evaluate("()=>{"+hide+";const r=__r;r.S.sound=false;r.S.totalDays=0;Object.keys(r.placesData().stars).forEach(id=>r.placesData().stars[id]=[false,false,false]);r.save();r.enterHouse();}");page.wait_for_function('__r.houseSettled()')
   page.evaluate(hide);start=page.evaluate('__r.houseStand()');assert start['overview'],start
   page.locator('#w').focus();page.keyboard.down('ArrowRight');page.wait_for_timeout(1200);page.keyboard.up('ArrowRight');page.keyboard.down('ArrowUp');page.wait_for_timeout(600);page.keyboard.up('ArrowUp')
   stand=page.evaluate('__r.houseStand()');assert stand['fx']==start['fx'] and stand['floor']==start['floor'] and not stand['climbing'],('nothing walks',start,stand)
   # The whole house fits the band between the counters and the panel.
   fit=page.evaluate("""()=>{const r=__r,p=document.getElementById('housePanel').getBoundingClientRect(),rooms=['sala','jardin','azotea','sotano'].map(id=>r.houseRoomRect(id));return {left:Math.min(...rooms.map(q=>q.x)),right:Math.max(...rooms.map(q=>q.x+q.w)),top:Math.min(...rooms.map(q=>q.y)),bottom:Math.max(...rooms.map(q=>q.y+q.h)),panel:p.top,side:p.left>innerWidth/2,W:innerWidth};}""")
   assert fit['left']>=0 and fit['right']<=fit['W'] and fit['top']>=60 and (fit['side'] or fit['bottom']<=fit['panel']),fit
   texts=[t['text'] for t in page.evaluate('__r.houseLayout()')['texts']]
   assert 'ECO' in texts and any(t.startswith('SE ABRE CON') or t=='SE ABRE CON' for t in texts),texts
   # A tap on a closed room explains; the cube stays.
   rect=page.evaluate('__r.houseRoomRect("sotano")');page.locator('#w').click(force=True,position={'x':rect['x']+rect['w']*.5,'y':rect['y']+rect['h']*.5})
   page.wait_for_function("[...document.querySelectorAll('.toast,#toast,[role=status]')].some(e=>/Raíz: se abre con/.test(e.textContent))",timeout=3000)
   assert page.evaluate('__r.houseStand().fx')==start['fx'],'a tap never walks'
   # Every room open: all four at a glance, no overview button, and nothing moves.
   page.evaluate("()=>{const r=__r;r.S.totalDays=14;Object.keys(r.placesData().stars).forEach((id,i)=>r.placesData().stars[id]=i<8?[true,true,true]:[false,false,false]);r.save();r.exitHouse?.();}");page.evaluate("()=>{"+hide+";__r.enterHouse();}");page.wait_for_function('__r.houseSettled()')
   texts=[t['text'] for t in page.evaluate('__r.houseLayout()')['texts']];assert not any(t.startswith('SE ABRE') for t in texts),texts
   assert page.locator('#houseOverview').is_hidden() and page.evaluate("__r.houseStand().overview")
   page.evaluate("__r.houseWalkTo('sotano',.8)");assert page.evaluate('__r.houseStand().room')=='sotano'
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
 print('PASS Refugio on one screen at phone and desktop: whole house in the band, closed rooms say what opens them, keys and taps move nothing, dressed cube, place kept after reload',flush=True)
finally:server.shutdown()
