"""Travel is a real saved destination; testing scenes remain in Prototipo."""
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
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=travel-v2&layout=classic&generation=2&travel=1');page.wait_for_function('window.__testRuntime?.inWorld()');page.evaluate('()=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);const r=window.__testRuntime;r.S.wx=-4200;r.S.wy=7100;r.S.layer="bajo";r.S.ach.retained="2026-10-14";r.S.lampUsed=30;r.save();}')
  page.reload();page.wait_for_function('window.__testRuntime?.S.wx===-4200&&window.__testRuntime.S.wy===7100&&window.__testRuntime.S.layer==="bajo"');assert page.evaluate('window.__testRuntime.S.ach.retained')=='2026-10-14';assert 30<=page.evaluate('window.__testRuntime.S.lampUsed')<35
  page.evaluate('()=>{const r=window.__testRuntime;document.querySelectorAll(".modal").forEach(m=>m.hidden=true);r.recordElement("pulso",r.regionOfPos(r.S.wx,r.S.wy));r.recordElement("pulso",r.regionOfPos(r.S.wx,r.S.wy));r.save();}')
  assert page.evaluate('window.__testRuntime.S.totalDays')==1
  page.locator('#bMenu').click();page.locator('#bWorlds').click();assert page.locator('#seedEncounter').is_hidden();assert page.locator('#mSeeds h2').inner_text()=='Viaja a otra semilla'
  page.locator('#seedCenter').click();page.wait_for_function('!!window.__testRuntime&&window.__testRuntime.S.wx===window.__testRuntime.REG*window.__testRuntime.WCH/2&&window.__testRuntime.S.layer==="superficie"');assert 'center=' not in page.url
  assert not errors,errors;print('PASS real travel keeps exact coordinates/layer/progress on reload, hides test scenes and supports explicit center');b.close()
finally:server.shutdown()
