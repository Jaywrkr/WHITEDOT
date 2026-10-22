"""The Journey's first chapters in the real game: no words on the World's canvas, the Llanura's lighthouse with a voice that grows as you come near and lights when reached, the Lago's lotuses opening to notes on time, and the Bosque's creature that follows you; kept after reload."""
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
GO="""want=>{const r=__r,ids=r.BIOMES.map(b=>b.id);for(let d=1;d<80;d++)for(let a=0;a<16;a++){const x=Math.round(r.S.wx+Math.cos(a/16*6.283)*d*300),y=Math.round(r.S.wy+Math.sin(a/16*6.283)*d*300);if(ids[r.biomeOfPos(x,y)]===want&&!r.regionOfPos(x,y)?.sea){r.S.wx=x;r.S.wy=y;return true;}}return false;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyMoments')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();r.applyJourneyMode();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.evaluate(hide)
   page.wait_for_function("__r.journeyChapter().id==='llanura'&&__r.BIOMES[__r.curZone]?.id==='llanura'",timeout=10000)
   # No words on the World's canvas in the Journey; the free World keeps them.
   INK="()=>{const c=__r.cx;c.save();c.setTransform(1,0,0,1,0,0);c.fillStyle='#000';c.fillRect(0,0,60,60);c.fillStyle='#fff';c.font='48px monospace';c.fillText('X',4,50);const d=c.getImageData(0,0,60,60).data;c.restore();let ink=0;for(let i=0;i<d.length;i+=4)if(d[i]>128)ink++;return ink;}"
   assert page.evaluate(INK)==0,'no words on the World in the Journey'
   page.evaluate("__r.setJourneyMode('libre')");assert page.evaluate(INK)>20,'the free World keeps its words';page.evaluate("__r.setJourneyMode('viaje')")
   assert page.evaluate("getComputedStyle(document.getElementById('voice')).visibility")=='hidden'
   # The lighthouse: placed in the Llanura, louder as you come near, lit when reached.
   page.wait_for_function("!!__r.journeyMoments().faro");far=page.evaluate("__r.journeyMoments()");assert not far['faro']['reached'] and far['tone'],far
   page.evaluate("()=>{const r=__r,f=r.journeyMoments().faro;r.S.wx=f.x;r.S.wy=f.y;}");page.wait_for_function("__r.journeyMoments().faro.reached")
   # The Lago: a note on time next to a lotus opens it.
   page.evaluate("()=>{const r=__r;r.S.journey.chapter=2;r.S.journey.done={...r.S.journey.done,llanura:true};}");page.evaluate(GO,'lago');page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='lago'",timeout=8000);page.evaluate(hide)
   page.wait_for_function("!!__r.journeyMoments().lotos");page.wait_for_timeout(300)
   page.evaluate("()=>{const r=__r,l=r.journeyMoments().lotos;r.S.wx=l.x+170;r.S.wy=l.y;}");page.wait_for_timeout(300);page.evaluate(hide)
   page.evaluate(ON);page.wait_for_function("__r.journeyMoments().lotos.open[0]",timeout=4000)
   assert not page.evaluate("__r.journeyMoments().tone"),'the lighthouse falls silent away from the Llanura'
   # The Bosque: the first note on time brings the creature, which then walks with you.
   page.evaluate("()=>{const r=__r;r.S.journey.chapter=3;r.S.journey.done={...r.S.journey.done,lago:true};}");page.evaluate(GO,'bosque');page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='bosque'",timeout=8000);page.evaluate(hide)
   page.evaluate(ON);page.wait_for_function("__r.journeyMoments().companion",timeout=4000);page.evaluate(ON);page.wait_for_function("__r.journeyMoments().counts.companion>=1",timeout=4000)
   page.reload();page.wait_for_function('!!window.__r?.journeyMoments');m=page.evaluate("__r.S.journey.moments");assert m['faro']['reached'] and m['lotos']['open'][0] and m['companion'],m
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Journey moments on phone and desktop: no words on the World, the Llanura lighthouse sounds nearer and lights when reached, a Lago lotus opens to a note on time, the Bosque creature follows, kept after reload',flush=True)
finally:server.shutdown()
