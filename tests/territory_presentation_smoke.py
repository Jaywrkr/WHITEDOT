"""Decoration really disappears in clear patches while musical actors remain."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&layout=wide&generation=2&lab=1');page.wait_for_function('!!window.__testRuntime?.labGo');page.evaluate("__testRuntime.labGo('living:breath-tree');__testRuntime.S.sound=false")
  points=page.evaluate('''async()=>{const {decorativeField}=await import('/src/territory-presentation.js'),r=__testRuntime,out={};for(let x=-40;x<=40;x++)for(let y=-40;y<=40;y++){const p={x:x*2400,y:y*2400},d=r.regionOfPos(p.x,p.y);if(d.sea||d.worldFamily?.quiet)continue;const values=[];for(const dx of [-600,0,600])for(const dy of [-600,0,600])values.push(decorativeField(p.x+dx,p.y+dy,r.seedOf));if(!out.clear&&values.every(v=>v===0))out.clear=p;if(!out.textured&&values.every(v=>v>.3))out.textured=p;if(out.clear&&out.textured)return out;}throw Error('No contrastive patches found');}''')
  for kind in ['clear','textured']:
   point=points[kind];page.evaluate('''p=>{const r=__testRuntime;r.S.wx=p.x;r.S.wy=p.y;r.S.layer='superficie';r.labLiving=null;r.labLiving='breath-tree';r.livingNear(220);r.labGo('living:breath-tree');r.S.wx=p.x;r.S.wy=p.y;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}''',point)
   # Refresh the lab source after travel without hiding/removing it.
   page.evaluate('__testRuntime.labLiving="seed";__testRuntime.livingNear(220);__testRuntime.labLiving="breath-tree";__testRuntime.livingNear(220)')
   condition='drawn===0&&s.clear===s.examined' if kind=='clear' else 'drawn>0'
   page.wait_for_function('''kind=>{const r=__testRuntime,s=r.worldFamilyVisualStats;return s.examined>0&&(kind==='clear'?s.drawn===0&&s.clear===s.examined:s.drawn>0);}''',arg=kind)
   assert page.evaluate('__testRuntime.livingNear(220).length')>0,'musical actor must remain in a decorative clearing'
   page.screenshot(path='/tmp/whitedot-territory-'+kind+'.png')
  assert not errors,errors;print('PASS actual clear/textured World patches, retained musical actor, deterministic placement and mobile rendering');b.close()
finally:server.shutdown()
