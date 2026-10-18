"""Ten-crystal gate, unlimited exploration, preserved legacy saves and optional guidance."""
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
  page=b.new_page(has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  for width,height in [(320,740),(390,844),(844,390)]:
   if page.url!='about:blank':page.evaluate('localStorage.clear()')
   page.set_viewport_size({'width':width,'height':height})
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('typeof window.__testRuntime?.worldReady==="function"')
   assert not page.evaluate('__testRuntime.worldReady()')
   page.evaluate('__testRuntime.S.sound=false')
   page.locator('#returnContinue').click();page.locator('#hcGo').click()
   assert not page.evaluate('__testRuntime.ac'),'muted tutorial entry must not allocate audio'
   # This test covers guide/history integration; game_loop_smoke exercises the real ten pulses.
   page.evaluate("""()=>{const r=__testRuntime;r.enterWorld();if(r.inWorld())throw Error('Daily ritual bypassed');r.S.pathCrystals=Array.from({length:10},(_,i)=>'guide:'+i);r.S.ach.keep='2026-10-01';r.S.lampUsed=999999;r.S.relaxedCreate=false;r.enterWorld({automatic:true});r.save();}""")
   assert page.evaluate('__testRuntime.worldReady() && !__testRuntime.isFree()')
   page.wait_for_timeout(180);assert page.evaluate('__testRuntime.inWorld() && __testRuntime.S.lampUsed===999999')
   page.locator('#bMenu').click();page.locator('#bGuide').click();assert page.locator('#mGuide').is_visible()
   assert 'Rompe cristales, recoge chispas' in page.locator('#mGuide').inner_text()
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
   page.screenshot(path=str(ROOT.parent/f'guide-history-{width}.png'))
   page.locator('#guideClose').click();page.reload();page.wait_for_function('__testRuntime?.inWorld()')
   assert page.evaluate('__testRuntime.S.ach.keep')=='2026-10-01'
   assert page.evaluate('__testRuntime.S.lampUsed')==999999,'legacy history must not be erased'
   page.evaluate('''()=>{const r=__testRuntime;r.S.offset++;r.checkDay();if(!r.inWorld())throw Error('Midnight interrupted music');r.save();}''')
   page.reload();page.wait_for_function('typeof window.__testRuntime?.worldReady==="function"')
   assert page.evaluate('__testRuntime.S.mode')=='camino';assert not page.evaluate('__testRuntime.worldReady()')
   assert page.evaluate('__testRuntime.S.ach.keep')=='2026-10-01'
   page.reload();page.wait_for_function('typeof window.__testRuntime?.worldReady==="function"');assert page.evaluate('__testRuntime.S.mode')=='camino'
   assert not errors,errors;print('PASS ten-crystal gate, no expiry, same-day return, next-day Camino, saved rewards and silent optional guide at '+str(width),flush=True)
  b.close()
finally:server.shutdown()
