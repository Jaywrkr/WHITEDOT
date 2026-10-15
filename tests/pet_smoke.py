"""Earned native births, cube contact, learned phrase, UI silence and save isolation."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for species,size in [('golondrina',{'width':390,'height':844}),('grulla',{'width':844,'height':390}),('luciernaga',{'width':1280,'height':800})]:
   if os.environ.get('PET_ONLY') and species!=os.environ['PET_ONLY']:continue
   context=browser.new_context(viewport=size,has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?lab=1&testSeed=laboratorio&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
   page.evaluate('(s)=>{__testRuntime.labGo("life:"+s);document.querySelectorAll(".modal").forEach(m=>m.hidden=true);}',species)
   page.wait_for_function('__testRuntime.body.ready&&!__testRuntime.body.jump');assert page.evaluate('__testRuntime.S.pet') is None
   page.evaluate("(species)=>{const r=__testRuntime,f=r.nearbyFlocks(500).find(f=>f.species===species);window.__f=f;r.S.wx=f.x;r.S.wy=f.y;r.audio();}",species)
   page.wait_for_function('__testRuntime.ac?.state==="running"');page.wait_for_timeout(600)
   page.evaluate('()=>{__f.trust=1;__f.scatter=0;__f.follow=45;__f.followTime=29.99;__f.sync=1;}')
   if species!='luciernaga':page.evaluate("async()=>{for(let i=0;i<25;i++){__testRuntime.S.wx+=2;await new Promise(requestAnimationFrame);}}")
   try:page.wait_for_function('__testRuntime.S.pet!==null',timeout=35000)
   except Exception:
    print(page.evaluate('({pet:__testRuntime.S.pet,f:{species:__f.species,trust:__f.trust,follow:__f.follow,followTime:__f.followTime,sync:__f.sync,scatter:__f.scatter},body:__testRuntime.body})'),flush=True);raise
   assert page.evaluate('__testRuntime.S.pet.species')==species
   assert page.evaluate('__testRuntime.S.ach.mascota1')
   # One companion: another birth must not replace its species or phrase.
   assert not page.evaluate('__testRuntime.petBond({species:"grulla",trust:1,follow:45,followTime:99,id:"other"},.05)===true')
   assert page.evaluate('__testRuntime.S.pet.species')==species
   # Some native flock sites are silence pockets: the pet respects those too.
   page.evaluate('()=>{const r=__testRuntime;if(r.currentPocket()?.kind!=="quiet")return;const x=r.S.wx,y=r.S.wy;for(let i=1;i<15;i++){r.S.wx=x+i*60;if(r.currentPocket()?.kind!=="quiet")return;}r.S.wx=x;r.S.wy=y+950;}')
   page.evaluate('()=>{const r=__testRuntime;r.S.wx=Math.floor(r.S.wx/r.WCH)*r.WCH+20;r.S.wy=Math.floor(r.S.wy/r.WCH)*r.WCH+20;}')
   page.wait_for_timeout(400);assert page.evaluate('__testRuntime.currentPocket()?.kind')!='quiet'
   page.evaluate('()=>{const r=__testRuntime;window.__petNotes=[];r.petNoteCue=n=>__petNotes.push(n);r.playVoice("pulso",4,r.ac.currentTime+.1,r.regionOfPos(r.S.wx,r.S.wy),false,.2,null,"player");}')
   try:page.wait_for_function('__petNotes.length>0',timeout=12000)
   except Exception:
    print(page.evaluate('({species:__testRuntime.S.pet?.species,pet:__testRuntime.petState,pocket:__testRuntime.currentPocket()?.kind,culture:__testRuntime.cultureListening,step:__testRuntime.MU.step,sound:__testRuntime.S.sound,audio:__testRuntime.ac.state,modals:[...document.querySelectorAll(".modal:not([hidden])")].map(m=>m.id)})'),flush=True);raise
   assert page.evaluate('__petNotes[0].role')=={'golondrina':'melody','grulla':'bass','luciernaga':'groove'}[species]
   if species=='grulla':assert page.evaluate('__petNotes[0].note>=36&&__petNotes[0].note<=52')
   # Only the cube touching it queues its phrase, without teaching that phrase back to itself.
   # The pet comes to a still cube. Moving the cube, a following flock or a travelling pulse would play player notes that may teach it legitimately.
   page.evaluate('()=>{const r=__testRuntime,p=r.petState;r.waves.length=0;const x=r.S.wx;for(let i=1;i<40&&(r.nearbyFlocks(900).length||r.currentPocket()?.kind==="quiet"||r.regionOfPos(r.S.wx,r.S.wy).sea);i++)r.S.wx=x+i*1500;if(r.nearbyFlocks(900).length)throw Error("no quiet test spot");window.__phrase=JSON.stringify(r.S.pet.phrase);window.__count=__petNotes.length;p.x=r.S.wx;p.y=r.S.wy;}')
   page.wait_for_function('__petNotes.length>__count',timeout=12000)
   assert page.evaluate('JSON.stringify(__testRuntime.S.pet.phrase)')==page.evaluate('__phrase')
   page.evaluate('()=>{__testRuntime.S.sound=false;window.__silentCount=__petNotes.length;}');page.wait_for_timeout(300);assert page.evaluate('__petNotes.length')==page.evaluate('__silentCount');page.evaluate('__testRuntime.S.sound=true')
   page.locator('#bMenu').click();page.locator('#bCube').click();assert page.locator('#mCube').is_visible()
   page.evaluate('()=>{const r=__testRuntime;r.S.ach.poder_cometa=r.S.ach.tiempo=r.S.ach.bandada1=r.S.todayKey;r.S.ach.tope=r.S.todayKey;}')
   page.locator('#cubeClose').click();page.locator('#bMenu').click();page.locator('#bCube').click()
   before=page.evaluate('({w:__testRuntime.waves.length,q:__testRuntime.MU.q8.length})')
   page.get_by_role('button',name='Ámbar',exact=True).click();page.locator('#cubeTabMotion').click();page.locator('#cubeTrails').get_by_role('button',name='Línea',exact=True).click();page.locator('#cubeHalos').get_by_role('button',name='Pulso',exact=True).click();page.locator('#cubeApply').click()
   assert page.evaluate('__testRuntime.cubeColor()')=='#f0d27a';assert page.evaluate('__testRuntime.S.cube.trail')=='line'
   assert page.evaluate('__testRuntime.waves.length')==before['w'];assert page.evaluate('__testRuntime.MU.q8.length')<=before['q']
   page.locator('#bMenu').click();page.locator('#bCube').click()
   seconds=page.evaluate('__testRuntime.S.pet.seconds');page.evaluate('()=>{const r=__testRuntime;r.S.wx=Math.floor(r.S.wx/r.WCH)*r.WCH+20;r.S.wy=Math.floor(r.S.wy/r.WCH)*r.WCH+20;}')
   page.wait_for_timeout(400);assert page.evaluate('__testRuntime.S.pet.seconds')==seconds
   page.screenshot(path=f'/tmp/whitedot-cube-{species}.png');page.locator('#cubeClose').click();page.wait_for_timeout(100)
   page.evaluate('__testRuntime.save()');phrase=page.evaluate('__testRuntime.S.pet.phrase');page.reload();page.wait_for_function('__testRuntime?.labMode')
   assert page.evaluate('__testRuntime.S.pet.species')==species;assert page.evaluate('__testRuntime.S.pet.phrase')==phrase;assert page.evaluate('__testRuntime.cubeColor()')=='#f0d27a'
   # Replacement/reset cannot leak a companion or appearance from the previous save.
   page.evaluate('()=>{const r=__testRuntime;r.S={...r.S,pet:null,cube:undefined,color:"#ffffff"};if(r.petCard()!=="")throw Error("stale companion");if(r.cubeColor()!=="#ffffff")throw Error("stale cube");}')
   # A genuinely rare natural-box seed uses the same opening/contact route, without a species menu.
   page.evaluate('async()=>{const r=__testRuntime,{boxAt}=await import("/src/expansion-music.js");document.querySelectorAll(".modal").forEach(m=>m.hidden=true);let box;outer:for(let x=-200;x<=200;x++)for(let y=-100;y<=100;y++){const id="caja:"+x+","+y;if(r.seedOf("pet:box:v1:"+id)%128!==0||r.S.boxes[id])continue;const b=boxAt(x,y,r.WCH,r.seedOf,r.rng);if(b&&!r.regionOfPos(b.x,b.y).sea){box=b;break outer;}}if(!box)throw Error("no rare natural box fixture");window.__rareBox=box;r.S.wx=box.x;r.S.wy=box.y;}')
   page.wait_for_function('__testRuntime.hasPower("companero")',timeout=8000);assert page.evaluate('__testRuntime.S.pet') is None;assert page.evaluate('__testRuntime.S.boxes[__rareBox.id]')==1
   assert page.evaluate('__testRuntime.rareCards.some(c=>c.type.startsWith("petbox:")&&c.sourceId===__rareBox.id)'),"rare-box birth must save a companion card"
   assert page.evaluate('__testRuntime.rareCards.some(c=>c.type.startsWith("box:")&&c.sourceId===__rareBox.id)'),"natural box must save its power card"
   assert not errors,errors;print(f'PASS {species}: earned birth, role reply, cube contact, phrase persistence, quiet UI, earned customization and reset at {size}',flush=True);context.close()
  browser.close()
finally:server.shutdown()
