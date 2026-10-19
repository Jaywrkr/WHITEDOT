"""Illustrated optional guide, factual replay, twelve localized reference motifs and saved progress."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(320,640),(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=recorrido-{width}');page.wait_for_function('!!window.__r?.firstJourneyState')
   page.evaluate("()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.sound=false;r.S.todayLight=1;r.S.mode='world';r.S.help.mundo=true;r.hud();}")
   before=page.evaluate('({audio:!!__r.ac,waves:__r.waves.length})');page.locator('#bMenu').click();page.locator('#bGuide').click()
   assert page.locator('#guideJourney li').count()==4;assert page.locator('#guideJourney [aria-current=step]').count()==1;assert 'cristales' in page.locator('#mGuide').inner_text()
   assert page.locator('#guideDefinitions').is_hidden();page.locator('#guideGlossary').click();assert 'Instrumentos vivos' in page.locator('#guideDefinitions').inner_text();assert 'poderes temporales' in page.locator('#guideDefinitions').inner_text()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('#guideJourney').evaluate('e=>e.scrollWidth<=e.clientWidth+1');assert page.locator('#guidePractice').bounding_box()['height']>=44;assert page.locator('#guideClose').bounding_box()['y']+page.locator('#guideClose').bounding_box()['height']<=height,{'height':height,'footer':page.locator('#guideClose').bounding_box(),'sheet':page.locator('.guide-sheet').bounding_box(),'layout':page.locator('.guide-sheet').evaluate('e=>({display:getComputedStyle(e).display,children:[...e.children].map(n=>({tag:n.tagName,cls:n.className,flex:getComputedStyle(n).flex,h:n.getBoundingClientRect().height,min:getComputedStyle(n).minHeight}))})')}
   page.screenshot(path=f'/tmp/whitedot-guide-final-{width}.png');page.locator('#guidePractice').click();page.wait_for_function('__r.firstJourneyState.next==="voice"')
   assert 'Activa el sonido' in page.locator('#firstJourneyText').inner_text();assert page.locator('#firstJourneyProgress').inner_text()=='4/6';assert page.evaluate('!!__r.ac')==before['audio'],'guide/replay cannot create audio'
   # Muted and ambient events cannot complete the audible encounter lesson.
   page.evaluate("()=>{const r=__r;r.voiceGuideHear('arbol',r.regionOfPos(r.S.wx,r.S.wy),{x:r.S.wx,y:r.S.wy},'player');}");assert page.evaluate('__r.firstJourneyState.next')=='voice'
   page.locator('#firstJourneySkip').click();page.locator('#bMenu').click();page.locator('#bGuide').click();assert page.locator('#guideDefinitions').is_hidden();page.locator('#guideClose').click()
   # Draw each reference motif from an actual native region, without injecting scenes.
   for kind in ['brotes','nudo','telarana','red-orbital']:
    page.evaluate("""kind=>{const r=__r;let found;for(let x=-45;x<45&&!found;x++)for(let y=-12;y<12&&!found;y++){r.S.wx=x*1000;r.S.wy=y*1000;found=r.nearbyVisualSegments().find(q=>q.kind===kind);}if(!found)throw Error('Missing native VJ '+kind);r.S.wx=found.x;r.S.wy=found.y;}""",kind);page.wait_for_timeout(70)
    assert page.evaluate('__r.vjState.cache<=48');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.screenshot(path=f'/tmp/whitedot-td-final-{width}.png');page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(80);page.emulate_media(reduced_motion='no-preference')
   page.evaluate('__r.S.firstJourney.extension={earned:9};__r.S.firstJourney.facts.unrecognized=true;__r.save()');page.reload();page.wait_for_function('!!window.__r?.firstJourneyState');assert page.evaluate('__r.S.firstJourney.extension.earned')==9;assert page.evaluate('__r.S.firstJourney.facts.unrecognized')
   assert not errors,errors;print(f'PASS illustrated quiet guide, factual replay, saved extensions and four native TD motifs at {width}',flush=True)
  browser.close()
finally:server.shutdown()
