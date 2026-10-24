"""«Pégate» in the real game: in the Llanura, a pulse on time next to something sticks it and fills the bar; off time nothing moves; with the bar full a gold cloud comes beside the cube and a pulse on time swallows it, opening the portal to the Lago. «?faro=1» keeps the old lighthouse."""
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
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyStick')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.journey.colors={};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.wait_for_timeout(500);page.evaluate(hide);page.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000);page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='llanura'",timeout=8000);page.evaluate(hide)
   page.wait_for_function("__r.journeyStick().active",timeout=5000);st=page.evaluate('__r.journeyStick()');assert st['points']==0 and not st['swallowed'] and st['cloud'] is None,st
   assert not page.evaluate('__r.journeyMoments().faro'),'no lighthouse in the Pégate Llanura'
   sparks=page.evaluate('__r.S.sparks')
   # Stand next to the nearest thing: off time nothing moves; on time it sticks and fills the bar by its value.
   near="""async()=>{const m=await import('./src/journey-stick.js'),r=__r,cx=Math.floor(r.S.wx/m.STICK_CELL),cy=Math.floor(r.S.wy/m.STICK_CELL),taken=new Set(r.S.journey.stick.gone);let best=null;
    for(let i=cx-6;i<=cx+6;i++)for(let j=cy-6;j<=cy+6;j++){const it=m.cellItem(i,j);if(!it||taken.has(it.id)||r.BIOMES[r.biomeOfPos(it.x,it.y)].id!=='llanura')continue;const d=Math.hypot(it.x-r.S.wx,it.y-r.S.wy);if(!best||d<best.d)best={...it,d};}
    r.S.wx=best.x+4;r.S.wy=best.y;return best.id;}"""
   page.evaluate(near);before=page.evaluate('__r.journeyStick()');page.evaluate("__r.journeyGamePulse(false)");after=page.evaluate('__r.journeyStick()')
   assert after['points']==0 and after['near']==before['near'] and after['misses']==1,after
   grew=0
   for i in range(4):
    page.evaluate(near);b=page.evaluate('__r.journeyStick().points');page.evaluate(ON);page.wait_for_timeout(320);grew+=page.evaluate('__r.journeyStick().points')>b
   st=page.evaluate('__r.journeyStick()');assert grew>=3 and st['points']>0 and st['stuck']>=3,st
   assert float(page.evaluate("document.getElementById('barfill').style.width").rstrip('%'))>0,'the bar fills'
   page.wait_for_function("__r.journeyStick().attached>=3",timeout=3000);page.wait_for_timeout(1500);assert not page.evaluate("document.body.textContent.includes('se pega')"),'the Journey has no lines (plan H5)'
   assert page.evaluate('__r.S.sparks')==sparks,'no sparks in the Journey'
   # Full bar: the gold cloud comes beside the cube; one pulse on time swallows it and the portal to the Lago opens.
   page.evaluate("()=>{__r.S.journey.stick.points=150;}");page.wait_for_function("!!__r.journeyStick().cloud",timeout=3000)
   c=page.evaluate('__r.journeyStick().cloud');assert ((c['x']-page.evaluate('__r.S.wx'))**2+(c['y']-page.evaluate('__r.S.wy'))**2)**.5<120,c
   page.wait_for_timeout(1500);assert not page.evaluate("document.body.textContent.includes('nube dorada')"),'the Journey has no lines (plan H5)'
   page.evaluate("__r.journeyGamePulse(false)");assert not page.evaluate('__r.journeyStick().swallowed'),'off time it waits'
   page.evaluate(ON);page.wait_for_function("__r.journeyStick().swallowed&&__r.journeyChapter().done.llanura",timeout=5000);page.wait_for_function("__r.journeyChapter().portal",timeout=10000)
   # The drop (plan F2): the music's filter closes for the riser and opens again; the portal waits for the drop.
   lp0=page.evaluate('__r.fx.lp.frequency.value');page.wait_for_function("__r.journeyChapter().portalOpen",timeout=15000);assert page.evaluate('__r.fx.lp.frequency.value')>=min(2000,lp0)-1,'the filter opens again after the drop'
   page.reload();page.wait_for_function('!!window.__r?.journeyStick');assert page.evaluate("__r.S.journey.done.llanura")==True and page.evaluate("__r.S.journey.stick.swallowed")==True
   assert not errors,errors;page.close()
  browser.close()
 print('PASS journey stick on phone and desktop: off time nothing moves, on time things stick and fill the bar, no sparks in the Journey, the full bar brings the gold cloud beside the cube and a pulse on time swallows it and opens the portal, kept after reload',flush=True)
finally:server.shutdown()
