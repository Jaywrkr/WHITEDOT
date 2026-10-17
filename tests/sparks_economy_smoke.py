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
  page.locator('#hcGo').click()
  page.evaluate("""async()=>{
   const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();
   const {crystalField}=await import('/src/crystal-sparks.js');let o=null;
   for(let i=0;i<20&&!o;i++)o=crystalField(i*1200,0,r.seedOf).find(p=>p.size===2);
   if(!o)throw Error('Missing crystal fixture');window.crystal=o;window.start=r.S.sparks;r.S.wx=o.x;r.S.wy=o.y-35;
  }""")
  page.wait_for_timeout(800)
  for i in range(2):
   page.mouse.click(30,422);page.wait_for_timeout(900)
  page.wait_for_function('__r.S.sparks>=start+3')
  assert page.evaluate('__r.savedCrystal(crystal.id).collected')
  from browser_helpers import keep_place_on_reload
  crystal_id=page.evaluate('crystal.id')
  keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.sparkTick')
  assert page.evaluate('(id)=>__r.savedCrystal(id).collected',crystal_id)
  page.evaluate("""()=>{__r.S.sparks=100;__r.sparkEconomy.earned=100+__r.sparkEconomy.spent;__r.save();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__r.openSparks();}""")
  assert page.locator('#sparkJump').inner_text()=='Saltar · 20 ✦'
  assert page.locator('#sparkJump').evaluate('e=>e.closest("#mSparks")!==null')
  page.locator('[data-spark-preview="orbit"]').click()
  assert page.locator('#sparkPreview svg').count()==1
  page.locator('[data-spark-buy="dust"]').click()
  assert page.evaluate('__r.S.sparks')==60
  page.locator('[data-spark-equip="dust"]').click()
  assert page.evaluate('__r.sparkEconomy.equipped')=='dust'
  # A failed write cannot take payment or grant ownership.
  page.evaluate("""()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota fixture')};}""")
  # Raise the balance fixture so failure reaches persistence rather than affordability.
  page.evaluate('__r.S.sparks=100;__r.sparkEconomy.earned=100+__r.sparkEconomy.spent')
  page.locator('[data-spark-buy="facet"]').click()
  assert page.evaluate('__r.S.sparks')==100
  assert not page.evaluate('!!__r.sparkEconomy.purchases.facet')
  assert 'No se guardó' in page.locator('#sparkStatus').inner_text()
  page.evaluate('Storage.prototype.setItem=originalSet;__r.save();__r.S.sparks=60;__r.sparkEconomy.earned=60+__r.sparkEconomy.spent;__r.save();')
  page.locator('#sparkJump').click()
  assert page.evaluate('__r.S.sparks')==40
  assert page.locator('#mSparks').is_hidden()
  paid=page.evaluate('({x:__r.S.wx,y:__r.S.wy})')
  page.evaluate('__r.openSparks()');page.locator('#sparkBack').click()
  assert page.evaluate('__r.S.sparks')==40
  assert page.evaluate('!!__r.sparkEconomy.claims["badge:wrong"]')
  # Failed destination persistence must refund the reserved fare and retain coordinates.
  page.evaluate("""()=>{window.beforeJump={x:__r.S.wx,y:__r.S.wy};let writes=0;Storage.prototype.setItem=function(k,v){if(k===__r.saveStore.key&&++writes===2)throw Error('destination quota');return originalSet.call(this,k,v);};__r.openSparks();}""")
  page.locator('#sparkJump').click()
  assert page.evaluate('__r.S.sparks')==40
  assert page.evaluate('__r.S.wx===beforeJump.x&&__r.S.wy===beforeJump.y')
  page.evaluate('Storage.prototype.setItem=originalSet;__r.save();')
  # Collections already discovered pay once, then remain completed across reload.
  page.evaluate("""()=>{const r=__r;r.S.rareBook.items.push(...['perc','bajo','lead','acorde'].map((role,i)=>({id:'set-fixture:'+i,type:'voice:'+i,context:{role}})));}""")
  page.wait_for_function('!!__r.sparkEconomy.claims["set:band"]')
  assert page.evaluate('__r.S.sparks')==55
  page.evaluate('__r.openSparks()')
  assert 'Completada' in page.locator('#sparkSets').inner_text()
  page.locator('#sparkGoalSelect').select_option('shop:orbit')
  page.locator('#sparkClose').click()
  assert 'Órbita personal' in page.locator('#sparkGoal').inner_text()
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.evaluate('__r.openSparks()')
   assert page.locator('#mSparks .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2')
   page.screenshot(path=str(ROOT.parent/f'sparks-hub-{width}.png'))
   page.locator('#sparkClose').click()
  # The actual rare-card producer gives a timed status, never a forced inspection.
  page.evaluate("""()=>{const r=__r;r.noticeLane.quietRoutine();r.collectRareCard('relic:ordinary',{id:'notice-fixture',x:r.S.wx,y:r.S.wy});}""")
  page.wait_for_function('__r.noticeLane.owner==="rare"',timeout=15000)
  assert page.locator('#rareNotice').get_attribute('data-inspect')=='false'
  assert page.locator('#rareNotice').get_attribute('role')=='status'
  page.keyboard.press('ArrowRight')
  page.wait_for_function('__r.noticeLane.owner!=="rare"',timeout=6000)
  assert not page.evaluate('__r.noticeLane.inspecting')
  page.evaluate("""()=>{const r=__r;r.givePower('campo');r.givePower('campo');r.giveSurprise('pequeno');}""")
  assert 0<page.evaluate('__r.powerSecondsLeft("campo")')<=20
  assert 0<page.evaluate('__r.snapshotBoxSurprises().remaining.pequeno')<=20000
  page.wait_for_function('!document.getElementById("sparkPowerHud").hidden')
  page.locator('#sparkPowerUndo').click()
  assert page.evaluate('__r.powerSecondsLeft("campo")')==0
  # Storage failures remain visible, are actionable, and clear after recovery.
  page.evaluate("""()=>{__r.noticeLane.quietRoutine();Storage.prototype.setItem=function(){throw Error('quota')};__r.save();}""")
  page.wait_for_function('document.getElementById("toast").dataset.detail==="save"&&!document.getElementById("toast").hidden',timeout=15000)
  page.wait_for_timeout(3500)
  assert page.locator('#toast').is_visible()
  page.locator('#toast').click()
  assert page.locator('#mSaveTools').is_visible()
  page.locator('#saveToolsClose').click()
  page.evaluate('Storage.prototype.setItem=originalSet;__r.save();')
  page.wait_for_function('document.getElementById("toast").hidden')
  keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.sparkTick')
  assert page.evaluate('__r.S.sparks')==55
  assert page.evaluate('__r.sparkEconomy.purchases.dust')
  assert page.evaluate('__r.sparkEconomy.equipped')=='dust'
  assert page.evaluate('__r.sparkEconomy.goal')=='shop:orbit'
  assert page.evaluate('__r.sparkEconomy.earned-__r.sparkEconomy.spent===__r.S.sparks')
  assert not errors,errors
  browser.close()
 print('PASS persistent mining, paid/free travel, failed-write refunds, purchase/preview/equip, one-time sets, chosen goal, responsive hub, timed nonblocking cards, short boxes/undo and reload')
finally:
 server.shutdown();server.server_close()
