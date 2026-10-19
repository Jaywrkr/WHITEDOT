"""A naturally generated rare individual: native contact, truthful context, portrait and export."""
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
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=browser.new_page(viewport={'width':390,'height':844},has_touch=True,accept_downloads=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})");page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=card-world&layout=wide&generation=2&travel=1');page.wait_for_function('__testRuntime?.S.mode==="world"');page.evaluate('()=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);const r=__testRuntime;r.audio();window.__livingNotes=[];r.livingNoteCue=n=>__livingNotes.push(n);let found;outer:for(let x=-40;x<=40;x++)for(let y=-20;y<=20;y++){r.S.wx=(x+.5)*r.WCH;r.S.wy=(y+.5)*r.WCH;found=r.livingNear().find(o=>o.rare&&o.group!=="architecture");if(found)break outer;}if(!found)throw Error("No natural rare fixture");window.__rareLiving=found;r.S.wx=found.x-80;r.S.wy=found.y;}')
  page.wait_for_timeout(200);page.evaluate('()=>{const r=__testRuntime;r.S.wx=__rareLiving.x;r.S.wy=__rareLiving.y;}');page.wait_for_function('__testRuntime.rareCards.some(c=>c.sourceId===__rareLiving.id)',timeout=6000)
  card=page.evaluate('__testRuntime.rareCards.find(c=>c.sourceId===__rareLiving.id)');assert not card['forced'];assert card['context']['instrument'] and card['context']['role']
  expected=page.evaluate('(type)=>import("/src/rare-card-model.js").then(m=>m.rareDefinition(type).probability)',card['type'])
  assert card['odds']['probability']==expected,'the book must retain the current, truthful conditional rarity'
  assert card['appearance']==page.evaluate('__rareLiving.anatomy'),'portrait must preserve the specimen actually found'
  page.evaluate('()=>{const r=__testRuntime,c=r.rareCards.find(c=>c.sourceId===__rareLiving.id);r.collectRareCard(c.type,__rareLiving,{context:{...c.context,phase:"otra fase"}});}')
  page.evaluate('__testRuntime.openJournal("rares")');page.wait_for_timeout(150);count=page.evaluate('__livingNotes.length');page.locator('#rareFilter').select_option(page.evaluate('__rareLiving.group'));page.wait_for_timeout(350);assert page.evaluate('__livingNotes.length')==count
  page.locator('.rare-card-details > summary').first.click();page.locator('[data-rare-technique]').first.click();assert page.evaluate('__testRuntime.cardTechnique(__rareLiving)')!='normal'
  page.locator('[data-atlas-start]').first.click();assert page.evaluate('!!__testRuntime.atlasState.active')
  assert card['name'] in page.locator('#journalBody').inner_text();assert page.locator('.rare-portrait svg').count()>=1
  page.locator('.rare-card-details > summary').first.click()
  with page.expect_download() as info:page.locator('[data-rare-png]').first.click()
  target=info.value.path();assert Path(target).read_bytes().startswith(b'\x89PNG\r\n\x1a\n');assert page.evaluate('__livingNotes.length')==count
  page.evaluate('''()=>{const r=__testRuntime;document.getElementById('mJournal').hidden=true;const goal=r.atlasState.active.role;let found;outer:for(let x=-8;x<=8;x++)for(let y=-8;y<=8;y++){r.S.wx=x*r.WCH;r.S.wy=y*r.WCH;found=r.livingNear(750).find(o=>o.id!==r.atlasState.active.fromSource&&r.getVoice('living:'+o.kind,r.regionOfPos(o.x,o.y),o).role===goal);if(found)break outer;}if(!found)throw Error('No complementary voice');window.__atlasTarget=found;r.S.wx=found.x-70;r.S.wy=found.y;}''');page.wait_for_timeout(150);page.evaluate('__testRuntime.S.wx=__atlasTarget.x;__testRuntime.S.wy=__atlasTarget.y');page.wait_for_function('__testRuntime.atlasState.completed.length>0&&!__testRuntime.atlasState.active')
  assert not errors,errors;print('PASS natural rare individual via cube, original conditional odds, ecological/instrument context, filtered silent book and genuine PNG export');browser.close()
finally:server.shutdown()
