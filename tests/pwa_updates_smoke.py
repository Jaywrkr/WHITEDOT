"""Real service-worker upgrade: releases wait, cannot mix assets, and stay bounded."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,re,subprocess,tarfile,io,json,mimetypes
ROOT=Path(__file__).resolve().parents[1];version='A'
# Read the actual pre-closure release once, not a mock save format.
archive=tarfile.open(fileobj=io.BytesIO(subprocess.check_output(['git','archive','8924f16'])))
old={m.name:archive.extractfile(m).read() for m in archive if m.isfile()}
CACHE_BASE=re.search(r"const CACHE='([^']+)'",(ROOT/'sw.js').read_text()).group(1)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  path=self.path.split('?')[0]
  if version=='A' and path.lstrip('/') in old:
   body=old[path.lstrip('/')];typ=mimetypes.guess_type(path)[0] or 'application/octet-stream'
   if path=='/sw.js':body=re.sub(rb"const CACHE='[^']+'",b"const CACHE='whitedot-test-A'",body)
   if path=='/index.html':body=body.replace(b'<head>',b'<head><meta name="audit-version" content="A">')
   if path=='/src/catalog.js':body+=b'\n// release-A'
  elif path=='/sw.js':body=(ROOT/'sw.js').read_text().replace(CACHE_BASE,"whitedot-test-"+version).encode();typ='text/javascript'
  elif path in ['/','/index.html']:body=(old['index.html'].decode('utf-8') if version=='A' else (ROOT/'index.html').read_text(encoding='utf-8')).replace('<head>','<head><meta name="audit-version" content="'+version+'">').encode();typ='text/html'
  elif path=='/src/catalog.js':body=((ROOT/'src/catalog.js').read_text()+'\n// release-'+version).encode();typ='text/javascript'
  elif path=='/src/main.js':body=(ROOT/'src/main.js').read_bytes().replace(b'await requireAccount()',b'null');typ='text/javascript'
  else:return super().do_GET()
  if path=='/src/main.js':body+=b'\nwindow.__upgradeRuntime=runtime;'
  self.send_response(200);self.send_header('Content-Type',typ);self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(body)
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);context=b.new_context();page=context.new_page();url=f'http://127.0.0.1:{server.server_port}/';page.goto(url)
  page.evaluate('async()=>{window.__reg=await navigator.serviceWorker.register("/sw.js",{updateViaCache:"none"});await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error("Worker did not install within 20 seconds")),20000))]);}');page.wait_for_function('navigator.serviceWorker.controller!==null')
  assert page.evaluate('fetch("/src/catalog.js").then(r=>r.text()).then(s=>s.includes("release-A"))')
  page.wait_for_function('!!window.__upgradeRuntime?.sparkEconomy')
  page.evaluate("""()=>{const r=__upgradeRuntime;r.$('returnContinue').click();r.S.sound=false;r.S.firstJourney.skipped=true;r.S.sparks=137;Object.assign(r.sparkEconomy,{earned:177,spent:40,purchases:{dust:true},equipped:'dust',goal:'shop:orbit'});r.S.ach['mundo']='2026-10-18';r.S.pathCrystals=Array.from({length:10},(_,i)=>'upgrade:'+i);if(!r.save())throw Error('Old release could not save');} """)
  expected=page.evaluate("(()=>{const s=__upgradeRuntime.S;return {sparks:s.sparks,purchases:s.sparkEconomy.purchases,equipped:s.sparkEconomy.equipped,goal:s.sparkEconomy.goal,ach:s.ach,path:s.pathCrystals,identity:s.worldIdentity}})()")
  version='B';page.evaluate('__reg.update()');page.wait_for_function('__reg.waiting!==null')
  page.reload();assert page.locator('meta[name="audit-version"]').get_attribute('content')=='A'
  assert page.evaluate('fetch("/src/catalog.js").then(r=>r.text()).then(s=>s.includes("release-A"))'),'old page fetched new modules'
  page.evaluate('async()=>{window.__reg=await navigator.serviceWorker.getRegistration();__reg.waiting.postMessage({type:"APPLY_UPDATE"});}')
  page.wait_for_function('caches.keys().then(keys=>keys.includes("whitedot-test-B")&&!keys.includes("whitedot-test-A"))')
  page.reload();assert page.locator('meta[name="audit-version"]').get_attribute('content')=='B'
  assert page.evaluate('fetch("/src/catalog.js").then(r=>r.text()).then(s=>s.includes("release-B"))')
  page.wait_for_function('!!window.__upgradeRuntime?.sparkEconomy')
  actual=page.evaluate("(()=>{const s=__upgradeRuntime.S;return {sparks:s.sparks,purchases:s.sparkEconomy.purchases,equipped:s.sparkEconomy.equipped,goal:s.sparkEconomy.goal,ach:s.ach,path:s.pathCrystals,identity:s.worldIdentity}})()")
  assert actual==expected,(expected,actual)
  assert page.evaluate('__upgradeRuntime.save()'),'updated release must still save'
  print('PASS actual alpha.49 to current upgrade preserves wallet, purchases, equipment, goal, achievements, path and world identity',flush=True)
  before=page.evaluate('caches.open("whitedot-test-B").then(c=>c.keys()).then(k=>k.length)')
  page.evaluate('async()=>{for(let i=0;i<40;i++)await fetch("/index.html?testSeed=test"+i);}')
  assert page.evaluate('caches.open("whitedot-test-B").then(c=>c.keys()).then(k=>k.length)')==before
  context.set_offline(True);page.goto(url+'?lab=1&testSeed=offline&layout=vasto&generation=2');page.wait_for_function('document.body.classList.contains("lab")')
  assert page.evaluate('document.fonts.ready.then(()=>document.fonts.check("12px \'Geist Mono\'"))')
  assert page.evaluate('async()=>{for(const w of [100,200,300,400,500,600,700,800,900]){const faces=await document.fonts.load(`${w} 14px "Geist Mono"`);if(faces.length!==1||faces[0].status!=="loaded")return false;}return true;}'), 'all nine supplied font weights must load offline'
  assert page.evaluate('fetch("/missing.js").then(r=>!r.ok).catch(()=>true)')
  print(f'PASS real PWA: waiting upgrade A-to-B, coherent shell/assets, explicit activation, {before} bounded cached assets, query previews offline and local fonts',flush=True);b.close()
finally:server.shutdown()
