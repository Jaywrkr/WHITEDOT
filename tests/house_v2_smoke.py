"""Top-down house places earned sounds, keeps the old workshop and visits read-only. Refugio simple (alpha.234): what is
earned places itself; Colocar moves it by hand; the Taller and the code wait under «Más»."""
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
   # What is earned is already in place, marked automatic; Colocar moves the chosen one by hand.
   auto=page.evaluate('__testRuntime.S.house.objects.map(o=>[o.kind,!!o.auto])');assert auto and all(a for _,a in auto),auto;count=len(auto)
   page.locator('#housePlace').click();page.wait_for_function('__testRuntime.houseSettled()');rect=page.evaluate('window.__testRuntime.houseRoomRect("sala")');page.locator('#w').click(position={'x':rect['x']+rect['w']*.4,'y':rect['y']+rect['h']*.4})
   origin=page.evaluate("__testRuntime.S.house.objects.find(o=>o.kind==='obj:origen')");assert page.evaluate('window.__testRuntime.S.house.objects.length')==count and abs(origin['x']-.4)<.02 and 'auto' not in origin,origin;print('PLACED',flush=True)
   assert page.locator('#housePlace').get_attribute('aria-pressed')=='true' and page.locator('#housePlace').inner_text()=='Listo' and page.locator('#houseObjects').is_visible() and all(page.locator('#'+i).is_visible() for i in ['houseListen','housePlace','houseExit']),'the three actions stay in view'
   assert page.locator('#houseOverview').is_hidden() and page.locator('#houseShare').is_hidden(),'the code waits under «Más»'
   assert page.locator('#era').inner_text().startswith('Refugio · ')
   assert page.evaluate("()=>{const r=__testRuntime,objects=r.S.house.objects;r.S.totalDays=14;Object.keys(r.placesData().stars).forEach((id,i)=>r.placesData().stars[id]=i<8?[true,true,true]:[false,false,false]);const h=r.currentHouse();if(h.objects!==objects)return false;return ['sala','jardin','azotea','sotano'].every(id=>h.unlocked.includes(id))&&r.currentHouse()===h;}"),'new places and ★ unlock rooms without re-normalizing placed objects'
   # A room that opens takes back what is automatic in it (house-auto.js); wait for that before comparing saves.
   page.wait_for_function("__testRuntime.S.house.objects.filter(o=>o.auto&&o.kind.startsWith('obj:biome:')).every(o=>o.room==='azotea')",timeout=5000)
   ink=page.evaluate('''()=>{const r=__testRuntime,rect=r.houseRoomRect('sala');r.cx.globalAlpha=.01;r.houseStep(performance.now(),.01,0);r.cx.globalAlpha=1;const d=r.cx.getTransform().a,p=r.cx.getImageData(Math.floor(rect.x*d),Math.floor(rect.y*d),Math.floor(rect.w*d),Math.floor(rect.h*d)).data;let m=0;for(let i=0;i<p.length;i+=4)m=Math.max(m,p[i],p[i+1],p[i+2]);return m;}''');assert ink>50,ink
   page.locator('#housePlace').click();assert page.locator('#housePlace').get_attribute('aria-pressed')=='false';page.wait_for_function('__testRuntime.houseSettled()');rect=page.evaluate('window.__testRuntime.houseRoomRect("sala")');originalPosition=page.evaluate('JSON.stringify(__testRuntime.S.house.objects)');page.locator('#w').click(position={'x':rect['x']+rect['w']*.42,'y':rect['y']+rect['h']*.4});assert page.evaluate('JSON.stringify(__testRuntime.S.house.objects)')==originalPosition,'listening cannot nudge the placed object'
   # Looking never drags; in Colocar a drag moves it.
   page.mouse.move(rect['x']+rect['w']*.4,rect['y']+rect['h']*.4);page.mouse.down();page.mouse.move(rect['x']+rect['w']*.7,rect['y']+rect['h']*.6,steps=6);page.mouse.up();assert page.evaluate('JSON.stringify(__testRuntime.S.house.objects)')==originalPosition,'a drag while looking moves nothing'
   page.locator('#housePlace').click();page.mouse.move(rect['x']+rect['w']*.4,rect['y']+rect['h']*.4);page.mouse.down();page.mouse.move(rect['x']+rect['w']*.7,rect['y']+rect['h']*.6,steps=6);page.mouse.up();assert abs(page.evaluate("__testRuntime.S.house.objects.find(o=>o.kind==='obj:origen').x")-.7)<.03;page.locator('#housePlace').click()
   before=page.evaluate('JSON.stringify(window.__testRuntime.S.house.objects)');page.screenshot(path=f'/tmp/whitedot-v2-house-{width}.png')
   page.locator('#houseMore > summary').click();page.locator('#houseShare').click();code=page.locator('#houseCode').input_value();assert code.startswith('WH1-');page.locator('#houseVisit').click();assert page.locator('#houseObjects').is_disabled();assert page.evaluate('JSON.stringify(window.__testRuntime.S.house.objects)')==before
   page.locator('#houseExit').click();page.reload();page.wait_for_function('!!window.__testRuntime?.enterHouse');assert page.evaluate('JSON.stringify(window.__testRuntime.S.house.objects)')==before;assert page.evaluate('window.__testRuntime.S.studio.slots["0,4"]')=='canon'
   page.evaluate('document.getElementById("returnContinue").click();document.querySelectorAll(".modal").forEach(m=>m.hidden=true);window.__testRuntime.enterHouse()');page.wait_for_function('__testRuntime.houseSettled()');page.locator('#houseMore > summary').click();page.locator('#houseWorkshop').click();page.wait_for_function("!document.getElementById('studioPanel').hidden");assert page.evaluate('__testRuntime.S.house.workbench')==True;assert page.locator('#studioPanel').is_visible();assert not page.evaluate('window.__testRuntime.houseActive()')
   page.evaluate("()=>{const r=__testRuntime;r.S.house={version:9,objects:[{kind:'future:voice',room:'future',x:.2,y:.3}],unlocked:['sala'],playerRoom:'future',x:.2,y:.3,knownVisitors:{},earned:{secret:true}};r.enterHouse();}")
   future=page.evaluate('JSON.stringify(__testRuntime.S.house)');assert page.locator('#houseShare').is_disabled();rect=page.evaluate('__testRuntime.houseRoomRect("sala")');page.locator('#w').click(position={'x':rect['x']+rect['w']*.4,'y':rect['y']+rect['h']*.4});assert page.evaluate('JSON.stringify(__testRuntime.S.house)')==future,'future save is never edited by tapping'
   assert not errors,errors;print('PASS earned placement, native room drawing, read-only visit, reload and preserved radial workshop at '+str(width),flush=True)
  b.close()
finally:server.shutdown()
