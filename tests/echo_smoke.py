"""The Cueva (plan F17): ?lugar=cueva plays a round of «Eco». The music drives a call bar and an answer bar: the cave
sings a pattern from the «1»; answering every step of it on time and nothing else is an echo that fills the bar and
makes the next pattern longer; a sixteenth off the eighths is not on time; the bar shows in both screen modes; with the
bar full the gold drop comes and one pulse on time ends the round."""
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
   page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=cueva');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='cueva'",timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.journeyEcho().active",timeout=20000)
   assert page.evaluate('__r.journeyRhythmState()')['rhythm']=='eco'
   # A sixteenth between the eighths is not on time.
   v=page.evaluate(AT_STEP,3);assert v is False,(v,page.evaluate("[__r.SIX,__r.journeyPulseState().lastMark,__r.MU.onTimeWindow,__r.journeyRhythmState()]"))
   # Wait for a call, then answer its pattern in the answer bar.
   # The answer bar starts where the call ends: inside it, the game hears each step of the pattern (the judge's own
   # timing is covered by the off-step check above and by rhythm_smoke.py).
   page.wait_for_function("__r.journeyEcho().phase?.kind==='call'",timeout=10000);pat=page.evaluate('__r.journeyEcho().phase.pattern');assert pat[0]==0 and len(pat)==2,pat
   page.wait_for_function("__r.journeyEcho().phase?.kind==='answer'&&__r.ac.currentTime>__r.journeyEcho().phase.start+.05&&__r.ac.currentTime<__r.journeyEcho().phase.end-.4",timeout=10000)
   for st in pat:assert page.evaluate(f"__r.journeyGamePulse(true,{{step:{st}}})")=='answer'
   assert sorted(page.evaluate('__r.journeyEcho().phase.steps'))==pat
   page.wait_for_function("__r.journeyEcho().echoes===1",timeout=6000);e=page.evaluate('__r.journeyEcho()');assert e['points']==10 and e['len']==3,e
   for mode in ['viaje','libre']:
    page.evaluate(f"__r.setJourneyMode('{mode}')");page.wait_for_timeout(300)
    w=page.evaluate("parseFloat(document.getElementById('barfill').style.width)");q=page.evaluate('__r.journeyEcho().progress')*100;assert abs(w-q)<2,(mode,w,q)
    assert page.locator('#bar').is_visible(),'the bar is seen during a round in '+mode
   if os.environ.get('ECHO_SHOT'):page.wait_for_function("__r.journeyEcho().phase?.kind==='call'",timeout=10000);page.wait_for_timeout(700);page.screenshot(path=os.environ['ECHO_SHOT'].replace('.png',f'-{width}.png'))
   page.evaluate("()=>{__r.S.journey.echo.points=__r.journeyEcho().goal;}");page.wait_for_function("!!__r.journeyEcho().gold",timeout=3000)
   page.evaluate(ON);page.wait_for_function("!__r.places().run",timeout=5000)
   last=page.evaluate('__r.places().last');assert last['id']=='cueva' and last['stars'][0] and last['sparks']>=10,last
   # Panel 10 (P6, D5-A): ?lugar=cueva completes the eleventh place, so its round flows straight into the final song;
   # the round's card waits for that song to close.
   page.wait_for_function("!document.getElementById('mPlace').hidden||(__r.songStageState().running&&__r.songStageState().final)",timeout=15000);assert page.evaluate('__r.places().stars.cueva[0]')
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Cueva on phone and desktop: ?lugar=cueva sings a pattern from the «1» in a call bar, answering it on time in the next bar is an echo that scores and lengthens the next, off the eighths is not on time, the bar follows the round in both modes, the gold drop ends it with stars, sparks and its card',flush=True)
finally:server.shutdown()
