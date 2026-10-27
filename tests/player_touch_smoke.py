"""Play as a real player on a phone: a browser that is not marked as automated (so the Journey, the real touch controls
and the automatic quality are on), real touch events and no runtime shortcuts. The finger dismisses the greeting, walks
the Camino, breaks its ten crystals with taps on the beat (one per tap; an offbeat tap breaks none) and reaches the
World. A ghost finger shows the gestures after four quiet seconds. Then one failing frame must not freeze the game."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Counts animation frames that actually ran, so a stopped game loop shows up as zero.
FRAMES="""(()=>{const raf=window.requestAnimationFrame.bind(window);window.__frames=0;window.requestAnimationFrame=cb=>raf(t=>{window.__frames++;cb(t);});})();"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});"+FRAMES)
  # Only exposes the runtime for reading; the account gate and everything else run as for a player.
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyMode');page.wait_for_timeout(800)
  state=lambda:page.evaluate("({mode:__r.S.mode,journey:__r.journeyMode(),px:__r.S.px,inWorld:__r.inWorld(),crystals:(__r.S.pathCrystals||[]).length,finger:!!__r.fingerTouch})")
  s=state();assert s['journey']=='viaje' and s['mode']=='camino' and not s['finger'],s
  cdp=context.new_cdp_session(page)
  def touch(kind,x=0,y=0):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if kind=='touchEnd' else [{'x':x,'y':y}]})
  def tap():touch('touchStart',195,422);page.wait_for_timeout(60);touch('touchEnd');page.wait_for_timeout(260)
  # Milliseconds until the next beat the player hears (the audio clock minus the output latency).
  NEXT="""()=>{const r=__r,ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(!ac||!bq.length)return null;const heard=ac.currentTime-Math.min(.4,ac.outputLatency||ac.baseLatency||0);let b=bq[bq.length-1];while(b<heard+.12)b+=bar;for(const x of bq)if(x>heard+.12&&x<b)b=x;return (b-heard)*1000;}"""
  def beat_tap(off=0):
   ms=None
   for _ in range(40):
    ms=page.evaluate(NEXT)
    if ms is not None:break
    page.wait_for_timeout(100)
   page.wait_for_timeout(max(0,ms-12+off));tap()
  def walk(steps=12):
   touch('touchStart',195,422)
   for i in range(steps):touch('touchMove',195+i*6,422);page.wait_for_timeout(60)
   page.wait_for_timeout(300);touch('touchEnd');page.wait_for_timeout(120)
  tap()   # the first touch starts the music (the Journey has no greeting); before a beat it breaks nothing
  before=state()['px'];walk();assert state()['px']>before+100,('a held finger walks the cube',before,state())
  # The music has started; a tap between beats breaks no crystal in the Journey, a tap on the beat breaks one.
  page.wait_for_function('__r.ac?.state==="running"&&__r.MU.bq.length>1',timeout=10000)
  beat_tap(off=int(page.evaluate('__r.SIX*2000')));assert state()['crystals']==0,('an offbeat tap breaks nothing',state());assert page.evaluate('__r.crystalState.misses')>=1,'but the crystal shivers: it was touched'
  for _ in range(6):
   if state()['crystals']>=1:break
   beat_tap()
  assert state()['crystals']==1,('a tap on the beat breaks one crystal',state())
  # Four seconds without touching: the ghost finger shows the way, and leaves at the first touch.
  page.wait_for_timeout(4300);assert page.evaluate('__r.journeyHint().showing'),'the ghost finger'
  touch('touchStart',195,422);touch('touchEnd');assert not page.evaluate('__r.journeyHint().showing')
  for _ in range(80):
   if state()['inWorld']:break
   walk(8);beat_tap()
  s=state();assert s['inWorld'] and s['crystals']>=10,('ten crystals open the World',s)
  # In the World a finger that rests (the scanner opens at 0.5 s) and then moves still walks the cube.
  page.wait_for_timeout(600);x0=page.evaluate('__r.S.wx');touch('touchStart',195,422);page.wait_for_timeout(700)
  for i in range(16):touch('touchMove',195+i*8,422);page.wait_for_timeout(60)
  page.wait_for_timeout(500);touch('touchEnd');page.wait_for_timeout(200)
  moved=page.evaluate('__r.S.wx')-x0;assert moved>100,('a resting finger that moves walks',moved);assert not page.evaluate('!!__r.scanning'),'the scanner closed'
  # One frame that throws must not freeze the game: frames keep coming and the error reaches the error log.
  page.evaluate("()=>{const c=__r.cx,fill=c.fillRect;c.fillRect=function(){c.fillRect=fill;throw new Error('fase0: one failing frame');};}")
  page.wait_for_timeout(300);start=page.evaluate('window.__frames');page.wait_for_timeout(1500);ran=page.evaluate('window.__frames')-start
  assert ran>=15,('the game loop survives a failing frame',ran)
  assert 'fase0: one failing frame' in page.evaluate("localStorage.getItem('kubono:errores')||''"),'the error is still recorded'
  errors=[e for e in errors if 'fase0: one failing frame' not in e];assert not errors,errors
  browser.close()
 print('PASS a real player on a phone: Journey by default, real touch walks the Camino, taps on the beat break its ten crystals one at a time (offbeat taps none), a ghost finger after four quiet seconds, a resting finger still walks, and a failing frame does not freeze the game',flush=True)
finally:server.shutdown()
