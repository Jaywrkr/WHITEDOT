"""The Dunas (plan F10): ?lugar=dunas plays a round of «Surfea». A pulse on time inside the ring as its wave passes
rides it; inside the ring on another beat, nothing; the bar follows the round; with the bar full the gold wave comes
and riding it ends the round with its stars, sparks and card."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Stand in the first wave's ring and pulse on time exactly on its beat (or `shift` beats away).
RIDE="""(shift)=>new Promise(res=>{const r=__r,w=r.journeySurf().waves.find(q=>!q.ridden&&(shift||!q.gold||true));r.S.wx=w.x;r.S.wy=w.y;const at=w.at+shift*r.SIX*4;
 const go=()=>{const d=at-r.ac.currentTime;if(d>0.02){setTimeout(go,Math.max(5,(d-0.02)*1000));return;}r.S.wx=w.x;r.S.wy=w.y;res(r.journeyGamePulse(true,{step:0}));};go();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=dunas');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='dunas'",timeout=20000)
   assert page.evaluate('__r.places().count')>=8,'the test save has the eight ★ the Dunas ask'
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.journeySurf().active&&__r.journeySurf().waves.length===2",timeout=20000)
   # Inside the ring but a beat early: nothing. On its beat: a ride, and the cube is carried along.
   assert page.evaluate(RIDE,-1)=='still' and page.evaluate('__r.journeySurf().rides')==0
   assert page.evaluate(RIDE,0)=='ride';s=page.evaluate('__r.journeySurf()');assert s['rides']==1 and s['streak']==1 and s['points']==2,s
   assert page.evaluate(RIDE,0)=='ride' and page.evaluate('__r.journeySurf().points')==5,'the second in a row is worth three'
   page.wait_for_timeout(400)
   if os.environ.get('SURF_SHOT'):page.screenshot(path=os.environ['SURF_SHOT'].replace('.png',f'-{width}.png'))
   for mode in ['viaje','libre']:
    page.evaluate(f"__r.setJourneyMode('{mode}')");page.wait_for_timeout(300);assert page.locator('#bar').is_visible()
   # The bar full: the gold wave, and riding it ends the round.
   page.evaluate("()=>{__r.S.journey.surf.points=__r.journeySurf().goal;}");page.wait_for_function("__r.journeySurf().waves.some(w=>w.gold)",timeout=12000)
   page.wait_for_function("__r.journeySurf().waves.find(w=>!w.ridden)?.gold",timeout=12000);page.evaluate(RIDE,0);page.wait_for_function("!__r.places().run",timeout=5000)
   last=page.evaluate('__r.places().last');assert last['id']=='dunas' and last['stars'][0] and last['sparks']>=60,last
   page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=5000)
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Dunas on phone and desktop: ?lugar=dunas rides a wave only on its beat inside its ring, in a row worth more, the bar follows the round, the gold wave ends it with stars, sparks and its card',flush=True)
finally:server.shutdown()
