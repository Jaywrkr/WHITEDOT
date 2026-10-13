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
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 for width,height in [(360,640),(844,390)]:
  context=b.new_context(viewport={'width':width,'height':height},has_touch=True)
  page=context.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=creative-lab&encounter=shadow');page.wait_for_function('__testRuntime.inWorld()')
  page.locator('#bMenu').click();page.wait_for_timeout(100)
  assert page.locator('#mMenu').get_attribute('role')=='dialog'
  for i in range(25):
   page.keyboard.press('Tab');assert page.evaluate('document.getElementById("mMenu").contains(document.activeElement)')
  page.keyboard.press('Escape');assert not page.locator('#mMenu').is_visible();assert page.evaluate('document.activeElement.id')=='bMenu'
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dSeeds').click();page.wait_for_timeout(100)
  page.locator('#seedEncounter').select_option('box');page.locator('#seedValue').fill('creative-box')
  # Every musical or navigation UI action here must leave gameplay pulses alone.
  assert page.evaluate('__testRuntime.waves.length')==0
  assert page.locator('#seedEncounter').bounding_box()['height']>=44
  page.locator('#seedClose').click()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print(f'PASS {width}x{height}: modal focus, Tab containment, Escape return, scrollable seed controls and silent UI',flush=True)
  context.close()
 b.close()
server.shutdown()
