"""Real scheduler plus new living synthesis, at both mobile sample rates."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,json,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  results=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{LIVING_CATALOG}=await import('/src/living-catalog.js'),out=[];for(const [i,d]of LIVING_CATALOG.entries())out.push(await renderMix(['minimaltechno','deep','afro','ambient','dnb','nudisco'][i%6],{scene:'living:'+d.id,dense:true,soft:i%2===1,sampleRate:i%2===1?44100:48000}));return out;}''')
  for r in results:assert 0<r['peak']<.96 and r['hotFraction']==0 and sum(n for k,n in r['instrumentHits'].items() if k.startswith('living:'))>0,r
  report={'renders':len(results),'maxPeak':max(r['peak'] for r in results),'sampleRates':sorted(set(r['sampleRate'] for r in results)),'rows':results};(ROOT/'scripts/living-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(results)} living species/structures with actual dense scheduler, audible native notes, 44.1/48 kHz and peak {report["maxPeak"]:.6f}',flush=True);browser.close()
finally:server.shutdown()
