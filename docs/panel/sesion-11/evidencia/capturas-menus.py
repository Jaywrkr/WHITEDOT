# Extra captures for the menu and visual-detail reviewers: every menu sheet at phone, landscape and desktop.
# Session 11: after P2 «Sonido» lives inside «Ajustes»; the free-only buttons stay hidden in Journey mode (a datum).
# Usage: OUT=dir python3 docs/panel/sesion-11/evidencia/capturas-menus.py, then again with LIBRE=libre.
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os
ROOT=Path('/home/user/WHITEDOT');OUT=Path(os.environ['OUT'])
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
sizes=[('tel',390,844),('hor',844,390),('esc',1280,800)]
sheets=[('menu',None),('menu-mas','more'),('ajustes','bSettings'),('sonido','bSettings>bMusicSettings'),('tu-cubo','bCube'),('lugares','bLugares'),('mapa','bMap'),('bitacora','bAch'),('guia','bGuide'),('cuenta','bConnection'),('refugio','bStudio'),('grabar','bRecord'),('semillas','bWorlds')]
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  for tag,w,h in sizes:
   for name,btn in sheets:
    if tag!='tel' and name not in ('menu','menu-mas','ajustes','tu-cubo','lugares','refugio'):continue
    p=b.new_page(viewport={'width':w,'height':h});errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
    p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
    p.goto(f'http://kubono.localhost:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r',timeout=20000);p.wait_for_timeout(3000)
    p.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
    if os.environ.get('LIBRE'):
     p.locator('#bMenu').click();p.wait_for_timeout(400);p.evaluate("document.getElementById('menuMore')?.setAttribute('open','')");p.locator('#bJourneyMode').click();p.wait_for_timeout(800);p.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
    try:
     p.locator('#bMenu').click();p.wait_for_timeout(500)
     if btn:
      p.evaluate("document.getElementById('menuMore')?.setAttribute('open','')");p.wait_for_timeout(300)
      for step in ([] if btn=='more' else btn.split('>')):p.locator('#'+step).click(timeout=4000);p.wait_for_timeout(1200)
    except Exception as e:errs.append('click:'+str(e)[:120])
    p.screenshot(path=str(OUT/f'{tag}-{os.environ.get("LIBRE","viaje")}-{name}.png'));print(tag,name,'errors' if errs else 'ok',errs[:1]);p.close()
  b.close()
finally:srv.shutdown()
