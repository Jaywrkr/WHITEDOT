"""Ordinary world inhabitants use territorial instruments and hold/release by cube contact."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&generation=2&layout=wide&lab=1');page.wait_for_function('window.__testRuntime?.labMode');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  found=False
  for band in ['breath','silk','warm','pulse','interlock','heavy']:
   page.evaluate('(b)=>__testRuntime.labGo("band:"+b)',band);page.wait_for_function('(b)=>__testRuntime.MU.radio?.labScore?.id===b',arg=band)
   found=page.evaluate('''async()=>{const r=__testRuntime,{TECHNIQUE_INSTRUMENTS}=await import('/src/instrument-techniques.js'),origin={x:r.S.wx,y:r.S.wy};
    for(const dx of [0,-600,600,-1200,1200])for(const dy of [0,-600,600,-1200,1200]){r.S.wx=origin.x+dx;r.S.wy=origin.y+dy;
     const o=r.livingNear(750).find(o=>o.group!=='fauna'&&TECHNIQUE_INSTRUMENTS[r.getVoice('living:'+o.kind,r.regionOfPos(o.x,o.y),o).instrument]?.sustain);
     if(o){window.__holdSource=o;r.S.wx=o.x;r.S.wy=o.y;r.body.jump=false;r.body.speed=0;return true;}}
    return false;}''')
   if found:break
  assert found,'no native sustained inhabitant'
  page.wait_for_function('__testRuntime.heldContact?.source?.id===__holdSource.id');page.wait_for_timeout(3400)
  assert page.evaluate('__testRuntime.heldContact?.source?.id===__holdSource.id&&__testRuntime.activeSpatialCount>0&&__testRuntime.activePatchCount>0'),'held routing must survive beyond three seconds'
  assert page.evaluate('__holdSource.id.startsWith("living:")&&!__holdSource.id.startsWith("living:lab:")')
  page.evaluate('__testRuntime.S.wx+=120');page.wait_for_function('__testRuntime.heldContact===null')
  assert not errors,errors;print('PASS native territory inhabitants, spatial held voice beyond three seconds and cube-leave release',flush=True);b.close()
finally:server.shutdown()
