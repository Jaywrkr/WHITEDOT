from browser_helpers import complete_path_fixture
# Navegador: paseo automático, reloj de sesión, exploración sin límite y cancelación.
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/'
CHROMIUM = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.evaluate("()=>{const r=window.__testRuntime;r.startAutopilot('wander');}")
  before=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]');lamp=page.evaluate('window.__testRuntime.S.lampUsed');elapsed=page.evaluate('window.__testRuntime.S.session.seconds');page.wait_for_timeout(600)
  after=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]');assert ((after[0]-before[0])**2+(after[1]-before[1])**2)**.5>10
  assert page.evaluate('window.__testRuntime.S.lampUsed')==lamp,'exploration must not consume a legacy time allowance'
  assert page.evaluate('window.__testRuntime.S.session.seconds')>elapsed,'the active session clock must still advance'
  page.locator('#bMenu').click();page.wait_for_timeout(200);pos=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]');page.wait_for_timeout(300)
  assert page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')==pos
  page.locator('#mnClose').click();page.keyboard.down('d');page.wait_for_timeout(150);page.keyboard.up('d');assert page.evaluate('window.__testRuntime.autopilotState.mode') is None
  page.evaluate("()=>{const r=window.__testRuntime;r.stopAutopilot();const p=r.addFavorite('Destino auto');r.S.wx=p.x-180;r.selectDestination(p.id);r.MU.anomaly='invertida';r.startAutopilot('destination');}")
  page.wait_for_function('window.__testRuntime.navigationState.arrived',timeout=10000)
  assert page.evaluate('window.__testRuntime.autopilotState.mode') is None
  page.evaluate('window.__testRuntime.MU.anomaly=null')
  page.screenshot(path=f'/tmp/whitedot-autopilot-{label}.png')
  page.evaluate("window.__testRuntime.startAutopilot('wander')");page.locator('#autoStop').click();assert page.evaluate('window.__testRuntime.autopilotState.mode') is None
  page.evaluate("window.__testRuntime.startAutopilot('wander')");page.locator('#bMenu').click();page.locator('#bWorld').click();assert page.evaluate('window.__testRuntime.autopilotState.mode') is None
  assert not errors,errors
  print(label+': slow autopilot, unlimited exploration, active session clock, menu pause, manual/stop cancellation and destination arrival PASS',flush=True);c.close()
 b.close()
server.shutdown()
