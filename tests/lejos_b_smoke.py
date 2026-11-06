"""Lejos del origen, tanda B (alpha.249) · the free World on phone and desktop. A faded region past 10 km is grey, its
music low (runtime.musicDuck, with sound) and no living encounter starts in it; its four embers are lit by passing
(phone, no sound) or by pulses on time (desktop, sound): revived, it pays by the universe's rule, the music comes back
and it stays on the Mapa del universo. A habitat: its elements brought to the nest by passing through them bring a
creature that knows you when you come back. A song of the sky: four stones in order (passing without sound, pulses on
time with it) change the sky for a minute. A search postcard: five lost things among dense stars give the postcard,
with no sparks. The fusion of sounds opens at 20 km and lives in the Refugio (Más › Fusión de sonidos): two sounds of
the album make a new one for the album, in your mix like the others. The Bitácora › «Lejos del origen» lists only what
was found; everything is kept on reload. English at 390×844."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('LEJOS_B_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# The nearest site of each kind to a point, with its fixed points (embers, elements, stones, lost things).
SITES="""async o=>{const M=await import('/src/lejos-b-model.js'),w=__r.lejosBState().world,out={};
 for(const [kind,km] of Object.entries(M.SITE_KINDS)){const s=M.nearestSite(w,{x:o.x??(km+1.5)*10000,y:o.y??0},kind);out[kind]={id:s.id,x:s.x,y:s.y,km:s.km,
  points:kind==='apagada'?M.embersOf(s):kind==='habitat'?M.elementsOf(s):kind==='cancion'?M.stonesOf(s):M.lostOf(s)};}
 out.reward={dead:M.reviveReward(out.apagada.x,out.apagada.y,false),deadOnTime:M.reviveReward(out.apagada.x,out.apagada.y,true)};out.duck=M.DEAD_DUCK;return out;}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.lejosBState&&__r.ringState?.().active&&!!__r.openUniverseMap&&!!__r.enterHouse",timeout=30000)
 page.evaluate(FREE);page.wait_for_function("__r.lejosBState().allowed",timeout=10000);return page,errors
def go(page,x,y):page.evaluate(f"()=>{{__r.S.wx={x};__r.S.wy={y};}}")
def st(page):return page.evaluate("__r.lejosBState()")
def pulse(page,x,y):page.evaluate(f"()=>__r.waves.push({{x:{x},y:{y},r:0,prev:0,max:340,n:0,origin:'player',beat:true}})")
def sound_on(page):
 page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.ac?.resume?.();}");page.wait_for_function("__r.ac?.state==='running'&&!!__r.master",timeout=10000)
def log(page,title):return page.evaluate(f"__r.S.sparkEconomy.log.filter(e=>e.title==={title!r}).map(e=>e.text)")
# The wallet and the ledger, to tell what paid in a span: an amount the entry states («+N chispas»), or the fixed reward of
# a goal or set (their entries carry only the title). Spark goals tick on their own clock and can land in any span.
def wallet(page):
 w=page.evaluate("({sparks:__r.S.sparks,log:__r.S.sparkEconomy.log.length,lejos:__r.lejosBState().book.earned})");assert w['log']<70,w;return w
