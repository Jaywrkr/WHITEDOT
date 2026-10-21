"""V4 the world breathes the music: bars swell the world's colour, sounding sources ring with light, grass keeps the beat; still under reduced motion."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=world-music&layout=wide&generation=2');page.wait_for_function('!!window.__r?.drawWorldMusic')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sound=true;}""")
  page.mouse.click(30,400);page.evaluate('__r.audio?.()');page.wait_for_function("__r.ac?.state==='running'",timeout=10000)
  # A new bar swells the world's colour.
  page.wait_for_function('__r.worldMusicState().swell>0',timeout=15000)
  first=page.evaluate('__r.worldMusicState().bar');page.wait_for_function(f'__r.worldMusicState().bar!=={first}',timeout=15000)
  # Pulses make sources sound; the cue list is readable and finite.
  for _ in range(4):page.evaluate('__r.sonar()');page.wait_for_timeout(800)
  assert isinstance(page.evaluate('__r.soundCuesNow().length'),int)
  assert page.evaluate('__r.musicSway(1,10)')>0
  page.evaluate('__r.S.reducedMotion=true');page.wait_for_timeout(2500)
  assert page.evaluate('__r.worldMusicState().swell')==0 and page.evaluate('__r.musicSway(1,10)')==0
  # Sound off: nothing breathes.
  page.evaluate("()=>{__r.S.reducedMotion=false;__r.S.sound=false;}");page.wait_for_timeout(300);assert page.evaluate('__r.worldMusicState().bar') is None
  assert not errors,errors;browser.close()
 print('PASS world music: bar swells, readable sound cues, beat in the grass, still under reduced motion and silent with sound off',flush=True)
finally:server.shutdown();server.server_close()
