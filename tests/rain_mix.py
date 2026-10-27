"""The rain is a light texture under the music (Jay, 27 Oct 2026): the real rain bed of world-weather.js, through the
shared ambience, rendered offline at 44.1 and 48 kHz, calm and in a full storm, far under a render of the music."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# The rain bed alone: the module's own nodes, a seeded white noise like the engine's, sound on, raining, on the surface.
RAIN="""async({storm,rate,raining})=>{const weather=await import('/src/world-weather.js'),ambience=await import('/src/ambience.js'),seconds=8,ac=new OfflineAudioContext(2,seconds*rate,rate);
 const noise=ac.createBuffer(1,rate*2,rate),d=noise.getChannelData(0);let h=917;for(let i=0;i<d.length;i++){h=(Math.imul(h,1664525)+1013904223)>>>0;d[i]=h/2147483648-1;}
 const bus=ac.createGain();bus.connect(ac.destination);
 const r={ac,bus,noiseBuffer:noise,S:{sound:true,layer:'superficie',reducedMotion:true},inWorld:()=>true,rainingNow:raining,MU:{storm},worldLight:()=>({night:0}),BI:()=>({id:'pradera'})};
 ambience.initialize(r);weather.initialize(r);r.weatherBeds();
 const out=(await ac.startRendering()).getChannelData(0),from=Math.floor(5*rate);let sum=0,peak=0;for(let i=from;i<out.length;i++){sum+=out[i]*out[i];peak=Math.max(peak,Math.abs(out[i]));}
 const rms=Math.sqrt(sum/(out.length-from));return {storm,rate,raining,rms,rmsDb:rms>0?20*Math.log10(rms):-Infinity,peak,bed:weather.RAIN_BED?{...weather.RAIN_BED}:null};}"""
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=[page.evaluate(RAIN,{'storm':storm,'rate':rate,'raining':True}) for rate in (44100,48000) for storm in (0,1)]
  dry=page.evaluate(RAIN,{'storm':1,'rate':48000,'raining':False})
  music=page.evaluate("async()=>{const {renderMix}=await import('/tests/audio_mix.mjs');return await renderMix('minimal',{renderSeconds:6});}")
  for r in rows:print(f"rain storm={r['storm']} {r['rate']} Hz: {r['rmsDb']:.1f} dBFS rms, peak {r['peak']:.5f}; music {music['rmsDb']:.1f} dBFS",flush=True)
  calm=[r for r in rows if r['storm']==0];storms=[r for r in rows if r['storm']==1]
  # A light texture: even a full storm sits more than 40 dB under the music and never peaks above 0.01.
  assert all(r['rmsDb']<music['rmsDb']-40 and r['peak']<.01 for r in rows),(rows,music['rmsDb'])
  # The storm still rains harder than a calm shower, by the bed's own ratio; without rain the bed is silent.
  assert all(s['rms']>c['rms']*2 for s,c in zip(storms,calm)),rows
  assert dry['peak']<1e-6,dry
  assert rows[0]['bed']=={'calm':.003,'storm':.005},rows[0]['bed']
  print('PASS rain bed: '+json.dumps({'calmDb':round(calm[-1]['rmsDb'],1),'stormDb':round(storms[-1]['rmsDb'],1),'musicDb':round(music['rmsDb'],1)}),flush=True);b.close()
finally:server.shutdown()
