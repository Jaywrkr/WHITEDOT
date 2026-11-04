"""Escenas musicales (alpha.241) in the real game, on phone and desktop. «Escenas: más variedad» sits in Sonido, off by
default: with it off a stage stays silent (no bus). On, it is kept in the save (and after a reload); walking to a stage of
the free World raises its club on its own bus, on the music's clock, and a short line says where you are
(«Escena · Almacén» or «Escena · Patio latino»); walking away lets the bus go within a few bars. Switched off at the stage,
it fades and lets go too (rounds, the Journey and the finales: tests/scenes.mjs)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('SCENES_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# The nearest stage of this world, of a scene or any (the same model the game reads).
FIND="""async(scene)=>{const r=__r,M=await import('/src/scenes-model.js'),world=M.sceneWorldKey(r.worldIdentity??r.S.worldIdentity),RP=r.REG*r.WCH,under=(x,y)=>{const d=r.regionOfPos(x,y);return {genre:d.genre,sea:!!d.sea};};
 const zp=RP*M.ZONE_REGIONS,cx=Math.floor(r.S.wx/zp),cy=Math.floor(r.S.wy/zp);
 for(let R=0;R<40;R++)for(let zx=cx-R;zx<=cx+R;zx++)for(let zy=cy-R;zy<=cy+R;zy++){if(Math.max(Math.abs(zx-cx),Math.abs(zy-cy))!==R)continue;const s=M.stageInZone(world,zx,zy,under,RP);if(s&&(!scene||s.scene===scene))return {x:s.x,y:s.y,id:s.id,scene:s.scene};}
 return null;}"""
GO="(p)=>{const r=__r;r.S.wx=p.x;r.S.wy=p.y;if(r.body){r.body.x=r.body.px=p.x;r.body.y=r.body.py=p.y;}}"
TOAST="(t)=>document.getElementById('toast').textContent.includes(t)"
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.sceneState&&__r.ringState?.().active",timeout=20000)
   page.evaluate(FREE);page.wait_for_timeout(300)
   # --- The switch in Sonido: off by default, short, inside the sheet at any width (inside «Avanzado» since alpha.257).
   page.evaluate("document.getElementById('mMusic').hidden=false;document.getElementById('musicAdvanced').open=true");page.wait_for_timeout(100)
   box=page.locator('#scenesSetting');assert box.is_visible() and not box.is_checked()
   label=page.locator('label:has(#scenesSetting)');assert label.inner_text().strip()=='Escenas: más variedad',label.inner_text()
   assert page.inner_text('#scenesHint').startswith('Algunos lugares suenan como un club.')
   sheet=page.evaluate("(()=>{const s=document.querySelector('#mMusic .sheet').getBoundingClientRect(),b=document.querySelector('.scenes-setting').getBoundingClientRect();return {s:[s.left,s.right],b:[b.left,b.right],doc:document.documentElement.scrollWidth};})()")
   assert sheet['b'][0]>=sheet['s'][0]-1 and sheet['b'][1]<=sheet['s'][1]+1 and sheet['doc']<=width,sheet
   if SHOTS:page.screenshot(path=f'{SHOTS}/escenas-sonido-{width}.png')
   page.evaluate(HIDE)
   # Sound on: the music runs.
   page.evaluate("()=>{const r=__r;r.S.sound=true;r.audio?.();window.__bars=[];r.sceneCue=n=>{if(n.kind==='bar')__bars.push(n);};}")
   page.wait_for_function("__r.ac?.state==='running'&&(__r.MU?.sq?.length||0)>4",timeout=10000)
   stage=page.evaluate(FIND,None);assert stage,'a stage in this world'
   # --- Off: at the stage, nothing.
   page.evaluate(GO,stage);page.wait_for_timeout(2500);st=page.evaluate("__r.sceneState()");assert not st['bus'] and not st['on'],st
   # --- On (the box in Sonido): saved; at the stage its club rises on the bars with its line.
   page.evaluate("document.getElementById('mMusic').hidden=false;document.getElementById('musicAdvanced').open=true");page.click('#scenesSetting');assert page.evaluate("__r.S.scenes.on===true")
   page.evaluate(HIDE)
   page.wait_for_function("__r.sceneState().bus&&__bars.length>=1",timeout=12000)
   st=page.evaluate("__r.sceneState()");assert st['scene']==stage['scene'] and st['stage']['id']==stage['id'] and st['section']=='intro',st
   line='Escena · Almacén' if stage['scene']=='almacen' else 'Escena · Patio latino'
   page.wait_for_function(TOAST,arg=line,timeout=12000)
   page.wait_for_function("__r.sceneState().voices>20",timeout=12000)
   b=page.evaluate("__bars");six=page.evaluate("__r.SIX")
   if len(b)>=2:assert abs((b[1]['time']-b[0]['time'])/(16*six)-1)<.05,(b[:2],six)
   if SHOTS:page.screenshot(path=f'{SHOTS}/escenas-linea-{width}.png')
   # --- Walking away: it fades over a few bars and the bus is let go (the music as before).
   page.evaluate(GO,{'x':stage['x']+60000,'y':stage['y']});page.wait_for_function("!__r.sceneState().bus",timeout=20000)
   # --- The other scene too, on the desktop.
   if width>600:
    other=page.evaluate(FIND,'patio' if stage['scene']=='almacen' else 'almacen')
    if other:
     page.evaluate(GO,other);page.wait_for_function("__r.sceneState().bus",timeout=12000)
     page.wait_for_function(TOAST,arg='Escena · Patio latino' if other['scene']=='patio' else 'Escena · Almacén',timeout=12000)
     # Switched off at the stage: it fades and lets go.
     page.evaluate("document.getElementById('mMusic').hidden=false;document.getElementById('musicAdvanced').open=true");page.click('#scenesSetting');page.evaluate(HIDE)
     assert page.evaluate("__r.S.scenes.on===false");page.wait_for_function("!__r.sceneState().bus",timeout=20000)
     page.evaluate("document.getElementById('mMusic').hidden=false;document.getElementById('musicAdvanced').open=true");page.click('#scenesSetting');page.evaluate(HIDE)
   # --- Kept after a reload.
   if width<600:
    page.evaluate("__r.save()");page.reload();page.wait_for_function("!!window.__r?.sceneState",timeout=20000)
    assert page.evaluate("__r.S.scenes.on===true")
    page.evaluate("document.getElementById('mMusic').hidden=false;document.getElementById('musicAdvanced').open=true");page.wait_for_timeout(100);assert page.locator('#scenesSetting').is_checked();page.evaluate(HIDE)
   assert not errors,errors
   page.close()
  browser.close()
 print(f'PASS scenes smoke: the switch in Sonido (off by default, kept), a stage rises with its line and lets go on leaving and when switched off, phone and desktop, {time.time()-started:.0f} s',flush=True)
 assert time.time()-started<145
finally:
 server.shutdown()
