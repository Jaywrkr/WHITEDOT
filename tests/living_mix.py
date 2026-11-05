"""Real scheduler plus new living synthesis, at both mobile sample rates.
The catalogue renders in two halves (this file, the first; living_b_mix.py, the second), each in its own flow and
under its own time limit: together, about ten minutes, outgrew one flow's limit on a slow runner. Every render stays;
each half writes its rows into the same report."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,json,os,sys
# Which half: 0 (the default) or 1, given by living_b_mix.py.
PART=int(sys.argv[1]) if len(sys.argv)>1 else 0
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  results=page.evaluate('''async part=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{LIVING_CATALOG}=await import('/src/living-catalog.js'),out=[];const half=Math.ceil(LIVING_CATALOG.length/2);for(const [i,d]of LIVING_CATALOG.entries()){if((i<half?0:1)!==part)continue;out.push(await renderMix(['minimaltechno','deep','afro','ambient','dnb','nudisco'][i%6],{scene:'living:'+d.id,dense:true,soft:i%2===1,sampleRate:i%2===1?44100:48000}));}return {out,total:LIVING_CATALOG.length,half};}''',PART)
  total,half,results=results['total'],results['half'],results['out'];assert len(results)==(half if PART==0 else total-half),len(results)
  for r in results:assert 0<r['peak']<.96 and r['hotFraction']==0 and sum(n for k,n in r['instrumentHits'].items() if k.startswith('living:'))>0,r
  # Keep the other half's rows when the report already holds the whole catalogue in order.
  path=ROOT/'scripts/living-audio-validation.json'
  try:rows=json.loads(path.read_text())['rows']
  except Exception:rows=[]
  if len(rows)!=total:rows=[None]*total
  rows[(0 if PART==0 else half):(half if PART==0 else total)]=results;done=[r for r in rows if r]
  report={'renders':len(done),'maxPeak':max(r['peak'] for r in done),'sampleRates':sorted(set(r['sampleRate'] for r in done)),'rows':rows if len(done)==total else done};path.write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(results)} living (half {PART+1} of 2) species/structures with actual dense scheduler, audible native notes, 44.1/48 kHz and peak {report["maxPeak"]:.6f}',flush=True);browser.close()
finally:server.shutdown()
