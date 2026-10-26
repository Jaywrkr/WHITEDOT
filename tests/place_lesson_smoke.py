"""Recover a place's rule, replay its visual gesture and grow a real first flower."""
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
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for W,H in [(320,568),(390,844),(1280,800)]:
   p=b.new_page(viewport={'width':W,'height':H});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?lugar=jardin');p.wait_for_function('!!window.__r?.journeyGarden&&__r.placeRun()?.id==="jardin"')
   p.evaluate("()=>{const r=__r;r.S.sound=false;r.setJourneyMode('libre');document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}")
   p.locator('#bMenu').click();p.locator('#menuMore').evaluate('e=>e.open=true');p.locator('#bGuide').click()
   assert p.locator('#guidePlaceLesson').is_visible();assert p.locator('#guidePlaceSteps li').count()==3
   assert 'círculo' in p.inner_text('#guidePlaceSteps') and 'entre golpes' in p.inner_text('#guidePlaceSteps')
   p.locator('#guidePlaceDemo').click();p.wait_for_function('__r.gardenLessonState().replaying')
   p.wait_for_timeout(150)
   # Move to a bed with actual input; no direct garden state or points writes.
   target=p.evaluate('__r.journeyGarden().spots[0]');p.locator('#w').focus();p.keyboard.down('ArrowUp')
   p.wait_for_function('y=>Math.abs(__r.S.wy-y)<35',arg=target['y']);p.keyboard.up('ArrowUp')
   p.evaluate('__r.$("bGuide").click()');assert 'sembrar' in p.inner_text('#guidePlaceHint');p.locator('#guideClose').click()
   p.locator('#w').click(position={'x':W*.6,'y':H*.5});p.wait_for_timeout(300)
   p.evaluate('__r.$("bGuide").click()');assert 'regar' in p.inner_text('#guidePlaceHint');p.locator('#guideClose').click()
   for i in range(4):p.locator('#w').click(position={'x':W*.6,'y':H*.5});p.wait_for_timeout(300)
   assert p.evaluate('__r.journeyGarden().blooms')>=1,'the taught gesture grows a real flower'
   p.wait_for_timeout(100);assert p.evaluate('__r.gardenLessonState().done'),'picking retires the visual instruction'
   try:p.wait_for_function('__r.S.journey.garden.hinted',timeout=12000)
   except Exception:
    print('LESSON DEBUG',W,p.evaluate('({garden:__r.S.journey.garden,version:__r.S.journey.version,lines:__r.S.journey.lines,owner:__r.noticeLane.owner,pending:__r.noticeLane.pending,blocked:__r.noticeLane.blocked(),toast:document.getElementById("toast").textContent})'),flush=True)
    raise
   # A low-priority coalescing update must never discard a queued important notice.
   p.evaluate("__r.$('bGuide').click()")
   p.evaluate("()=>{__r.noticeLane.quietRoutine();window.__priorityShown=false;__r.toast('Importante',{level:2,force:true,category:'priority-test',coalesce:false,onShown:()=>window.__priorityShown=true});__r.toast('Rutina',{level:1,force:true,category:'priority-test',coalesce:true});}")
   assert not p.evaluate('__priorityShown'),'queued does not mean presented'
   p.locator('#guideClose').click();p.wait_for_function('__priorityShown',timeout=6000)
   assert not errors,errors;p.close()
  b.close()
 print('PASS place lessons: recoverable three-step guide, silent visual replay, real movement and first flower, retired on picking at three sizes',flush=True)
finally:srv.shutdown();srv.server_close()
