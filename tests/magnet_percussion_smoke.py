"""Native new percussion contact, muted visual feedback, catalogue and magnetic cues."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  for width,height in [(390,844),(844,390),(1280,800)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=new-percussion-{width}');page.wait_for_function('!!window.__r?.labGo')
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__r.S.sound=false;__r.S.help.mundo=true;__r.S.firstJourney={version:1,skipped:true,facts:{}};")
   for kind in ['membrane','leafbrush','clayshell','seedshaker','pebblerim','petalclap']:
    page.evaluate('(k)=>__r.labGo("rhythm:"+k)',kind);page.wait_for_timeout(250);page.evaluate('()=>{const o=__r.nearbyPercussion()[0];__r.S.wx=o.x;__r.S.wy=o.y;}');page.wait_for_function('(k)=>!!__r.S.rhythmFound?.[k]',arg=kind);assert page.evaluate('__r.nearbyPercussion()[0].visualAt>0');assert page.evaluate('__r.percussionSources()[0].voice.role')=='perc';assert page.evaluate('(k)=>!!__r.S.elementBook.found["rhythm:"+k]',kind)
   # Existing voices run on the same beat with a bounded, lit magnetic group.
   assert page.evaluate("""()=>{const r=__r;r.givePower('iman');r.S.sound=false;window.__magnet=[];r.magnetVoiceCue=n=>__magnet.push(n);r.MU.near=Array.from({length:4},(_,i)=>({id:'native-magnet:'+i,x:r.S.wx+i*12+20,y:r.S.wy,snd:t=>r.playVoice('arbol',i,t,r.MU.dnaT,false,.4)}));const before=r.MU.near.map(o=>({x:o.x,y:o.y}));r.cajasTick(.05);return r.hasPower('iman')&&r.MU.near.length===4&&r.MU.near.some((o,i)=>o.x!==before[i].x||o.y!==before[i].y);}""") is True
   page.screenshot(path=f'/tmp/whitedot-new-percussion-{width}.png');page.evaluate('__r.clearPowers();__r.save()');page.reload();page.wait_for_function('!!window.__r?.labGo');assert page.evaluate('["membrane","leafbrush","clayshell","seedshaker","pebblerim","petalclap"].every(k=>__r.S.rhythmFound[k]&&__r.S.elementBook.found["rhythm:"+k])')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;print(f'PASS six native percussion contacts, visual response in mute, role/catalogue, reversible magnet and saved discoveries at {width}',flush=True)
  browser.close()
finally:server.shutdown()
