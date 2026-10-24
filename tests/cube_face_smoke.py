"""Cube shop batch 2: eyes, habits and accessories can be bought, worn, seen moving and still, react to the world, and survive a reload."""
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
# Lit pixels around the cube, and dark pixels inside its square: eyes and accessories add the latter.
MARKS="""()=>{const c=document.getElementById('w'),x=c.getContext('2d'),w=c.width,h=c.height,r=24,d=x.getImageData(Math.floor(w/2-r),Math.floor(h/2-r),r*2,r*2).data;let lit=0;for(let i=0;i<d.length;i+=4){const v=d[i]+d[i+1]+d[i+2];if(v>240)lit++;}return lit;}"""
FACE="""()=>{const c=document.getElementById('w'),x=c.getContext('2d'),s=Math.round(Math.max(__r.pxSize(),__r.cubeShopMinSize())),L=Math.round(c.width/2-s/2),T=Math.round(c.height/2-s/2),d=x.getImageData(L+1,T+1,s-2,s-2).data;let dark=0;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]<200)dark++;return dark;}"""
# Width of the cube's square, measured on the row just below its centre.
WIDTH="""()=>{const c=document.getElementById('w'),x=c.getContext('2d'),y=Math.floor(c.height/2)+2,d=x.getImageData(0,y,c.width,1).data,mid=Math.floor(c.width/2);let a=mid,b=mid;const on=i=>d[i*4]+d[i*4+1]+d[i*4+2]>600;while(a>0&&on(a-1))a--;while(b<c.width-1&&on(b+1))b++;return b-a+1;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cube-face&layout=wide&generation=2');page.wait_for_function('!!window.__r?.buySparkStyle&&!!window.__r?.drawCubeShopOver')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sparks=20000;s.sparkEconomy.earned=s.sparkEconomy.spent+20000;r.save();}""")
  page.wait_for_function('__r.inWorld()')
  pieces=page.evaluate("async()=>{const m=await import('/src/cube-shop-model.js');return m.CUBE_SHOP.filter(p=>['eyes','habits','accessory'].includes(p.slot)).map(p=>p.id);}")
  assert len(pieces)==13,pieces
  for pid in pieces:assert page.evaluate('id=>__r.buySparkStyle(id)',pid),pid
  hide="document.querySelectorAll('.modal').forEach(m=>m.hidden=true)"
  page.evaluate(f"()=>{{__r.equipSparkStyle('');__r.S.reducedMotion=true;{hide}}}");page.wait_for_timeout(200)
  plain=page.evaluate(FACE);small=page.evaluate(WIDTH);assert page.evaluate('__r.pxSize()')==6 and 14<=small<20,small
  # A face needs room: at level 1 the cube is drawn larger while one is worn, and goes back without it. Since plan H1
  # the World draws the cube 1.6× (16–30 px), so plain is 16 px and with a face about 27.
  page.evaluate(f"()=>{{__r.equipSparkStyle('eyes:serious');{hide}}}");page.wait_for_timeout(200);assert page.evaluate(WIDTH)>=22,page.evaluate(WIDTH)
  page.evaluate(f"()=>{{__r.equipSparkStyle('');{hide}}}");page.wait_for_timeout(200);assert page.evaluate(WIDTH)<20
  for pid in [p for p in pieces if not p.startswith('habit:')]:
   for reduced in (False,True):
    page.evaluate("([id,reduced])=>{const r=__r;r.equipSparkStyle('');r.equipSparkStyle(id);r.S.reducedMotion=reduced;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}",[pid,reduced])
    page.keyboard.down('d');page.wait_for_timeout(260);page.keyboard.up('d');page.wait_for_timeout(160)
    assert page.evaluate("id=>__r.cubeShopWearing(id)",pid),pid
    assert page.evaluate(MARKS)>20,pid
    if reduced and pid!='acc:hat':
     # The sleepy eyes doze after a second still (calm): on a slow runner that second can pass, so they are seen walking.
     if pid=='eyes:sleepy':page.keyboard.down('d');page.wait_for_timeout(120)
     dark=page.evaluate(FACE)
     if pid=='eyes:sleepy':page.keyboard.up('d')
     assert dark>plain,(pid,dark,plain)
    page.screenshot(path=str(SHOTS/f"{pid.replace(':','-')}{'-still' if reduced else ''}.png"),clip={'x':195-60,'y':422-60,'width':120,'height':120})
  # Habits switch on together and each one is set off by something that already happens in the world.
  page.evaluate(f"()=>{{const r=__r;r.equipSparkStyle('');r.S.reducedMotion=false;for(const id of ['habit:yawn','habit:greet','habit:sneeze','habit:dizzy','eyes:blush'])r.equipSparkStyle(id);{hide}}}")
  assert page.evaluate("__r.sparkEconomy.on")=={'habit:yawn':True,'habit:greet':True,'habit:sneeze':True,'habit:dizzy':True}
  for _ in range(3):
   for key in 'dsaw':page.keyboard.down(key);page.wait_for_timeout(150);page.keyboard.up(key)
  assert page.evaluate('__r.cubeShopHabits().dizzy'),page.evaluate('__r.cubeShopHabits()')
  page.evaluate("()=>{const r=__r;r.MU.dnaT={...r.MU.dnaT,air:'esporas'};r.MU.near=[...(r.MU.near||[]),{x:r.S.wx+30,y:r.S.wy}];r.S.rareBook={...(r.S.rareBook||{}),items:[...(r.S.rareBook?.items||[]),{id:'test-rare'}]};}")
  page.wait_for_function('__r.cubeShopHabits().greeted&&__r.cubeShopHabits().blushed',timeout=3000)
  page.wait_for_function('__r.cubeShopHabits().yawn&&__r.cubeShopHabits().sneezed',timeout=12000)
  page.screenshot(path=str(SHOTS/'habits.png'),clip={'x':195-60,'y':422-60,'width':120,'height':120})
  page.evaluate("()=>{__r.equipSparkStyle('acc:monocle');__r.equipSparkStyle('eyes:curious');}")
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert page.evaluate("__r.sparkEconomy.wear")=={'eyes':'eyes:curious','accessory':'acc:monocle'},page.evaluate("__r.sparkEconomy.wear")
  assert page.evaluate("__r.sparkEconomy.on")=={'habit:yawn':True,'habit:greet':True,'habit:sneeze':True,'habit:dizzy':True}
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.evaluate("__r.openCube('wear')")
  assert [page.locator(f'[data-owned-slot="{s}"] [data-shop-piece]').count() for s in ('eyes','habits','accessory')]==[5,4,4]
  assert page.locator('#sparkShop article[data-slot="eyes"]').count()==0
  # Several habits stay on together; tapping one takes only that one off.
  page.locator('[data-shop-piece="habit:yawn"]').click();assert page.evaluate("__r.sparkEconomy.on")=={'habit:greet':True,'habit:sneeze':True,'habit:dizzy':True}
  assert not errors,errors;browser.close()
 print('PASS 13 eye, habit and accessory pieces bought, faces drawn at 10 px on a level-1 cube, worn moving and still, habits set off by the world, persisted after reload and listed by slot',flush=True)
finally:server.shutdown();server.server_close()
