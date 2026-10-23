"""One sound sheet, four primary destinations and quiet settings on small screens."""
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
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__testRuntime?.styleUI');page.evaluate('document.getElementById("returnContinue").click();document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
   page.locator('#bMenu').click();assert page.locator('.menu-group.primary .tiles button:not([hidden])').count()==4 and not page.locator('#bLeavePlace').is_visible(),'four tiles in Jugar; «Dejar la ronda» only during a round'
   assert page.locator('.menu-group h3').all_text_contents()==['Jugar','Tu viaje','Crear','General']
   assert page.locator('#menuTitle').inner_text() and '✦' in page.locator('#menuSummary').inner_text(),'the menu opens on who and where'
   assert page.locator('#bWorldHint').inner_text() in ('Explorar el Mundo','Volver al Camino')
   assert page.locator('#mMenu #bSoft').count()==0 and page.locator('#mMenu #bSession').count()==0
   page.locator('#bMusicSettings').click();before=page.evaluate('({waves:window.__testRuntime.waves.length,context:!!window.__testRuntime.ac})')
   page.locator('#rVolume').fill('25');page.locator('#rVolume').dispatch_event('change');assert page.evaluate('window.__testRuntime.S.outputVolume')==.25
   assert page.evaluate('window.__testRuntime.musicVolume()')==.25
   assert page.evaluate('!!window.__testRuntime.ac')==before['context'];assert page.evaluate('window.__testRuntime.waves.length')<=before['waves']
   page.locator('#voiceMode').select_option('guia');page.locator('#muClose').click();page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#autoIntent').select_option('vida')
   assert page.evaluate('window.__testRuntime.S.voiceMode')=='guia';page.keyboard.press('Escape');page.reload();page.wait_for_function('!!window.__testRuntime?.styleUI');assert page.evaluate('window.__testRuntime.S.outputVolume')==.25
   assert not errors,errors;print('PASS clean groups, one sound sheet, silent volume and persisted settings at '+str(width),flush=True);page.close()
  b.close()
finally:server.shutdown()
