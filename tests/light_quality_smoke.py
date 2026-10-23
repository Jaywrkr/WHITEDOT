"""Light quality that really lightens (phase 4 of the plan): in the World, the light setting draws far fewer points per
frame than the high one (the universe's layers and the pixel life were not reduced before), and `?medir=1` shows the
frame times in a corner to read them on a phone."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Counts the points really painted (the prototype's fillRect) per animation frame.
COUNT="""(()=>{const P=CanvasRenderingContext2D.prototype,fill=P.fillRect;window.__rects=0;P.fillRect=function(...a){window.__rects++;return fill.apply(this,a);};})();"""
PER_FRAME="""()=>new Promise(res=>{let n=0;const start=window.__rects;const tick=()=>{if(++n>40)return res((window.__rects-start)/40);requestAnimationFrame(tick);};requestAnimationFrame(tick);})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script(COUNT)
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?medir=1');page.wait_for_function('!!window.__r?.enterWorld')
  hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
  page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();}")
  page.wait_for_timeout(1500);page.evaluate(hide)
  page.evaluate("()=>{__r.S.quality='alta';__r.$('graphicsQuality').value='alta';__r.$('graphicsQuality').onchange({target:{value:'alta'}});}");page.wait_for_timeout(400);high=page.evaluate(PER_FRAME)
  page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'ligera'}});}");page.wait_for_timeout(400);assert page.evaluate('__r.lightQuality()');light=page.evaluate(PER_FRAME)
  print(f'points per frame: high {high:.0f}, light {light:.0f} ({light/high:.0%})',flush=True)
  assert high>500 and light<=high*.62,(high,light)
  # The meter: frame times in a corner, never under 11 px.
  page.wait_for_function("document.getElementById('frameMeter')?.textContent.startsWith('p50')",timeout=5000)
  t=page.evaluate('__r.frameTimes()');assert t['n']>30 and t['p95']>=t['p50']>0 and t['light'],t
  assert page.evaluate("parseFloat(getComputedStyle(document.getElementById('frameMeter')).fontSize)")>=11
  assert not errors,errors;browser.close()
 print('PASS light quality: the World draws far fewer points per frame in light than in high, and ?medir=1 shows p50/p95 frame times',flush=True)
finally:server.shutdown()
