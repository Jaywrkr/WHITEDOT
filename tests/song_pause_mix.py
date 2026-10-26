"""Measure the real complete audio output during a deliberate scene pause."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);p=b.new_page();p.goto(f'http://127.0.0.1:{srv.server_port}/')
  result=p.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs');let measured;window.__mixCapture=buffer=>{const d=buffer.getChannelData(0),sr=buffer.sampleRate,peak=(a,b)=>{let max=0;for(let i=Math.ceil(a*sr);i<Math.floor(b*sr);i++)max=Math.max(max,Math.abs(d[i]));return max;};measured={before:peak(1,1.8),pause:peak(2.1,3.9),after:peak(4.2,5.8)};};const row=await renderMix('deep',{dense:true,fx:true,productionFoundation:true,stagePause:'hold',renderSeconds:6});delete window.__mixCapture;return {...measured,fullPeak:row.fullPeak,hot:row.hotFraction};}''')
  assert result['before']>0.001 and result['after']>0.001,result
  assert result['pause']<1e-7 and result['fullPeak']<.96 and result['hot']==0,result
  print('PASS complete mix pause with effects/room: '+json.dumps(result),flush=True);b.close()
finally:srv.shutdown();srv.server_close()
