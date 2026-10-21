"""V5 feel: the view leads while walking and recentres when still, a crystal break punches the zoom, and nothing moves under reduced motion."""
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
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=world-camera&layout=wide&generation=2');page.wait_for_function('!!window.__r?.cameraOffset')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();}""")
  page.keyboard.down('d');page.wait_for_timeout(900)
  lead=page.evaluate('__r.cameraOffset()');assert lead['x']<-5,lead
  page.keyboard.up('d');page.wait_for_timeout(2200);assert abs(page.evaluate('__r.cameraOffset().x'))<1,'recentred when still'
  page.evaluate('__r.sparkEconomy.stats.broken+=1');page.wait_for_timeout(60);assert page.evaluate('__r.cameraOffset().zoom')>1.005
  page.evaluate('__r.cameraKick(0,3)');page.wait_for_timeout(50)
  page.evaluate('__r.S.reducedMotion=true');page.keyboard.down('d');page.wait_for_timeout(700);page.keyboard.up('d')
  off=page.evaluate('__r.cameraOffset()');assert off=={'x':0,'y':0,'zoom':1},off
  assert not errors,errors;browser.close()
 print('PASS world camera: view leads while walking, recentres when still, crystal break punches the zoom, nothing moves under reduced motion',flush=True)
finally:server.shutdown();server.server_close()
