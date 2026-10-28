"""Living encounters leave the music alone (Jay: «me encanta como está»). The World's music rendered offline from this tree
and from the commit before the encounters (2ae74a8, alpha.226) is the same in two places and at 44.1 and 48 kHz: the
same peak and the same level in every half second, within the render's own run-to-run jitter (about 0.0001 dB; the
renders are not bit-identical even from one tree). The only sound an encounter adds is one quiet note on the catch: the eleven of them, over the same
music, add far less than the music itself (measured against the same calls made inaudible, more than 25 dB under it, its peak under a fifth of the music's)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,subprocess,tempfile,json,io,tarfile
ROOT=Path(__file__).resolve().parents[1]
BEFORE='2ae74a8b0e811251b8a3ff82a637dc07f4c6f1e9'
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
def serve(directory):
 s=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(directory)));threading.Thread(target=s.serve_forever,daemon=True).start();return s
# A digest of every rendered sample, its level, and (with the catch notes) the difference against the plain render.
RENDER="""async o=>{const {renderMix}=await import('/tests/audio_mix.mjs');let capture=null;
 window.__mixCapture=b=>{const ch=[0,1].map(i=>b.getChannelData(i).slice());capture=ch;};
 const r=await renderMix(o.genre,{productionFoundation:true,renderSeconds:9,sampleRate:o.rate,...(o.live?{liveBatch:o.live}:{})});
 const bytes=new Uint8Array(capture[0].length*8);bytes.set(new Uint8Array(capture[0].buffer),0);bytes.set(new Uint8Array(capture[1].buffer),capture[0].length*4);
 const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
 let sum=0,n=0;for(const c of capture)for(let i=o.rate;i<c.length;i++){sum+=c[i]*c[i];n++;}
 const windows=[];for(let w=0;w+o.rate/2<=capture[0].length;w+=o.rate/2){let q=0;for(const c of capture)for(let i=w;i<w+o.rate/2;i++)q+=c[i]*c[i];windows.push(10*Math.log10(q/o.rate+1e-30));}
 window.__last=capture;return {digest,windows,rmsDb:20*Math.log10(Math.sqrt(sum/n)),peak:r.fullPeak,notes:r.liveNotes||[]};}"""
DIFF="""async o=>{const plain=window.__plain,live=window.__last;let sum=0,peak=0,n=0;for(let k=0;k<2;k++)for(let i=o.rate;i<plain[k].length;i++){const d=live[k][i]-plain[k][i];sum+=d*d;peak=Math.max(peak,Math.abs(d));n++;}
 return {diffDb:sum?20*Math.log10(Math.sqrt(sum/n)):-Infinity,diffPeak:peak};}"""
tmp=tempfile.mkdtemp(prefix='kubono-before-e1-')
try:
 # The tree before the encounters, straight from Git (CI audio shards check out shallow: fetch it if missing).
 if subprocess.run(['git','-C',str(ROOT),'cat-file','-e',BEFORE+'^{commit}'],capture_output=True).returncode:
  subprocess.run(['git','-C',str(ROOT),'fetch','--no-tags','--depth=1','origin',BEFORE],check=True,capture_output=True)
 archive=subprocess.run(['git','-C',str(ROOT),'archive',BEFORE,'src','tests/audio_mix.mjs','index.html','styles','assets'],check=True,capture_output=True).stdout
 tarfile.open(fileobj=io.BytesIO(archive)).extractall(tmp,filter='data')
 now,before=serve(ROOT),serve(tmp)
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
   rows=[]
   for genre,rate in [('minimal',48000),('deep',44100)]:
    a=browser.new_page();a.goto(f'http://127.0.0.1:{now.server_port}/');ra=a.evaluate(RENDER,{'genre':genre,'rate':rate})
    b=browser.new_page();b.goto(f'http://127.0.0.1:{before.server_port}/');rb=b.evaluate(RENDER,{'genre':genre,'rate':rate});b.close()
    drift=max(abs(x-y) for x,y in zip(ra['windows'],rb['windows']))
    assert len(ra['windows'])==len(rb['windows'])==18 and drift<.01,(genre,rate,drift)
    assert abs(ra['rmsDb']-rb['rmsDb'])<.001 and abs(ra['peak']-rb['peak'])<1e-5,(ra['rmsDb'],rb['rmsDb'],ra['peak'],rb['peak'])
    # The same music with the eleven catch notes, against the same calls made far below hearing: what is left is the notes.
    a.evaluate(RENDER,{'genre':genre,'rate':rate,'live':'silent'});a.evaluate('()=>{window.__plain=window.__last;}');rl=a.evaluate(RENDER,{'genre':genre,'rate':rate,'live':True});d=a.evaluate(DIFF,{'rate':rate});a.close()
    assert len(rl['notes'])==11 and all(n['gain']<=.02 and 36<=n['note']<=96 for n in rl['notes']),rl['notes']
    assert d['diffDb']<ra['rmsDb']-25 and d['diffPeak']<ra['peak']/5,(genre,ra['rmsDb'],d)
    assert rl['peak']<.96
    rows.append({'genre':genre,'rate':rate,'beforeDb':round(rb['rmsDb'],4),'nowDb':round(ra['rmsDb'],4),'windowDriftDb':round(drift,5),'peak':round(ra['peak'],4),'musicDb':round(ra['rmsDb'],1),'catchDiffDb':round(d['diffDb'],1),'catchDiffPeak':round(d['diffPeak'],4),'noteGain':rl['notes'][0]['gain']})
    print('PASS '+json.dumps(rows[-1]),flush=True)
   browser.close()
  print('PASS living encounters audio: the World\'s music matches alpha.226 (same peak, same level in every half second) and the eleven catch notes sit '+', '.join(f"{r['musicDb']-r['catchDiffDb']:.1f} dB" for r in rows)+' under the music',flush=True)
 finally:now.shutdown();before.shutdown()
finally:shutil.rmtree(tmp,ignore_errors=True)
