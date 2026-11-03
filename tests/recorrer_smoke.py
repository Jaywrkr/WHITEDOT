"""Recorrer lejos (alpha.245) · the free World on phone and desktop. A buoy of light stands on its km with its number;
passing it counts once (the farthest kept) and the next one outward is marked at the screen's edge. A rest satellite at
10 km: marked at the edge on the way, kept on entering («Punto de retorno guardado»), the music a little lower inside
(the dry bus at 0.5, back to 1 outside). A second one at 20 km: from inside it the Mapa del universo shows both and its
card offers «Ir por la puerta» to the first, which leaves you inside it, for no sparks; outside a satellite the card
only marks. The Bitácora lists them and from inside one offers «Volver al anillo». Kept on reload; English at 390×844."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,math
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('RECORRER_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# Spots from the model itself, with the game's world key (nothing placed by the test).
SPOTS="""async()=>{const M=await import('/src/recorrer-model.js'),D=await import('/src/descubrir-model.js'),w=D.worldKey(__r.worldIdentity);
 return {buoy:M.buoyAt(w,3,2),s1:M.satelliteAt(w,1,0),s2:M.satelliteAt(w,2,5),inside:M.SAT_INSIDE};}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.recorrerState&&__r.ringState?.().active&&!!__r.openUniverseMap",timeout=30000)
 page.evaluate(FREE);page.wait_for_function("__r.recorrerState().allowed",timeout=10000);return page,errors
