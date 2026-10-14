"""A foreign seed/layer address opens at its saved coordinates without altering its source save."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=source-place&layout=wide&generation=2');page.wait_for_function('__testRuntime?.inWorld()');source=page.evaluate('__testRuntime.saveStore.key')
  page.evaluate('async()=>{const {worldIdentity,placeAddress}=await import("/src/world-identity.js"),r=__testRuntime;r.S.returnMarker="kept";r.save();r.visitWorldAddress(placeAddress(worldIdentity("other-place","immense",2),-12345,67890,"cielo"));}')
  page.wait_for_url('**testSeed=other-place**');page.wait_for_function('__testRuntime?.S.wx===-12345&&__testRuntime.S.wy===67890&&__testRuntime.S.layer==="cielo"');assert page.evaluate('(key)=>JSON.parse(localStorage.getItem(key)).returnMarker',source)=='kept';assert page.evaluate('__testRuntime.worldIdentity.layout')=='immense';print('PASS foreign seed/version/layer return code restores exact point and preserves the departed save');browser.close()
finally:server.shutdown()
