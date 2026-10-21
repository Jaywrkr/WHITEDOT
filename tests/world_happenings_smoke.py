"""V6 happenings: one at a time on their own schedule; stars, festival and breeze draw without errors and stop under reduced motion."""
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
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=world-happenings&layout=wide&generation=2');page.wait_for_function('!!window.__r?.drawHappenings')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();}""")
  page.wait_for_timeout(500);h=page.evaluate('__r.happenings()');assert h['kind']=='' and h['nextIn']>30000,h
  for kind in ('stars','festival','breeze'):
   page.evaluate(f"__r.happenings().start('{kind}')");page.wait_for_timeout(1600);assert page.evaluate('__r.happenings().kind')==kind
   page.screenshot(path=f'/tmp/kubono-happening-{kind}.png')
  assert page.evaluate('__r.happenings().count')==3
  page.evaluate('__r.S.reducedMotion=true');page.wait_for_timeout(200);assert page.evaluate('__r.happenings().kind')==''
  assert not errors,errors;browser.close()
 print('PASS world happenings: scheduled one at a time, stars, festival and breeze drawn, none under reduced motion',flush=True)
finally:server.shutdown();server.server_close()
