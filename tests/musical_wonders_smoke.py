"""All twenty natural gifts, persistence/rollback, real native music, sculpture shows and free Camino mining."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.wonderTick');page.locator('#returnContinue').click();page.locator('#hcGo').click()
  fixtures=page.evaluate('''async()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();const {wonderCell,WONDERS}=await import('/src/musical-wonders-model.js');const found={};for(let x=-100;x<100&&Object.keys(found).length<20;x++)for(let y=-100;y<100&&Object.keys(found).length<20;y++)for(const o of wonderCell(x,y,r.seedOf))found[o.kind]||=o;window.fixtures=found;return WONDERS.map(d=>found[d.id]);}''')
  assert len(fixtures)==20 and all(fixtures)
  first=fixtures[0]
  page.evaluate('''o=>{const r=__r;r.S.wx=o.x;r.S.wy=o.y;window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota test')};}''',first)
  page.wait_for_timeout(300);assert not page.evaluate('id=>!!__r.wonderState.book.found[id]',first['kind'])
  page.evaluate('''async()=>{Storage.prototype.setItem=originalSet;__r.S.sound=true;__r.audio();await __r.ac.resume();window.notes=[];__r.wonderAudioCue=n=>notes.push(n);}''')
  page.wait_for_function('id=>!!__r.wonderState.book.found[id]',arg=first['kind'],timeout=10000)
  page.wait_for_function('notes.length>0');page.screenshot(path=str(ROOT.parent/'wonder-first-390.png'))
  page.wait_for_function('notes.length===6',timeout=8000)
  before=page.evaluate('JSON.stringify(__r.wonderState.book)');page.wait_for_timeout(200);assert page.evaluate('JSON.stringify(__r.wonderState.book)')==before
  for o in fixtures[1:]:
   page.evaluate('o=>{__r.S.wx=o.x;__r.S.wy=o.y-40;}',o)
   page.wait_for_function('id=>!!__r.wonderState.book.found[id]',arg=o['kind'])
  assert page.evaluate('__r.wonderGifts.length')==20
  assert page.evaluate('__r.S.rareBook.items.filter(c=>c.type.startsWith("wonder:")).length')==20
  page.locator('#bMenu').click();page.locator('#bCube').click();assert page.locator('#cubeWonder option').count()==21
  page.locator('#cubeWonder').select_option(first['kind']);page.locator('#cubeApply').click();assert page.evaluate('__r.S.cube.wonder')==first['kind']
  page.locator('#bMenu').click();page.locator('#bCube').click();page.locator('#cubeWonder').select_option(fixtures[1]['kind']);page.evaluate("()=>{Storage.prototype.setItem=function(){throw Error('quota equip')};}");page.locator('#cubeApply').click();assert page.evaluate('__r.S.cube.wonder')==first['kind'];page.evaluate('()=>{Storage.prototype.setItem=originalSet;}');page.locator('#cubeClose').click()
  from browser_helpers import keep_place_on_reload
  keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.wonderTick');page.locator('#returnContinue').click();assert page.evaluate('__r.wonderGifts.length')==20;assert page.evaluate('__r.S.cube.wonder')==first['kind']
  # Exercise the real sculpture finish hook with a natural one-pulse guide.
  site=page.evaluate('''async()=>{const r=__r,{totemCell,TOTEMS}=await import('/src/sculpture-totems-model.js');let o;for(let x=-50;x<50&&!o;x++)for(let y=-50;y<50&&!o;y++)o=totemCell(x,y,r.seedOf).find(p=>TOTEMS[p.kind].action==='guide');if(!o)throw Error('No natural sculpture');r.S.sound=false;r.S.wx=o.x;r.S.wy=o.y-40;window.site=o;return o;}''')
  page.wait_for_timeout(900);page.mouse.click(25,422);page.wait_for_function('!!__r.wonderState.book.totems[site.kind]');page.wait_for_function('!!__r.wonderState.show');page.screenshot(path=str(ROOT.parent/'sculpture-magic-390.png'))
  page.evaluate('__r.exitWorld();window.wallet=__r.S.sparks;window.lights=__r.S.totalLight')
  page.evaluate('''()=>{const r=__r;r.S.px=10000;r.S.py=r.pathY(10000);}''');page.wait_for_timeout(200)
  extra=page.evaluate('''()=>{const r=__r,o=r.crystalState.near.find(o=>!r.savedCrystal(o.id)?.broken&&!r.S.pathCrystals.includes(o.id));if(!o)throw Error('No further path crystal');r.S.px=o.x;r.S.py=o.y-20;window.extra=o;return o;}''')
  page.wait_for_timeout(900);page.mouse.click(25,422);page.wait_for_function('__r.savedCrystal(extra.id)?.broken')
  assert page.evaluate('__r.S.mode')=='camino';assert page.evaluate('__r.S.pathCrystals.length')==10;assert page.evaluate('__r.S.sparks===wallet&&__r.S.totalLight===lights')
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.locator('#bMenu').click();page.locator('#bCube').click();assert page.locator('#mCube .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2');page.locator('#cubeWonder').scroll_into_view_if_needed();page.screenshot(path=str(ROOT.parent/f'wonder-gifts-{width}.png'));page.locator('#cubeClose').click()
  assert not errors,errors
  browser.close();print('PASS 20 real natural cube-contact gifts/cards, quota rollback/retry, native music, equip/failed equip/reload, real sculpture finish/show, no-reward Camino breaks and responsive wardrobe',flush=True)
finally:server.shutdown();server.server_close()
