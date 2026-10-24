from browser_helpers import complete_path_fixture
from browser_helpers import keep_place_on_reload
# Navegador: mesa de efectos. El pad filtra y da espacio, vuelve a limpio al soltar, Fijar lo mantiene, Stop frena y no mueve al pixel.
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
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.locator('#bMenu').click();(page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bAch').click();page.locator('[data-journal-tab="places"]').click();assert page.locator('#journalFavPart').is_visible()
  page.locator('#favName').fill('Mi música <favorita>');page.locator('#favSave').click()
  assert page.locator('[data-favorite]').count()==1
  page.locator('#favSearch').fill('sin coincidencias 999');assert page.locator('[data-favorite]').count()==0
  page.locator('#favSearch').fill('Mi música');assert page.locator('[data-favorite]').count()==1
  page.locator('#favSearch').fill('')
  page.locator('[data-favorite] summary').click();page.locator('[data-favorite] input').fill('Rincón de dub');page.locator('[data-favorite] button').filter(has_text='Renombrar').click()
  point=page.evaluate('window.__testRuntime.favorites[0]');assert point['name']=='Rincón de dub' and point['layer']=='superficie'
  page.locator('#journalClose').click();keep_place_on_reload(page);page.reload(wait_until='domcontentloaded')
  page.wait_for_function('window.__testRuntime && window.__testRuntime.favorites.length===1')
  assert page.evaluate('window.__testRuntime.favorites[0].name')=='Rincón de dub'
  page.locator('#bMenu').click();(page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bAch').click();assert 'Rincón de dub' in page.locator('#journalBody').inner_text();page.locator('#journalClose').click()
  page.locator('#bMenu').click();(page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bAch').click();page.locator('[data-journal-tab="places"]').click();page.screenshot(path=f'/tmp/whitedot-favorites-{label}.png')
  page.locator('[data-favorite] summary').click();page.locator('[data-favorite] button').filter(has_text='Borrar').click();assert page.evaluate('window.__testRuntime.favorites.length')==0
  page.locator('#journalClose').click()
  # Same-day reopen keeps the place; a save left in the Mundo from another day receives the new arrival.
  same=page.evaluate("()=>{const r=__testRuntime,s=r.S;s.destination=null;r.save();return {x:s.wx,y:s.wy,arrivals:s.practiceTravel.arrivals||0};}")
  page.goto(URL);page.wait_for_function('!!window.__testRuntime?.dailyArrival')
  assert page.evaluate("b=>{const s=__testRuntime.S;return (s.practiceTravel.arrivals||0)===b.arrivals&&s.wx===b.x&&s.wy===b.y;}",same)
  entry=page.evaluate("()=>{const r=__testRuntime,s=r.S;s.arrivalMode='continue';s.destination=null;s.lastWorldDay='2000-01-01';r.save();return {x:s.wx,y:s.wy,arrivals:s.practiceTravel.arrivals||0};}")
  page.goto(URL);page.wait_for_function('!!window.__testRuntime?.dailyArrival')
  assert page.evaluate('''before=>{const r=__testRuntime,s=r.S;return s.practiceTravel.arrivals===before.arrivals+1&&!r.regionOfPos(s.wx,s.wy).sea&&Math.hypot(s.wx-before.x,s.wy-before.y)>500&&s.practiceTravel.previous.x===before.x&&!r.dailyArrival();}''',entry)
  assert not errors,errors
  print(label+': named favorite save, rename, reload, journal, safe text and removal PASS',flush=True);c.close();b.close()
server.shutdown()
