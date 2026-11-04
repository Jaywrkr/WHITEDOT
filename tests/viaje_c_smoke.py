"""Lo que hay más lejos, tanda C (alpha.251) · the free World from 30 to 60 km on phone and desktop. Crossing 30 km tells
«Aquí empiezan los púlsares.» once. A pulsar: its six flashes are dodged by stepping aside without sound (phone) or sent
back by a pulse on time at each strike with sound (desktop), a scene of its own (no living encounter meanwhile), and its
run pays 15 ✦ by the universe's rule. A layered asteroid dug with pulses, layer by layer (kept half dug), to its core:
a find and 12 ✦. A zip line laid by a pulse between two buoys of 41 km you stepped on, ridden back in a few seconds.
A sea of dust: its ring of rocks stops the cube on the surface; a pulse sinks it (the music darker with sound), under the
dust it reaches the middle and its hidden thing, and it comes up on the other side. The kit: a box gives the net for
ever, the net gathers a bank of light (12 ✦), the scrap still asks for a magnet. The Bitácora shows every band reached
with its line. Kept on reload. English at 390×844 (notice, net, page)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,math
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('VIAJE_C_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
TOASTS="()=>{window.__toasts=[];const t=document.getElementById('toast');new MutationObserver(()=>{const s=t.textContent.trim();if(s&&window.__toasts.at(-1)!==s)window.__toasts.push(s);}).observe(t,{childList:true,subtree:true,characterData:true});}"
# Fixed sites of the batch from the model, each away from everything else that could start a scene there (a switch of
# batch A, another pulsar, a sea of dust).
SITES="""async w=>{const C=await import('/src/viaje-c-model.js'),A=await import('/src/viaje-a-model.js'),R=await import('/src/recorrer-model.js');
 const free=(p,reach=600,but='',buoy=false)=>!A.switchesNear(w,p,reach).length&&!C.pulsarsNear(w,p,900).some(s=>s.id!==but)&&!C.dustNear(w,p,C.DUST_R+700).some(s=>s.id!==but)&&!C.rocksNear(w,p,500).some(s=>s.id!==but)&&!C.cachesNear(w,p,500).some(s=>s.id!==but)&&!C.pointsNear(w,p,500).some(s=>s.id!==but)&&(buoy||!R.buoyHere(w,p,400))&&!R.satelliteHere(w,p,600);
 const pick=(list,f)=>list.find(s=>f(s)&&free(s,600,s.id));
 const pu=pick(C.pulsarsNear(w,{x:320000,y:0},30000),s=>s.km>30.5&&s.km<34),ro=pick(C.rocksNear(w,{x:0,y:370000},30000),s=>s.km>35.5&&s.km<39&&C.rockLayers(s).layers.length>=4),
  du=pick(C.dustNear(w,{x:-470000,y:0},40000),s=>s.km>45.5&&s.km<49.5&&C.dustHidden(s)),ca=pick(C.cachesNear(w,{x:0,y:-530000},40000),s=>s.km>50.5);
 const po=pick(C.pointsNear(w,{x:ca.x,y:ca.y},30000),s=>s.kind==='banco'),sc=pick(C.pointsNear(w,{x:ca.x,y:ca.y},40000),s=>s.kind==='chatarra');
 let b1=null,b2=null;for(let j=0;j<258&&!b2;j++){const a=R.buoyAt(w,41,j),b=R.buoyAt(w,41,j+1);if(free(a,600,'',true)&&free(b,600,'',true)){b1=a;b2=b;}}
 return {pu,ro,plan:C.rockLayers(ro),du,hidden:C.dustHidden(du),ca,po,sc,b1,b2,ring:C.DUST_RING,wall:C.DUST_WALL};}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.viajeCState&&__r.ringState?.().active",timeout=30000)
 page.evaluate(FREE);page.evaluate(TOASTS);page.wait_for_function("__r.viajeCState().allowed&&__r.bandState().allowed",timeout=10000);return page,errors
