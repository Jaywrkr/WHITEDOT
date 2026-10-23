"""Tu canción (plan F7): in the Refugio, a trophy plays its layer; Lugares → «Tu canción» opens eleven rings with the
layers you have won lit and beating, the rest dim, while the World's music waits; with the 33 stars the true finale
brings every layer in, once, and ends on «Las 33 ★»."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ALL="['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva']"
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=20000)
   # A trophy plays its layer, and the World's music waits for it.
   page.evaluate("()=>{__r.landHouse();}");page.wait_for_function("__r.houseActive()&&!__r.houseLanding()&&__r.houseLugaresState().hits.length===12",timeout=10000)
   hit=next(h for h in page.evaluate('__r.houseLugaresState().hits') if h.get('id')=='lago');page.mouse.click(hit['x']+hit['w']/2,hit['y']+hit['h']/2)
   page.wait_for_function("__r.songPlaying()",timeout=3000)
   # Lugares → Tu canción: the five of the Journey lit, the stage on top.
   page.evaluate('__r.openLugares()');page.locator('#lugaresSong').click();page.wait_for_function("__r.songStageState().running",timeout=3000)
   st=page.evaluate('__r.songStageState()');assert st['ids']==['llanura','lago','bosque','tormenta','vacio'] and not st['final'],st
   assert 'Tu canción · 5 de 11' in page.inner_text('#songStage')
   beats=page.evaluate('__r.MU.bq.at(-1)');page.wait_for_timeout(1500);assert page.evaluate('__r.MU.bq.at(-1)')==beats,'the music waits for your song'
   if os.environ.get('SONG_SHOT'):page.screenshot(path=os.environ['SONG_SHOT'].replace('.png',f'-{width}.png'))
   page.locator('#songClose').click();assert not page.evaluate('__r.songStageState().running')
   page.wait_for_function("!__r.songPlaying()",timeout=3000)
   # With the 33 stars: the true finale, once.
   page.evaluate(f"()=>{{for(const id of {ALL})__r.S.lugares.stars[id]=[true,true,true];}}")
   assert page.evaluate('__r.songFinaleCheck()')==True;st=page.evaluate('__r.songStageState()');assert st['final'] and len(st['ids'])==11,st
   assert page.evaluate('__r.songFinaleCheck()')==False,'only once';assert page.evaluate('__r.S.lugares.won')==True
   page.wait_for_function("__r.songStageState().credits",timeout=30000);assert 'Las 33 ★' in page.inner_text('#songStage')
   if os.environ.get('SONG_SHOT'):page.wait_for_timeout(2500);page.screenshot(path=os.environ['SONG_SHOT'].replace('.png',f'-final-{width}.png'))
   page.locator('#songClose').click();assert not page.evaluate('__r.songStageState().running')
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Tu canción on phone and desktop: a trophy plays its layer, «Tu canción» shows eleven rings with the five won layers while the World waits, and the 33 stars bring the true finale once',flush=True)
finally:server.shutdown()
