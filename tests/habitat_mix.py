"""Exercise the actual ecological actor clock together with musical replies."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.expose_function('__mixProgress',lambda r:print('Rendered '+str(r),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const [i,kind]of ['breath-tree','moss','deer','moth','turtle','crab'].entries())out.push(await renderMix(['ambient','deep','organic'][i%3],{scene:'living:'+kind,actorEcology:true,renderSeconds:6,dense:true,soft:i%2===1,sampleRate:i%2===1?44100:48000}));return out;}''')
  for r in rows:assert 0<r['peak']<.96 and r['hotFraction']==0 and r['actorSeconds']>4 and r['actorIntent'] and r['ecologyPhase'] in [0,1,2,3],r
  (ROOT/'scripts/cierre-f3-habitat-audio-validation.json').write_text(json.dumps({'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows},indent=2)+'\n')
  print('PASS six live ecological actor clocks and real replies, dense mixes and 44.1/48 kHz',flush=True);b.close()
finally:server.shutdown()
