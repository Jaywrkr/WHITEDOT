"""Lo que hay más lejos (alpha.248) · the free World on phone and desktop. The Bitácora page «Lo que hay más lejos» shows
the bands reached and only the km of the rest («?», no names). Crossing 1 km tells «Aquí empiezan los radares de
ritmo.» once. A challenge switch: touching it starts a 30 s challenge with no menu, a scene of its own (no living
encounter and no meteor shower meanwhile); its rings are passed without sound (phone) or pulsed on time with sound
(desktop) and pay by the universe's rule (10 ✦; 15 all on time); from 5 km a switch of lights. A rhythm radar counts a
run of pulses on time and keeps the record (desktop, with sound). A ball of light kicked from behind goes between the
two rocks: a goal, with its small party and its sparks once a day. The flare from Menú › Más: it rises where you
stand, marks the screen's edge from afar, is a «?» on the Mapa del universo, and goes out when you come back. The first
rest satellite's request board gives three orders; going to the buoy fulfils one. Kept on reload. English at 390×844."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,math
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('VIAJE_A_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# Every text the notice lane shows, as it shows it.
TOASTS="()=>{window.__toasts=[];const t=document.getElementById('toast');new MutationObserver(()=>{const s=t.textContent.trim();if(s&&window.__toasts.at(-1)!==s)window.__toasts.push(s);}).observe(t,{childList:true,subtree:true,characterData:true});}"
# Fixed sites of the batch from the model, away from the ring (as the game keeps them).
SITES="""async w=>{const M=await import('/src/viaje-a-model.js'),R=await import('/src/recorrer-model.js');const pick=(list,f=()=>true)=>list.filter(s=>f(s))[0];
 const sw=pick(M.switchesNear(w,{x:32000,y:0},14000),s=>M.switchKind(s)==='aros'&&s.km>2&&s.km<4.8),lu=pick(M.switchesNear(w,{x:70000,y:0},30000),s=>M.switchKind(s)==='luces'),
  ra=pick(M.radarsNear(w,{x:-25000,y:0},14000),s=>s.km>1.5&&s.km<4.8),ba=pick(M.ballsNear(w,{x:0,y:-36000},16000),s=>s.km>2.5&&s.km<4.8);
 const sat=R.nearestSatellite(w,{x:0,y:100000}),bd=M.boardFor(w,sat);
 return {sw,rings:M.retoRings(sw),lu,lights:M.retoLights(lu),ra,ba,goal:M.goalFor(ba),sat,bd,orders:M.ordersFor(w,bd,__r.S.todayKey)};}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.viajeState&&__r.ringState?.().active&&!!__r.openUniverseMap",timeout=30000)
 page.evaluate(FREE);page.evaluate(TOASTS);page.wait_for_function("__r.viajeState().allowed&&__r.bandState().allowed",timeout=10000);return page,errors
def go(page,x,y):page.evaluate(f"()=>{{__r.S.wx={x};__r.S.wy={y};}}")
def st(page):return page.evaluate("__r.viajeState()")
def sparks(page):return page.evaluate("__r.S.sparks")
# What the batch paid, as the economy's log writes it (other things of the world may pay meanwhile).
def paid_log(page,title):return [int(t.split('+')[1].split()[0]) for t in page.evaluate(f"__r.S.sparkEconomy.log.filter(e=>e.title==={title!r}).map(e=>e.text)")]
def pulse(page,x,y,beat):page.evaluate(f"()=>__r.waves.push({{x:{x},y:{y},r:0,prev:0,max:340,n:0,origin:'player',beat:{str(beat).lower()}}})")
def sound_on(page):
 page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.ac?.resume?.();}");page.wait_for_function("__r.ac?.state==='running'",timeout=10000)
