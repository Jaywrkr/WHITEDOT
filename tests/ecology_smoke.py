"""Actual seed UI, touch/drag/cancel, musical roles, pause, reload and versioned backup isolation."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390),(1280,800)]:
   context=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_default_timeout(10000)
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=humedal-01&generation=2&layout=wide');page.wait_for_function('window.__testRuntime?.S.mode==="world"');page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
   assert page.evaluate('__testRuntime.REG*__testRuntime.WCH')==10800
   assert page.evaluate('__testRuntime.regionOfPos(__testRuntime.S.wx,__testRuntime.S.wy).ecology.id')=='humedal'
   page.evaluate("window.__object=__testRuntime.wchunk(6,6).ecologyObjects[0]")
   def point():return page.evaluate('({x:innerWidth/2+__object.x-__testRuntime.S.wx,y:innerHeight/2+__object.y-__testRuntime.S.wy})')
   pt=point();page.mouse.move(pt['x'],pt['y']);page.mouse.down();page.wait_for_timeout(120);page.mouse.up()
   page.wait_for_function('__testRuntime.S.ach.ecologyTouch');assert page.evaluate('__testRuntime.getVoice("ecology:"+__object.kind+":"+__object.channel,__testRuntime.regionOfPos(__object.hx,__object.hy)).role')!='agudo'
   # Modeling changes the existing composition without moving the player.
   pos=page.evaluate('[__testRuntime.S.wx,__testRuntime.S.wy]');pt=point();page.mouse.move(pt['x'],pt['y']);page.mouse.down();page.mouse.move(pt['x']+35,pt['y']-25,steps=8);page.mouse.up();assert page.evaluate('__object.bend')>.4;assert page.evaluate('[__testRuntime.S.wx,__testRuntime.S.wy]')==pos
   prior=page.evaluate('[__object.bend,__object.charge]');pt=point();page.mouse.move(pt['x'],pt['y']);page.mouse.down();page.mouse.move(pt['x']-35,pt['y']+25,steps=8)
   page.evaluate("document.getElementById('w').dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,isPrimary:true,bubbles:true}))");page.mouse.up();assert abs(page.evaluate('__object.bend')-prior[0])<.001
   # Menu pause preserves cultivation; mute does not enqueue musical responses.
   page.locator('#bMenu').click();charge=page.evaluate('__object.charge');page.wait_for_timeout(500);assert page.evaluate('__object.charge')==charge;page.locator('#mnClose').click()
   page.evaluate('__testRuntime.S.sound=false;__object.cd=0');queued=page.evaluate('__testRuntime.MU.q8.length');pt=point();page.mouse.click(pt['x'],pt['y']);assert page.evaluate('__testRuntime.MU.q8.length')<=queued;page.evaluate('__testRuntime.S.sound=true')
   page.evaluate('__testRuntime.S.wx=__object.hx;__testRuntime.S.wy=__object.hy;__testRuntime.MU.speed=0;for(let i=0;i<240;i++)__testRuntime.ecologyTick(.05,false)');assert page.evaluate('!!__testRuntime.S.ach.ecologyGrow')
   page.evaluate("__testRuntime.addFavorite('Mi humedal');__testRuntime.save()");assert page.evaluate('__testRuntime.favorites[0].address.layoutVersion')==2
   page.locator('#bMenu').click();page.locator('#bSaveTools').click()
   with page.expect_download() as event:page.locator('#saveExport').click()
   raw=Path(event.value.path()).read_bytes();backup=json.loads(raw);assert backup['worldIdentity']['generatorVersion']==2
   legacy={**backup,'worldIdentity':{**backup['worldIdentity'],'generatorVersion':1,'catalogVersion':1,'layoutVersion':1}}
   page.locator('#saveImportFile').set_input_files({'name':'legacy.json','mimeType':'application/json','buffer':json.dumps(legacy).encode()});page.wait_for_function('document.getElementById("saveStatus").textContent.includes("otra partida")');assert page.locator('#saveImportApply').is_disabled()
   page.locator('#saveToolsClose').click();page.reload();page.wait_for_function('window.__testRuntime?.favorites?.length===1');assert page.evaluate('!!__testRuntime.S.ach.ecologyGrow');assert page.evaluate('__testRuntime.favorites[0].address.generatorVersion')==2
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__testRuntime.openJournal()");page.locator('[data-journal-detail="Paisajes vivos"] > summary').click();assert 'Paisajes vivos' in page.locator('#journalBody').inner_text();assert 'Junco de pulso' in page.locator('#journalBody').inner_text()
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.screenshot(path=f'/tmp/whitedot-phase2-humedal-{width}.png')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   page.locator('#bMenu').click();page.locator('#bWorlds').click();assert page.locator('#seedGeneration').input_value()=='2'
   page.select_option('#seedGeneration','1');page.locator('#seedForm button[type="submit"]').click();page.wait_for_function('window.__testRuntime?.worldIdentity.generatorVersion===1');assert page.evaluate('__testRuntime.REG*__testRuntime.WCH')==7200;assert page.evaluate('__testRuntime.favorites.length')==0
   print(f'PASS {width}x{height}: live habitat, gestures/cancel, groove roles, pause/mute, cultivation, journal, favorite/backup isolation and original-world comparison',flush=True);context.close()
  browser.close()
finally:server.shutdown()
