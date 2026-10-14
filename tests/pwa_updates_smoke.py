"""Real service-worker upgrade: releases wait, cannot mix assets, and stay bounded."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,re
ROOT=Path(__file__).resolve().parents[1];version='A'
CACHE_BASE=re.search(r"const CACHE='([^']+)'",(ROOT/'sw.js').read_text()).group(1)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  path=self.path.split('?')[0]
  if path=='/sw.js':body=(ROOT/'sw.js').read_text().replace(CACHE_BASE,"whitedot-test-"+version).encode();typ='text/javascript'
  elif path in ['/','/index.html']:body=(ROOT/'index.html').read_text().replace('<head>','<head><meta name="audit-version" content="'+version+'">').encode();typ='text/html'
  elif path=='/src/catalog.js':body=((ROOT/'src/catalog.js').read_text()+'\n// release-'+version).encode();typ='text/javascript'
  else:return super().do_GET()
  self.send_response(200);self.send_header('Content-Type',typ);self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(body)
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);context=b.new_context();page=context.new_page();url=f'http://127.0.0.1:{server.server_port}/';page.goto(url)
  page.evaluate('async()=>{window.__reg=await navigator.serviceWorker.register("/sw.js",{updateViaCache:"none"});await navigator.serviceWorker.ready;}');page.wait_for_function('navigator.serviceWorker.controller!==null')
  assert page.evaluate('fetch("/src/catalog.js").then(r=>r.text()).then(s=>s.includes("release-A"))')
  version='B';page.evaluate('__reg.update()');page.wait_for_function('__reg.waiting!==null')
  page.reload();assert page.locator('meta[name="audit-version"]').get_attribute('content')=='A'
  assert page.evaluate('fetch("/src/catalog.js").then(r=>r.text()).then(s=>s.includes("release-A"))'),'old page fetched new modules'
  page.evaluate('async()=>{window.__reg=await navigator.serviceWorker.getRegistration();__reg.waiting.postMessage({type:"APPLY_UPDATE"});}')
  page.wait_for_function('caches.keys().then(keys=>keys.includes("whitedot-test-B")&&!keys.includes("whitedot-test-A"))')
  page.reload();assert page.locator('meta[name="audit-version"]').get_attribute('content')=='B'
  assert page.evaluate('fetch("/src/catalog.js").then(r=>r.text()).then(s=>s.includes("release-B"))')
  before=page.evaluate('caches.open("whitedot-test-B").then(c=>c.keys()).then(k=>k.length)')
  page.evaluate('async()=>{for(let i=0;i<40;i++)await fetch("/index.html?testSeed=test"+i);}')
  assert page.evaluate('caches.open("whitedot-test-B").then(c=>c.keys()).then(k=>k.length)')==before
  context.set_offline(True);page.goto(url+'?lab=1&testSeed=offline&layout=vasto&generation=2');page.wait_for_function('document.body.classList.contains("lab")')
  assert page.evaluate('document.fonts.ready.then(()=>document.fonts.check("12px Silkscreen")&&document.fonts.check("12px \'JetBrains Mono\'"))')
  assert page.evaluate('fetch("/missing.js").then(r=>!r.ok).catch(()=>true)')
  print(f'PASS real PWA: waiting upgrade A→B, coherent shell/assets, explicit activation, {before} bounded cached assets, query previews offline and local fonts',flush=True);b.close()
finally:server.shutdown()
