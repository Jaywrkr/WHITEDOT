"""The Faros (plan F15): ?lugar=faros plays a round of «Guía». A pulse on the Faros' rhythm («1 · 3 · y») near a boat
lights it; on another step nothing; lit, it follows the cube, and brought into the harbour it docks and fills the bar;
the bar shows in both screen modes; with the bar full the gold boat comes and one pulse on time ends the round."""
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
# Pulse when a given step of the bar is heard (a step the Faros do not count).
AT_STEP="""(want)=>new Promise(res=>{const r=__r;const tick=()=>{const t=r.ac.currentTime-Math.min(.4,r.ac.outputLatency||r.ac.baseLatency||0);const e=(r.MU.sq||[]).find(q=>q.s%16===want&&t>=q.t-.012&&t<q.t+.03);if(e){r.sonar('player');return res(r.journeyPulseState().lastOn);}requestAnimationFrame(tick);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=faros');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='faros'",timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.journeyGuide().active",timeout=20000)
   g=page.evaluate('__r.journeyGuide()');assert g['points']==0 and len(g['boats'])==6,g
   assert page.evaluate('__r.journeyRhythmState()')['rhythm']=='faro'
   b=g['boats'][0];page.evaluate(f"()=>{{__r.S.wx={b['x']}+30;__r.S.wy={b['y']};}}")
   # On the 2, which the Faros do not count, nothing lights; on its rhythm the boat lights.
   assert page.evaluate(AT_STEP,4) is False;page.wait_for_timeout(200);assert not any(x['lit'] for x in page.evaluate('__r.journeyGuide().boats'))
   page.evaluate(ON);page.wait_for_timeout(100);assert any(x['lit'] and x['n']==b['n'] for x in page.evaluate('__r.journeyGuide().boats'))
   # Walk home with it: it follows, and in the harbour it docks.
   c=g['center']
   for k in range(1,13):
    page.evaluate(f"()=>{{__r.S.wx={b['x']+30}+({c['x']}-{b['x']+30})*{k}/12;__r.S.wy={b['y']}+({c['y']}-{b['y']})*{k}/12;}}");page.wait_for_timeout(120)
   page.evaluate(ON);page.wait_for_function("__r.journeyGuide().docked>=1",timeout=8000)
   g=page.evaluate('__r.journeyGuide()');assert g['points']>=4 and len(g['boats'])==6,g
   for mode in ['viaje','libre']:
    page.evaluate(f"__r.setJourneyMode('{mode}')");page.wait_for_timeout(300)
    w=page.evaluate("parseFloat(document.getElementById('barfill').style.width)");p=page.evaluate('__r.journeyGuide().progress')*100;assert abs(w-p)<2,(mode,w,p)
    assert page.locator('#bar').is_visible(),'the bar is seen during a round in '+mode
   if os.environ.get('GUIDE_SHOT'):
    q=page.evaluate('__r.journeyGuide().boats')[1];page.evaluate(f"()=>{{__r.S.wx={q['x']}+40;__r.S.wy={q['y']};}}");page.evaluate(ON);page.wait_for_timeout(700);page.screenshot(path=os.environ['GUIDE_SHOT'].replace('.png',f'-{width}.png'))
   page.evaluate("()=>{__r.S.journey.guide.points=__r.journeyGuide().goal;}");page.wait_for_function("!!__r.journeyGuide().gold",timeout=3000)
   page.evaluate(ON);page.wait_for_function("!__r.places().run",timeout=5000)
   last=page.evaluate('__r.places().last');assert last['id']=='faros' and last['stars'][0] and last['sparks']==0,last
   page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=15000);assert page.evaluate('__r.places().stars.faros[0]')
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Faros on phone and desktop: ?lugar=faros lights a boat only on its rhythm, lit it follows the cube and docks in the harbour, the bar follows the round in both screen modes, the gold boat ends it with stars and its card, no sparks (H1)',flush=True)
finally:server.shutdown()
