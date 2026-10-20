"""Deletion UI uses intercepted Auth/REST only; never deletes a hosted account."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,json,time,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
wallet=None;deleted=False;deletes=0
session={'access_token':'delete-fixture','refresh_token':'delete-refresh','expires_in':3600,'expires_at':int(time.time()*1000)+3600000,'user':{'id':'disposable','email':'disposable@example.test'}}
def api(route):
 global wallet,deleted,deletes
 req=route.request;url=req.url;body=req.post_data_json if req.post_data else {};data={};status=200
 if '/auth/v1/user' in url:
  data=session['user'];status=401 if deleted else 200
 elif '/token?' in url:data=session
 elif '/kubono_saves?' in url:data=[wallet] if wallet else []
 elif '/rpc/kubono_save' in url:wallet={'state':body['p_state'],'revision':body['p_revision']+1};data={'ok':True,'revision':wallet['revision']}
 elif '/rpc/kubono_delete_account' in url:deleted=True;deletes+=1;wallet=None
 route.fulfill(status=status,body=json.dumps(data),content_type='application/json',headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'})
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox']);page=browser.new_page(viewport={'width':390,'height':844},service_workers='block')
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.route('**/src/cloud-config.js',lambda r:r.fulfill(body="export const CLOUD_CONFIG={url:'https://fixture.supabase.co',publishableKey:'sb_publishable_fixture'};",content_type='text/javascript'))
  page.route('https://fixture.supabase.co/**',api)
  # An unowned legacy save and another account's keys must survive; only the deleted account's copies go.
  page.add_init_script("localStorage.setItem('other-account-sentinel','untouched');localStorage.setItem('kubono:user:someone-else:pixel-blanco-v4','{\"sparks\":9}');if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','yes');localStorage.setItem('pixel-blanco-v4','{\"sparks\":24,\"mode\":\"camino\"}');localStorage.setItem('kubono:auth:https://fixture.supabase.co',"+json.dumps(json.dumps(session))+");}")
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.connectionTick');page.locator('#returnContinue').click()
  if page.locator('#hcGo').is_visible():page.locator('#hcGo').click()
  page.evaluate("()=>{__r.S.sparks=3;__r.save();dispatchEvent(new Event('focus'));}")
  deadline=time.monotonic()+15
  while (not wallet or wallet['state']['sparks']!=3) and time.monotonic()<deadline:page.wait_for_timeout(100)
  assert wallet['state']['sparks']==3
  page.locator('#bMenu').click();page.locator('#bConnection').click();page.wait_for_function("!document.getElementById('accountDelete').disabled")
  page.locator('#accountName').fill('disposable@example.test');page.locator('#accountPassword').fill('fixture-password-123')
  page.once('dialog',lambda d:d.dismiss());page.locator('#accountDelete').click();assert deletes==0 and wallet
  page.once('dialog',lambda d:d.accept());page.locator('#accountDelete').click();page.wait_for_function("document.body.dataset.accountLocked==='true'&&typeof window.__r==='undefined'")
  assert deleted and deletes==1 and wallet is None
  assert page.evaluate('typeof window.__r')=='undefined';assert page.locator('#accountGuest').is_hidden()
  assert page.evaluate("localStorage.getItem('kubono:auth:https://fixture.supabase.co')") is None
  assert page.evaluate("localStorage.getItem('other-account-sentinel')")=='untouched'
  assert page.evaluate("Object.keys(localStorage).filter(k=>k.includes(':disposable:'))")==[]
  assert page.evaluate("JSON.parse(localStorage.getItem('pixel-blanco-v4')).sparks")==24
  assert page.evaluate("localStorage.getItem('kubono:user:someone-else:pixel-blanco-v4')")=='{"sparks":9}'
  browser.close()
 print('PASS deletion UI: cancellation, confirmed reauthentication/RPC, cleared login, local purge limited to the deleted account and return to gate; fixture only, hosted account untouched')
finally:server.shutdown();server.server_close()
