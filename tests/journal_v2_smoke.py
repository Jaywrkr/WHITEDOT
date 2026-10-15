"""Five native sections share session, visual collection, places and music."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(320,568),(390,844),(844,390)]:
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:(errors.append(str(e)),print('PAGE ERROR '+str(e),flush=True)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__testRuntime?.openJournal');page.evaluate('()=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);window.__testRuntime.openJournal("today");}')
   assert page.locator('[data-journal-tab]').all_text_contents()==['Hoy','Colección','Lugares','Música','Logros']
   page.locator('[data-journal-tab="collection"]').click();page.locator('#journalGroup').select_option('cubo');assert page.locator('.album-piece').count()==50
   page.locator('#journalOwnership').select_option('pendiente');assert page.locator('.album-piece').count()==43
   page.locator('#journalSearch').fill('Aurora');assert page.locator('.album-piece').count()==1;assert 'Juega 180 días' in page.locator('#journalBody').inner_text()
   assert not page.evaluate('!!window.__testRuntime.ac');page.locator('[data-journal-tab="music"]').click();assert '0 de 52' in page.locator('#journalBody').inner_text()
   page.locator('[data-journal-tab="places"]').click();assert page.locator('#journalSky').is_visible()
   page.locator('[data-journal-tab="achievements"]').click();assert all(x in page.locator('#journalBody').inner_text() for x in ['Camino','Mundo','Música','Vida','Colección','Casa','Secretos'])
   page.locator('#journalNext').click();assert page.locator('#mJournal').is_hidden();assert not page.evaluate('!!window.__testRuntime.ac')
   assert not errors,errors;print('PASS five sections, silent search/silhouettes, 52-genre ring, constellation and next-step voice at '+str(width),flush=True);page.close()
  b.close()
finally:server.shutdown()
