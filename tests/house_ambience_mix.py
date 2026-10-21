"""House room ambience rendered offline: quiet air per room (leaves, wind, hum), silence in the Sala, never loud."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/tests/')
  rows=page.evaluate('''async()=>{const {createAmbience}=await import('/src/house-audio.js'),out=[];
   for(const rate of [44100,48000])for(const room of ['sala','jardin','azotea','sotano']){const ac=new OfflineAudioContext(2,rate*4,rate),noise=ac.createBuffer(1,rate*2,rate),d=noise.getChannelData(0);let s=12345;for(let i=0;i<d.length;i++){s=(s*1103515245+12345)&0x7fffffff;d[i]=s/0x3fffffff-1;}
    const amb=createAmbience(ac,ac.destination,noise);amb.set(room,0,true);amb.set(room,3,false);const buf=await ac.startRendering(),ch=buf.getChannelData(0);let peak=0,sum=0,n=0;for(let i=rate;i<rate*3;i++){peak=Math.max(peak,Math.abs(ch[i]));sum+=ch[i]*ch[i];n++;}
    let tail=0;for(let i=Math.floor(rate*3.9);i<rate*4;i++)tail=Math.max(tail,Math.abs(ch[i]));out.push({rate,room,peak,rms:Math.sqrt(sum/n),tail});}return out;}''')
  for r in rows:
   assert r['peak']<.08,r
   if r['room']=='sala':assert r['rms']<1e-4,r
   else:assert r['rms']>1e-4,r
   assert r['tail']<r['peak']*.6+1e-6,('fades out after leaving',r)
  (ROOT/'scripts/house-ambience-audio-validation.json').write_text(json.dumps({'renders':len(rows),'rows':rows},indent=2)+'\n')
  print('PASS house ambience: still Sala, leaves, wind and hum below 0.08 peak at 44.1/48 kHz, fading out on leaving',flush=True);browser.close()
finally:server.shutdown()
