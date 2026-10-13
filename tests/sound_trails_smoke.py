from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390),(1280,800)]:
   context=browser.new_context(viewport={'width':width,'height':height},has_touch=True);page=context.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=trail-lab&encounter=trail')
   page.wait_for_function('window.__testRuntime?.S.mode==="world"');page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true);window.trail=__testRuntime.nearbyTrails(800).find(t=>t.id==='trail:0,0')")
   assert page.evaluate('!!trail');assert page.evaluate('__testRuntime.S.soundTrails[trail.id]?.stage||0')==0
   # Muted standing cannot advance; then real elapsed time hears the first clue.
   page.evaluate('__testRuntime.S.sound=false');page.wait_for_timeout(2200);assert page.evaluate('__testRuntime.S.soundTrails[trail.id].stage')==0
   page.touchscreen.tap(width/2,height/2);page.evaluate('__testRuntime.S.sound=true;__testRuntime.audio()')
   page.locator('#bMenu').click();page.wait_for_timeout(2200);assert page.evaluate('__testRuntime.S.soundTrails[trail.id].stage')==0;page.locator('#mnClose').click()
   page.wait_for_function('__testRuntime.S.soundTrails[trail.id].stage===1')
   def go(index):
    page.evaluate(f'__testRuntime.S.wx=trail.nodes[{index}].x;__testRuntime.S.wy=trail.nodes[{index}].y');page.wait_for_timeout(150)
   # Future nodes cannot be used before completing the rhythmic response.
   go(2);page.touchscreen.tap(width/2,height/2);assert page.evaluate('__testRuntime.S.soundTrails[trail.id].stage')==1
   go(1);before=page.evaluate('[__testRuntime.S.wx,__testRuntime.S.wy]')
   for i in range(3):page.touchscreen.tap(width/2,height/2);page.wait_for_timeout(50)
   assert page.evaluate('__testRuntime.S.soundTrails[trail.id].stage')==1
   # Leaving clears a partial reply; play the actual gestures at the captured local tempo.
   page.evaluate('__testRuntime.S.wx+=200');page.wait_for_timeout(150);go(1)
   six=page.evaluate('__testRuntime.SIX');rhythm=page.evaluate('trail.rhythm')
   page.touchscreen.tap(width/2,height/2);page.wait_for_timeout(six*rhythm[1]*1000-20);page.touchscreen.tap(width/2,height/2);page.wait_for_timeout(six*(rhythm[2]-rhythm[1])*1000-20);page.touchscreen.tap(width/2,height/2)
   assert page.evaluate('__testRuntime.S.soundTrails[trail.id].stage')==2
   assert page.evaluate('[__testRuntime.S.wx,__testRuntime.S.wy]')==before,'musical taps moved player'
   go(2);page.mouse.move(width/2,height/2);page.mouse.down();page.wait_for_timeout(750);page.evaluate("document.getElementById('w').dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,bubbles:true}))");page.mouse.up();assert page.evaluate('__testRuntime.S.soundTrails[trail.id].stage')==2
   page.mouse.move(width/2,height/2);page.mouse.down();page.wait_for_timeout(750);page.mouse.up();assert page.evaluate('__testRuntime.S.soundTrails[trail.id].stage')==3
   assert page.evaluate('!!__testRuntime.S.ach.instrumentoDespierto');assert not page.evaluate('__testRuntime.scanning')
   page.screenshot(path=f'/tmp/whitedot-sound-trail-{width}.png');page.evaluate('__testRuntime.save()');page.reload()
   page.wait_for_function('window.__testRuntime?.S.soundTrails["trail:0,0"]?.stage===3')
   page.locator('#bMenu').click();page.locator('#bAch').click();assert 'Rastros musicales' in page.locator('#journalBody').inner_text()
   assert not errors,errors
   print(f'PASS {width}x{height}: muted listening, chained order, rhythm retries and real taps, cancellation, awakening, saved completion and journal',flush=True);context.close()
  browser.close()
finally:server.shutdown()