def go(page,x,y):page.evaluate(f"()=>{{__r.S.wx={x};__r.S.wy={y};}}")
def st(page):return page.evaluate("__r.recorrerState()")
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height,lang in [(390,844,'es'),(1280,800,'es'),(390,844,'en')]:
   page,errors=page_for(browser,width,height,'?anillo=1'+('&lang=en' if lang=='en' else ''))
   sp=page.evaluate(SPOTS);b,s1,s2,inside=sp['buoy'],sp['s1'],sp['s2'],sp['inside'];sparks=page.evaluate("__r.S.sparks")
   if lang=='es':
    # --- 1 · A buoy on its km, with its number; passing it counts once; the next one outward at the edge.
    go(page,b['x']-120,b['y']+260);page.wait_for_function(f"__r.recorrerState().drawn.buoy?.id==='{b['id']}'",timeout=8000)
    d=st(page)['drawn']['buoy'];assert 0<=d['x']<=width and 0<=d['y']<=height,d
    if SHOTS:page.screenshot(path=f'{SHOTS}/boya-{width}.png')
    go(page,b['x'],b['y']);page.wait_for_function("__r.recorrerState().tics===1",timeout=8000);s=st(page);assert s['book']['far']==3 and s['book']['buoys']==1,s['book']
    assert s['summary'].startswith('Boya · 3 km'),s['summary'];page.wait_for_timeout(400);assert st(page)['tics']==1,'once while you stay'
    go(page,b['x']*1.08,b['y']*1.08);page.wait_for_function("__r.recorrerState().drawn.edge?.buoy?.km===4",timeout=8000)
    e=st(page)['drawn']['edge']['buoy'];assert 0<=e['x']<=width and 90<=e['y']<=height-90,e
    # --- 2 · The first satellite: at the edge on the way, kept on entering, the music a little lower inside.
    page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.ac?.resume?.();}")
    page.wait_for_function("__r.ac?.state==='running'&&!!__r.bus",timeout=10000)
    go(page,s1['x']+3000,s1['y']);page.wait_for_function(f"__r.recorrerState().drawn.edge?.sat?.id==='{s1['id']}'",timeout=8000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/satelite-borde-{width}.png')
    go(page,s1['x'],s1['y']+40);page.wait_for_function(f"__r.recorrerState().inside?.id==='{s1['id']}'&&__r.recorrerState().book.sats.length===1",timeout=8000)
    page.wait_for_function("Math.abs(__r.bus.gain.value-.5)<.02",timeout=10000)
    page.wait_for_function("document.getElementById('toast').textContent.includes('Punto de retorno guardado')",timeout=25000)
    if SHOTS:page.screenshot(path=f'{SHOTS}/satelite-{width}.png')
    go(page,s1['x']+inside*4,s1['y']);page.wait_for_function("Math.abs(__r.bus.gain.value-1)<.02&&!__r.recorrerState().inside",timeout=10000)
    page.evaluate("()=>{__r.S.sound=false;}");go(page,s1['x']+6000,s1['y'])
    # Outside a satellite, its card only marks.
    page.evaluate(HIDE);assert page.evaluate("__r.openUniverseMap('region')")
    page.wait_for_function(f"__r.universeMapState().drawn.some(d=>d.kind==='satellite'&&d.id==='{s1['id']}')",timeout=6000)
    i=[d for d in page.evaluate("__r.universeMapState().drawn") if d['kind']=='satellite'][0];page.mouse.click(i['x'],i['y'])
    page.wait_for_function("!document.getElementById('umapCard').hidden",timeout=4000)
    assert page.inner_text('#umapCardName')=='Satélite · 10 km' and page.is_hidden('#umapGo') and page.inner_text('#umapMark')=='Marcar',page.inner_text('#umapCard')
    page.evaluate("__r.closeUniverseMap()")
   else:
    # English: the two satellites already walked to (the save of this world, as the game keeps them).
    for s in (s1,):go(page,s['x'],s['y']);page.wait_for_function(f"__r.recorrerState().book.sats.some(e=>e.id==='{s['id']}')",timeout=8000)
   # --- 3 · The second satellite; from inside it, the door on the map leads to the first.
   go(page,s2['x'],s2['y']);page.wait_for_function(f"__r.recorrerState().inside?.id==='{s2['id']}'&&__r.recorrerState().doors.includes('{s1['id']}')",timeout=8000)
   page.evaluate(HIDE);assert page.evaluate("__r.openUniverseMap('universo')")
   page.wait_for_function(f"__r.universeMapState().drawn.some(d=>d.kind==='satellite'&&d.id==='{s1['id']}')",timeout=6000)
   i=[d for d in page.evaluate("__r.universeMapState().drawn") if d['kind']=='satellite' and d['id']==s1['id']][0];page.mouse.click(i['x'],i['y'])
   page.wait_for_function("!document.getElementById('umapCard').hidden",timeout=4000)
   want=('Satellite · 10 km','Go through the door') if lang=='en' else ('Satélite · 10 km','Ir por la puerta')
   page.wait_for_function(f"document.getElementById('umapGo').textContent.trim()==={want[1]!r}",timeout=4000)
   assert page.inner_text('#umapCardName')==want[0] and page.is_visible('#umapGo'),page.inner_text('#umapCard')
   if SHOTS:page.screenshot(path=f'{SHOTS}/puerta-mapa-{lang}-{width}.png')
   page.locator('#umapGo').click();page.wait_for_function("document.getElementById('mUniverseMap').hidden",timeout=6000)
   page.wait_for_function(f"__r.recorrerState().inside?.id==='{s1['id']}'",timeout=8000)
   p=page.evaluate("({x:__r.S.wx,y:__r.S.wy})");assert math.hypot(p['x']-s1['x'],p['y']-s1['y'])<inside,('inside the first',p,s1)
   assert page.evaluate("__r.S.sparks")==sparks,'nothing paid, nothing charged'
   # --- 4 · The Bitácora lists both; from inside one, «Volver al anillo».
   page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_function("!!document.querySelector('#journalRecorrer [data-sat-ring]')",timeout=6000)
   summary=page.inner_text('#journalRecorrer summary');assert summary==('Travel far · 2 satellites' if lang=='en' else 'Recorrer lejos · 2 satélites'),summary
   assert page.locator(f'#journalRecorrer [data-sat-door="{s2["id"]}"]').count()==1
   if not page.evaluate("document.getElementById('journalRecorrer').open"):page.locator('#journalRecorrer summary').click()
   page.wait_for_function("document.getElementById('journalRecorrer').open",timeout=4000);page.locator('#journalRecorrer [data-sat-ring]').scroll_into_view_if_needed()
   if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-{lang}-{width}.png')
   page.locator('#journalRecorrer [data-sat-ring]').click();page.wait_for_function("document.getElementById('mJournal').hidden",timeout=6000)
   c=page.evaluate("__r.ringState().center");p=page.evaluate("({x:__r.S.wx,y:__r.S.wy})");assert math.hypot(p['x']-c['x'],p['y']-c['y'])<1500,('back at the ring',p,c)
   page.wait_for_timeout(300);assert page.evaluate("__r.recorrerState().doors")==[],'away from a satellite the door is closed'
   # --- 5 · Kept on reload.
   page.reload();page.wait_for_function("!!window.__r?.recorrerState",timeout=30000);page.evaluate(FREE)
   assert [e['id'] for e in page.evaluate("__r.recorrerState().book.sats")]==[s1['id'],s2['id']]
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS recorrer lejos on phone and desktop in {elapsed:.0f} s: a buoy with its number counts once and the next one outward is at the edge; a satellite at the edge, kept on entering with the music lower inside (bus at 0.5); from a second one the map\'s door leads to the first for no sparks; the Bitácora lists them and goes back to the ring; kept on reload; English',flush=True)
finally:server.shutdown()
