"""Tu canción (plan F7): each of the eleven layers renders offline on its own and is heard; all eleven together are
louder than any one and never clip."""
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
RENDER='''async(ids)=>{const m=await import('/src/song.js'),sr=44100,secs=m.SONG_STEPS*m.SONG_SIX+2,ac=new OfflineAudioContext(1,Math.ceil(secs*sr),sr);
 const bus=ac.createGain();bus.connect(ac.destination);const noise=ac.createBuffer(1,sr*2,sr),d=noise.getChannelData(0);let x=1;for(let i=0;i<d.length;i++){x=(x*16807)%2147483647;d[i]=x/1073741823.5-1;}
 const r={S:{sound:true},ac,bus,noiseBuffer:noise};m.initialize(r);r.playSong(ids,{at:.05});const s=(await ac.startRendering()).getChannelData(0);
 let q=0,peak=0,hot=0;for(const v of s){q+=v*v;const a=Math.abs(v);if(a>peak)peak=a;if(a>.99)hot++;}return {ids:ids.join('+'),rms:10*Math.log10(q/s.length+1e-12),peak,hot};}'''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/tests/')
  ids=page.evaluate("async()=>(await import('/src/song.js')).SONG_IDS")
  solo=[page.evaluate(RENDER,[i]) for i in ids];full=page.evaluate(RENDER,ids);five=page.evaluate(RENDER,ids[:5])
  for r in solo:assert r['rms']>-48 and r['hot']==0,('each layer is heard',r)
  assert full['hot']==0 and full['peak']<.85,('eleven layers never clip',full)
  assert full['rms']>max(r['rms'] for r in solo)+2 and full['rms']>five['rms'],('the whole song is fuller',full,five)
  (ROOT/'scripts/song-audio-validation.json').write_text(json.dumps({'solo':solo,'five':five,'full':full},indent=2)+'\n')
  print('PASS Tu canción: eleven layers each heard on its own, the five of the Journey and all eleven fuller and never clipping; peak %.3f'%full['peak'],flush=True);b.close()
finally:server.shutdown()
