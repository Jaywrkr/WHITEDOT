"""Escenas musicales (alpha.241). With «Escenas: más variedad» off (the default) the World's music is the one of main
(67f031b, alpha.240): rendered offline at a stage in three genres, with the scenes module loaded and off, it has the same
peak and the same level in every half second, within the render's own run-to-run jitter. On, with the scene's bus sent
nowhere, the music is untouched too (the scene draws no random number and touches no voice). On at a stage, over 30 s of
its arc (the end of the drop, the breakdown, its riser and the return; docs/UNIVERSO.md has the 64 bars): peaks stay under 0.96, the mix moves away from the place's own timbre,
gains air above 4 kHz (at least 2 % of the energy; the music audit measured under 0.6 % in these genres) and breathes (at
least 6 dB between the loud and the quiet moments, in 0.4 s windows, p95 − p10; the audit measured 2–5 dB)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,subprocess,tempfile,json,io,tarfile,time
ROOT=Path(__file__).resolve().parents[1]
MAIN='67f031b754e5cc07218dfc9d40e3e37460b72b81'
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
def serve(directory):
 s=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(directory)));threading.Thread(target=s.serve_forever,daemon=True).start();return s
FIND="""async([genre,scene])=>{const r={};for(const id of ['data','progress','world'])(await import('/src/'+id+'.js')).initialize(r);const M=await import('/src/scenes-model.js');
 const world=M.sceneWorldKey(r.worldIdentity??r.S.worldIdentity),RP=r.REG*r.WCH,under=(x,y)=>{const d=r.regionOfPos(x,y);return {genre:d.genre,sea:!!d.sea};};
 for(let R=0;R<40;R++)for(let zx=-R;zx<=R;zx++)for(let zy=-R;zy<=R;zy++){if(Math.max(Math.abs(zx),Math.abs(zy))!==R)continue;const s=M.stageInZone(world,zx,zy,under,RP);if(s&&s.genre===genre&&(!scene||s.scene===scene))return {x:s.x,y:s.y,id:s.id,scene:s.scene,arc:s.hand.arc};}
 return null;}"""
# The render, its level in every half second and (long) its descriptors: a 24-band mel spectrum normalised to its mean,
# the share of energy above 4 kHz and p95 − p10 of 0.4 s windows (the method of the music audit), from the second second.
RENDER="""async o=>{const {renderMix}=await import('/tests/audio_mix.mjs');let cap=null;window.__mixCapture=b=>{cap=[b.getChannelData(0).slice(),b.getChannelData(1).slice()];};
 const opt={worldPoint:o.point,productionFoundation:true,livingMusic:true,renderSeconds:o.seconds,sampleRate:o.rate};if(o.mode)opt.stageScene=o.mode;if(o.sceneFrom)opt.sceneFrom=o.sceneFrom;
 const r=await renderMix(o.genre,opt),rate=o.rate,n=cap[0].length;
 let sum=0,cnt=0;for(const c of cap)for(let i=rate;i<n;i++){sum+=c[i]*c[i];cnt++;}
 const halves=[];for(let w=0;w+rate/2<=n;w+=rate/2){let q=0;for(const c of cap)for(let i=w;i<w+rate/2;i++)q+=c[i]*c[i];halves.push(10*Math.log10(q/rate+1e-30));}
 const out={rmsDb:20*Math.log10(Math.sqrt(sum/cnt)),peak:r.fullPeak,halves,bars:(r.sceneBars||[]).map(b=>b.section)};
 if(o.describe){const x=new Float32Array(n-2*rate);for(let i=0;i<x.length;i++)x[i]=(cap[0][i+2*rate]+cap[1][i+2*rate])/2;
  const N=2048,H=1024,win=Float32Array.from({length:N},(_,i)=>.5-.5*Math.cos(2*Math.PI*i/(N-1))),re=new Float64Array(N),im=new Float64Array(N),bins=N/2+1,freq=k=>k*rate/N;
  const mel=h=>2595*Math.log10(1+h/700),imel=m=>700*(10**(m/2595)-1),edges=Array.from({length:26},(_,i)=>imel(mel(30)+(mel(16000)-mel(30))*i/25));
  const bands=new Float64Array(24);let total=0,high=0;
  for(let at=0;at+N<=x.length;at+=H){for(let i=0;i<N;i++){re[i]=x[at+i]*win[i];im[i]=0;}
   for(let i=1,j=0;i<N;i++){let bit=N>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]];}}
   for(let len=2;len<=N;len<<=1){const a=-2*Math.PI/len,wr=Math.cos(a),wi=Math.sin(a);for(let i=0;i<N;i+=len){let cr=1,ci=0;for(let k=0;k<len/2;k++){const p=i+k,q=p+len/2,tr=re[q]*cr-im[q]*ci,ti=re[q]*ci+im[q]*cr;re[q]=re[p]-tr;im[q]=im[p]-ti;re[p]+=tr;im[p]+=ti;const nr=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=nr;}}}
   for(let k=0;k<bins;k++){const P=re[k]*re[k]+im[k]*im[k],f=freq(k);total+=P;if(f>=4000)high+=P;
    for(let b=0;b<24;b++){const lo=edges[b],c=edges[b+1],hi=edges[b+2];if(f>lo&&f<hi)bands[b]+=P*Math.min((f-lo)/(c-lo),(hi-f)/(hi-c));}}}
  const db=[...bands].map(v=>10*Math.log10(v+1e-12)),m=db.reduce((a,b)=>a+b,0)/24;out.mel=db.map(v=>v-m);out.high=high/total;
  const W=Math.round(.4*rate),wins=[];for(let i=0;i+W<=x.length;i+=W){let q=0;for(let k=i;k<i+W;k++)q+=x[k]*x[k];wins.push(10*Math.log10(q/W+1e-12));}
  wins.sort((a,b)=>a-b);const pct=p=>wins[Math.min(wins.length-1,Math.floor(p*(wins.length-1)))];out.dyn=pct(.95)-pct(.1);}
 return out;}"""
tmp=None;started=time.time()
try:
 if subprocess.run(['git','-C',str(ROOT),'cat-file','-e',MAIN+'^{commit}'],capture_output=True).returncode:
  subprocess.run(['git','-C',str(ROOT),'fetch','--no-tags','--depth=1','origin',MAIN],check=True,capture_output=True)
 archive=subprocess.run(['git','-C',str(ROOT),'archive',MAIN,'src','tests/audio_mix.mjs','index.html','styles','assets'],check=True,capture_output=True).stdout
 tmp=tempfile.mkdtemp(prefix='kubono-before-scenes-');tarfile.open(fileobj=io.BytesIO(archive)).extractall(tmp,filter='data')
 now=serve(ROOT);ref=serve(tmp)
 def render(server,o):
  p=browser.new_page();p.goto(f'http://127.0.0.1:{server.server_port}/');res=p.evaluate(RENDER,o);p.close();return res
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
   p=browser.new_page();p.goto(f'http://127.0.0.1:{now.server_port}/')
   points={g:p.evaluate(FIND,[g,s]) for g,s in [('minimaltechno','almacen'),('techhouse','patio'),('deep','patio'),('acid','almacen')]};p.close()
   assert all(points.values()),points
   # --- Off: the same music as main, in three genres (and on with the bus sent nowhere: the music untouched).
   for genre,rate in [('minimaltechno',48000),('techhouse',44100),('deep',48000)]:
    base={'genre':genre,'rate':rate,'point':{'x':points[genre]['x'],'y':points[genre]['y']},'seconds':9}
    a=render(now,{**base,'mode':'off'});b=render(ref,base)
    drift=max(abs(x-y) for x,y in zip(a['halves'],b['halves']))
    assert len(a['halves'])==len(b['halves'])==18 and drift<.01,(genre,drift)
    assert abs(a['rmsDb']-b['rmsDb'])<.001 and abs(a['peak']-b['peak'])<1e-5,(genre,a['rmsDb'],b['rmsDb'],a['peak'],b['peak'])
    assert not a['bars'],'off: no scene'
    print('PASS '+json.dumps({'off':genre,'rate':rate,'mainDb':round(b['rmsDb'],4),'nowDb':round(a['rmsDb'],4),'halfSecondDriftDb':round(drift,5)}),flush=True)
    if genre=='minimaltechno':
     d=render(now,{**base,'mode':'detached'});drift=max(abs(x-y) for x,y in zip(a['halves'],d['halves']))
     assert d['bars'] and drift<.01 and abs(d['rmsDb']-a['rmsDb'])<.001,('detached',drift,d['bars'][:2])
     print('PASS '+json.dumps({'detached':genre,'bars':len(d['bars']),'halfSecondDriftDb':round(drift,5)}),flush=True)
   # --- On at a stage: the Almacén on minimal techno and the Patio latino on tech house, 30 s from the end of the drop
   # through the breakdown, its riser and the return (the arc's quiet and loud), against the same place off.
   rows=[]
   for genre,rate in [('minimaltechno',48000),('techhouse',44100)]:
    pt=points[genre];at={'genre':genre,'rate':rate,'point':{'x':pt['x'],'y':pt['y']},'describe':True}
    base=render(now,{**at,'seconds':30,'mode':'off'});on=render(now,{**at,'seconds':30,'mode':'on','sceneFrom':pt['arc']*38//64})
    sections=[s for i,s in enumerate(on['bars']) if i==0 or on['bars'][i-1]!=s]
    assert sections[:3]==['drop','breakdown','return'],sections
    dist=(sum((x-y)**2 for x,y in zip(on['mel'],base['mel']))/24)**.5
    row={'genre':genre,'scene':pt['scene'],'arc':pt['arc'],'sections':sections,'peak':round(on['peak'],3),'sceneDb':round(on['rmsDb'],1),'baseDb':round(base['rmsDb'],1),'timbreDistanceDb':round(dist,2),'high4kPct':round(100*on['high'],2),'baseHigh4kPct':round(100*base['high'],2),'rangeDb':round(on['dyn'],1),'baseRangeDb':round(base['dyn'],1)}
    print('PASS '+json.dumps(row),flush=True);rows.append(row)
    assert on['peak']<.96,row
    assert dist>=3,row
    assert on['high']>=.02 and on['high']>base['high']*4,row
    assert on['dyn']>=6 and on['dyn']>base['dyn']+1.5,row
   browser.close()
  print(f'PASS Escenas audio: off, the music of main in three genres; on, peaks under 0.96, timbre {", ".join(str(r["timbreDistanceDb"]) for r in rows)} dB away, '+
   f'{", ".join(str(r["high4kPct"]) for r in rows)} % above 4 kHz, {", ".join(str(r["rangeDb"]) for r in rows)} dB of range ({time.time()-started:.0f} s)',flush=True)
 finally:
  now.shutdown();ref.shutdown()
finally:
 if tmp:shutil.rmtree(tmp,ignore_errors=True)
