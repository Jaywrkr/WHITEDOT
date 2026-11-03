"""Recorrer lejos (alpha.245) leaves the music alone. Its only sounds are a buoy's tic (one note of the chord that sounds,
an octave up) and a satellite's two notes, on the eighths of the bar: six tics and three satellites over the World's music
add far less than the music itself (measured against the same calls made inaudible: more than 25 dB under it, its peak
under a fifth of the music's). Inside a satellite the music goes a little lower: the mix's dry bus at 0.5, so the same render
is the same before the first second and between 0.5 and 2.2 dB lower once it has settled (the compressor takes part of
it back, and the room's and the echo's returns are not lowered, so it also sounds a little roomier).
The World's music without them is checked against older releases by descubrir_mix.py; audio.js is not touched."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
RENDER="""async o=>{const {renderMix}=await import('/tests/audio_mix.mjs');let capture=null;
 window.__mixCapture=b=>{capture=[0,1].map(i=>b.getChannelData(i).slice());};
 const r=await renderMix(o.genre,{productionFoundation:true,renderSeconds:o.seconds||9,sampleRate:o.rate,...(o.batch?{recorrerBatch:o.batch}:{}),...(o.duck?{recorrerDuck:true}:{})});
 let sum=0,n=0;for(const c of capture)for(let i=o.rate;i<c.length;i++){sum+=c[i]*c[i];n++;}
 const windows=[];for(let w=0;w+o.rate/2<=capture[0].length;w+=o.rate/2){let q=0;for(const c of capture)for(let i=w;i<w+o.rate/2;i++)q+=c[i]*c[i];windows.push(10*Math.log10(q/o.rate+1e-30));}
 window.__last=capture;return {windows,rmsDb:20*Math.log10(Math.sqrt(sum/n)),peak:r.fullPeak,notes:r.recorrerNotes||[]};}"""
DIFF="""async o=>{const plain=window.__plain,live=window.__last;let sum=0,peak=0,n=0;for(let k=0;k<2;k++)for(let i=o.rate;i<plain[k].length;i++){const d=live[k][i]-plain[k][i];sum+=d*d;peak=Math.max(peak,Math.abs(d));n++;}
 return {diffDb:sum?20*Math.log10(Math.sqrt(sum/n)):-Infinity,diffPeak:peak};}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  rows=[]
  for genre,rate in [('minimal',48000),('deep',44100)]:
   a=browser.new_page();a.goto(f'http://127.0.0.1:{server.server_port}/')
   rp=a.evaluate(RENDER,{'genre':genre,'rate':rate,'batch':'silent','seconds':13});a.evaluate('()=>{window.__plain=window.__last;}')
   rl=a.evaluate(RENDER,{'genre':genre,'rate':rate,'batch':True,'seconds':13});d=a.evaluate(DIFF,{'rate':rate})
   notes=rl['notes'];assert len(notes)==12 and all(n['gain']<=.0035 for n in notes),notes
   assert all(48<=n['note']<=96 for n in notes),notes
   for n in notes:k=n['time']/(n['six']*2);assert abs(k-round(k))<1e-3,n
   assert d['diffDb']<rp['rmsDb']-25 and d['diffPeak']<rp['peak']/5,(genre,rp['rmsDb'],d)
   assert rl['peak']<.96
   # Inside a satellite: the same before it, a little lower once the bus has settled.
   plain=a.evaluate(RENDER,{'genre':genre,'rate':rate,'seconds':9});duck=a.evaluate(RENDER,{'genre':genre,'rate':rate,'seconds':9,'duck':True});a.close()
   before=max(abs(x-y) for x,y in zip(plain['windows'][:2],duck['windows'][:2]));drops=[x-y for x,y in zip(plain['windows'][7:],duck['windows'][7:])];drop=sum(drops)/len(drops)
   assert before<.01,(genre,before);assert .5<=drop<=2.2,(genre,drops)
   rows.append({'genre':genre,'rate':rate,'musicDb':round(rp['rmsDb'],1),'notesDiffDb':round(d['diffDb'],1),'notesDiffPeak':round(d['diffPeak'],4),'musicPeak':round(rp['peak'],4),'satelliteDropDb':round(drop,2)})
   print('PASS '+json.dumps(rows[-1]),flush=True)
  browser.close()
 print('PASS Recorrer lejos audio: buoy tics and satellite notes sit '+', '.join(f"{r['musicDb']-r['notesDiffDb']:.1f} dB" for r in rows)+' under the music; inside a satellite the music is '+', '.join(f"{r['satelliteDropDb']:.2f} dB" for r in rows)+' lower',flush=True)
finally:server.shutdown()
