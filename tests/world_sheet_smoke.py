"""The World as a sheet: in the Journey a new biome is pale and has its light and silhouettes; completing the cube's theme on time there brings its colour back for good; the free World is always in colour."""
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
LOW="()=>{const c=__r.cx,d=c.getTransform().a,h=c.canvas.height,img=c.getImageData(0,Math.round(h*.6),c.canvas.width,Math.round(h*.3)).data;let n=0;for(let i=0;i<img.length;i+=16)if(img[i]+img[i+1]+img[i+2]>12)n++;return n;}"
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.drawWorldSheet')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);s.journey.colors={};r.enterWorld({automatic:true});r.stopAutopilot?.();r.setJourneyMode('viaje');r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.wait_for_timeout(600);page.evaluate(hide)
   st=page.evaluate('__r.worldSheetState()');assert st['pale'] and 'saturate' in page.evaluate("document.getElementById('w').style.filter"),st
   assert page.evaluate(LOW)>40,'light and silhouettes give the lower screen some mass'
   # Six on-time pulses: the theme is complete and the colour of this biome comes back.
   for i in range(6):page.evaluate(ON);page.wait_for_timeout(320)
   page.wait_for_function("!__r.worldSheetState().pale");biome=page.evaluate('__r.worldSheetState().biome');assert page.evaluate('__r.journeyColors()')[biome] and page.evaluate("document.getElementById('w').style.filter")==''
   page.reload();page.wait_for_function('!!window.__r?.journeyColors');assert page.evaluate('__r.journeyColors()')[biome],'kept after a reload'
   # The free World is always in colour.
   page.evaluate("()=>{__r.S.journey.colors={};__r.setJourneyMode('libre');}");page.wait_for_timeout(300);assert not page.evaluate('__r.worldSheetState().pale')
   assert not errors,errors;page.close()
  browser.close()
 print('PASS World sheet on phone and desktop: a new biome is pale with light and silhouettes, completing the theme on time brings its colour back and keeps it, the free World is always in colour',flush=True)
finally:server.shutdown()
