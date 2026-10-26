"""The performance identifies saved phrases at their actual transport section."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.openSong')
  p.evaluate("()=>{const r=__r;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);r.S.sound=true;r.audio();r.S.journey.notes={};r.S.lugares.notes={lago:[60,62,64]};r.S.lugares.noteSteps={lago:[0,2,6]};r.S.lugares.noteTicks={lago:[0,18,38]};r.openSong();}")
  assert 'Frases guardadas · 1 lugar · para el final' in p.inner_text('#songStage')
  for w,h in [(320,568),(844,390),(1280,800)]:
   p.set_viewport_size({'width':w,'height':h});assert p.locator('#songStage .song-stage-text').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
  p.locator('#songClose').click();before=p.evaluate('JSON.stringify([__r.S.lugares.notes,__r.S.lugares.noteSteps,__r.S.lugares.noteTicks])')
  p.evaluate("()=>{const r=__r;for(const id of ['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva'])r.S.lugares.stars[id]=[true,false,false];r.openSong({final:true});}")
  p.wait_for_function("document.querySelector('#songStage .song-stage-text').textContent.includes('Se unen')",timeout=8000)
  assert 'Tu frase · Lago' not in p.inner_text('#songStage')
  p.wait_for_function("document.querySelector('#songStage .song-stage-text').textContent.includes('Tu frase · Lago')",timeout=60000)
  assert p.evaluate('__r.songStageState().k>=11*16')
  assert p.evaluate('JSON.stringify([__r.S.lugares.notes,__r.S.lugares.noteSteps,__r.S.lugares.noteTicks])')==before
  p.locator('#songClose').click()
  p.evaluate("()=>{const r=__r;r.S.sound=false;r.S.journey.finished=false;r.S.journey.notes={llanura:[60]};r.journeyFinale();}")
  p.wait_for_function("document.getElementById('journeyFinale').getAttribute('aria-label').includes('Tu frase de Llanura')",timeout=10000)
  p.locator('#journeySkip').click();assert not p.evaluate('__r.houseActive()')
  assert not errors,errors;b.close()
 print('PASS saved-phrase preview, real section caption, unchanged MIDI/ticks, responsive text and accessible Journey reprise')
finally:srv.shutdown();srv.server_close()
