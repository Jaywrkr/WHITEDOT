"""Actual rare contacts, compact cards, book/coordinates, pause, persistence and migration."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for size in [{'width':390,'height':844},{'width':844,'height':390},{'width':1280,'height':800}]:
   context=browser.new_context(viewport=size,has_touch=True,permissions=['clipboard-read','clipboard-write']);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
   page.evaluate('()=>{const r=__testRuntime;document.querySelectorAll(".modal").forEach(m=>m.hidden=true);r.labGo("rhythm:fossil");}');page.wait_for_timeout(300)
   page.evaluate('()=>{const r=__testRuntime,o=r.nearbyPercussion()[0];r.S.wx=o.x;r.S.wy=o.y;}')
   page.wait_for_function('__testRuntime.rareCards.some(c=>c.type==="fossil")');page.wait_for_function('!document.getElementById("rareNotice").hidden')
   assert page.locator('#rareNoticeName').inner_text()=='Fósil de ritmo';assert 'laboratorio' in page.locator('#rareNoticeTier').inner_text().lower()
   assert '1/640' in page.locator('#rareNoticeOdds').inner_text();assert page.evaluate('__testRuntime.rareCards[0].forced')
   rect=page.locator('#rareNotice').bounding_box();assert rect['width']*rect['height']<size['width']*size['height']*.2,rect
   assert rect['x']>=0 and rect['x']+rect['width']<=size['width'] and rect['y']+rect['height']<size['height'],rect
   page.screenshot(path=f'/tmp/whitedot-rare-notice-{size["width"]}.png')
   # A menu hides the reveal and pauses its active-play clock; it never consumes the finding.
   page.locator('#bMenu').click();page.wait_for_timeout(150);assert page.locator('#rareNotice').is_hidden()
   remaining=page.evaluate('__testRuntime.rareNoticeState.remaining');page.wait_for_timeout(800);assert page.evaluate('__testRuntime.rareNoticeState.remaining')==remaining
   page.locator('#mnClose').click();page.wait_for_function('!document.getElementById("rareNotice").hidden')
   # Tools pause the reveal, so the finding is never lost behind another panel.
   page.evaluate('document.getElementById("bFx").click()');page.wait_for_function('document.getElementById("rareNotice").hidden')
   remaining=page.evaluate('__testRuntime.rareNoticeState.remaining');page.wait_for_timeout(400)
   assert page.evaluate('__testRuntime.rareNoticeState.remaining')==remaining
   page.locator('#fxClose').click();page.wait_for_function('!document.getElementById("rareNotice").hidden')
   page.locator('#rareNoticeOpen').click();assert page.locator('#mJournal').is_visible();assert 'Fósil de ritmo' in page.locator('#journalBody').inner_text();page.locator('.rare-card-details > summary').first.click();assert 'Muestra forzada' in page.locator('#journalBody').inner_text()
   page.screenshot(path=f'/tmp/whitedot-rare-book-{size["width"]}.png')
   before=page.evaluate('({q:__testRuntime.MU.q8.length,w:__testRuntime.waves.length})')
   page.locator('[data-rare-copy="0"]').click();page.wait_for_timeout(150)
   code=page.evaluate('navigator.clipboard.readText()');assert code.startswith('WD1-')
   assert page.evaluate('async code=>{const {decodePlace}=await import("/src/share-tools.js");return JSON.stringify(decodePlace(code).address)===JSON.stringify(__testRuntime.rareCards[0].address);}',code)
   assert page.evaluate('__testRuntime.MU.q8.length')<=before['q'];assert page.evaluate('__testRuntime.waves.length')<=before['w'],'book UI cannot pulse'
   page.locator('[data-rare-return="0"]').click();assert page.locator('#mJournal').is_hidden()
   assert page.evaluate('()=>{const r=__testRuntime,p=r.favorites.find(p=>p.id===r.S.destination),c=r.rareCards[0];return p&&p.x===c.address.x&&p.y===c.address.y;}')
   page.evaluate('__testRuntime.renameFavorite(__testRuntime.S.destination,"Mi rincón");__testRuntime.openJournal("rares")');page.locator('.rare-card-details > summary').first.click();page.locator('[data-rare-return="0"]').click();assert page.evaluate('__testRuntime.favorites.find(p=>p.id===__testRuntime.S.destination).name')=='Mi rincón'
   count=page.evaluate('__testRuntime.rareCards.length');page.evaluate('__testRuntime.labGo("rhythm:fossil")');page.wait_for_timeout(300)
   page.evaluate('()=>{const r=__testRuntime,o=r.nearbyPercussion()[0];r.S.wx=o.x;r.S.wy=o.y;}');page.wait_for_timeout(900);assert page.evaluate('__testRuntime.rareCards.length')==count,'revisit must not duplicate'
   page.evaluate('__testRuntime.save()');page.reload();page.wait_for_function('__testRuntime?.labMode');assert page.evaluate('__testRuntime.rareCards.length')==count
   # Reload restores the collection but never replays old popups.
   page.wait_for_timeout(200);assert page.locator('#rareNotice').is_hidden()
   if size['width']==390:
    # Genuine, seeded fossil; approach then contact with the cube.
    page.evaluate('''async()=>{const r=__testRuntime,{createRhythmElements}=await import('/src/percussion-model.js');let o;outer:for(let x=-100;x<100;x++)for(let y=-70;y<70;y++){const d=r.regionOfPos((x+.5)*r.WCH,(y+.5)*r.WCH);if(d.sea||d.anomaly)continue;const hit=createRhythmElements(x,y,r.WCH,d,r.seedOf,r.rng).find(o=>o.kind==='fossil');if(hit){o=hit;break outer;}}if(!o)throw Error('missing natural fossil fixture');window.__natural=o;r.labRhythm=null;r.S.wx=o.x-75;r.S.wy=o.y;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}''')
    page.wait_for_timeout(350);page.evaluate('__testRuntime.S.wx=__natural.x');page.wait_for_function('__testRuntime.rareCards.some(c=>c.sourceId===__natural.id)')
    assert page.evaluate('__testRuntime.rareCards.find(c=>c.sourceId===__natural.id).forced') is False
    # Actual relic completion goes through dwell+pulses, not directly through collectRareCard.
    page.evaluate('''async()=>{const r=__testRuntime,{relicAt}=await import('/src/relics.js');let source;outer:for(let x=-100;x<100;x++)for(let y=-70;y<70;y++){const o=relicAt(x,y,r.WCH,r.seedOf,r.rng);if(o?.magical&&!r.regionOfPos(o.x,o.y).anomaly){source=o;break outer;}}if(!source)throw Error('no magic relic fixture');window.__relic=source;r.S.wx=source.x;r.S.wy=source.y;for(let i=0;i<5;i++)r.visitRelic(source,0,true);for(let i=0;i<241;i++)r.visitRelic(source,.05);}''')
    assert page.evaluate('__testRuntime.rareCards.some(c=>c.type==="relic:magical"&&c.sourceId===__relic.id)')
    # Only earned/present evidence is migrated; generic fossil flags have no guessed location.
    page.evaluate('()=>{const r=__testRuntime;r.S={...r.S,rareBook:undefined,rhythmFound:{fossil:1}};r.rareCardTick(0);}')
    assert page.evaluate('__testRuntime.rareCards.some(c=>c.type==="fossil"&&c.precision==="unknown"&&c.address===null)')
    assert page.evaluate('__testRuntime.rareCards.some(c=>c.type==="relic:magical"&&c.legacy&&c.address.x===__relic.x)')
    page.evaluate('()=>{const r=__testRuntime;r.S={...r.S,rareBook:undefined,rhythmFound:{},stars:[],anomalies:{}};r.rareCardTick(0);}')
    assert page.evaluate('__testRuntime.rareCards.length')==0;assert page.locator('#rareNotice').is_hidden()
    # The page-size limit bounds DOM work; fallback codes remain copyable without clipboard access.
    page.evaluate("()=>{const r=__testRuntime;for(let i=0;i<13;i++)r.collectRareCard('fossil',{id:'fixture:'+i,x:r.S.wx+i,y:r.S.wy},{forced:true});r.openJournal('rares');}")
    assert page.locator('.rare-card').count()==12
    page.locator('[data-rare-page="1"]').click();assert page.locator('.rare-card').count()==1
    page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('clipboard unavailable')}}})")
    page.locator('.rare-card-details > summary').first.click();page.locator('[data-rare-copy="0"]').click();page.wait_for_function('!document.getElementById("rareCodeFallback").hidden')
    assert page.locator('#rarePlaceCode').input_value().startswith('WD1-')
    page.locator('[data-journal-tab="collection"]').click();page.locator('#journalGroup').select_option('elementos');assert page.locator('#rareCodeFallback').is_hidden()
    page.locator('#journalClose').click()
    page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=otro-mundo&layout=wide&generation=2');page.wait_for_function('__testRuntime?.inWorld()');assert page.evaluate('__testRuntime.rareCards.length')==0,'preview libraries cannot leak into another seed'
   assert not errors,errors;print(f'PASS rare cards at {size}: native contact, truthful forced label, compact notice, paused clock, silent book, return code, dedupe and persistence',flush=True);context.close()
  browser.close()
finally:server.shutdown()
