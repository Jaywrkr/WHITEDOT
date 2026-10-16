"""Production overrides legacy preferences, field focus and experimental suppression."""
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
  page=browser.new_page();page.expose_function('__mixProgress',lambda r:print('Rendered '+str(r),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{labScore}=await import('/src/lab-score.js'),{initialize:data}=await import('/src/data.js'),{initialize:progress}=await import('/src/progress.js'),{initialize:world}=await import('/src/world.js'),r={};data(r);progress(r);world(r);const origin=r.regionOfPos(900,900),out=[];let fullKey;
   for(const genre of ['deep','dnb','ambient']){let identityKey;for(let i=0;i<1600;i++){const key=(i%40-20)+','+(Math.floor(i/40)-20),band=labScore({...origin,key,genre},r.seedOf,r.rng);if(band.electronic.count===(genre==='ambient'?1:10)){identityKey=key;break;}}if(!identityKey)throw Error('No production fixture');
    if(genre==='deep')fullKey=identityKey;
    for(const focused of [false,true]){const row=await renderMix(genre,{identityKey,productionFoundation:true,livingMusic:false,fieldMode:focused,experimentalAmount:focused?.95:0,renderSeconds:10});out.push({genre,focused,peak:row.peak,rmsDb:row.rmsDb,hotFraction:row.hotFraction,count:row.electronicCount,instruments:row.instrumentHits});}
   }const dense=await renderMix('deep',{identityKey:fullKey,productionFoundation:true,livingMusic:false,dense:true,experimentalAmount:.95});out.push({genre:'deep',dense:true,focused:false,peak:dense.peak,rmsDb:dense.rmsDb,hotFraction:dense.hotFraction,count:dense.electronicCount,instruments:dense.instrumentHits,onsets:dense.conductorOnsets});return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
   if row['genre']=='ambient':assert row['count']==1 and len(row['instruments'])==1,row
   else:
    assert row['count']==10 and len(row['instruments'])>=10,row
    assert row['instruments'].get('kick',0)>0 and any(row['instruments'].get(k,0)>0 for k in ['clap','snare']),row
  assert rows[-1]['onsets'] and max(n['errorSeconds'] for n in rows[-1]['onsets'])<.01,rows[-1]
  for a,b in zip(rows[:6:2],rows[1:6:2]):assert b['rmsDb']<a['rmsDb']-.1,'field attenuates, but retains the composed foundation'
  (ROOT/'scripts/musica-01-foundation-audio.json').write_text(json.dumps({'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows},indent=2)+'\n')
  print('PASS seven actual production renders: legacy false cannot disable music; field and experimental areas keep solo/full foundations and drums')
  browser.close()
finally:server.shutdown()
