"""Real notice/motion modules: serialized entrances, paused timers and touch gesture."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
bootstrap='''import {installNoticeLane} from './notice-lane.js';import {initialize as motion} from './control-motion.js';
const r={S:{reducedMotion:false},inWorld:()=>false,audio:()=>r.resumes++,enterWorld:()=>r.entries++,resumes:0,entries:0};
document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.lane=installNoticeLane(r);const m=motion(r),b=document.getElementById('bPrimary');b.hidden=false;b.classList.add('gold');b.onclick=()=>m.enter(b);window.__r=r;'''
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=bootstrap,content_type='text/javascript'))
  for width,height in [(390,844),(844,390)]:
   page.set_viewport_size({'width':width,'height':height});page.emulate_media(reduced_motion='no-preference')
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('window.__r')
   page.evaluate('''()=>{const l=__r.lane;for(const [id,text]of [['toast','Primero'],['phrase','Segundo'],['zone','Tercero']])l.enqueue(id,document.getElementById(id),()=>document.getElementById(id).textContent=text,.6);}''')
   page.wait_for_function('__r.lane.owner==="toast"');page.wait_for_timeout(150)
   page.evaluate('document.getElementById("mMenu").hidden=false');page.wait_for_timeout(900)
   assert page.evaluate('__r.lane.owner')=='toast','a hidden notice cannot consume its timer'
   assert page.locator('#toast').is_hidden()
   page.evaluate('document.getElementById("mMenu").hidden=true');page.wait_for_function('!document.getElementById("toast").hidden')
   page.wait_for_function('__r.lane.owner===null');assert page.locator('#toast').evaluate('e=>e.inert');assert not page.locator('#phrase').evaluate('e=>e.classList.contains("on")')
   page.wait_for_function('__r.lane.owner==="phrase"');assert page.locator('#toast').is_hidden()
   assert page.locator('#zone').evaluate('e=>!e.classList.contains("on")')
   page.wait_for_function('__r.lane.owner==="zone"');assert page.locator('#phrase').is_hidden()
   page.wait_for_function('__r.lane.owner===null');page.wait_for_timeout(400)
   page.locator('#bPrimary').click();assert page.evaluate('__r.resumes')==1,'resume belongs to the input gesture'
   assert page.evaluate('__r.entries')==0,'arrow travels before navigation'
   page.evaluate('document.getElementById("bPrimary").click()');page.wait_for_timeout(500)
   assert page.evaluate('__r.entries')==1 and page.evaluate('__r.resumes')==1,'double tap enters only once'
   assert page.locator('#bPrimary').is_enabled()
   page.emulate_media(reduced_motion='reduce');page.locator('#bPrimary').click();assert page.evaluate('__r.entries')==2
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'phone has no horizontal overflow'
   assert not errors,errors;print(f'PASS notice serialization, hidden-time pause, exit gap, silent guarded entry and reduced motion at {width}',flush=True)
  browser.close()
finally:server.shutdown()
