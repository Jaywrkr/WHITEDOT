"""Real save/reload preserves unknown discoveries and protects unsupported future books."""
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
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=collection-guard-{width}');page.wait_for_function('!!window.__r?.elementBookUI')
   page.evaluate("""()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.sound=false;r.S.todayLight=1;r.S.mode='world';r.S.help.mundo=true;r.S.ach.preservedReward='2026-10-14';r.S.elementBook={version:1,extension:{earned:7},found:{'rhythm:stone':{day:'2026-10-14',genre:'ambient',earnedShape:'kept'},'future:voice':{learned:[1,3,5]}}};if(!r.save())throw Error('Failed save');}""")
   page.reload();page.wait_for_function('!!window.__r?.elementBookUI');assert page.evaluate('__r.S.elementBook.extension.earned')==7;assert page.evaluate('__r.S.elementBook.found["rhythm:stone"].earnedShape')=='kept';assert page.evaluate('__r.S.elementBook.unrecognizedFound["future:voice"].learned')==[1,3,5];assert page.evaluate('__r.S.ach.preservedReward')=='2026-10-14'
   # Unsupported data is retained exactly and never earns fake current families.
   page.evaluate("""()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.elementBook={version:9,extension:{reward:8},found:{'rhythm:stone':{day:'2026-10-14',genre:'ambient'},'future:voice':{earned:99}}};window.__future=JSON.stringify(r.S.elementBook);if(r.recordElement('rhythm:roots'))throw Error('Future book mutated');r.elementBookUI();r.save();}""")
   expected=page.evaluate('__future');assert 'versión posterior' in page.locator('#elementCount').inner_text();page.reload();page.wait_for_function('!!window.__r?.elementBookUI');assert page.evaluate('JSON.stringify(__r.S.elementBook)')==expected;assert page.evaluate('__r.elementFamilyCount')==1
   before=page.evaluate('({context:!!__r.ac,waves:__r.waves.length})');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true);__r.openJournal()');page.locator('[data-journal-tab="collection"]').click();page.locator('#journalGroup').select_option('elementos');assert 'Tus hallazgos siguen guardados' in page.locator('#journalBody').inner_text();assert page.evaluate('!!__r.ac')==before['context'] and page.evaluate('__r.waves.length')<=before['waves'],'collection UI cannot start audio';assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   print(f'PASS real save/reload, unknown earned data, future readonly collection, honest counter and quiet journal at {width}',flush=True)
  browser.close()
finally:server.shutdown()
