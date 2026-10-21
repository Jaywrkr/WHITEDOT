"""Ajustes: graphics quality (automatic switch fed a slow sample, manual light and high, kept after reload) and the local error diagnosis."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2);ctx.grant_permissions(['clipboard-read','clipboard-write'])
  page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.qualityProbe')
  page.evaluate("()=>{document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);localStorage.removeItem('kubono:errores');}")
  assert page.evaluate("document.getElementById('w').width")==780,'high quality draws at 2x'
  # Automatic: one slow sample is not enough, two in a row switch to light; a fast device never switches.
  assert page.evaluate("__r.qualityProbe(Array(90).fill(16.7))")==False
  assert page.evaluate("__r.qualityProbe(Array(90).fill(33))")==False and page.evaluate("__r.qualityProbe(Array(90).fill(33))")==True
  assert page.evaluate("document.getElementById('w').width")==390,'light quality draws at 1x'
  # Manual choice wins and is kept.
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.locator('#bSettings').click();assert 'ligera' in page.locator('#graphicsQualityHint').inner_text()
  page.locator('#graphicsQuality').select_option('alta');assert page.evaluate("document.getElementById('w').width")==780
  page.locator('#graphicsQuality').select_option('ligera');assert page.evaluate("document.getElementById('w').width")==390
  # Diagnosis: an uncaught error is kept on the device and copied on request.
  page.evaluate("setTimeout(()=>{throw new Error('prueba de diagnóstico')},0)");page.wait_for_timeout(200);errors.clear()
  log=page.evaluate('__r.errorLog()');assert log[-1]['message'].endswith('prueba de diagnóstico'),log
  page.locator('#settingsClose').click();page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.locator('#bSettings').click()
  assert page.locator('#diagnosticInfo').inner_text()=='1 error registrado en este dispositivo.'
  page.locator('#diagnosticCopy').click();page.wait_for_function("document.getElementById('diagnosticInfo').textContent==='Diagnóstico copiado.'")
  assert 'prueba de diagnóstico' in page.evaluate('navigator.clipboard.readText()')
  page.screenshot(path='/tmp/kubono-ajustes.png')
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.qualityProbe')
  assert page.evaluate('__r.S.quality')=='ligera' and page.evaluate("document.getElementById('w').width")==390,'kept after reload'
  assert not errors,errors;browser.close()
 print('PASS graphics quality automatic/light/high at 1x and 2x, kept after reload; local error diagnosis recorded, shown and copied',flush=True)
finally:server.shutdown()
