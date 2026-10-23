"""«Encadena» in the real game: in the Lago, off time nothing lights; a pulse on time beside a cluster of flowers sends a ripple that runs through it as a chain and fills the bar; with the bar full a gold flower comes beside the cube and a pulse on time opens it, opening the portal to the Bosque. No lotuses and no sparks."""
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
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.journeyChain')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.journey.colors={};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.wait_for_timeout(500);page.evaluate(hide);page.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000)
   page.evaluate("()=>{__r.S.journey.done.llanura=true;__r.journeyTravel();}");page.wait_for_function("__r.journeyChapter().id==='lago'&&__r.BIOMES[__r.curZone]?.id==='lago'",timeout=15000);page.evaluate(hide)
   page.wait_for_function("__r.journeyChain().active",timeout=5000);assert page.evaluate('__r.journeyChain().points')==0
   assert not page.evaluate('__r.journeyMoments().lotos'),'no lotuses in the Encadena Lago'
   sparks=page.evaluate('__r.S.sparks')
   # Stand just before the first flower of an unlit cluster of five or more.
   near="""async()=>{const m=await import('./src/journey-chain.js'),r=__r,cx=Math.floor(r.S.wx/m.CHAIN_CELL),cy=Math.floor(r.S.wy/m.CHAIN_CELL),lit=new Set(r.S.journey.chain.lit);
    for(let d=0;d<10;d++)for(let i=cx-d;i<=cx+d;i++)for(let j=cy-d;j<=cy+d;j++){const list=m.cellFlowers(i,j);if(list.length<5||list.some(f=>lit.has(f.id)||r.BIOMES[r.biomeOfPos(f.x,f.y)].id!=='lago'))continue;
     const f=list[0],a=Math.atan2(f.y-list[1].y,f.x-list[1].x);r.S.wx=f.x+Math.cos(a)*90;r.S.wy=f.y+Math.sin(a)*90;return list.length;}return 0;}"""
   n=page.evaluate(near);assert n>=5
   page.evaluate("__r.journeyGamePulse(false)");page.wait_for_timeout(800);assert page.evaluate('__r.journeyChain().points')==0,'off time nothing lights'
   page.evaluate(ON);page.wait_for_function(f"__r.journeyChain().lit>={n}",timeout=8000);st=page.evaluate('__r.journeyChain()')
   assert st['best']>=3 and st['points']>st['lit'],st
   assert float(page.evaluate("document.getElementById('barfill').style.width").rstrip('%'))>0,'the bar fills'
   page.wait_for_function("document.body.textContent.includes('la onda las enciende')",timeout=25000)
   assert page.evaluate('__r.S.sparks')==sparks,'no sparks in the Journey'
   # Full bar: the gold flower comes beside the cube; a pulse on time opens it and the portal opens.
   page.evaluate("()=>{__r.S.journey.chain.points=340;}");page.wait_for_function("!!__r.journeyChain().flower",timeout=3000)
   page.wait_for_function("document.body.textContent.includes('flor dorada')",timeout=25000)
   page.evaluate("__r.journeyGamePulse(false)");assert not page.evaluate('__r.journeyChain().opened'),'off time it waits'
   page.evaluate(ON);page.wait_for_function("__r.journeyChain().opened&&__r.journeyChapter().done.lago",timeout=5000);page.wait_for_function("__r.journeyChapter().portal",timeout=10000)
   page.reload();page.wait_for_function('!!window.__r?.journeyChain');assert page.evaluate("__r.S.journey.done.lago")==True and page.evaluate("__r.S.journey.chain.opened")==True and page.evaluate("__r.S.journey.chain.lit.length")>=n
   assert not errors,errors;page.close()
  browser.close()
 print('PASS journey chain on phone and desktop: off time nothing lights, a pulse on time runs a chain through a cluster and fills the bar, no lotuses or sparks, the gold flower comes beside the cube and a pulse on time opens it and the portal, kept after reload',flush=True)
finally:server.shutdown()
