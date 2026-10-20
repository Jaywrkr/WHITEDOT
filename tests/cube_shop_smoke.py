"""Cube shop batch 1: every movement and body piece can be bought, worn, seen moving and still, and survives a reload."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('CUBE_SHOP_SHOTS','/tmp/kubono-cube-shop'));SHOTS.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
VISIBLE="""()=>{const c=document.getElementById('w'),x=c.getContext('2d'),w=c.width,h=c.height,d=x.getImageData(Math.floor(w/2-40),Math.floor(h/2-40),80,80).data;let lit=0;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>240)lit++;return lit;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cube-shop&layout=wide&generation=2');page.wait_for_function('!!window.__r?.buySparkStyle&&!!window.__r?.drawCubeShopBody')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sparks=20000;s.sparkEconomy.earned=s.sparkEconomy.spent+20000;r.save();}""")
  page.wait_for_function('__r.inWorld()')
  pieces=page.evaluate("async()=>{const m=await import('/src/cube-shop-model.js');return m.CUBE_SHOP.filter(p=>p.slot==='motion'||p.slot==='body').map(p=>p.id);}")
  assert len(pieces)==17,pieces
  for pid in pieces:assert page.evaluate('id=>__r.buySparkStyle(id)',pid),pid
  for pid in pieces:
   for reduced in (False,True):
    page.evaluate("([id,reduced])=>{const r=__r;r.equipSparkStyle('');r.equipSparkStyle(id);r.S.reducedMotion=reduced;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}",[pid,reduced])
    # Walk a little so movement pieces animate, then stop so still states draw too.
    page.keyboard.down('d');page.wait_for_timeout(260);page.keyboard.up('d');page.wait_for_timeout(120)
    assert page.evaluate("id=>__r.cubeShopWearing(id)",pid),pid
    lit=page.evaluate(VISIBLE);assert lit>20,(pid,reduced,lit)
    page.screenshot(path=str(SHOTS/f"{pid.replace(':','-')}{'-still' if reduced else ''}.png"),clip={'x':195-60,'y':422-60,'width':120,'height':120})
  page.evaluate("()=>{__r.S.reducedMotion=false;__r.equipSparkStyle('');__r.equipSparkStyle('motion:roll');__r.equipSparkStyle('body:dice');}")
  assert page.evaluate("__r.sparkEconomy.wear")=={'motion':'motion:roll','body':'body:dice'}
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert page.evaluate("__r.sparkEconomy.wear")=={'motion':'motion:roll','body':'body:dice'}
  # The shop lists the pieces grouped by slot.
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.evaluate('__r.openSparks()')
  slots=page.locator('#sparkShop .spark-slot').all_text_contents();assert 'Movimiento' in slots and 'Cuerpo' in slots,slots
  assert page.locator('#sparkShop article[data-slot="motion"]').count()==8 and page.locator('#sparkShop article[data-slot="body"]').count()==9
  assert not errors,errors;browser.close()
 print('PASS 17 movement and body pieces bought, worn, visible moving and still, persisted after reload and listed by slot',flush=True)
finally:server.shutdown();server.server_close()
