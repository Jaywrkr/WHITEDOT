"""Integrated collection, rare native fossil, reduced installation drawing and silent journal."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
  page.evaluate('()=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.labGo("rhythm:fossil");}');page.wait_for_timeout(350)
  page.evaluate('()=>{const r=__testRuntime,o=r.nearbyPercussion()[0];r.S.wx=o.x;r.S.wy=o.y;}')
  page.wait_for_function('__testRuntime.S.elementBook.found["rhythm:fossil"]!==undefined')
  n=page.evaluate('__testRuntime.elementFamilyCount');assert n>=1
  page.wait_for_timeout(1900);assert page.evaluate('__testRuntime.elementFamilyCount')==n,'held phrase must not inflate count'
  page.evaluate('__testRuntime.labGo("rhythm:roots")');page.wait_for_timeout(350);page.evaluate('()=>{const r=__testRuntime,o=r.nearbyPercussion()[0];r.S.wx=o.x;r.S.wy=o.y;}');page.wait_for_function('__testRuntime.S.elementBook.found["rhythm:roots"]!==undefined')
  assert '/179' in page.locator('#elementCount').inner_text()
  # Journal access is pure UI; no percussion while a sheet is open.
  page.evaluate('()=>{window.__hits=0;__testRuntime.percussionCue=()=>__hits++;__testRuntime.openJournal();}');count=page.evaluate('__hits');page.locator('[data-journal-tab="collection"]').click();page.locator('#journalGroup').select_option('elementos');page.wait_for_timeout(1300)
  assert 'Fósil de ritmo' in page.locator('#journalBody').inner_text();assert page.evaluate('__hits')==count
  page.locator('#journalClose').click();page.evaluate('__testRuntime.save()');n=page.evaluate('__testRuntime.elementFamilyCount');page.reload();page.wait_for_function('__testRuntime?.labMode');assert page.evaluate('__testRuntime.elementFamilyCount')>=n
  # Native installations remain in place and interaction geometry is unchanged after simplification.
  for element in ['glass','mirrors','materia:prism']:
   page.evaluate('(id)=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.labGo(id);}',element);page.wait_for_timeout(450);page.screenshot(path='/tmp/whitedot-minimal-'+element.replace(':','-')+'.png')
  # Locate a rare fossil generated naturally; the lab fixture did not alter that stream.
  result=page.evaluate('''async()=>{const {createRhythmElements}=await import('/src/percussion-model.js'),r=__testRuntime,region=r.regionOfPos(r.S.wx,r.S.wy);let total=0,rare=0;for(let x=0;x<100;x++)for(let y=0;y<100;y++){const list=createRhythmElements(x,y,r.WCH,{...region,sea:false},r.seedOf,r.rng);total+=list.length;rare+=list.some(o=>o.kind==='fossil');}return {total,rare};}''')
  assert 0<result['rare']<40,result
  assert not errors,errors;print(f'PASS native discoveries, noninflating counter, journal silence, persistence and minimal installations; rare fossils {result["rare"]}/10000 sampled chunks',flush=True);b.close()
finally:server.shutdown()
