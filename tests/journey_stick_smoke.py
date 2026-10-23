"""«Pégate» in the real game: in the Llanura, a pulse on time next to something small sticks it to the cube and the cube grows; off time it bounces away; at full size the cube swallows the giant and the portal to the Lago opens. «?faro=1» keeps the old lighthouse."""
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
   page.wait_for_function("__r.journeyStick().active&&!!__r.journeyStick().giant",timeout=5000);st=page.evaluate('__r.journeyStick()');assert st['size']==3 and not st['swallowed'],st
   assert not page.evaluate('__r.journeyMoments().faro'),'no lighthouse in the Pégate Llanura'
   # Stand on the nearest small thing and pulse on time: it sticks, the cube grows and the bar fills.
   near="""async()=>{const m=await import('./src/journey-stick.js'),r=__r,cx=Math.floor(r.S.wx/m.STICK_CELL),cy=Math.floor(r.S.wy/m.STICK_CELL),taken=new Set(r.S.journey.stick.gone);let best=null;
    for(let i=cx-6;i<=cx+6;i++)for(let j=cy-6;j<=cy+6;j++){const it=m.cellItem(i,j);if(!it||it.value!==1||taken.has(it.id)||r.BIOMES[r.biomeOfPos(it.x,it.y)].id!=='llanura')continue;const d=Math.hypot(it.x-r.S.wx,it.y-r.S.wy);if(!best||d<best.d)best={...it,d};}
    r.S.wx=best.x+4;r.S.wy=best.y;return best.id;}"""
   grew=0
   for i in range(4):
    page.evaluate(near);before=page.evaluate('__r.journeyStick().size');page.evaluate(ON);page.wait_for_timeout(320);grew+=page.evaluate('__r.journeyStick().size')>before
   st=page.evaluate('__r.journeyStick()');assert grew>=3 and st['size']>3 and st['stuck']>=3,st
   assert float(page.evaluate("document.getElementById('barfill').style.width").rstrip('%'))>0,'the bar fills as the cube grows'
   page.wait_for_function("__r.journeyStick().attached>=3",timeout=3000);page.wait_for_function("document.body.textContent.includes('se pega')",timeout=5000)
   # Off the beat: a boing, nothing sticks.
   page.evaluate(near);size=page.evaluate('__r.journeyStick().size');page.evaluate("__r.journeyStickPulse(false)");st=page.evaluate('__r.journeyStick()');assert st['size']==size and st['boings']>=1,st
   # Big enough: walking into the giant swallows it and the portal to the Lago opens; kept after reload.
   page.evaluate("()=>{const s=__r.S.journey.stick;s.size=40;const g=s.giant;__r.S.wx=g.x;__r.S.wy=g.y;}")
   page.wait_for_function("__r.journeyStick().swallowed&&__r.journeyChapter().done.llanura",timeout=5000);page.wait_for_function("__r.journeyChapter().portal",timeout=10000)
   page.reload();page.wait_for_function('!!window.__r?.journeyStick');assert page.evaluate("__r.S.journey.done.llanura")==True and page.evaluate("__r.S.journey.stick.swallowed")==True
   assert not errors,errors;page.close()
  browser.close()
 print('PASS journey stick on phone and desktop: in the Llanura a pulse on time sticks small things and the cube grows with the bar, off time bounces, the full cube swallows the giant and the portal opens, kept after reload',flush=True)
finally:server.shutdown()
