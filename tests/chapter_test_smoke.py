"""A chapter on its own (?capitulo=): the Journey opens right in that chapter on a save of its own, without an account, with the player's save untouched, and every load starts the chapter again."""
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
MAIN=json.dumps({'saveVersion':5,'sparks':42,'pathCrystals':['a'],'journey':{'mode':'viaje','chapter':3}})
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   base=f'http://127.0.0.1:{server.server_port}/'
   page.goto(base+'tests/');page.evaluate(f"localStorage.setItem('pixel-blanco-v4',{json.dumps(MAIN)})")
   for chapter,game in [('tormenta','journeyDance'),('lago','journeyChain'),('llanura','journeyStick')]:
    page.goto(base+'?capitulo='+chapter);page.wait_for_function('!!window.__r?.chapterTest')
    assert page.evaluate('__r.accountClient')==None,'no account for a chapter test'
    page.wait_for_function(f"__r.journeyChapter().id==='{chapter}'&&__r.BIOMES[__r.curZone]?.id==='{chapter}'&&__r.{game}().active",timeout=20000)
    ch=page.evaluate('__r.journeyChapter()');assert not ch['done'].get(chapter),ch
    assert page.evaluate('__r.journeyMode()')=='viaje'
    assert page.evaluate("localStorage.getItem('pixel-blanco-v4')")==MAIN,"the player's save is untouched"
    assert page.evaluate("!!localStorage.getItem('kubono:capitulo')"),'the test keeps its own save'
   # Every load starts the chapter again from an empty bar.
   page.evaluate("()=>{__r.S.journey.stick.points=60;__r.save();}");page.reload();page.wait_for_function("__r.journeyChapter?.().id==='llanura'&&__r.journeyStick().active",timeout=20000)
   assert page.evaluate('__r.journeyStick().points')==0
   # Without the parameter, nothing of this applies.
   page.goto(base+'tests/');assert page.evaluate("localStorage.getItem('pixel-blanco-v4')")==MAIN
   assert not errors,errors;ctx.close()
  browser.close()
 print('PASS chapter test on phone and desktop: ?capitulo= opens the Journey right in that chapter on its own save, without an account, with the player\'s save untouched, starting again on every load',flush=True)
finally:server.shutdown()
