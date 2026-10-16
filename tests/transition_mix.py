"""Actual native destinations retain distinct tempi while musical travel converges safely."""
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
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),r={},found=new Map(),out=[];for(const id of ['data','progress','world'])(await import('/src/'+id+'.js')).initialize(r);for(let x=-25;x<25;x++)for(let y=-25;y<25;y++){const p={x:(x+.5)*3600,y:(y+.5)*3600},d=r.regionOfPos(p.x,p.y);if(!d.sea&&!found.has(d.genre))found.set(d.genre,p);}
   for(const [from,to]of [['dnb','ambient'],['ambient','dnb'],['garage','afro']]){const r=await renderMix(from,{productionFoundation:true,worldPoint:found.get(from),transitionPoint:found.get(to),renderSeconds:30});out.push({from,to,peak:r.peak,rmsDb:r.rmsDb,hotFraction:r.hotFraction,tempoFrames:r.tempoFrames,instruments:r.instrumentHits});}return out;}''')
  for r in rows:
   assert 0<r['peak']<.96 and r['hotFraction']==0 and -60<r['rmsDb']<-3,r
   frames=r['tempoFrames'];assert len({f['region'] for f in frames})==2,r
   assert frames[-1]['bpm']==frames[-1]['target'],r
   assert all(abs(a['bpm']-b['bpm'])<=24 for a,b in zip(frames,frames[1:])),r
   if r['from'] in ['dnb','ambient']:assert abs(frames[0]['bpm']-frames[-1]['bpm'])>=40,r
  (ROOT/'scripts/musica-06-transitions-audio.json').write_text(json.dumps({'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows},indent=2)+'\n')
  print('PASS three real thirty-second journeys: distinct tempi, shared transport, bounded tempo steps, target convergence and protected output')
  browser.close()
finally:server.shutdown()
