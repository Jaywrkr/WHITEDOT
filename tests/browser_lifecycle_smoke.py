"""Actual Chromium page freeze and AudioContext interruption recover without progress jumps."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.sparkEconomy')
  page.locator('#returnContinue').click();page.locator('#hcGo').click();page.locator('#w').focus();page.keyboard.press('Space')
  page.wait_for_function('__r.ac?.state==="running"')
  page.wait_for_timeout(2500) # Let the initial pulse's legitimate rewards settle before freezing.
  before=page.evaluate('({wallet:__r.S.sparks,x:__r.S.px,y:__r.S.py})')
  page.evaluate('()=>__r.ac.suspend()');page.wait_for_function('__r.ac.state==="suspended"')
  cdp=page.context.new_cdp_session(page);cdp.send('Page.setWebLifecycleState',{'state':'frozen'})
  # Real browser suspension: no synthetic visibilitychange or overridden document.hidden.
  import time;time.sleep(2)
  cdp.send('Page.setWebLifecycleState',{'state':'active'});page.bring_to_front()
  page.locator('#w').focus();page.keyboard.press('Space');page.wait_for_function('__r.ac.state==="running"')
  page.wait_for_function('__r.MU.next>__r.ac.currentTime')
  after=page.evaluate('({wallet:__r.S.sparks,x:__r.S.px,y:__r.S.py,lag:__r.MU.next-__r.ac.currentTime})')
  assert after['wallet']==before['wallet'] and abs(after['x']-before['x'])<2 and abs(after['y']-before['y'])<2,(before,after)
  assert 0<after['lag']<1,after
  page.evaluate('__r.S.sound=false;__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert page.evaluate('__r.S.sound') is False
  assert not errors,errors
  browser.close();print('PASS actual Chromium freeze/thaw, interrupted audio resumes on gesture, bounded transport/position and persisted mute',flush=True)
finally:server.shutdown();server.server_close()
