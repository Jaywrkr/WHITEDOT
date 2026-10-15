"""Learned articulation changes the actual living voice, with no UI playback."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {initialize:instruments}=await import('/src/instruments.js'),{initialize:living}=await import('/src/living-synthesis.js'),rows=[];for(const rate of [44100,48000])for(const mode of ['normal','muted','ghost']){const ac=new OfflineAudioContext(1,rate*3,rate),bus=ac.createGain();bus.connect(ac.destination);const r={ac:new Proxy(ac,{get:(t,k)=>k==='state'?'running':typeof t[k]==='function'?t[k].bind(t):t[k]}),bus,S:{mode:'world'},hz:n=>440*2**((n-69)/12),cardTechnique:()=>mode};instruments(r);living(r);r.livingSynthesis({role:'lead',instrument:'silkpluck',labTerritory:'silk',score:{attack:.01,decay:1.5},material:'cuerda'},60,0,.05,{id:'known',variant:1});const data=(await ac.startRendering()).getChannelData(0);let energy=0,peak=0;for(const v of data){if(!Number.isFinite(v))throw Error('Nonfinite learned voice');energy+=v*v;peak=Math.max(peak,Math.abs(v));}if(!(peak>0&&peak<.15))throw Error('Invalid learned voice');rows.push({rate,mode,energy,peak});}return rows;}''')
  for rate in [44100,48000]:
   cases={r['mode']:r for r in rows if r['rate']==rate};assert cases['normal']['energy']>cases['muted']['energy'] and cases['normal']['energy']>cases['ghost']['energy']
  (ROOT/'scripts/experience-learning-audio-validation.json').write_text(json.dumps({'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'rows':rows},indent=2)+'\n');print('PASS six real living-voice renders: learned muted/ghost change energy at 44.1/48 kHz');b.close()
finally:server.shutdown()
