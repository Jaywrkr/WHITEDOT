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
   const {renderMix}=await import('/tests/audio_mix.mjs'),r={},found=new Map(),out=[];
   for(const id of ['data','progress','world'])(await import('/src/'+id+'.js')).initialize(r);
   for(let x=-24;x<=24;x++)for(let y=-24;y<=24;y++){const point={x:(x+.5)*3600,y:(y+.5)*3600},d=r.regionOfPos(point.x,point.y);if(!d.sea&&!found.has(d.genre))found.set(d.genre,point);}
   if(found.size!==52)throw Error('Missing native genres');
   for(const [genre,point]of found)out.push(await renderMix(genre,{worldPoint:point,livingMusic:true,dense:true,soft:out.length%2===1,sampleRate:out.length%2===1?44100:48000,renderSeconds:6}));return out;
  }''')
  for row in rows:assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows}
  (ROOT/'scripts/lab-genres-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} native live genre mixes at 44.1/48 kHz, dense/soft, finite signal and headroom',flush=True);b.close()
finally:server.shutdown()
