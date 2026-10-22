"""How different the 52 genres really sound (docs/UNIVERSO.md, phase 7).

Renders every genre through the real scheduler (tests/audio_mix.mjs, offline) and measures, from the audio itself:
- tempo: the genre's beat in BPM;
- rhythm: where the energy falls across a bar, as 16 steps (onset strength folded on the bar);
- timbre: energy in 8 frequency bands, from sub bass to air;
- density: how much of the time something starts.
Then compares every pair and lists the closest ones. The line is how far the same genre lies from itself in other
variations (the largest of several, plus a quarter): two genres under it are harder to tell apart than one genre from
itself. It is a measure to guide listening, not an artistic judgement.

Usage: python3 scripts/genre-distance.py [out_dir] [--seconds 12] [--clips 10]
Writes report.json and, for the closest pairs, short MP3 clips to listen side by side. Output stays out of Git."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json,argparse,base64,subprocess,wave,math
ROOT=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('out',nargs='?',default=str(ROOT/'outputs'/'generos'));ap.add_argument('--seconds',type=int,default=12);ap.add_argument('--clips',type=int,default=10);ap.add_argument('--only',default='');ap.add_argument('--calibrate',type=int,default=8)
args=ap.parse_args();OUT=Path(args.out);OUT.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Features computed in the page from the rendered buffer: band energies with a small FFT and onset strength per hop.
FEATURES="""(buffer,bpm)=>{const sr=buffer.sampleRate,a=buffer.getChannelData(0),b=buffer.getChannelData(1),start=sr*2,N=1024,hop=512,bands=[0,60,150,400,1000,2500,6000,12000,24000];
 const fft=(re,im)=>{const n=re.length;for(let i=1,j=0;i<n;i++){let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]];}}
  for(let len=2;len<=n;len<<=1){const ang=-2*Math.PI/len;for(let i=0;i<n;i+=len)for(let k=0;k<len/2;k++){const c=Math.cos(ang*k),s=Math.sin(ang*k),xr=re[i+k+len/2]*c-im[i+k+len/2]*s,xi=re[i+k+len/2]*s+im[i+k+len/2]*c;re[i+k+len/2]=re[i+k]-xr;im[i+k+len/2]=im[i+k]-xi;re[i+k]+=xr;im[i+k]+=xi;}}};
 const band=new Float64Array(8),flux=[];let prev=null,frames=0;
 for(let p=start;p+N<=a.length;p+=hop){const re=new Float64Array(N),im=new Float64Array(N);for(let i=0;i<N;i++){const w=.5-.5*Math.cos(2*Math.PI*i/N);re[i]=(a[p+i]+b[p+i])*.5*w;}fft(re,im);
  const mag=new Float64Array(N/2);for(let k=0;k<N/2;k++)mag[k]=Math.hypot(re[k],im[k]);
  for(let k=1;k<N/2;k++){const f=k*sr/N;for(let q=0;q<8;q++)if(f>=bands[q]&&f<bands[q+1]){band[q]+=mag[k]*mag[k];break;}}
  let fl=0;if(prev)for(let k=1;k<N/2;k++){const d=Math.log1p(mag[k]*50)-Math.log1p(prev[k]*50);if(d>0)fl+=d;}flux.push(fl);prev=mag;frames++;}
 const total=band.reduce((s,v)=>s+v,0)||1,timbre=[...band].map(v=>10*Math.log10(Math.max(v/total,1e-4)));
 const mean=flux.reduce((s,v)=>s+v,0)/flux.length||0,sd=Math.sqrt(flux.reduce((s,v)=>s+(v-mean)**2,0)/flux.length)||1;
 const hopS=hop/sr,step=60/bpm/4,rhythm=new Array(16).fill(0),count=new Array(16).fill(0);let onsets=0;
 flux.forEach((v,i)=>{const z=(v-mean)/sd;if(z>1)onsets++;const s=Math.floor(((i*hopS)/step))%16;rhythm[s]+=Math.max(0,z);count[s]++;});
 const rh=rhythm.map((v,i)=>v/(count[i]||1)),norm=Math.hypot(...rh)||1;
 let sum=0,peak=0;for(let i=start;i<a.length;i++){sum+=a[i]*a[i];peak=Math.max(peak,Math.abs(a[i]));}
 return {timbre,rhythm:rh.map(v=>v/norm),density:onsets/flux.length,rmsDb:10*Math.log10(sum/(a.length-start)+1e-12),peak};}"""
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_timeout(500)
 genres=page.evaluate("""async()=>{const r={};const m=await import('/src/data.js');m.initialize(r);return Object.entries(r.GEN).map(([id,g])=>({id,name:g.name,bpm:(g.bpm[0]+g.bpm[1])/2}));}""")
 if args.only:genres=[g for g in genres if g['id'] in args.only.split(',')]
 def render(g,key=None):
  page.goto(f'http://127.0.0.1:{server.server_port}/')
  return page.evaluate("""async([g,seconds,features,key])=>{const f=eval(features);let captured=null;window.__mixCapture=b=>{captured={features:f(b,g.bpm),pcm:(()=>{const d=b.getChannelData(0),step=Math.round(b.sampleRate/22050),out=new Int16Array(Math.floor(d.length/step));for(let i=0;i<out.length;i++)out[i]=Math.max(-1,Math.min(1,d[i*step]))*32767;let s='';const u=new Uint8Array(out.buffer);for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode(...u.subarray(i,i+32768));return btoa(s);})()};};
   const {renderMix}=await import('/tests/audio_mix.mjs');await renderMix(g.id,{renderSeconds:seconds,sampleRate:44100,...(key?{identityKey:key}:{})});return captured;}""",[g,args.seconds,FEATURES,key])
 rows=[]
 for i,g in enumerate(genres):
  out=render(g)
  w=wave.open(str(OUT/f"{g['id']}.wav"),'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(22050);w.writeframes(base64.b64decode(out['pcm']));w.close()
  rows.append({**g,**out['features']});print(f"{i+1}/{len(genres)} {g['id']} {out['features']['rmsDb']:.1f} dB",flush=True)
 # Calibration: the same genre rendered with two other variations. Two genres closer than the same genre is to
 # itself are hard to tell apart.
 calib=[]
 for g in genres[:args.calibrate]:
  a,b=render(g,'calibrate:a'),render(g,'calibrate:b');calib.append((g,a['features'],b['features']))
 browser.close()
server.shutdown()
# Distance: tempo (a doubling counts as close), rhythm shape, timbre and density, each scaled to about 0..1.
def tempo(a,b):r=max(a,b)/min(a,b);r=min(r,abs(r-2)+1,abs(r-.5)+1);return min(1,(r-1)/.25)
def dist(a,b):
 rh=1-sum(x*y for x,y in zip(a['rhythm'],b['rhythm']))
 tb=math.sqrt(sum((x-y)**2 for x,y in zip(a['timbre'],b['timbre']))/8)/10
 return round(.35*tempo(a['bpm'],b['bpm'])+.35*min(1,rh*2)+.2*min(1,tb)+.1*min(1,abs(a['density']-b['density'])*5),3)
pairs=sorted(({'a':rows[i]['id'],'b':rows[j]['id'],'distance':dist(rows[i],rows[j])} for i in range(len(rows)) for j in range(i+1,len(rows))),key=lambda p:p['distance'])
self=[dist({**g,**a},{**g,**b}) for g,a,b in calib]
LINE=round(max(self)*1.25,3) if self else .2
report={'genres':len(rows),'line':LINE,'sameGenre':[{'id':g['id'],'distance':d} for (g,_,_),d in zip(calib,self)],'close':[p for p in pairs if p['distance']<LINE],'closest':pairs[:30],'nearest':{r['id']:min((p for p in pairs if r['id'] in (p['a'],p['b'])),key=lambda p:p['distance']) for r in rows} if pairs else {},'rows':rows}
(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=1))
# Clips for listening: the closest pairs, 8 s each, one after the other with a short silence.
clips=OUT/'parejas';clips.mkdir(exist_ok=True)
for p in pairs[:args.clips]:
 subprocess.run(['ffmpeg','-y','-loglevel','error','-t','8','-i',str(OUT/f"{p['a']}.wav"),'-t','8','-i',str(OUT/f"{p['b']}.wav"),'-filter_complex','[0][1]concat=n=2:v=0:a=1,apad=pad_dur=0','-b:a','128k',str(clips/f"{p['a']}-vs-{p['b']}.mp3")],check=True)
print(f"PASS measured {len(rows)} genres: {len(report['close'])} pairs under the line {LINE}"+(f"; closest {pairs[0]['a']}~{pairs[0]['b']} ({pairs[0]['distance']})" if pairs else ""),flush=True)
