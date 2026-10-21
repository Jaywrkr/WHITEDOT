"""Cube shop batch 7: skills are bought at their reviewed price, sprint bursts and recharges, the Sky tap glides before landing, and all are kept after a reload."""
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
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cube-shop&layout=wide&generation=2');page.wait_for_function('!!window.__r?.buySparkStyle&&!!window.__r?.cubeShopSkills')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sparks=3000;s.sparkEconomy.earned=s.sparkEconomy.spent+3000;r.save();}""")
  page.wait_for_function('__r.inWorld()')
  pieces=['skill:magnet','skill:sprint','skill:glide']
  page.evaluate("__r.openCube('shop')")
  pics=page.evaluate("ids=>ids.map(id=>document.querySelector('#sparkShop article[data-piece=\"'+id+'\"] img')?.src||'')",pieces)
  assert all(p.startswith('data:image/png') for p in pics) and len(set(pics))==3,'three distinct pictures'
  assert page.locator('#sparkShop h4',has_text='Habilidades').count()==1
  page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  before=page.evaluate('__r.S.sparks')
  for pid in pieces:assert page.evaluate('id=>__r.buySparkStyle(id)',pid),pid
  assert before-page.evaluate('__r.S.sparks')==1850
  assert page.evaluate('__r.cubeShopSkills().magnet')==1.35
  # Sprint: stand still, start walking, a burst; it covers more ground than a walk started right after.
  page.locator('#w').focus();page.wait_for_timeout(700)
  x0=page.evaluate('__r.S.wx');page.keyboard.down('d');page.wait_for_timeout(500);page.keyboard.up('d');burst=page.evaluate('__r.S.wx')-x0
  assert page.evaluate('__r.cubeShopSkills().sprints')==1
  page.wait_for_timeout(700);x1=page.evaluate('__r.S.wx');page.keyboard.down('d');page.wait_for_timeout(500);page.keyboard.up('d');plain=page.evaluate('__r.S.wx')-x1
  assert page.evaluate('__r.cubeShopSkills().sprints')==1,'still recharging'
  assert burst>plain*1.15,(burst,plain)
  # Planeo: in the Sky a tap glides first, then lands where the glide ends.
  page.evaluate("__r.enterLayer('cielo')");page.wait_for_function("__r.S.layer==='cielo'")
  page.evaluate("()=>{const r=__r;for(let k=0;k<80&&r.regionOfPos(r.S.wx,r.S.wy).sea;k++)r.S.wx+=900;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}")
  page.keyboard.press('Space');page.wait_for_timeout(300)
  assert page.evaluate("__r.S.layer")=='cielo' and page.evaluate('__r.cubeShopSkills().gliding')>0
  page.wait_for_function("__r.S.layer==='superficie'",timeout=8000);assert page.evaluate('__r.cubeShopSkills().landed')==1
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert all(page.evaluate('id=>__r.sparkEconomy.on[id]===true',p) for p in pieces)
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.evaluate("__r.openCube('wear')")
  assert page.locator('[data-owned-slot="skills"] [data-shop-piece]').count()==3
  page.locator('[data-owned-slot="skills"] [data-shop-piece="skill:sprint"]').click();assert page.evaluate("__r.sparkEconomy.on['skill:sprint']")!=True
  assert not errors,errors;browser.close()
 print('PASS 3 skills for 1850 sparks: own pictures, sprint burst and recharge, Sky glide then landing, kept after reload and listed in Llevar',flush=True)
finally:server.shutdown()
