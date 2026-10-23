"""The sound of a place kept (plan F13): over a stand-in for the world's music, each close renders offline as a bar
whose filter closes, half a beat of real silence and the same music back on the «1» with the place's layer and the
theme, louder than before the build and never clipping."""
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
RENDER='''async(id)=>{const m=await import('/src/journey-victory.js'),song=await import('/src/song.js'),six=.125,sr=48000,secs=.08+m.victorySeconds(six)+1.5,ac=new OfflineAudioContext(1,Math.ceil(secs*sr),sr);
 // The output chain the game has: the bus through the player's filter and the headroom gain to the speakers.
 const headroom=ac.createGain();headroom.gain.value=.92;headroom.connect(ac.destination);const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=20000;lp.connect(headroom);const bus=ac.createGain();bus.connect(lp);
 const noise=ac.createBuffer(1,sr*2,sr),d=noise.getChannelData(0);let x=1;for(let i=0;i<d.length;i++){x=(x*16807)%2147483647;d[i]=x/1073741823.5-1;}
 const env=(g,t,v,dec)=>{g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+dec);};
 // The world's music: a held chord in C under everything, all the time.
 for(const mm of [48,60,64,67]){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=440*2**((mm-69)/12);g.gain.value=.025;o.connect(g).connect(bus);o.start(0);o.stop(secs);}
 const r={S:{sound:true},SIX:six,ac,bus,noiseBuffer:noise,fx:{lp},outputStage:{headroom},MU:{sq:[{t:.0001,s:15}],tr:0},chordTones:()=>[60,64,67,71,74],
  kick:(t,v)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(44,t+.11);env(g,t,v,.32);o.connect(g).connect(bus);o.start(t);o.stop(t+.4);},
  pluck:(mm,t,v)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=440*2**((mm-69)/12);env(g,t,v,.6);o.connect(g).connect(bus);o.start(t);o.stop(t+.7);}};
 song.initialize(r);m.initialize(r);const ms=r.journeyVictory(id);const start=.08,drop=start+16*six;
 // The sequencer's sixteenths, as audio.js calls them.
 for(let k=0;k<48;k++)r.victoryMusicStep(k%16,start+k*six);
 const x0=await ac.startRendering(),s=x0.getChannelData(0);
 const rms=(a,b)=>{let q=0,n=0;for(let i=Math.floor(a*sr);i<Math.min(s.length,Math.floor(b*sr));i++){q+=s[i]*s[i];n++;}return 10*Math.log10(q/Math.max(1,n)+1e-12);};
 let peak=0,hot=0;for(const v of s){const a=Math.abs(v);if(a>peak)peak=a;if(a>.99)hot++;}
 return {id,ms,peak,hot,before:rms(.01,start),closed:rms(start+12*six,start+14*six-.01),gap:rms(start+14*six+.01,drop-.01),drop:rms(drop,drop+32*six)};}'''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/tests/')
  rows=[page.evaluate(RENDER,cid) for cid in ['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva']]
  for r in rows:
   assert r['ms']>0 and 0<r['peak']<.75 and r['hot']==0,('headroom over the music',r)
   assert r['gap']<-70,('half a beat of real silence before the «1»',r)
   assert r['drop']>r['before']+2,('the same music back with something more',r)
   assert r['drop']>-40,('the drop is heard',r)
  (ROOT/'scripts/victory-audio-validation.json').write_text(json.dumps({'renders':rows},indent=2)+'\n')
  print('PASS eleven closes render out of the music: a bar of build, half a beat of silence and the same music on the «1» with each place layer and the theme; peak %.3f'%max(r['peak'] for r in rows),flush=True);b.close()
finally:server.shutdown()
