# Navegador: mesa de efectos. El pad filtra y da espacio, vuelve a limpio al soltar, Fijar lo mantiene, Stop frena y no mueve al pixel.
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
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function("window.__testRuntime.MU.dnaA && window.__testRuntime.ac.state==='running'")
  point=page.evaluate("""()=>{const r=window.__testRuntime,s=r.nearbyPatches(3000).find(s=>s.id==='patch:0,0');r.S.wx=s.x;r.S.wy=s.y;return {out:{x:r.W/2+s.out.x-s.x,y:r.H/2},input:{x:r.W/2+s.inputs[0].x-s.x,y:r.H/2+s.inputs[0].y-s.y}};}""")
  page.wait_for_timeout(300);before=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')
  page.mouse.move(point['out']['x'],point['out']['y']);page.mouse.down();page.mouse.move(point['input']['x'],point['input']['y'],steps=8);page.mouse.up()
  assert page.locator('#patchPanel').is_visible();assert page.evaluate('window.__testRuntime.S.patchSites["patch:0,0"].connections')==[0]
  assert page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')==before,'cable moved player'
  page.evaluate("""()=>{const r=window.__testRuntime,s=r.nearbyPatches(300)[0];r.patchGardenStep(0,200,r.ac.currentTime+.1);for(let i=0;i<100;i++)r.influenceTick(.05,false);if(Math.abs(r.influenceState.values[s.inputs[0].channel])<.1)throw Error('patch did not influence composition');}""")
  page.screenshot(path=f'/tmp/whitedot-patchgarden-{label}.png')
  page.locator('#patchClose').click()
  if label=='mobile':page.touchscreen.tap(point['input']['x'],point['input']['y'])
  else:page.mouse.click(point['input']['x'],point['input']['y'])
  assert page.evaluate('window.__testRuntime.S.patchSites["patch:0,0"].connections')==[]
  page.locator('#patchClose').click()
  # Alternative connection: tap the output, then tap the input.
  page.mouse.click(point['out']['x'],point['out']['y']);page.mouse.click(point['input']['x'],point['input']['y'])
  assert page.evaluate('window.__testRuntime.S.patchSites["patch:0,0"].connections')==[0]
  page.reload(wait_until='domcontentloaded');page.wait_for_function('window.__testRuntime?.S.patchSites["patch:0,0"]?.connections.length===1')
  page.locator('#bMenu').click();page.locator('#bAch').click();assert 'Jardines modulares' in page.locator('#journalBody').inner_text();page.locator('#journalClose').click()
  assert not errors,errors
  print(label+': drag and tap cables, no player movement, musical influence, disconnect, persistence and journal PASS',flush=True);c.close()
 b.close()
server.shutdown()
