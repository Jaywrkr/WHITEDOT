"""The festival build in the real game (?festival=1): no account, Journey only, its own save that never touches the player's game, the Lago's Plenitud ends it in the Refugio with your phrase, and «Otra persona» starts again. Also the colour-blind palette from Ajustes."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ON="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),d=Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(d<.02){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
MAIN=json.dumps({'mark':'player-save'})
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   base=f'http://127.0.0.1:{server.server_port}/'
   page.goto(base+'tests/');page.evaluate(f"localStorage.setItem('pixel-blanco-v4',{json.dumps(MAIN)})")
   page.goto(base+'?festival=1');page.wait_for_function('!!window.__r?.festival')
   assert page.evaluate('__r.festival') and page.evaluate('__r.accountClient')==None,'no account in the festival'
   assert page.evaluate("document.body.classList.contains('festival')&&document.body.classList.contains('journey-quiet')")
   assert page.is_hidden('#mAccount') if page.locator('#mAccount').count() else True
   page.evaluate("()=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__r.$('mMenu').hidden=false;}")
   assert not page.is_visible('#bJourneyMode') and not page.is_visible('#bConnection'),'no mode switch or account in the menu'
   page.evaluate("__r.$('mMenu').hidden=true")
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   # Into the Lago, chapter 2, with notes from the Llanura.
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.chapter=2;s.journey.done={llanura:true};s.journey.notes={llanura:[57,59,64,62,60,57]};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);page.evaluate(hide)
   assert page.evaluate("JSON.parse(localStorage.getItem('kubono:festival')).journey.chapter")==2,'the festival keeps its own save'
   assert page.evaluate("localStorage.getItem('pixel-blanco-v4')")==MAIN,"the player's save is untouched"
   page.evaluate("()=>{const r=__r,ids=r.BIOMES.map(b=>b.id);for(let d=1;d<80;d++)for(let a=0;a<16;a++){const x=Math.round(r.S.wx+Math.cos(a/16*6.283)*d*300),y=Math.round(r.S.wy+Math.sin(a/16*6.283)*d*300);if(ids[r.biomeOfPos(x,y)]==='lago'&&!r.regionOfPos(x,y)?.sea){r.S.wx=x;r.S.wy=y;return;}}}")
   page.wait_for_function("__r.BIOMES[__r.curZone]?.id==='lago'",timeout=8000);page.evaluate(hide)
   # The Lago is played by its chain game: with the bar full, the gold flower opens with a pulse on time.
   page.wait_for_function("__r.journeyChain().active",timeout=8000);page.evaluate("()=>{__r.S.journey.chain.points=100;}");page.wait_for_function("!!__r.journeyChain().flower",timeout=3000)
   page.evaluate(ON);page.wait_for_function("__r.journeyChain().opened&&__r.journeyChapter().done.lago",timeout=5000)
   page.wait_for_function("__r.journeyChapter().portalOpen",timeout=16000)
   page.evaluate("()=>{const r=__r,p=r.journeyChapter().portal;r.S.wx=p.x;r.S.wy=p.y;}");page.wait_for_function("__r.journeyFinaleState().running",timeout=5000)
   st=page.evaluate('__r.journeyFinaleState()');assert st['notes']>=7,st
   page.wait_for_timeout(2500);page.locator('#journeyFinale').click()
   page.wait_for_selector('#journeyAgain',timeout=5000);assert 'Tu frase' in page.inner_text('#journeyFinale');assert page.evaluate('__r.journeyMode()')=='viaje'
   page.locator('#journeyAgain').click();page.wait_for_load_state();page.wait_for_function('!!window.__r?.festival')
   assert page.evaluate("__r.S.journey.chapter||0")<=1 and not page.evaluate("__r.S.journey.done?.llanura"),'the next player starts fresh'
   assert page.evaluate("localStorage.getItem('pixel-blanco-v4')")==MAIN
   # Colour-blind palette, kept after reload.
   page.evaluate("()=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__r.$('bSettings').click();}");page.locator('#colorSafe').check()
   assert page.evaluate('__r.S.colorSafe')==True and page.evaluate("__r.placeColor('lago','#8ad1ff')")=='#56b4e9'
   page.reload();page.wait_for_function('!!window.__r?.colorSafe');assert page.evaluate('__r.colorSafe()')==True
   assert not errors,errors;ctx.close()
  browser.close()
 print('PASS festival build on phone and desktop: no account or mode switch, its own save with the player\'s untouched, the Lago gold flower ends it on your phrase, «Otra persona» starts fresh; colour-blind palette kept',flush=True)
finally:server.shutdown()
