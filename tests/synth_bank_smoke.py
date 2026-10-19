"""Playable organic demonstrations: fifty-eight synths and sixteen filter programs."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&lab=1&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  entries=page.evaluate('import("/src/lab-catalog.js").then(m=>m.LAB_ELEMENTS.filter(e=>["synth","filter"].includes(e.find.type)).map(e=>[e.id,e.find]))')
  slopes=set();programs=set()
  for eid,find in entries:
   page.evaluate('''(id)=>{const r=__testRuntime;r.labGo(id);r.labSolo=true;window.__notes=[];r.livingNoteCue=n=>__notes.push(n);}''',eid)
   page.wait_for_function('__testRuntime.livingNear().length>0')
   page.evaluate('()=>{const r=__testRuntime,o=r.livingNear()[0];r.S.wx=o.x;r.S.wy=o.y;}')
   if find['type']=='synth':
    page.wait_for_function('(id)=>__notes.some(n=>n.instrument===id)',arg=find['instrument'],timeout=6000)
    assert page.evaluate('(id)=>__testRuntime.S.journal.music.instruments[id]===1',find['instrument'])
   else:
    page.wait_for_function('(id)=>{const r=__testRuntime,o=r.livingNear()[0];return __notes.length>0&&r.getInstrumentPatch("living:"+o.kind,r.regionOfPos(o.homeX,o.homeY),r.getVoice("living:"+o.kind,r.regionOfPos(o.homeX,o.homeY),o),o).program.id===id}',arg=find['program'],timeout=6000)
    state=page.evaluate('()=>__testRuntime.livingNear()[0].filterMotion');assert state and state['start']!=state['end'],state
    if state['slope']:slopes.add(state['slope'])
    programs.add(find['program'])
  assert len(entries)==74 and len(programs)==16 and slopes=={12,24,36,48}
  page.screenshot(path='/tmp/whitedot-m1-filter-phone.png')
  assert not errors,errors
  print('PASS fifty-eight audible native synth families, journal registration, sixteen real filter programs, four slopes, moving sweeps and local phone cues',flush=True)
  b.close()
finally:server.shutdown()
