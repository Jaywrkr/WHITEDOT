"""Secretos del cielo (alpha.247) · the free World on phone and desktop. A comet crystal glints at the screen's edge,
is seen on screen and kept by passing through it («Cristal de cometa · 1 de 50», no sparks); all fifty put the comet
orbit on the cube, taken off in Tu cubo › Secretos and kept off on reload. A lost probe: beeps on the bars with sound
(louder near), a mark at the edge without; found, it gives a secret coordinate, a white «?» on the Mapa del universo
whose card offers «Marcar», fulfilled on arriving. A meteor shower crosses past the cube: caught by passing through the
stars without sound (phone) and by pulses on time with sound (desktop), paid by the universe's rule; while it lasts no
living encounter starts. An eclipse on the device's clock: there at the covering, the screen darkens and the music's
comfort filter goes dark for a few seconds, then comes back by itself. The Bitácora › Secretos lists only what was
found. English at 390×844."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,math
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('SECRETOS_CIELO_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
MODEL="async()=>{const M=await import('/src/secretos-cielo-model.js');return {comets:M.COMETS.map(c=>({i:c.i,x:c.x,y:c.y})),probes:M.PROBES.map(p=>({i:p.i,x:p.x,y:p.y})),site:M.eclipseNear({x:__r.S.wx,y:__r.S.wy},2e6),count:M.METEOR_COUNT,cutoff:M.ECLIPSE_CUTOFF};}"
# Follow the shower: the cube on each star as it crosses (without sound), or a pulse on time beside it (with sound).
CHASE="""async sound=>{const r=__r;const t0=performance.now();while(performance.now()-t0<30000){const s=r.skySecretState().shower;if(!s)break;
 const m=s.meteors.find(m=>!m.caught&&s.age>=m.born+.2&&s.age<=m.born+3.0);if(m){if(sound)r.waves.push({x:m.head.x-120,y:m.head.y,r:0,prev:0,max:340,n:0,origin:'player',beat:true});else{r.S.wx=m.head.x;r.S.wy=m.head.y;}}
 await new Promise(f=>setTimeout(f,60));}return r.skySecretState();}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.skySecretState&&__r.ringState?.().active&&!!__r.openUniverseMap",timeout=30000)
 page.evaluate(FREE);page.wait_for_function("__r.skySecretState().allowed",timeout=10000);return page,errors
