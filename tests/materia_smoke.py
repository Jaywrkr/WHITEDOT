from browser_helpers import complete_path_fixture
# Navegador: cuerdas (tensar, soltar, rasguear), prisma (girar, guardar, cancelar), membrana (tocar y redoblar),
# nuevos efectos (chorus, phaser, freeze), códigos de lugar y grabación de un set. El pixel no se mueve con los gestos.
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
COUNT='()=>{window.__testRuntime.materiaPlayed.length=0}'
with sync_playwright() as p:
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function('window.__testRuntime.ac&&window.__testRuntime.ac.state==="running"')
  page.evaluate(COUNT)
  def site(kind):
   return page.evaluate(f"()=>{{const r=window.__testRuntime;r.S.wx=1800;r.S.wy=2450;const s=r.nearbyMateria(3000).find(s=>s.id==='{kind}:0,0');r.S.wx=s.x;r.S.wy=s.y-120;return {{x:r.W/2+s.x-r.S.wx,y:r.H/2+s.y-r.S.wy}};}}")
  pos=lambda:page.evaluate('[window.__testRuntime.S.wx,window.__testRuntime.S.wy]')
  # Cuerdas: tensar y soltar suena; el pixel no se mueve.
  s=site('strings');page.wait_for_timeout(300);before=pos()
  page.mouse.move(s['x']-20,s['y']+11);page.mouse.down();page.mouse.move(s['x']-20,s['y']+50,steps=6);page.wait_for_timeout(100)
  assert page.evaluate("Math.abs(window.__testRuntime.nearbyMateria(400).find(s=>s.kind==='strings').bends[2])>20")
  page.mouse.up();page.wait_for_function("window.__testRuntime.materiaPlayed.some(v=>v.startsWith('installation:strings:'))")
  assert pos()==before,'string gesture must not move the player'
  assert page.evaluate('!!window.__testRuntime.S.ach.cuerda1 && window.__testRuntime.S.materiaSites["strings:0,0"].seen')
  # Rasgueo: cruzar las cuatro cuerdas.
  page.evaluate(COUNT);page.mouse.move(s['x']+40,s['y']-46);page.mouse.down();page.mouse.move(s['x']+40,s['y']+46,steps=10);page.mouse.up()
  page.wait_for_function("new Set(window.__testRuntime.materiaPlayed.filter(v=>v.startsWith('installation:strings:'))).size>=3")
  page.screenshot(path=f'/tmp/whitedot-strings-{label}.png')
  # Prisma: girar cambia el ángulo y se guarda al soltar; cancelar con el menú restaura.
  s=site('prism');page.wait_for_timeout(300);a0=page.evaluate("window.__testRuntime.nearbyMateria(400).find(s=>s.kind==='prism').angle")
  page.mouse.move(s['x']+30,s['y']);page.mouse.down();page.mouse.move(s['x'],s['y']+30,steps=8);page.mouse.up();page.wait_for_timeout(200)
  a1=page.evaluate('window.__testRuntime.S.materiaSites["prism:0,0"].angle');assert abs(a1-a0)>.5,(a0,a1)
  assert page.evaluate('!!window.__testRuntime.S.ach.prisma1')
  page.screenshot(path=f'/tmp/whitedot-prism-{label}.png')
  page.mouse.move(s['x']+30,s['y']);page.mouse.down();page.mouse.move(s['x'],s['y']-30,steps=8);page.evaluate("document.getElementById('bMenu').click()");page.wait_for_timeout(100);page.mouse.up()
  assert abs(page.evaluate("window.__testRuntime.nearbyMateria(400).find(s=>s.kind==='prism')?.angle??"+str(a1))-a1)<1e-6,'cancel restores the saved angle'
  page.evaluate("document.getElementById('mMenu').hidden=true")
  # Membrana: mantener redobla a tempo.
  s=site('membrane');page.wait_for_timeout(300);page.evaluate(COUNT)
  page.mouse.move(s['x'],s['y']);page.mouse.down();page.wait_for_timeout(1600);page.mouse.up()
  n=page.evaluate("window.__testRuntime.materiaPlayed.filter(v=>v.startsWith('installation:membrane:')).length");assert n>=3,n
  assert page.evaluate('!!window.__testRuntime.S.ach.membrana1 && !!window.__testRuntime.S.ach.materia3')
  page.screenshot(path=f'/tmp/whitedot-membrane-{label}.png')
  # Efectos nuevos.
  page.locator('#bMenu').click();page.locator('#bTools').click();page.locator('#bFx').click()
  for k in ['Chorus','Phaser','Freeze']:page.locator('#fx'+k).click()
  page.wait_for_timeout(300)
  st=page.evaluate('(()=>{const f=window.__testRuntime.fx;return [f.chorusSend.gain.value,f.phaserSend.gain.value,f.freezeFb.gain.value,f.freezeOut.gain.value]})()')
  assert st[0]>.3 and st[1]>.3 and st[2]>.9 and st[3]>.5,st
  for k in ['Chorus','Phaser','Freeze']:page.locator('#fx'+k).click()
  page.wait_for_timeout(600);assert page.evaluate('window.__testRuntime.fx.freezeOut.gain.value')<.1
  page.locator('#fxClose').click()
  # Código de lugar: copiar el de aquí y abrirlo guarda un favorito orientado.
  page.locator('#bMenu').click();page.locator('#bFavorites').click()
  page.locator('.favorite-tools > summary').click();page.locator('#placeShare').click();page.wait_for_function("document.getElementById('placeCode').value.startsWith('WD1-')")
  page.evaluate("()=>{const r=window.__testRuntime;document.getElementById('placeCode').value=r.placeCode().replace(/^WD1-.*/,(c)=>c);}")
  code=page.evaluate("(()=>{const r=window.__testRuntime;r.S.wx+=4000;return document.getElementById('placeCode').value})()")
  page.locator('#placeOpen').click();page.wait_for_function("window.__testRuntime.S.destination&&window.__testRuntime.favorites.some(p=>p.shared)")
  assert 'Guardado' in page.locator('#placeCodeInfo').inner_text()
  if page.locator('#favoritesClose').is_visible():page.locator('#favoritesClose').click()
  # Grabar set: 2 s y detener produce un video descargable.
  # A real finding may precede recording. Read it through its own controls first.
  for panel,button in [('#celebration','#celebrationDismiss'),('#rareNotice','#rareNoticeDismiss')]:
   if page.locator(panel).is_visible():page.locator(button).click();page.locator(panel).wait_for(state='hidden')
  page.locator('#bMenu').click();page.locator('#bRecord').click();page.wait_for_function('window.__testRuntime.setRecording')
  count=page.evaluate('window.__testRuntime.rareCards.length')
  page.evaluate("()=>{const r=window.__testRuntime;r.collectRareCard('fossil',{id:'fixture:recording',x:r.S.wx,y:r.S.wy});}")
  page.wait_for_timeout(2200)
  assert page.evaluate('window.__testRuntime.rareCards.length')==count+1,'recording cannot lose a finding'
  assert page.locator('#rareNotice').is_hidden() and page.locator('#celebration').is_hidden(),'findings wait until recording stops'
  page.locator('#recBadge').click()
  page.wait_for_function("!document.getElementById('mSet').hidden",timeout=15000)
  assert page.evaluate('window.__testRuntime.lastSet.size')>1000 and page.locator('#setDownload').get_attribute('download').startswith('kubono-set-')
  page.locator('#setClose').click()
  assert not errors,errors
  print(label+': strings bend/strum, prism rotate/save/cancel, membrane roll, chorus/phaser/freeze, place code, set recording PASS',flush=True);c.close();b.close()
server.shutdown()
