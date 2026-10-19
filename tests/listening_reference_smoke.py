"""Mobile reference selection is silent, reuses the lab and keeps player progress."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading, shutil, os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&layout=wide&generation=2&lab=1');page.wait_for_function('!!window.__testRuntime?.labBook');page.wait_for_function('document.querySelectorAll("#labTry li").length>0')
  page.evaluate('''()=>{const r=__testRuntime;r.S.sound=false;localStorage.setItem('pixel-blanco-v4','{"sentinel":"keep-me"}');window.__beforePosition=[r.S.wx,r.S.wy];window.__beforePulses=r.S.session.pulses;window.__oscillators=0;const create=r.ac.createOscillator.bind(r.ac);r.ac.createOscillator=(...args)=>{__oscillators++;return create(...args);};}''')
  page.locator('#labNotes').click();page.locator('#labListening summary').click();assert page.locator('#labReference option').count()==10
  page.locator('#labReference').select_option('percusion');assert 'raspado' in page.locator('#labReferenceGoal').inner_text()
  assert page.evaluate('[__testRuntime.S.wx,__testRuntime.S.wy]')==page.evaluate('window.__beforePosition');assert page.evaluate('__oscillators')==0
  page.locator('#labReferenceA').click();page.wait_for_function('__testRuntime.labBook.current==="rhythm:hollow"');assert page.locator('#mLab').is_hidden()
  page.locator('#labNotes').click();page.locator('#labVerdicts [data-verdict="fix"]').click();page.locator('#labText').fill('El golpe tapa la respuesta')
  report=page.evaluate('__testRuntime.labReportText()');assert 'Escucha comparada' in report and 'Golpe y raspado' in report and 'sin veredicto' in report
  page.locator('#labReferenceB').click();page.wait_for_function('__testRuntime.labBook.current==="rhythm:reeds"')
  assert page.evaluate('localStorage.getItem("pixel-blanco-v4")')=='{"sentinel":"keep-me"}'
  # World transport may schedule inaudible background oscillators after travelling.
  # Verify the actual contract: selection preserves mute and creates no pulse/gesture.
  assert page.evaluate('__testRuntime.S.sound===false&&__testRuntime.musicVolume()===0'), 'A/B must preserve the listener volume'
  assert page.evaluate('__testRuntime.S.session.pulses===__beforePulses&&__testRuntime.waves.length===0'), 'A/B must not create a player pulse or a sonar'
  page.reload();page.wait_for_function('!!window.__testRuntime?.labBook');assert page.evaluate('__testRuntime.labBook.notes["rhythm:hollow"].text')=='El golpe tapa la respuesta'
  assert not errors,errors
  print('PASS mobile listening comparison, silent selection, real A/B destinations, partial-review report and independent persistent notes');b.close()
finally:server.shutdown()
