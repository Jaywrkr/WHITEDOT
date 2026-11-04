"""Lo que hay más lejos, tanda D (alpha.252) · the free World from 60 km, on phone (390×844, without sound) and desktop
(1280×800, with sound). Before 60 km the Bitácora names nothing of the band. Crossing 60 km tells once «Portales
de otra regla · Empiezan aquí.». A portal of another rule: an orbit on the phone (the cube turns round its point with no
input), ice on the desktop (it slides on after the keys are let go), a scene of its own (no living encounter, no meteor
shower), six lights gathered for 15 ✦ by the universe's rule; then the usual rule is back. The station of the day:
its sheet with three doors, five rooms played (challenges won, a prize's seal), 15 ✦ once, closed and kept. The sweep on
the beat in a satellite past 70 km: pieces dropped (keys on the desktop), squares cleared by the line, a record and
15 ✦. A nest: without a pet it says so; with one, a young one is born that inherits colour, notes and rhythm, the pet
stays until the player chooses (Bitácora › Crías), comes back, and the young ones walk in the Refugio. An eclipse past
90 km brings the corona: its lights caught by passing (phone) or by the trail a pulse leaves (desktop), 15 ✦. The
Bitácora lines; everything kept on reload. A short pass in English at 390×844."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,json
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('VIAJE_D_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal:not(#mViajeD),#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.S.pet=null;r.save();}"
TOASTS="()=>{window.__toasts=[];const t=document.getElementById('toast');new MutationObserver(()=>{const s=t.textContent.trim();if(s&&window.__toasts.at(-1)!==s)window.__toasts.push(s);}).observe(t,{childList:true,subtree:true,characterData:true});}"
# Fixed sites of the band from the model, away from the satellites (as the game keeps them).
SITES="""async w=>{const M=await import('/src/viaje-d-model.js'),R=await import('/src/recorrer-model.js'),C=await import('/src/secretos-cielo-model.js');
 const free=s=>!R.satelliteHere(w,s,900);const kind=(k,at)=>M.portalsNear(w,at,60000).filter(s=>free(s)&&M.portalRule(s)===k&&s.km<75)[0];
 const orbita=kind('orbita',{x:640000,y:0}),hielo=kind('hielo',{x:0,y:640000});
 const station=M.stationsNear(w,{x:-690000,y:0},60000).filter(free)[0];
 let sat=null;for(let a=0;a<12&&!sat;a++){const s=R.nearestSatellite(w,{x:Math.cos(a)*745000,y:Math.sin(a)*745000});if(s&&s.km>=70&&s.km<80)sat=s;}
 const nest=M.nestsNear(w,{x:0,y:-850000},60000).filter(free)[0];
 let eclipse=null;for(let a=0;a<24&&!eclipse;a++){const e=C.eclipseNear({x:Math.cos(a/4)*960000,y:Math.sin(a/4)*960000},60000);if(e&&Math.hypot(e.x,e.y)/10000>=90)eclipse=e;}
 return {orbita,hielo,station,sat,console:M.consoleFor(w,sat),nest,eclipse,lights:{orbita:M.portalLights(orbita),hielo:M.portalLights(hielo)}};}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.viajeDState&&__r.ringState?.().active&&!!__r.openUniverseMap",timeout=30000)
 page.evaluate(FREE);page.evaluate(TOASTS);page.wait_for_function("!!__r.S.bandas",timeout=5000)
 # The notices of the nearer bands count as given: this flow is about 60 km and more.
 page.evaluate("()=>{for(const e of __r.bandState().entries)if(e.km<60)__r.S.bandas.seen[e.id]='';__r.save();}");page.wait_for_function("__r.viajeDState().allowed&&__r.bandState().allowed",timeout=10000);return page,errors
def go(page,x,y):page.evaluate(f"()=>{{__r.liveEncounterRest?.();__r.S.wx={x};__r.S.wy={y};}}")
def st(page):return page.evaluate("__r.viajeDState()")
def paid_log(page,title):return [int(t.split('+')[1].split()[0]) for t in page.evaluate(f"__r.S.sparkEconomy.log.filter(e=>e.title==={title!r}).map(e=>e.text)")]
def sound_on(page):
 page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.ac?.resume?.();}");page.wait_for_function("__r.ac?.state==='running'",timeout=10000)
