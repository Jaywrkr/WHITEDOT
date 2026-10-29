"""Descubrir (alpha.240) · Rumores in the real game, on phone and desktop. Catching a real living encounter brings the
first rumor: a short notice «Rumor · Dicen que al …, a N km, …», saved, at the distance and in the direction it says. It
is on the Mapa del universo as a white «?»; its card says the rumor and offers «Marcar», which the compass follows. The
Bitácora lists it (where it is now, «Marcado», «Soltar»). Three at most open; something completed with three open brings
none; «Soltar» lets one go without a trace; walking there fulfils it (a notice, the Bitácora notes it, the mark goes).
Everything survives a reload. Never in the Refugio. In English the notice and the album speak English."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,re,math
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('DESCUBRIR_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# A living encounter caught for real: pulses on time beside the moth until it is caught (tests/live_encounters_smoke.py).
CATCH="""async()=>{const r=__r;for(let i=0;i<40;i++){const s=r.liveEncounterState().scene;if(!s||s.stage!=='run')break;r.S.wx=s.x-40;r.S.wy=s.y;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});await new Promise(f=>setTimeout(f,120));}
 const s=r.liveEncounterState().scene;return s&&{stage:s.stage}}"""
DIRS={'al este':(1,0),'al sureste':(1,1),'al sur':(0,1),'al suroeste':(-1,1),'al oeste':(-1,0),'al noroeste':(-1,-1),'al norte':(0,-1),'al noreste':(1,-1)}
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.discoverState&&__r.ringState?.().active&&!!__r.liveEncounterSpawn",timeout=20000)
 page.evaluate(FREE);page.wait_for_timeout(300);return page,errors
def catch(page):
 assert page.evaluate("__r.liveEncounterSpawn('polilla')");got=page.evaluate(CATCH);assert got and got['stage']=='caught',got
 page.wait_for_function("!__r.liveEncounterState().scene",timeout=8000)
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   page,errors=page_for(browser,width,height)
   st=page.evaluate("__r.discoverState()");assert st['allowed'] and st['rumors']['open']==[] and st['rumors']['n']==0,st
   # --- Something completed in the open universe: the first rumor always comes.
   home=page.evaluate("({x:__r.S.wx,y:__r.S.wy})");catch(page)
   page.wait_for_function("__r.discoverState().rumors.open.length===1",timeout=5000)
   r1=page.evaluate("__r.discoverState().rumors.open[0]");m=re.fullmatch(r'Dicen que (al [a-z]+), a (\d+) km, (.+)\.',r1['text']);assert m,r1['text']
   assert len(r1['text'])<=90 and r1['kind'] in ('figure','rare','landmark','sound','region'),r1
   # At the distance and in the direction it says (within a rounding and a step of the catch).
   frm=page.evaluate("({x:__r.S.wx,y:__r.S.wy})");dx,dy=r1['x']-frm['x'],r1['y']-frm['y'];km=math.hypot(dx,dy)/10000
   assert abs(km-int(m.group(2)))<=1,(km,m.group(2));ex,ey=DIRS[m.group(1)];ang=math.degrees(math.atan2(dy,dx));want=math.degrees(math.atan2(ey,ex));assert abs((ang-want+180)%360-180)<=23,(ang,want)
   page.wait_for_function("document.getElementById('toast').textContent.startsWith('Rumor · Dicen que')",timeout=12000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/rumores-aviso-{width}.png')
   # --- On the Mapa del universo: a white «?» whose card says the rumor and offers «Marcar».
   page.evaluate(HIDE);assert page.evaluate("__r.openUniverseMap('universo')");page.wait_for_timeout(300)
   # The universe zoom fits what you discovered, not what you only heard of: zoom out with the wheel until it shows.
   for _ in range(12):
    if any(d['kind']=='rumor' for d in page.evaluate("__r.universeMapState().drawn")):break
    page.mouse.move(width/2,height/2);page.mouse.wheel(0,240);page.wait_for_timeout(120)
   drawn=[d for d in page.evaluate("__r.universeMapState().drawn") if d['kind']=='rumor'];assert drawn and drawn[0]['id']==r1['id'],page.evaluate("__r.universeMapState().drawn")
   page.mouse.click(drawn[0]['x'],drawn[0]['y']);page.wait_for_function("!document.getElementById('umapCard').hidden",timeout=3000)
   assert page.inner_text('#umapCardName')==r1['name'],(page.inner_text('#umapCardName'),r1)
   assert page.inner_text('#umapCardWhat')=='Rumor · '+r1['text']
   assert page.is_visible('#umapMark') and page.inner_text('#umapMark')=='Marcar' and not page.is_visible('#umapGo')
   if SHOTS:page.screenshot(path=f'{SHOTS}/rumores-mapa-{width}.png')
   page.click('#umapMark');route=page.evaluate("__r.mapMarkRoute()");assert route and route['name']=='Tu marca · '+r1['name'] and abs(route['x']-r1['x'])<2,route
   page.evaluate("__r.closeUniverseMap()")
   # --- The Bitácora: the rumor, where it is now, «Marcado» and «Soltar».
   page.evaluate("__r.openJournal('places')");page.wait_for_function("!!document.querySelector('#journalRumors .rumor-open')",timeout=4000)
   page.evaluate("document.getElementById('journalRumors').open=true;document.getElementById('journalRumors').scrollIntoView()")
   card=page.evaluate("document.getElementById('journalRumors').innerText")
   assert r1['text'] in card and 'Ahora · al ' in card and 'Marcado' in card and 'Soltar' in card,card
   assert 'Rumores · 1 de 3' in card
   if SHOTS:page.screenshot(path=f'{SHOTS}/rumores-bitacora-{width}.png')
   page.evaluate(HIDE)
   # --- Reload: the rumor and its mark are still there.
   page.reload();page.wait_for_function("!!window.__r?.discoverState&&!!__r.mapMarkRoute",timeout=20000);page.evaluate(FREE)
   st=page.evaluate("__r.discoverState()");assert [e['id'] for e in st['rumors']['open']]==[r1['id']],st['rumors']
   assert page.evaluate("__r.universeMapState().book.mark.id")==r1['id']
   # --- Three at most: two more, then a fourth is refused; something completed with three open brings none.
   r2=page.evaluate("__r.rumorGive()");r3=page.evaluate("__r.rumorGive()");assert r2 and r3 and len({r1['key'],r2['key'],r3['key']})==3,(r2,r3)
   assert page.evaluate("__r.rumorGive()") is None and len(page.evaluate("__r.discoverState().rumors.open"))==3
   catch(page);page.wait_for_timeout(300);assert len(page.evaluate("__r.discoverState().rumors.open"))==3
   # --- «Soltar» lets one go: nothing else changes.
   sparks=page.evaluate("__r.S.sparks")
   page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_function(f"!!document.querySelector('[data-rumor-drop=\"{r3['id']}\"]')",timeout=4000)
   page.evaluate(f"document.querySelector('[data-rumor-drop=\"{r3['id']}\"]').click()");page.wait_for_function("__r.discoverState().rumors.open.length===2",timeout=3000)
   assert page.evaluate("__r.S.sparks")==sparks and page.evaluate("__r.discoverState().rumors.done.length")==0
   page.evaluate(HIDE)
   # --- Walking there fulfils it: a notice, the Bitácora notes it, the mark it had goes.
   page.evaluate(f"(()=>{{__r.S.wx={r1['x']}-300;__r.S.wy={r1['y']};}})()")
   page.wait_for_function(f"!__r.discoverState().rumors.open.some(e=>e.id==='{r1['id']}')",timeout=6000)
   st=page.evaluate("__r.discoverState()");assert st['rumors']['done'][-1]['id']==r1['id'] and st['rumors']['done'][-1]['done'],st['rumors']
   assert page.evaluate("__r.universeMapState().book.mark") is None,'the mark goes with it'
   page.wait_for_function(f"document.getElementById('toast').textContent==='Rumor cumplido · {r1['name']}'",timeout=12000)
   page.evaluate("__r.openJournal('places')");page.wait_for_function("!!document.querySelector('#journalRumors')",timeout=4000)
   assert f"Cumplido · {r1['name']}" in page.evaluate("document.getElementById('journalRumors').textContent")
   page.evaluate(HIDE)
   # --- Never in the Refugio.
   page.evaluate("__r.landHouse()");page.wait_for_function("__r.houseActive()",timeout=15000);assert page.evaluate("__r.rumorGive()") is None
   page.evaluate("__r.exitHouse()");page.wait_for_function("!__r.houseActive()",timeout=8000)
   assert not errors,errors;page.close()
  # --- In English: the notice and the album speak English.
  page,errors=page_for(browser,390,844,'?anillo=1&lang=en')
  rumor=page.evaluate("__r.rumorGive()");assert rumor
  page.wait_for_function("document.getElementById('toast').textContent.startsWith('Rumor · They say ')",timeout=12000)
  text=page.inner_text('#toast');assert ' km away, ' in text and not re.search(r'Dicen|canta|suena|brillan|se extiende',text),text
  if SHOTS:page.screenshot(path=f'{SHOTS}/rumores-ingles-390.png')
  page.evaluate(HIDE);page.evaluate("__r.openSoundAlbum()");page.wait_for_timeout(200)
  assert page.inner_text('#soundAlbumTitle').startswith('Album of sounds') and 'Look for rare sounds' in page.inner_text('#soundMixNote'),page.inner_text('#soundMixNote')
  assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS Rumores on phone and desktop in {elapsed:.0f} s: a caught living encounter brings the first rumor, real, at the distance and direction it says; a white «?» on the map whose card marks it for the compass; listed in the Bitácora with «Marcado» and «Soltar»; kept on reload; three at most; «Soltar» costs nothing; walking there fulfils it and clears its mark; never in the Refugio; English notice and album',flush=True)
finally:server.shutdown()
