"""Compare actual territorial arrangements with the original mix at native addresses."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{
   const {renderMix}=await import('/tests/audio_mix.mjs'),{labScore,LAB_BANDS}=await import('/src/lab-score.js'),r={},found=new Map(),out=[];
   for(const id of ['data','progress','world'])(await import('/src/'+id+'.js')).initialize(r);
   for(let x=-18;x<=18;x++)for(let y=-18;y<=18;y++){
    const point={x:(x+.5)*3600,y:(y+.5)*3600},region=r.regionOfPos(point.x,point.y),score=labScore(region,r.seedOf,r.rng);
    if(score&&!found.has(score.id))found.set(score.id,{point,genre:region.genre});
   }
   if(found.size!==LAB_BANDS.length)throw Error('Missing musical territories');
   for(const [id,{point,genre}]of found)for(const soft of [false,true]){
    const row=await renderMix(genre,{worldPoint:point,livingMusic:true,dense:true,soft,sampleRate:soft?44100:48000,renderSeconds:6});
    if(row.labBand!==id)throw Error('Scheduler did not play the territory band');out.push(row);
   }return out;
  }''')
  for row in rows:assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows}
  (ROOT/'scripts/lab-music-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} live territorial mixes at 44.1/48 kHz, dense/soft, finite signal and headroom',flush=True);b.close()
finally:server.shutdown()
