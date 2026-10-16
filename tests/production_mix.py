"""Every native style in the production engine, plus four genuinely seeded experimental regions."""
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
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.expose_function('__mixProgress',lambda r:print('Rendered '+str(r),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{experimentalZone}=await import('/src/expansion-music.js'),r={},genres=new Map(),experiments=new Map(),out=[];for(const id of ['data','progress','world'])(await import('/src/'+id+'.js')).initialize(r);
   for(let x=-35;x<=35;x++)for(let y=-35;y<=35;y++){const p={x:(x+.5)*3600,y:(y+.5)*3600},d=r.regionOfPos(p.x,p.y);if(d.sea)continue;if(!genres.has(d.genre))genres.set(d.genre,p);const e=experimentalZone(d,r.BIOMES[d.z].id,r.seedOf,r.rng);if(e.level>=.7&&!experiments.has(e.mode))experiments.set(e.mode,{point:p,genre:d.genre});}
   if(genres.size!==52||experiments.size!==4)throw Error('Incomplete production fixtures');
   const summary=r=>({genre:r.genre,peak:r.fullPeak,rmsDb:r.rmsDb,count:r.electronicCount,instruments:r.instrumentHits,notes:r.experimentalNotes,production:r.productionIdentity});
   for(const [genre,point]of genres)out.push({...summary(await renderMix(genre,{productionFoundation:true,worldPoint:point,renderSeconds:10,sampleRate:out.length%2?44100:48000})),type:'native'});
   for(const [mode,{point,genre}]of experiments)out.push({...summary(await renderMix(genre,{productionFoundation:true,worldPoint:point,scene:'production-experimental',renderSeconds:20,evolutionBar:4})),type:mode});return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and -50<row['rmsDb']<-3 and row['instruments'],row
   if row['type']!='native':
    assert row['notes'] and all(n['mode']==row['type'] for n in row['notes']),row
    assert all(n['note'] is None or any((n['note']-t)%12==0 for t in n['tones']) for n in row['notes']),row
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows}
  (ROOT/'scripts/musica-07-production-audio.json').write_text(json.dumps(report,indent=2)+'\n')
  print('PASS 52 actual native production styles and four seeded experimental regions: audible starts, chord-bound color and protected startup/output')
  browser.close()
finally:server.shutdown()
