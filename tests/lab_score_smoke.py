"""The native scheduler uses the territory band; classic mode and UI stay safe."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio-vivo&generation=2&layout=classic&travel=1')
  page.wait_for_function('window.__testRuntime?.inWorld()')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  page.locator('#w').click(position={'x':30,'y':300})
  page.wait_for_function('__testRuntime.MU.radio?.labScore')
  first=page.evaluate('({band:__testRuntime.MU.radio.labScore.id,world:JSON.stringify(__testRuntime.MU.dnaT)})')
  page.locator('#bMenu').click();page.locator('#bMusicSettings').click()
  before=page.evaluate('({waves:__testRuntime.waves.length,context:__testRuntime.ac})')
  page.locator('#bLivingMusic').click();assert page.locator('#bLivingMusic').get_attribute('aria-pressed')=='false'
  assert page.evaluate('__testRuntime.waves.length')==before['waves']
  page.locator('#muClose').click();page.wait_for_function('__testRuntime.MU.radio&&!__testRuntime.MU.radio.labScore')
  assert page.evaluate('JSON.stringify(__testRuntime.MU.dnaT)')==first['world']
  page.reload();page.wait_for_function('window.__testRuntime?.S.livingMusic===false')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  page.locator('#bMenu').click();page.locator('#bMusicSettings').click();page.locator('#bLivingMusic').click();page.locator('#muClose').click()
  page.locator('#w').click(position={'x':30,'y':300});page.wait_for_function('__testRuntime.MU.radio?.labScore')
  assert page.evaluate('__testRuntime.MU.radio.labScore.id')==first['band']
  assert not errors,errors
  print('PASS native territory band, silent classic/live toggle, saved preference and unchanged world identity',flush=True);b.close()
finally:server.shutdown()