def go(page,x,y):page.evaluate(f"()=>{{__r.S.wx={x};__r.S.wy={y};}}")
def st(page):return page.evaluate("__r.skySecretState()")
def sound_on(page):
 page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.ac?.resume?.();}");page.wait_for_function("__r.ac?.state==='running'&&!!__r.comfortLowpass",timeout=10000)
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height,lang in [(390,844,'es'),(1280,800,'es'),(390,844,'en')]:
   page,errors=page_for(browser,width,height,'?anillo=1'+('&lang=en' if lang=='en' else ''))
   M=page.evaluate(MODEL);c0,p0,p1=M['comets'][0],M['probes'][0],M['probes'][1];sparks=page.evaluate("__r.S.sparks")
   # --- 1 · A comet crystal: a glint at the edge, then on screen, kept by passing through it; no sparks.
   go(page,c0['x']+1100,c0['y']);page.wait_for_function("!!__r.skySecretState().drawn.edge?.cometa",timeout=8000)
   e=st(page)['drawn']['edge']['cometa'];assert e['i']==0 and 0<=e['x']<=width and 0<=e['y']<=height,e
   # Coherencia T2: the glint is a «?» in the one layer of white arrows.
   page.wait_for_function("__r.edgeState().shown.some(a=>a.kind==='cometa'&&a.ask&&a.shape==='pregunta')",timeout=4000)
   go(page,c0['x']+120*0+150,c0['y']+60);page.wait_for_function("__r.skySecretState().drawn.comet?.i===0",timeout=8000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/cristal-{lang}-{width}.png')
   go(page,c0['x'],c0['y']);page.wait_for_function("__r.skySecretState().comets===1",timeout=8000)
   s=st(page);assert s['summary']=='Cristal de cometa · 1 de 50',s['summary'];assert 'cometas' in s['pages']
   assert page.evaluate("__r.S.sparks")==sparks,'a crystal pays nothing'
   # --- 2 · A lost probe: a «?» at the edge; found, a coordinate on the map.
   go(page,p0['x']+2500,p0['y']);page.wait_for_function("!!__r.skySecretState().drawn.edge?.sonda",timeout=8000)
   go(page,p0['x'],p0['y']);page.wait_for_function("__r.skySecretState().probes===1&&__r.skySecretState().book.coords.length===1",timeout=8000)
   coord=st(page)['book']['coords'][0];assert coord['id']=='coord:0' and coord['kind'] in ('cometa','asteroide','satelite'),coord
   page.evaluate(HIDE);assert page.evaluate("__r.openUniverseMap('universo')")
   page.wait_for_function("__r.universeMapState().drawn.some(d=>d.kind==='rumor'&&d.id==='coord:0')",timeout=6000)
   i=[d for d in page.evaluate("__r.universeMapState().drawn") if d['kind']=='rumor' and d['id']=='coord:0'][0];page.mouse.click(i['x'],i['y'])
   page.wait_for_function("!document.getElementById('umapCard').hidden",timeout=4000)
   want=('Secret coordinate','Mark') if lang=='en' else ('Coordenada secreta','Marcar')
   page.wait_for_function(f"document.getElementById('umapMark').textContent.trim()==={want[1]!r}",timeout=4000)
   assert page.inner_text('#umapCardName')==want[0],page.inner_text('#umapCard')
   if SHOTS:page.screenshot(path=f'{SHOTS}/coordenada-mapa-{lang}-{width}.png')
   page.evaluate("__r.closeUniverseMap()")
   go(page,coord['x'],coord['y']+100);page.wait_for_function("__r.skySecretState().book.coords.length===0&&__r.skySecretState().book.coordsDone.length===1",timeout=8000)
   if lang=='es':
    # --- 3 · With sound, a probe beeps on the bars when you come near (heard before seen).
    if width>500:
     sound_on(page);go(page,p1['x']+2000,p1['y']);page.wait_for_function("__r.skySecretState().beeps>=2",timeout=20000)
     # Heard before seen: not on screen, and since T2 its mark at the edge is a «?» with the sound on too.
     assert st(page)['drawn'].get('probe') is None and st(page)['drawn']['edge'].get('sonda'),'heard before seen, marked as «?»'
     page.wait_for_function("__r.edgeState().shown.some(a=>a.kind==='sonda'&&a.ask)",timeout=4000)
    # --- 4 · A meteor shower: no living encounter meanwhile; caught by passing (phone, no sound) or on time (desktop).
    go(page,c0['x']+20000,c0['y']+20000);sparks=page.evaluate("__r.S.sparks")
    assert page.evaluate("__r.skySecretShower()") is True;assert page.evaluate("__r.skySecretBusy()") is True
    assert page.evaluate("__r.liveEncounterSpawn('polilla')") is False,'one scene at a time'
    page.wait_for_function("__r.skySecretState().drawn.meteors>=1",timeout=6000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/meteoros-{width}.png')
    sound=width>500;s=page.evaluate(CHASE,sound);b=s['book']['meteors']
    assert b['caught']>=M['count']-1 and b['n']==1,b
    want=page.evaluate(f"async()=>{{const M=await import('/src/secretos-cielo-model.js');const s=__r.skySecretState();return M.meteorReward(s.book.meteors.caught,M.METEOR_COUNT,{{x:{c0['x']+20000},y:{c0['y']+20000},onTime:{str(sound).lower()}&&s.book.meteors.full===1}});}}")
    log=page.evaluate("__r.S.sparkEconomy.log.filter(e=>e.title==='Lluvia de estrellas').map(e=>e.text)");got=int(log[-1].split('+')[1].split()[0]) if log else 0
    assert len(log)==1 and got==want and 10<=got<=40 and page.evaluate("__r.S.sparks")-sparks>=got,(log,got,want,page.evaluate("__r.S.sparkEconomy.log.slice(-4)"))
    assert s['summary'].startswith('Lluvia de estrellas · '),s['summary'];assert page.evaluate("__r.skySecretBusy()") is False
    # --- 5 · An eclipse: there at the covering, darker screen; with sound the comfort filter goes dark and comes back.
    site=M['site'];go(page,site['x']+200,site['y']);page.wait_for_function(f"__r.skySecretState().drawn.eclipse?.id==='{site['id']}'",timeout=8000)
    wait=page.evaluate(f"async()=>{{const M=await import('/src/secretos-cielo-model.js');return M.eclipseWait(M.eclipseNear({{x:{site['x']},y:{site['y']}}},10),__r.skySecretState().now);}}")
    page.evaluate(f"__r.skySecretSkip({wait+.6})");page.wait_for_function("!!__r.skySecretState().eclipse&&__r.skySecretState().drawn.dark",timeout=8000)
    assert 'eclipse' in st(page)['pages']
    if SHOTS:page.screenshot(path=f'{SHOTS}/eclipse-{width}.png')
    if sound:
     page.wait_for_function(f"__r.comfortLowpass.frequency.value<{M['cutoff']*1.6}",timeout=8000)
     page.wait_for_function("!__r.skySecretState().eclipse&&!__r.skySecretState().dark",timeout=15000)
     page.wait_for_function(f"__r.comfortLowpass.frequency.value>{M['cutoff']*2.5}",timeout=12000)
    else:page.wait_for_function("!__r.skySecretState().eclipse",timeout=15000)
    # --- 6 · All fifty: the comet orbit on the cube, taken off in Tu cubo › Secretos, kept on reload.
    last=M['comets'][-1];page.evaluate("()=>{const q=__r.S.skySecrets;for(let i=0;i<49;i++)q.comets[String(i)]='2026-11-04';__r.save();}")
    go(page,last['x'],last['y']);page.wait_for_function("__r.skySecretState().orbit===true",timeout=8000)
    page.evaluate(HIDE);page.evaluate("document.getElementById('mCube').hidden=false")
    page.wait_for_selector('#cubeSecretSection:not([hidden]) #cubeSecretOrbit[aria-pressed="true"]',timeout=5000)
    page.locator('#cubeSecretOrbit').scroll_into_view_if_needed();page.click('#cubeSecretOrbit')
    page.wait_for_selector('#cubeSecretOrbit[aria-pressed="false"]',timeout=5000);assert st(page)['orbit'] is False
    page.evaluate(HIDE)
   # --- 7 · The Bitácora › Secretos: only what was found.
   page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_selector('#journalSecrets',state='attached',timeout=5000)
   page.evaluate("document.getElementById('journalSecrets').open=true;document.getElementById('journalSecrets').scrollIntoView()")
   j=page.evaluate("(()=>{const e=document.getElementById('journalSecrets');return {summary:e.querySelector('summary').textContent,ids:[...e.querySelectorAll('.secret-row')].map(p=>p.dataset.secret),text:e.textContent,missing:e.querySelectorAll('.secret-missing span').length}})()")
   if lang=='en':assert f"Comet crystals · {st(page)['comets']} of 50" in j['text'] and 'Lost probes · 1 found' in j['text'],j['text']
   else:
    assert set(j['ids'])>={'cometas','sondas','meteoros','eclipse'},j;assert 'Cristales de cometa · 50 de 50' in j['text'] and 'Órbita de cometa' in j['text'],j['text']
    assert 'Coordenada cumplida' in j['text'],j['text']
   if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-{lang}-{width}.png')
   # --- 8 · Kept on reload.
   page.reload();page.wait_for_function("!!window.__r?.skySecretState",timeout=30000);page.evaluate(FREE)
   s=st(page);assert s['probes']==1 and s['comets']>=1,s
   if lang=='es':assert s['comets']==50 and s['orbit'] is False and s['book']['meteors']['n']==1 and s['book']['eclipses']['n']==1,s['book']
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS secretos del cielo on phone and desktop in {elapsed:.0f} s: a comet crystal glints at the edge and is kept by passing (no sparks), all fifty give the comet orbit (taken off in Tu cubo, kept); a probe beeps with sound and marks the edge without, and gives a coordinate on the map that is fulfilled on arriving; a meteor shower caught by passing and on time, paid by the universe rule, with no encounter meanwhile; an eclipse darkens the screen and the music\'s filter, then comes back; the Bitácora lists only what was found; English',flush=True)
finally:server.shutdown()
