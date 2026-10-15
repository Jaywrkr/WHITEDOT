"""Render each compatible influence at an actual native world address."""
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
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{hybridIdentity}=await import('/src/musical-hybrids.js'),r={},out=[],found=new Map();
   for(const id of ['data','progress','world'])(await import('/src/'+id+'.js')).initialize(r);
   for(let x=-28;x<=28;x++)for(let y=-28;y<=28;y++){const point={x:(x+.5)*3600,y:(y+.5)*3600},d=r.regionOfPos(point.x,point.y),h=hybridIdentity(d,r.seedOf,r.rng);if(h&&!found.has(h.id))found.set(h.id,{point,genre:d.genre});}
   if(found.size!==16)throw Error('Missing actual influence destinations');
   for(const [id,{point,genre}]of found){const row=await renderMix(genre,{worldPoint:point,dense:true,soft:out.length%2===0,sampleRate:out.length%2?44100:48000,renderSeconds:6});if(row.hybrid!==id)throw Error('Wrong composition '+id);out.push(row);}return out;
  }''')
  for r in rows:assert 0<r['peak']<.96 and r['hotFraction']==0 and -65<r['rmsDb']<-3,r
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows};(ROOT/'scripts/hybrid-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} real-world hybrid renders, dense/soft, 44.1/48 kHz, peak {report["maxPeak"]:.6f}',flush=True);b.close()
finally:server.shutdown()
