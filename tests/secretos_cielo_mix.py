"""Secretos del cielo (alpha.247) leave the music alone. The World's music rendered offline from this tree and from
alpha.246 (783a704, the commit before them) is the same: the same peak and the same level in every half second. Their
only sounds are a probe's beep (two high notes on the fifth), a meteor caught (one note) and a comet crystal kept
(three notes), in the place's scale and on the grid: four of each over the same music add far less than the music itself
(measured against the same calls made inaudible: more than 25 dB under it, its peak under a fifth of the music's).
The eclipse changes the music only while it lasts: the same render is identical before it, its high end at least 12 dB
lower while the comfort filter is held dark (still sounding: its level within 6 dB), and back within 1.5 dB a few seconds
after it ends, by audio.js's own comfort setting."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,subprocess,tempfile,json,io,tarfile
ROOT=Path(__file__).resolve().parents[1]
REFS={'alpha.246':'783a704ee9dca51e51a18e8d5a39616eea88ed9b'}
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
def serve(directory):
 s=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(directory)));threading.Thread(target=s.serve_forever,daemon=True).start();return s
# The level of every half second, and of its high end (the second difference of the signal, which rises 12 dB an octave).
RENDER="""async o=>{const {renderMix}=await import('/tests/audio_mix.mjs');let capture=null;
 window.__mixCapture=b=>{capture=[0,1].map(i=>b.getChannelData(i).slice());};
 const r=await renderMix(o.genre,{productionFoundation:true,renderSeconds:o.seconds||9,sampleRate:o.rate,...(o.sound?{skySecretBatch:o.sound}:{}),...(o.eclipse?{eclipse:o.eclipse}:{})});
 let sum=0,n=0;for(const c of capture)for(let i=o.rate;i<c.length;i++){sum+=c[i]*c[i];n++;}
 const windows=[],high=[],half=o.rate/2;for(let w=0;w+half<=capture[0].length;w+=half){let q=0,h=0;for(const c of capture)for(let i=w;i<w+half;i++){q+=c[i]*c[i];if(i>1){const d=c[i]-2*c[i-1]+c[i-2];h+=d*d;}}windows.push(10*Math.log10(q/o.rate+1e-30));high.push(10*Math.log10(h/o.rate+1e-30));}
 window.__last=capture;return {windows,high,rmsDb:20*Math.log10(Math.sqrt(sum/n)),peak:r.fullPeak,notes:r.skySecretNotes||[]};}"""
DIFF="""async o=>{const plain=window.__plain,live=window.__last;let sum=0,peak=0,n=0;for(let k=0;k<2;k++)for(let i=o.rate;i<plain[k].length;i++){const d=live[k][i]-plain[k][i];sum+=d*d;peak=Math.max(peak,Math.abs(d));n++;}
 return {diffDb:sum?20*Math.log10(Math.sqrt(sum/n)):-Infinity,diffPeak:peak};}"""
tmps={}
try:
 for name,ref in REFS.items():
  # Each reference tree straight from Git (CI audio shards check out shallow: fetch it if missing).
  if subprocess.run(['git','-C',str(ROOT),'cat-file','-e',ref+'^{commit}'],capture_output=True).returncode:
   subprocess.run(['git','-C',str(ROOT),'fetch','--no-tags','--depth=1','origin',ref],check=True,capture_output=True)
  archive=subprocess.run(['git','-C',str(ROOT),'archive',ref,'src','tests/audio_mix.mjs','index.html','styles','assets'],check=True,capture_output=True).stdout
  tmps[name]=tempfile.mkdtemp(prefix='kubono-before-cielo-');tarfile.open(fileobj=io.BytesIO(archive)).extractall(tmps[name],filter='data')
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
    # The same music with four beeps, four meteors and four crystals, against the same calls made far below hearing.
    rp=a.evaluate(RENDER,{'genre':genre,'rate':rate,'sound':'silent','seconds':18});a.evaluate('()=>{window.__plain=window.__last;}');rl=a.evaluate(RENDER,{'genre':genre,'rate':rate,'sound':True,'seconds':18});d=a.evaluate(DIFF,{'rate':rate})
    notes=rl['notes'];assert len(notes)==4*2+4*1+4*3 and all(n['gain']<=.02 for n in notes),len(notes)
    assert {n['kind'] for n in notes}=={'sonda','meteoro','cometa'} and all(36<=n['note']<=96 for n in notes),notes
    for n in notes:k=n['time']/n['six'];assert abs(k-round(k))<1e-3,n
    assert d['diffDb']<rp['rmsDb']-25 and d['diffPeak']<rp['peak']/5,(genre,rp['rmsDb'],d)
    assert rl['peak']<.96
    # The eclipse from 3 s to 9 s: the same before it, darker during it, back after it.
    pe=a.evaluate(RENDER,{'genre':genre,'rate':rate,'seconds':16});ee=a.evaluate(RENDER,{'genre':genre,'rate':rate,'seconds':16,'eclipse':[3,9]});a.close()
    before=max(abs(x-y) for x,y in zip(pe['windows'][:6],ee['windows'][:6]))
    during=[x-y for x,y in zip(pe['high'][8:18],ee['high'][8:18])];level=[x-y for x,y in zip(pe['windows'][8:18],ee['windows'][8:18])]
    after=[x-y for x,y in zip(pe['high'][26:32],ee['high'][26:32])]
    assert before<.01,(genre,before);assert min(during)>=12,(genre,during);assert max(abs(x) for x in level)<6,('still sounding',genre,level)
    assert max(abs(x) for x in after)<1.5,('back by itself',genre,after)
    rows.append({'genre':genre,'rate':rate,'musicDb':round(rp['rmsDb'],1),'notesDiffDb':round(d['diffDb'],1),'notesDiffPeak':round(d['diffPeak'],4),'musicPeak':round(rp['peak'],4),
     'eclipseHighDropDb':round(sum(during)/len(during),1),'eclipseLevelDropDb':round(sum(level)/len(level),1),'afterHighDb':round(max(abs(x) for x in after),2)})
    print('PASS '+json.dumps(rows[-1]),flush=True)
   browser.close()
  print('PASS Secretos del cielo audio: the World\'s music matches alpha.246 (same peak, same level in every half second); beeps, meteors and crystals sit '+', '.join(f"{r['musicDb']-r['notesDiffDb']:.1f} dB" for r in rows)+' under the music; the eclipse darkens the high end by '+', '.join(f"{r['eclipseHighDropDb']:.1f} dB" for r in rows)+' and comes back',flush=True)
 finally:
  now.shutdown()
  for s in refs.values():s.shutdown()
finally:
 for path in tmps.values():shutil.rmtree(path,ignore_errors=True)
