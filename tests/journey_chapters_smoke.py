"""The Journey's chapters in the real game: entering the World starts the Llanura, the music is held back until you play, six on-time pulses complete the theme (Plenitud), a gold portal opens and walking into it travels to the Lago."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ON="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),d=Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(d<.02){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyChapter')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.journey.colors={};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.wait_for_timeout(500);page.evaluate(hide);page.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000);page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='llanura'",timeout=8000);page.evaluate(hide)
   ch=page.evaluate('__r.journeyChapter()');assert ch['state']=='llegada' and abs(page.evaluate('__r.MU.journeyCap')-.38)<1e-9,ch
   # Six notes on time are not enough: the Llanura asks for its lighthouse and its bars (phase 2).
   for i in range(6):page.evaluate(ON);page.wait_for_timeout(320)
   ch=page.evaluate('__r.journeyChapter()');assert not ch['portal'] and not ch['done'].get('llanura') and ch['progress'].get('bars',0)>0,ch
   assert 0<float(page.evaluate("document.getElementById('barfill').style.width").rstrip('%'))<50,'the bar at the top fills with the stay'
   page.wait_for_function("!!__r.journeyMoments().faro");page.evaluate("()=>{const s=__r.S;s.journey.moments.faro.reached=true;s.journey.progress.llanura.bars=99;}")
   for i in range(6):page.evaluate(ON);page.wait_for_timeout(320)
   page.wait_for_function("__r.journeyChapter().portal");assert not page.evaluate('__r.journeyChapter().portalOpen'),'the portal waits for the theme'
   page.wait_for_function("__r.journeyChapter().portalOpen",timeout=8000);ch=page.evaluate('__r.journeyChapter()');assert ch['done'].get('llanura') and len(ch['notes']['llanura'])==12 and len(ch['notes']['llanura'])==len(page.evaluate('__r.S.journey.steps.llanura')) and ch['state']=='plenitud',ch
   # Walk into the portal: the next chapter, in the Lago.
   page.evaluate("()=>{const r=__r;r.S.wx+=140;r.S.wy-=40;}");page.wait_for_function("__r.journeyChapter().id==='lago'",timeout=5000);page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='lago'",timeout=8000)
   assert page.evaluate('__r.journeyChapter().state')=='llegada'
   page.reload();page.wait_for_function('!!window.__r?.journeyChapter');assert page.evaluate("__r.S.journey.chapter")==2 and page.evaluate("__r.S.journey.done.llanura")==True
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Journey chapters on phone and desktop: the Llanura starts held back, its lighthouse and bars with the theme on time bring Plenitud and, after the theme, a portal, walking in travels to the Lago, kept after reload',flush=True)
finally:server.shutdown()
