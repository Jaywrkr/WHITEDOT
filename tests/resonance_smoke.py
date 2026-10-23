"""The Cristales (plan F11): ?lugar=cristales plays a round of «Resuena». A pulse on time near a crystal makes it ring;
off time, nothing; three different notes ringing at once make a chord; with the bar full the gold crystal comes and one
pulse on time ends the round with its stars, sparks and card."""
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
def stand(page,p):page.evaluate(f"()=>{{__r.S.wx={p['x']};__r.S.wy={p['y']};}}")
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=cristales');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='cristales'",timeout=20000)
   assert page.evaluate('__r.places().count')>=12,'the test save has the twelve ★ the Cristales ask'
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.journeyResonance().active",timeout=20000)
   spots=page.evaluate('__r.journeyResonance().spots')
   # Off time near a crystal: nothing rings.
   stand(page,spots[0]);page.evaluate("()=>__r.journeyGamePulse(false,{step:3})");assert page.evaluate('__r.journeyResonance().ringing')==[]
   # On time: it rings; two more notes and the chord.
   page.evaluate(ON);page.wait_for_function("__r.journeyResonance().ringing.includes(0)",timeout=3000)
   stand(page,spots[1]);page.wait_for_timeout(330);page.evaluate(ON);page.wait_for_timeout(200)
   if os.environ.get('RES_SHOT'):page.wait_for_timeout(300);page.screenshot(path=os.environ['RES_SHOT'].replace('.png',f'-{width}.png'))
   stand(page,spots[2]);page.wait_for_timeout(330);page.evaluate(ON);page.wait_for_function("__r.journeyResonance().chords===1",timeout=3000)
   for mode in ['viaje','libre']:
    page.evaluate(f"__r.setJourneyMode('{mode}')");page.wait_for_timeout(300);assert page.locator('#bar').is_visible()
   # The bar full: the gold crystal, and one pulse on time ends the round.
   page.evaluate("()=>{__r.S.journey.resonance.points=__r.journeyResonance().goal;}");page.wait_for_function("!!__r.journeyResonance().gold",timeout=3000)
   page.evaluate(ON);page.wait_for_function("!__r.places().run",timeout=5000)
   last=page.evaluate('__r.places().last');assert last['id']=='cristales' and last['stars'][0] and last['sparks']>=60,last
   page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=5000)
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Cristales on phone and desktop: ?lugar=cristales rings a crystal only on time, three notes make a chord, the bar is seen in both screen modes, the gold crystal ends the round with stars, sparks and its card',flush=True)
finally:server.shutdown()
