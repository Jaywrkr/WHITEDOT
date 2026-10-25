# Panel captures (docs/PANEL.md): the same phone screenshots each panel session judged, at 390×844.
# Usage: OUT=/some/dir python3 scripts/panel-capture.py   (CHROMIUM_PATH optional)
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json,subprocess
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('OUT','panel-capturas'));OUT.mkdir(parents=True,exist_ok=True)
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
shots=[('00-inicio','',None)]+[(f'0{i+1}-capitulo-{c}',f'?capitulo={c}',None) for i,c in enumerate(['llanura','lago','bosque','tormenta','vacio'])]
shots+=[(f'1{i}-lugar-{p}',f'?lugar={p}',None) for i,p in enumerate(['jardin','dunas','cristales','faros','ruinas','cueva'])]
shots+=[('20-anillo','?anillo=1',None),('21-lugares','?anillo=1','lugares'),('22-cancion','?anillo=1','song'),('23-salvaje','?anillo=1','wild')]
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  records=[]
  for name,q,extra in shots:
   p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   # A normal browser, not "everything visible": without this the game opens its automation mode.
   p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://kubono.localhost:{srv.server_port}/{q}');p.wait_for_function('!!window.__r',timeout=20000);p.wait_for_timeout(2500)
   p.evaluate("()=>{__r.S.sound=true;__r.audio();}");p.wait_for_timeout(2500)
   if extra:p.evaluate("k=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);({lugares:()=>__r.openLugares(),song:()=>__r.openSong(),wild:()=>__r.wildSpawn()})[k]()}",extra)
   p.wait_for_timeout(1500);p.evaluate('document.fonts.ready');assert not p.evaluate("document.body.classList.contains('dev')"),'Production capture unexpectedly shows developer controls'
   state=p.evaluate("()=>({mode:__r.S.mode,chapter:__r.S.journey?.chapter,dev:document.body.classList.contains('dev'),audio:__r.ac?.state||'none',width:innerWidth,height:innerHeight})")
   assert not errors,errors
   p.screenshot(path=str(OUT/f'{name}.png'));records.append({'file':name+'.png','query':q,'forcedPanel':extra,'state':state,'pageErrors':errors});p.close()
  b.close()
  revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
  (OUT/'manifest.json').write_text(json.dumps({'revision':revision,'capturedAt':datetime.now(timezone.utc).isoformat(),'viewport':[390,844],'scope':'Local scripted fixtures; normal hostname gate and webdriver=false; no human or physical listening claims','captures':records},ensure_ascii=False,indent=2)+'\n')
finally:srv.shutdown();srv.server_close()
print('ok',OUT)
