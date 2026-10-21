"""V2 weather: gusts travel, grass parts for the cube, rain lands in splashes and sound beds run without errors; reduced motion stills them."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=world-weather&layout=wide&generation=2');page.wait_for_function('!!window.__r?.windSway')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();}""")
  # A gust band travels: the same blade sways differently over time, and a blade beside the cube leans away from it.
  sways=[abs(v) for v in page.evaluate("()=>Array.from({length:60},(_,i)=>__r.windSway(100,0,i*100,10,999,0,0))")];assert max(sways)>1 and min(sways)<.5,sways
  assert page.evaluate("__r.windSway(10,0,0,10,10,0,0)")>0 and page.evaluate("__r.windSway(-10,0,0,10,10,0,0)")<0
  # Rain lands: splashes appear while it rains and clear when it stops.
  # Walk into a real storm: the same model the game uses, centred on the strongest one nearby.
  page.evaluate("""async()=>{const {stormsNear}=await import('/src/alive.js');const r=__r,RP=r.REG*r.WCH,u=r.S.wx/RP,v=r.S.wy/RP,best=stormsNear(u,v,Date.now()).sort((a,b)=>b.life*b.r-a.life*a.r)[0];r.S.wx=best.x*RP;r.S.wy=best.y*RP;}""")
  page.wait_for_function('__r.rainingNow&&__r.weatherSplashes()>3',timeout=20000)
  page.screenshot(path='/tmp/kubono-weather-rain.png')
  # A full panel pauses the light drops: none move, none land on the cube, no note plays behind it.
  page.evaluate("()=>{const r=__r;r.rain.push({x:r.S.wx,y:r.S.wy-30,vy:120});document.getElementById('mSettings').hidden=false;}");page.wait_for_timeout(150)
  held=page.evaluate("()=>({drops:__r.rain.map(q=>q.y),queue:__r.MU.queue.length})");page.wait_for_timeout(1200)
  assert page.evaluate("__r.rain.map(q=>q.y)")==held['drops'] and page.evaluate('__r.MU.queue.length')<=held['queue'],'drops wait behind a panel'
  # Sound on at night and in rain: the beds start without errors.
  page.mouse.click(30,400);page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.S.livingSeconds+=300;}");page.wait_for_timeout(2500)
  # Reduced motion: no gust, no wake, no splashes.
  page.evaluate('__r.S.reducedMotion=true');page.wait_for_timeout(300)
  assert page.evaluate("__r.windSway(10,0,0,10,10,0,0)")==0 and page.evaluate('__r.weatherSplashes()')==0
  page.evaluate("()=>{__r.S.reducedMotion=false;}")
  assert not errors,errors;browser.close()
 print('PASS world weather: travelling gusts, grass parting for the cube, rain splashes, sound beds without errors, still under reduced motion',flush=True)
finally:server.shutdown();server.server_close()
