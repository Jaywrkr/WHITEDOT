"""The first pulse (plan F12): a new player in the Camino who has not pulsed sees the bar at the top beat with the
music after five seconds; the first pulse ends it."""
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
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function("!!window.__r?.barBeatHintState",timeout=20000)
   assert page.evaluate("__r.S.mode")=='camino'
   # Not while the welcome is open, nor at once after it closes.
   page.wait_for_function("!document.getElementById('mHelpC').hidden",timeout=10000);page.wait_for_timeout(5500)
   assert not page.evaluate("document.getElementById('bar').classList.contains('beat-hint')"),'not under the welcome'
   page.evaluate("document.getElementById('hcGo').click()");page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.wait_for_timeout(1500)
   assert not page.evaluate("document.getElementById('bar').classList.contains('beat-hint')"),'not at once'
   page.wait_for_function("document.getElementById('bar').classList.contains('beat-hint')",timeout=9000)
   # It beats: the brightness changes over a beat.
   seen=set()
   for i in range(12):seen.add(page.evaluate("getComputedStyle(document.getElementById('bar')).getPropertyValue('--beat')"));page.wait_for_timeout(60)
   assert len(seen)>2,seen
   if os.environ.get('BAR_SHOT'):page.screenshot(path=os.environ['BAR_SHOT'].replace('.png',f'-{width}.png'),clip={'x':0,'y':0,'width':width,'height':160})
   # The first pulse ends it.
   page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'",timeout=10000)
   page.evaluate("()=>__r.journeyPulse(performance.now())");page.wait_for_function("!document.getElementById('bar').classList.contains('beat-hint')",timeout=3000)
   assert not errors,errors;page.close()
  browser.close()
 print('PASS first pulse on phone and desktop: the Camino bar beats after five seconds without a pulse and stops at the first one',flush=True)
finally:server.shutdown()
