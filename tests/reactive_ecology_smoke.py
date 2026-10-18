"""Native world sources respond visually; controls, saves and music remain intact."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(has_touch=True);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   if page.url!='about:blank':page.evaluate('localStorage.clear()')
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.reactiveTick')
   source=page.evaluate('''()=>{const r=__r,s=r.S;document.getElementById('returnContinue').click();document.querySelectorAll('.modal').forEach(e=>e.hidden=true);s.sound=false;s.mode='world';s.help.camino=s.help.mundo=true;s.todayLight=1;s.lastWorldDay=s.todayKey;s.firstJourney.skipped=true;
    for(let i=0;i<20;i++){s.wx=(i+.5)*r.WCH;s.wy=r.WCH*.5;const o=r.livingNear(350).find(o=>o.group==='flora');if(o){s.wx=o.x+90;s.wy=o.y;window.nativeSource=o;return {id:o.id,x:o.x,y:o.y};}}throw Error('Native flora absent');}''')
   page.wait_for_function('!!__r.reactiveState?.profile');page.evaluate('__r.S.wx=nativeSource.x+15;__r.S.wy=nativeSource.y')
   page.wait_for_function('__r.reactiveState.effects.some(e=>e.source===nativeSource.id)')
   assert page.evaluate('__r.reactiveState.effects.every(e=>e.ink!="#e8bc5a")')
   assert page.evaluate('!__r.ac'),'visual ecology must not allocate audio'
   page.evaluate("document.getElementById('mGuide').hidden=false");page.wait_for_timeout(80);frozen=page.evaluate('JSON.stringify(__r.reactiveState)');page.wait_for_timeout(180);assert page.evaluate('JSON.stringify(__r.reactiveState)')==frozen
   page.evaluate("document.getElementById('mGuide').hidden=true;__r.S.reducedMotion=true");page.wait_for_timeout(80)
   assert page.evaluate('__r.reactivePose(nativeSource.id)===null&&__r.reactiveMistWindows().length===0')
   page.evaluate('__r.S.reducedMotion=false;__r.S.wx=nativeSource.x+90;__r.S.wy=nativeSource.y');page.wait_for_timeout(3600)
   page.evaluate('''()=>{const cv=document.getElementById('w'),x=innerWidth/2-90,y=innerHeight/2;cv.dispatchEvent(new PointerEvent('pointerdown',{pointerId:9,isPrimary:true,clientX:x,clientY:y,bubbles:true}));cv.dispatchEvent(new PointerEvent('pointerup',{pointerId:9,isPrimary:true,clientX:x,clientY:y,bubbles:true}));}''')
   page.wait_for_function('__r.reactiveState.effects.some(e=>e.source===nativeSource.id&&e.gesture==="tocar")')
   assert page.evaluate('__r.reactiveState.effects.length<=11&&__r.reactiveState.contacts<=72')
   page.evaluate('__r.S.wx+=10000;__r.S.wy+=10000');page.wait_for_timeout(80);assert page.evaluate('!__r.reactiveState.effects.some(e=>e.source===nativeSource.id)'),'travel must discard former reactions'
   page.evaluate('__r.S.wx=nativeSource.x+15;__r.S.wy=nativeSource.y');page.wait_for_function('__r.reactiveState.effects.some(e=>e.source===nativeSource.id)');page.wait_for_timeout(220)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   if width==390:
    cases=page.evaluate('''async()=>{const r=__r,{reactionOf}=await import('/src/reactive-ecology-model.js'),cases={};for(let i=0;i<80&&Object.keys(cases).length<10;i++){r.S.wx=(i+.5)*r.WCH;r.S.wy=r.WCH*.5;for(const o of r.livingNear(350)){const region=r.regionOfPos(o.x+8,o.y),type=reactionOf(o,region,r.seedOf);cases[type]??={id:o.id,x:o.x,y:o.y};}}return cases;}''')
    assert len(cases)==10,'ten visual grammars must occur on native inhabitants'
    for kind,o in cases.items():
     page.evaluate('__r.S.wx=10000000;__r.S.wy=10000000');page.wait_for_timeout(65)
     page.evaluate('o=>{__r.S.wx=o.x+8;__r.S.wy=o.y;}',o)
     page.wait_for_function('__r.reactiveState.effects.some(e=>e.type==="'+kind+'")')
     page.wait_for_timeout(65);assert not errors,errors
     if kind=='niebla':assert page.evaluate('__r.reactiveMistWindows().some(w=>w.radius>0)')
    print('PASS all ten render paths reached through real native inhabitants',flush=True)
   page.screenshot(path=f'/tmp/whitedot-reactive-{width}.png');print('PASS real flora proximity/tap, menu pause, reduced motion, bounded reactions, teleport cleanup and silent contained UI at '+str(width),flush=True)
  browser.close()
finally:server.shutdown()
