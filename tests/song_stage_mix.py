"""Tu canción over the World (plan H4): the master finale (eleven layers in their variation, your notes and the theme)
renders offline over a stand-in for the World's music and stays clear of clipping, louder as the layers come in."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
RENDER='''async()=>{const song=await import('/src/song.js'),stage=await import('/src/song-stage.js'),six=.125,sr=44100;
 const ids=song.SONG_IDS,notes=Object.fromEntries(ids.map((id,i)=>[id,[60+i%5,62,64,67]])),plan=stage.songPlan({final:true,ids,notes}),secs=plan.bars*16*six+2;
 const ac=new OfflineAudioContext(1,Math.ceil(secs*sr),sr),bus=ac.createGain();bus.connect(ac.destination);const noise=ac.createBuffer(1,sr,sr),d=noise.getChannelData(0);let x=1;for(let i=0;i<d.length;i++){x=(x*16807)%2147483647;d[i]=x/1073741823.5-1;}
 for(const m of [48,60,64,67]){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=440*2**((m-69)/12);g.gain.value=.02;o.connect(g).connect(bus);o.start(0);o.stop(secs);}
 const stars=Object.fromEntries(ids.map(id=>[id,[true,true,true]]));
 const r={S:{sound:true},SIX:six,ac,bus,noiseBuffer:noise,MU:{tr:0},chordTones:()=>[60,64,67,71,74],placesData:()=>({stars,notes,won:true,master:false}),save:()=>true,toast:()=>{},narrate:()=>{},audio:()=>{}};
 song.initialize(r);stage.initialize(r);r.openSong({final:true,master:true});for(let k=0;k<plan.bars*16;k++)r.songStageStep(k%16,.05+k*six);
 const buf=await ac.startRendering(),s=buf.getChannelData(0);let peak=0,hot=0;for(const v of s){const a=Math.abs(v);if(a>peak)peak=a;if(a>.99)hot++;}
 const rms=(a,b)=>{let q=0,n=0;for(let i=Math.floor(a*sr);i<Math.min(s.length,Math.floor(b*sr));i++){q+=s[i]*s[i];n++;}return 10*Math.log10(q/Math.max(1,n)+1e-12);};
 const bar=b=>.05+b*16*six,pk=(a,b)=>{let m=0;for(let i=Math.floor(a*sr);i<Math.min(s.length,Math.floor(b*sr));i++)m=Math.max(m,Math.abs(s[i]));return m;};
 r.closeSong();return {bars:plan.bars,peak,hot,early:rms(.05,.05+16*six),full:rms(.05+plan.endAt*16*six,.05+(plan.endAt+1)*16*six),before:rms(bar(plan.notesAt-1),bar(plan.notesAt)),phrase:rms(bar(plan.notesAt),bar(plan.silenceAt)),theme1:rms(bar(plan.themeAt),bar(plan.themeAt+2)),theme2:rms(bar(plan.themeAt+2),bar(plan.endAt)),phrasePeak:pk(bar(plan.notesAt),bar(plan.silenceAt)),beforePeak:pk(bar(plan.notesAt-1),bar(plan.notesAt))};}'''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/tests/')
  r=page.evaluate(RENDER)
  assert r['hot']==0 and r['peak']<.8,('headroom over the World',r)
  # Plan I4: the Faros melody waits for the theme, so «full» is the tail, where every layer plays.
  assert r['full']>r['early']+3,('fuller as the layers come in',r)
  # Panel 10 (P6, D5-B): under your phrase and the theme's first pass only the pad and the bass go on; the rest comes
  # back with the second pass. Levels in dB, printed for the comparison with the base.
  print('levels dB · all layers %.1f · your phrase %.1f (peak %.3f vs %.3f) · theme 1st %.1f · 2nd %.1f · tail %.1f'%(r['before'],r['phrase'],r['phrasePeak'],r['beforePeak'],r['theme1'],r['theme2'],r['full']),flush=True)
  if os.environ.get('P6_ARRANGEMENT','1')=='1':assert r['phrase']<r['before']-3 and r['theme1']<r['theme2']-2,('room for your phrase and the theme',r)
  print('PASS Tu canción master finale over the World: %d bars, eleven layers in their variation, your notes and the theme; peak %.3f, fuller as layers come in'%(r['bars'],r['peak']),flush=True);b.close()
finally:server.shutdown()