# Far from everything, quietly: no living encounter starts while a step plays out.
def go(page,x,y):page.evaluate(f"()=>{{__r.liveEncounterRest?.();__r.S.wx={x};__r.S.wy={y};}}")
def st(page):return page.evaluate("__r.viajeCState()")
def sparks(page):return page.evaluate("__r.S.sparks")
def paid_log(page,title):return [int(t.split('+')[1].split()[0]) for t in page.evaluate(f"__r.S.sparkEconomy.log.filter(e=>e.title==={title!r}).map(e=>e.text)")]
def pulse(page,x,y,beat):page.evaluate(f"()=>__r.waves.push({{x:{x},y:{y},r:0,prev:0,max:340,n:0,origin:'player',beat:{str(beat).lower()}}})")
def here_pulse(page,beat=False):page.evaluate(f"()=>__r.waves.push({{x:__r.S.wx,y:__r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:{str(beat).lower()}}})")
def sound_on(page):
 page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.ac?.resume?.();}");page.wait_for_function("__r.ac?.state==='running'",timeout=10000)
def bandas(page):
 page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_selector('#journalBandas',state='attached',timeout=5000)
 page.evaluate("document.getElementById('journalBandas').open=true;document.getElementById('journalBandas').scrollIntoView()")
 out=page.evaluate("(()=>{const e=document.getElementById('journalBandas');return {summary:e.querySelector('summary').textContent,rows:[...e.querySelectorAll('.banda-row:not(.banda-missing)')].map(p=>p.dataset.banda),text:e.textContent}})()")
 return out
