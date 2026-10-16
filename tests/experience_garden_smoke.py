"""Build, move, save and reopen a card garden without consuming discoveries."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=garden-proof&layout=classic&generation=2&travel=1');page.wait_for_function('!!window.__testRuntime?.gardenState');page.evaluate('''()=>{const r=__testRuntime;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.sound=false;r.collectRareCard('fossil',{id:'garden:found',x:r.S.wx,y:r.S.wy},{forced:true,context:{role:'perc',instrument:'handslap'}});r.openJournal('rares');}''')
  page.locator('[data-garden-add]').first.click();assert page.evaluate('__testRuntime.gardenState.cards.length')==1;assert page.evaluate('__testRuntime.rareCards.length')==1
  page.locator('#journalClose').click();page.evaluate('__testRuntime.rareCardTick(0)');
  while page.locator('#rareNotice').is_visible():
   page.locator('#rareNoticeContinue').click();page.evaluate('__testRuntime.rareCardTick(0)')
  page.locator('#bMenu').click();page.locator('#bStudio').click();assert page.locator('#housePanel').is_visible()
  point=page.evaluate('''()=>{const r=__testRuntime,o=r.gardenObjects(r.currentHouse())[0],rect=r.houseRoomRect(o.room);r.houseAudioCue=n=>window.__gardenNote=n;r.S.sound=true;return {x:rect.x+o.x*rect.size,y:rect.y+o.y*rect.size,rect};}''')
  page.mouse.move(point['x'],point['y']);page.mouse.down();page.mouse.move(point['x']+25,point['y']+10,steps=6);page.mouse.up();page.wait_for_function('window.__gardenNote?.kind.startsWith("garden:")');assert page.evaluate('__testRuntime.gardenState.positions[__testRuntime.gardenState.cards[0]].x')>.22
  page.locator('#houseGardenTools summary').click();page.locator('#gardenSave').click();assert page.evaluate('__testRuntime.gardenState.sets.length')==1;page.reload();page.wait_for_function('!!window.__testRuntime?.gardenState');assert page.evaluate('__testRuntime.gardenState.cards.length')==1;assert page.evaluate('__testRuntime.rareCards.length')==1;assert page.evaluate('__testRuntime.gardenState.sets.length')==1
  page.evaluate('''()=>{const r=__testRuntime;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.sound=false;for(const [i,role]of ['bajo','acorde'].entries())r.collectRareCard('relic:ordinary',{id:'garden:parent:'+i,x:r.S.wx+i+1,y:r.S.wy},{forced:true,context:{role}});r.openJournal('rares');}''')
  page.locator('[data-garden-add="1"]').click();page.locator('[data-garden-add="2"]').click();page.locator('#journalClose').click();page.evaluate('__testRuntime.rareCardTick(0)');
  while page.locator('#rareNotice').is_visible():
   page.locator('#rareNoticeContinue').click();page.evaluate('__testRuntime.rareCardTick(0)')
  page.locator('#bMenu').click();page.locator('#bStudio').click();page.locator('#houseGardenTools summary').click();page.locator('#gardenSave').click();page.wait_for_function('__testRuntime.gardenObjects(__testRuntime.currentHouse()).some(o=>o.gardenSeed)');assert page.evaluate('__testRuntime.S.pet||null') is None
  room=page.evaluate('__testRuntime.houseRoomRect("sala")');page.locator('#w').click(position={'x':room['x']+room['size']*.8,'y':room['y']+room['size']*.8});page.wait_for_function('(()=>{const r=__testRuntime,h=r.currentHouse(),o=r.gardenObjects(h).find(o=>o.gardenSeed);return o&&Math.abs(o.x-(h.x-.15))<.025;})()')
  assert not errors,errors;print('PASS card-to-house garden, actual audible gesture, direct movement, saved independent set and preserved collection');b.close()
finally:server.shutdown()
