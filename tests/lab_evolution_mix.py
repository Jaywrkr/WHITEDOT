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
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const bar of [0,16,32,48,64,80])out.push(await renderMix('techhouse',{livingMusic:true,evolutionBar:bar,dense:true,soft:bar%32===0,sampleRate:bar%32===0?44100:48000,renderSeconds:6}));return out;}''')
  for row in rows:assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
  assert {r['labEvolution']['chapter'] for r in rows}==set(range(6))
  assert len({r['phrasing']['name'] for r in rows})>=3,'actual scheduler must develop its musical form'
  assert len(rows[-1]['labPerformance'])<len(rows[0]['labPerformance'])
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows}
  (ROOT/'scripts/evolution-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} live territorial mixes at 44.1/48 kHz, dense/soft, finite signal and headroom',flush=True);b.close()
finally:server.shutdown()
