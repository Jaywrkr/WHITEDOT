"""Lo que hay más lejos (alpha.248) leaves the music alone. The World's music rendered offline from this tree and from
alpha.247 (e16d9f7, the commit before it) is the same: the same peak and the same level in every half second. Its only
sounds are a ring or light of a challenge (one note), a radar's tick (one high note), a kick or a bounce of the ball (one
note of the chord), a goal (four notes) and the flare (two high notes, heard from its side), in the place's scale or the
chord and on the grid: three of each over the same music add far less than the music itself (measured against the same
calls made inaudible: more than 25 dB under it, its peak under a fifth of the music's)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,subprocess,tempfile,json,io,tarfile
ROOT=Path(__file__).resolve().parents[1]
REFS={'alpha.247':'e16d9f760b2c21cfeb2dd34f130f63351e29b309'}
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
def serve(directory):
 s=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(directory)));threading.Thread(target=s.serve_forever,daemon=True).start();return s
RENDER="""async o=>{const {renderMix}=await import('/tests/audio_mix.mjs');let capture=null;
 window.__mixCapture=b=>{capture=[0,1].map(i=>b.getChannelData(i).slice());};
 const r=await renderMix(o.genre,{productionFoundation:true,renderSeconds:o.seconds||9,sampleRate:o.rate,...(o.sound?{viajeBatch:o.sound}:{})});
 let sum=0,n=0;for(const c of capture)for(let i=o.rate;i<c.length;i++){sum+=c[i]*c[i];n++;}
 const windows=[],half=o.rate/2;for(let w=0;w+half<=capture[0].length;w+=half){let q=0;for(const c of capture)for(let i=w;i<w+half;i++)q+=c[i]*c[i];windows.push(10*Math.log10(q/o.rate+1e-30));}
 window.__last=capture;return {windows,rmsDb:20*Math.log10(Math.sqrt(sum/n)),peak:r.fullPeak,notes:r.viajeNotes||[]};}"""
DIFF="""async o=>{const plain=window.__plain,live=window.__last;let sum=0,peak=0,n=0;for(let k=0;k<2;k++)for(let i=o.rate;i<plain[k].length;i++){const d=live[k][i]-plain[k][i];sum+=d*d;peak=Math.max(peak,Math.abs(d));n++;}
 return {diffDb:sum?20*Math.log10(Math.sqrt(sum/n)):-Infinity,diffPeak:peak};}"""
tmps={}
try:
 for name,ref in REFS.items():
  full=subprocess.run(['git','-C',str(ROOT),'rev-parse',ref+'^{commit}'],capture_output=True,text=True)
  if full.returncode:subprocess.run(['git','-C',str(ROOT),'fetch','--no-tags','--depth=1','origin',ref],check=True,capture_output=True)
  archive=subprocess.run(['git','-C',str(ROOT),'archive',ref,'src','tests/audio_mix.mjs','index.html','styles','assets'],check=True,capture_output=True).stdout
  tmps[name]=tempfile.mkdtemp(prefix='kubono-before-viaje-');tarfile.open(fileobj=io.BytesIO(archive)).extractall(tmps[name],filter='data')
 now=serve(ROOT);refs={name:serve(path) for name,path in tmps.items()}
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
   rows=[]
   for genre,rate in [('minimal',48000),('deep',44100)]:
    a=browser.new_page();a.goto(f'http://127.0.0.1:{now.server_port}/');ra=a.evaluate(RENDER,{'genre':genre,'rate':rate})
    for name in REFS:
     b=browser.new_page();b.goto(f'http://127.0.0.1:{refs[name].server_port}/');rb=b.evaluate(RENDER,{'genre':genre,'rate':rate});b.close()
     drift=max(abs(x-y) for x,y in zip(ra['windows'],rb['windows']))
     assert len(ra['windows'])==len(rb['windows'])==18 and drift<.01,(genre,rate,name,drift)
     assert abs(ra['rmsDb']-rb['rmsDb'])<.001 and abs(ra['peak']-rb['peak'])<1e-5,(name,ra['rmsDb'],rb['rmsDb'],ra['peak'],rb['peak'])
     print('PASS '+json.dumps({'genre':genre,'rate':rate,'reference':name,'refDb':round(rb['rmsDb'],4),'nowDb':round(ra['rmsDb'],4),'windowDriftDb':round(drift,5)}),flush=True)
    # The same music with three of each sound of the batch, against the same calls made far below hearing.
    rp=a.evaluate(RENDER,{'genre':genre,'rate':rate,'sound':'silent','seconds':20});a.evaluate('()=>{window.__plain=window.__last;}');rl=a.evaluate(RENDER,{'genre':genre,'rate':rate,'sound':True,'seconds':20});d=a.evaluate(DIFF,{'rate':rate});a.close()
    notes=rl['notes'];assert len(notes)==3*(1+1+1+4+2) and all(n['gain']<=.02 for n in notes),len(notes)
    assert {n['kind'] for n in notes}=={'reto','radar','pelota','gol','bengala'} and all(36<=n['note']<=96 for n in notes),notes
    assert any(n['pan']<0 for n in notes if n['kind']=='bengala') and any(n['pan']>0 for n in notes if n['kind']=='bengala'),'the flare from its side'
    for n in notes:k=n['time']/n['six'];assert abs(k-round(k))<1e-3,n
    assert d['diffDb']<rp['rmsDb']-25 and d['diffPeak']<rp['peak']/5,(genre,rp['rmsDb'],d)
    assert rl['peak']<.96
    rows.append({'genre':genre,'rate':rate,'musicDb':round(rp['rmsDb'],1),'notesDiffDb':round(d['diffDb'],1),'notesDiffPeak':round(d['diffPeak'],4),'musicPeak':round(rp['peak'],4)})
    print('PASS '+json.dumps(rows[-1]),flush=True)
   browser.close()
  print('PASS Lo que hay más lejos audio: the World\'s music matches alpha.247 (same peak, same level in every half second); rings, ticks, kicks, goals and the flare sit '+', '.join(f"{r['musicDb']-r['notesDiffDb']:.1f} dB" for r in rows)+' under the music',flush=True)
 finally:
  now.shutdown()
  for s in refs.values():s.shutdown()
finally:
 for path in tmps.values():shutil.rmtree(path,ignore_errors=True)