def bandas(page):
 page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_selector('#journalBandas',state='attached',timeout=5000)
 page.evaluate("document.getElementById('journalBandas').open=true;document.getElementById('journalBandas').scrollIntoView()")
 return page.evaluate("(()=>{const e=document.getElementById('journalBandas');return {summary:e.querySelector('summary').textContent,rows:[...e.querySelectorAll('.banda-row:not(.banda-missing)')].map(p=>p.dataset.banda),missing:[...e.querySelectorAll('.banda-missing')].map(p=>p.dataset.bandaKm),text:e.textContent}})()")
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height,lang in [(390,844,'es'),(1280,800,'es'),(390,844,'en')]:
   print('viewport',width,lang,flush=True);en=lang=='en';page,errors=page_for(browser,width,height,'?anillo=1'+('&lang=en' if en else ''))
   P=page.evaluate(SITES,st(page)['world']);sound=width>500
   # --- 1 · The Bitácora before going far: what is reached, and only the km of the rest.
   go(page,4000,0);page.wait_for_function("__r.bandState().book.far>=.39",timeout=8000)
   j=bandas(page);assert set(j['rows'])>={'bengala'} and 'radar' not in j['rows'] and len(j['missing'])>=4,j
   for hidden in (['Rhythm radars','Balls of light','Request boards'] if en else ['Radares de ritmo','Pelotas de luz','Tablones de encargos','Retos de luces']):assert hidden not in j['text'],('no spoiler',hidden)
   if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-antes-{lang}-{width}.png')
   page.evaluate(HIDE)
   # --- 2 · Crossing 1 km: its notice, once.
   go(page,10600,0);page.wait_for_function("!!__r.bandState().book.seen.radar",timeout=8000)
   want='Rhythm radars start here.' if en else 'Aquí empiezan los radares de ritmo.'
   try:page.wait_for_function(f"window.__toasts.some(t=>t.includes({want!r}))",timeout=15000)
   except Exception:print(page.evaluate('JSON.stringify({t:window.__toasts,b:__r.bandState()})'));raise
   go(page,9000,0);go(page,10700,0);page.wait_for_timeout(300);assert page.evaluate(f"window.__toasts.filter(t=>t.includes({want!r})).length")==1,'once'
   # --- 3 · A challenge switch (rings): no menu, a scene of its own, paid by the universe's rule.
   if sound:sound_on(page)
   sw=P['sw'];before=sparks(page);go(page,sw['x'],sw['y']);page.wait_for_function("!!__r.viajeState().reto",timeout=8000)
   assert page.evaluate("__r.bandBusy()") is True and page.evaluate("__r.liveEncounterSpawn('polilla')") is False,'one scene at a time'
   assert not page.evaluate("__r.skySecretShower()"),'no meteor shower meanwhile'
   page.wait_for_function("__r.viajeState().drawn.reto?.total===5",timeout=5000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/reto-{lang}-{width}.png')
   for g in P['rings']:
    go(page,g['x'],g['y'])
    if sound:pulse(page,g['x'],g['y'],True)
    page.wait_for_function(f"(__r.viajeState().reto?.done||0)>={g['k']+1}||!__r.viajeState().reto",timeout=6000)
   page.wait_for_function("!__r.viajeState().reto",timeout=5000);s=st(page);paid=15 if sound else 10
   assert s['book']['retos']['won']==1 and paid_log(page,'Reto')==[paid] and sparks(page)-before>=paid,(s['book']['retos'],paid_log(page,'Reto'))
   assert s['summary']==('Reto · 5 de 5 · +%d ✦'%paid),s['summary'];assert page.evaluate("__r.bandBusy()") is False
   if not en:
    # --- 4 · From 5 km, a switch of lights: gathered by passing.
    lu=P['lu'];go(page,lu['x'],lu['y']);page.wait_for_function("__r.viajeState().reto?.kind==='luces'",timeout=8000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/luces-{width}.png')
    for g in P['lights']:go(page,g['x'],g['y']);page.wait_for_function(f"(__r.viajeState().reto?.done||0)>={g['k']+1}||!__r.viajeState().reto",timeout=6000)
    page.wait_for_function("!__r.viajeState().reto&&__r.viajeState().book.retos.won===2",timeout=5000);assert page.evaluate("!!__r.bandState().book.seen.luces")
    # --- 5 · A rhythm radar: with sound, a run of pulses on time and its record; without, it only says so.
    ra=P['ra'];go(page,ra['x']+150,ra['y']);before=sparks(page)
    if sound:
     page.wait_for_function("!!__r.viajeState().radar",timeout=6000)
     for k in range(5):pulse(page,ra['x']+150,ra['y'],True);page.wait_for_function(f"__r.viajeState().radar?.best>={k+1}",timeout=4000)
     pulse(page,ra['x']+150,ra['y'],False);page.wait_for_function("__r.viajeState().radar?.cur===0",timeout=4000)
     if SHOTS:page.screenshot(path=f'{SHOTS}/radar-{width}.png')
     go(page,ra['x']+2000,ra['y']);page.wait_for_function(f"__r.viajeState().book.radars[{ra['id']!r}]?.best===5",timeout=6000)
     s=st(page);assert s['summary']=='Radar de ritmo · racha 5 · ¡récord! · +10 ✦' and paid_log(page,'Radar de ritmo')==[10] and sparks(page)-before>=10,(s['summary'],paid_log(page,'Radar de ritmo'))
    else:page.wait_for_timeout(300);assert st(page)['radar'] is None,'without sound the radar does not count'
   # --- 6 · A ball of light: kicked from behind, it goes between the rocks; a goal, its party and its sparks.
   ba,goal=P['ba'],P['goal'];dx,dy=goal['x']-ba['x'],goal['y']-ba['y'];l=math.hypot(dx,dy);cx,cy=ba['x']-dx/l*40,ba['y']-dy/l*40
   go(page,cx,cy);page.wait_for_function(f"__r.viajeState().drawn.balls?.some(b=>b.id==={ba['id']!r})",timeout=6000);before=sparks(page)
   pulse(page,cx,cy,sound);page.wait_for_function("__r.viajeState().book.goals>=1",timeout=8000)
   s=st(page);paid=15 if sound else 10;assert s['summary']==('¡Gol! · +%d ✦'%paid) and paid_log(page,'Gol')==[paid] and sparks(page)-before>=paid,(s['summary'],paid_log(page,'Gol'))
   assert page.evaluate("__r.viajeState().balls.some(b=>b.party)"),'a small party'
   go(page,goal['x'],goal['y']);page.wait_for_timeout(250)
   if SHOTS:page.screenshot(path=f'{SHOTS}/gol-{lang}-{width}.png')
   # --- 7 · The flare: Menú › Más › «Lanzar bengala»; seen from afar, a «?» on the map, out when you come back.
   home={'x':ba['x']+3000,'y':ba['y']};go(page,home['x'],home['y']);page.evaluate(HIDE)
   page.evaluate("document.getElementById('bMenu').click()");page.evaluate("document.getElementById('menuMore').open=true")
   page.wait_for_selector('#bFlare:visible',timeout=4000);assert page.locator('#bFlare span').inner_text().startswith('Launch flare' if en else 'Lanzar bengala')
   page.click('#bFlare');page.wait_for_function("!!__r.viajeState().book.flare&&document.getElementById('mMenu').hidden",timeout=4000)
   page.wait_for_function("!!__r.viajeState().drawn.flare",timeout=4000)
   if SHOTS:page.wait_for_timeout(1500);page.screenshot(path=f'{SHOTS}/bengala-{lang}-{width}.png')
   go(page,home['x']+4500,home['y']+2000);page.wait_for_function("!!__r.viajeState().drawn.edge?.bengala",timeout=6000)
   e=st(page)['drawn']['edge']['bengala'];assert 0<=e['x']<=width and 0<=e['y']<=height,e
   if SHOTS:page.screenshot(path=f'{SHOTS}/bengala-borde-{lang}-{width}.png')
   if sound:page.wait_for_function("__r.viajeState().flareBeeps>=1",timeout=25000);assert any(n for n in [st(page)['notes']])
   if not en:
    page.evaluate(HIDE);assert page.evaluate("__r.openUniverseMap('universo')")
    page.wait_for_function("__r.universeMapState().drawn.some(d=>d.kind==='rumor'&&d.id==='bengala')",timeout=6000);page.evaluate("__r.closeUniverseMap()")
   go(page,home['x']+100,home['y']);page.wait_for_function("!__r.viajeState().book.flare",timeout=6000)
   assert st(page)['summary']==('Volviste a tu bengala'),st(page)['summary']
   if not en:
    # --- 8 · The first rest satellite: its notice, its board with three orders; the buoy's order fulfilled.
    bd,orders=P['bd'],P['orders'];go(page,0,101000);page.wait_for_function("!!__r.bandState().book.seen.tablon",timeout=6000)
    page.wait_for_function(f"window.__toasts.some(t=>t.includes('Aquí empiezan los tablones de encargos.'))",timeout=20000)
    go(page,bd['x']+80,bd['y']);page.wait_for_function("__r.viajeState().book.orders.length===3",timeout=8000)
    page.wait_for_function("__r.viajeState().drawn.boardText===3",timeout=6000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/tablon-{width}.png')
    o=[x for x in orders if x['kind']=='sitio'][0];before=sparks(page)
    assert page.evaluate(f"__r.bandMapPoints().some(p=>p.id==='encargo:'+{o['id']!r})"),'the buoy on the map'
    go(page,o['x']+60,o['y']);page.wait_for_function("__r.viajeState().book.ordersDone===1",timeout=8000)
    assert paid_log(page,'Encargo')==[15] and sparks(page)-before>=15 and len(st(page)['book']['orders'])==2,(paid_log(page,'Encargo'),st(page)['book']['orders'])
    page.wait_for_function("window.__toasts.some(t=>t.startsWith('Encargo cumplido · '))",timeout=15000)
    # --- 9 · The Bitácora: every band reached, with its line.
    j=bandas(page);assert j['missing']==['12','15','20','25'] and j['summary']=='Lo que hay más lejos · 6 de 10',j  # A's six bands at 11 km; tanda B's (10-30 km) beyond start at 12
    assert set(j['rows'])-{'region-apagada'}=={'bengala','interruptor','radar','pelota','luces','tablon'},j['rows'];assert '1 gol' in j['text'] and '1 encargo cumplido' in j['text'],j['text']
    if sound:assert 'Mejor racha · 5' in j['text'],j['text']
    if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-{width}.png')
   else:
    j=bandas(page);assert j['summary'].startswith('What lies farther · ') and 'Balls of light' in j['text'],j
   # --- 10 · Kept on reload.
   page.evaluate("__r.save()");page.reload();page.wait_for_function("!!window.__r?.viajeState",timeout=30000);page.evaluate(FREE)
   s=st(page)['book'];assert s['goals']==1 and s['retos']['won']==(1 if en else 2) and s['flare'] is None and s['flares']==1,s
   if not en:assert s['ordersDone']==1 and len(s['orders'])==2,s
   assert page.evaluate("__r.bandState().book.far")>=(2 if en else 10)
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS lo que hay más lejos on phone and desktop in {elapsed:.0f} s: the Bitácora shows the bands reached and only the km of the rest, crossing 1 km tells once; a switch starts a 30 s challenge with no menu, one scene at a time, rings passed (phone) or on time (desktop) for 10 or 15 ✦, and one of lights from 5 km; a radar keeps a run of 5; a ball kicked from behind scores with its party; the flare rises from Menú › Más, marks the edge and the map and goes out on return; the first satellite\'s board gives three orders and the buoy fulfils one; kept on reload; English')
finally:server.shutdown()
