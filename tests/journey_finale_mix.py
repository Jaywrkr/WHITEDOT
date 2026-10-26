"""Render the actual final5 player, including its automated silent tail; not a listening claim."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading,json
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
RENDER="""async({tr,six,skip,timed})=>{const f=await import('/src/journey-finale.js'),s=await import('/src/song.js'),sr=24000,context=f.finaleContext({MU:{dnaA:{scale:[0,2,3,5,7,8,10]},tr},SIX:six}),raw={llanura:[57,60,64],lago:[60,62,65],bosque:[55,58,60],tormenta:[51,54,57],vacio:[57,59,60]},timing=timed?Object.fromEntries(Object.keys(raw).map(id=>[id,[12,16,20]])):{},score=f.finaleScore(raw,undefined,{},timing).map(n=>({...n,at:n.at*six/.125,seconds:n.eighths*.25*six/.125})),end=f.scoreLength(score)+.05,ac=new OfflineAudioContext(1,Math.ceil((end+3)*sr),sr),bus=ac.createGain();bus.connect(ac.destination);const noise=ac.createBuffer(1,sr*2,sr),d=noise.getChannelData(0);let x=1;for(let i=0;i<d.length;i++){x=x*16807%2147483647;d[i]=x/1073741823.5-1;}const r={S:{sound:true},ac,bus,noiseBuffer:noise};s.initialize(r);const out=f.playFinale(r,score,context,.05);if(skip){const when=skip==='late'?end-.2:3;out.gain.cancelAndHoldAtTime(when);out.gain.setTargetAtTime(.0001,when,.12);}const a=(await ac.startRendering()).getChannelData(0);let peak=0,hot=0,energy=0,silent=0;for(let i=0;i<a.length;i++){const v=Math.abs(a[i]);peak=Math.max(peak,v);if(v>=.99)hot++;energy+=v*v;if(i>(skip==='late'?end+1:skip?5:end+.1)*sr)silent=Math.max(silent,v);}return {tr,six,skip,end,peak,hot,rms:10*Math.log10(energy/a.length+1e-12),silentPeak:silent,events:f.finaleArrangement(score,context).length};}"""
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);p=b.new_page();p.goto(f'http://127.0.0.1:{srv.server_port}/tests/')
  rows=[p.evaluate(RENDER,{'tr':tr,'six':six,'skip':False}) for tr,six in [(0,.125),(3,.1),(7,1/6)]]
  rows.append(p.evaluate(RENDER,{'tr':0,'six':.125,'skip':True}));rows.append(p.evaluate(RENDER,{'tr':0,'six':.125,'skip':'late'}))
  rows.append(p.evaluate(RENDER,{'tr':0,'six':.125,'skip':False,'timed':True}))
  for r in rows:assert 0<r['peak']<.85 and r['hot']==0 and r['rms']>-55 and r['silentPeak']<.001,r
  out=Path(os.environ.get('FINALE_EVIDENCE','/tmp/kubono-finale5-audio.json'));out.write_text(json.dumps({'scope':'Actual final5 offline player, synthetic chapter phrases; no human listening','renders':rows},indent=2)+'\n')
  print('PASS actual finale5: six renders including captured timing, no clipping, bounded level, silence and early exit; peak %.3f'%max(r['peak'] for r in rows),flush=True);b.close()
finally:srv.shutdown();srv.server_close()
