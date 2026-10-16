"""Focused real-engine renders for the consolidation cycle."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
PHASE=int(os.environ.get('WHITEDOT_IMPROVEMENT_PHASE','1'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.route('**/src/main.js',lambda route:route.fulfill(body='',content_type='text/javascript'));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async phase=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];
   for(const [i,[genre,seconds]]of (phase===1?[['minimaltechno',8],['garage',10],['afro',8]]:phase===3?[['minimaltechno',10],['garage',10],['ambient',12]]:[['minimaltechno',8],['garage',10],['ambient',12],['nudisco',8]]).entries()){
    const r=await renderMix(genre,{scene:phase===3?'micro:'+['drum','arp','poly'][i]:'living:breath-tree',heldMicro:phase===3,dense:true,productionFoundation:true,sampleRate:i%2?44100:48000,renderSeconds:seconds,evolutionBar:phase===1?96:7});
    out.push({genre,seconds,sampleRate:r.sampleRate,peak:r.peak,rmsDb:r.rmsDb,hotFraction:r.hotFraction,motif:r.labEvolution?.motif,movement:r.labEvolution?.movement,ensemble:r.electronicCount,backbone:r.restoredBackbone,microNotes:r.microNotes,instruments:r.instrumentHits,onsets:r.conductorOnsets.length,maxOnsetError:Math.max(...r.conductorOnsets.map(n=>n.errorSeconds)),phrasing:r.phrasing});
   }return out;}''',PHASE)
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0 and -55<row['rmsDb']<-3,row
   assert row['backbone'] and row['backbone']['hookI'] and row['motif'] and 1<=row['ensemble']<=10 and row['onsets'] and row['maxOnsetError']<.009,row
  assert len({r['motif'] for r in rows})>=3,rows
  if PHASE==3:
   assert all(r['microNotes'] for r in rows),rows
   assert {'kick','snare','hat'} <= {n['instrument'] for n in rows[0]['microNotes']},rows[0]
  (ROOT/f'scripts/mejora-{PHASE:02}-audio-validation.json').write_text(json.dumps(rows,indent=2)+'\n')
  print('PASS focused production mixes: recovered lead, contemporary ensemble, synchronized interactions and protected output',flush=True);browser.close()
finally:server.shutdown()
