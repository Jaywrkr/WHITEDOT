"""The Ruinas (plan F16): ?lugar=ruinas plays a round of «Reconstruye». Beside a pillar, three steps of the pattern
(«1 · 2y · 3 · 4») in one bar lay a stone; a step off the pattern is not on time; the bar shows in both screen modes;
with the bar full the gold capstone comes and one pulse on time ends the round."""
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
# Pulse when a given step of the bar is heard .
AT_STEP="""(want)=>new Promise(res=>{const r=__r;const tick=()=>{const t=r.ac.currentTime-Math.min(.4,r.ac.outputLatency||r.ac.baseLatency||0);const e=(r.MU.sq||[]).find(q=>q.s%16===want&&t>=q.t-.012&&t<q.t+.03);if(e){r.sonar('player');return res(r.journeyPulseState().lastOn);}requestAnimationFrame(tick);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=ruinas');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='ruinas'",timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.journeyRebuild().active",timeout=20000)
   g=page.evaluate('__r.journeyRebuild()');assert g['points']==0 and len(g['spots'])==8,g
   assert page.evaluate('__r.journeyRhythmState()')['rhythm']=='ruina'
   p=g['spots'][1];page.evaluate(f"()=>{{__r.S.wx={p['x']};__r.S.wy={p['y']}+10;}}")
   # Off the pattern (the 2) is not on time.
   assert page.evaluate(AT_STEP,4) is False
   # Three steps of the pattern in one bar: a stone.
   # A loaded CI runner can let one step slip into the next bar; retry whole bars until a stone lands.
   for attempt in range(6):
    before=page.evaluate('__r.journeyRebuild().stones[1]')
    for st in [0,6,8]:assert page.evaluate(AT_STEP,st) is True;page.wait_for_timeout(60)
    page.wait_for_timeout(150)
    if page.evaluate('__r.journeyRebuild().stones[1]')==before+1:break
   g=page.evaluate('__r.journeyRebuild()');assert g['stones'][1]==1 and g['points']==4,g
   for mode in ['viaje','libre']:
    page.evaluate(f"__r.setJourneyMode('{mode}')");page.wait_for_timeout(300)
    w=page.evaluate("parseFloat(document.getElementById('barfill').style.width)");q=page.evaluate('__r.journeyRebuild().progress')*100;assert abs(w-q)<2,(mode,w,q)
    assert page.locator('#bar').is_visible(),'the bar is seen during a round in '+mode
   if os.environ.get('RUINS_SHOT'):
    page.evaluate("()=>{const j=__r.S.journey.rebuild;j.stones=[7,7,5,3,7,7,2,1];j.arches[4]=true;}");page.evaluate(f"()=>{{__r.S.wx={g['spots'][0]['x']};__r.S.wy={g['spots'][0]['y']}+60;}}");page.wait_for_timeout(500);page.screenshot(path=os.environ['RUINS_SHOT'].replace('.png',f'-{width}.png'))
   page.evaluate("()=>{__r.S.journey.rebuild.points=__r.journeyRebuild().goal;}");page.wait_for_function("!!__r.journeyRebuild().gold",timeout=3000)
   page.evaluate(ON);page.wait_for_function("!__r.places().run",timeout=5000)
   last=page.evaluate('__r.places().last');assert last['id']=='ruinas' and last['stars'][0] and last['sparks']==0,last
   page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=15000);assert page.evaluate('__r.places().stars.ruinas[0]')
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Ruinas on phone and desktop: ?lugar=ruinas lays a stone for three steps of the pattern in a bar beside a pillar, off the pattern is not on time, the bar follows the round in both screen modes, the gold capstone ends it with stars and its card, no sparks (H1)',flush=True)
finally:server.shutdown()