LEDGER="""async from=>{const M=await import('/src/sparks-model.js'),fixed={};for(const g of [...M.SPARK_BADGES,...M.SPARK_SETS])fixed[g.title||g.name]=g.reward;for(const m of M.SPARK_MILESTONES)fixed[m.title]=0;fixed[M.SPARK_UNIVERSE.title]=0;
 return __r.S.sparkEconomy.log.slice(from).map(e=>({title:e.title,text:e.text,amount:Number((/\\+(\\d+) chispas/.exec(e.text)||[])[1]??fixed[e.title]??NaN)}));}"""
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height,lang in [(390,844,'es'),(1280,800,'es'),(390,844,'en')]:
   page,errors=page_for(browser,width,height,'?anillo=1'+('&lang=en' if lang=='en' else ''))
   sound=width>500;S=page.evaluate(SITES,{});d=S['apagada']
   if sound:sound_on(page)
   # --- 1 · A faded region: grey, quiet, no encounter in it; four embers bring it back for good.
   go(page,d['x'],d['y']);page.wait_for_function("__r.lejosBState().drawn.dead?.grey===true&&__r.lejosBState().busy",timeout=8000)
   assert page.evaluate("__r.liveEncounterSpawn?.('polilla')") is not True,'one scene at a time'
   if sound:page.wait_for_function(f"__r.musicDuck==={S['duck']}&&__r.lejosBState().ducked",timeout=6000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/region-apagada-{lang}-{width}.png')
   sparks=page.evaluate("__r.S.sparks")
   for k,e in enumerate(d['points']):
    if sound:go(page,e['x']+30,e['y']);pulse(page,e['x'],e['y'])
    else:go(page,e['x'],e['y'])
    page.wait_for_function(f"(__r.lejosBState().book.dead[{d['id']!r}]?.lit.length||0)>={k+1}",timeout=8000)
   page.wait_for_function(f"!!__r.lejosBState().book.dead[{d['id']!r}]?.done",timeout=6000);s=st(page)
   want=S['reward']['deadOnTime' if sound else 'dead'];got=log(page,'Región revivida')
   assert len(got)==1 and got[0].endswith(f'+{want} chispas') and page.evaluate("__r.S.sparks")-sparks>=want and 8<=want<=15,(got,want)
   assert s['summary'].startswith('Región revivida'),s['summary']
   go(page,d['x'],d['y']);page.wait_for_function("__r.lejosBState().drawn.dead?.grey===false",timeout=6000)
   if sound:page.wait_for_function("__r.musicDuck===1&&!__r.lejosBState().ducked",timeout=6000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/region-revivida-{lang}-{width}.png')
   page.evaluate(HIDE);assert page.evaluate("__r.openUniverseMap('region')")
   page.wait_for_function(f"__r.universeMapState().drawn.some(i=>i.kind==='revived'&&i.id==={d['id']!r})",timeout=6000);page.evaluate("__r.closeUniverseMap()")
   if lang=='es':
    # --- 2 · A habitat: the elements to the nest bring a creature; coming back, it knows you.
    h=S['habitat'];go(page,h['x'],h['y']+200);page.wait_for_function(f"__r.lejosBState().drawn.habitat?.id==={h['id']!r}",timeout=8000)
    for k,e in enumerate(h['points']):go(page,e['x'],e['y']);page.wait_for_function(f"(__r.lejosBState().book.habitats[{h['id']!r}]?.placed.length||0)>={k+1}",timeout=8000)
    page.wait_for_function(f"!!__r.lejosBState().book.habitats[{h['id']!r}]?.done",timeout=6000);c=st(page)['book']['habitats'][h['id']]['c'];assert c,c
    if SHOTS:page.screenshot(path=f'{SHOTS}/habitat-{width}.png')
    go(page,h['x']+40000,h['y']);page.wait_for_timeout(400);go(page,h['x']+100,h['y'])
    page.wait_for_function(f"__r.lejosBState().book.habitats[{h['id']!r}].visits===1&&__r.lejosBState().summary.startsWith('Te reconoce')",timeout=8000)
    # --- 3 · A song of the sky: four stones in order change the sky for a minute.
    g=S['cancion'];go(page,g['x'],g['y']);page.wait_for_function(f"__r.lejosBState().drawn.song?.id==={g['id']!r}",timeout=8000)
    for k,e in enumerate(g['points']):
     if sound:go(page,g['x'],g['y']);pulse(page,e['x'],e['y'])
     else:go(page,e['x'],e['y'])
     page.wait_for_function(f"__r.lejosBState().song.next==={k+1}||!!__r.lejosBState().effect",timeout=8000);page.wait_for_timeout(120)
    page.wait_for_function("!!__r.lejosBState().effect&&!!__r.lejosBState().drawn.effect",timeout=6000);s=st(page)
    assert abs(s['effect']['until']-s['effect']['start']-60)<1e-6 and s['busy'],s['effect'];assert s['book']['songs'][g['id']]['n']==1
    assert page.evaluate("__r.liveEncounterSpawn?.('polilla')") is not True,'one scene at a time'
    if SHOTS:page.screenshot(path=f'{SHOTS}/cancion-{s["effect"]["kind"]}-{width}.png')
    # --- 4 · A search postcard: five lost things in the stars give the postcard, no sparks.
    p=S['postal'];go(page,p['x'],p['y']);page.wait_for_function(f"__r.lejosBState().postal?.id==={p['id']!r}&&__r.lejosBState().drawn.postal?.shown>=1",timeout=8000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/postal-{width}.png')
    before=wallet(page)
    for k,e in enumerate(p['points']):go(page,e['x'],e['y']);page.wait_for_function(f"(__r.lejosBState().book.postals[{p['id']!r}]?.found.length||0)>={k+1}",timeout=8000)
    page.wait_for_function("Object.keys(__r.lejosBState().book.cards).length===1&&!__r.lejosBState().postal",timeout=6000)
    # A postcard pays nothing: the Lejos book earns nothing, no entry is the postcard's, and any other change in the wallet
    # is an entry of another source (a goal or a set reached meanwhile), never an unexplained one.
    after=wallet(page);paid=page.evaluate(LEDGER,before['log']);creature=page.evaluate("Object.keys(__r.lejosBState().book.cards)[0]||''")
    assert after['lejos']==before['lejos'],('a postcard pays nothing',before,after,paid)
    assert not any('Postal' in e['title'] or (creature and creature in e['title']) for e in paid),('a postcard pays nothing',paid)
    assert after['sparks']-before['sparks']==sum(e['amount'] for e in paid),('a postcard pays nothing',before,after,paid)
   # --- 5 · The fusion: opens at 20 km; in the Refugio, two sounds of the album make a new one.
   page.evaluate("()=>{const a=__r.S.soundAlbum;a.sounds['llanura:grillo']={first:'2026-11-01',count:1,onTime:0};a.sounds['lago:ballena']={first:'2026-11-01',count:1,onTime:0};__r.save();}")
   go(page,205000,0);page.wait_for_function("!!__r.lejosBState().book.fusion.open&&__r.lejosBState().pages.includes('fusion')",timeout=8000)
   page.evaluate(HIDE);page.evaluate("__r.enterHouse()");page.wait_for_function("__r.houseActive()&&!document.getElementById('housePanel').hidden",timeout=8000)
   page.evaluate("document.getElementById('houseMore').open=true");page.wait_for_selector('#houseFusion:not([hidden])',timeout=5000)
   page.locator('#houseFusion').scroll_into_view_if_needed();page.click('#houseFusion');page.wait_for_selector('#mSoundFusion:not([hidden])',timeout=5000)
   page.click('[data-fuse-id="llanura:grillo"]');page.click('[data-fuse-id="lago:ballena"]')
   want=('New · ','Fuse') if lang=='en' else ('Nuevo · ','Fusionar')
   page.wait_for_function(f"document.getElementById('soundFusionNote').textContent.startsWith({want[0]!r})&&!document.getElementById('soundFusionMake').disabled",timeout=4000)
   assert page.inner_text('#soundFusionMake').strip()==want[1]
   if SHOTS:page.screenshot(path=f'{SHOTS}/fusion-{lang}-{width}.png')
   page.click('#soundFusionMake');fid='fusion:lago:ballena+llanura:grillo'
   page.wait_for_function(f"!!__r.S.soundAlbum.sounds[{fid!r}]&&!!__r.lejosBState().book.fusion.made[{fid!r}]",timeout=5000)
   page.wait_for_selector(f'#mSoundFusion [data-fused="{fid}"]',state='attached',timeout=4000);page.click('#soundFusionClose')
   page.evaluate("__r.openSoundAlbum()");page.wait_for_selector(f'#mSoundAlbum [data-sound-biome="fusion"] [data-sound-id="{fid}"]',timeout=4000)
   page.click(f'#mSoundAlbum [data-sound-id="{fid}"]');page.wait_for_function(f"__r.S.soundAlbum.mix.includes({fid!r})",timeout=4000)
   page.evaluate(HIDE);page.evaluate("__r.exitHouse()");page.wait_for_function("!__r.houseActive()",timeout=6000);page.evaluate(FREE)
   # --- 6 · The Bitácora › Lejos del origen: only what was found.
   page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_selector('#journalLejosB',state='attached',timeout=5000)
   page.evaluate("document.getElementById('journalLejosB').open=true;document.getElementById('journalLejosB').scrollIntoView()")
   j=page.evaluate("(()=>{const e=document.getElementById('journalLejosB');return {summary:e.querySelector('summary').textContent,ids:[...e.querySelectorAll('[data-lejos]')].map(p=>p.dataset.lejos),postals:e.querySelectorAll('[data-postal]').length,text:e.textContent}})()")
   if lang=='en':assert j['summary']=='Far from the origin · 2' and 'Revived regions' in j['text'] and 'Sound fusion' in j['text'],j
   else:assert j['ids']==['apagada','habitat','cancion','fusion'] and j['postals']==1 and j['summary']=='Lejos del origen · 5' and 'Gracias por encontrar mis cosas.' in j['text'],j
   if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-{lang}-{width}.png')
   # --- 7 · Kept on reload.
   page.reload();page.wait_for_function("!!window.__r?.lejosBState",timeout=30000);page.evaluate(FREE)
   b=st(page)['book'];assert b['dead'][d['id']]['done'] and b['fusion']['made'].get(fid),b
   if lang=='es':assert len(b['cards'])==1 and any(h.get('done') for h in b['habitats'].values()) and b['songs'][S['cancion']['id']]['n']==1,b
   assert page.evaluate(f"!!__r.S.soundAlbum.sounds[{fid!r}]"),'the fused sound stays in the album'
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS lejos del origen (tanda B) on phone and desktop in {elapsed:.0f} s: a faded region is grey, quiet (music ducked with sound) and holds no encounter, its embers lit by passing or on time revive it for good (paid by the universe rule, on the map); a habitat\'s elements bring a creature that knows you; four stones in order change the sky for a minute; five lost things give a postcard with no sparks; the fusion opens at 20 km and makes a new sound in the Refugio, in the album and the mix; the Bitácora lists only what was found; kept on reload; English',flush=True)
finally:server.shutdown()
