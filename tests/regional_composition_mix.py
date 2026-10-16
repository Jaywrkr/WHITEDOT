"""Representative musical grammars, stationary development and held harmony."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.route('**/src/main.js',lambda route:route.fulfill(body='',content_type='text/javascript'));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];
   for(const [i,[genre,seconds]]of [['minimaltechno',8],['garage',18],['afro',12],['nudisco',12],['ambient',18]].entries()){
    const r=await renderMix(genre,{scene:'living:breath-tree',dense:true,productionFoundation:true,sampleRate:i%2?44100:48000,renderSeconds:seconds,evolutionBar:7});
    out.push({genre,seconds,sampleRate:r.sampleRate,peak:r.peak,rmsDb:r.rmsDb,hotFraction:r.hotFraction,motif:r.labEvolution?.motif,movement:r.labEvolution?.movement,ensemble:r.electronicCount,instruments:r.instrumentHits,onsets:r.conductorOnsets.length,maxOnsetError:Math.max(...r.conductorOnsets.map(n=>n.errorSeconds)),phrasing:r.phrasing});
   }return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0 and -55<row['rmsDb']<-3,row
   assert row['motif'] and 1<=row['ensemble']<=10 and row['onsets'] and row['maxOnsetError']<.009,row
  assert len({r['motif'] for r in rows})>=3,rows
  (ROOT/'scripts/juego-03-audio-validation.json').write_text(json.dumps(rows,indent=2)+'\n')
  print('PASS 5 complete regional mixes: distinct motifs, stationary sections, held-note harmony, two sample rates, bounded density/grid/peaks',flush=True);browser.close()
finally:server.shutdown()
