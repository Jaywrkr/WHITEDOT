"""L1 · sale edition without cloud. The flag is stamped the way a packager stamps it (scripts/set-edition.mjs on a
staged copy). A game saved by the web edition, with and without a saved account session, loads with its progress in the
sale edition; a walk through start, Viaje, World, menu, Ajustes and Refugio asks for nothing outside its own origin; no
account button shows, and «Guardar copia» and «Empezar de cero» stay."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,subprocess,tempfile,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
ORIGIN=f'http://127.0.0.1:{server.server_port}'
stage=Path(tempfile.mkdtemp(prefix='kubono-sale-'))
(stage/'src').mkdir();shutil.copy(ROOT/'src/edition.js',stage/'src/edition.js')
subprocess.run(['node',str(ROOT/'scripts/set-edition.mjs'),'--dir',str(stage),'--edition','store'],check=True,capture_output=True)
STORE=(stage/'src/edition.js').read_text(encoding='utf-8');assert "EDITION='store'" in STORE
hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
ACCOUNT=['bConnection','mConnection','accountForm','accountRegister','accountDelete','accountLogout','accountGuest','accountRecover','cloudPush','cloudPull']
SESSION_KEY='kubono:auth:https://eghmydqxsicqmbmeprgq.supabase.co'
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  # Service workers off so every request of the page is seen (the worker only caches the game's own files).
  context=browser.new_context(viewport={'width':390,'height':844},service_workers='block',accept_downloads=True)
  # A real player's browser: a new save starts in the Viaje.
  context.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
  sale={'on':False};outside=[];errors=[]
  context.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  context.route('**/src/edition.js',lambda r:r.fulfill(body=STORE,content_type='text/javascript') if sale['on'] else r.continue_())
  def watch(request):
   if sale['on'] and not request.url.startswith(ORIGIN+'/') and not request.url.startswith(('data:','blob:')):outside.append(request.url)
  context.on('request',watch)
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  ready='!!window.__r?.journeyMode&&!!window.__r?.enterHouse&&!!window.__r?.startOver'
  # 1. The web edition saves a game: 57 sparks and the ten crystals of the Camino.
  page.goto(ORIGIN+'/');page.wait_for_function(ready)
  assert page.evaluate('__r.edition')=='web' and page.evaluate("document.getElementById('bConnection').hidden")==False
  page.evaluate("()=>{const s=__r.S;s.sparks=57;s.pathCrystals=Array.from({length:10},(_,i)=>'sale:'+i);if(!__r.save())throw Error('save failed');}")
  saved=page.evaluate("localStorage.getItem('pixel-blanco-v4')");assert json.loads(saved)['sparks']==57
  # 2. The same browser opens the sale edition: same progress, no account, no client.
  sale['on']=True;page.reload();page.wait_for_function(ready);page.wait_for_timeout(600)
  state=page.evaluate("({edition:__r.edition,html:document.documentElement.dataset.edition,sparks:__r.S.sparks,crystals:__r.S.pathCrystals.length,client:__r.accountClient,owner:__r.accountUserId,locked:document.body.dataset.accountLocked||null,mode:__r.journeyMode()})")
  assert state=={'edition':'store','html':'store','sparks':57,'crystals':10,'client':None,'owner':None,'locked':None,'mode':'viaje'},state
  def no_account():
   for id in ACCOUNT:assert page.locator('#'+id).is_hidden(),id
   words=page.evaluate("[...document.querySelectorAll('button,a,[role=button]')].filter(b=>b.offsetParent!==null&&b.getClientRects().length&&/cuenta|nube|^entrar$/i.test(b.textContent.trim())).map(b=>b.id||b.textContent.trim())")
   assert not words,words
  no_account()
  # Menu: «Más» shows «Guardar copia» where «Cuenta» was.
  page.evaluate(hide);page.locator('#bMenu').click();page.wait_for_selector('#mMenu:not([hidden])')
  page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')");no_account()
  assert page.locator('#bSaveTools').is_visible() and page.locator('#bSettings').is_visible()
  page.locator('#bSaveTools').click();page.wait_for_selector('#mSaveTools:not([hidden])')
  with page.expect_download() as download:page.locator('#saveExport').click()
  copy=json.loads(Path(download.value.path()).read_text(encoding='utf-8'));assert copy and 'sale:0' in json.dumps(copy),'the backup carries this game'
  page.locator('#saveToolsClose').click()
  # Ajustes: «Empezar de cero» is offered, with its copy.
  page.evaluate(hide);page.evaluate("__r.$('bSettings').click()");page.wait_for_selector('#mSettings:not([hidden])')
  assert page.locator('#bStartOver').is_enabled() and page.locator('#startOverHint').inner_text()=='Se guarda una copia';no_account()
  # Cómo jugar keeps only the local text.
  assert page.evaluate("[...document.querySelectorAll('[data-cloud]')].every(e=>e.hidden&&!e.getClientRects().length)") and page.evaluate("[...document.querySelectorAll('[data-store]')].every(e=>!e.hidden)")
  # World and Refugio.
  page.evaluate(hide);page.evaluate("()=>{__r.enterWorld({automatic:true});__r.stopAutopilot?.();}");page.wait_for_function('__r.inWorld()');page.wait_for_timeout(1500);no_account()
  page.evaluate(hide);page.evaluate('__r.enterHouse()');page.wait_for_function('__r.houseActive()');page.wait_for_timeout(1500);no_account()
  page.evaluate('__r.exitHouse()');page.wait_for_timeout(500)
  assert page.evaluate('__r.S.sparks')>=57,'progress kept through the walk'
  # 3. A game saved with an account session: the session still names its own save, read only on this device.
  page.evaluate("""raw=>{const s=JSON.parse(raw);s.sparks=88;localStorage.setItem('kubono:user:u-sale:pixel-blanco-v4',JSON.stringify(s));
   localStorage.setItem('%s',JSON.stringify({access_token:'fixture-access',refresh_token:'fixture-refresh',user:{id:'u-sale',email:'fixture@example.test'},expires_at:1}));
   localStorage.setItem('kubono:last-email','fixture@example.test');localStorage.setItem('kubono:cloud:u-sale:pixel-blanco-v4',JSON.stringify({revision:3,baseline:null}));}"""%SESSION_KEY,saved)
  page.reload();page.wait_for_function(ready);page.wait_for_timeout(1500)
  state=page.evaluate("({sparks:__r.S.sparks,crystals:__r.S.pathCrystals.length,client:__r.accountClient,owner:__r.accountUserId,locked:document.body.dataset.accountLocked||null})")
  assert state=={'sparks':88,'crystals':10,'client':None,'owner':'u-sale','locked':None},state
  no_account();page.evaluate(hide);page.evaluate("__r.$('bSettings').click()");page.wait_for_selector('#mSettings:not([hidden])');assert page.locator('#bStartOver').is_enabled()
  # Saving keeps writing to that save; the game without a session and the session itself stay untouched.
  page.evaluate("()=>{__r.S.sparks=89;if(!__r.save())throw Error('save failed');}")
  kept=page.evaluate("[JSON.parse(localStorage.getItem('kubono:user:u-sale:pixel-blanco-v4')).sparks,JSON.parse(localStorage.getItem('pixel-blanco-v4')).sparks,!!localStorage.getItem('%s')]"%SESSION_KEY)
  assert kept[0]==89 and kept[1]>=57 and kept[2],kept
  # 4. Without the session, the game without an account comes back as it was.
  page.evaluate("localStorage.removeItem('%s')"%SESSION_KEY);page.reload();page.wait_for_function(ready);page.wait_for_timeout(600)
  assert page.evaluate('__r.S.sparks')>=57 and page.evaluate('__r.accountUserId') is None
  assert not outside,outside
  assert not errors,errors;browser.close()
 print('PASS sale edition: web saves (with and without a session) load with their progress; start, Viaje, World, menu, Ajustes and Refugio ask nothing outside their origin; no account button; «Guardar copia» exports and «Empezar de cero» stays',flush=True)
finally:
 server.shutdown();shutil.rmtree(stage,ignore_errors=True)
