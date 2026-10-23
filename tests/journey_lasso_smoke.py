"""«Rodea» in the real game: in the Bosque the cube leaves a trail; walking around a group of fireflies closes it and a pulse on time catches them all (off time nothing); with the bar full the creature comes beside the cube and a pulse on time makes it the companion, opening the portal to the Tormenta."""
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
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyLasso')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.journey.colors={};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.wait_for_timeout(500);page.evaluate(hide);page.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000)
   page.evaluate("()=>{__r.S.journey.done.llanura=true;__r.journeyTravel();}");page.wait_for_function("__r.journeyChapter().id==='lago'",timeout=15000)
   page.evaluate("()=>{__r.S.journey.done.lago=true;__r.journeyTravel();}");page.wait_for_function("__r.journeyChapter().id==='bosque'&&__r.BIOMES[__r.curZone]?.id==='bosque'",timeout=15000);page.evaluate(hide)
   page.wait_for_function("__r.journeyLasso().active",timeout=5000);assert page.evaluate('__r.journeyLasso().points')==0
   assert not page.evaluate('__r.journeyMoments().companion'),'the creature waits for the end of the Bosque'
   # Walk a circle around the nearest whole group of fireflies.
   group="""async()=>{const m=await import('./src/journey-lasso.js'),r=__r,cx=Math.floor(r.S.wx/m.LASSO_CELL),cy=Math.floor(r.S.wy/m.LASSO_CELL);
    for(let d=0;d<10;d++)for(let i=cx-d;i<=cx+d;i++)for(let j=cy-d;j<=cy+d;j++){const g=m.cellFireflies(i,j);if(g.length<3||g.some(f=>r.BIOMES[r.biomeOfPos(f.x,f.y)].id!=='bosque'))continue;
     const x=g.reduce((a,f)=>a+f.x,0)/g.length,y=g.reduce((a,f)=>a+f.y,0)/g.length;window.__g={x,y,n:g.length};return g.length;}return 0;}"""
   circle="""async()=>{const r=__r,g=window.__g;for(let i=0;i<=48;i++){const a=i/48*6.283;r.S.wx=g.x+Math.cos(a)*110;r.S.wy=g.y+Math.sin(a)*110;await new Promise(f=>requestAnimationFrame(f));}}"""
   n=page.evaluate(group);assert n>=3
   page.evaluate(circle);st=page.evaluate('__r.journeyLasso()');assert st['closed'] and st['inside']==n,st
   page.evaluate("__r.journeyGamePulse(false)");assert page.evaluate('__r.journeyLasso().points')==0,'off time nothing'
   if width==390 and os.environ.get('LASSO_SHOT'):page.screenshot(path=os.environ['LASSO_SHOT'])
   page.evaluate(ON);page.wait_for_function(f"__r.journeyLasso().caught>={n}",timeout=5000);st=page.evaluate('__r.journeyLasso()');assert st['points']==min(5,n)*n,st
   assert float(page.evaluate("document.getElementById('barfill').style.width").rstrip('%'))>0,'the bar fills'
   assert page.evaluate('__r.S.journey.lasso.hinted'),'the rule is told once'
   # Full bar: the creature comes beside the cube; a pulse on time makes it the companion and opens the portal.
   page.evaluate("()=>{__r.S.journey.lasso.points=100;}");page.wait_for_function("!!__r.journeyLasso().friend",timeout=3000)
   page.evaluate("__r.journeyGamePulse(false)");assert not page.evaluate('__r.journeyLasso().joined'),'off time it waits'
   page.evaluate(ON);page.wait_for_function("__r.journeyLasso().joined&&__r.journeyChapter().done.bosque&&__r.journeyMoments().companion",timeout=5000);page.wait_for_function("__r.journeyChapter().portal",timeout=10000)
   page.reload();page.wait_for_function('!!window.__r?.journeyLasso');assert page.evaluate("__r.S.journey.done.bosque")==True and page.evaluate("__r.S.journey.lasso.joined")==True and page.evaluate("__r.S.journey.moments.companion")==True
   assert not errors,errors;page.close()
  browser.close()
 print('PASS journey lasso on phone and desktop: walking around fireflies closes the trail, off time nothing, a pulse on time catches them all and fills the bar, the creature comes beside the cube and a pulse on time makes it the companion and opens the portal, kept after reload',flush=True)
finally:server.shutdown()
