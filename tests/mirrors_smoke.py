# Navegador: mesa de efectos. El pad filtra y da espacio, vuelve a limpio al soltar, Fijar lo mantiene, Stop frena y no mueve al pixel.
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/'
CHROMIUM = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.evaluate("()=>{const r=window.__testRuntime,site=r.nearbyMirrors(2500).find(s=>s.id==='mirror:0,0');r.S.wx=site.x;r.S.wy=site.y;}")
  page.wait_for_timeout(400)
  point=page.evaluate('()=>{const r=window.__testRuntime,m=r.nearbyMirrors(300)[0].mirrors[0];return {x:r.W/2+m.x-r.S.wx,y:r.H/2+m.y-r.S.wy};}')
  before=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')
  if label=='mobile':page.touchscreen.tap(point['x'],point['y'])
  else:page.mouse.click(point['x'],point['y'])
  assert page.locator('#mirrorPanel').is_visible()
  assert page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')==before
  page.evaluate("()=>{const r=window.__testRuntime,site=r.nearbyMirrors(300)[0];site.solution.forEach((a,i)=>{const input=document.getElementById('mirrorAngle'+i);input.value=Math.round(a/Math.PI*180);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));});}")
  assert 'Conexión completa' in page.locator('#mirrorInfo').inner_text()
  assert page.evaluate('!!window.__testRuntime.S.ach.espejo1 && !!window.__testRuntime.S.ach.espejoRuta')
  assert page.evaluate('window.__testRuntime.S.mirrorSites["mirror:0,0"].solved')
  page.screenshot(path=f'/tmp/whitedot-mirrors-{label}.png')
  page.locator('#mirrorClose').click()
  # Direct drag keeps the panel hidden and never starts player movement.
  dragpoint=page.evaluate('()=>{const r=window.__testRuntime,m=r.nearbyMirrors(300)[0].mirrors[0];return {x:r.W/2+m.x-r.S.wx,y:r.H/2+m.y-r.S.wy,angle:m.angle};}')
  before=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')
  page.mouse.move(dragpoint['x']+20,dragpoint['y']);page.mouse.down();page.mouse.move(dragpoint['x'],dragpoint['y']+20,steps=6);page.mouse.up()
  assert page.locator('#mirrorPanel').is_hidden()
  assert page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')==before
  assert page.evaluate('window.__testRuntime.nearbyMirrors(300)[0].mirrors[0].angle')!=dragpoint['angle']
  # Pointer cancellation restores both live angles and the committed save.
  saved=page.evaluate('JSON.stringify(window.__testRuntime.S.mirrorSites["mirror:0,0"])')
  angles=page.evaluate('window.__testRuntime.nearbyMirrors(300)[0].mirrors.map(m=>m.angle)')
  page.evaluate("()=>{const r=window.__testRuntime,site=r.nearbyMirrors(300)[0],m=site.mirrors[0],x=r.W/2+m.x-r.S.wx,y=r.H/2+m.y-r.S.wy,w=document.getElementById('w');const event=(type,dx,dy)=>new PointerEvent(type,{pointerId:909,isPrimary:true,clientX:x+dx,clientY:y+dy,bubbles:true});w.dispatchEvent(event('pointerdown',20,0));w.dispatchEvent(event('pointermove',0,20));w.dispatchEvent(event('pointercancel',0,20));}")
  assert page.evaluate('window.__testRuntime.nearbyMirrors(300)[0].mirrors.map(m=>m.angle)')==angles
  assert page.evaluate('JSON.stringify(window.__testRuntime.S.mirrorSites["mirror:0,0"])')==saved
  # Modal opening cancels a preview; a stale release must not save it.
  page.evaluate("()=>{const r=window.__testRuntime,site=r.nearbyMirrors(300)[0],m=site.mirrors[0],x=r.W/2+m.x-r.S.wx,y=r.H/2+m.y-r.S.wy,w=document.getElementById('w');const event=(type,dx,dy)=>new PointerEvent(type,{pointerId:910,isPrimary:true,clientX:x+dx,clientY:y+dy,bubbles:true});w.dispatchEvent(event('pointerdown',20,0));w.dispatchEvent(event('pointermove',0,20));document.getElementById('mMenu').hidden=false;r.mirrorTick();w.dispatchEvent(event('pointerup',0,20));document.getElementById('mMenu').hidden=true;}")
  assert page.evaluate('window.__testRuntime.nearbyMirrors(300)[0].mirrors.map(m=>m.angle)')==angles
  assert page.evaluate('JSON.stringify(window.__testRuntime.S.mirrorSites["mirror:0,0"])')==saved
  page.evaluate("()=>{const r=window.__testRuntime,site=r.nearbyMirrors(300)[0],m=site.mirrors[0],x=r.W/2+m.x-r.S.wx,y=r.H/2+m.y-r.S.wy,w=document.getElementById('w'),wx=r.S.wx;const event=(type,dx,dy)=>new PointerEvent(type,{pointerId:911,isPrimary:true,clientX:x+dx,clientY:y+dy,bubbles:true});w.dispatchEvent(event('pointerdown',20,0));w.dispatchEvent(event('pointermove',0,20));r.S.wx=site.x+300;r.mirrorTick();w.dispatchEvent(event('pointerup',0,20));r.S.wx=wx;}")
  assert page.evaluate('window.__testRuntime.nearbyMirrors(300)[0].mirrors.map(m=>m.angle)')==angles
  assert page.evaluate('JSON.stringify(window.__testRuntime.S.mirrorSites["mirror:0,0"])')==saved
  page.evaluate("()=>{const r=window.__testRuntime,m=r.nearbyMirrors(300)[0].mirrors[0];r.S.wx=m.x;r.S.wy=m.y;}")
  page.locator('#w').click(position={'x':30,'y':200});page.keyboard.down('e');page.wait_for_timeout(250);assert 'Espejo musical' in page.locator('#scannerSources').inner_text();page.keyboard.up('e')
  page.reload(wait_until='domcontentloaded');page.wait_for_function('window.__testRuntime?.S.mirrorSites["mirror:0,0"]?.solved')
  page.locator('#bMenu').click();page.locator('#bAch').click();assert 'Espejos musicales' in page.locator('#journalBody').inner_text();page.locator('#journalClose').click()
  page.evaluate('window.__testRuntime.audio()');page.wait_for_function('window.__testRuntime.ac.state==="running"')
  page.evaluate("()=>{const r=window.__testRuntime,ac=r.ac,o=ac.createOscillator.bind(ac),b=ac.createBufferSource.bind(ac);let count=0;ac.createOscillator=()=>{count++;return o();};ac.createBufferSource=()=>{count++;return b();};try{for(let s=0;s<16;s++)r.mirrorStep(s,102,ac.currentTime+.1);if(!count)throw Error('mirror sequence silent');const before=count;for(let s=0;s<16;s++)r.mirrorStep(s,102,ac.currentTime+.2);if(count!==before)throw Error('mirror exceeded budget');}finally{ac.createOscillator=o;ac.createBufferSource=b;}}")
  page.evaluate('window.__testRuntime.enterLayer("bajo")');page.wait_for_timeout(200);assert not page.locator('#mirrorPanel').is_visible()
  assert not errors,errors
  print(label+': direct drag/cancel, modal rollback, mirror touch controls, completed light route, audible bounded sequence, achievements, persistence, scanner and journal PASS',flush=True);c.close()
 b.close()
server.shutdown()
