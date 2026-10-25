"""Offline regression: existing won layer over continuous music, with unchanged player filter and output."""
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
RENDER='''async(id)=>{const m=await import('/src/journey-victory.js'),song=await import('/src/song.js'),six=.125,sr=48000,start=.5,secs=start+m.victorySeconds(six)+1;
 async function render(close){const ac=new OfflineAudioContext(1,Math.ceil(secs*sr),sr),headroom=ac.createGain();headroom.gain.value=.92;headroom.connect(ac.destination);const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3500;lp.connect(headroom);const bus=ac.createGain();bus.connect(lp);
 for(const mm of [48,60,64,67]){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=440*2**((mm-69)/12);g.gain.value=.025;o.connect(g).connect(bus);o.start(0);o.stop(secs);}
 const noise=ac.createBuffer(1,sr*2,sr),d=noise.getChannelData(0);let x=1;for(let i=0;i<d.length;i++){x=(x*16807)%2147483647;d[i]=x/1073741823.5-1;}
 const r={S:{sound:true},SIX:six,ac,bus,noiseBuffer:noise,fx:{lp},outputStage:{headroom},MU:{sq:[{t:start,s:0}],tr:0},chordTones:()=>[60,64,67,71,74]};song.initialize(r);m.initialize(r);
 let ms=0;if(close){ms=r.journeyVictory(id);for(let k=0;k<=32;k++)r.victoryMusicStep(k%16,start+k*six);}
 const buf=await ac.startRendering();return {samples:buf.getChannelData(0),ms,filter:lp.frequency.value,headroom:headroom.gain.value};}
 const a=await render(true),b=await render(false);let peak=0,hot=0,diff=0,pre=0,tail=0,n=0;
 for(let i=0;i<a.samples.length;i++){const v=a.samples[i],d=v-b.samples[i],t=i/sr;peak=Math.max(peak,Math.abs(v));if(Math.abs(v)>.99)hot++;if(t<start)pre=Math.max(pre,Math.abs(d));else if(t<start+32*six){diff+=d*d;n++;}else if(t>start+32*six+.5)tail=Math.max(tail,Math.abs(d));}
 return {id,ms:a.ms,peak,hot,contributionDb:10*Math.log10(diff/Math.max(1,n)+1e-12),beforeDifference:pre,tailDifference:tail,filter:a.filter,headroom:a.headroom};}'''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/tests/')
  rows=[page.evaluate(RENDER,cid) for cid in ['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva']]
  for r in rows:
   assert r['ms']>0 and 0<r['peak']<.75 and r['hot']==0,('headroom over the music',r)
   assert r['beforeDifference']<1e-6 and r['tailDifference']<.001,('radio unchanged before and after',r)
   assert -75<r['contributionDb']<-8,('audible bounded contribution',r)
   assert r['filter']==3500 and abs(r['headroom']-.92)<1e-6,('player filter/output untouched',r)
  (ROOT/'scripts/victory-audio-validation.json').write_text(json.dumps({'renders':rows},indent=2)+'\n')
  print('PASS eleven closes add only their existing layer; radio/filter/output unchanged, bounded contribution and no clipping; peak %.3f'%max(r['peak'] for r in rows),flush=True);b.close()
finally:server.shutdown()
