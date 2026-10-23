"""The theme as a key in the real game (phase 5 of the plan): in the free World, six pulses on time beside the landmark
that is heard from the Origin complete the theme; the landmark answers, the key is kept after a reload and the Journal
lists it."""
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
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.themeKeyPhrase')
  hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
  page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
  page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.evaluate(hide)
  assert page.evaluate('__r.journeyMode()')=='libre'
  # Beside the landmark heard from the Origin.
  page.evaluate("()=>{const r=__r,lm=r.landmarkAt(2,0);r.S.wx=lm.x+60;r.S.wy=lm.y;}");page.wait_for_timeout(600);page.evaluate(hide)
  for i in range(14):
   page.evaluate(ON);page.wait_for_timeout(320)
   if page.evaluate("Object.keys(__r.themeKeys().keys).length"):break
  k=page.evaluate('__r.themeKeys()');assert 'lm:2,0' in k['keys'] and k['answers']>=1,k
  page.reload();page.wait_for_function('!!window.__r?.themeKeys');assert 'lm:2,0' in page.evaluate('__r.themeKeys().keys')
  page.evaluate("()=>{document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);__r.openJournal('places');}");page.wait_for_selector('.key-list')
  assert 'Llaves · 1' in page.inner_text('#journalBody')
  assert not errors,errors;browser.close()
 print('PASS theme as a key: six pulses on time beside a landmark in the free World open its key, kept after reload and listed in the Journal',flush=True)
finally:server.shutdown()
