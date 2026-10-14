"""A message can be read without expiring; speech gets one complete announcement."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844})
  # Isolate the actual message module from ambient encounters and achievement queues.
  bootstrap="import {initialize} from './messages.js';const r={inWorld:()=>false};initialize(r);document.getElementById('w').tabIndex=0;window.__say=r.say;"
  page.route('**/src/main.js',lambda route:route.fulfill(body=bootstrap,content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('typeof window.__say==="function"')
  assert page.locator('#voice').get_attribute('tabindex')=='-1'
  page.evaluate("__say('Una frase breve.','Guía')")
  page.wait_for_function('document.getElementById("vX").textContent==="Una frase breve."')
  assert page.locator('#voiceAnnouncement').inner_text()=='Guía · Una frase breve.'
  assert page.locator('#voice').get_attribute('aria-live') is None, 'typewriter must not announce each fragment'
  page.locator('#voice').click();assert page.locator('#voice').get_attribute('aria-expanded')=='true'
  page.wait_for_timeout(4200);assert page.locator('#voice').evaluate('e=>e.classList.contains("on")')
  page.keyboard.press('Escape');assert page.locator('#voice').get_attribute('aria-expanded')=='false'
  page.wait_for_function('!document.getElementById("voice").classList.contains("on")',timeout=6000)
  assert page.locator('#voice').get_attribute('tabindex')=='-1'
  assert page.evaluate('document.activeElement.id')=='w'
  browser.close();print('PASS message persists while reading, Escape collapses, expiry restores focus, hidden message is not tabbable, complete speech announcement',flush=True)
finally:server.shutdown()
