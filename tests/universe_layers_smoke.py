"""The universe's layers in the real game: Polvo draws its dust around the cube on phone and desktop, its air stays far under the music, the Void (the open sea) draws nothing and is silent."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
GO="""([want,sea])=>{const r=__r,ids=r.BIOMES.map(b=>b.id);for(let d=1;d<120;d++)for(let a=0;a<16;a++){const x=Math.round(900+Math.cos(a/16*6.283)*d*300),y=Math.round(900+Math.sin(a/16*6.283)*d*300);if(ids[r.biomeOfPos(x,y)]===want&&!!r.regionOfPos(x,y)?.sea===sea){const W=r.WCH||900;r.S.wx=Math.floor(x/W)*W+W/2;r.S.wy=Math.floor(y/W)*W+W/2;return true;}}return false;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r,q=None:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.universeLayers')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=true;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.setJourneyMode('libre');r.save();r.audio();}")
   page.wait_for_function("__r.ac?.state==='running'",timeout=10000);page.evaluate(hide)
   assert page.evaluate(GO,['llanura',False]);page.wait_for_timeout(1200);page.evaluate(hide)
   L=page.evaluate('__r.universeLayers()');assert L['cells']>40 and L['regions'].get('llanura',0)>L['cells']*.5,L
   page.evaluate("()=>{for(let i=0;i<20;i++)__r.S.wx+=4;}");page.wait_for_timeout(1500);L=page.evaluate('__r.universeLayers()')
   assert L['air']=='llanura' and 0<L['airGain']<=.0121,L
   # Amber dust on screen around the cube.
   amber=page.evaluate("()=>{const c=__r.cx,d=c.getImageData(0,0,c.canvas.width,c.canvas.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]>150&&d[i+1]>70&&d[i+1]<180&&d[i+2]<90)n++;return n;}")
   assert amber>80,amber
   for rid in ['lago','bosque','tormenta','ruinas','jardin','dunas','cristales','faros','cueva']:
    assert page.evaluate(GO,[rid,False]);page.wait_for_timeout(1300);page.evaluate(hide);L=page.evaluate('__r.universeLayers()')
    assert L['regions'].get(rid,0)>L['cells']*.4 and L['air']==rid and 0<L['airGain']<=.0121,(rid,L)
   assert page.evaluate(GO,['vacio',True]);page.wait_for_timeout(1500);L=page.evaluate('__r.universeLayers()')
   assert L['regions'].get('vacio',0)==0 and L['air']=='',L
   assert not errors,errors;page.close()
  browser.close()
 print('PASS universe layers on phone and desktop: all ten regions draw around the cube with their quiet air under the music, the Void draws nothing and is silent',flush=True)
finally:server.shutdown()
