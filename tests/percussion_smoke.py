"""Native cube percussion on mobile: all families, muted UI, isolated previews and pauses."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
  page.evaluate('()=>{const r=__testRuntime;document.querySelectorAll(".modal").forEach(m=>m.hidden=true);window.__hits=[];r.percussionCue=n=>__hits.push(n);r.audio();}')
  page.wait_for_function('__testRuntime.ac?.state==="running"')
  for kind in ['stone','hollow','roots','reeds','pods','shell','dust','pool','fossil']:
   page.evaluate('(kind)=>{const r=__testRuntime;r.labGo("rhythm:"+kind);}',kind);page.wait_for_timeout(350)
   before=page.evaluate('__hits.length')
   page.evaluate('()=>{const r=__testRuntime,o=r.nearbyPercussion()[0];r.S.wx=o.x;r.S.wy=o.y;}')
   try:page.wait_for_function('__hits.length>'+str(before),timeout=6000)
   except Exception:
    print(page.evaluate('({kind:__testRuntime.labRhythm,sound:__testRuntime.S.sound,audio:__testRuntime.ac?.state,mode:__testRuntime.S.mode,body:__testRuntime.body,q:__testRuntime.MU.q8.length,hits:__hits,objects:__testRuntime.nearbyPercussion(),modals:[...document.querySelectorAll(".modal:not([hidden])")].map(m=>m.id)})'),flush=True);print(errors,flush=True);raise
   assert page.evaluate('__hits.at(-1).kind')==kind
   assert page.evaluate('__testRuntime.percussionSources()[0].voice.role')=='perc'
  assert page.evaluate('Object.keys(__testRuntime.S.rhythmFound).length')==9
  assert page.evaluate('!!__testRuntime.S.ach.percusion4')
  page.evaluate('__testRuntime.labGo("rhythm:stone")');page.wait_for_timeout(350)
  page.evaluate('()=>{const r=__testRuntime,o=r.nearbyPercussion()[0];r.S.wx=o.x;r.S.wy=o.y;}');page.wait_for_timeout(2600)
  assert page.evaluate('__hits.some(h=>h.origin==="ambient")'),'held stone has a groove'
  page.locator('#bMenu').click();count=page.evaluate('__hits.length');page.wait_for_timeout(2300);assert page.evaluate('__hits.length')==count,'menu does not create percussion'
  page.locator('#mnClose').click();page.evaluate('__testRuntime.S.sound=false');count=page.evaluate('__hits.length');page.wait_for_timeout(2400);assert page.evaluate('__hits.length')==count
  page.evaluate('__testRuntime.save()');page.reload();page.wait_for_function('__testRuntime?.labMode');assert page.evaluate('Object.keys(__testRuntime.S.rhythmFound).length')==9
  page.screenshot(path='/tmp/whitedot-percussion-mobile.png');assert not errors,errors
  print('PASS nine native percussion gestures, held groove, menu/mute pause, discovery persistence, silent UI and mobile rendering',flush=True);b.close()
finally:server.shutdown()
