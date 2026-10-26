"""«Baila» in the real game: in the Tormenta a circle appears near the cube; on time outside it or off time inside it nothing happens, inside and on time the bolt goes back up and fills the bar; with the bar full the eye of the storm comes beside the cube and a pulse on time closes it, opening the portal to the Vacío."""
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
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyDance')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.journey.colors={};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();r.applyJourneyMode?.();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.wait_for_timeout(500);page.evaluate(hide);page.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000)
   for done,nxt in [('llanura','lago'),('lago','bosque'),('bosque','tormenta')]:
    page.evaluate(f"()=>{{__r.S.journey.done.{done}=true;__r.journeyTravel();}}");page.wait_for_function(f"__r.journeyChapter().id==='{nxt}'",timeout=15000)
   page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='tormenta'&&__r.journeyDance().active&&!!__r.journeyDance().target",timeout=15000);page.evaluate(hide)
   sparks=page.evaluate('__r.S.sparks')
   assert page.evaluate('__r.journeyDance().inside'),'the first circle appears right beside the cube'
   page.evaluate("()=>{__r.S.wx+=300;}");page.evaluate("__r.journeyGamePulse(true)");assert page.evaluate('__r.journeyDance().points')==0,'on time outside the circle: nothing'
   page.evaluate("()=>{const t=__r.journeyDance().target;__r.S.wx=t.x;__r.S.wy=t.y;}");page.wait_for_timeout(200)
   page.evaluate("__r.journeyGamePulse(false)");assert page.evaluate('__r.journeyDance().points')==0,'off time inside: nothing'
   if width==390 and os.environ.get('DANCE_SHOT'):page.screenshot(path=os.environ['DANCE_SHOT'])
   page.evaluate("()=>{const t=__r.journeyDance().target;__r.S.wx=t.x;__r.S.wy=t.y;}");page.evaluate(ON);page.wait_for_function("__r.journeyDance().returned>=1",timeout=5000);assert page.evaluate('__r.journeyDance().points')>=10
   assert float(page.evaluate("document.getElementById('barfill').style.width").rstrip('%'))>0,'the bar fills'
   assert not page.evaluate('__r.S.journey.dance.hinted'),'a suppressed explanation is not marked delivered'
   assert page.evaluate('__r.S.sparks')==sparks
   page.evaluate('__r.$("bGuide").click()');assert page.locator('#guidePlaceLesson').is_visible();assert page.inner_text('#guidePlaceName')=='Tormenta';assert 'rayo' in page.inner_text('#guidePlaceSteps');page.locator('#guideClose').click()
   page.evaluate("()=>{__r.S.journey.dance.points=250;}");page.wait_for_function("!!__r.journeyDance().eye",timeout=3000)
   page.evaluate("__r.journeyGamePulse(false)");assert not page.evaluate('__r.journeyDance().closed')
   page.evaluate(ON);page.wait_for_function("__r.journeyDance().closed&&__r.journeyChapter().done.tormenta",timeout=5000);page.wait_for_function("__r.journeyChapter().portal",timeout=10000)
   page.reload();page.wait_for_function('!!window.__r?.journeyDance');assert page.evaluate("__r.S.journey.done.tormenta")==True and page.evaluate("__r.S.journey.dance.closed")==True
   assert not errors,errors;page.close()
  browser.close()
 print('PASS journey dance on phone and desktop: a circle near the cube, nothing on time outside or off time inside, inside on time the bolt goes back and fills the bar, the eye comes beside the cube and a pulse on time closes it and opens the portal, kept after reload',flush=True)
finally:server.shutdown()
