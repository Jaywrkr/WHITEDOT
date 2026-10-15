"""Fractional hand strokes and changing phrases reach the native scheduler."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&generation=2&layout=wide&lab=1');page.wait_for_function('window.__testRuntime?.labMode')
  page.evaluate('window.__played=[];__testRuntime.labPerformanceCue=n=>__played.push(n);document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.labGo("band:interlock");__testRuntime.MU.E=.7;__testRuntime.MU.vit=1;')
  page.wait_for_function('__played.some(n=>n.instrument==="handslap"&&n.offset>0)',timeout=20000)
  assert page.evaluate('__played.every(n=>Number.isFinite(n.time)&&n.offset>=0&&n.offset<1)')
  assert page.evaluate('__testRuntime.MU.radio.labScore.id')=='interlock'
  assert not errors,errors;print('PASS ternary hand strokes scheduled against the actual electronic clock',flush=True);b.close()
finally:server.shutdown()
