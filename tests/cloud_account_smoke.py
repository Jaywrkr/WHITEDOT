"""Real browser journey against an intercepted Supabase REST fixture, not a hosted acceptance test."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,json,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
remote={};requests=[];online=True
config="export const CLOUD_CONFIG={url:'https://fixture.supabase.co',publishableKey:'sb_publishable_fixture'};"
def api(route):
 req=route.request;path=req.url.split('.co')[1];requests.append(path)
 if not online:route.abort('internetdisconnected');return
 body=req.post_data_json if req.post_data else {};data={};status=200
 if '/signup' in path:data={'user':{'id':'fixture-user'}}
 elif '/token?' in path or '/verify' in path:data={'access_token':'fixture-token','refresh_token':'fixture-refresh','expires_in':3600,'user':{'id':'fixture-user','email':'test@example.test'}}
 elif '/kubono_saves?' in path:data=[remote] if remote else []
 elif '/rpc/kubono_save' in path:
  if body['p_revision']!=remote.get('revision',0):data={'ok':False}
  else:
   remote.update(state=body['p_state'],revision=remote.get('revision',0)+1);data={'ok':True,'revision':remote['revision']}
 elif '/rpc/kubono_delete_account' in path:remote.clear()
 route.fulfill(status=status,body=json.dumps(data),content_type='application/json',headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'})
def prepare(page,configured=True):
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 if configured:page.route('**/src/cloud-config.js',lambda r:r.fulfill(body=config,content_type='text/javascript'));page.route('https://fixture.supabase.co/**',api)
 page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.connectionTick')
 page.locator('#returnContinue').click()
 if page.locator('#hcGo').is_visible():page.locator('#hcGo').click()
 page.evaluate('__r.S.sound=false');page.locator('#bMenu').click();page.locator('#bConnection').click()
def credentials(page):
 page.locator('#accountName').fill('test@example.test');page.locator('#accountPassword').fill('fixture-password-123')
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox']);context=browser.new_context(viewport={'width':390,'height':844},service_workers='block');page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));prepare(page,False)
  assert 'no configurada' in page.locator('#connectionStatus').inner_text();assert page.locator('#connectionRooms').is_hidden();assert page.locator('#accountRegister').is_disabled();assert page.evaluate('__r.save()');assert not requests
  page.close();context.close();context=browser.new_context(viewport={'width':390,'height':844},service_workers='block');page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept());prepare(page);credentials(page)
  page.locator('#accountRegister').click();page.wait_for_function("document.getElementById('connectionStatus').textContent.includes('código de confirmación')");assert page.locator('#cloudPush').is_disabled();assert page.locator('#accountPassword').input_value()==''
  page.locator('#accountCode').fill('123456');page.locator('#accountVerify').click();page.wait_for_function("!document.getElementById('cloudPush').disabled");page.evaluate('()=>{__r.S.sparks=42;__r.save()}');page.locator('#cloudPush').click();page.wait_for_function("document.getElementById('connectionStatus').textContent==='Respaldo online guardado.'");assert remote['state']['sparks']==42
  page.evaluate('()=>{__r.S.sparks=55;__r.save();const old=Date.now;Date.now=()=>old()+61000}');page.wait_for_function("document.getElementById('connectionStatus').textContent==='Respaldo online guardado.'");page.wait_for_timeout(1500);assert remote['state']['sparks']==55
  # A newer remote copy must never be silently overwritten.
  remote['revision']+=1;remote['state']['sparks']=70;page.evaluate('()=>{__r.S.sparks=60;__r.save();const old=Date.now;Date.now=()=>old()+61000}');page.wait_for_function("document.getElementById('connectionStatus').textContent.includes('copia online cambió')");assert remote['state']['sparks']==70;assert page.evaluate('__r.S.sparks')==60
  page.locator('#cloudPull').click();page.wait_for_function('__r.S.sparks===70');assert page.evaluate("!!localStorage.getItem(__r.saveStore.key+':before-restore')")
  # Offline errors retain the local state and do not disable gameplay.
  online=False;page.evaluate('()=>{__r.S.sparks=80;__r.save()}');page.locator('#cloudPush').click();page.wait_for_function("document.getElementById('connectionStatus').textContent.includes('Sin conexión')");assert page.evaluate('__r.S.sparks')==80;assert remote['state']['sparks']==70;online=True
  page.reload();page.wait_for_function('!!window.__r?.connectionTick');assert page.evaluate('__r.S.sparks')==80
  page.locator('#returnContinue').click();page.locator('#bMenu').click();page.locator('#bConnection').click();page.wait_for_function("!document.getElementById('accountLogout').disabled")
  page.locator('#accountLogout').click();page.wait_for_function("document.getElementById('accountState').textContent.includes('sin cuenta')");credentials(page);page.locator('#accountRecover').click();page.wait_for_function("document.getElementById('connectionStatus').textContent.includes('recuperar el acceso')");page.locator('#accountCode').fill('654321');page.locator('#accountVerifyRecovery').click();page.wait_for_function("!document.getElementById('accountUpdatePassword').disabled");page.locator('#accountNewPassword').fill('fixture-new-password');page.locator('#accountUpdatePassword').click();page.wait_for_function("!document.getElementById('cloudPush').disabled")
  assert page.locator('#connectionRooms').is_hidden();assert not any('/rooms' in p for p in requests);assert not errors,errors
  assert page.locator('#mConnection .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2')
  page.screenshot(path=str(ROOT.parent/'cloud-account-mobile.png'));browser.close()
 print('PASS browser: optional/unconfigured offline play, signup verification, minute backup, conflict, restore with local backup, offline/reload, sign-out/password recovery, no rooms; Supabase HTTP fixture only')
finally:server.shutdown();server.server_close()
