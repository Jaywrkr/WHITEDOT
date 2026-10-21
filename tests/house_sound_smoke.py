"""Sounding dollhouse: walking past an object plays it, a pulse plays the nearby objects and makes creatures chirp, each room has its own air and it fades on leaving."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':1280,'height':800});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=house-sound&layout=wide');page.wait_for_function('!!window.__r?.enterHouse&&!!window.__r?.houseSounds')
  hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
  page.evaluate("""()=>{"""+hide+""";const r=__r,s=r.S;s.sound=true;s.totalDays=14;s.livingSeen={...(s.livingSeen||{}),deer:true};
   s.house={...s.house,objects:[{kind:'obj:origen',room:'sala',x:.7,y:.5}],playerRoom:'sala'};r.save();r.audio();window.__plays=[];r.houseAudioCue=n=>__plays.push(n);r.enterHouse();}""")
  page.wait_for_function("__r.ac?.state==='running'&&__r.houseSettled()",timeout=10000)
  # Walking past the object plays it once, not on every frame.
  page.evaluate("__r.houseWalkTo('sala',.95)");page.wait_for_function("__r.houseSettled()&&__r.houseStand().fx>500",timeout=8000)
  sounds=page.evaluate('__r.houseSounds()');assert sounds['brush']==1,sounds
  page.wait_for_function("__plays.some(n=>n.kind==='obj:origen')",timeout=4000)
  # The Sala is quiet air; the Jardín has its own, and leaving the house fades it.
  page.wait_for_function("__r.houseSounds().ambience==='sala'",timeout=4000)
  page.evaluate("__r.houseWalkTo('jardin',.5)");page.wait_for_function("__r.houseStand().room==='jardin'",timeout=8000);page.wait_for_function("__r.houseSounds().ambience==='jardin'",timeout=4000)
  # A pulse next to a creature: it chirps back and the nearby object answers.
  spot=page.evaluate("async()=>{const v=await import('/src/house-view.js'),c=__r.houseCollectionState().creatures.find(c=>c.id==='deer'),b=v.roomBox(c.room);return {room:c.room,x:Math.max(0,Math.min(1,(c.x-b.x-18)/(b.w-36)))};}")
  page.evaluate(f"__r.houseWalkTo('{spot['room']}',{spot['x']})");page.wait_for_function("__r.houseSettled()",timeout=15000)
  page.evaluate("()=>{"+hide+";__r.housePulse();}");page.wait_for_timeout(400)
  assert page.evaluate('__r.houseSounds().pulse')==1;assert page.evaluate('__r.houseCollectionState().chirps')>=1,page.evaluate('__r.houseCollectionState()')
  page.evaluate('__r.exitHouse()');page.wait_for_function("__r.houseSounds().ambience===''",timeout=4000)
  # Muted: walking past makes no sound at all.
  page.evaluate("()=>{const r=__r;r.S.sound=false;__plays.length=0;r.S.house.playerRoom='sala';r.save();"+hide+";r.enterHouse();}");page.wait_for_function('__r.houseSettled()')
  page.evaluate("__r.houseWalkTo('sala',.2)");page.wait_for_function("__r.houseSettled()",timeout=8000);page.evaluate("__r.houseWalkTo('sala',.95)");page.wait_for_function("__r.houseSettled()",timeout=8000)
  assert page.evaluate('__plays.length')==0
  assert not errors,errors;browser.close()
 print('PASS sounding dollhouse: an object plays once when passed, room air for Sala and Jardín fading on leaving, a pulse makes a creature chirp, silence when muted',flush=True)
finally:server.shutdown()
