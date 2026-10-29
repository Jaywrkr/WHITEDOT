"""Descubrir (alpha.240) · Álbum de sonidos in the real game, on phone and desktop. A rare sound in the free World sings
on the music's bars, softly (far under it), and is drawn with its biome's colour, a white ring and two words once near,
or a white mark at the screen's edge while out of view. Passing through it keeps it: sparks by the universe's rule (8 a new
one, 1 one you already have) and its page in the album; a pulse on time near it keeps it on time. The fifth of a biome
completes its series: the Aro de sonidos round the cube (gold, earned), which Tu cubo puts on and takes off. In the album
up to four sounds make your mix, which plays on the music's bars on top of it and stops on «Parar» or when the album
closes; a fifth is refused. Nothing is lost on reload; nothing sounds or pays inside a level or the Refugio."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('DESCUBRIR_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.discoverState&&__r.ringState?.().active",timeout=20000)
   page.evaluate(FREE);page.wait_for_timeout(300)
   st=page.evaluate("__r.discoverState()");assert st['allowed'] and st['album']['version']==1 and not st['album']['sounds'],st
   # Sound on: the music runs and every note this system sends is recorded.
   page.evaluate("()=>{const r=__r;r.S.sound=true;r.audio?.();window.__notes=[];r.discoverAudioCue=n=>__notes.push(n);}")
   page.wait_for_function("__r.ac?.state==='running'&&(__r.MU?.sq?.length||0)>4",timeout=10000)
   sparks0=page.evaluate("__r.S.sparks")
   # --- One in the World, 50 m ahead: drawn, heard on the bars (every two), far under the music.
   spot=page.evaluate("__r.soundSpawn('lago:pez',500,0)");assert spot
   page.wait_for_function("__notes.length>=2",timeout=12000)
   notes=page.evaluate("__notes");assert all(n['sound']=='lago:pez' and n['gain']<=.012 and n['instrument']=='fmglass' and 36<=n['note']<=96 for n in notes),notes
   assert page.evaluate("__r.discoverState().heard")>=1
   # Its notes fall on the music's grid of eighths.
   six=page.evaluate("__r.SIX");bar=[n['time'] for n in notes[:2]];assert abs((bar[1]-bar[0])/(six*2)-round((bar[1]-bar[0])/(six*2)))<1e-3,(bar,six)
   if SHOTS:page.screenshot(path=f'{SHOTS}/sonidos-cerca-{width}.png')
   # Off screen it leaves a white mark at the edge (the next step stays visible).
   page.evaluate(f"(()=>{{__r.S.wx={spot['x']}-1500;__r.S.wy={spot['y']};}})()");page.wait_for_timeout(250)
   if width<600:assert page.evaluate("__r.discoverState().drawn.hint"),'a mark at the edge'
   # --- Passing through keeps it: 8 ✦, the album, a summary; the same spot does not pay twice.
   page.evaluate(f"(()=>{{__r.S.wx={spot['x']};__r.S.wy={spot['y']};}})()");page.wait_for_function("!!__r.discoverState().album.sounds['lago:pez']",timeout=4000)
   st=page.evaluate("__r.discoverState()");assert page.evaluate("__r.S.sparks")==sparks0+8,(sparks0,page.evaluate("__r.S.sparks"))
   assert st['summary'].startswith('Pez campana · Lago · 1 de 5 · +8'),st['summary']
   page.wait_for_function("document.getElementById('toast').textContent.includes('Sonido nuevo')",timeout=8000)
   page.wait_for_timeout(300);assert page.evaluate("__r.S.sparks")==sparks0+8,'a spot once'
   # Another spot of the same sound: a loose spark's worth. A pulse on time near another keeps it on time.
   s2=page.evaluate("__r.soundSpawn('lago:pez',0,150)");page.evaluate(f"(()=>{{__r.S.wx={s2['x']};__r.S.wy={s2['y']};}})()");page.wait_for_function("__r.discoverState().album.sounds['lago:pez'].count===2",timeout=4000)
   assert page.evaluate("__r.S.sparks")==sparks0+9
   s3=page.evaluate("__r.soundSpawn('lago:ola',200,0)");page.evaluate(f"(()=>{{const r=__r;r.waves.push({{x:{s3['x']}-150,y:{s3['y']},r:0,prev:0,max:340,n:0,origin:'player',beat:true}});}})()")
   page.wait_for_function("!!__r.discoverState().album.sounds['lago:ola']",timeout=4000);assert page.evaluate("__r.discoverState().album.sounds['lago:ola'].onTime")==1
   assert page.evaluate("__r.S.sparks")==sparks0+9+11,'on time: ×1.5'
   # --- The rest of the Lago: the series complete gives the Aro de sonidos (gold, earned), worn at once, no extra sparks.
   for i,sid in enumerate(['lago:burbuja','lago:rana','lago:ballena']):
    sp=page.evaluate(f"__r.soundSpawn('{sid}',{-300-100*i},0)");page.evaluate(f"(()=>{{__r.S.wx={sp['x']};__r.S.wy={sp['y']};}})()");page.wait_for_function(f"!!__r.discoverState().album.sounds['{sid}']",timeout=4000)
   st=page.evaluate("__r.discoverState()");assert st['album']['series'].get('lago') and st['wearing'],st['album']
   assert page.evaluate("__r.S.sparks")==sparks0+9+11+24,'the series pays nothing more'
   page.wait_for_function("document.getElementById('toast').textContent.includes('Aro de sonidos')",timeout=12000)
   page.wait_for_timeout(400)
   if SHOTS:page.screenshot(path=f'{SHOTS}/sonidos-aro-{width}.png')
   # Tu cubo: the Aro, taken off and put on again.
   page.evaluate("document.getElementById('mCube').hidden=false");page.wait_for_function("!document.getElementById('cubeSoundSection').hidden&&!!document.getElementById('cubeSoundRing')",timeout=4000)
   assert page.get_attribute('#cubeSoundRing','aria-pressed')=='true'
   page.evaluate("document.getElementById('cubeSoundRing').click()");assert page.get_attribute('#cubeSoundRing','aria-pressed')=='false' and not page.evaluate("__r.discoverState().wearing")
   page.evaluate("document.getElementById('cubeSoundRing').click()");assert page.evaluate("__r.discoverState().wearing")
   page.evaluate(HIDE)
   # --- The album: chips, your mix of four at most, played on the bars on top of the music; stops on Parar or closing.
   page.evaluate("__r.openJournal('places')");page.wait_for_function("!!document.querySelector('#journalBody [data-sound-album]')",timeout=4000)
   page.evaluate("document.querySelector('#journalSounds').open=true");page.click('#journalBody [data-sound-album]')
   page.wait_for_function("!document.getElementById('mSoundAlbum').hidden&&document.getElementById('mJournal').hidden",timeout=3000)
   assert page.inner_text('#soundAlbumCount')=='5 de 55'
   chips=page.locator('#soundAlbumList button.sound-chip');assert chips.count()==5;assert page.locator('#soundAlbumList [data-sound-missing]').count()==50
   assert page.is_disabled('#soundMixPlay')
   for sid in ['lago:pez','lago:ola','lago:burbuja','lago:rana']:page.click(f'#soundAlbumList [data-sound-id="{sid}"]')
   page.click('#soundAlbumList [data-sound-id="lago:ballena"]');assert 'ya tiene 4' in page.inner_text('#soundMixNote'),'a fifth is refused'
   assert page.evaluate("__r.discoverState().album.mix")==['lago:pez','lago:ola','lago:burbuja','lago:rana']
   page.click('#soundAlbumList [data-sound-id="lago:rana"]');page.click('#soundAlbumList [data-sound-id="lago:ballena"]')
   assert page.evaluate("__r.discoverState().album.mix")==['lago:pez','lago:ola','lago:burbuja','lago:ballena']
   # Choosing a sound lets you hear it once on the next beat; let that preview pass before listening to the mix.
   page.wait_for_timeout(1500)
   page.evaluate("window.__notes=[]");page.click('#soundMixPlay');assert page.inner_text('#soundMixPlay')=='Parar' and page.evaluate("__r.discoverState().mixOn")
   page.wait_for_function("new Set(__notes.filter(n=>n.gain<=.012).map(n=>n.sound)).size>=4",timeout=12000)
   mix=page.evaluate("__notes");assert all(n['gain']<=.012 for n in mix),mix
   # Together: the four start on the same bar.
   starts={};[starts.setdefault(n['sound'],n['time']) for n in mix];assert max(starts.values())-min(starts.values())<six*8+1e-3,starts
   assert 'Suena tu mezcla · 4 sonidos' in page.inner_text('#soundMixNote')
   if SHOTS:page.screenshot(path=f'{SHOTS}/sonidos-album-{width}.png')
   page.click('#soundMixPlay');assert not page.evaluate("__r.discoverState().mixOn")
   page.click('#soundMixPlay');page.click('#soundAlbumClose')
   page.wait_for_function("document.getElementById('mSoundAlbum').hidden&&!document.getElementById('mJournal').hidden",timeout=3000)
   assert not page.evaluate("__r.discoverState().mixOn"),'closing stops the mix and goes back to the Bitácora'
   page.evaluate(HIDE)
   # --- Reload: everything kept (album, mix, the Aro); nothing new pays twice.
   page.reload();page.wait_for_function("!!window.__r?.discoverState",timeout=20000);page.evaluate(FREE)
   st=page.evaluate("__r.discoverState()");assert len(st['album']['sounds'])==5 and st['album']['mix']==['lago:pez','lago:ola','lago:burbuja','lago:ballena'] and st['album']['series'].get('lago'),st['album']
   # --- Not in the Refugio (and never in a level): nothing drawn, sung or kept there.
   page.evaluate("__r.landHouse()");page.wait_for_function("__r.houseActive()",timeout=15000)
   assert not page.evaluate("__r.discoverState().allowed") and page.evaluate("__r.soundSpawn('bosque:buho')") is None
   page.evaluate("__r.exitHouse()");page.wait_for_function("!__r.houseActive()",timeout=8000)
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS Álbum de sonidos on phone and desktop in {elapsed:.0f} s: a rare sound sings on the bars far under the music, drawn with its ring and an edge mark; kept by passing through (8 ✦) or a pulse on time (×1.5), a repeat 1 ✦, a spot once; the Lago series gives the Aro de sonidos, worn and taken off in Tu cubo; the album makes a mix of four on the bars, refuses a fifth, stops on Parar or closing and goes back to the Bitácora; kept on reload; nothing in the Refugio',flush=True)
finally:server.shutdown()
