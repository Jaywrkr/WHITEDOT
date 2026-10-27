"""L4 · itch.io web build. The zip from scripts/itch-package.mjs is unpacked and served from a subdirectory
(/html/123456/, as itch.io's CDN does) and framed by a page on another site, as the itch.io page does. The game starts,
a tap starts its sound (AudioContext running), it saves, a reload of the frame keeps the game, nothing is asked outside
the game's own folder, no console errors, no service worker, in Spanish and with ?lang=en."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,subprocess,tempfile,zipfile,time
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
started=time.time()
work=Path(tempfile.mkdtemp(prefix='kubono-itch-test-'))
SUB='/html/123456/'
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
servers=[]
def serve(directory):
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(directory)));threading.Thread(target=server.serve_forever,daemon=True).start();servers.append(server);return server.server_port
try:
 # 1. Package, then unpack where the CDN would put it.
 out=subprocess.run(['node',str(ROOT/'scripts/itch-package.mjs'),'--out',str(work/'dist')],check=True,capture_output=True,text=True).stdout
 archive=next((work/'dist').glob('kubono-itch-*.zip'))
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None;names=z.namelist()
  assert 'index.html' in names and len(names)<1000,len(names)
  assert not [n for n in names if n.split('/')[0] in ('tests','docs','android','server','scripts','supabase','tools','.github','outputs') or n in ('sw.js','recovery.html','package.json')],names
  z.extractall(work/'cdn'/SUB.strip('/'))
 game=work/'cdn'/SUB.strip('/')
 assert "EDITION='store'" in (game/'src/edition.js').read_text(encoding='utf-8')
 assert '<meta name="kubono-service-worker" content="off">' in (game/'index.html').read_text(encoding='utf-8')
 # 2. Two sites: the game on 127.0.0.1 (the CDN) and the page that frames it on localhost (the itch.io page).
 GAME=f'http://127.0.0.1:{serve(work/"cdn")}';GAME_DIR=GAME+SUB
 (work/'page').mkdir()
 (work/'page'/'index.html').write_text("""<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,"><title>itch frame</title>
<body style="margin:0;background:#222"><iframe id="game" width="390" height="844" frameborder="0" allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated; web-share" allowfullscreen scrolling="no"></iframe>
<script>document.getElementById('game').src=new URLSearchParams(location.search).get('game');</script></body>""",encoding='utf-8')
 PAGE=f'http://localhost:{serve(work/"page")}/'
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=user-gesture-required'])
  context=browser.new_context(viewport={'width':430,'height':900},has_touch=True,accept_downloads=True)
  # A real player's browser: a new save starts in the Viaje, in Spanish.
  context.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
  # Tests read the runtime by serving main.js with it exposed (never in the build).
  context.route(f'**{SUB}src/main.js',lambda r:r.fulfill(body=(game/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  outside=[];errors=[]
  def watch(request):
   url=request.url
   if url.startswith(('data:','blob:')) or url.split('?')[0]==PAGE:return
   if not url.startswith(GAME_DIR):outside.append(url)
  context.on('request',watch)
  page=context.new_page()
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  ready='!!window.__r?.journeyMode&&!!window.__r?.save&&document.querySelector("canvas").width>300'
  def open_frame(query=''):
   page.goto(PAGE+'?game='+quote(GAME_DIR+'index.html'+query,safe=''))
   for _ in range(200):
    frame=next((f for f in page.frames if f.url.startswith(GAME_DIR)),None)
    if frame:break
    page.wait_for_timeout(50)
   assert frame,'the game frame did not load'
   frame.wait_for_function(ready,timeout=30000);return frame
  # 3. Spanish start inside the frame: sale edition, relative paths, no worker, sound after the first tap.
  frame=open_frame()
  state=frame.evaluate("({edition:__r.edition,lang:document.documentElement.lang,origin:location.origin,framed:window.top!==window.self,sw:!!navigator.serviceWorker?.controller})")
  assert state=={'edition':'store','lang':'es','origin':GAME,'framed':True,'sw':False},state
  assert frame.evaluate("document.querySelector('#bSettings span').textContent")=='Ajustes'
  assert frame.evaluate("navigator.serviceWorker?navigator.serviceWorker.getRegistrations().then(r=>r.length):0")==0
  assert frame.evaluate("!window.__r.ac||window.__r.ac.state!=='running'"),'no sound before the first touch'
  # The player's first tap, on whatever the start screen shows.
  box=page.locator('#game').bounding_box()
  page.mouse.click(box['x']+box['width']/2,box['y']+box['height']*0.6)
  frame.wait_for_function("window.__r.ac?.state==='running'",timeout=10000)
  # 4. Save, reload the frame: the game is still there (localStorage of the CDN origin, inside the frame).
  frame.evaluate("()=>{const s=__r.S;s.sparks=57;s.pathCrystals=Array.from({length:10},(_,i)=>'itch:'+i);if(!__r.save())throw Error('save failed');}")
  size=frame.evaluate("localStorage.getItem('pixel-blanco-v4').length")
  page.reload();frame=next(f for f in page.frames if f.url.startswith(GAME_DIR));frame.wait_for_function(ready,timeout=30000)
  kept=frame.evaluate("({sparks:__r.S.sparks,crystals:__r.S.pathCrystals.length,first:__r.S.pathCrystals[0]})")
  assert kept=={'sparks':57,'crystals':10,'first':'itch:0'},kept
  # The backup leaves the frame as a download: the way to carry the game to another device or origin.
  frame.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)")
  frame.locator('#bMenu').click();frame.wait_for_selector('#mMenu:not([hidden])');frame.evaluate("document.getElementById('menuMore')?.setAttribute('open','')")
  frame.locator('#bSaveTools').click();frame.wait_for_selector('#mSaveTools:not([hidden])')
  with page.expect_download() as download:frame.locator('#saveExport').click()
  assert 'itch:0' in Path(download.value.path()).read_text(encoding='utf-8'),'the backup carries this game'
  frame.locator('#saveToolsClose').click()
  # 5. English: ?lang=en in the frame's address, same save.
  frame=open_frame('?lang=en');frame.wait_for_function("document.documentElement.lang==='en'&&!document.documentElement.hasAttribute('data-i18n-wait')",timeout=10000)
  assert frame.evaluate("document.querySelector('#bSettings span').textContent")=='Settings'
  assert frame.evaluate("document.getElementById('bMenu').getAttribute('aria-label')")!='Menú'
  assert frame.evaluate('__r.S.sparks')==57
  box=page.locator('#game').bounding_box();page.mouse.click(box['x']+box['width']/2,box['y']+box['height']*0.6)
  frame.wait_for_function("window.__r.ac?.state==='running'",timeout=10000)
  page.wait_for_timeout(800)
  assert not outside,outside
  assert not errors,errors
  browser.close()
 print(f'PASS itch package: zip of {len(names)} files unpacked under {SUB}, framed from another site; starts in the sale edition without a service worker, a tap starts the sound, a {size}-byte save survives reloading the frame and exports as a copy, Spanish and ?lang=en, nothing outside the game folder, no console errors ({time.time()-started:.0f}s)',flush=True)
finally:
 for server in servers:server.shutdown()
 shutil.rmtree(work,ignore_errors=True)
