from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 context=b.new_context();page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(f'http://127.0.0.1:{server.server_port}/')
 page.evaluate("navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready)")
 page.wait_for_function('navigator.serviceWorker.controller!==null')
 modules=sorted('./src/'+f.name for f in (ROOT/'src').glob('*.js'))
 missing=page.evaluate('(paths)=>Promise.all(paths.map(async p=>({p,ok:!!(await caches.match(p))})))',modules)
 assert all(m['ok'] for m in missing),[m for m in missing if not m['ok']]
 # The account is optional (alpha.98): offline, a new player's game starts from the cache without any account sheet.
 context.set_offline(True);page.reload(wait_until='domcontentloaded');page.wait_for_function("document.querySelector('canvas').width>300&&'notice' in document.body.dataset")
 assert page.evaluate('document.getElementById("mConnection").hidden') and page.evaluate('document.body.dataset.accountLocked')!='true','offline play needs no account'
 assert page.evaluate("fetch('./src/encounter-families.js').then(r=>r.text()).then(t=>t.includes('FAMILIES'))")
 assert page.evaluate("fetch('./missing-module.js').then(r=>!r.ok).catch(()=>true)"),'missing JS must fail instead of receiving HTML'
 assert not errors,errors
 print(f'PASS offline reload starts the game without an account, with all {len(modules)} modules cached and no HTML fallback for missing JavaScript',flush=True)
 b.close()
server.shutdown()
