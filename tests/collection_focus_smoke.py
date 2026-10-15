"""A reveal escapes stale searches; role filtering keeps source indices and UI silence."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading, os, shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=collection-focus&layout=wide&generation=2')
  page.wait_for_function('__testRuntime?.inWorld()')
  page.evaluate('''()=>{const r=__testRuntime;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.rareBook={version:1,items:[]};for(let i=0;i<3;i++)r.collectRareCard('fossil',{id:'focus:'+i,x:r.S.wx+300+i,y:r.S.wy},{context:{role:'perc',instrument:'woodblock'}});r.openJournal('rares');}''')
  assert page.evaluate('__testRuntime.rareCards.length')==3
  assert page.evaluate('__testRuntime.rareNoticeState.pending')==1,'repeat burst saves every specimen but queues one reveal'
  assert page.locator('.rare-card-details[open]').count()==0
  page.locator('#rareRole').select_option('bajo');assert page.locator('.rare-card').count()==0
  page.locator('#journalSearch').fill('nothing like this')
  page.locator('#journalClose').click()
  page.wait_for_function('!document.getElementById("rareNotice").hidden')
  page.locator('#rareNoticeOpen').click()
  assert page.locator('#journalSearch').input_value()==''
  assert page.locator('#rareRole').input_value()=='todo'
  assert page.locator('.rare-card').count()==3
  page.wait_for_function('document.activeElement.matches("[data-card-id]")')
  page.locator('#journalSearch').fill('woodblock')
  page.locator('#rareRole').select_option('perc')
  assert page.locator('.rare-card').count()==3
  assert page.locator('[data-garden-add]').first.get_attribute('data-garden-add')=='2'
  page.screenshot(path='/tmp/whitedot-collection-compact.png')
  assert page.evaluate('__testRuntime.MU.ac==null'),'book controls never start audio'
  assert not errors,errors
  print('PASS compact cards, queued repeat suppression, reveal clears stale filters, role/instrument search, source index and silent UI')
  browser.close()
finally: server.shutdown()
