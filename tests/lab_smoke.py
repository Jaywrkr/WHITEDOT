# Navegador: el Laboratorio abre un mundo aparte, recorre los 29 elementos poniéndote frente a cada uno,
# «Solo» calla la música del lugar, las notas se guardan y el informe sale en Markdown. Tu partida no cambia.
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
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 c=b.new_context(viewport={'width':390,'height':844},has_touch=True);page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
 page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
 page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
 normal=page.evaluate("localStorage.getItem('pixel-blanco-v4')")
 page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dLab').click()
 page.wait_for_function('window.__testRuntime&&window.__testRuntime.labMode&&!document.getElementById("labBar").hidden')
 page.wait_for_timeout(400)
 assert page.evaluate("window.__testRuntime.S.previewSeed")=='laboratorio'
 assert page.evaluate("document.querySelectorAll('.modal:not([hidden])').length")==0,'lab starts without blocking modals'
 ids=page.evaluate("import('./src/lab-catalog.js').then(m=>m.LAB_ELEMENTS.map(e=>[e.id,e.find.type,e.find.tool||'']))")
 assert len(ids)==62,len(ids)
 page.screenshot(path='/tmp/whitedot-lab-first.png')
 found={}
 for i,(eid,kind,tool) in enumerate(ids):
  if i: page.locator('#labNext').click()
  page.wait_for_timeout(250)
  st=page.evaluate("(()=>{const r=window.__testRuntime;return {cur:r.labBook.current,x:r.S.wx,y:r.S.wy,name:document.getElementById('labName').textContent,tries:document.querySelectorAll('#labTry li').length}})()")
  assert st['cur']==eid and st['tries']>=1,(eid,st)
  if kind in ("toy","phenomenon","trail","home","family","flock"):
   found[eid]=(round(st['x']),round(st['y']))
  if eid in ('materia:prism','family:animal','toy:rotor','phenomenon:bird','glass'):page.screenshot(path=f"/tmp/whitedot-lab-{eid.replace(':','-')}.png")
  if tool=='fx':assert page.locator('#fxPanel').is_visible();page.locator('#fxClose').click()
  if tool=='favorites':assert page.locator('#mFavorites').is_visible();page.locator('#favoritesClose').click()
 # Cada elemento del mundo da una posición distinta (se encontró algo de verdad).
 positions=[v for k,v in found.items() if not k.startswith('family:')];assert len(set(positions))==len(positions),found
 assert all(found[k]==found['family:box'] for k in found if k.startswith('family:')),'families share the lab stage'
 # Solo calla la pista del lugar.
 page.locator('#labSolo').click();assert page.evaluate('window.__testRuntime.labSolo')==True
 page.locator('#labSolo').click();assert page.evaluate('window.__testRuntime.labSolo')==False
 # Notas: veredicto, preguntas y texto; sobreviven a recargar.
 page.evaluate("window.__testRuntime.labGo('materia:prism')");page.wait_for_timeout(200)
 page.locator('#labNotes').click();page.locator('#labVerdicts [data-verdict="fix"]').click()
 page.locator('[data-check="clear"]').click();page.locator('[data-check="sound"]').click();page.locator('[data-check="sound"]').click()
 page.locator('#labText').fill('gira muy lento en móvil')
 page.screenshot(path='/tmp/whitedot-lab-notes.png')
 rep=page.evaluate('window.__testRuntime.labReportText()')
 assert '### Prisma de luz — Mejorar' in rep and 'Falla: Suena bien con la música' in rep and 'Funciona: Se entiende qué hacer' in rep and 'gira muy lento' in rep,rep
 page.locator('#labList [data-go="glass"]').click();page.wait_for_timeout(200);assert page.evaluate('window.__testRuntime.labBook.current')=='glass'
 page.reload(wait_until='domcontentloaded');page.wait_for_function('window.__testRuntime&&window.__testRuntime.labMode')
 assert page.evaluate("window.__testRuntime.labBook.notes['materia:prism'].text")=='gira muy lento en móvil'
 assert page.evaluate('window.__testRuntime.labBook.current')=='glass'
 # Salir vuelve a la partida habitual sin tocarla.
 page.locator('#labNotes').click();page.locator('#labExit').click();page.wait_for_load_state('domcontentloaded');page.wait_for_function('window.__testRuntime')
 assert page.evaluate('window.__testRuntime.S.previewSeed') in (None,'',False) and page.locator('#labBar').is_hidden()
 assert page.evaluate("localStorage.getItem('pixel-blanco-v4')")==normal or normal is None
 assert not errors,errors
 print('lab: 62 elements located, solo, notes/report persisted, exit to own save PASS',flush=True)
 b.close()
server.shutdown()
