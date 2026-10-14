"""Original synth families and sixteen moving filters in real dense mixes."""
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
  page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate("""async()=>{
   const {renderMix}=await import('/tests/audio_mix.mjs'),{SYNTH_PROGRAMS}=await import('/src/synth-colors.js'),rows=[];
   const families=['analogpad','phasekeys','fmglass','choir','resonantpluck','velvetbass','granularair','orbitorgan'];
   for(const [i,id]of families.entries())for(const soft of [false,true])rows.push(await renderMix(['ambient','deep','electro','organic'][i%4],{scene:'synth:'+id,dense:true,soft,sampleRate:soft?44100:48000}));
   for(const [i,p]of SYNTH_PROGRAMS.entries())rows.push(await renderMix(['deep','ambient','electro','organic'][i%4],{scene:'filter:'+p.id,dense:true,soft:i%2===1,sampleRate:i%2===1?44100:48000}));
   return rows;
  }""")
  for r in rows:
   assert 0<r['peak']<.96 and r['hotFraction']==0 and -65<r['rmsDb']<-3,r
   assert sum(n for k,n in r['instrumentHits'].items() if k.startswith('living:'))>0,r
   assert r['filterMotion'] and r['filterMotion']['start']!=r['filterMotion']['end'],r
   assert r['deferredDisconnects']>0,'offline graph discarded scheduled filters before rendering'
   if r['scene'].startswith('synth:'):assert r['instrumentHits'].get(r['scene'][6:],0)>0,r
  slopes={r['filterMotion']['slope'] for r in rows if r['scene'].startswith('filter:')}
  assert {12,24,36,48}.issubset(slopes),slopes
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows}
  (ROOT/'scripts/m1-synth-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} dense renders: eight native synth families, sixteen moving filters, actual contact, 44.1/48 kHz and peak {report["maxPeak"]:.6f}',flush=True)
  b.close()
finally:server.shutdown()
