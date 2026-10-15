"""Source isolation and original natural percussion under the actual scheduler."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  contrast=page.evaluate('''async()=>{const {createStage}=await import('/src/foreground.js'),ac=new OfflineAudioContext(1,96000,48000),stage=createStage(ac,[ac.destination,ac.destination,ac.destination]);
   for(const [f,out]of [[200,stage.inputs[0]],[1000,ac.destination]]){const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.1;o.connect(g).connect(out);o.start();}stage.focus(.4);
   const samples=(await ac.startRendering()).getChannelData(0),amp=(f,a,b)=>{let s=0,c=0;for(let i=a*48000;i<b*48000;i++){s+=samples[i]*Math.sin(2*Math.PI*f*i/48000);c+=samples[i]*Math.cos(2*Math.PI*f*i/48000);}return Math.hypot(s,c)*2/((b-a)*48000);};
   return {backingBefore:amp(200,.1,.3),backingDuring:amp(200,.5,.7),backingAfter:amp(200,1.6,1.8),playerBefore:amp(1000,.1,.3),playerDuring:amp(1000,.5,.7)};}''')
  assert contrast['backingDuring']/contrast['backingBefore']<.66 and contrast['backingAfter']/contrast['backingBefore']>.96,contrast
  assert .99<contrast['playerDuring']/contrast['playerBefore']<1.01,contrast
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{STRIKE_BODIES}=await import('/src/percussion-material.js'),out=[];
   for(const [i,kind]of Object.keys(STRIKE_BODIES).entries())out.push(await renderMix(['minimal','organic','deep'][i%3],{scene:'rhythm:'+kind,dense:true,soft:i%2===0,renderSeconds:6,sampleRate:i%2?44100:48000}));
   for(const scene of ['phenomenon:shaker','storm'])out.push(await renderMix('minimal',{scene,dense:true,renderSeconds:6}));return out;}''')
  for r in rows:
   assert 0<r['peak']<.96 and r['hotFraction']==0 and -65<r['rmsDb']<-3,r
   if r['scene'].startswith('rhythm:'):assert r['materialStrikes'] and r['foregroundNotes'],r
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'contrast':contrast,'rows':rows};(ROOT/'scripts/foreground-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} material/weather renders and isolated backing reduction with unchanged player stem; peak {report["maxPeak"]:.6f}',flush=True);b.close()
finally:server.shutdown()
