"""Both finales follow width, height and pixel density without losing their exit."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.openSong')
  p.evaluate("()=>{const r=__r;r.S.sound=false;r.S.journey.finished=true;r.setJourneyMode('libre');r.placesData().stars.llanura=[true,false,false];document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);r.openSong();}")
  for w,h in [(390,700),(390,600),(844,390),(320,568)]:
   p.set_viewport_size({'width':w,'height':h});p.wait_for_function('(d)=>{const c=document.querySelector("#songStage canvas");return c.width===Math.round(d[0]*Math.min(2,devicePixelRatio))&&c.height===Math.round(d[1]*Math.min(2,devicePixelRatio))}',arg=[w,h]);assert p.locator('#songClose').is_visible()
  p.evaluate("()=>{const r=__r;r.closeSong();r.S.journey.finished=false;r.S.journey.notes={llanura:[60,62,64]};r.journeyFinale();}")
  for w,h in [(320,500),(390,700),(390,600)]:
   p.set_viewport_size({'width':w,'height':h});p.wait_for_function('(d)=>{const c=document.querySelector("#journeyFinale canvas");return c.width===Math.round(d[0]*Math.min(2,devicePixelRatio))&&c.height===Math.round(d[1]*Math.min(2,devicePixelRatio))}',arg=[w,h])
  p.keyboard.press('Escape');p.wait_for_function('document.getElementById("journeyFinale").hidden');assert not errors,errors;b.close()
 print('PASS final5/final11 vertical-only resize, rotation, small screen and actual Escape exit',flush=True)
finally:srv.shutdown();srv.server_close()
