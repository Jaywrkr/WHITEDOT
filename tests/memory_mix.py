"""Saved cable graphs reach the actual scheduler on a new runtime."""
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
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{normalizeWorldMemory,rememberEntry,patchFromObject}=await import('/src/memory-model.js'),{toggleThread}=await import('/src/encounter-depth-model.js'),out=[];
   const o={id:'preview:weaver',kind:'weaver',x:1900,y:1800,state:{weave:{edges:[]}}},nodes=Array.from({length:3},(_,i)=>{const a=-Math.PI/2+i*Math.PI*2/3;return {id:o.id+':anchor:'+i,x:o.x+Math.cos(a)*54,y:o.y+Math.sin(a)*54};});toggleThread(o.state.weave,nodes[0],nodes[1]);toggleThread(o.state.weave,nodes[1],nodes[2]);
   const book=normalizeWorldMemory();rememberEntry(book,'patches',o.id,patchFromObject(o));
   for(const genre of ['minimal','deep','ambient'])for(const restored of [false,true]){const row=await renderMix(genre,{encounter:'weaver',savedMemory:restored?JSON.parse(JSON.stringify(book)):null,dense:true,renderSeconds:6});out.push({...row,restored});}return out;}''')
  for r in rows:
   assert 0<r['peak']<.96 and r['hotFraction']==0,r
   assert bool(r['modularGraphs'])==r['restored'],r
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows};(ROOT/'scripts/memory-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS six empty/restored runtime renders with actual saved signal/CV paths, peak {report["maxPeak"]:.6f}',flush=True);b.close()
finally:server.shutdown()
