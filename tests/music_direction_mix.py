"""Real room tails and scheduler output for the production directions."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  tail=page.evaluate('''async()=>{const {createProductionRooms}=await import('/src/music-direction.js');
   async function render(space){const ac=new OfflineAudioContext(1,48000*4,48000),bank=createProductionRooms(ac,seconds=>{const b=ac.createBuffer(1,Math.ceil(48000*seconds),48000),v=b.getChannelData(0);for(let i=0;i<v.length;i++)v[i]=Math.sin(i*.173)*Math.exp(-i/(48000*seconds)*5);return b;},ac.destination),input=ac.createGain();bank.connect(input);bank.set(space,0);const s=ac.createBufferSource(),impulse=ac.createBuffer(1,4800,48000);impulse.getChannelData(0)[0]=.3;s.buffer=impulse;s.connect(input);s.start(1);const v=(await ac.startRendering()).getChannelData(0);let early=0,late=0;for(let i=48000;i<v.length;i++){if(i<1.3*48000)early+=v[i]**2;if(i>1.8*48000)late+=v[i]**2;}return {early,late};}return {dry:await render(0),open:await render(1)};}''')
  assert tail['dry']['early']>0 and tail['open']['late']>0,tail
  assert tail['dry']['late']<tail['open']['late']*.01,tail
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const genre of ['minimal','deep','organic','robotic','breaks','brokenbeat','melodic','nudisco','downtempo','dub','ambient','cosmic'])for(const soft of [false,true]){const row=await renderMix(genre,{livingMusic:true,dense:true,soft,sampleRate:soft?44100:48000,renderSeconds:6});if(!row.productionSpaces.length)throw Error('Production routing never reached the scheduler');out.push(row);}return out;}''')
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0 and -65<row['rmsDb']<-3,row
   assert all(0<=s['feedback']<=.6 and 0<=s['space']<=1 and 0<s['room']<=.9 for s in row['productionSpaces']),row
  volume=page.evaluate("""async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];for(const level of [1,.5,0])out.push(await renderMix('minimal',{dense:true,fx:true,outputVolume:level,renderSeconds:6}));return out;}""")
  assert volume[2]['peak']==0,volume[2]
  assert abs(volume[1]['peak']/volume[0]['peak']-.5)<.001,volume[:2]
  assert abs(volume[1]['rmsDb']-volume[0]['rmsDb']+6.0206)<.02,volume[:2]
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'tail':tail,'volumeRenders':len(volume),'volume':volume,'rows':rows};(ROOT/'scripts/pulido-02-direction-audio.json').write_text(json.dumps(report,indent=2)+'\n')
  print(f'PASS {len(rows)} directed mixes, 44.1/48 kHz, bounded peaks and measured short/open room-tail contrast',flush=True);b.close()
finally:server.shutdown()
