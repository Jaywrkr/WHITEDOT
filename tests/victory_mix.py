"""The sound of a chapter kept (plan F2): each of the five drops renders offline as a rising bar, half a beat of
silence and a louder drop with the theme, never clipping."""
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
RENDER='''async(id)=>{const m=await import('/src/journey-victory.js'),six=.125,sr=48000,secs=m.victorySeconds(six)+1.5,ac=new OfflineAudioContext(1,Math.ceil(secs*sr),sr);
 const bus=ac.createGain();bus.gain.value=1;bus.connect(ac.destination);const noise=ac.createBuffer(1,sr*2,sr),d=noise.getChannelData(0);let x=1;for(let i=0;i<d.length;i++){x=(x*16807)%2147483647;d[i]=x/1073741823.5-1;}
 const env=(g,t,v,dec)=>{g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+dec);};
 const r={S:{sound:true},SIX:six,ac,bus,noiseBuffer:noise,MU:{sq:[{t:.0001,s:15}],tr:0},chordTones:()=>[57,60,64],
  kick:(t,v)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(44,t+.11);env(g,t,v,.32);o.connect(g).connect(bus);o.start(t);o.stop(t+.4);},
  clap:(t,v)=>{const s=ac.createBufferSource(),g=ac.createGain();s.buffer=noise;env(g,t,v,.15);s.connect(g).connect(bus);s.start(t);s.stop(t+.2);},
  hatHit:(t,v)=>{const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();f.type='highpass';f.frequency.value=8000;s.buffer=noise;env(g,t,v,.05);s.connect(f).connect(g).connect(bus);s.start(t);s.stop(t+.08);},
  pluck:(mm,t,v)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=440*2**((mm-69)/12);env(g,t,v,.6);o.connect(g).connect(bus);o.start(t);o.stop(t+.7);}};
 m.initialize(r);const ms=r.journeyVictory(id);const x0=await ac.startRendering(),s=x0.getChannelData(0);
 const rms=(a,b)=>{let q=0,n=0;for(let i=Math.floor(a*sr);i<Math.min(s.length,Math.floor(b*sr));i++){q+=s[i]*s[i];n++;}return 10*Math.log10(q/Math.max(1,n)+1e-12);};
 let peak=0,hot=0;for(const v of s){const a=Math.abs(v);if(a>peak)peak=a;if(a>.99)hot++;}
 const bar=16*six,start=.08,drop=start+bar+2*six;
 return {id,ms,peak,hot,riserEarly:rms(start,start+bar*.3),riserLate:rms(start+bar*.6,start+bar*.95),gap:rms(start+bar+.02,drop-.01),drop:rms(drop,drop+2*bar)};}'''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/tests/')
  rows=[page.evaluate(RENDER,cid) for cid in ['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales']]
  for r in rows:
   assert r['ms']>0 and 0<r['peak']<.75 and r['hot']==0,('headroom over the music',r)
   assert r['riserLate']>r['riserEarly']+6,('the riser rises',r)
   assert r['gap']<r['drop']-12,('half a beat of silence before the drop',r)
   assert r['drop']>r['riserEarly']+6 and r['drop']>-40,('the drop is the loudest part',r)
  (ROOT/'scripts/victory-audio-validation.json').write_text(json.dumps({'renders':rows},indent=2)+'\n')
  print('PASS eight drops (five chapters and the Jardín, Dunas and Cristales) render as a rising bar, a half beat of silence and a louder drop with the theme; peak %.3f'%max(r['peak'] for r in rows),flush=True);b.close()
finally:server.shutdown()
