"""Preserve opaque future collections while current panels remain usable."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2');page.wait_for_function('!!window.__testRuntime?.labMode');page.evaluate('__testRuntime.S.sound=false')
  page.evaluate("()=>{const r=__testRuntime;r.S.rareBook={version:9,items:[null,{type:'future:won',payload:{notes:[1,2,3]}}]};r.S.collectionGarden={version:9,cards:[null,'future:voice'],positions:{unknown:{won:true}},sets:[null]};r.S.atlasJourney={version:9,active:{future:true},completed:[null,{id:'won'}]};r.S.musicalConstellations={version:9,items:[null,{id:'future:shape',points:[],cardIds:'future'}]};}")
  # Reload reinitializes all module owners from the persisted future data.
  page.evaluate('__testRuntime.save()');page.reload();page.wait_for_function('!!window.__testRuntime?.constellationBook');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__testRuntime.openJournal("rares")');assert 'versión más reciente' in page.locator('#journalBody').inner_text();page.locator('[data-journal-tab="music"]').click()
  page.locator('#journalClose').click();page.evaluate('__testRuntime.enterHouse()');assert page.evaluate('__testRuntime.gardenObjects(__testRuntime.currentHouse()).length')==0
  assert page.evaluate('__testRuntime.S.rareBook.items[1].payload.notes')==[1,2,3];assert page.evaluate('__testRuntime.S.collectionGarden.positions.unknown.won')==True
  assert not errors,errors;print('PASS future collection/garden/atlas/figure stay opaque and intact through reload and current panels');b.close()
finally:server.shutdown()
