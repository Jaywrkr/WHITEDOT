"""Focused production presentation: cards, filters, silent controls and persistence."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(has_touch=True);errors=[];page.on('pageerror',lambda e:(errors.append(str(e)),print(str(e),flush=True)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   if page.url!='about:blank':page.evaluate('localStorage.clear()')
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/');print('APP LOADED '+str(width),flush=True);page.wait_for_function('!!window.__r?.collectRareCard');print('RUNTIME READY',flush=True)
   page.evaluate("()=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.S.sound=false;r.S.todayLight=1;r.S.mode='world';r.S.help.mundo=true;r.hud();r.noticeLane.quietRoutine();r.collectRareCard('relic:magical',{id:'presentation:relic',x:r.S.wx,y:r.S.wy},{context:{role:'bajo',instrument:'sub',gesture:'contacto'}});}")
   print('COLLECTED',flush=True);page.wait_for_function('!document.getElementById("rareNotice").hidden');print('NOTICE READY',flush=True);rect=page.locator('#rareNotice').bounding_box();assert rect['width']*rect['height']>=width*height*.95
   assert 'Constelación' in page.locator('#rareNoticeName').inner_text()
   assert page.evaluate("['toast','phrase','zone','voice','rareNotice','celebration'].filter(id=>{const n=document.getElementById(id);return !n.hidden&&n.classList.contains('on')}).length===1")
   page.screenshot(path=f'/tmp/whitedot-collection-{width}.png');page.locator('#rareNoticeOpen').click();assert page.locator('#mJournal').is_visible()
   page.locator('#rareRole').select_option('perc');assert 'No hay hallazgos con estos filtros.' in page.locator('#journalBody').inner_text()
   page.locator('#rareRole').select_option('todo');assert page.locator('.rare-card').count()==1
   page.locator('.rare-card-details > summary').click();assert all('sub' not in text for text in page.locator('.rare-biome').all_text_contents());assert 'Contacto' in page.locator('#journalBody').inner_text()
   assert page.evaluate('!__r.ac&&__r.waves.length===0'),'card UI must remain silent'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.locator('#journalClose').click();page.reload();page.wait_for_function('__r?.rareCards.length===1');assert page.locator('#rareNotice').is_hidden();assert not errors,errors
   print(f'PASS card presentation {width}: fullscreen, exclusive notice, filtered empty state, readable context, silent UI and saved collection',flush=True)
  browser.close()
finally:server.shutdown()
