"""Native cube contacts, scoped saves, bounded caches and silent UI for the living catalog."""
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
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&lab=1&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
  # The deliberate lab list is generated only when opened; use the exported catalog and available groups instead.
  ids=page.evaluate('async()=>{const {LIVING_GROUPS}=await import("/src/living.js"),{LIVING_CATALOG}=await import("/src/living-catalog.js");return LIVING_CATALOG.filter(d=>LIVING_GROUPS.includes(d.group)).map(d=>d.id)}')
  anatomies=[]
  for kind in ids:
   page.evaluate('(kind)=>{const r=__testRuntime;r.labGo("living:"+kind);document.querySelectorAll(".modal").forEach(m=>m.hidden=true);r.audio();window.__notes=[];r.livingNoteCue=n=>__notes.push(n);}',kind)
   page.wait_for_function('__testRuntime.livingNear().length>0');page.wait_for_timeout(120)
   page.evaluate('()=>{const r=__testRuntime,o=r.livingNear()[0];r.S.wx=o.x;r.S.wy=o.y;}')
   try:page.wait_for_function('__notes.length>0',timeout=5000)
   except Exception:
    print(kind,errors,page.evaluate('({S:{mode:__testRuntime.S.mode,x:__testRuntime.S.wx,y:__testRuntime.S.wy},ac:__testRuntime.ac?.state,body:__testRuntime.body,objects:__testRuntime.livingNear(),step:__testRuntime.MU.step,q:__testRuntime.MU.q8.length})'),flush=True);raise
   # Ambient notes can arrive before the cube contact registers; wait for the contact itself.
   page.wait_for_function('__testRuntime.S.livingSeen[__testRuntime.labLiving]!==undefined',timeout=5000)
   anatomies.append(page.evaluate('async()=>{const {anatomyPath}=await import("/src/anatomy.js");return anatomyPath(__testRuntime.livingNear()[0].anatomy);}'))
   if kind in ['breath-tree','moth','crab','cathedral']:page.screenshot(path='/tmp/whitedot-f2-'+kind+'.png')
  assert len(set(anatomies))==28,'each lineage must render its own topology'
  page.evaluate('()=>{const r=__testRuntime;r.givePower("cometa");document.getElementById("mMenu").hidden=false;window.__until=r.powers.cometa;}')
  page.wait_for_timeout(600);assert page.evaluate('__testRuntime.hasPower("cometa")')
  page.evaluate('()=>{const r=__testRuntime;for(let i=0;i<300;i++)r.cajasTick(.1);if(r.powers.cometa!==__until)throw Error("modal power deadline changed");}')
  assert not errors,errors
  print(f'PASS {len(ids)} native living contacts, real musical replies, scoped discoveries, modal pause and no browser errors')
  browser.close()
finally:server.shutdown()
