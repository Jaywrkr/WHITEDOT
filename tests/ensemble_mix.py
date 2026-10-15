"""Actual sparse and rich ensembles: complementary middle voices, shared harmony and protected output."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{labScore}=await import('/src/lab-score.js'),{initialize:data}=await import('/src/data.js'),{initialize:progress}=await import('/src/progress.js'),{initialize:world}=await import('/src/world.js'),r={};data(r);progress(r);world(r);const origin=r.regionOfPos(900,900),out=[];
   for(const genre of ['deep','nudisco','organic','robotic','dnb'])for(const size of [1,3]){let key;for(let i=0;i<1600;i++){const k=(i%40-20)+','+(Math.floor(i/40)-20),score=labScore({...origin,key:k,genre},r.seedOf,r.rng);if(size===1?score.ensemble===1:score.electronic.count===10){key=k;break;}}if(!key)throw Error('No ensemble fixture: '+genre);const result=await renderMix(genre,{livingMusic:true,dense:false,identityKey:key,renderSeconds:10});result.ensemble=size;out.push(result);}
   let soloKey;for(let i=0;i<1600;i++){const key=(i%40-20)+','+(Math.floor(i/40)-20);if(labScore({...origin,key,genre:'ambient'},r.seedOf,r.rng).electronic.count===1){soloKey=key;break;}}if(!soloKey)throw Error('No solo fixture');const solo=await renderMix('ambient',{livingMusic:true,dense:false,identityKey:soloKey,renderSeconds:10});solo.ensemble=0;out.push(solo);return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
   answers=[n for n in row['labPerformance'] if n.get('part')=='answer']
   if row['ensemble']==3:
    assert row['electronicCount']==10 and len(row['instrumentHits'])>=10,{'genre':row['genre'],'instruments':row['instrumentHits'],'count':row.get('electronicCount')}
    assert answers,{'message':'richer arrival must actually emit its complementary instrument','genre':row['genre'],'events':row['labPerformance']}
    assert any(n.get('part')=='comp' for n in row['labPerformance']),'richer arrival must actually emit harmony'
   else:
    assert not answers,'sparse ensembles must retain their space'
    if row['ensemble']==0:assert row['electronicCount']==1 and len(row['instrumentHits'])==1,row['instrumentHits']
  # Preserve compact acoustic evidence, rather than thousands of duplicated scheduler events.
  summaries=[{k:r[k] for k in ['genre','ensemble','electronicCount','electronicLayers','identity','hookI','peak','rmsDb','hotFraction','sampleRate']}|{'addedParts':[n for n in r['labPerformance'] if n.get('part')],'instruments':r['instrumentHits']} for r in rows]
  (ROOT/'scripts/pulido-05-ensemble-audio.json').write_text(json.dumps({'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':summaries},indent=2)+'\n')
  print('PASS eleven actual solo/sparse/full ensembles, including fast drum and bass, ten audible instruments and protected peaks',flush=True);b.close()
finally:server.shutdown()
