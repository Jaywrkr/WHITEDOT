"""Daily first light, unlimited exploration, preserved legacy saves and optional guidance."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(320,740),(390,844),(844,390)]:
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('typeof window.__testRuntime?.worldReady==="function"')
   assert not page.evaluate('__testRuntime.worldReady()')
   page.locator('#hcGo').click()
   page.evaluate('''()=>{const r=__testRuntime;r.S.sound=false;r.enterWorld();if(r.inWorld())throw Error('Daily ritual bypassed');let light;for(let x=-2;x<3&&!light;x++)for(let y=-2;y<3&&!light;y++)light=r.getChunk(x,y)[0];if(!light)throw Error('No native Camino light');r.collect(light);r.S.ach.keep='2026-10-01';r.S.lampUsed=999999;r.S.relaxedCreate=false;r.save();}''')
   assert page.evaluate('__testRuntime.worldReady() && !__testRuntime.isFree()'),'one light must open the world before the optional full bar'
   page.locator('#bPrimary').click();page.locator('#hwGo').click()
   page.wait_for_timeout(180);assert page.evaluate('__testRuntime.inWorld() && __testRuntime.S.lampUsed===999999')
   page.locator('#bMenu').click();page.locator('#bGuide').click();assert page.locator('#mGuide').is_visible()
   assert 'identidad musical' in page.locator('#mGuide').inner_text()
   assert 'criatura' in page.locator('#guideNext').inner_text()
   page.locator('#guideGlossary').click();assert 'poderes temporales' in page.locator('#mGuide').inner_text()
   assert 'escuchando cerca y lanzando pulsos' in page.locator('#mGuide').inner_text()
   assert page.locator('#guideTitle').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')<=22
   before=page.evaluate('({waves:__testRuntime.waves.length,context:!!__testRuntime.ac})')
   page.locator('#guideClose').click()
   page.evaluate('__testRuntime.S.voiceLearned={bajo:true};__testRuntime.save()')
   page.locator('#bMenu').click();page.locator('#bGuide').click();assert 'Favoritos' in page.locator('#guideNext').inner_text()
   assert page.evaluate('!!__testRuntime.ac')==before['context'],'guide must not create audio'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.screenshot(path=f'/tmp/whitedot-closure-guide-{width}.png')
   page.locator('#guideClose').click();page.reload();page.wait_for_function('__testRuntime?.inWorld()')
   assert page.evaluate('__testRuntime.S.ach.keep')=='2026-10-01'
   assert page.evaluate('__testRuntime.S.lampUsed')==999999,'legacy history must not be erased'
   page.evaluate('''()=>{const r=__testRuntime;r.S.offset++;r.checkDay();if(!r.inWorld())throw Error('Midnight interrupted music');r.save();}''')
   page.reload();page.wait_for_function('typeof window.__testRuntime?.worldReady==="function"')
   assert page.evaluate('__testRuntime.S.mode')=='camino';assert not page.evaluate('__testRuntime.worldReady()')
   assert page.evaluate('__testRuntime.S.ach.keep')=='2026-10-01'
   page.reload();page.wait_for_function('typeof window.__testRuntime?.worldReady==="function"');assert page.evaluate('__testRuntime.S.mode')=='camino'
   assert not errors,errors;print('PASS daily first light, no expiry, same-day return, next-day Camino, saved rewards and silent optional guide at '+str(width),flush=True);page.close()
  b.close()
finally:server.shutdown()
