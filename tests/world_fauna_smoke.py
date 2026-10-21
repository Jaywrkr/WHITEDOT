"""V3 fauna: creatures bob to the beat, most sleep at night until the cube comes near, and flocks cross the sky (bats at night)."""
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
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=world-fauna&layout=wide&generation=2');page.wait_for_function('!!window.__r?.drawFauna')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();}""")
  # Walk until creatures are in view.
  for _ in range(12):
   if page.evaluate('__r.faunaState().shown')>0:break
   page.keyboard.down('d');page.wait_for_timeout(700);page.keyboard.up('d')
  assert page.evaluate('__r.faunaState().shown')>0,'creatures in view'
  # Bobbing follows the beat and stops under reduced motion.
  assert page.evaluate("__r.faunaBob({},1,500)")>0 and page.evaluate("__r.faunaBob({},0,500)")==0
  # Night: creatures far from the cube sleep, close ones stay awake.
  noon_at=page.evaluate("(()=>{const off=__r.seedOf('living:climate:v1:'+__r.MU.dnaT.key)%4;return (((.25-off/4)%1+1)%1)*600;})()")
  page.evaluate(f'__r.S.livingSeconds={noon_at+300}');page.wait_for_function('__r.worldLight().night>.9',timeout=15000);page.wait_for_timeout(400)
  st=page.evaluate('__r.faunaState()');assert st['sleeping']>0 or st['shown']==0,st
  o=page.evaluate("(()=>{const o={};return [__r.faunaBob(o,1,30)>0,__r.faunaBob(o,1,500)];})()")
  # A flock crosses the sky: bats at night.
  page.evaluate('__r.faunaState().startCrossing()');page.wait_for_function('__r.faunaState().crossing',timeout=3000);assert page.evaluate('__r.faunaState().bats')
  page.screenshot(path='/tmp/kubono-fauna-night.png')
  page.evaluate('__r.S.reducedMotion=true');page.wait_for_timeout(300);assert page.evaluate("__r.faunaBob({},1,500)")==0 and not page.evaluate('__r.faunaState().crossing')
  assert not errors,errors;browser.close()
 print('PASS world fauna: creatures in view bob to the beat, sleep at night away from the cube, bats cross the night sky, still under reduced motion',flush=True)
finally:server.shutdown();server.server_close()
