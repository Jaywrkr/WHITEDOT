"""Production gate: seed travel and the lab catalog stay hidden and other seeds are unreachable; development keeps them."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
port=server.server_port
def instrument(page,production):
 # A non-local host without the automation flag is what a player sees in production.
 if production:page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
def hidden(page,selector):return page.evaluate(f"getComputedStyle(document.querySelector('{selector}')).display")=='none'
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--no-proxy-server',f'--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));instrument(page,True)
  response=page.goto(f'http://kubono.localhost:{port}/');assert response.status==200,'the production-appearance fixture must reach its local server';page.wait_for_function('!!window.__r?.visitWorldAddress')
  assert not page.evaluate("document.body.classList.contains('dev')"),'production host must not enable development tools'
  assert hidden(page,'#bWorlds') and hidden(page,'p:has(> #guideCatalog)') and hidden(page,'.devbox')
  if page.locator('#returnContinue').is_visible():page.locator('#returnContinue').click()
  if page.locator('#hcGo').is_visible():page.locator('#hcGo').click()
  page.wait_for_function("!document.querySelector('.modal:not([hidden])')");page.evaluate("__r.S.firstJourney.skipped=true");page.wait_for_function("document.getElementById('firstJourney').hidden");start=page.url
  blocked=page.evaluate("""async()=>{const {worldIdentity,placeAddress}=await import('/src/world-identity.js');return __r.visitWorldAddress(placeAddress(worldIdentity('otra','wide',2),100,100,'superficie'));}""")
  page.wait_for_timeout(300);assert blocked is False and page.url==start,'another seed must not open in production'
  page.wait_for_function("document.getElementById('toast').textContent.includes('otra semilla')",timeout=8000)
  # A player already in another seed keeps the panel, so they can return to the original world.
  seeded=browser.new_page(viewport={'width':390,'height':844});instrument(seeded,True)
  seeded.goto(f'http://kubono.localhost:{port}/?testSeed=otra&layout=wide&generation=2&travel=1');seeded.wait_for_function('!!window.__r?.visitWorldAddress')
  assert not hidden(seeded,'#bWorlds')
  # Development keeps the tools.
  dev=browser.new_page(viewport={'width':390,'height':844});instrument(dev,False)
  dev.goto(f'http://127.0.0.1:{port}/');dev.wait_for_function('!!window.__r?.visitWorldAddress')
  assert dev.evaluate("document.body.classList.contains('dev')") and not hidden(dev,'#bWorlds')
  assert not errors,errors;browser.close()
 print('PASS production hides seed travel and the lab catalog, blocks other seeds, keeps a way back from a seed; development keeps them',flush=True)
finally:server.shutdown();server.server_close()
