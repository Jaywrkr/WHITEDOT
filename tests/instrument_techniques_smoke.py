"""Native lab instruments and a cube-held wind that releases when the menu opens."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&generation=2&layout=wide&lab=1');page.wait_for_function('window.__testRuntime?.labMode')
  page.evaluate('window.__techNotes=[];__testRuntime.techniqueNoteCue=n=>__techNotes.push(n);document.querySelectorAll(".modal").forEach(m=>m.hidden=true);')
  ids=page.evaluate('import("/src/instrument-techniques.js").then(m=>Object.keys(m.TECHNIQUE_INSTRUMENTS))')
  for id in ids:
   page.wait_for_function('__testRuntime.activeTechniqueCount<10')
   page.evaluate('(id)=>{const r=__testRuntime;r.labGo("synth:"+id);const o=r.livingNear(500)[0];r.playVoice("living:"+o.kind,0,r.ac.currentTime+.02,r.regionOfPos(o.x,o.y),false,1,o,"player");}',id)
   page.wait_for_function('(id)=>__techNotes.some(n=>n.instrument===id)',arg=id)
  page.evaluate('__testRuntime.labGo("synth:bamboowind")')
  page.mouse.move(195,422);page.mouse.down();page.mouse.move(195,534,steps=8);page.wait_for_function('(()=>{const r=__testRuntime,o=r.livingNear(90)[0];return o&&Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<28;})()');page.mouse.up();page.wait_for_function('__techNotes.some(n=>n.instrument==="bamboowind"&&n.held)')
  assert page.evaluate('__testRuntime.activeTechniqueCount')<=16
  page.locator('#bMenu').click();page.wait_for_timeout(400)
  page.evaluate('window.__heldBefore=__techNotes.filter(n=>n.held).length')
  page.wait_for_timeout(400);assert page.evaluate('__techNotes.filter(n=>n.held).length===__heldBefore'),'menu must not restart a sustained voice'
  assert not errors,errors;print('PASS forty-three lab voices, real held wind from cube contact, bounded nodes and release/no restart in menu',flush=True);b.close()
finally:server.shutdown()
