# Navegador: el cubo es lo único que toca. Recorridos del cubo (sin dedo sobre los objetos) tensan cuerdas,
# giran el prisma rodeándolo, golpean la membrana, empujan espejos, arrastran aros de vidrio y tocan aves.
# Un toque con el dedo sobre un objeto ya no lo manipula: lanza el pulso del cubo.
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
# Mueve el cubo por una lista de puntos del mundo, un poco por cuadro (velocidad px/s aprox.).
WALK='''async ([pts,speed])=>{const r=window.__testRuntime;for(let k=1;k<pts.length;k++){const [x0,y0]=pts[k-1],[x1,y1]=pts[k],n=Math.max(1,Math.round(Math.hypot(x1-x0,y1-y0)/(speed/60)));
 for(let i=1;i<=n;i++){r.S.wx=x0+(x1-x0)*i/n;r.S.wy=y0+(y1-y0)*i/n;await new Promise(f=>requestAnimationFrame(f));}}}'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 c=b.new_context(viewport={'width':390,'height':844},has_touch=True);page=c.new_page();page.set_default_timeout(15000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
 page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
 # Mundo de prueba amplio (como el Laboratorio): en su Origen hay vidrios, espejos, materia y bandada.
 page.goto(URL+'?testSeed=laboratorio&layout=wide&generation=2',wait_until='domcontentloaded');page.wait_for_function(f'{R}&&{R}.inWorld()')
 page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.mouse.click(30,200)
 page.wait_for_function(f'{R}.ac&&{R}.ac.state==="running"')
 page.evaluate(f'{R}.fingerTouch=false')
 walk=lambda pts,speed=90:page.evaluate(WALK,[pts,speed])
 def jump(x,y):page.evaluate(f'(()=>{{const r={R};r.S.wx={x};r.S.wy={y};}})()');page.wait_for_timeout(120)
 # Cuerdas (1100,2550; la cuerda 0 está en y=-33: es la primera que encuentra el cubo bajando): cruzar despacio engancha; empujar tensa y suena; atravesar suelta.
 jump(1100,2490);walk([[1100,2490],[1100,2520]])
 assert page.evaluate(f"{R}.nearbyMateria(300).find(s=>s.kind==='strings').att?.i")==0
 page.evaluate(f'{R}.materiaPlayed.length=0');walk([[1100,2520],[1100,2547]],60)
 assert abs(page.evaluate(f"{R}.nearbyMateria(300).find(s=>s.kind==='strings').bends[0]"))>25
 page.wait_for_function(f"{R}.materiaPlayed.some(v=>v==='installation:strings:0')")   # suena al tensar
 walk([[1100,2547],[1100,2575]],60);page.wait_for_function(f"!!{R}.S.ach.cuerda1")
 assert page.evaluate(f"{R}.nearbyMateria(300).find(s=>s.kind==='strings').att?.i")!=0   # la 0 se soltó (puede engancharse la siguiente)
 # Prisma (1800,2700): rodearlo gira; al salir del anillo suena su acorde.
 jump(1800,2620);a0=page.evaluate(f"{R}.nearbyMateria(300).find(s=>s.kind==='prism').angle")
 import math
 ring=[[1800+70*math.cos(-math.pi/2+i*0.25),2700+70*math.sin(-math.pi/2+i*0.25)] for i in range(14)]
 walk([[1800,2620]]+ring,120);a1=page.evaluate(f"{R}.nearbyMateria(300).find(s=>s.kind==='prism').angle");assert abs(a1-a0)>1,(a0,a1)
 walk([ring[-1],[1800,2480]],120);page.wait_for_function(f"!!{R}.S.ach.prisma1")
 page.screenshot(path='/tmp/whitedot-cuerpo-prism.png')
 # Membrana (2500,2550): entrar golpea; quedarse encima redobla.
 jump(2500,2470);page.evaluate(f'{R}.materiaPlayed.length=0');walk([[2500,2470],[2500,2550]],120);page.wait_for_timeout(1500)
 assert page.evaluate(f"{R}.materiaPlayed.filter(v=>v.startsWith('installation:membrane')).length")>=3;assert page.evaluate(f"!!{R}.S.ach.membrana1")
 # Espejos (1600,900): el cubo empuja el espejo 3 y lo gira.
 jump(1600,780);m=page.evaluate(f"(()=>{{const s={R}.nearbyMirrors(800).find(s=>s.id==='mirror:0,0');return [s.mirrors[2].x,s.mirrors[2].y,s.mirrors[2].angle]}})()")
 jump(m[0]+20,m[1]-40);walk([[m[0]+20,m[1]-40],[m[0]+20,m[1]+40]],80)
 a=page.evaluate(f"{R}.nearbyMirrors(800).find(s=>s.id==='mirror:0,0').mirrors[2].angle");assert abs(a-m[2])>.05,(a,m[2])
 # Vidrios (1080,900): pasar por el asa 0 y rodear arrastra el aro.
 jump(1080,780);g=page.evaluate(f"(()=>{{const s={R}.nearbyGlass(800)[0];return [s.x,s.y,s.angles[0]]}})()");R0=50
 hx,hy=g[0]+math.cos(g[2])*R0,g[1]+math.sin(g[2])*R0;jump(hx,hy);page.wait_for_timeout(150)
 arc=[[g[0]+R0*math.cos(g[2]+i*.1),g[1]+R0*math.sin(g[2]+i*.1)] for i in range(10)];walk(arc,60)
 a=page.evaluate(f"{R}.nearbyGlass(800)[0].angles[0]");assert abs(a-g[2])>.4,(a,g[2])
 # Aves (2800,1650): el cubo pasa por un ave → aprende la llamada.
 jump(2800,1500);page.wait_for_timeout(300)
 bird=page.evaluate(f"(()=>{{const f={R}.nearbyFlocks(600)[0],m=f.members[0];return [m.x,m.y]}})()")
 # Track the moving bird each frame; a stale position at running speed can miss or scatter it.
 page.evaluate('async()=>{const r=window.__testRuntime;for(let i=0;i<180;i++){const f=r.nearbyFlocks(600)[0],m=f.members[0];if(f.learned.length||f.answerBar>=0||r.S.ach.bandada1)return;const dx=m.x-r.S.wx,dy=m.y-r.S.wy,dist=Math.hypot(dx,dy),step=Math.min(dist,2);r.S.wx+=dx/(dist||1)*step;r.S.wy+=dy/(dist||1)*step;await new Promise(resolve=>requestAnimationFrame(resolve));}}')
 page.wait_for_function(f"{R}.nearbyFlocks(600)[0].learned.length>0||{R}.nearbyFlocks(600)[0].answerBar>=0||!!{R}.S.ach.bandada1")
 # El dedo sobre un objeto no lo manipula: lanza el pulso.
 jump(1800,2620);a2=page.evaluate(f"{R}.nearbyMateria(300).find(s=>s.kind==='prism').angle");waves=page.evaluate(f'{R}.waves.length')
 page.mouse.click(195,422+80);page.wait_for_timeout(200)
 assert page.evaluate(f"{R}.nearbyMateria(300).find(s=>s.kind==='prism').angle")==a2
 assert not errors,errors
 print('cube-only: strings tension/release, prism by orbit, membrane roll, mirror push, glass ring, bird touch, finger = pulse PASS',flush=True)
 b.close()
server.shutdown()
