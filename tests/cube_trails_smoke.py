"""Cube shop batch 3: trails and companions can be bought, worn, seen moving and still, keep today's steps and yesterday's walk, and survive a reload."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('CUBE_SHOP_SHOTS','/tmp/kubono-cube-shop'));SHOTS.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Lit pixels around the cube, outside its own square: trails and companions add them.
AROUND="""()=>{const c=document.getElementById('w'),x=c.getContext('2d'),r=40,cx=Math.floor(c.width/2),cy=Math.floor(c.height/2),d=x.getImageData(cx-r,cy-r,r*2,r*2).data;let lit=0;for(let j=0;j<r*2;j++)for(let i=0;i<r*2;i++){if(Math.abs(i-r)<10&&Math.abs(j-r)<10)continue;const k=(j*r*2+i)*4;if(d[k]+d[k+1]+d[k+2]>150)lit++;}return lit;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cube-trails&layout=wide&generation=2');page.wait_for_function('!!window.__r?.buySparkStyle&&!!window.__r?.drawCubeShopCompanion')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sparks=20000;s.sparkEconomy.earned=s.sparkEconomy.spent+20000;r.save();}""")
  page.wait_for_function('__r.inWorld()')
  pieces=page.evaluate("async()=>{const m=await import('/src/cube-shop-model.js');return m.CUBE_SHOP.filter(p=>/^(trail|pet):/.test(p.id)).map(p=>p.id);}")
  assert len(pieces)==10,pieces
  for pid in pieces:assert page.evaluate('id=>__r.buySparkStyle(id)',pid),pid
  hide="document.querySelectorAll('.modal').forEach(m=>m.hidden=true)"
  # Yesterday's walk for the ghost: a route from an earlier day becomes yesterday's when today begins.
  page.evaluate("()=>{const s=__r.S;s.cubeRoute={version:1,day:'2000-01-01',today:[[0,0],[300,0],[300,200],[100,260],[0,120]],yday:'',yesterday:[]};}")
  for pid in pieces:
   for reduced in (False,True):
    page.evaluate(f"([id,reduced])=>{{const r=__r;r.equipSparkStyle('');r.equipSparkStyle(id);r.S.reducedMotion=reduced;if(id==='trail:rainbow')r.S.sparkEconomy.stats.broken+=3;{hide}}}",[pid,reduced])
    # A curve so trails bend, then a pause so companions settle.
    page.keyboard.down('d');page.wait_for_timeout(350);page.keyboard.down('s');page.wait_for_timeout(300);page.keyboard.up('d');page.wait_for_timeout(250);page.keyboard.up('s')
    page.wait_for_timeout(1800 if pid in ('pet:bird','trail:garden') else 120)
    assert page.evaluate("id=>__r.cubeShopWearing(id)",pid),pid
    if pid=='trail:rainbow':assert page.evaluate('__r.cubeShopRainbow()'),'rainbow after three crystals in a row'
    lit=page.evaluate(AROUND);assert lit>6,(pid,reduced,lit)
    page.screenshot(path=str(SHOTS/f"{pid.replace(':','-')}{'-still' if reduced else ''}.png"),clip={'x':195-80,'y':422-80,'width':160,'height':160})
  route=page.evaluate('__r.S.cubeRoute')
  assert route['day']==page.evaluate('__r.S.todayKey') and route['yday']=='2000-01-01' and len(route['yesterday'])==5,route
  assert len(route['today'])>=3,route
  page.evaluate("()=>{__r.S.reducedMotion=false;__r.equipSparkStyle('');__r.equipSparkStyle('trail:steps');__r.equipSparkStyle('pet:ghost');}")
  page.evaluate('__r.save()');steps=len(route['today']);page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert page.evaluate("__r.sparkEconomy.wear")=={'trail':'trail:steps','companion':'pet:ghost'}
  kept=page.evaluate('__r.S.cubeRoute');assert kept['yday']=='2000-01-01' and len(kept['today'])>=steps-1,kept
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.evaluate('__r.openSparks()')
  assert [page.locator(f'#sparkShop article[data-slot="{s}"]').count() for s in ('trail','companion')]==[6,6]
  assert not errors,errors;browser.close()
 print('PASS 10 trail and companion pieces bought, worn moving and still, rainbow after a chain, today\'s steps and yesterday\'s walk kept, persisted after reload and listed by slot',flush=True)
finally:server.shutdown();server.server_close()
