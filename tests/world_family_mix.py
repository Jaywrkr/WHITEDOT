"""Eight actual landscape destinations through the real scheduler and living voices."""
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
  page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True))
  page.goto(f'http://127.0.0.1:{server.server_port}/')
  report=page.evaluate('''async()=>{
   const {renderMix}=await import('/tests/audio_mix.mjs'),{WORLD_FAMILIES}=await import('/src/world-families.js');
   const r={};for(const name of ['data','progress','world']){const m=await import('/src/'+name+'.js');m.initialize(r);}
   const places=new Map(),R=r.REG*r.WCH;
   for(let x=-22;x<=22;x++)for(let y=-22;y<=22;y++){
    const d=r.regionOfPos((x+.5)*R,(y+.5)*R);if(!d.sea&&!places.has(d.worldFamily.id))places.set(d.worldFamily.id,{x:(x+.5)*R,y:(y+.5)*R,genre:d.genre});
   }
   const rows=[];for(const family of WORLD_FAMILIES){const point=places.get(family.id);if(!point)throw Error('missing family '+family.id);
    for(const dense of [false,true]){
     const out=await renderMix(point.genre,{worldPoint:point,dense,soft:dense,sampleRate:dense?44100:48000,scene:dense?'living:'+family.fauna[0]:null});
     if(out.worldFamily!==family.id)throw Error('scheduler lost landscape DNA');
     if(dense&&!Object.keys(out.instrumentHits).some(k=>k.startsWith('living:')))throw Error('living interaction did not sound');
     rows.push({...out,point});
    }
   }return {renders:rows.length,maxPeak:Math.max(...rows.map(r=>r.peak)),rows};
  }''')
  assert report['renders']==16
  for row in report['rows']:assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
  assert len({row['worldFamily'] for row in report['rows']})==8
  assert len({(row['hookI'],row['brightness']) for row in report['rows']})>=6
  (ROOT/'scripts/f1-world-family-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {report["renders"]} real landscape renders, eight audible families, actual creature responses, dense/soft and 44.1/48 kHz, peak {report["maxPeak"]:.6f}',flush=True)
  b.close()
finally:server.shutdown()
