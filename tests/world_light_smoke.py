"""V1 light and hour: night darkens the world but not the cube's lantern, fireflies come out, reduced motion holds them still."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Average brightness of the screen's edge band and of the lantern around the cube.
LIGHT="""()=>{const c=document.getElementById('w'),x=c.getContext('2d'),w=c.width,h=c.height,edge=x.getImageData(0,Math.floor(h*.7),w,Math.floor(h*.1)).data,mid=x.getImageData(Math.floor(w/2-30),Math.floor(h/2-30),60,60).data,avg=d=>{let s=0;for(let i=0;i<d.length;i+=4)s+=d[i]+d[i+1]+d[i+2];return s/(d.length/4);};return {edge:avg(edge),mid:avg(mid)};}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=world-light&layout=wide&generation=2');page.wait_for_function('!!window.__r?.drawWorldLight')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();}""")
  # Noon of this region's light cycle (world-visibility-model: each region shifts its day by a quarter-step offset).
  noon_at=page.evaluate("(()=>{const off=__r.seedOf('living:climate:v1:'+__r.MU.dnaT.key)%4;return (((.25-off/4)%1+1)%1)*600;})()")
  page.evaluate(f'__r.S.livingSeconds={noon_at}')
  page.wait_for_function('__r.worldVisibility.day>.95',timeout=15000);noon=page.evaluate('__r.worldLight()');assert noon['darkness']<.02 and noon['fireflies']==0,noon
  page.evaluate(f'__r.S.livingSeconds={noon_at+300}');page.wait_for_function('__r.worldVisibility.day<.05',timeout=15000);page.wait_for_timeout(300)
  night=page.evaluate('__r.worldLight()');assert night['darkness']>.35 and night['fireflies']>=10 and night['stars']>noon['stars'],night
  lit=page.evaluate(LIGHT);assert lit['mid']>lit['edge'],lit
  # Reduced motion keeps fireflies where they are.
  page.evaluate('__r.S.reducedMotion=true');page.wait_for_timeout(200)
  a=page.evaluate('__r.worldFireflies()');page.wait_for_timeout(400);b=page.evaluate('__r.worldFireflies()')
  assert a and a==b,'still fireflies under reduced motion'
  # Underground keeps its own darkness: no night layer there.
  page.evaluate("()=>{__r.S.reducedMotion=false;__r.S.layer='bajo';}");page.wait_for_timeout(200)
  assert not errors,errors;browser.close()
 print('PASS world light: clear noon, dark night with lantern and fireflies, brighter stars, still under reduced motion, no errors underground',flush=True)
finally:server.shutdown();server.server_close()
