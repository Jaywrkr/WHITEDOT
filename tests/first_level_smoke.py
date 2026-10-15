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
   light=page.evaluate('''()=>{const r=__testRuntime,lights=[];for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)lights.push(...r.getChunk(x,y));const m=lights.filter(o=>Math.hypot(o.x-r.S.px,o.y-r.S.py)>30).sort((a,b)=>Math.hypot(a.x-r.S.px,a.y-r.S.py)-Math.hypot(b.x-r.S.px,b.y-r.S.py))[0];return {x:m.x-r.S.px,y:m.y-r.S.py};}''')
   assert abs(light['x'])<width/2-8 and abs(light['y'])<height/2-8,light
   page.mouse.move(width/2,height/2);page.mouse.down();page.mouse.move(width/2+light['x'],height/2+light['y'],steps=8);page.wait_for_function('__testRuntime.worldReady()');page.mouse.up()
   page.wait_for_function('document.getElementById("firstJourney").dataset.step==="world"')
   page.locator('#bPrimary').click();page.locator('#hwGo').click();page.wait_for_function('__testRuntime.firstJourneyState.next==="voice"')
   page.reload();page.wait_for_function('window.__testRuntime?.firstJourneyState.next==="voice"')
   assert page.evaluate('localStorage.getItem("whitedot:first-journey:v1")') is None,'an unfinished lesson must not mark the introduction globally complete'
   page.evaluate('''()=>{const r=__testRuntime,near=r.sceneChunk(r.wchunk(Math.floor(r.S.wx/r.WCH),Math.floor(r.S.wy/r.WCH)));const o=near.playthings[0];if(!o)throw Error('No native source fixture');o.x=o.hx=r.S.wx+65;o.y=o.hy=r.S.wy;o.cd=0;o.touching=false;window.__lessonSource=o;}''')
   page.mouse.move(width/2,height/2);page.mouse.down();page.mouse.move(width/2+80,height/2,steps=8);page.wait_for_function('__testRuntime.firstJourneyState.next==="pulse"');page.mouse.up()
   assert page.evaluate('Object.keys(__testRuntime.S.voiceLearned).length')>0
   panel=page.locator('#firstJourney').bounding_box();assert panel['width']*panel['height']<width*height*.12,panel
   page.screenshot(path=f'/tmp/whitedot-first-level-{width}.png')
   page.mouse.click(22,height/2-120);page.wait_for_function('__testRuntime.firstJourneyState.next==="save"')
   page.locator('#bMenu').click();assert page.locator('#firstJourney').is_hidden();page.locator('#bFavorites').click();page.locator('#favName').fill('Mi primera voz');page.locator('#favSave').click();page.locator('#favoritesClose').click()
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
  visitor.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=new-visitor&layout=classic&generation=2&travel=1');visitor.wait_for_function('window.__testRuntime?.firstJourneyState.next==="voice"');assert visitor.locator('#firstJourney').is_visible();visitor.close();print('PASS a first shared-world visitor receives brief guidance',flush=True)
  b.close()
finally:server.shutdown()
