"""Tests with people: ?prueba=1 notes on this phone only how the person plays (time per chapter, pulses on time, stillness); ?prueba=ver shows the notes to copy; without it nothing is noted or shown."""
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
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   base=f'http://127.0.0.1:{server.server_port}/'
   # Without the switch: nothing noted, nothing shown.
   page.goto(base);page.wait_for_function('!!window.__r?.playtest');assert page.evaluate('__r.playtest()')=={'on':False,'sessions':0,'current':None};assert page.locator('#mPlaytest').is_hidden()
   page.goto(base+'?prueba=1');page.wait_for_function('!!window.__r?.playtest');assert page.evaluate('__r.playtest().on')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();r.applyJourneyMode?.();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.evaluate(hide);page.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000)
   page.wait_for_timeout(1200)
   for i in range(4):page.evaluate(ON);page.wait_for_timeout(320)
   page.wait_for_timeout(2600)
   cur=page.evaluate('__r.playtest().current');ch=cur['chapters'].get('llanura');assert ch and ch['hits']>=4 and ch['ms']>=1500 and ch['still']>=1500 and 'llanura' in cur['order'],cur
   page.evaluate('__r.playtestWrite()')
   # Another load is another session; ?prueba=ver shows the notes in Spanish, to copy.
   page.goto(base+'?prueba=ver');page.wait_for_function("!document.getElementById('mPlaytest').hidden");text=page.locator('#playtestText').inner_text()
   assert 'Persona 1' in text and 'Llanura' in text and 'a tiempo' in text,text
   ctx.grant_permissions(['clipboard-read','clipboard-write']);page.locator('#playtestCopy').click();page.wait_for_function("document.getElementById('playtestStatus').textContent.length>0")
   page.locator('#playtestClear').click();assert 'Persona' in page.locator('#playtestText').inner_text(),'one touch never clears'
   page.locator('#playtestClear').click();page.wait_for_function("document.getElementById('playtestText').textContent==='Sin pruebas todavía.'");page.locator('#playtestClose').click();assert page.locator('#mPlaytest').is_hidden()
   # Separate place observations record meaningful progress and explicit help, without collecting coordinates.
   page.goto(base+'?lugar=jardin&prueba=1');page.wait_for_function('__r?.placeRun()?.id==="jardin"');page.evaluate(hide)
   page.wait_for_timeout(1100);page.evaluate('__r.$("bGuide").click()');page.wait_for_timeout(1100)
   c=page.evaluate('__r.playtest().current.chapters["ronda:jardin"]');assert c['helps']==1 and c['activeMs']<c['ms'],c
   page.locator('#guideClose').click()
   page.evaluate("()=>{const r=__r,b=r.journeyGarden().spots[0];r.S.wx=b.x;r.S.wy=b.y;for(let i=0;i<5;i++)r.journeyGamePulse(true,{step:0,silent:true,midi:60});r.playtestTick();}")
   c=page.evaluate('__r.playtest().current.chapters["ronda:jardin"]');assert c['firstActionMs'] is not None,c
   # ?prueba=0 stops it; the game's save never holds the notes.
   page.goto(base+'?prueba=0');page.wait_for_function('!!window.__r?.playtest');assert not page.evaluate('__r.playtest().on');assert 'prueba' not in page.evaluate("JSON.stringify(__r.S)")
   assert not errors,errors;ctx.close()
  browser.close()
 print('PASS playtest on phone and desktop: off by default, ?prueba=1 notes time, pulses on time and stillness per chapter, ?prueba=ver shows them to copy, clearing asks twice, ?prueba=0 stops',flush=True)
finally:server.shutdown()
