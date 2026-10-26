"""Garden edits commit atomically; a failed write never consumes discoveries."""
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
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  # Panel 10 (P8): the Refugio's Jardín opens with six places (or nine ★), not with days played.
  p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.gardenState')
  p.evaluate("()=>{const r=__r;r.S.sound=false;r.S.totalDays=4;Object.keys(r.placesData().stars).forEach((id,i)=>{if(i<6)r.placesData().stars[id][0]=true;});document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);for(let i=0;i<5;i++)r.collectRareCard('fossil',{id:'e5:'+i,x:r.S.wx+i,y:r.S.wy},{forced:true});r.gardenState.extra={kept:true};r.openJournal('rares');}")
  p.locator('[data-garden-add="0"]').click();assert p.evaluate('__r.gardenState.cards.length')==1
  assert p.locator('[data-garden-add="0"]').is_disabled();assert '1 / 4' in p.inner_text('#gardenSelectionCount')
  p.evaluate("()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===__r.saveStore.key)throw Error('quota');return originalSet.call(this,k,v);};}")
  p.locator('[data-garden-add="1"]').click();assert p.evaluate('__r.gardenState.cards.length')==1
  assert p.locator('[data-garden-add="1"]').is_enabled() and p.evaluate('__r.rareCards.length')==5
  p.evaluate("()=>{Storage.prototype.setItem=originalSet;__r.gardenState.sets=[{name:'Otra voz',cards:[__r.rareCards[1].id],positions:{}}];__r.save();}")
  p.locator('[data-journal-house]').click();p.wait_for_function('__r.houseSettled()')
  p.evaluate("__r.houseWalkTo('jardin',.5)");p.wait_for_function("__r.houseStand().room==='jardin'&&!document.getElementById('houseGardenTools').hidden",timeout=10000)
  p.locator('#houseGardenTools summary').click();baseline=p.evaluate('JSON.stringify(__r.gardenState)')
  p.evaluate("()=>{Storage.prototype.setItem=function(k,v){if(k===__r.saveStore.key)throw Error('quota');return originalSet.call(this,k,v);};}")
  p.locator('#gardenSave').click();assert p.evaluate('JSON.stringify(__r.gardenState)')==baseline
  p.locator('#gardenSlots button').first.click();assert p.evaluate('JSON.stringify(__r.gardenState)')==baseline
  p.locator('#gardenSets').select_option('0');assert p.evaluate('JSON.stringify(__r.gardenState)')==baseline
  assert p.evaluate('__r.rareCards.length')==5
  p.evaluate('()=>{Storage.prototype.setItem=originalSet;}');p.locator('#gardenSave').click();assert p.evaluate('__r.gardenState.sets.length')==2
  p.reload();p.wait_for_function('!!window.__r?.gardenState');assert p.evaluate('__r.gardenState.cards.length===1&&__r.gardenState.sets.length===2&&__r.gardenState.extra.kept&&__r.rareCards.length===5')
  # The same transaction also protects real dragging inside the Refugio.
  p.evaluate("()=>{document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);__r.enterHouse();}");p.wait_for_function('__r.houseSettled()');p.evaluate("__r.houseWalkTo('sala',.5)");p.wait_for_function("__r.houseStand().room==='sala'&&__r.houseSettled()",timeout=15000)
  def card_point():
   return p.evaluate("()=>{const r=__r,o=r.gardenObjects(r.currentHouse()).find(o=>o.gardenCard&&!o.gardenSeed),b=r.houseRoomRect(o.room);return {x:b.x+o.x*b.w,y:b.y+o.y*b.h};}")
  def drag_card(end):
   at=card_point();assert 0<at['x']<390 and 0<at['y']<844,at;p.mouse.move(at['x'],at['y']);p.mouse.down();p.mouse.move(end['x'],end['y'],steps=5);p.mouse.up()
  baseline=p.evaluate('JSON.stringify(__r.gardenState)');rect=p.evaluate('__r.houseRoomRect("sala")');end={'x':rect['x']+rect['w']*.7,'y':rect['y']+rect['h']*.65}
  p.evaluate("()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===__r.saveStore.key)throw Error('quota');return originalSet.call(this,k,v);};}")
  drag_card(end);assert p.evaluate('JSON.stringify(__r.gardenState)')==baseline,'failed drag restores positions'
  drag_card({'x':-100,'y':-100});assert p.evaluate('JSON.stringify(__r.gardenState)')==baseline,'failed drag-out restores selected voice'
  p.evaluate('()=>{Storage.prototype.setItem=originalSet;}');drag_card(end)
  assert p.evaluate('Object.values(__r.gardenState.positions).some(p=>Math.abs(p.x-.7)<.03)'), 'successful drag persists placement'
  p.reload();p.wait_for_function('!!window.__r?.gardenState');assert p.evaluate('Object.values(__r.gardenState.positions).some(p=>Math.abs(p.x-.7)<.03)&&__r.gardenState.cards.length===1&&__r.rareCards.length===5')
  p.evaluate("()=>{__r.S.collectionGarden={version:9,cards:['future:voice'],future:{won:true}};document.querySelectorAll('.modal').forEach(e=>e.hidden=true);__r.openJournal('rares');}")
  assert p.locator('[data-garden-add]:enabled').count()==0 and p.evaluate('__r.gardenState.future.won&&__r.gardenState.version===9')
  assert not errors,errors;b.close()
 print('PASS garden add/remove/save/load/drag failure rollback, nonconsumed cards, reload, future data and clear selection states')
finally:srv.shutdown();srv.server_close()
