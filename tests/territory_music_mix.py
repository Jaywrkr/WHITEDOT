"""Actual voiced territorial harmony and calm music without an automatic drone."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate("""async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const genre of ['deep','jazztronica','nudisco'])out.push(await renderMix(genre,{livingMusic:true,dense:true,evolutionBar:16,renderSeconds:6}));for(const genre of ['ambient','heart','downtempo'])out.push(await renderMix(genre,{livingMusic:true,dense:false,renderSeconds:6}));return out;}""")
  for row in rows:assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
  assert any(any(n['role']=='acorde' for n in row['labPerformance']) for row in rows[:3]),'No actual voiced chord reached the scheduler'
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows};(ROOT/'scripts/pulido-03-music-audio.json').write_text(json.dumps(report,indent=2)+'\n')
  print('PASS six actual territorial/chord and calm mixes without an automatic organ bed',flush=True);b.close()
finally:server.shutdown()
