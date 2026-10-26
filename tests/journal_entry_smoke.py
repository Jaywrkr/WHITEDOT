"""A book shows the collected object; a saved-place entry shows its destination."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for w,h in [(320,568),(390,844),(844,390),(1280,800)]:
   p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.openFavorites')
   p.evaluate("()=>{const r=__r;r.S.sound=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);for(let i=0;i<3;i++)r.collectRareCard('fossil',{id:'entry:'+i,x:r.S.wx+i,y:r.S.wy},{forced:true});r.openJournal('rares');window.uiAc=r.ac;window.uiNodes=0;if(r.ac)for(const method of ['createOscillator','createBufferSource']){const original=r.ac[method].bind(r.ac);r.ac[method]=(...args)=>{uiNodes++;return original(...args);};}}")
   assert p.locator('.rare-book-filters').get_attribute('open') is None
   assert p.locator('#journalNext').is_hidden() and p.locator('[data-journal-house]').count()==1
   if h>=568:
    title=p.locator('.rare-card h3').first.bounding_box();assert 0<title['y']<h-30,title
   if w==390:
    action=p.locator('[data-garden-add]').first.bounding_box();assert action['y']+action['height']<h-12,action
   p.locator('.rare-book-filters > summary').click();p.locator('#rareRole').select_option('todo');assert p.locator('#rareRole').is_visible(),'filter remains open after refresh'
   p.evaluate("()=>{document.querySelectorAll('.modal').forEach(e=>e.hidden=true);__r.addFavorite('Mi ritmo');__r.openFavorites();}")
   p.wait_for_function("()=>{const b=document.querySelector('[data-favorite] > button')?.getBoundingClientRect();return b&&b.top>=0&&b.bottom<=innerHeight;}")
   assert 'Mi ritmo' in p.locator('[data-favorite]').first.inner_text()
   assert p.locator('[data-favorite] > button').first.inner_text()=='Ir a este lugar'
   assert p.locator('#mJournal .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
   assert p.evaluate('__r.ac===uiAc&&uiNodes===0'),'journal actions never allocate a graph or sound source'
   assert not errors,errors;p.close()
  b.close()
 print('PASS compact book entry, visible card title/action, expandable filters, direct saved-place action and silent UI at four sizes')
finally:srv.shutdown();srv.server_close()