def mark(label):print(f'  {label} {time.time()-started:.1f} s',flush=True)
def wait_toast(page,want,timeout=15000):
 try:page.wait_for_function(f"window.__toasts.some(t=>t.includes({want!r}))",timeout=timeout)
 except Exception:print(page.evaluate('JSON.stringify(window.__toasts)'));raise
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height,lang in [(390,844,'es'),(1280,800,'es'),(390,844,'en')]:
   print('viewport',width,lang,f'{time.time()-started:.0f} s',flush=True);en=lang=='en';page,errors=page_for(browser,width,height,'?anillo=1'+('&lang=en' if en else ''))
   P=page.evaluate(SITES,st(page)['world']);sound=width>500
   # Batch A's bands already reached (their notices given), so the crossing below tells only what starts at 30 km.
   page.evaluate("()=>{const q=__r.S.bandas||{};__r.bandState();const b=__r.S.bandas;b.far=29.9;for(const id of ['radar','pelota','luces','tablon'])b.seen[id]='';__r.save();}")
   # --- 1 · Crossing 30 km: its notice, once; nothing of the band in the Bitácora before.
   mark('1')
   go(page,290000,40000);page.wait_for_timeout(300);j=bandas(page);assert 'pulsar' not in j['rows'],j;assert ('Pulsars' if en else 'Púlsares') not in j['text'],'no spoiler';page.evaluate(HIDE)
   go(page,303000,40000);page.wait_for_function("!!__r.bandState().book.seen.pulsar",timeout=8000)
   want='Pulsars start here.' if en else 'Aquí empiezan los púlsares.';wait_toast(page,want)
   go(page,301000,40000);go(page,304000,40000);page.wait_for_timeout(300);assert page.evaluate(f"window.__toasts.filter(t=>t.includes({want!r})).length")==1,'once'
   if not en:
    # --- 2 · A pulsar: a volley of six flashes, a scene of its own; dodged by stepping aside (phone), sent back on time (desktop).
    mark('2')
    if sound:sound_on(page)
    pu=P['pu'];A={'x':pu['x']+200,'y':pu['y']};B={'x':pu['x']+200,'y':pu['y']+150};before=sparks(page);go(page,A['x'],A['y'])
    page.wait_for_function("!!__r.viajeCState().volley",timeout=8000)
    assert page.evaluate("__r.bandBusy()") is True and page.evaluate("__r.liveEncounterSpawn('polilla')") is False,'one scene at a time'
    spot=A;V="__r.viajeCState().volley"
    # Five flashes, then away: leaving ends the volley and pays what was done (a run of four or five).
    for k in range(5):
     # Each flash: with sound, a pulse on time just before its strike; without, a step aside from where it aims.
     try:page.wait_for_function(f"!{V}||{V}.flash?.k==={k}"+(f"&&{V}.flash.left<.12" if sound else ""),timeout=9000,polling='raf')
     except Exception:print({k:v for k,v in st(page).items() if k not in ('book','drawn')});raise
     if not page.evaluate(V):break
     if k==1 and SHOTS:page.screenshot(path=f'{SHOTS}/pulsar-{width}.png')
     if sound:here_pulse(page,True)
     else:spot=B if spot is A else A;go(page,spot['x'],spot['y'])
     page.wait_for_function(f"!{V}||{V}.flash?.k!=={k}",timeout=6000)
    go(page,pu['x']+800,pu['y']);page.wait_for_function("!__r.viajeCState().volley",timeout=6000);s=st(page)
    assert s['book']['volleys']['best']>=4 and paid_log(page,'Púlsar')==[15] and sparks(page)-before>=15,(s['book']['volleys'],paid_log(page,'Púlsar'))
    assert s['summary'].startswith('Púlsar · racha ') and s['summary'] in ('Púlsar · racha 4 de 6 · +15 ✦','Púlsar · racha 5 de 6 · +15 ✦'),s['summary'];assert page.evaluate("__r.bandBusy()") is False
    if sound:assert s['notes']>=4,s['notes']
    # --- 3 · A layered asteroid: dug blow by blow, kept layer by layer, to its core: a find and its sparks.
    mark('3')
    ro,plan=P['ro'],P['plan'];go(page,ro['x']+150,ro['y']);page.wait_for_function(f"__r.viajeCState().drawn.rocks?.some(r=>r.id==={ro['id']!r})",timeout=6000);before=sparks(page)
    first=plan['layers'][0]['hits']
    for k in range(first):pulse(page,ro['x']+150,ro['y'],False);page.wait_for_timeout(60)
    page.wait_for_function(f"__r.viajeCState().book.rocks[{ro['id']!r}]?.l===1",timeout=5000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/asteroide-{width}.png')
    for k in range(30):
     if page.evaluate(f"Object.hasOwn(__r.viajeCState().book.cores,{ro['id']!r})"):break
     pulse(page,ro['x']+150,ro['y'],False);page.wait_for_timeout(60)
    page.wait_for_function(f"Object.hasOwn(__r.viajeCState().book.cores,{ro['id']!r})",timeout=5000);s=st(page)
    assert paid_log(page,'Asteroide')==[12] and sparks(page)-before>=12 and s['summary'].startswith(plan['name']+' · nuevo · +12'),(paid_log(page,'Asteroide'),s['summary'])
    # --- 4 · A zip line between two buoys of 41 km stepped on; ridden back in a few seconds, a scene of its own.
    mark('4')
    b1,b2=P['b1'],P['b2'];go(page,b1['x'],b1['y']);page.wait_for_function(f"__r.viajeCState().zip.here==={b1['id']!r}",timeout=6000)
    go(page,b2['x'],b2['y']);page.wait_for_function(f"__r.viajeCState().zip.here==={b2['id']!r}&&__r.viajeCState().zip.prev==={b1['id']!r}",timeout=6000)
    page.wait_for_function("__r.viajeCState().drawn.hint?.includes('tirolina')",timeout=4000);here_pulse(page)
    page.wait_for_function("__r.viajeCState().book.lines.length===1",timeout=5000);page.wait_for_timeout(1500)
    if SHOTS:page.screenshot(path=f'{SHOTS}/tirolina-{width}.png')
    t0=time.time();here_pulse(page);page.wait_for_function("!!__r.viajeCState().ride",timeout=4000);assert page.evaluate("__r.bandBusy()") is True
    page.wait_for_function("!__r.viajeCState().ride&&__r.viajeCState().book.rides===1",timeout=9000);ride=time.time()-t0
    assert abs(page.evaluate("__r.S.wx")-b1['x'])<2 and abs(page.evaluate("__r.S.wy")-b1['y'])<2 and ride<7,ride
    assert st(page)['summary']==f"Tirolina · km {b1['km']}",st(page)['summary']
    here_pulse(page);page.wait_for_timeout(400);assert not st(page)['ride'],'it waits until you step away'
    # --- 5 · A sea of dust: the ring of rocks stops the cube; a pulse sinks it; the hidden thing in the middle; out on the other side.
    mark('5')
    du,h=P['du'],P['hidden'];R=P['ring']+P['wall'];go(page,du['x']+R+3,du['y']);page.wait_for_timeout(250);go(page,du['x']+P['ring'],du['y']);page.wait_for_timeout(250)
    x=page.evaluate("__r.S.wx")-du['x'];assert abs(x-R)<2,('stopped by the rocks',x,R)
    before=sparks(page);go(page,du['x']+380,du['y']);page.wait_for_timeout(150);here_pulse(page);page.wait_for_function("!!__r.viajeCState().sunk",timeout=4000)
    assert page.evaluate("__r.bandBusy()") is True
    if sound:page.wait_for_function("__r.viajeCState().dark&&__r.comfortLowpass.frequency.value<2500",timeout=5000)
    page.wait_for_function("__r.viajeCState().drawn.dust?.hidden===true",timeout=4000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/polvo-{width}.png')
    for k in range(1,9):go(page,du['x']+380-k*45,du['y']);page.wait_for_timeout(60)
    page.wait_for_function(f"!!__r.viajeCState().book.dust[{du['id']!r}]",timeout=5000)
    assert paid_log(page,'Bajo el polvo')==[12] and sparks(page)-before>=12,paid_log(page,'Bajo el polvo');wait_toast(page,'Bajo el polvo · '+h['name'])
    for k in range(1,12):go(page,du['x']-k*45,du['y']);page.wait_for_timeout(40)
    page.wait_for_function("!__r.viajeCState().sunk",timeout=4000);assert page.evaluate("__r.S.wx")<du['x']-P['ring'],'out on the other side'
    if sound:page.wait_for_function("!__r.viajeCState().dark",timeout=3000)
   # --- 6 · The kit: a box gives the net for ever; the net gathers a bank of light; the scrap still needs a magnet.
   mark('6')
   ca,po,sc=P['ca'],P['po'],P['sc'];go(page,ca['x']+80,ca['y']);page.wait_for_function("!!__r.viajeCState().book.tools.red",timeout=6000)
   wait_toast(page,'Net · Opens the banks of light.' if en else 'Red · Abre los bancos de luz.')
   if not en:
    assert paid_log(page,'Red')==[],'a tool pays nothing'
    go(page,sc['x']+200,sc['y']);page.wait_for_function("__r.viajeCState().drawn.hint==='Chatarra de satélite · Hace falta un imán.'",timeout=6000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/chatarra-{width}.png')
    go(page,sc['x']+60,sc['y']);page.wait_for_timeout(300);assert st(page)['book']['gathered']['chatarra']==0
    before=sparks(page);go(page,po['x']+60,po['y']);page.wait_for_function("__r.viajeCState().book.gathered.banco===1",timeout=6000)
    assert paid_log(page,'Banco de luz')==[12] and sparks(page)-before>=12,paid_log(page,'Banco de luz')
   # --- 7 · The Bitácora: every band reached, with its line (on the phone, in Spanish and English).
   mark('7')
   if width<500:
    go(page,ca['x']+3000,ca['y']);j=bandas(page)
    if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-{lang}-{width}.png')
    assert {'pulsar','asteroide','tirolina','polvo','kit'}<=set(j['rows']),j['rows']
    if en:assert j['summary'].startswith('What lies farther · ') and 'Tool kit' in j['text'] and 'Net' in j['text'],j
    else:
     for line in ['Mejor racha · ','1 núcleo · 1 de 7 clases','1 tirolina tendida · 1 viaje','1 hallazgo bajo el polvo','Red · 1 recogida']:assert line in j['text'],(line,j['text'])
   # --- 8 · Kept on reload (once, on the phone).
   mark('8')
   if width<500 and not en:
    page.evaluate("__r.save()");page.reload();page.wait_for_function("!!window.__r?.viajeCState",timeout=30000);page.evaluate(FREE)
    s=st(page)['book'];assert s['tools'].get('red'),s
    assert len(s['lines'])==1 and s['rides']==1 and len(s['cores'])==1 and len(s['dust'])==1 and s['gathered']['banco']==1 and s['volleys']['n']==1,s
    assert page.evaluate("__r.bandState().book.far")>=50
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS lo que hay más lejos, tanda C, on phone and desktop in {elapsed:.0f} s: crossing 30 km tells once; a pulsar\'s six flashes dodged (phone) or sent back on time (desktop), one scene at a time, for 15 ✦; an asteroid dug layer by layer to its core for 12 ✦; a zip line laid between two buoys stepped on and ridden back; the ring of rocks stops the cube, a pulse sinks it under the dust (the music darker), the hidden thing for 12 ✦ and out on the other side; the net for ever, a bank of light for 12 ✦, the scrap asks for a magnet; the Bitácora lines; kept on reload; English')
finally:server.shutdown()