def journal(page):
 page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_selector('#journalBandas',state='attached',timeout=5000)
 page.evaluate("document.getElementById('journalBandas').open=true")
 return page.evaluate("(()=>{const e=document.getElementById('journalBandas'),c=document.getElementById('journalCrias');return {summary:e.querySelector('summary').textContent,rows:[...e.querySelectorAll('.banda-row:not(.banda-missing)')].map(p=>p.dataset.banda),missing:[...e.querySelectorAll('.banda-missing')].map(p=>Number(p.dataset.bandaKm)),text:e.textContent,crias:c?c.textContent:null}})()")
# Plays the station's rooms in the page: a challenge door when there is one, each challenge solved as a player would.
PLAY_STATION="""async()=>{const g=__r.viajeDGames,wait=ms=>new Promise(r=>setTimeout(r,ms)),body=document.getElementById('viajeDBody'),click=sel=>{const b=body.querySelector(sel);if(b){b.click();return true;}return false;};
 const out=[],t0=performance.now();let won=0;for(;performance.now()-t0<45000;){const s=g.state();if(!s.visible)return {out,error:'closed'};if(s.station?.done)return {out,station:s.station};
  if(!s.room){won=(s.station.results||[]).filter(v=>v===true).length;const doors=[...body.querySelectorAll('[data-door]')],pref=won>=3?['mirador','jardin','archivo']:['memoria','rapida','compas'];const pickDoor=pref.map(t=>doors.find(d=>d.dataset.room===t)).find(Boolean)||doors[0];out.push(pickDoor.dataset.room);pickDoor.click();await wait(40);continue;}
  const room=s.room;if(room.result!==undefined){click('[data-next]');await wait(40);continue;}
  if(room.type==='mirador'||room.type==='jardin'||room.type==='archivo'){click('[data-seal]');await wait(40);continue;}
  if(room.type==='compas'){if(room.lit===3){click('[data-now]');const t=performance.now();while(g.state().room?.lit===3&&performance.now()-t<1500)await wait(15);}else await wait(15);continue;}
  if(room.type==='memoria'){if(room.showing){await wait(50);continue;}for(const c of room.seq){click(`[data-cell="${c}"]`);await wait(30);}await wait(40);continue;}
  if(room.type==='rapida'){if(room.lit>=0){click(`[data-cell="${room.lit}"]`);await wait(60);}else await wait(30);continue;}
  await wait(40);}
 return {out,error:'guard'};}"""
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   print('viewport',width,flush=True);page,errors=page_for(browser,width,height);P=page.evaluate(SITES,st(page)['world']);sound=width>500
   print('step 1',round(time.time()-started,1),flush=True)
   # --- 1 · Before 60 km the Bitácora names nothing of this band.
   go(page,500000,0);page.wait_for_function("__r.bandState().book.far>=49",timeout=8000)
   j=journal(page);assert all(k in j['missing'] for k in [60,65,70,80,90]),j['missing']
   for hidden in ['Portales de otra regla','Estación del día','Barrido a tempo','Nidos de crías','Eclipses que cambian']:assert hidden not in j['text'],('no spoiler',hidden)
   page.evaluate(HIDE)
   print('step 2',round(time.time()-started,1),flush=True)
   # --- 2 · Crossing 60 km: its notice, once.
   go(page,601000,0);page.wait_for_function("!!__r.bandState().book.seen['portal-regla']",timeout=8000)
   want='Portales de otra regla · Empiezan aquí.'
   page.wait_for_function(f"window.__toasts.some(t=>t.includes({want!r}))",timeout=15000)
   go(page,598000,0);go(page,602000,0);page.wait_for_timeout(300);assert page.evaluate(f"window.__toasts.filter(t=>t.includes({want!r})).length")==1,'once'
   if sound:sound_on(page)
   print('step 3',round(time.time()-started,1),flush=True)
   # --- 3 · A portal of another rule: its motion, one scene at a time, six lights, then the usual rule.
   kind='hielo' if sound else 'orbita';s=P[kind];go(page,s['x']+40,s['y']);page.wait_for_function(f"__r.viajeDState().rule?.kind==={kind!r}",timeout=8000)
   assert page.evaluate("__r.bandBusy()") is True and page.evaluate("__r.liveEncounterSpawn('polilla')") is False and not page.evaluate("__r.skySecretShower()"),'one scene at a time'
   if kind=='orbita':
    a=page.evaluate("[__r.S.wx,__r.S.wy]");page.wait_for_timeout(700);b=page.evaluate("[__r.S.wx,__r.S.wy]")
    ra,rb=((a[0]-s['x'])**2+(a[1]-s['y'])**2)**.5,((b[0]-s['x'])**2+(b[1]-s['y'])**2)**.5
    assert ((a[0]-b[0])**2+(a[1]-b[1])**2)**.5>8 and abs(ra-rb)<6,('it turns round its point with no input',a,b,ra,rb)
   else:
    page.evaluate("document.getElementById('game')?.focus?.()");page.keyboard.down('ArrowRight');page.wait_for_timeout(450);page.keyboard.up('ArrowRight');a=page.evaluate("__r.S.wx");page.wait_for_timeout(400);b=page.evaluate("__r.S.wx")
    assert b-a>15,('it slides on after the keys are let go',a,b)
   if SHOTS:page.screenshot(path=f'{SHOTS}/regla-{kind}-{width}.png')
   for l in P['lights'][kind]:
    go(page,l['x'],l['y']);page.wait_for_function(f"(__r.viajeDState().rule?.lights.find(x=>x.k==={l['k']})?.done)||!__r.viajeDState().rule",timeout=6000)
   page.wait_for_function("!__r.viajeDState().rule",timeout=5000);s2=st(page)
   assert s2['book']['portal']['won']==1 and paid_log(page,'Otra regla')==[15] and s2['summary']=='Otra regla · 6 de 6 · +15 ✦',(s2['book']['portal'],paid_log(page,'Otra regla'),s2['summary'])
   a=page.evaluate("[__r.S.wx,__r.S.wy]");page.wait_for_timeout(400);assert page.evaluate("[__r.S.wx,__r.S.wy]")==a,'still again without input';assert page.evaluate("__r.bandBusy()") is False
   print('step 4',round(time.time()-started,1),flush=True)
   # --- 4 · The station of the day: its sheet, five rooms, 15 ✦ once, kept.
   stn=P['station'];go(page,stn['x']+30,stn['y']);page.wait_for_function("!document.getElementById('mViajeD').hidden&&__r.viajeDGames.mode()==='station'",timeout=8000)
   assert page.inner_text('#viajeDTitle')=='Estación del día' and page.locator('#viajeDBody [data-door]').count()==3
   kinds=page.evaluate("[...document.querySelectorAll('#viajeDBody [data-door] small')].map(e=>e.textContent)");assert 'Reto' in kinds and 'Premio' in kinds,kinds
   assert page.evaluate("__r.bandBusy()") is True
   if SHOTS:page.screenshot(path=f'{SHOTS}/estacion-{width}.png')
   res=page.evaluate(PLAY_STATION);assert not res.get('error') and res['station']['done'] and len(res['station']['path'])==5,res
   won=sum(1 for v in res['station']['results'] if v is True);assert won>=3,res
   assert paid_log(page,'Estación del día')==[15] and page.inner_text('#viajeDStatus').startswith('Estación completa · '),(paid_log(page,'Estación del día'),page.inner_text('#viajeDStatus'))
   if SHOTS:page.screenshot(path=f'{SHOTS}/estacion-fin-{width}.png')
   page.click('#viajeDClose');page.wait_for_function("document.getElementById('mViajeD').hidden&&!__r.bandBusy()",timeout=4000)
   page.wait_for_timeout(300);assert page.evaluate("document.getElementById('mViajeD').hidden"),'not opened again while you stay'
   print('step 5',round(time.time()-started,1),flush=True)
   # --- 5 · The sweep in a satellite past 70 km: pieces dropped, squares cleared on the beat, a record and 15 ✦.
   con=P['console'];go(page,con['x'],con['y']+20);page.wait_for_function("__r.viajeDGames.mode()==='sweep'&&!document.getElementById('mViajeD').hidden",timeout=8000)
   assert page.inner_text('#viajeDTitle')=='Barrido a tempo' and page.is_visible('#viajeDCanvas') and page.is_visible('#viajeDPad')
   x0=st(page)['games']['sweep']['piece']['x']
   if sound:page.keyboard.press('ArrowLeft');page.keyboard.press('ArrowUp')
   else:page.click('#viajeDLeft');page.click('#viajeDTurn')
   assert st(page)['games']['sweep']['piece']['x']==x0-1,'moved'
   for k in range(2):page.click('#viajeDDrop')
   g=st(page)['games']['sweep'];assert sum(1 for row in g['grid'] for c in row if c)>=8 and not g['over'],g
   if SHOTS:page.screenshot(path=f'{SHOTS}/barrido-{width}.png')
   page.evaluate("()=>{const g=Array.from({length:8},(_,y)=>Array(10).fill(y>=6?1:0));__r.viajeDGames.sweepSet({grid:g,left:4.5});}");assert not st(page)['games']['sweep']['over']
   page.wait_for_function("__r.viajeDState().games.sweep?.over",timeout=15000);g=st(page)['games']['sweep']
   assert g['score']>=20 and g['result']['record'] and g['result']['amount']==15 and paid_log(page,'Barrido a tempo')==[15],g
   assert page.inner_text('#viajeDStatus').startswith('Barrido · '),page.inner_text('#viajeDStatus')
   page.click('#viajeDClose');page.wait_for_function("document.getElementById('mViajeD').hidden",timeout=4000)
   print('step 6',round(time.time()-started,1),flush=True)
   # --- 6 · A nest: without a pet it says so; with one, a young one; the pet stays until the player chooses.
   nest=P['nest'];go(page,nest['x']+30,nest['y'])
   page.wait_for_function("__r.viajeDState().drawn.nest?.text==='Nido · Hace falta una mascota'",timeout=8000);page.wait_for_timeout(300);assert st(page)['book']['brood']==[]
   page.evaluate("async()=>{const P=await import('/src/pet-model.js');__r.S.pet=P.createPet('golondrina',4242,[{degree:1,step:0},{degree:3,step:2},{degree:5,step:4}]);__r.save();}")
   seed=page.evaluate("__r.S.pet.seed");go(page,nest['x']+2000,nest['y']);page.wait_for_timeout(150);go(page,nest['x']+30,nest['y'])
   page.wait_for_function("__r.viajeDState().book.brood.length===1",timeout=8000);c=st(page)['book']['brood'][0]
   assert page.evaluate("__r.S.pet.seed")==seed,'the pet is not replaced';assert len(c['notes'])==3 and len(c['rhythm'])==3 and c['seed']%45==c['hue']
   j=journal(page);assert j['crias'] and 'Que viaje contigo' in j['crias'],j['crias']
   page.evaluate("document.getElementById('journalCrias').open=true");page.click('#journalCrias [data-cria-travel]')
   page.wait_for_function(f"__r.S.pet.seed==={c['seed']}&&__r.viajeDState().book.travel?.home.seed==={seed}",timeout=4000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/crias-{width}.png')
   page.evaluate("document.getElementById('journalCrias').open=true");page.click('#journalCrias [data-cria-home]');page.wait_for_function(f"__r.S.pet.seed==={seed}&&!__r.viajeDState().book.travel",timeout=4000)
   page.evaluate(HIDE);page.evaluate("__r.landHouse()");page.wait_for_function("__r.houseActive()&&__r.houseSettled()&&__r.viajeDState().houseDrawn===1",timeout=15000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/refugio-{width}.png')
   page.evaluate("__r.exitHouse()");page.wait_for_function("!__r.houseActive()",timeout=5000);page.evaluate(FREE.replace('r.S.pet=null;',''))
   print('step 7',round(time.time()-started,1),flush=True)
   # --- 7 · An eclipse past 90 km: the corona, caught by passing (phone) or by the trail a pulse leaves (desktop).
   e=P['eclipse'];go(page,e['x']+200,e['y']);page.wait_for_function(f"__r.skySecretState().drawn.eclipse?.id==='{e['id']}'",timeout=8000)
   wait=page.evaluate(f"async()=>{{const M=await import('/src/secretos-cielo-model.js');return M.eclipseWait(M.eclipseNear({{x:{e['x']},y:{e['y']}}},10),__r.skySecretState().now);}}")
   page.evaluate(f"__r.skySecretSkip({wait+.6})");page.wait_for_function("!!__r.skySecretState().eclipse&&!!__r.viajeDState().corona",timeout=8000)
   page.wait_for_function("__r.viajeDState().drawn.corona?.hint===true",timeout=6000)
   caught=page.evaluate("""async(sound)=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));for(let k=0;k<6;k++){const c=__r.viajeDState().corona;if(!c)break;const p=c.pieces.find(x=>!x.done);if(!p)break;
     if(sound){__r.waves.push({x:__r.S.wx,y:__r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});await wait(60);}
     const q=__r.viajeDState().corona?.pieces.find(x=>x.k===p.k);if(!q)break;__r.S.wx=q.x;__r.S.wy=q.y;const t=performance.now();while(performance.now()-t<900&&!__r.viajeDState().corona?.pieces.find(x=>x.k===p.k)?.done)await wait(20);
     }return __r.viajeDState().corona?.caught??-1;}""",sound)
   if SHOTS and st(page)['corona']:page.screenshot(path=f'{SHOTS}/corona-{width}.png')
   page.wait_for_function("!__r.viajeDState().corona",timeout=15000);s3=st(page)
   assert s3['book']['corona']['caught']>=4 and paid_log(page,'Corona del eclipse')[0]>=10,(caught,s3['book']['corona'],paid_log(page,'Corona del eclipse'))
   print('step 8',round(time.time()-started,1),flush=True)
   # --- 8 · The Bitácora: every band of D reached, with its line.
   j=journal(page);rows=set(j['rows']);assert {'portal-regla','estacion','barrido','herencia','eclipse-regla'}<=rows,j['rows']
   for t in ['1 portal superado de 1','Récord · ','1 cría','luces de corona']:assert t in j['text'],(t,j['text'])
   if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-{width}.png')
   print('step 9',round(time.time()-started,1),flush=True)
   # --- 9 · Kept on reload.
   page.evaluate("__r.save()");page.reload();page.wait_for_function("!!window.__r?.viajeDState",timeout=30000)
   b=st(page)['book'];assert b['portal']['won']==1 and b['station']['done'] and b['sweep']['best']>=20 and len(b['brood'])==1 and b['corona']['n']==1 and b['seals']>=0,b
   assert page.evaluate("__r.S.pet?.seed")==seed
   assert not errors,errors;page.close()
  # --- 10 · English at 390×844: the notice, the sheet and the young ones.
  print('viewport 390 en',flush=True);page,errors=page_for(browser,390,844,'?anillo=1&lang=en');P=page.evaluate(SITES,st(page)['world'])
  go(page,601000,0);page.wait_for_function("window.__toasts.some(t=>t.includes('Portals of another rule · They start here.'))",timeout=15000)
  stn=P['station'];go(page,stn['x']+30,stn['y']);page.wait_for_function("__r.viajeDGames.mode()==='station'",timeout=8000);page.wait_for_timeout(200)
  assert page.inner_text('#viajeDTitle')=='Station of the day' and 'Choose the door' in page.inner_text('#viajeDStatus'),page.inner_text('#viajeDStatus')
  assert page.inner_text('#viajeDClose')=='Leave';page.click('#viajeDClose')
  if SHOTS:page.screenshot(path=f'{SHOTS}/en-{390}.png')
  assert not errors,errors;page.close();browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS lo que hay más lejos, tanda D on phone and desktop in {elapsed:.0f} s: no spoiler before 60 km and the notice once; a portal turns the cube round its point (phone) or lets it slide on ice (desktop), one scene at a time, six lights for 15 ✦, then the usual rule; the station of the day with three doors and five rooms for 15 ✦; the sweep in a satellite past 70 km clears squares on the beat for a record and 15 ✦; a nest gives a young one without replacing the pet, the player chooses who travels, the young ones walk in the Refugio; an eclipse past 90 km brings the corona, caught by passing or by the trail of the pulse; the Bitácora lines; kept on reload; English')
finally:server.shutdown()
