"""Browser regression with mocked Auth only; never sends mail."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,json,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
calls=[]
def auth(route):
 req=route.request
 if req.method=='OPTIONS':route.fulfill(status=200,headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'GET,PUT,POST'});return
 calls.append((req.method,req.post_data))
 assert page.evaluate('location.hash')==''
 route.fulfill(status=200,body=json.dumps({'id':'fixture-user'}),content_type='application/json',headers={'Access-Control-Allow-Origin':'*'})
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox']);page=browser.new_page(viewport={'width':390,'height':844});page.route('https://*.supabase.co/**',auth)
  url=f'http://127.0.0.1:{server.server_port}/recovery.html'
  page.goto(url+'#error=expired');page.wait_for_function("document.getElementById('status').textContent.includes('vencido')");assert page.locator('form').is_hidden();assert not calls
  page.goto('about:blank')
  page.goto(url+'#type=recovery&access_token=fixture-private&refresh_token=fixture-refresh');page.locator('form').wait_for(state='visible');assert page.evaluate('location.hash')==''
  page.locator('[name=password]').fill('private-fixture-password');page.locator('[name=confirmation]').fill('different-fixture-password');page.locator('button').click();page.wait_for_function("document.getElementById('status').textContent.includes('misma clave')");assert len(calls)==1
  page.locator('[name=confirmation]').fill('private-fixture-password');page.locator('button').click();page.wait_for_function("document.getElementById('status').textContent.includes('Clave actualizada')");assert page.locator('form').is_hidden()
  assert [method for method,_ in calls]==['GET','PUT','POST'];assert json.loads(calls[1][1])=={'password':'private-fixture-password'}
  assert page.evaluate('localStorage.length+sessionStorage.length')==0
  assert page.locator('body').evaluate('e=>e.scrollWidth<=innerWidth')
  page.reload();page.wait_for_function("document.getElementById('status').textContent.includes('vencido')");assert page.locator('form').is_hidden();assert len(calls)==3
  page.goto('about:blank');page.goto(url+'#type=signup&access_token=fixture-confirmed');page.wait_for_function("document.getElementById('status').textContent.includes('Vuelve a Kubono')");assert page.locator('form').is_hidden();assert page.evaluate('location.hash')=='';assert [method for method,_ in calls]==['GET','PUT','POST','GET'];assert page.evaluate('localStorage.length+sessionStorage.length')==0
  browser.close()
 print('PASS recovery browser: cleared URL before Auth, invalid link, mismatch, password update, no storage, reload, mobile fit')
finally:server.shutdown();server.server_close()
