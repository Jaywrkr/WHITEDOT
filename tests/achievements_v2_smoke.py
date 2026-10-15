"""The native achievement ledger gives catalog pieces and keeps historical flags."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:(errors.append(str(e)),print(str(e),flush=True)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__testRuntime?.achievementRules');assert page.evaluate('window.__testRuntime.ACH.length')==250
  result=page.evaluate('()=>{const r=window.__testRuntime;document.querySelectorAll(".modal").forEach(m=>m.hidden=true);r.S.ach.dj="2026-01-01";r.S.journal.music.genres={minimal:1,deep:1};r.achievementsTick(2);r.save();return r.achievementRules.find(p=>p.metric==="genres").id;}')
  assert page.evaluate('(id)=>!!window.__testRuntime.S.ach[id]',result);assert page.evaluate('(id)=>window.__testRuntime.ownsReward("achievement:"+id)',result)
  page.evaluate('window.__testRuntime.openJournal("achievements")');page.locator('[data-journal-detail="achievement:Música"] > summary').click();assert page.locator('progress').count()>0 and 'plata' in page.locator('#journalBody').inner_text()
  page.reload();page.wait_for_function('!!window.__testRuntime?.achievementRules');assert page.evaluate('window.__testRuntime.S.ach.dj')=='2026-01-01'
  assert page.evaluate('(id)=>window.__testRuntime.ownsReward("achievement:"+id)',result)
  assert not errors,errors;print('PASS native 250-entry ledger, catalog awards, seven-category progress and preserved retired achievement');b.close()
finally:server.shutdown()
