"""Cube shop batch 6: the world reacts and wild pieces are bought with their own pictures, drawn in play moving and still, and kept after a reload."""
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
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cube-shop&layout=wide&generation=2');page.wait_for_function('!!window.__r?.buySparkStyle&&!!window.__r?.cubeShopWild')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sparks=8000;s.sparkEconomy.earned=s.sparkEconomy.spent+8000;s.playerProfile={...s.playerProfile,name:'Jay'};r.save();}""")
  page.wait_for_function('__r.inWorld()')
  pieces=page.evaluate("async()=>{const m=await import('/src/cube-shop-wild.js');return [...m.SHOP_WORLD,...m.SHOP_WILD];}")
  assert len(pieces)==11,pieces
  page.evaluate("__r.openCube('shop')")
  pics=page.evaluate("ids=>ids.map(id=>document.querySelector('#sparkShop article[data-piece=\"'+id+'\"] img')?.src||'')",pieces)
  assert all(p.startswith('data:image/png') for p in pics) and len(set(pics))==11,'eleven distinct pictures'
  page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  before=page.evaluate('__r.S.sparks')
  for pid in pieces:assert page.evaluate('id=>__r.buySparkStyle(id)',pid),pid
  assert before-page.evaluate('__r.S.sparks')==7350
  assert all(page.evaluate('id=>__r.sparkEconomy.on[id]===true',p) for p in pieces)
  assert page.evaluate('__r.cubeShopGrassWide()')
  # Three pulses put on a costume; the body is no longer a square.
  page.locator('#w').focus()
  for i in range(3):page.keyboard.press('Space');page.wait_for_timeout(120)
  assert page.evaluate('__r.cubeShopWild().costume') in ('sphere','pyramid','dodeca')
  for reduced in (False,True):
   page.evaluate('r=>{__r.S.reducedMotion=r;document.querySelectorAll(".modal").forEach(m=>m.hidden=true);}',reduced)
   page.keyboard.down('d');page.wait_for_timeout(700);page.keyboard.up('d');page.wait_for_timeout(900)
   assert page.evaluate('__r.cubeShopWild().trail')>3
   # Screen, hologram and lantern draw lit pixels above and beside the cube.
   lit=page.evaluate("()=>{const c=document.getElementById('w'),x=c.getContext('2d'),w=c.width,h=c.height,d=x.getImageData(Math.floor(w/2-40),Math.floor(h/2-80),80,60).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>300)n++;return n;}")
   assert lit>20,('marks above the cube',reduced,lit)
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert all(page.evaluate('id=>__r.sparkEconomy.on[id]===true',p) for p in pieces)
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.evaluate("__r.openCube('shop')")
  assert page.locator('#sparkShop article[data-slot="world"]').count()==0 and page.locator('#sparkShop article[data-slot="wild"]').count()==0
  page.locator('#cubeTabWear').click()
  assert page.locator('[data-owned-slot="world"] [data-shop-piece]').count()==5 and page.locator('[data-owned-slot="wild"] [data-shop-piece]').count()==6
  page.locator('[data-owned-slot="wild"] [data-shop-piece="wild:costume"]').click();assert page.evaluate("__r.sparkEconomy.on['wild:costume']")!=True
  assert not errors,errors;browser.close()
 print('PASS 11 world and wild pieces: own pictures, bought for 7350 sparks, costume by three pulses, retinue, marks drawn moving and still, kept after reload and listed in Llevar',flush=True)
finally:server.shutdown()
