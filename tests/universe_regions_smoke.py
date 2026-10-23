"""The new regions in the real game: in the Abyss between continents the free World shows Aurora, Cometas, Constelaciones and Nebulosa oscura with their quiet air and their name; the Journey keeps the Void; completing the theme in a constellation joins it, kept after reload."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,sys
ROOT=Path(__file__).resolve().parents[1];SHOTS=os.environ.get('UNIVERSE_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ON="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),own=r.journeyRhythmTarget?.(ac.currentTime),d=own?(own.hit?own.hit.dist:1):Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(d<.02){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
# The centre of a sea region holding the wanted new region, searched on the region grid.
GO="""want=>{const r=__r,W=r.WCH||900;for(let d=1;d<200;d++)for(let a=0;a<32;a++){const x=Math.floor((900+Math.cos(a/32*6.283)*d*W)/W)*W+W/2,y=Math.floor((900+Math.sin(a/32*6.283)*d*W)/W)*W+W/2;if(r.newRegionAt(x,y)?.id===want){r.S.wx=x;r.S.wy=y;return [x,y];}}return null;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r,q=None:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.newRegionAt')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.setJourneyMode('libre');r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.evaluate(hide)
   for rid,name in [('aurora','Aurora'),('cometas','Cometas'),('nebulosa','Nebulosa oscura'),('constelaciones','Constelaciones')]:
    assert page.evaluate(GO,rid),rid;page.wait_for_timeout(1500);page.evaluate(hide);L=page.evaluate('__r.universeLayers()')
    assert L['here']==rid and L['regions'].get(rid,0)>L['cells']*.4 and L['air']==rid and 0<L['airGain']<=.0121,(rid,L)
    page.wait_for_function(f"document.getElementById('zDo').textContent.includes({name!r})",timeout=5000)
    if SHOTS and width==390:page.screenshot(path=f'{SHOTS}/{rid}.png')
   # The theme completed in a constellation joins it, and it stays joined.
   key=page.evaluate("__r.regionOfPos(__r.S.wx,__r.S.wy).key")
   for i in range(6):page.evaluate(ON);page.wait_for_timeout(320)
   page.wait_for_function(f"__r.S.universe?.constellations?.[{key!r}]===true",timeout=8000)
   page.reload();page.wait_for_function('!!window.__r?.newRegionAt');assert page.evaluate(f"__r.S.universe.constellations[{key!r}]")==True
   # The Journey keeps the Void.
   page.evaluate("()=>{"+hide+";__r.setJourneyMode('viaje');}");assert page.evaluate(f"__r.newRegionAt(...{page.evaluate('[__r.S.wx,__r.S.wy]')})")==None
   assert not errors,errors;page.close()
  browser.close()
 print('PASS new regions on phone and desktop: Aurora, Cometas, Nebulosa oscura and Constelaciones in the Abyss with their name and quiet air, a constellation joined by the theme stays joined, the Journey keeps the Void',flush=True)
finally:server.shutdown()
