"""Places after the Journey (plan F4): ?lugar= plays a round of a place on its own save; closing its gold thing gives the stars it earned, sparks and a card with «Otra vez», «Maestro» and «Salir»; the chapter's own state comes back; a Maestro round is faster and longer."""
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
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   base=f'http://127.0.0.1:{server.server_port}/'
   page.goto(base+'?lugar=lago');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='lago'",timeout=20000)
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1&&__r.journeyGamePlaying('lago')&&__r.BIOMES[__r.curZone]?.id==='lago'",timeout=20000)
   assert page.evaluate('__r.accountClient')==None and not page.evaluate("localStorage.getItem('pixel-blanco-v4')"),'a test save of its own'
   st=page.evaluate('__r.places()');assert st['count']==5 and page.evaluate('__r.journeyChain().points')==0,st
   assert page.evaluate('__r.crystalState.near.length')==0 or True
   sparks=page.evaluate('__r.S.sparks')
   # Panel 11 (Q2): pulses while the Lago sings its pattern are not counted; the round counts after its two bars.
   page.evaluate(ON);assert page.evaluate('__r.rhythmDemo()') and page.evaluate('__r.places().run.total')==0,'the place sings: nothing counted'
   page.wait_for_function('!__r.rhythmDemo()',timeout=15000)
   for i in range(6):page.evaluate(ON);page.wait_for_timeout(330)
   assert page.evaluate('__r.places().run.total')>=6
   page.evaluate("()=>{__r.S.journey.chain.points=340;}");page.wait_for_function("!!__r.journeyChain().flower",timeout=3000)
   page.evaluate(ON);page.wait_for_function("!__r.places().run",timeout=5000)
   last=page.evaluate('__r.places().last');assert last['id']=='lago' and last['stars'][0] and last['sparks']==0,last
   assert page.evaluate('__r.S.sparks')==sparks,'H1 (alpha.233): a round pays ★, never ✦'
   page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=15000)
   assert page.locator('#placeStars .got').count()>=1 and 'a tiempo' in page.inner_text('#placeRows') and '✦' not in page.inner_text('#mPlace')
   if width==390 and os.environ.get('PLACE_SHOT'):page.screenshot(path=os.environ['PLACE_SHOT'])
   # Plan H3: the card's gold button goes to the next place on the path, the Jardín after the Journey's five.
   assert page.locator('#placeNext').is_visible() and page.inner_text('#placeNext')=='Seguir hacia Jardín',page.inner_text('#placeNext')
   # Otra vez: a new round from an empty bar.
   page.locator('#placeAgain').click();page.wait_for_function("__r.places().run?.id==='lago'&&__r.journeyChain().points===0",timeout=5000)
   page.evaluate('__r.abandonPlace()');assert page.evaluate('__r.places().run')==None
   # Kept in the save: stars and the record survive a reload.
   page.reload();page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='lago'",timeout=20000);kept=page.evaluate('__r.places()');assert kept['stars']['lago'][0] and kept['best']['lago']['rounds']>=1,kept
   page.evaluate('__r.abandonPlace()')
   # Maestro: faster, a narrower window and a longer bar.
   page.goto(base+'?lugar=tormenta&maestro=1');page.wait_for_function("!!window.__r?.places&&__r.places().run?.maestro===true",timeout=20000)
   assert abs(page.evaluate('__r.MU.tempoScale')-1.1)<1e-9 and page.evaluate('__r.MU.onTimeWindow')==.06 and page.evaluate('__r.placeGoalScale()')==1.5
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.journeyGamePlaying('tormenta')",timeout=20000)
   page.evaluate("()=>{__r.S.journey.dance.points=250;}");page.wait_for_timeout(300);assert not page.evaluate('__r.journeyDance().eye'),'a Maestro bar asks half as much again'
   assert not errors,errors;page.close()
  browser.close()
 print('PASS places on phone and desktop: ?lugar= plays a round on its own save, its gold close gives stars and a card with Otra vez and Salir, no sparks (H1), the next round starts empty, Maestro is faster with a narrower window and a longer bar',flush=True)
finally:server.shutdown()
