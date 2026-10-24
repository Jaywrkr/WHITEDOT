"""Rhythms (plan F14) in the real game: the Lago as a place counts on the «y», the Cristales on «1 · y · 2» and the
Journey's Tormenta on «1 · 2 · y». A pulse on a step the rhythm counts is on time and its peak sits on that step; on a
step it does not count, even on the beat, it is not. The dots under the cube show the rhythm."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Pulse when a given step of the bar (0–15) is heard, from the steps the music scheduled.
AT_STEP="""(want)=>new Promise(res=>{const r=__r;const tick=()=>{const t=r.ac.currentTime-Math.min(.4,r.ac.outputLatency||r.ac.baseLatency||0);const e=(r.MU.sq||[]).find(q=>q.s%16===want&&t>=q.t-.012&&t<q.t+.03);if(e){r.sonar('player');return res(r.journeyPulseState());}requestAnimationFrame(tick);};tick();})"""
CASES=[('?lugar=lago',"__r.places().run?.id==='lago'",'contra',[2,10],[0,4]),
       ('?lugar=cristales',"__r.places().run?.id==='cristales'",'acorde',[0,2,4],[8,6]),
       ('?capitulo=tormenta',"__r.journeyChapter?.()?.id==='tormenta'",'mezcla',[0,4,6],[8,2])]
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for query,ready,rhythm,good,bad in CASES:
   page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/{query}');page.wait_for_function('!!window.__r?.journeyRhythmState',timeout=20000);page.wait_for_function(ready,timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.MU.sq.length>4",timeout=20000)
   page.wait_for_function(f"__r.journeyRhythmState().rhythm==='{rhythm}'",timeout=15000)
   st=page.evaluate('__r.journeyRhythmState()');assert st['guide'] is True,st
   for step in good:
    p=page.evaluate(AT_STEP,step);assert p['lastOn'] is True and p['lastMark']['step']==step,(query,step,p['lastOn'],p['lastMark'])
    page.wait_for_timeout(160)
   assert page.evaluate('__r.journeyRhythmState().lastHit.step')==good[-1]
   for step in bad:
    p=page.evaluate(AT_STEP,step);assert p['lastOn'] is False,(query,'step',step,'is not in the rhythm')
    page.wait_for_timeout(160)
   if os.environ.get('RHYTHM_SHOT'):page.evaluate(AT_STEP,good[0]);page.wait_for_timeout(80);page.screenshot(path=os.environ['RHYTHM_SHOT'].replace('.png',f'-{rhythm}.png'))
   assert not errors,errors;page.close()
  print('PASS rhythms: the Lago counts the «y», the Cristales «1 · y · 2» and the Tormenta «1 · 2 · y»; pulses on their steps are on time and marked there, on other steps (the beat too) they are not; the guide is shown',flush=True);browser.close()
finally:server.shutdown()
