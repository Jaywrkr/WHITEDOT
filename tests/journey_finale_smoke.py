"""The Journey's finale in the real game: after the Vacío the portal leads to the Refugio, which plays your journey back with the cube's voice, turns the sky gold, shows the credits and opens the free World, kept after reload. Also checks the Tormenta's bolts and the Vacío's echoes on the beat."""
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
   page.goto(f'http://127.0.0.1:{server.server_port}/?faro=1');page.wait_for_function('!!window.__r?.journeyFinale')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   # A Journey in the Tormenta, with notes kept from earlier chapters.
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=4;s.journey.done={llanura:true,lago:true,bosque:true};s.journey.notes={llanura:[57,59,64],lago:[60,62],bosque:[55,57]};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.evaluate(hide)
   page.wait_for_function("__r.journeyChapter().id==='tormenta'");page.wait_for_function("__r.journeyChapter().beacon||__r.BIOMES[__r.curZone]?.id==='tormenta'",timeout=8000)
   # Go to the Tormenta (the beacon knows where) and play: each note on time brings a bolt.
   page.evaluate("()=>{const r=__r,ids=r.BIOMES.map(b=>b.id);for(let d=1;d<80;d++)for(let a=0;a<16;a++){const x=Math.round(r.S.wx+Math.cos(a/16*6.283)*d*300),y=Math.round(r.S.wy+Math.sin(a/16*6.283)*d*300);if(ids[r.biomeOfPos(x,y)]==='tormenta'&&!r.regionOfPos(x,y)?.sea){r.S.wx=x;r.S.wy=y;return;}}}")
   page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='tormenta'",timeout=8000);page.evaluate(hide);page.evaluate("__r.S.journey.progress.tormenta={bars:99}")
   for i in range(6):page.evaluate(ON);page.wait_for_timeout(320)
   page.wait_for_function("__r.journeyChapter().portalOpen",timeout=12000);m=page.evaluate('__r.journeyChapter().moments');assert m['bolts']>=6,m
   page.evaluate("()=>{const r=__r,p=r.journeyChapter().portal;r.S.wx=p.x;r.S.wy=p.y;}");page.wait_for_function("__r.journeyChapter().id==='vacio'",timeout=5000);page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='vacio'",timeout=8000);page.evaluate(hide)
   assert abs(page.evaluate('__r.MU.journeyCap')-.1)<1e-9;page.evaluate("__r.S.journey.progress.vacio={bars:99}")
   # In the Vacío the creatures repeat your notes after eight; the theme completes after twelve.
   for i in range(12):page.evaluate(ON);page.wait_for_timeout(320)
   page.wait_for_function("__r.journeyChapter().portalOpen",timeout=16000);assert page.evaluate('__r.journeyChapter().moments.echoes')>=4
   page.evaluate("()=>{const r=__r,p=r.journeyChapter().portal;r.S.wx=p.x;r.S.wy=p.y;}");page.wait_for_function("__r.journeyFinaleState().running",timeout=5000)
   assert page.is_visible('#journeyFinale');st=page.evaluate('__r.journeyFinaleState()');assert st['notes']>=7+12,st
   # Only the finale sounds: the World's music stops counting beats and the hint stays away.
   beats=page.evaluate('__r.MU.bq.at(-1)');page.wait_for_timeout(3000);assert page.evaluate('__r.MU.bq.at(-1)')==beats,'the music waits for the finale';assert not page.evaluate('__r.journeyHint().showing')
   shot=page.evaluate("()=>{const c=document.querySelector('#journeyFinale canvas'),x=c.getContext('2d').getImageData(0,0,c.width,c.height*.4|0).data;let gold=0;for(let i=0;i<x.length;i+=16)if(x[i]>x[i+2]+4)gold++;return gold;}");assert shot>50,'the sky turns gold'
   if os.environ.get('FINALE_SHOT'):page.wait_for_timeout(6000);page.screenshot(path=os.environ['FINALE_SHOT'].replace('.png',f'-{width}.png'))
   page.wait_for_function("__r.journeyFinaleState().credits",timeout=40000);assert 'Tu mundo se abrió' in page.inner_text('#journeyFinale') and 'Kubono' not in page.inner_text('#journeyFinale'),'P6 (D5-C): only «Tu mundo se abrió»; the credits come at the eleven'
   assert page.locator('#journeyExplore').is_visible(),'Explorar opens the World at once'
   if os.environ.get('FINALE_SHOT'):page.wait_for_timeout(3000);page.screenshot(path=os.environ['FINALE_SHOT'].replace('.png',f'-end-{width}.png'))
   page.locator('#journeyExplore').click()
   page.wait_for_function("!__r.journeyFinaleState().running",timeout=15000);assert not page.is_visible('#journeyFinale')
   assert page.evaluate("__r.S.journey.finished")==True and page.evaluate("__r.journeyMode()")=='libre'
   # The free World unveils itself: its counters fade in and the menu marks it has new things until it is opened
   # (the finale lands in the Refugio; the menu is outside it).
   assert page.evaluate('__r.inWorld()'),'the explicit explore action leaves the Refugio on foot'
   assert page.evaluate("document.getElementById('bMenu').classList.contains('has-new')")
   page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.wait_for_function("document.body.classList.contains('journey-unveil')",timeout=5000);assert page.evaluate('__r.ringRoute().id')=='jardin'
   # And the sparks earned on the way: Tu cubo is marked, without a notice (plan I1: no text before the first portal).
   page.wait_for_function("document.getElementById('bCube').classList.contains('has-new')",timeout=30000);page.wait_for_timeout(3000);assert 'Tu cubo' not in page.evaluate("document.getElementById('toast').textContent");assert page.evaluate("document.getElementById('bCube').classList.contains('has-new')") and page.evaluate('__r.S.journey.sparksHint')==True
   page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.wait_for_function("!document.getElementById('bMenu').classList.contains('has-new')")
   page.reload();page.wait_for_function('!!window.__r?.journeyFinale');assert page.evaluate("__r.S.journey.finished")==True and page.evaluate("__r.journeyMode()")=='libre'
   assert not page.evaluate("document.body.classList.contains('journey-quiet')")
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Journey finale on phone and desktop: bolts on the beat in the Tormenta, echoes in the Vacío, the Refugio plays your journey with a gold sky and credits, the free World opens and stays open',flush=True)
finally:server.shutdown()
