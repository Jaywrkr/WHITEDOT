"""Actual magnetic followers and six natural bodies against dense/quiet electronic bands."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.route('**/src/main.js',lambda route:route.fulfill(body='',content_type='text/javascript'));page.goto(f'http://127.0.0.1:{server.server_port}/')
  page.expose_function('__mixProgress',lambda r:print('RENDER '+str(r),flush=True))
  result=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{NEW_PERCUSSION}=await import('/src/percussion-model.js'),out=[];for(const kind of Object.keys(NEW_PERCUSSION))for(const genre of ['minimaltechno','ambient'])out.push(await renderMix(genre,{scene:'rhythm:'+kind,dense:true,productionFoundation:true,sampleRate:genre==='ambient'?44100:48000}));for(const genre of ['minimaltechno','afro','ambient','garage'])out.push(await renderMix(genre,{scene:'power:iman',dense:true,productionFoundation:true,sampleRate:48000}));return out;}''')
  for r in result:
   assert 0<r['peak']<.96 and r['hotFraction']==0,r
   # The conductor deliberately preserves scheduled humanization below 9 ms.
   assert r['conductorOnsets'] and max(n['errorSeconds'] for n in r['conductorOnsets'])<.009,r
   if r['scene'].startswith('rhythm:'):
    kind=r['scene'].split(':')[1];assert r['percussionNotes'] and r['materialStrikes'],r;assert all(n['kind']==kind for n in r['materialStrikes']),r
   else:
    assert r['magnetNotes'] and all(1.35<=n['gain']<=1.8 for n in r['magnetNotes']),r
    counts={}
    for n in r['magnetNotes']:
     frame=next((f for f in reversed(r['tempoFrames']) if f.get('time',1e99)<=n['time']),None)
     # The native scheduler emits no more than one attracted voice per beat.
     counts[n['time']]=counts.get(n['time'],0)+1
    assert max(counts.values())==1,r
  (ROOT/'scripts/posmusica-08-magnet-percussion-validation.json').write_text(json.dumps(result,indent=2)+'\n')
  print(f'PASS {len(result)} real mixes: six percussion bodies at 44.1/48 kHz, four magnetic ensembles, grid/finite output and max peak {max(r["peak"] for r in result):.5f}',flush=True);b.close()
finally:server.shutdown()
