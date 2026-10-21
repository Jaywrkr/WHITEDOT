"""Top-down house places earned sounds, keeps the old workshop and visits read-only."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page(has_touch=True);errors=[];page.on('pageerror',lambda e:(errors.append(str(e)),print(str(e),flush=True)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390)]:
   if page.url!='about:blank':page.evaluate('localStorage.clear()')
   page.set_viewport_size({'width':width,'height':height})
   page.goto(f'http://127.0.0.1:{server.server_port}/');print('DOC '+str(width),flush=True);page.wait_for_function('!!window.__testRuntime?.enterHouse');print('READY',flush=True);page.evaluate('()=>{document.getElementById("returnContinue").click();document.querySelectorAll(".modal").forEach(m=>m.hidden=true);const r=window.__testRuntime;r.S.sound=false;r.S.studio.slots={"0,4":"canon"};r.save();r.enterHouse();}');page.wait_for_function('__testRuntime.houseSettled()')
   assert not page.evaluate('__testRuntime.ac'),'muted house entry must not allocate an audio graph';assert page.locator('#housePanel').is_visible();print('HOUSE ENTERED '+str(width),flush=True);assert page.locator('#studioPanel').is_hidden();assert page.locator('#houseObjects option').count()==40
   page.locator('#housePlace').click();page.wait_for_function('__testRuntime.houseSettled()');rect=page.evaluate('window.__testRuntime.houseRoomRect("sala")');page.locator('#w').click(position={'x':rect['x']+rect['w']*.4,'y':rect['y']+rect['h']*.5});assert page.evaluate('window.__testRuntime.S.house.objects.length')==1;print('PLACED',flush=True)
   assert page.locator('#housePlace').get_attribute('aria-pressed')=='true' and page.locator('#houseObjects').is_visible() and all(page.locator('#'+i).is_visible() for i in ['houseWorkshop','houseShare','houseExit']),'every house action stays in view'
   assert page.locator('#era').inner_text()=='Casa'
   assert page.evaluate("()=>{const r=__testRuntime,objects=r.S.house.objects;r.S.totalDays=14;const h=r.currentHouse();if(h.objects!==objects)return false;return ['sala','jardin','azotea','sotano'].every(id=>h.unlocked.includes(id))&&r.currentHouse()===h;}"),'new days unlock rooms without re-normalizing placed objects'
   ink=page.evaluate('''()=>{const r=__testRuntime,rect=r.houseRoomRect('sala');r.cx.globalAlpha=.01;r.houseStep(performance.now(),.01,0);r.cx.globalAlpha=1;const d=r.cx.getTransform().a,p=r.cx.getImageData(Math.floor(rect.x*d),Math.floor(rect.y*d),Math.floor(rect.w*d),Math.floor(rect.h*d)).data;let m=0;for(let i=0;i<p.length;i+=4)m=Math.max(m,p[i],p[i+1],p[i+2]);return m;}''');assert ink>50,ink
   page.locator('#houseWalk').click();page.wait_for_function('__testRuntime.houseSettled()');rect=page.evaluate('window.__testRuntime.houseRoomRect("sala")');originalPosition=page.evaluate('JSON.stringify(__testRuntime.S.house.objects)');page.locator('#w').click(position={'x':rect['x']+rect['w']*.42,'y':rect['y']+rect['h']*.5});assert page.evaluate('JSON.stringify(__testRuntime.S.house.objects)')==originalPosition,'listening cannot nudge the placed object'
   page.mouse.move(rect['x']+rect['w']*.4,rect['y']+rect['h']*.5);page.mouse.down();page.mouse.move(rect['x']+rect['w']*.7,rect['y']+rect['h']*.6,steps=6);page.mouse.up();assert abs(page.evaluate('__testRuntime.S.house.objects[0].x')-.7)<.03
   before=page.evaluate('JSON.stringify(window.__testRuntime.S.house.objects)');page.screenshot(path=f'/tmp/whitedot-v2-house-{width}.png')
   page.locator('#houseShare').click();code=page.locator('#houseCode').input_value();assert code.startswith('WH1-');page.locator('#houseVisit').click();assert page.locator('#houseObjects').is_disabled();assert page.evaluate('JSON.stringify(window.__testRuntime.S.house.objects)')==before
   page.locator('#houseExit').click();page.reload();page.wait_for_function('!!window.__testRuntime?.enterHouse');assert page.evaluate('JSON.stringify(window.__testRuntime.S.house.objects)')==before;assert page.evaluate('window.__testRuntime.S.studio.slots["0,4"]')=='canon'
   page.evaluate('document.getElementById("returnContinue").click();document.querySelectorAll(".modal").forEach(m=>m.hidden=true);window.__testRuntime.enterHouse()');page.wait_for_function('__testRuntime.houseSettled()');page.locator('#houseWorkshop').click();assert page.locator('#studioPanel').is_visible();assert not page.evaluate('window.__testRuntime.houseActive()')
   page.evaluate("()=>{const r=__testRuntime;r.S.house={version:9,objects:[{kind:'future:voice',room:'future',x:.2,y:.3}],unlocked:['sala'],playerRoom:'future',x:.2,y:.3,knownVisitors:{},earned:{secret:true}};r.enterHouse();}")
   future=page.evaluate('JSON.stringify(__testRuntime.S.house)');assert page.locator('#houseShare').is_disabled();rect=page.evaluate('__testRuntime.houseRoomRect("sala")');page.locator('#w').click(position={'x':rect['x']+rect['w']*.4,'y':rect['y']+rect['h']*.5});assert page.evaluate('JSON.stringify(__testRuntime.S.house)')==future,'future save is never edited by tapping'
   assert not errors,errors;print('PASS earned placement, native room drawing, read-only visit, reload and preserved radial workshop at '+str(width),flush=True)
  b.close()
finally:server.shutdown()
