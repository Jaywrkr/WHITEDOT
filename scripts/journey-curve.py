"""Journey curve (docs/VIAJE.md, Phase 7): plays the whole Journey (Llanura to the finale) as a simulated player and records every half second the output level, the voices started (density, the panel's measure of intensity) and the chapter state. Usage: python3 scripts/journey-curve.py [out.json]"""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,json,math,os,shutil,sys
from itertools import groupby
ROOT=Path(__file__).resolve().parents[1];OUT=Path(sys.argv[1]) if len(sys.argv)>1 else None
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
ON="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),d=Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(d<.02){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
GO="""want=>{const r=__r,ids=r.BIOMES.map(b=>b.id);for(let d=1;d<80;d++)for(let a=0;a<16;a++){const x=Math.round(r.S.wx+Math.cos(a/16*6.283)*d*300),y=Math.round(r.S.wy+Math.sin(a/16*6.283)*d*300);if(ids[r.biomeOfPos(x,y)]===want&&(want==='vacio'||!r.regionOfPos(x,y)?.sea)){r.S.wx=x;r.S.wy=y;return true;}}return false;}"""
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 p=b.new_page(viewport={'width':390,'height':844})
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{srv.server_port}/');p.wait_for_function('!!window.__r?.journeyChapter')
 hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
 p.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.journey.mode='viaje';s.journey.chapter=0;s.journey.colors={};s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();r.audio();r.applyJourneyMode();}")
 p.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000);p.evaluate(hide)
 p.evaluate("""()=>{const r=__r,an=r.ac.createAnalyser();window.__n=0;for(const k of ['createOscillator','createBufferSource']){const f=r.ac[k].bind(r.ac);r.ac[k]=(...a)=>{window.__n++;return f(...a);};}let lastN=0;an.fftSize=2048;r.bus.connect(an);const buf=new Float32Array(2048);window.__log=[];const t0=performance.now();
  setInterval(()=>{let peak=0,sum=0;for(let k=0;k<5;k++){an.getFloatTimeDomainData(buf);for(const v of buf){sum+=v*v;peak=Math.max(peak,Math.abs(v));}}const ch=r.journeyChapter(),fin=r.journeyFinaleState();
   const voices=window.__n-lastN;lastN=window.__n;window.__log.push({voices,t:(performance.now()-t0)/1000,rms:Math.sqrt(sum/(buf.length*5)),peak,cap:r.MU.journeyCap,chapter:fin.running?'final':ch.id,state:fin.running?'final':ch.state});},500);}""")
 p.wait_for_function("__r.journeyChapter().id==='llanura'",timeout=10000)
 def pulses(n,walk=True):
  for i in range(n):
   p.evaluate(ON);p.wait_for_timeout(300)
   if walk:p.evaluate("__r.S.wx+=6")
 def chapter(id,quiet=12,first=3,rest=3,after=8,silence=False):
  p.evaluate(GO,id);p.wait_for_function(f"__r.BIOMES[__r.curZone]?.id==='{id}'",timeout=8000);p.evaluate(hide)
  p.wait_for_timeout(quiet*1000)
  if silence:p.wait_for_timeout(14000)
  pulses(first);p.wait_for_timeout(6000);pulses(rest)
  p.wait_for_function("__r.journeyChapter().portal",timeout=20000);p.wait_for_timeout(after*1000)
  p.evaluate("()=>{const r=__r,q=r.journeyChapter().portal;r.S.wx=q.x;r.S.wy=q.y;}");p.wait_for_timeout(800)
 chapter('llanura');chapter('lago');chapter('bosque',silence=True);chapter('tormenta');chapter('vacio',first=8,rest=4)
 p.wait_for_function("__r.journeyFinaleState().running",timeout=5000);p.wait_for_function("!__r.journeyFinaleState().running",timeout=60000);p.wait_for_timeout(1500)
 log=p.evaluate("__log")
 if OUT:OUT.write_text(json.dumps(log))
 # One line per chapter state: mean level, voices started per second (density) and seconds.
 for (ch,st),g in groupby(log,key=lambda e:(e['chapter'],e['state'])):
  g=list(g);print(f"{ch:9s} {str(st):12s} {20*math.log10(sum(e['rms'] for e in g)/len(g)+1e-9):6.1f} dB  {2*sum(e['voices'] for e in g)/len(g):5.1f} voices/s  {len(g)/2:4.0f} s",flush=True)
 b.close()
srv.shutdown()
