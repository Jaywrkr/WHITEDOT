"""Three actual notice styles under bursts: no overlap, stale backlog or UI sound."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
bootstrap='''import {initialize} from './messages.js';
const r={S:{help:{mundo:true}},inWorld:()=>false};document.querySelectorAll('.modal').forEach(m=>m.hidden=true);initialize(r);
const ids=['toast','phrase','zone','voice','rareNotice','celebration'];ids.forEach(id=>document.getElementById(id).hidden=true);window.__r=r;window.__overlaps=[];
setInterval(()=>{const visible=ids.filter(id=>{const e=document.getElementById(id);return !e.hidden&&getComputedStyle(e).visibility!=='hidden'&&Number(getComputedStyle(e).opacity)>.01});if(visible.length>1)__overlaps.push(visible);},16);'''
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=bootstrap,content_type='text/javascript'))
  for width,height in [(320,640),(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.noticeLane')
   page.evaluate('''()=>{const l=__r.noticeLane,e=document.getElementById('toast');for(let i=0;i<50;i++)l.enqueue('toast',e,()=>e.textContent='Forma '+i,2,'form:'+i,()=>true,{level:1,category:'forma',coalesce:true});}''')
   page.wait_for_function('document.getElementById("toast").classList.contains("on")');assert page.locator('#toast').inner_text()=='Forma 49';assert page.locator('#toast').get_attribute('data-notice-level')=='1'
   rect=page.locator('#toast').bounding_box();assert rect['height']<height*.18 and rect['width']<=width-32;assert 'Geist Mono' in page.locator('#toast').evaluate('e=>getComputedStyle(e).fontFamily')
   assert page.evaluate('''()=>{const l=__r.noticeLane,e=document.getElementById('toast');return l.enqueue('toast',e,()=>e.textContent='Repetida',2,'another',()=>true,{level:1,coalesce:true});}''') is False
   page.wait_for_function('__r.noticeLane.owner===null');page.wait_for_timeout(400)
   page.evaluate('''()=>{const l=__r.noticeLane;l.request('rare',{level:3});if(!l.claim('rare'))throw Error('Card priority');const e=document.getElementById('rareNotice');e.dataset.layout='full';e.dataset.inspect='true';e.dataset.noticeLevel='3';l.show(e);document.getElementById('rareNoticeName').textContent='Un hallazgo excepcional';__r.say('Escucha esta voz.','Guía',{requested:true});const t=document.getElementById('toast');l.enqueue('toast',t,()=>t.textContent='Lugar guardado',2,'saved',()=>true,{level:2});if(l.show(t))throw Error('A stale source stole the screen');for(let i=0;i<50;i++)if(l.enqueue('zone',document.getElementById('zone'),()=>{},2,'zone:'+i,()=>true,{level:1}))throw Error('Routine queued behind a card');}''')
   page.wait_for_timeout(500);assert page.locator('#rareNotice').is_visible();assert page.locator('#voice').is_hidden();assert page.locator('#toast').is_hidden()
   page.evaluate('''()=>{const l=__r.noticeLane,e=document.getElementById('rareNotice');e.dataset.inspect='false';l.hide(e);l.release('rare');}''');page.wait_for_timeout(700);assert page.locator('#voice').is_hidden() and page.locator('#toast').is_hidden(),'a major finding leaves breathing space'
   page.wait_for_function('document.getElementById("voice").classList.contains("on")',timeout=10000);assert page.locator('#rareNotice').is_hidden();page.wait_for_function('__r.noticeLane.owner==="toast"',timeout=12000);assert page.locator('#toast').get_attribute('data-notice-level')=='2';assert page.locator('#voice').is_hidden()
   page.wait_for_function('__r.noticeLane.owner===null');page.wait_for_timeout(400)
   # Stale information is discarded rather than replayed after a menu.
   page.evaluate('''()=>{document.getElementById('mMenu').hidden=false;const e=document.getElementById('phrase');__r.noticeLane.enqueue('phrase',e,()=>e.textContent='Caducó',1,'stale',()=>true,{level:2,ttl:150});}''');page.wait_for_timeout(350);page.evaluate('document.getElementById("mMenu").hidden=true');page.wait_for_timeout(350);assert page.locator('#phrase').is_hidden()
   assert page.evaluate('__overlaps')==[],page.evaluate('__overlaps');assert not page.evaluate('!!__r.ac');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   page.screenshot(path=f'/tmp/whitedot-notices-{width}.png');print(f'PASS X1/X2/X3, 50-event coalescing, cooldown, card priority, stale-source rejection, exit gap, expiry and no overlap/audio at {width}',flush=True)
  browser.close()
finally:server.shutdown()
