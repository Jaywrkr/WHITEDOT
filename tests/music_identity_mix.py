"""Curated playback identities through the real scheduler, never an artistic certification."""
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
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{
   const {renderMix}=await import('/tests/audio_mix.mjs'),{MUSIC_IDENTITIES,musicIdentity}=await import('/src/musical-recipes.js');
   const r={};for(const name of ['data','progress','world']){const m=await import('/src/'+name+'.js');m.initialize(r);}
   const rows=[];for(const identity of MUSIC_IDENTITIES){const genre=identity.genres[0];let key;
    for(let i=0;i<1000;i++){const candidate='identity-audio:'+i;if(musicIdentity({key:candidate,genre},r.seedOf,r.rng,r.GEN)?.id===identity.id){key=candidate;break;}}
    if(!key)throw Error('unreachable identity '+identity.id);
    for(const dense of [false,true]){
     const out=await renderMix(genre,{identityKey:key,dense,soft:dense,influenced:dense,sampleRate:dense?44100:48000});
     if(out.identity!==identity.id)throw Error('scheduler ignored identity '+identity.id);rows.push(out);
    }
   }return rows;
  }''')
  for row in rows:assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
  assert len({row['identity'] for row in rows})==16
  report={'renders':len(rows),'maxPeak':max(row['peak'] for row in rows),'rows':rows}
  (ROOT/'scripts/m1-identity-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} native identity renders, all 16 recipes, dense/soft mixes, 44.1/48 kHz and peak {report["maxPeak"]:.6f}',flush=True)
  browser.close()
finally:server.shutdown()
