"""Rare moments in the real game: in a region its rare moment is drawn over the World from above, counted and kept after reload; the Journey's Void has none."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1];SHOTS=os.environ.get('UNIVERSE_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
GO="""want=>{const r=__r,W=r.WCH||900,ids=r.BIOMES.map(b=>b.id);for(let d=1;d<200;d++)for(let a=0;a<32;a++){const x=Math.floor((900+Math.cos(a/32*6.283)*d*W)/W)*W+W/2,y=Math.floor((900+Math.sin(a/32*6.283)*d*W)/W)*W+W/2,here=r.newRegionAt(x,y)?.id||ids[r.biomeOfPos(x,y)];if(here===want){r.S.wx=x;r.S.wy=y;return true;}}return false;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r,q=None:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.universeRare')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.sound=false;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.setJourneyMode('libre');r.save();}")
   page.wait_for_timeout(800)
   for rid in ['lago','dunas','cristales','tormenta','cometas','nebulosa']:
    assert page.evaluate(GO,rid),rid;page.wait_for_timeout(900);page.evaluate(hide)
    before=page.evaluate("()=>{const c=__r.cx;return c.getImageData(0,0,c.canvas.width,c.canvas.height).data.reduce((s,v)=>s+v,0);}")
    page.evaluate(f"__r.universeRare({rid!r})");page.wait_for_timeout(1500)
    assert page.evaluate("__r.universeRareState().active")==rid,rid
    if SHOTS and width==390:page.screenshot(path=f'{SHOTS}/raro-{rid}.png')
   kept=page.evaluate("__r.S.universe.rare");assert all(kept.get(k,0)>=1 for k in ['lago','dunas','cristales','tormenta','cometas','nebulosa']),kept
   page.reload();page.wait_for_function('!!window.__r?.universeRare');assert page.evaluate("__r.S.universe.rare.cometas")>=1
   assert not errors,errors;page.close()
  browser.close()
 print('PASS rare moments on phone and desktop: Marea, Anillos, Prisma, Tormenta solar, Cometas and Nebulosa oscura moments drawn from above, counted and kept after reload',flush=True)
finally:server.shutdown()
