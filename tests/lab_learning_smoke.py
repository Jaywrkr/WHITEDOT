"""Arm an optional lesson silently, discover a source and answer with native taps."""
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
  page.evaluate('window.__lessonNotes=[];__testRuntime.labLearningNoteCue=n=>__lessonNotes.push(n);document.getElementById("returnContinue").click();document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.labGo("synth:skinbass")')
  page.locator('#bMenu').click();page.locator('#bGuide').click();page.locator('#guideLabPractice').click()
  assert page.evaluate('__testRuntime.labLearningState.stage')=='choose';assert page.evaluate('__lessonNotes.length')==0
  page.mouse.move(195,422);page.mouse.down();page.mouse.move(195,534,steps=10);page.wait_for_function('__testRuntime.labLearningState?.stage!=="choose"');page.mouse.up()
  page.wait_for_function('__testRuntime.labLearningState?.stage==="reply"',timeout=20000)
  assert page.evaluate('__lessonNotes.length')==2
  gap=page.evaluate('__testRuntime.SIX*8*1000')
  page.locator('#w').focus();page.keyboard.press('Space');page.wait_for_timeout(gap);page.keyboard.press('Space')
  page.wait_for_function('__testRuntime.S.labLearning.completed>=1')
  page.reload();page.wait_for_function('window.__testRuntime?.S.labLearning?.completed>=1')
  assert not errors,errors;print('PASS optional guide arming is silent, native source calls, two player taps and durable learning',flush=True);b.close()
finally:server.shutdown()
