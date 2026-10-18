"""Main-menu volume is silent, synchronized and durable; no automatic organ bank."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':320,'height':568},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__testRuntime?.styleUI')
  initial=page.evaluate('''()=>{const r=__testRuntime;if(r.ac)throw Error('Unexpected early context');const AC=window.AudioContext,oscillators=[],gains=[];window.AudioContext=function(){const ac=new AC(),osc=ac.createOscillator.bind(ac),gain=ac.createGain.bind(ac);ac.createOscillator=()=>{const o=osc();oscillators.push(o);return o;};ac.createGain=()=>{const g=gain();gains.push(g);return g;};return ac;};r.audio();const state={musicalDrones:oscillators.filter(o=>o.frequency.value>=130).length,boost:gains.some(g=>Math.abs(g.gain.value-8.4)<.0001)};document.getElementById('returnContinue').click();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);return state;}''')
  assert initial['musicalDrones']==0,initial
  assert initial['boost'],initial
  page.locator('#bMenu').click();before=page.evaluate('__testRuntime.waves.length');page.locator('#rMenuVolume').fill('25');page.locator('#rMenuVolume').dispatch_event('change')
  assert page.locator('#menuVolumeNow').inner_text()=='25%'
  assert page.locator('#rVolume').input_value()=='25'
  assert page.evaluate('__testRuntime.musicVolume()')==.25
  assert page.evaluate('__testRuntime.waves.length')==before
  page.locator('#bMusicSettings').click();assert page.locator('#volumeNow').inner_text()=='25%';page.locator('#rVolume').fill('0');page.locator('#rVolume').dispatch_event('change');assert page.evaluate('__testRuntime.musicVolume()')==0
  page.locator('#muClose').click();page.reload();page.wait_for_function('!!window.__testRuntime?.styleUI');assert page.evaluate('__testRuntime.S.outputVolume')==0
  page.evaluate('document.getElementById("returnContinue").click();document.querySelectorAll(".modal").forEach(m=>m.hidden=true)');page.locator('#bMenu').click();assert page.locator('#rMenuVolume').input_value()=='0'
  assert not errors,errors;print('PASS silent synchronized menu/sound volume, persisted zero, protected 1.5x makeup gain and no automatic organ oscillator bank');b.close()
finally:server.shutdown()
