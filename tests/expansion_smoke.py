# Navegador: cajas misteriosas (el cubo abre una y da un poder), campo de escucha (calla la pista y toca lo
# que está dentro), cometa (más velocidad), quietud (las etapas avanzan) y zona experimental sin errores.
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/'
CHROMIUM = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser')
R='window.__testRuntime'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 c=b.new_context(viewport={'width':390,'height':844},has_touch=True);page=c.new_page();page.set_default_timeout(15000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
 page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
 page.goto(URL+'?testSeed=expansion&layout=wide&generation=2',wait_until='domcontentloaded');page.wait_for_function(f'{R}&&{R}.inWorld()')
 page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.mouse.click(30,200);page.wait_for_function(f'{R}.ac&&{R}.ac.state==="running"')
 # Caja regalada junto al cubo: tocarla da el poder.
 page.evaluate(f"{R}.spawnBox({R}.S.wx+60,{R}.S.wy,'campo')");page.wait_for_timeout(200)
 page.evaluate(f"(async()=>{{const r={R};for(let i=1;i<=30;i++){{r.S.wx+=2;await new Promise(f=>requestAnimationFrame(f));}}}})()");page.wait_for_function(f"{R}.hasPower('campo')")
 assert page.evaluate(f"{R}.fieldSolo && !!{R}.S.ach.caja1")
 page.wait_for_timeout(1500);page.screenshot(path='/tmp/whitedot-campo.png')
 page.evaluate(f"{R}.givePower('cometa')");assert page.evaluate(f"{R}.SPEED")>400
 # Crossing the old 400-box limit must keep every consumed native location.
 page.evaluate('''async()=>{const r=window.__testRuntime,{boxAt}=await import('/src/expansion-music.js');for(let i=0;i<405;i++)r.S.boxes['caja:'+(10000+i)+',10000']=1;let box;for(let x=-30;x<30&&!box;x++)for(let y=-30;y<30&&!box;y++){const b=boxAt(x,y,r.WCH,r.seedOf,r.rng);if(b&&!r.S.boxes[b.id]&&!r.regionOfPos(b.x,b.y).sea)box=b;}if(!box)throw Error('No native box');window.__retainedBox=box;r.S.wx=box.x;r.S.wy=box.y;}''')
 page.wait_for_function('!!__testRuntime.S.boxes[__retainedBox.id]')
 assert page.evaluate('Array.from({length:405},(_,i)=>!!__testRuntime.S.boxes["caja:"+(10000+i)+",10000"]).every(Boolean)')
 assert page.evaluate('!__testRuntime.boxesNear().some(b=>b.id===__retainedBox.id)')
 # Quietud: con tiempo acumulado sube de etapa.
 page.evaluate(f"{R}.quietState.seconds=55");page.wait_for_function(f"{R}.quietState.stage>=2")
 # Zona experimental: forzar una y dejar sonar.
 page.evaluate(f"(()=>{{const r={R};for(let i=0;i<3000;i++){{const x=(Math.random()-.5)*60*10800,y=(Math.random()-.5)*60*10800;r.S.wx=x;r.S.wy=y;const d=r.regionOfPos(x,y);if(!d.sea&&r.experimentalZone)return;}}}})()")
 page.wait_for_timeout(2500)
 assert not errors,errors
 print('expansion: box opens with cube, listening field, comet speed, stillness stages, no errors PASS',flush=True)
 b.close()
server.shutdown()
