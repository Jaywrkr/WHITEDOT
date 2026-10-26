"""Visible walking distance, silent return, fresh places and meaningful edge colors."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(has_touch=True);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   if page.url!='about:blank':page.evaluate('localStorage.clear()')
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.playerProfile')
   assert page.locator('#returnEntrance').is_visible(),'first visit greets before the original tutorial'
   page.locator('#returnContinue').click()
   assert page.locator('#mHelpC').is_visible()
   previous=page.evaluate('''()=>{const r=__r,s=r.S;document.querySelectorAll('.modal').forEach(e=>e.hidden=true);s.sound=false;s.help.camino=s.help.mundo=true;s.todayLight=10;s.pathCrystals=Array.from({length:10},(_,i)=>'journey:'+i);s.lastWorldDay='2000-01-01';s.mode='world';s.ach.mundo='earned';s.firstJourney.skipped=true;s.arrivalMode='continue';r.save();return {x:s.wx,y:s.wy};}''')
   page.reload();page.wait_for_function('!!window.__r?.showReturnEntrance');assert page.locator('#returnEntrance').is_visible();assert len(page.locator('#returnPhrase').inner_text().split())<=12
   page.locator('#returnContinue').click();assert page.locator('#returnEntrance').is_hidden()
   assert page.evaluate('p=>Math.hypot(__r.S.wx-p.x,__r.S.wy-p.y)>500',previous)
   assert page.locator('#walkDistance').is_hidden(),'panel 10 (P8): distance lives in the Bitácora (Tú), not the HUD';rect=page.locator('#sparkCount').bounding_box();assert rect and rect['y']>=0 and rect['y']+rect['height']<height and rect['x']+rect['width']<=width
   before=page.evaluate('__r.playerProfile.distanceUnits');page.keyboard.down('d');page.wait_for_timeout(280);page.keyboard.up('d');page.wait_for_timeout(100)
   assert page.evaluate('__r.playerProfile.distanceUnits')>before+10;assert page.locator('#walkDistance').text_content()!='Caminado · 0 m'
   before=page.evaluate('__r.playerProfile.distanceUnits');page.evaluate('__r.S.wx+=1');page.wait_for_timeout(80);assert page.evaluate('__r.playerProfile.distanceUnits')==before
   page.evaluate('__r.S.sparks=20;__r.sparkEconomy.earned=20');assert page.evaluate('__r.jumpPracticePlace()');page.wait_for_timeout(80);assert page.evaluate('__r.playerProfile.distanceUnits')==before
   page.evaluate('''async()=>{const r=__r,{distantDirections}=await import('/src/distant-colors.js'),size=r.REG*r.WCH;for(let x=0;x<8;x++)for(let y=0;y<8;y++){const px=(x+.5)*size,py=(y+.5)*size;if(distantDirections(px,py,size,r.W,r.H,r.regionOfPos,r.seedOf).length===2){r.S.wx=px;r.S.wy=py;return;}}throw Error('No real musical horizon');}''')
   page.wait_for_function('__r.distantSignals.filter(s=>s.opacity>.3).length>=2')
   assert page.evaluate('''()=>__r.distantSignals.every(s=>{const d=__r.regionOfPos(s.target.x,s.target.y);return d.key===s.key&&!d.sea;})''')
   tint=page.evaluate('({r:__r.worldVisibility.red,g:__r.worldVisibility.green,b:__r.worldVisibility.blue})');assert all(0<=v<=255 for v in tint.values())
   assert page.evaluate('!__r.ac&&__r.waves.length===0'),'muted walking and UI must not allocate audio or create pulses'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   page.screenshot(path=str(ROOT.parent/f'journey-{width}.png'));print('PASS visible walking distance, zero jump distance, fresh silent return, real colored horizons and contained UI at '+str(width),flush=True)
  browser.close()
finally:server.shutdown()
