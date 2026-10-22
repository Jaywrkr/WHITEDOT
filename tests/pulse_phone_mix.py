"""The pulse and the cube's theme on a phone speaker: renders the cube's bell over its whole range and the theme voice, and checks that most of their energy sits above 350 Hz (what a phone speaker plays), with no clipping. Before, the pulse took the place's instrument and the theme a low sawtooth: on a phone only a rasp or a honk was left."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,base64
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
JS="""async()=>{const {playBell,BELL_LOW,BELL_HIGH}=await import('/src/cube-bell.js'),{playCello,themePitch,THEME}=await import('/src/journey-pulse.js');
 const render=async draw=>{const sr=44100,ac=new OfflineAudioContext(1,sr*4,sr),out=ac.createGain();out.connect(ac.destination);draw(ac,out);const x=(await ac.startRendering()).getChannelData(0),u=new Uint8Array(x.buffer.slice(0));let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode(...u.subarray(i,i+32768));return btoa(s);};
 const bells=[];for(let m=BELL_LOW;m<=BELL_HIGH;m+=3)bells.push(await render((ac,out)=>playBell(ac,out,.05,m,.1)));
 const scales=[[0,2,3,5,7,8,10],[0,2,4,6,7,9,11]],theme=[];for(const sc of scales)theme.push(await render((ac,out)=>{let t=.05;for(const [d,l] of THEME){playCello(ac,out,t,themePitch(d,sc,0),l*.25,.13);t+=l*.25;}}));
 return {bells,theme};}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/tests/')
  raw=page.evaluate(JS)
  # Energy above 350 Hz (what a phone speaker plays) over the whole, from the spectrum; and the peak.
  def measure(b64):
   x=np.frombuffer(base64.b64decode(b64),dtype='<f4');X=np.abs(np.fft.rfft(x))**2;f=np.fft.rfftfreq(len(x),1/44100);return {'share':float(X[f>=350].sum()/X.sum()),'peak':float(np.abs(x).max())}
  r={'bells':[measure(b) for b in raw['bells']],'theme':[measure(t) for t in raw['theme']]}
  for b in r['bells']:assert b['share']>.85 and 0<b['peak']<.5,b
  for t in r['theme']:assert t['share']>.5 and 0<t['peak']<.6,t
  browser.close()
 print(f"PASS pulse on a phone: the cube's bell keeps {min(b['share'] for b in r['bells']):.0%}+ of its sound above 350 Hz across its range and the theme {min(t['share'] for t in r['theme']):.0%}+, no clipping",flush=True)
finally:server.shutdown()
