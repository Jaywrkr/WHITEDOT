"""The wild World (plan F18) on ?anillo=1: a wild spark turns up ahead of the cube; five pulses on time beside it
catch it for 15 sparks, one far from it does nothing. Lugares shows today's remix; it starts that place's round with
another rhythm, and closing it pays 30 sparks more."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ON="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),own=r.journeyRhythmTarget?.(ac.currentTime),d=own?(own.hit?own.hit.dist:1):Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(d<.02){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.wildState&&__r.wildState().active",timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=20000)
   assert page.evaluate('__r.wildSpawn()') is True;sp=page.evaluate('__r.wildState().spark');sparks=page.evaluate('__r.S.sparks')
   # Far from it, nothing; beside it, five on time catch it.
   page.evaluate(f"()=>{{__r.S.wx={sp['x']}+600;__r.S.wy={sp['y']};}}");page.evaluate(ON);page.wait_for_timeout(300);assert page.evaluate('__r.wildState().spark.hops')==0
   # Plan H6: it sings on the beat from its side, to be found by ear (600 px to its left, it is heard on the right).
   h=page.evaluate('__r.wildState().heard');page.wait_for_function(f"__r.wildState().heard>{h}",timeout=5000)
   for k in range(5):
    s=page.evaluate('__r.wildState().spark')
    if not s:break
    page.evaluate(f"()=>{{__r.S.wx={s['x']};__r.S.wy={s['y']};}}");page.evaluate(ON);page.wait_for_timeout(300)
   st=page.evaluate('__r.wildState()');assert st['spark'] is None and st['caught']==1 and st['today']==1,st
   assert page.evaluate('__r.S.sparks')-sparks>=15
   # Today's remix in Lugares: it starts the round with another rhythm and pays 30 more.
   mix=page.evaluate('__r.dailyRemix()');assert mix and mix['id'] and mix['rhythm'],mix
   page.evaluate('__r.openLugares()');assert page.locator('#lugaresRemix').is_visible() and page.locator('#lugaresRemixLine').is_visible()
   page.locator('#lugaresRemix').click();page.wait_for_function(f"__r.places().run?.id==='{mix['id']}'&&__r.places().run.remix==='{mix['rhythm']}'",timeout=8000)
   page.wait_for_function(f"__r.journeyRhythmState().rhythm==='{mix['rhythm']}'",timeout=8000)
   assert page.evaluate(f"__r.startPlace('{mix['id']}',{{remix:'tiempo'}})") is False
   page.evaluate(f"__r.placeFinish('{mix['id']}')");last=page.evaluate('__r.places().last');assert last['remix']==mix['rhythm'] and last['extra']['sparks']>=30,last
   page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=15000);assert page.locator('#placeTitle').inner_text().endswith(' · Remezcla')
   if os.environ.get('WILD_SHOT'):page.locator('#placeClose').click();page.evaluate('__r.wildSpawn()');page.wait_for_timeout(500);page.screenshot(path=os.environ['WILD_SHOT'].replace('.png',f'-{width}.png'))
   assert not errors,errors;page.close()
  browser.close()
 print('PASS wild World on phone and desktop: a wild spark ahead of the cube, nothing far from it, five on time beside it catch it for 15 sparks; today\'s remix from Lugares plays its place with another rhythm and pays 30 more',flush=True)
finally:server.shutdown()
