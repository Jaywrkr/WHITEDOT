"""Optional account: the game starts without one; signing up later from the menu moves into it, a saved session starts at once\nwhile Auth answers slowly, and a revoked session offers the sheet or local play. Mocked Auth only."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,json,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
config="export const CLOUD_CONFIG={url:'https://fixture.supabase.co',publishableKey:'sb_publishable_fixture'};"
state={'identity':200,'slow':0,'confirm':False}
def api(route):
 req=route.request;path=req.url.split('.co')[1];body=req.post_data_json if req.post_data else {};data={};status=200
 session={'access_token':'access-one','refresh_token':'refresh-one','expires_in':3600,'user':{'id':'one','email':'one@example.test'}}
 if '/signup' in path:data={'user':{'id':'one'}} if state['confirm'] else session
 elif '/verify' in path:data=session if body.get('token')=='123456' else {};status=200 if body.get('token')=='123456' else 400
 elif '/token?' in path:data=session
 elif '/auth/v1/user' in path:
  if state['slow']:time.sleep(state['slow'])
  status=state['identity'];data={'id':'one','email':'one@example.test'} if status==200 else {}
 elif '/kubono_saves?' in path:data=[]
 elif '/rpc/kubono_save' in path:data={'ok':True,'revision':1}
 route.fulfill(status=status,body=json.dumps(data),content_type='application/json',headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'})
def prepare(page):
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.route('**/src/cloud-config.js',lambda r:r.fulfill(body=config,content_type='text/javascript'))
 page.route('https://fixture.supabase.co/**',api)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':390,'height':844});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));prepare(page)
  page.goto(f'http://127.0.0.1:{server.server_port}/')
  # First visit: no sheet, the game starts at once with a local save.
  page.wait_for_function('!!window.__r?.connectionTick');assert page.locator('#mConnection').is_hidden() and page.evaluate("document.body.dataset.accountLocked")!='true'
  assert page.evaluate('__r.accountUserId') is None
  # Later, from the menu: a sign-up that asks for the code here, then the game reloads into the account.
  page.wait_for_function("!document.getElementById('mHelpC').hidden");page.locator('#hcGo').click()
  page.evaluate("()=>{const r=__r;r.S.totalLight=42;r.save();}")
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.locator('#bConnection').click();assert page.locator('#mConnection').is_visible()
  state['confirm']=True;page.locator('#accountName').fill('one@example.test');page.locator('#accountPassword').fill('fixture-password-123');page.locator('#accountRegister').click()
  page.wait_for_function("document.getElementById('connectionStatus').textContent.length>0")
  state['confirm']=False;page.locator('#accountPassword').fill('fixture-password-123');page.locator('#accountForm button[type=submit]').click()
  page.wait_for_function("window.__r?.accountUserId==='one'",timeout=15000);assert page.locator('#mConnection').is_hidden()
  assert page.evaluate('__r.S.totalLight')==42,'local progress moves into the new account'
  # Second visit: Auth answers in four seconds, but the game is already playing and the sheet never shows.
  state["slow"]=4
  page.reload()
  t0=time.time();page.wait_for_function('!!window.__r?.connectionTick',timeout=3500);assert time.time()-t0<3.5,'started before Auth answered'
  assert page.locator('#mConnection').is_hidden() and page.evaluate("document.body.dataset.accountLocked")!='true'
  page.wait_for_timeout(4500);assert page.locator('#mConnection').is_hidden(),'a slow Auth that accepts never interrupts'
  # Revoked session: the sheet comes back with the e-mail remembered, and playing without the account is allowed.
  state['slow']=0;state['identity']=401;page.reload()
  page.wait_for_function("document.body.dataset.accountLocked==='true'",timeout=15000)
  assert page.locator('#accountName').input_value()=='one@example.test' and page.evaluate("document.activeElement.id")=='accountPassword'
  assert page.locator('#accountGuest').is_visible() and page.locator('#accountGuest').inner_text()=='Jugar sin cuenta'
  page.locator('#accountGuest').click();page.wait_for_function('!!window.__r?.connectionTick');assert page.locator('#mConnection').is_hidden() and page.evaluate('__r.accountUserId') is None
  page.reload();page.wait_for_function('!!window.__r?.connectionTick');assert page.locator('#mConnection').is_hidden(),'local play is remembered'
  # Signing in again from the menu returns to the account.
  state['identity']=200;page.wait_for_timeout(500);page.locator('#hcGo').click() if page.locator('#hcGo').is_visible() else None
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.locator('#bConnection').click()
  page.locator('#accountName').fill('one@example.test');page.locator('#accountPassword').fill('fixture-password-123');page.locator('#accountForm button[type=submit]').click()
  page.wait_for_function("window.__r?.accountUserId==='one'",timeout=15000)
  assert not errors,errors;browser.close()
 print('PASS optional account: first visit plays at once without an account, sign-up from the menu reloads into it, instant start with a saved session while Auth is slow, revoked session offers the sheet or local play, local play remembered, sign-in again',flush=True)
finally:server.shutdown()
