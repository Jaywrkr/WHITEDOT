"""Actual cube mode: a guardian, ordered clues/door, three saved relics, laboratory, vast worlds and visible autopilot."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(844,390)]:
   context=browser.new_context(viewport={'width':width,'height':height},has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=vasto&generation=2')
   page.wait_for_function('window.__testRuntime?.labMode');page.evaluate("__testRuntime.labGo('culture:altiplano')")
   page.wait_for_function('__testRuntime.cultureHome()!==null');assert page.evaluate('__testRuntime.REG')==20;assert not page.evaluate('__testRuntime.fingerTouch')
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
   # Pause at a guardian must not complete listening.
   page.evaluate("()=>{const r=__testRuntime,s=r.cultureHome();r.S.wx=s.x;r.S.wy=s.y;r.S.sound=false}")
   page.wait_for_timeout(1200);assert not page.evaluate("__testRuntime.S.cultures.sites[__testRuntime.cultureHome().id]?.heard")
   page.evaluate("()=>{__testRuntime.S.sound=true;__testRuntime.audio()}")
   for chapter in range(3):
    page.evaluate("()=>{const r=__testRuntime,s=r.cultureHome();r.S.wx=s.x;r.S.wy=s.y;window.__site=s}")
    page.wait_for_function(f'__testRuntime.S.cultures.sites[__site.id]?.heard && __testRuntime.S.cultures.sites[__site.id].chapter==={chapter}',timeout=15000)
    route=page.evaluate(f'__site.routes[{chapter}]')
    # Arriving at the door early is insufficient; clues are ordered and persistent.
    for clue in route['clues']:
     page.evaluate('(p)=>{__testRuntime.S.wx=p.x;__testRuntime.S.wy=p.y}',clue);page.wait_for_timeout(180)
    page.wait_for_function('__testRuntime.S.cultures.sites[__site.id].clues===2')
    for index in route['order']:
     page.evaluate('(p)=>{__testRuntime.S.wx=p.x;__testRuntime.S.wy=p.y}',route['stones'][index]);page.wait_for_timeout(200)
    page.wait_for_function('__testRuntime.S.cultures.sites[__site.id].open')
    page.evaluate('(p)=>{__testRuntime.S.wx=p.x;__testRuntime.S.wy=p.y}',route['relic']);page.wait_for_function(f'__testRuntime.S.cultures.collections.altiplano==={chapter+1}')
   assert page.evaluate('__testRuntime.S.rareBook.items.filter(c=>c.type==="culture:artifact").length')==3
   assert page.evaluate('__testRuntime.cultureHome().residents.length')==2
   page.screenshot(path=f'/tmp/whitedot-cultures-{width}.png');page.reload();page.wait_for_function('__testRuntime?.labMode');assert page.evaluate('__testRuntime.S.cultures.collections.altiplano')==3
   # The compact visible control starts/stops travel without sending a sonar.
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");assert page.locator('#bAuto').is_visible()
   page.locator('#bAuto').click();assert page.evaluate('__testRuntime.autopilotState.mode')=='wander';page.locator('#bAuto').click();assert page.evaluate('__testRuntime.autopilotState.mode') is None
   page.evaluate("__testRuntime.labGo('life:golondrina')")
   page.wait_for_function('__testRuntime.body.ready&&!__testRuntime.body.jump&&Math.abs(__testRuntime.body.x-__testRuntime.S.wx)<1')
   page.evaluate("()=>{const r=__testRuntime,f=r.nearbyFlocks(500).find(f=>f.species==='golondrina');window.__flock=f;f.trust=1;f.follow=45;f.formation=119.99;r.body.speed=100;r.body.vx=100}")
   page.evaluate("async()=>{for(let i=0;i<12;i++){__testRuntime.S.wx+=2;await new Promise(f=>requestAnimationFrame(f));}}")
   page.wait_for_function('__testRuntime.S.formationGifts[__flock.id]===true')
   # Reset/replacement of the save must discard traveling flocks and initialize gift storage.
   page.evaluate("()=>{const r=__testRuntime;r.S={...r.S,vida:undefined,formationGifts:undefined,cultures:undefined};if(r.cultureCard()!=='')throw Error('stale culture journal after reset');r.cultureTargets();}")
   page.wait_for_function('__testRuntime.S.formationGifts!==undefined')
   assert page.evaluate('Object.keys(__testRuntime.S.formationGifts).length')==0
   assert not errors,errors;print(f'PASS {width}x{height}: cube guardian/ordered clues/door, three persistent memories, mute, vast identity and visible auto',flush=True);context.close()
  browser.close()
finally:server.shutdown()
