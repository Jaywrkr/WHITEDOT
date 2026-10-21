"""Cube shop batch 4: pulse looks keep the original reach, gestures are set off by the world, and both survive a reload."""
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
hide="document.querySelectorAll('.modal').forEach(m=>m.hidden=true)"
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cube-moves&layout=wide&generation=2');page.wait_for_function('!!window.__r?.buySparkStyle&&!!window.__r?.cubeShopMoves')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sparks=20000;s.sparkEconomy.earned=s.sparkEconomy.spent+20000;r.save();}""")
  page.wait_for_function('__r.inWorld()')
  pieces=page.evaluate("async()=>{const m=await import('/src/cube-shop-model.js');return m.CUBE_SHOP.filter(p=>/^(pulse|gesture):/.test(p.id)).map(p=>p.id);}")
  assert len(pieces)==12,pieces
  for pid in pieces:assert page.evaluate('id=>__r.buySparkStyle(id)',pid),pid
  # Every pulse look: the wave carries the look, keeps the original reach and draws without errors, moving and still.
  base=None
  for pid in [p for p in pieces if p.startswith('pulse:')]:
   for reduced in (False,True):
    page.evaluate(f"([id,reduced])=>{{const r=__r;r.equipSparkStyle('');r.equipSparkStyle(id);r.S.reducedMotion=reduced;{hide}}}",[pid,reduced])
    page.wait_for_timeout(760);page.evaluate('__r.sonar()');page.wait_for_timeout(260)
    wave=page.evaluate("(()=>{const w=__r.waves.at(-1);return w&&{look:w.look,form:w.form.id,max:w.max,charge:w.charge}})()")
    assert wave and wave['look']==pid and wave['form']=='ring-0',(pid,wave)
    base=base or wave['max'];assert wave['max']==base,(pid,wave)
    page.screenshot(path=str(SHOTS/f"{pid.replace(':','-')}{'-still' if reduced else ''}.png"),clip={'x':195-120,'y':422-120,'width':240,'height':240})
  # One pulse shape at a time: wearing a bought look returns the earned shape to the original.
  page.evaluate(f"()=>{{__r.S.reducedMotion=false;__r.equipSparkStyle('');__r.openCube('wear');}}")
  page.locator('[data-shop-piece="pulse:star"]').click();assert page.evaluate("__r.sparkEconomy.wear.pulse")=='pulse:star' and page.evaluate("__r.cubeSettings().pulse||'ring-0'")=='ring-0'
  assert page.locator('[data-owned-slot="gestures"] [data-shop-piece]').count()==5 and page.locator('[data-owned-slot="pulse"] [data-shop-piece]').count()==7
  page.evaluate(hide)
  # Gestures, each set off by something that already happens.
  page.evaluate(f"()=>{{const r=__r;r.equipSparkStyle('');for(const id of ['gesture:pose','gesture:flip','gesture:confetti','gesture:dance','gesture:victory'])r.equipSparkStyle(id);{hide}}}")
  page.wait_for_timeout(760);page.evaluate('__r.sonar()');page.wait_for_timeout(120);page.evaluate('__r.sonar()');page.wait_for_timeout(200)
  assert page.evaluate('__r.cubeShopMoves().flipped'),'two quick pulses flip the cube'
  page.screenshot(path=str(SHOTS/'gesture-flip.png'),clip={'x':195-60,'y':422-60,'width':120,'height':120})
  page.evaluate("()=>{__r.S.ach={...__r.S.ach,cube_moves_fixture:__r.S.todayKey};}");page.wait_for_function('__r.cubeShopMoves().confetti',timeout=3000)
  page.screenshot(path=str(SHOTS/'gesture-confetti.png'),clip={'x':195-60,'y':422-60,'width':120,'height':120})
  page.evaluate("()=>{const s=__r.S;s.activities={...s.activities,done:{...(s.activities?.done||{}),'cube-moves-fixture':true}};}");page.wait_for_function('__r.cubeShopMoves().victory',timeout=3000)
  for _ in range(3):
   for key in 'dsaw':page.keyboard.down(key);page.wait_for_timeout(150);page.keyboard.up(key)
  assert page.evaluate('__r.cubeShopMoves().dancing'),'circling starts the dance'
  page.screenshot(path=str(SHOTS/'gesture-dance.png'),clip={'x':195-60,'y':422-60,'width':120,'height':120})
  page.wait_for_function('__r.cubeShopMoves().posing',timeout=9000)
  page.screenshot(path=str(SHOTS/'gesture-pose.png'),clip={'x':195-60,'y':422-60,'width':120,'height':120})
  page.evaluate("()=>{__r.equipSparkStyle('pulse:echo');}");page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert page.evaluate("__r.sparkEconomy.wear")=={'pulse':'pulse:echo'} and len(page.evaluate("__r.sparkEconomy.on"))==5
  assert not errors,errors;browser.close()
 print('PASS 12 pulse looks and gestures bought and worn; looks keep the original reach, one shape at a time; flip, confetti, victory, dance and pose set off by the world; persisted after reload',flush=True)
finally:server.shutdown();server.server_close()
