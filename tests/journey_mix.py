"""Render actual moving production territories: no mocked conductor or composition."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page()
  page.expose_function('__journeyProgress',lambda text:print(text,flush=True))
  page.route('**/src/main.js',lambda route:route.fulfill(body='',content_type='text/javascript'));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{
   const {renderMix}=await import('/tests/audio_mix.mjs'),r={};for(const id of ['data','progress','world'])(await import('/src/'+id+'.js')).initialize(r);
   const size=r.REG*r.WCH,out=[];
   for(const [vx,sampleRate]of [[600,48000],[-320,44100]]){
    const point={x:size*.75,y:size*.5},genre=r.regionOfPos(point.x,point.y).genre;
    await window.__journeyProgress('Rendering moving territory '+vx);const mix=await renderMix(genre,{worldPoint:point,productionFoundation:true,dense:true,renderSeconds:30,sampleRate,journeyMotion:{vx}});
    await window.__journeyProgress('Rendered '+vx+' at peak '+mix.fullPeak);out.push({vx,sampleRate,peak:mix.fullPeak,rmsDb:mix.rmsDb,hot:mix.hotFraction,frames:mix.territoryFrames,tempi:mix.tempoFrames,maxOnsetError:Math.max(...mix.conductorOnsets.map(n=>n.errorSeconds)),instruments:mix.instrumentHits});
   }return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hot']==0 and -50<row['rmsDb']<-3,row
   assert row['frames'] and row['instruments'] and row['maxOnsetError']<.009,row
   assert any(f['secondary'] is not None for f in row['frames']),row
   primaryAt=row['frames'][0]['bar'];previous=row['frames'][0]
   for frame in row['frames'][1:]:
    if frame['primary']!=previous['primary']:
     assert frame['swap'] and frame['bar']%8==0 and frame['bar']-primaryAt>=8,(previous,frame)
     assert abs(frame['from']-(1-previous['to']))<1e-8,(previous,frame)
     primaryAt=frame['bar']
    else:assert abs(frame['from']-previous['to'])<1e-8,(previous,frame)
    assert abs(frame['to']-frame['from'])<=.125+1e-8,frame
    previous=frame
   for a,b in zip(row['tempi'],row['tempi'][1:]):assert abs(a['bpm']-b['bpm'])<=2+1e-8,(a,b)
  assert any(f['swap'] for row in rows for f in row['frames']),'render must exercise a real handover'
  Path('/tmp/whitedot-journey-audio.json').write_text(json.dumps(rows,indent=2)+'\n')
  print('PASS two 30-second real moving mixes, eight-bar ownership, continuous radio handover, gentle tempo, harmonic timing and protected output',flush=True);browser.close()
finally:server.shutdown()
