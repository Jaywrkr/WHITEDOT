"""A failed browser write must never confirm a saved place or finish its lesson."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, shutil, threading

ROOT = Path(__file__).resolve().parents[1]

class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
 with sync_playwright() as p:
  browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'), args=['--no-sandbox'])
  page = browser.new_page(viewport={'width':390, 'height':844}, has_touch=True)
  errors = []
  page.on('pageerror', lambda e: errors.append(str(e)))
  page.route('**/src/main.js', lambda route: route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;', content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=save-failure&generation=2&layout=classic&travel=1')
  page.wait_for_function('window.__testRuntime?.inWorld()')
  page.evaluate('''()=>{
   const r=__testRuntime;
   document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
   r.S.sound=false;
   r.S.firstJourney={version:1,skipped:false,facts:{move:true,light:true,world:true,voice:true,pulse:true,save:false}};
   localStorage.removeItem('whitedot:first-journey:v1');
   if(!r.save())throw Error('Baseline save failed');
   window.__diskBefore=localStorage.getItem(r.saveStore.key);
   window.__originalSetItem=Storage.prototype.setItem;
   Storage.prototype.setItem=function(key,value){
    if(key===r.saveStore.key)throw new DOMException('Storage full','QuotaExceededError');
    return __originalSetItem.call(this,key,value);
   };
  }''')
  page.locator('#quickSave').click()
  assert page.evaluate('__testRuntime.favorites.length') == 1, 'retain unsaved work for export or retry'
  assert page.evaluate('localStorage.getItem(__testRuntime.saveStore.key)===__diskBefore'), 'preserve the last valid disk save'
  assert not page.evaluate('__testRuntime.S.firstJourney.facts.save'), 'a failed write cannot finish the save lesson'
  assert page.evaluate('localStorage.getItem("whitedot:first-journey:v1")') is None
  assert not page.evaluate('!!__testRuntime.S.ach.favorito1'), 'do not award successful storage before it happens'
  # Imported place codes must not claim success either.
  result = page.evaluate('''()=>{
   const r=__testRuntime;
   const address={...r.worldIdentity,x:r.S.wx+1500,y:r.S.wy,layer:'superficie'};
   const code=r.encodeFavorite({name:'Lugar recibido',address});
   document.getElementById('placeCode').value=code;
   document.getElementById('placeOpen').click();
   return {info:document.getElementById('placeCodeInfo').textContent,count:r.favorites.length};
  }''')
  assert result['count'] == 2
  assert 'Guardado' not in result['info'] and 'copia' in result['info'], result
  # Retry the same quick-save after storage recovers: no duplicate or renamed place.
  page.evaluate('()=>{Storage.prototype.setItem=__originalSetItem;}')
  page.locator('#quickSave').click()
  page.wait_for_function('__testRuntime.S.firstJourney.facts.save===true')
  assert page.evaluate('__testRuntime.favorites.length') == 2
  assert page.evaluate('JSON.parse(localStorage.getItem(__testRuntime.saveStore.key)).favorites.items.length') == 2
  assert page.evaluate('localStorage.getItem("whitedot:first-journey:v1")') == '1'
  assert page.evaluate('!!__testRuntime.S.ach.favorito1')
  # A concurrent writer must also be preserved, rather than silently overwritten.
  page.evaluate('''()=>{
   const r=__testRuntime,saved=JSON.parse(localStorage.getItem(r.saveStore.key));
   saved.totalLight+=17;
   localStorage.setItem(r.saveStore.key,JSON.stringify(saved));
   window.__otherWriter=localStorage.getItem(r.saveStore.key);
   window.__failedFavorite=r.addFavoriteAddress({...r.worldIdentity,x:r.S.wx+3000,y:r.S.wy,layer:'superficie'},'Otra visita');
  }''')
  assert page.evaluate('__failedFavorite===null'), 'a stale writer cannot report successful storage'
  assert page.evaluate('localStorage.getItem(__testRuntime.saveStore.key)===__otherWriter')
  assert page.evaluate('__testRuntime.storageStatus.kind') == 'conflict'
  assert not errors, errors
  browser.close()
  print('PASS native favorite quota/conflict failure, honest imported-code status, unchanged disk save and successful duplicate-free retry', flush=True)
finally:
 server.shutdown()
