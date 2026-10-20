"""Mandatory Auth plus real game modules, mocked Supabase only: no mail or personal saves."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,json,os,time
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
remote={};online=True;calls=[]
config="export const CLOUD_CONFIG={url:'https://fixture.supabase.co',publishableKey:'sb_publishable_fixture'};"
def api(route):
 req=route.request;path=req.url.split('.co')[1];calls.append(path)
 if not online:route.abort('internetdisconnected');return
 body=req.post_data_json if req.post_data else {};uid='two' if body.get('email','').startswith('two@') else 'one'
 token=req.headers.get('authorization','');owner='two' if token.endswith('-two') else 'one';data={};status=200
 if '/signup' in path:data={'user':{'id':uid}}
 elif '/token?' in path:
  if body.get('password')=='bad-password-123':status=400
  else:data={'access_token':'access-'+uid,'refresh_token':'refresh-'+uid,'expires_in':3600,'user':{'id':uid,'email':uid+'@example.test'}}
 elif '/auth/v1/user' in path:data={'id':owner,'email':owner+'@example.test'}
 elif '/kubono_saves?' in path:data=[remote[owner]] if owner in remote else []
 elif '/rpc/kubono_save' in path:
  old=remote.get(owner,{})
  if body['p_revision']!=old.get('revision',0):data={'ok':False}
  else:remote[owner]={'state':body['p_state'],'revision':old.get('revision',0)+1};data={'ok':True,'revision':remote[owner]['revision']}
 route.fulfill(status=status,body=json.dumps(data),content_type='application/json',headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'})
def prepare(page,configured=True):
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.route('**/src/cloud-config.js',lambda r:r.fulfill(body=config if configured else 'export const CLOUD_CONFIG={};',content_type='text/javascript'))
 page.route('https://fixture.supabase.co/**',api);page.goto(f'http://127.0.0.1:{server.server_port}/')
def login(page,email='one@example.test',password='fixture-password-123'):
 page.locator('#accountName').fill(email);page.locator('#accountPassword').fill(password);page.locator('#accountForm button[type=submit]').click()
def started(page):
 page.wait_for_function('!!window.__r?.connectionTick');page.locator('#returnContinue').click()
 if page.locator('#hcGo').is_visible():page.locator('#hcGo').click()
 page.evaluate('__r.S.sound=false')
def account(page):
 # A second tab of the same account may already show the divergence panel; the menu is inert behind it.
 # The panel can also open between the check and the click, leaving the menu inert: retry instead of racing it.
 for _ in range(4):
  if page.locator('#mConnection').is_visible():return
  try:page.locator('#bMenu').click(timeout=4000);page.locator('#bConnection').click(timeout=4000);return
  except Exception:pass
 assert page.locator('#mConnection').is_visible()
def wait_remote(page,uid,sparks):
 deadline=time.monotonic()+15
 while remote.get(uid,{}).get('state',{}).get('sparks')!=sparks and time.monotonic()<deadline:page.wait_for_timeout(100)
 assert remote[uid]['state']['sparks']==sparks
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox']);context=browser.new_context(viewport={'width':390,'height':844},service_workers='block');page=context.new_page();prepare(page,False)
  assert page.locator('#mConnection').is_visible();assert page.locator('#accountRegister').is_disabled();assert page.evaluate('typeof window.__r')=='undefined';assert page.evaluate('localStorage.length')==0
  page.close();context.close();context=browser.new_context(viewport={'width':390,'height':844},service_workers='block');page=context.new_page();prepare(page)
  assert page.locator('#accountGuest').is_hidden();assert page.locator('#connectionClose').is_hidden();page.keyboard.press('Escape');assert page.locator('#mConnection').is_visible();assert page.evaluate('typeof window.__r')=='undefined'
  # An old unowned save is copied once, never removed or assigned to another account.
  page.evaluate("localStorage.setItem('pixel-blanco-v4',JSON.stringify({sparks:24,mode:'camino'}))")
  login(page,password='bad-password-123');page.wait_for_function("document.getElementById('connectionStatus').textContent.includes('verificar')");assert page.evaluate('typeof window.__r')=='undefined'
  page.locator('#accountPassword').fill('fixture-password-123');page.locator('#accountRegister').click();page.wait_for_function("document.getElementById('connectionStatus').textContent.includes('confirmación')");assert page.evaluate('typeof window.__r')=='undefined';assert page.locator('#accountPassword').input_value()==''
  login(page);started(page);wait_remote(page,'one',24);assert page.evaluate("__r.saveStore.key.includes('kubono:user:one:')");assert page.evaluate("!!localStorage.getItem('pixel-blanco-v4')")
  page.evaluate("()=>{__r.S.sparks=4;__r.S.sparkEconomy.spent=20;__r.save();dispatchEvent(new Event('focus'));}");wait_remote(page,'one',4)
  page.close();page=context.new_page();prepare(page);started(page);assert page.evaluate('__r.S.sparks')==4
  phoneContext=browser.new_context(viewport={'width':390,'height':844},service_workers='block');phone=phoneContext.new_page();prepare(phone);login(phone);started(phone);phone.wait_for_function('__r.S.sparks===4')
  online=False;phone.evaluate("()=>{__r.S.sparks=7;__r.save();dispatchEvent(new Event('focus'));}");phone.reload();started(phone);assert phone.evaluate('__r.S.sparks')==7;assert remote['one']['state']['sparks']==4
  online=True;phone.evaluate("dispatchEvent(new Event('online'))");wait_remote(phone,'one',7);page.evaluate("dispatchEvent(new Event('focus'))");page.wait_for_function('__r.S.sparks===7')
  # A new account must start separately, even with another account's data on disk.
  account(page);page.locator('#accountLogout').click();page.wait_for_function("document.body.dataset.accountLocked==='true'");assert page.evaluate('typeof window.__r')=='undefined'
  login(page,'two@example.test');started(page);wait_remote(page,'two',0);assert page.evaluate("__r.saveStore.key.includes('kubono:user:two:')");assert remote['one']['state']['sparks']==7
  other=context.new_page();prepare(other);started(other);assert other.evaluate('__r.accountUserId')=='two'
  account(page);page.locator('#accountLogout').click();other.wait_for_function("document.body.dataset.accountLocked==='true'");assert other.evaluate('typeof window.__r')=='undefined'
  assert page.locator('#accountGuest').is_hidden();assert not any('/rooms' in p for p in calls)
  # Choosing the online copy from the Camino while this device is in the Mundo must leave the Mundo cleanly: no region or world music left behind.
  desk=browser.new_context(viewport={'width':390,'height':844},service_workers='block').new_page();prepare(desk);login(desk,'two@example.test');started(desk)
  desk.evaluate("()=>{const r=__r;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:'+i);r.enterWorld({automatic:true});r.save();dispatchEvent(new Event('focus'));}")
  deadline=time.monotonic()+15
  while remote.get('two',{}).get('state',{}).get('mode')!='world' and time.monotonic()<deadline:desk.wait_for_timeout(100)
  mobile=browser.new_context(viewport={'width':390,'height':844},service_workers='block').new_page();prepare(mobile);login(mobile,'two@example.test');started(mobile);mobile.wait_for_function('__r.inWorld()')
  mobile.evaluate("()=>{__r.exitWorld(false);__r.S.sparks=11;__r.save();dispatchEvent(new Event('focus'));}")
  deadline=time.monotonic()+15
  while remote.get('two',{}).get('state',{}).get('mode')!='camino' and time.monotonic()<deadline:mobile.wait_for_timeout(100)
  assert remote['two']['state']['mode']=='camino'
  desk.evaluate("()=>{__r.S.sparks=99;__r.save();dispatchEvent(new Event('focus'));}");desk.wait_for_function("!document.getElementById('cloudPull').hidden",timeout=20000);assert desk.evaluate('__r.curRegion')!=None
  desk.once('dialog',lambda d:d.accept());desk.locator('#cloudPull').click();desk.wait_for_function('__r.S.sparks===11&&!__r.inWorld()')
  desk.wait_for_timeout(500);assert desk.evaluate('__r.curRegion') is None;assert not desk.evaluate('!!__r.MU.dnaT');assert 'world-mode' not in desk.evaluate('document.body.className')
  page.screenshot(path=str(ROOT.parent/'account-required-mobile.png'));browser.close()
 print('PASS mandatory account: no world before Auth, invalid/signup gate, legacy preservation, persistent/offline reopen, automatic PC/phone balance, account isolation, cross-tab logout and clean Mundo-to-Camino restore; mocked Auth/REST only')
finally:server.shutdown();server.server_close()
