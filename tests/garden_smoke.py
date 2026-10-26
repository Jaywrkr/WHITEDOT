"""The Jardín (plan F9): ?lugar=jardin plays a round of «Siembra». A pulse on time on a bed sows, on time near it
grows, off time does nothing; the bar at the top shows the round in both screen modes; with the bar full the gold tree
comes and one pulse on time ends the round with its stars, sparks and card."""
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
# A pulse on time on the beat (part 0) or on the «y» (part 2) of the Jardín's rhythm (plan F14).
ON_PART="""(part)=>new Promise(res=>{const r=__r;const tick=()=>{const own=r.ac&&r.journeyRhythmTarget?.(r.ac.currentTime);if(own?.hit&&own.hit.dist<.02&&own.hit.step%4===part){r.sonar('player');return res(own.hit.step);}requestAnimationFrame(tick);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=jardin');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='jardin'",timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.journeyGarden().active",timeout=20000)
   g=page.evaluate('__r.journeyGarden()');assert g['points']==0 and len(g['spots'])==8,g
   # Stand on the first bed and play on time: it is sown and grows.
   s=g['spots'][0];page.evaluate(f"()=>{{__r.S.wx={s['x']};__r.S.wy={s['y']};}}")
   assert page.evaluate('__r.journeyRhythmState()')['rhythm']=='siembra'
   # On the «y» an empty bed stays empty; on the beat it is sown; on the «y» it grows.
   page.evaluate(ON_PART,2);page.wait_for_timeout(200);assert page.evaluate('__r.journeyGarden().beds[0].stage')==0,'watering sows nothing'
   page.evaluate(ON_PART,0);page.wait_for_timeout(200);assert page.evaluate('__r.journeyGarden().beds[0].stage')==1,'sown on the beat'
   page.evaluate(ON_PART,0);page.wait_for_timeout(200);assert page.evaluate('__r.journeyGarden().beds[0].stage')==1,'the beat does not grow'
   page.evaluate(ON_PART,2);page.wait_for_timeout(200)
   g=page.evaluate('__r.journeyGarden()');assert g['beds'][0]['stage']==2 and g['points']>0,g
   # Off time nothing grows.
   before=page.evaluate('__r.journeyGarden().beds[0].stage');page.evaluate("()=>__r.journeyGamePulse(false,{step:3})");assert page.evaluate('__r.journeyGarden().beds[0].stage')==before
   # The bar shows the round in both screen modes.
   for mode in ['viaje','libre']:
    page.evaluate(f"__r.setJourneyMode('{mode}')");page.wait_for_timeout(300)
    w=page.evaluate("parseFloat(document.getElementById('barfill').style.width)");p=page.evaluate('__r.journeyGarden().progress')*100;assert abs(w-p)<2,(mode,w,p)
    assert page.locator('#bar').is_visible(),'the bar is seen during a round in '+mode
   if os.environ.get('GARDEN_SHOT'):
    for i in range(1,4):
     q=g['spots'][i];page.evaluate(f"()=>{{__r.S.wx={q['x']};__r.S.wy={q['y']};}}")
     for k in range(2+i):page.evaluate(ON_PART,0 if k==0 else 2);page.wait_for_timeout(200)
    page.evaluate(f"()=>{{__r.S.wx={g['center']['x']};__r.S.wy={g['center']['y']}-40;}}");page.wait_for_timeout(600);page.screenshot(path=os.environ['GARDEN_SHOT'].replace('.png',f'-{width}.png'))
   # The bar full: the gold tree, and one pulse on time ends the round.
   page.evaluate("()=>{__r.S.journey.garden.points=__r.journeyGarden().goal;}");page.wait_for_function("!!__r.journeyGarden().tree",timeout=3000)
   page.evaluate(ON);page.wait_for_function("!__r.places().run",timeout=5000)
   last=page.evaluate('__r.places().last');assert last['id']=='jardin' and last['stars'][0] and last['sparks']>=60,last
   page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=15000);assert page.evaluate('__r.places().stars.jardin[0]')
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Jardín on phone and desktop: ?lugar=jardin sows and grows on time only, the bar follows the round in both screen modes, the gold tree ends it with stars, sparks and its card',flush=True)
finally:server.shutdown()
