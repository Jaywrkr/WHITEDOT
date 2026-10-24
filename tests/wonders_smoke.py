from browser_helpers import complete_path_fixture
# Navegador: rarezas con su regla, muestra única y rumor; ríos que suenan; mapa con estrellas.
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
FIND='''(type)=>{const r=window.__testRuntime;for(let ring=4;ring<120;ring++)for(let i=-ring;i<=ring;i++)for(const [x,y] of [[i,-ring],[i,ring],[-ring,i],[ring,i]]){const a=r.anomalyAt(x,y);if(a&&a.type===type)return [x,y];}return null;}'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(8000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  # Rumor: apunta a una rareza con dirección.
  rum=page.evaluate('window.__testRuntime.rumor(true)');assert rum and rum['text'].startswith('Dicen que al'),rum
  # Rareza en canon: regla activa, registro y muestra única.
  x,y=page.evaluate(FIND,'canon');page.evaluate(f'()=>{{const r=window.__testRuntime;r.S.wx={x}*3600+1800;r.S.wy={y}*3600+1800;}}')
  page.wait_for_function('window.__testRuntime.MU.anomaly==="canon"')
  assert page.evaluate(f'window.__testRuntime.S.anomalies["{x},{y}"].type')=='canon' and page.evaluate('window.__testRuntime.S.bag.canon')>=3
  assert page.evaluate('!!window.__testRuntime.S.ach.rareza1')
  assert page.evaluate('__testRuntime.rareCards.some(c=>c.type==="anomaly:canon"&&c.address&&!c.forced)'),"natural anomaly must save its card"
  page.evaluate('__testRuntime.openJournal("rares")');page.screenshot(path=f'/tmp/whitedot-natural-card-book-{label}.png');page.locator('#journalClose').click()
  page.wait_for_timeout(600);page.screenshot(path=f'/tmp/whitedot-anomaly-{label}.png')
  # Gravedad invertida: la tecla derecha mueve a la izquierda.
  x,y=page.evaluate(FIND,'invertida');page.evaluate(f'()=>{{const r=window.__testRuntime;r.S.wx={x}*3600+1800;r.S.wy={y}*3600+1800;}}')
  page.wait_for_function('window.__testRuntime.MU.anomaly==="invertida"')
  before=page.evaluate('window.__testRuntime.S.wx');page.keyboard.down('d');page.wait_for_timeout(400);page.keyboard.up('d')
  assert page.evaluate('window.__testRuntime.S.wx')<before-20
  # Río: energía y gotas a tempo.
  page.evaluate('''()=>{const r=window.__testRuntime;let seed=12345;const rand=()=>(seed=(seed*16807)%2147483647)/2147483647;for(let i=0;i<40000;i++){const x=(rand()-.5)*30*3600,y=(rand()-.5)*30*3600,q=r.riverAt(x,y);if(q&&q.on&&q.edge<.3){r.S.wx=x;r.S.wy=y;return;}}throw Error('no river');}''')
  page.wait_for_function('window.__testRuntime.MU.river>0')
  # Count every voice source (synth or sample) and probe outside a melodic rest, which silences the river on purpose.
  n=page.evaluate('()=>{const r=window.__testRuntime,ac=r.ac,o=ac.createOscillator.bind(ac),bs=ac.createBufferSource.bind(ac),radio=r.MU.radio,rest=radio?.melodyRest;let made=0;ac.createOscillator=()=>{made++;return o();};ac.createBufferSource=()=>{made++;return bs();};if(radio)radio.melodyRest=false;try{r.riverBar(ac.currentTime+.1);}finally{ac.createOscillator=o;ac.createBufferSource=bs;if(radio)radio.melodyRest=rest;}return made;}')
  assert n>0,n
  page.wait_for_timeout(500);page.screenshot(path=f'/tmp/whitedot-river-{label}.png')
  # Mapa con estrellas de rarezas y Estudio con la muestra única.
  page.locator('#bMenu').click();(page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bMap').click();assert 'rarezas' in page.locator('#mapNote').inner_text();page.locator('#journalClose').click()
  page.locator('#bMenu').click();page.locator('#bStudio').click();page.wait_for_function('__testRuntime.houseSettled()');bench=page.evaluate('__testRuntime.houseToScreen(339,505)');page.locator('#w').click(position=bench);page.wait_for_function("!document.getElementById('studioPanel').hidden");assert page.locator('#bag button[data-s="canon"]').count()==1 and page.locator('#bag button[data-s="luna"]').count()==0
  page.locator('#stExit').click();page.locator('#houseExit').click()
  assert not errors,errors
  print(label+': rumors, canon rule and unique sample, inverted gravity, river energy and notes, map and studio PASS',flush=True);c.close()
 b.close()
server.shutdown()
