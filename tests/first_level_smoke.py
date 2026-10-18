"""Learn by moving, hearing an actual source, pulsing and saving; skip and replay safely."""
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
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('window.__testRuntime?.firstJourneyState')
   page.locator('#hcGo').click();page.wait_for_function('!document.getElementById("firstJourney").hidden')
   assert page.locator('#firstJourney').get_attribute('data-step')=='move'
   page.mouse.move(width/2,height/2);page.mouse.down();page.mouse.move(width/2+65,height/2,steps=8);page.wait_for_timeout(450);page.mouse.up()
   page.wait_for_function('__testRuntime.firstJourneyState.next==="light"')
   page.wait_for_function('document.getElementById("firstJourney").dataset.step==="light"&&document.getElementById("firstJourneyProgress").textContent.includes("/10")')
   assert 'cristales' in page.locator('#firstJourneyText').inner_text();assert '/10' in page.locator('#firstJourneyProgress').inner_text()
   for i in range(10):
    if page.evaluate('__testRuntime.inWorld()'):break
    page.wait_for_function('__testRuntime.crystalState.near.length>0')
    page.evaluate("()=>{const r=__testRuntime,o=r.crystalState.near.find(o=>!r.S.pathCrystals.includes(o.id)&&!o.broken);if(!o)throw Error('Missing path crystal');r.S.px=o.x;r.S.py=o.y-25;}")
    before=page.evaluate('__testRuntime.S.pathCrystals.length');page.wait_for_timeout(750);page.locator('#w').focus();page.keyboard.press('Space');page.wait_for_function('n=>__testRuntime.S.pathCrystals.length>n',arg=before)
   page.wait_for_function('__testRuntime.inWorld()&&__testRuntime.S.pathCrystals.length===10')
   assert page.locator('#mHelpW').is_hidden()
   page.wait_for_function('["voice","save"].includes(__testRuntime.firstJourneyState.next)')
   page.reload();page.wait_for_function('["voice","save"].includes(window.__testRuntime?.firstJourneyState.next)');page.locator('#returnContinue').click()
   assert page.evaluate('localStorage.getItem("whitedot:first-journey:v1")') is None,'an unfinished lesson must not mark the introduction globally complete'
   page.evaluate('''()=>{const r=__testRuntime,cx=Math.floor(r.S.wx/r.WCH),cy=Math.floor(r.S.wy/r.WCH);let o;for(let a=cx-2;a<=cx+2&&!o;a++)for(let b=cy-2;b<=cy+2&&!o;b++)o=r.sceneChunk(r.wchunk(a,b)).playthings[0];if(!o)throw Error('No native source fixture');r.S.wx=o.x-65;r.S.wy=o.y;r.camX=r.S.wx;r.camY=r.S.wy;o.cd=0;o.touching=false;window.__lessonSource=o;}''');page.wait_for_timeout(200)
   page.mouse.move(width/2,height/2);page.mouse.down();page.mouse.move(width/2+80,height/2,steps=8);page.wait_for_function('__testRuntime.firstJourneyState.next==="save"');page.mouse.up()
   assert page.evaluate('__testRuntime.S.firstJourney.facts.pulse'),'Camino already taught the pulse'
   assert page.evaluate('Object.keys(__testRuntime.S.voiceLearned).length')>0
   assert page.locator('#zone').evaluate('e=>getComputedStyle(e).visibility')=='hidden';assert page.locator('.goal').is_hidden();assert page.locator('#quickSave svg').is_visible();panel=page.locator('#firstJourney').bounding_box();assert panel['width']*panel['height']<width*height*.12,panel
   page.screenshot(path=f'/tmp/whitedot-first-level-{width}.png')
   page.wait_for_function('__testRuntime.firstJourneyState.next==="save"')
   page.locator('#quickSave').click();page.locator('#era').click();assert page.locator('#firstJourney').is_hidden();page.locator('[data-favorite] summary').click();page.locator('[data-favorite] input').fill('Mi primera voz');page.get_by_role('button',name='Renombrar',exact=True).click();page.locator('#favoritesClose').click();page.locator('#quickSave').click();assert page.locator('#mFavorites').is_visible();assert page.evaluate('__testRuntime.favorites.length===1&&__testRuntime.favorites[0].name==="Mi primera voz"');page.locator('#favoritesClose').click()
   page.wait_for_function('__testRuntime.firstJourneyState.next===null');assert page.locator('#firstJourney').is_hidden()
   page.locator('#bMenu').click();page.locator('#bGuide').click();page.evaluate('window.__lessonContext=__testRuntime.ac;window.__lessonPulses=__testRuntime.S.session.pulses');page.locator('#guidePractice').click()
   # A live source may already answer a previous wave after closing the menu.
   # Replay must remain active without manufacturing a pulse or saving a place.
   page.wait_for_function('["voice","pulse"].includes(__testRuntime.firstJourneyState.next)')
   assert not page.evaluate('__testRuntime.S.firstJourney.facts.pulse || __testRuntime.S.firstJourney.facts.save')
   assert page.evaluate('__testRuntime.S.session.pulses===window.__lessonPulses')
   assert page.evaluate('__testRuntime.ac===window.__lessonContext'),'practice is silent UI'
   page.locator('#firstJourneySkip').click();page.wait_for_function('document.getElementById("firstJourney").hidden');assert page.evaluate('document.activeElement.id')=='w';page.reload();page.wait_for_function('window.__testRuntime?.firstJourneyState')
   assert page.evaluate('__testRuntime.firstJourneyState.skipped');assert page.evaluate('__testRuntime.favorites[0].name')=='Mi primera voz'
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=known-visitor&layout=classic&generation=2&travel=1');page.wait_for_function('window.__testRuntime?.firstJourneyState')
   assert page.evaluate('__testRuntime.firstJourneyState.skipped'),'a new world must not repeat a completed introduction'
   assert page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).favorites.items[0].name')=='Mi primera voz'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert not errors,errors;print('PASS native first light, source contact, pulse, saved place, quiet replay/skip and reload at '+str(width),flush=True);page.close()
  visitor=b.new_page(viewport={'width':390,'height':844});visitor.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  visitor.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=new-visitor&layout=classic&generation=2&travel=1');visitor.wait_for_function('window.__testRuntime?.firstJourneyState.next==="voice"');visitor.locator('#firstJourney').wait_for(state='visible');assert visitor.locator('#firstJourney').is_visible();visitor.close();print('PASS a first shared-world visitor receives brief guidance',flush=True)
  b.close()
finally:server.shutdown()
