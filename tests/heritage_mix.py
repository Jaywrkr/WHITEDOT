"""Eight actual guardian lessons plus three usable rewards and a recovered relic."""
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
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{CULTURE_IDS}=await import('/src/culture-model.js'),out=[];
   for(const id of CULTURE_IDS)out.push(await renderMix('dub',{scene:'culture:'+id,dense:true,renderSeconds:6}));
   for(const scene of ['heritage:tinta:0','heritage:tinta:1','heritage:tinta:2','relic'])out.push(await renderMix('deep',{scene,dense:true,renderSeconds:6,soft:true,sampleRate:44100}));return out;}''')
  for r in rows:
   assert 0<r['peak']<.96 and r['hotFraction']==0 and -65<r['rmsDb']<-3,r
   if r['scene'].startswith('culture:'):assert len(r['cultureNotes'])>=4 and r['cultureHeard'],r
   elif r['scene'].startswith('heritage:'):assert any(n.get('source','').startswith('sanctuary:') for n in r['foregroundNotes']),r
   else:assert any(n.get('source','').startswith('site:v1:') for n in r['foregroundNotes']),r
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows};(ROOT/'scripts/heritage-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} lessons/rewards/relic renders with actual source onsets, peak {report["maxPeak"]:.6f}',flush=True);b.close()
finally:server.shutdown()
