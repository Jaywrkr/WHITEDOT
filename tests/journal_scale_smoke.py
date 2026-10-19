"""Large progress stays intact; only twenty regions and opened details are built."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(320,568),(390,844),(844,390)]:
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__testRuntime?.openJournal');page.evaluate('''()=>{const r=__testRuntime;document.getElementById('returnContinue').click();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);for(let i=0;i<1000;i++)r.S.places[i+',0']=1;r.save();r.openJournal('places');}''')
   assert page.locator('[data-region]').count()==20;assert page.locator('[data-region-body] .journal-card').count()==0;assert page.evaluate('Object.keys(__testRuntime.S.places).length')==1000
   page.locator('[data-region] > summary').first.click();assert page.locator('[data-region-body] .journal-card').count()==1;assert 'NaN' not in page.locator('#journalBody').inner_text();assert 'Gravedad' in page.locator('#journalBody').inner_text()
   page.locator('#journalMore').click();assert page.locator('[data-region]').count()==40;assert page.locator('[data-region-body] .journal-card').count()==1;page.locator('[data-journal-tab="music"]').click();page.locator('[data-journal-tab="places"]').click();assert page.locator('[data-region][open]').count()==1
   page.evaluate('()=>{const r=__testRuntime;for(let i=0;i<240;i++){const d=r.regionOfPos((i+.5)*r.REG*r.WCH,1);if(d.species[0])r.S.cat[d.species[0].id]=1;}r.save();r.openJournal("forms");}');assert page.locator('#journalBody .journal-card').count()==60;assert page.locator('#journalSearch').is_hidden();assert page.locator('#journalOwnership').is_hidden();page.locator('#journalMore').click();assert page.locator('#journalBody .journal-card').count()==120;page.locator('#journalGroup').select_option('cubo');assert page.locator('#journalSearch').is_visible();assert page.locator('#journalOwnership').is_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not page.evaluate('!!__testRuntime.ac'),'journal navigation never starts audio';page.screenshot(path=f'/tmp/whitedot-journal-scale-{width}.png');page.locator('#journalClose').click();page.reload();page.wait_for_function('!!window.__testRuntime?.openJournal');assert page.evaluate('Object.keys(__testRuntime.S.places).length')==1000
   assert not errors,errors;print('PASS 1000 retained places, twenty-row pages, lazy details, scroll/open state and silent mobile UI at '+str(width),flush=True);page.close()
  b.close()
finally:server.shutdown()
