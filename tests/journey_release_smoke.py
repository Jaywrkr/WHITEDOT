"""«Suelta» in the real game: in the Vacío the cube arrives carrying what stuck in the Llanura; off time nothing, each pulse on time lets one go as a star and the bar fills; with all gone the cube is its size again, its gold light comes beside it and a pulse on time opens the way to the Refugio."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ON1="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,sq=r.MU.sq||[];const lat=ac?(ac.outputLatency||ac.baseLatency||0):0;const e=sq.find(e=>e.s%16===0&&Math.abs(ac.currentTime-lat-e.t)<.02);if(e){r.sonar('player');return res(e.t);}requestAnimationFrame(tick);};tick();})"""
ON="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),d=Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(d<.02){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyRelease')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.journey.colors={};s.journey.stick={gone:Array.from({length:14},(_,i)=>i+',0'),hinted:true};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();r.applyJourneyMode?.();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.wait_for_timeout(500);page.evaluate(hide);page.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000)
   for done,nxt in [('llanura','lago'),('lago','bosque'),('bosque','tormenta'),('tormenta','vacio')]:
    page.evaluate(f"()=>{{__r.S.journey.done.{done}=true;__r.journeyTravel();}}");page.wait_for_function(f"__r.journeyChapter().id==='{nxt}'",timeout=15000)
   page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='vacio'&&__r.journeyRelease().active",timeout=15000);page.evaluate(hide)
   st=page.evaluate('__r.journeyRelease()');assert st['total']==14 and st['released']==0,st
   assert page.evaluate('__r.cubeGrowth()')>2,'the cube arrives carrying what stuck'
   page.evaluate("__r.journeyGamePulse(false)");assert page.evaluate('__r.journeyRelease().released')==0,'off time nothing'
   for i in range(5):page.evaluate("()=>{__r.S.wx+=400;}");page.wait_for_timeout(150);page.evaluate(ON1);page.wait_for_timeout(330)
   st=page.evaluate('__r.journeyRelease()');assert st['released']>=4 and st['stars']==st['released'],st
   assert float(page.evaluate("document.getElementById('barfill').style.width").rstrip('%'))>0,'the bar fills'
   if width==390 and os.environ.get('RELEASE_SHOT'):page.wait_for_timeout(900);page.screenshot(path=os.environ['RELEASE_SHOT'])
   page.evaluate("()=>{for(let i=0;i<20;i++){__r.S.wx+=400;__r.journeyGamePulse(true,{step:0});}}");page.wait_for_function("!!__r.journeyRelease().light",timeout=3000)
   assert abs(page.evaluate('__r.cubeGrowth()')-1)<1e-9,'tiny again'
   page.wait_for_timeout(300);page.evaluate(ON);page.wait_for_function("__r.journeyRelease().lit&&__r.journeyChapter().done.vacio",timeout=5000);page.wait_for_function("__r.journeyChapter().portal",timeout=10000)
   page.reload();page.wait_for_function('!!window.__r?.journeyRelease');assert page.evaluate("__r.S.journey.done.vacio")==True and page.evaluate("__r.S.journey.release.lit")==True
   assert not errors,errors;page.close()
  browser.close()
 print('PASS journey release on phone and desktop: the cube arrives carrying what stuck in the Llanura, off time nothing, each pulse on time lets one go as a star and fills the bar, tiny again its gold light comes and a pulse on time opens the way to the Refugio, kept after reload',flush=True)
finally:server.shutdown()
