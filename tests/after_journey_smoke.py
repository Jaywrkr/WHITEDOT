"""Production-looking handoff: no old saving lesson; a free walking guide and optional practice."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading,time,json
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  p=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
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
  # Walk using the actual keyboard handler; never assign world coordinates or call ringGo.
  initial=p.evaluate('({route:__r.ringRoute(),distance:__r.S.playerProfile.distanceUnits,spent:__r.sparkEconomy.spent})')
  p.locator('#w').focus();held=set();start=time.monotonic()
  while True:
   observed=p.evaluate('({run:__r.placeRun()?.id,aim:__r.ringRoute()})')
   if observed.get('run')=='jardin':break
   assert time.monotonic()-start<110,'walking did not reach Jardín'
   aim=observed['aim'];assert aim, 'walking guide lost its target'
   want=set()
   if abs(aim['dx'])>10:want.add('ArrowRight' if aim['dx']>0 else 'ArrowLeft')
   if abs(aim['dy'])>10:want.add('ArrowDown' if aim['dy']>0 else 'ArrowUp')
   for k in held-want:p.keyboard.up(k)
   for k in want-held:p.keyboard.down(k)
   held=want;p.wait_for_timeout(180)
  for k in held:p.keyboard.up(k)
  walking=p.evaluate('({id:__r.placeRun().id,distance:__r.S.playerProfile.distanceUnits,spent:__r.sparkEconomy.spent})')
  assert walking['spent']==initial['spent'],'walking cannot charge a jump'
  assert walking['distance']>initial['distance']+initial['route']['distance']*.6,(initial,walking)
  print('WALK',json.dumps({'elapsedSeconds':round(time.monotonic()-start,1),'initialPortalDistance':round(initial['route']['distance']),'walkedUnits':round(walking['distance']-initial['distance']),'arrival':walking['id'],'spentDelta':walking['spent']-initial['spent']}),flush=True)
  # Accelerate only the reward boundary, through its real commit function; walking above is unmodified.
  assert p.evaluate('__r.placeFinish("jardin")')
  p.wait_for_function('!document.getElementById("mPlace").hidden');p.locator('#placeNext').click()
  assert p.evaluate('__r.ringRoute().id')=='dunas'
  from browser_helpers import keep_place_on_reload
  keep_place_on_reload(p);p.reload();p.wait_for_function('!!window.__r?.ringRoute&&__r.inWorld()');p.evaluate("__r.setJourneyMode('libre')")
  p.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)")
  assert p.evaluate('__r.S.lugares.stars.jardin[0]') and p.evaluate('__r.ringRoute().id')=='dunas','completion and next destination survive reload'
  # Returning to Camino and following again is a valid visible action.
  p.locator('#bMenu').click();p.evaluate("document.getElementById('menuMore').open=true");p.locator('#bPrimary').click();p.wait_for_function('__r.S.mode==="camino"')
  p.locator('#bMenu').click();p.locator('#bContinue').click();p.wait_for_function('__r.inWorld()&&__r.ringRoute()?.id==="dunas"')
  # Explicit practice still works after completing the campaign.
  p.evaluate('__r.$("bGuide").click()');p.locator('#guidePractice').click();p.wait_for_function('__r.firstJourneyState.next==="voice"')
  assert p.locator('#firstJourney').is_visible() and 'Activa el sonido' in p.inner_text('#firstJourneyText')
  assert not errors,errors;b.close()
 print('PASS post-Journey: no old saving prompt, facts preserved, 5/11 and six remaining, free walking guide without teleport and explicit practice',flush=True)
finally:srv.shutdown();srv.server_close()
