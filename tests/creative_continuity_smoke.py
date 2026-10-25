"""Existing finale is reachable again with current saved notes; replay never grants rewards."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for w,h in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':w,'height':h});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function('!!window.__r?.replaySong&&__r.inWorld()')
   page.evaluate("()=>{const r=__r;r.S.sound=false;for(const id in r.S.lugares.stars)r.S.lugares.stars[id][0]=true;r.S.lugares.won=true;r.S.lugares.notes.lago=[60,64];r.S.lugares.noteSteps.lago=[0,6];r.save();document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}")
   before=page.evaluate('JSON.stringify([__r.S.sparks,__r.S.lugares.stars,__r.S.lugares.won,__r.S.lugares.master])')
   for notes in [[60,64],[62,65]]:
    page.evaluate('notes=>{__r.S.lugares.notes.lago=notes;__r.openLugares();}',notes);page.locator('#lugaresSong').click()
    st=page.evaluate('__r.songStageState()');assert st['final'] and st['running'] and st['personalNotes']['lago']==notes,st
    page.locator('#songClose').click();assert not page.evaluate('__r.songStageState().running')
   assert page.evaluate('JSON.stringify([__r.S.sparks,__r.S.lugares.stars,__r.S.lugares.won,__r.S.lugares.master])')==before,'replaying never pays or changes completion'
   assert not errors,errors;page.close()
  browser.close()
 print('PASS current personal notes reach the existing finale again, on phone/desktop, without new rewards or changed generators',flush=True)
finally:server.shutdown();server.server_close()
