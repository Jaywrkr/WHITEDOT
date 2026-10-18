"""Native cube/reset, lab isolation, real recording lifecycle and optimistic tab safety."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  context=b.new_context(viewport={'width':390,'height':844},has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  context.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
  context.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  url=f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=closure&generation=2&layout=wide'
  page.goto(url);page.wait_for_function('__testRuntime?.labMode');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  page.evaluate('()=>{const r=__testRuntime;r.givePower("cometa");r.givePower("campo");r.startAutopilot("wander");r.loopButton();r.quietState.stage=6;r.S.softMusic=true;r.S.autoPins=true;r.jamUI();r.S.relaxedCreate=true;r.creativeModeUI();r.styleUI();}')
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dReset').click();page.locator('#dReset').click()
  assert page.evaluate('__testRuntime.S.mode')=='camino';assert page.evaluate('__testRuntime.autopilotState.mode') is None
  assert page.locator('#bSoft').get_attribute('aria-pressed')=='false';assert page.locator('#bAutoPins').get_attribute('aria-pressed')=='false';assert page.locator('#bCreateMode').get_attribute('aria-pressed')=='false'
  assert not page.evaluate('__testRuntime.jam.loop.armed');assert not page.evaluate('__testRuntime.hasPower("cometa")||__testRuntime.hasPower("campo")')
  from browser_helpers import complete_path_fixture
  complete_path_fixture(page)
  page.evaluate('()=>{const r=__testRuntime;r.S.todayLight=r.CAP;r.S.relaxedCreate=true;r.enterWorld();}')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)');page.wait_for_timeout(300)
  assert page.evaluate('typeof __testRuntime.S.listened')=='object';assert page.evaluate('__testRuntime.quietState.stage')==0
  # Lab forcing must not leak to Studio or another layer, even before the next animation frame.
  page.evaluate('__testRuntime.labGo("experimental:glitch")');assert page.evaluate('__testRuntime.experimentalLevel()')>=.8
  page.evaluate('__testRuntime.quietState.stage=6;__testRuntime.enterStudio()');assert page.evaluate('__testRuntime.experimentalLevel()')==0
  page.evaluate('__testRuntime.exitStudio();document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.audio()');page.wait_for_function('__testRuntime.ac.state==="running"')
  # Instrument the actual output connections and video tracks, then use native MediaRecorder.
  page.evaluate('()=>{const r=__testRuntime,proto=HTMLCanvasElement.prototype,capture=proto.captureStream;window.__captures=[];window.__frames=[];proto.captureStream=function(...a){const stream=capture.apply(this,a);__captures.push(stream);__frames.push([this.width,this.height]);return stream;};window.__revoked=[];const revoke=URL.revokeObjectURL.bind(URL);URL.revokeObjectURL=url=>{__revoked.push(url);revoke(url);};window.__out=0;window.__head=0;window.__clip=0;for(const [key,counter]of [["master","__out"],["headroom","__head"],["clipper","__clip"]]){const node=r.outputStage[key],connect=node.connect.bind(node);node.connect=(...a)=>{window[counter]++;return connect(...a);};}}')
  for i in range(2):
   assert page.evaluate('__testRuntime.startSet()');page.wait_for_timeout(450);assert page.evaluate('__testRuntime.stopSet()')
   page.wait_for_function('!__testRuntime.setRecording&&__testRuntime.lastSet?.size>0');assert page.locator('#mSet').is_visible()
   assert page.evaluate('__captures.every(s=>s.getTracks().every(t=>t.readyState==="ended"))')
   assert page.evaluate('__frames.at(-1)')==[1080,1350],'sets are recorded as 4:5 posts'
   page.locator('#setClose').click()
  assert page.evaluate('__out')==2;assert page.evaluate('__head')==0;assert page.evaluate('__clip')==0;assert page.evaluate('__revoked.length')==1
  page.evaluate('()=>{window.__Recorder=MediaRecorder;const Fake=function(){throw Error("codec unavailable")};Fake.isTypeSupported=__Recorder.isTypeSupported.bind(__Recorder);window.MediaRecorder=Fake;}')
  assert not page.evaluate('__testRuntime.startSet()');assert not page.evaluate('__testRuntime.setRecording');assert page.evaluate('__captures.at(-1).getTracks().every(t=>t.readyState==="ended")')
  page.evaluate('()=>{window.MediaRecorder=__Recorder;}')
  # Two pages share localStorage. The stale page must preserve the newer disk save.
  assert page.evaluate('__testRuntime.S.totalLight=100;__testRuntime.save()')
  # Freeze the first writer while opening the second; its active-world autosave
  # can otherwise win between load and the deliberately newer write.
  lifecycle=context.new_cdp_session(page);lifecycle.send('Page.setWebLifecycleState',{'state':'frozen'})
  other=context.new_page();other.goto(url);other.wait_for_function('__testRuntime?.labMode')
  assert other.evaluate('__testRuntime.S.totalLight=101;__testRuntime.save()'),other.evaluate('({status:__testRuntime.storageStatus,scope:__testRuntime.saveScope,key:__testRuntime.saveStore.key})')
  lifecycle.send('Page.setWebLifecycleState',{'state':'active'})
  assert not page.evaluate('__testRuntime.S.totalLight=3;__testRuntime.save()')
  assert page.evaluate('__testRuntime.storageStatus.kind')=='conflict';assert page.evaluate('JSON.parse(localStorage.getItem(__testRuntime.saveStore.key)).totalLight')==101
  assert not errors,errors;print('PASS V1: native reset/quiet/powers/loop, experimental scope, real repeated recording and failure cleanup, final audio output, and two-tab stale-save protection',flush=True)
  b.close()
finally:server.shutdown()
