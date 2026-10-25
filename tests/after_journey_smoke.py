"""Production-looking handoff: no old saving lesson; a free walking guide and optional practice."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  p=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
  p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://kubono.localhost:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.ringRoute&&__r.inWorld()')
  p.evaluate("()=>{const r=__r;r.S.sound=false;r.stopAutopilot?.();r.setJourneyMode('libre');r.S.sparks=0;r.S.firstJourney={version:1,skipped:false,facts:{move:true,light:true,world:true,voice:true,pulse:true}};document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);}")
  p.wait_for_function('__r.firstJourneyState.next===null&&document.getElementById("firstJourney").hidden')
  assert not p.evaluate('__r.S.firstJourney.facts.save'),'hiding the old lesson never invents progress'
  before=p.evaluate('[__r.S.wx,__r.S.wy,__r.S.sparks]');p.evaluate('__r.$("bGuide").click()')
  assert '5/11' in p.inner_text('#guideProgress') and '6' in p.inner_text('#guideProgress')
  assert p.locator('#guideExplore').evaluate('e=>!e.open')
  assert 'Jardín' in p.inner_text('#guideFollow');p.locator('#guideFollow').click();p.wait_for_function('!document.getElementById("ringRoute").hidden')
  assert p.evaluate('[__r.S.wx,__r.S.wy,__r.S.sparks]')==before,'following is free and does not warp'
  assert p.evaluate('__r.ringRoute().id')=='jardin'
  # Explicit practice still works after completing the campaign.
  p.evaluate('__r.$("bGuide").click()');p.locator('#guidePractice').click();p.wait_for_function('__r.firstJourneyState.next==="voice"')
  assert p.locator('#firstJourney').is_visible() and 'Activa el sonido' in p.inner_text('#firstJourneyText')
  assert not errors,errors;b.close()
 print('PASS post-Journey: no old saving prompt, facts preserved, 5/11 and six remaining, free walking guide without teleport and explicit practice',flush=True)
finally:srv.shutdown();srv.server_close()
