"""Real Canvas movement/pulses and crystal impacts, with unchanged mining and reduced motion."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.cubeVisualTransform');page.locator('#returnContinue').click();page.locator('#hcGo').click()
   page.evaluate("""()=>{__r.S.sound=false;window.matrix=()=>{const c=document.createElement('canvas').getContext('2d');__r.cubeVisualTransform(c,0,0);const m=c.getTransform();return {a:m.a,b:m.b,c:m.c,d:m.d};};}""")
   page.keyboard.down('ArrowRight');page.wait_for_timeout(140);moving=page.evaluate('matrix()');page.keyboard.up('ArrowRight');assert abs(moving['b'])>.001
   page.evaluate("""async()=>{const r=__r;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'visual:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();const {crystalField}=await import('/src/crystal-sparks.js');let o=null;for(let i=0;i<100&&!o;i++){const field=crystalField(i*1200,0,r.seedOf);o=field.find(p=>p.size===2&&!p.runner&&!p.rare&&crystalField(p.x,p.y,r.seedOf).every(q=>q.id===p.id||Math.hypot(p.x-q.x,p.y-q.y)>400));}if(!o)throw Error('Missing isolated crystal');window.crystal=o;r.S.wx=o.x;r.S.wy=o.y-40;window.balance=r.S.sparks;}""")
   page.wait_for_timeout(950);page.mouse.click(30,height/2);page.wait_for_function('__r.savedCrystal(crystal.id)?.hits===1')
   assert page.evaluate('__r.crystalState.feedback')>0
   assert page.evaluate('matrix().a')>1.02
   page.screenshot(path=str(ROOT.parent/f'crystal-impact-{width}.png'))
   page.wait_for_timeout(900);page.mouse.click(30,height/2);page.wait_for_function('__r.savedCrystal(crystal.id)?.broken');page.screenshot(path=str(ROOT.parent/f'crystal-break-{width}.png'))
   page.wait_for_function('__r.savedCrystal(crystal.id)?.collected');assert page.evaluate('__r.S.sparks')==page.evaluate('balance+3'),page.evaluate('({balance,sparks:__r.S.sparks,log:__r.sparkEconomy.log,site:__r.savedCrystal(crystal.id)})')
   page.wait_for_function('__r.crystalState.feedback===0')
   page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(100);assert page.evaluate('matrix()')=={'a':1,'b':0,'c':0,'d':1}
   page.emulate_media(reduced_motion='no-preference');page.evaluate('__r.S.reducedMotion=true');page.wait_for_timeout(100);assert page.evaluate('matrix()')=={'a':1,'b':0,'c':0,'d':1}
   assert not errors,errors;page.close();print(f'PASS {width}: actual movement/pulse transform, natural two-hit crystal, cosmetic debris expiry, unchanged 3-spark payout and both reduced-motion settings',flush=True)
  browser.close()
finally:server.shutdown();server.server_close()
