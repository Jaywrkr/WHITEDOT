"""Real Camino crystals gate entry, preserve partial progress and place the wallet below distance."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, threading
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
 with sync_playwright() as pw:
  browser = pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'), args=['--no-sandbox'])
  page = browser.new_page(viewport={'width':390,'height':844})
  errors, sessions = [], []
  page.on('pageerror', lambda e: errors.append(str(e)))
  page.on('response', lambda r: sessions.append(r.status) if r.url.endswith('/api/session') else None)
  page.route('**/src/main.js', lambda route: route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;', content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/')
  page.wait_for_function('!!window.__r?.sparkTick')
  assert page.locator('#mHelpC .firma').inner_text()=='.simple'
  page.locator('#returnContinue').click()
  page.locator('#hcGo').click()
  assert page.evaluate('__r.S.mode')=='camino'
  assert not page.evaluate('__r.worldReady()')
  # A real tap breaks path crystals; walking alone never does.
  page.wait_for_timeout(800)
  assert page.evaluate('__r.S.pathCrystals.length')==0
  page.mouse.click(30,422);page.wait_for_timeout(1000)
  partial=page.evaluate('__r.S.pathCrystals.length')
  assert 0<partial<10
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkTick')
  page.locator('#returnContinue').click()
  page.wait_for_function('__r.crystalState.near.length>0')
  assert page.evaluate('__r.S.pathCrystals.length')==partial
  assert page.evaluate('__r.S.mode')=='camino'
  for i in range(10):
   if page.evaluate('__r.inWorld()'):break
   page.evaluate("""()=>{const r=__r,o=r.crystalState.near.find(o=>!r.S.pathCrystals.includes(o.id)&&!o.broken);if(!o)throw Error('No path crystal');r.S.px=o.x;r.S.py=o.y-25;}""")
   page.mouse.click(30,422);page.wait_for_timeout(1000)
   n=page.evaluate('__r.S.pathCrystals.length')
   assert page.evaluate('__r.inWorld()')==(n==10)
  assert page.evaluate('__r.inWorld()')
  assert page.locator('#mHelpW').is_hidden()
  assert page.locator('#mCap').is_hidden()
  assert page.evaluate('__r.S.sparks')>=10
  page.evaluate("""async()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.stopAutopilot?.();r.noticeLane.quietRoutine();const {totemCell,TOTEMS}=await import('/src/sculpture-totems-model.js'),{crystalField}=await import('/src/crystal-sparks.js');let site=null;for(let x=-20;x<20&&!site;x++)for(let y=-20;y<20&&!site;y++)site=totemCell(x,y,r.seedOf).find(o=>TOTEMS[o.kind].action==='guide'&&!crystalField(o.x,o.y,r.seedOf).some(c=>Math.hypot(c.x-o.x,c.y-o.y)<220));if(!site)throw Error('Missing guide');window.site=site;r.S.wx=site.x;r.S.wy=site.y-40;window.beforeTotem=r.S.sparks;}""")
  page.wait_for_timeout(800);page.mouse.click(30,422)
  page.wait_for_function('__r.S.sparks===beforeTotem+2')
  assert page.evaluate('__r.S.rareBook.items.some(c=>c.type==="totem:"+site.kind)')
  print('PASS Camino entry and natural totem/card',flush=True)
  # Only real manual pulses and collected fragments fund the purchase and jump.
  for _ in range(25):
   if page.evaluate('__r.S.sparks>=60'):break
   page.evaluate("""async()=>{const r=__r,{crystalField}=await import('/src/crystal-sparks.js');let o=null;for(let i=0;i<40&&!o;i++)o=crystalField(i*1200,0,r.seedOf).find(p=>!p.runner&&!p.rare&&!r.savedCrystal(p.id)?.broken);if(!o)throw Error('No unbroken crystal');window.crystal=o;r.S.wx=o.x;r.S.wy=o.y-25;}""")
   page.wait_for_timeout(950)
   for hit in range(page.evaluate('crystal.size')):
    if page.evaluate('!!__r.savedCrystal(crystal.id)?.broken'):break
    before=page.evaluate('__r.savedCrystal(crystal.id)?.hits||0')
    page.mouse.click(30,422)
    page.wait_for_function('n=>(__r.savedCrystal(crystal.id)?.hits||0)>n',arg=before)
    page.wait_for_timeout(950)
   page.wait_for_function('__r.savedCrystal(crystal.id)?.collected')
  assert page.evaluate('__r.S.sparks>=60')
  print('PASS actual mining funds',flush=True)
  page.evaluate('__r.openSparks()');page.locator('[data-spark-buy="dust"]').click();page.locator('[data-spark-equip="dust"]').click()
  page.locator('#sparkGoalSelect').select_option('shop:dust');page.locator('#sparkClose').click()
  page.wait_for_function('document.getElementById("sparkGoal").textContent.includes("Meta cumplida")')
  before_jump=page.evaluate('__r.S.sparks')
  page.wait_for_function('!document.getElementById("bJump").hidden&&!document.getElementById("bJump").disabled')
  page.locator('#bJump').click();page.wait_for_function('!!__r.S.practiceTravel.previous')
  assert page.evaluate('__r.S.sparks')==before_jump-20
  page.locator('#bMenu').click();page.locator('#bJumpBack').click();assert page.evaluate('__r.S.sparks')==before_jump-20
  from browser_helpers import keep_place_on_reload
  snapshot=page.evaluate('({sparks:__r.S.sparks,cards:__r.S.rareBook.items.length,broken:__r.sparkEconomy.stats.broken})')
  keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.sparkTick');page.locator('#returnContinue').click()
  assert page.evaluate('__r.S.sparks')==snapshot['sparks']
  assert page.evaluate('__r.S.rareBook.items.length')==snapshot['cards']
  assert page.evaluate('__r.sparkEconomy.stats.broken')==snapshot['broken']
  assert page.evaluate('__r.sparkEconomy.equipped')=='dust'
  assert page.evaluate('__r.sparkEconomy.goal')=='shop:dust'
  assert page.evaluate('__r.sparkEconomy.earned-__r.sparkEconomy.spent===__r.S.sparks')
  for width,height in [(390,844),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.evaluate('__r.openSparks()')
   assert page.locator('#mSparks .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2')
   page.screenshot(path=str(ROOT.parent/f'unified-game-loop-{width}.png'));page.locator('#sparkClose').click()
  assert not errors,errors
  browser.close()
 print('PASS complete real loop: Camino, natural totem/card, mined funds, permanent purchase/equip, paid jump/free return, optional completed goal and persistent reload')
finally:
 server.shutdown();server.server_close()
