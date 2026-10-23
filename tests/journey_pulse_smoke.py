"""Playing on time in the real game: a pulse on the beat plays the cube's theme and vibrates, one off the beat only sounds, six on time complete the phrase, the Line is drawn, and vibration can be turned off and stays off."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ON="""()=>new Promise(res=>{const r=__r,want=%s;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),d=Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(want?d<.02:d>.12&&d<.2){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("window.__vib=[];Object.defineProperty(navigator,'vibrate',{value:p=>{__vib.push(p);return true;},configurable:true});")
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyPulse')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.evaluate(hide)
   # Off the beat: it sounds, but no theme note and no vibration.
   page.evaluate(ON%'false');page.wait_for_timeout(300);s=page.evaluate('__r.journeyPulseState()');assert s['misses']==1 and s['hits']==0 and page.evaluate('__vib.length')==0,s
   # Six on the beat: the theme plays note by note and the phrase completes.
   for i in range(6):
    page.evaluate(ON%'true');m=page.evaluate('__r.journeyPulseState().lastMark');page.wait_for_timeout(320)
    assert m['on'] and m['step']%4==0,('an on-time peak sits on a beat of the Line',m)
   s=page.evaluate('__r.journeyPulseState()');assert s['hits']==6 and s['phrases']==1 and len(s['notes'])==6,s;assert page.evaluate('__vib.length')==6
   # The Line: a band of light across the lower part of the screen.
   lit=page.evaluate("()=>{const c=__r.cx,d=c.getTransform().a,y=Math.round(__r.H*.8*d),img=c.getImageData(0,y-6*d,c.canvas.width,12*d).data;let n=0;for(let i=0;i<img.length;i+=4)if(img[i]+img[i+1]+img[i+2]>150)n++;return n;}")
   assert lit>20,lit
   # Vibration off, and it stays off after a reload.
   page.evaluate(hide);page.locator('#bMenu').click();page.locator('#bSettings').click();assert page.locator('#haptics').is_checked();page.locator('#haptics').uncheck();assert page.evaluate('__r.S.haptics')==False
   page.reload();page.wait_for_function('!!window.__r?.journeyPulse');assert page.evaluate('__r.S.haptics')==False
   assert not errors,errors;page.close()
  browser.close()
 print('PASS playing on time on phone and desktop: off-beat pulse only sounds, six on-beat pulses play the theme and complete the phrase with vibration, the Line is drawn, vibration off is kept',flush=True)
finally:server.shutdown()
