# Móvil real (emulado): sin zoom ni desbordes, arrastrar en cualquier dirección mueve al pixel y la app es instalable.
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading, json
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
 c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True)
 page=c.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
 page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
 page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
 # Sin zoom ni desbordes: la página mide lo mismo que la pantalla.
 dims=page.evaluate('({vw:innerWidth,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,vh:innerHeight,scale:visualViewport.scale})')
 assert dims['sw']<=dims['vw'] and dims['sh']<=dims['vh'] and dims['scale']==1,dims
 page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click()
 page.wait_for_timeout(500)
 cdp=c.new_cdp_session(page)
 def drag(x0,y0,x1,y1):
  before=page.evaluate('({x:window.__testRuntime.S.wx,y:window.__testRuntime.S.wy})')
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x0,'y':y0}]})
  for i in range(1,11):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x0+(x1-x0)*i/10,'y':y0+(y1-y0)*i/10}]});page.wait_for_timeout(16)
  page.wait_for_timeout(500)
  after=page.evaluate('({x:window.__testRuntime.S.wx,y:window.__testRuntime.S.wy})')
  cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(150)
  return after['x']-before['x'],after['y']-before['y']
 # Hacia abajo empezando arriba (donde está el HUD), hacia arriba empezando abajo, y a los lados.
 ddx,ddy=drag(195,150,195,300);assert ddy>30,('down from top',ddx,ddy)
 ddx,ddy=drag(195,700,195,550);assert ddy<-30,('up from bottom',ddx,ddy)
 ddx,ddy=drag(100,420,250,420);assert ddx>30,('right',ddx,ddy)
 ddx,ddy=drag(300,420,150,420);assert ddx<-30,('left',ddx,ddy)
 ddx,ddy=drag(195,420,195,560);assert ddy>30,('down from center',ddx,ddy)
 assert page.evaluate('visualViewport.scale')==1 and page.evaluate('scrollY')==0
 page.screenshot(path='/tmp/whitedot-mobile.png')
 # Instalable: manifiesto válido con iconos y modo pantalla completa.
 man=json.loads((ROOT/'manifest.webmanifest').read_text());assert man['display'] in ('fullscreen','standalone') and any(i['sizes']=='512x512' for i in man['icons'])
 assert page.evaluate("fetch('./sw.js').then(r=>r.ok)") and page.evaluate("fetch('./icons/icon-512.png').then(r=>r.ok)")
 assert not errors,errors
 print('mobile: no zoom or overflow, drag moves in every direction from anywhere, installable PASS',flush=True)
 b.close()
server.shutdown()
