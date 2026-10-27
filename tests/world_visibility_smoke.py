"""Five real boundary crossings, fog continuity, preload, scoped trails and silent UI."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import json,threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<1000,has_touch=True);errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=visual-depth&layout=classic&generation=2')
   page.wait_for_function('__testRuntime?.worldVisibility')
   page.evaluate('()=>{const r=__testRuntime;r.S.relaxedCreate=true;r.S.sound=false;document.querySelectorAll(".modal").forEach(m=>m.hidden=true);}')
   report=page.evaluate('''async()=>{const r=__testRuntime,step=r.REG*r.WCH;let maxJump=0,crossings=0;for(let region=0;region<5;region++){r.S.wx=(region+1)*step-300;r.S.wy=step*.53;await new Promise(requestAnimationFrame);let last=r.worldVisibility.radius;for(let k=0;k<65;k++){r.S.wx+=10;await new Promise(requestAnimationFrame);maxJump=Math.max(maxJump,Math.abs(r.worldVisibility.radius-last));last=r.worldVisibility.radius;}crossings++;}return {crossings,maxJump,cache:r.livingCache.size,quality:r.visualDetail,blackEdge:r.worldOpacity(r.worldVisibility.radius),near:r.worldOpacity(30),shell:r.wchunks.size};}''')
   assert report['crossings']==5 and report['maxJump']<8,report
   assert report['cache']<=48 and report['blackEdge']==0 and report['near']==1,report
   assert report['shell']>1,report
   page.evaluate('()=>{const r=__testRuntime;window.__oldPosition=[r.S.wx,r.S.wy];}')
   # Count once the menu is open: a slow machine can draw a frame between the click and the pause.
   page.locator('#bMenu').click();page.wait_for_timeout(100);page.evaluate('()=>{window.__trailCount=__testRuntime.visualDetail.footprints;}');page.wait_for_timeout(300)
   assert page.evaluate('__testRuntime.visualDetail.footprints')==page.evaluate('__trailCount'),'menu must pause footprints'
   page.locator('#mnClose').click()
   page.screenshot(path=f'/tmp/whitedot-v2-f1-world-{width}.png')
   assert page.evaluate('__testRuntime.S.sound') is False
   assert not errors,errors
   print('PASS visual depth '+str(width)+'x'+str(height)+': '+json.dumps(report),flush=True)
   page.close()
  browser.close()
finally:server.shutdown()
