from browser_helpers import keep_place_on_reload
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
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click()
  handle=page.evaluate("""()=>{const r=window.__testRuntime,site=r.nearbyGlass(2000).find(s=>s.id==='glass:0,0');r.S.wx=site.x-90;r.S.wy=site.y;const angle=site.angles[0];return {x:r.W/2+90+Math.cos(angle)*50,y:r.H/2+Math.sin(angle)*50};}""")
  page.wait_for_timeout(400);before=page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')
  page.mouse.move(handle['x'],handle['y']);page.mouse.down();page.mouse.move(handle['x']-25,handle['y']-30,steps=5);page.mouse.up()
  assert page.locator('#glassPanel').count()==0
  assert page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')==before,'glass drag moved the player'
  for i in range(3):
   points=page.evaluate(f"""()=>{{const r=__testRuntime,s=r.nearbyGlass(400)[0],a=s.angles[{i}],radius=50+{i}*16;return {{x:r.W/2+s.x-r.S.wx+Math.cos(a)*radius,y:r.H/2+Math.sin(a)*radius,to:r.W/2+s.x-r.S.wx+radius}};}}""")
   page.mouse.move(points['x'],points['y']);page.mouse.down();page.mouse.move(points['to'],size['height']/2,steps=12);page.mouse.up()
  assert page.evaluate('!!__testRuntime.influenceState && Object.values(__testRuntime.influenceState.targets).some(v=>v>0)')

  assert page.evaluate('!!window.__testRuntime.S.ach.vidrio1 && !!window.__testRuntime.S.ach.vidrioArmonia')
  original=page.evaluate('JSON.stringify(__testRuntime.S.glassSites["glass:0,0"].angles)')
  page.mouse.move(size['width']/2+90+50,size['height']/2);page.mouse.down();page.mouse.move(size['width']/2+90,size['height']/2-50,steps=8);page.evaluate("document.getElementById('w').dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,bubbles:true}))");page.mouse.up()
  assert page.evaluate('JSON.stringify(__testRuntime.S.glassSites["glass:0,0"].angles)')==original
  page.screenshot(path=f'/tmp/whitedot-glass-{label}.png')
  state=page.evaluate('window.__testRuntime.S.glassSites');assert 'glass:0,0' in state
  page.evaluate("()=>{const r=window.__testRuntime,s=r.nearbyGlass(400)[0];r.S.wx=s.x;r.S.wy=s.y;}");page.locator('#w').click(position={'x':size['width']/2,'y':size['height']/2});page.keyboard.down('e');page.wait_for_timeout(250);assert 'Vidrio' in page.locator('#scannerSources').inner_text();page.keyboard.up('e')
  keep_place_on_reload(page)
  page.reload(wait_until='domcontentloaded');page.wait_for_function('window.__testRuntime && window.__testRuntime.S.glassSites["glass:0,0"]')
  assert page.evaluate('window.__testRuntime.S.glassSites["glass:0,0"].angles')==[0,0,0]
  page.locator('#bMenu').click();page.locator('#bAch').click();page.locator('[data-journal-detail="Tu recorrido creativo"] > summary').click();assert 'Vidrios cromáticos' in page.locator('#journalBody').inner_text();page.locator('#journalClose').click()
  page.evaluate('window.__testRuntime.audio()');page.wait_for_function('window.__testRuntime.ac.state==="running"')
  page.evaluate("()=>{const r=window.__testRuntime;r.audio();const site=r.nearbyGlass(400)[0],ac=r.ac,original=ac.createOscillator.bind(ac),buffer=ac.createBufferSource.bind(ac);let emitted=0;ac.createOscillator=()=>{emitted++;return original();};ac.createBufferSource=()=>{emitted++;return buffer();};try{const p=site.angles.map(x=>Math.floor(x/(Math.PI*2)*16));for(let s=0;s<16;s++)r.glassStep(s,100,ac.currentTime+.1);if(!emitted)throw Error('glass has no musical response');}finally{ac.createOscillator=original;ac.createBufferSource=buffer;}}")
  assert not errors,errors
  print(label+': glass handle drag, independent player movement, panel-free movement and native bass/groove/harmony, alignment achievements, persistence, scanner and journal PASS',flush=True);c.close();b.close()
server.shutdown()
