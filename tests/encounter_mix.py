"""Final encounter-only audio recheck after regional roles and individual accents."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  results=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{FAMILIES}=await import('/src/encounter-families.js');const out=[];for(const encounter of Object.keys(FAMILIES))out.push(await renderMix(['tropical','dub','nudisco','amapiano'][out.length%4],{dense:true,influenced:true,encounter}));return out;}''')
  for result in results:assert 0<result['peak']<.96 and result['hotFraction']==0,result
  print(json.dumps(results,indent=2),flush=True);print('PASS final dense encounter render for all ten families',flush=True)
  b.close()
finally:server.shutdown()
