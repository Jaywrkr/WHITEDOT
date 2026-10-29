"""Ritmo · Eco (Jay, 29 Oct 2026, alpha.237), on a 390×844 phone and at 1280×800 (in English): a place already complete
can be played from memory. Lugares has «Eco» on each complete place (not the Cueva, not one never completed); the portal
sheet and the round's card offer it too. The place sings its phrase as always; then the Line and the ring on the cube
stop drawing its steps. «Dejar la ronda» leaves it losing nothing. Without sound the steps come back. Finishing it is an
ordinary round (★, the song) with no sparks; the card says «Eco» and «De memoria, sin señales.», and the save keeps it."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
# Ten places complete (the Cueva not yet): no finale, no duel.
TEN="()=>{const r=__r,d=r.placesData();for(const k of Object.keys(d.stars))d.stars[k]=[true,false,false];d.stars.cueva=[false,false,false];r.S.sound=true;r.save();}"
def open_page(b,size,lang='es'):
 ctx=b.new_context(viewport={'width':size[0],'height':size[1]},has_touch=size[0]<600);p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1'+('&lang=en' if lang=='en' else ''));p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&!!__r.ringState().active',timeout=20000)
 p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');document.body.classList.remove('dev');}");p.wait_for_timeout(300);p.evaluate(HIDE);p.evaluate(TEN);return ctx,p,errors
def lugares(p):
 p.evaluate(HIDE);p.locator('#bMenu').click();p.locator('#bLugares').click();p.wait_for_function("!document.getElementById('mLugares').hidden")
def finish(p,id,hits=80):
 p.wait_for_function("!__r.rhythmDemo()",timeout=20000)
 p.evaluate("([id,hits])=>{for(let i=0;i<100;i++)__r.placeHear(id,i<hits,{});if(!__r.placeFinish(id))throw Error('no finish');}",[id,hits])
 p.wait_for_function("!document.getElementById('mPlace').hidden",timeout=20000);p.wait_for_timeout(900)
t0=time.time()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  ctx,p,errors=open_page(b,(390,844))
  # Lugares: «Eco» on each complete place except the Cueva; none on the Cueva (not complete) either.
  lugares(p)
  rows=p.evaluate("()=>Object.fromEntries([...document.querySelectorAll('#lugaresList li')].map(li=>[li.dataset.placeId,[...li.querySelectorAll('.lugar-actions button')].map(b=>b.textContent)]))")
  for id,acts in rows.items():
   assert ('Eco' in acts)==(id!='cueva'),(id,acts)
  assert rows['lago'][0]=='Eco' and 'Ir' in rows['lago'],rows['lago']
  fit=p.evaluate("()=>{const l=document.getElementById('lugaresList');return [...l.querySelectorAll('li')].every(li=>li.scrollWidth<=li.clientWidth+1)&&document.querySelector('.lugares-sheet').scrollWidth<=document.querySelector('.lugares-sheet').clientWidth+1}")
  assert fit,'every row whole on a phone'
  p.locator('[data-place-id=lago] [data-echo=lago]').scroll_into_view_if_needed();p.screenshot(path=str(SHOTS/'ritmo-eco-lugares-390.png'))
  stars_before=p.evaluate("JSON.stringify(__r.placesData().stars)");sparks_before=p.evaluate("__r.S.sparks||0")
  p.locator('[data-place-id=lago] [data-echo=lago]').click()
  p.wait_for_function("__r.placeRun()?.id==='lago'",timeout=8000);assert p.locator('#mLugares').is_hidden()
  st=p.evaluate("__r.ritmoState()");assert st['round']['echo'] and st['round']['id']=='lago',st
  # It sings its phrase first (the steps shown), then hides them; the cube's ring goes too.
  p.wait_for_function("__r.rhythmDemo()",timeout=8000);assert not p.evaluate("__r.ritmoHideSignals()"),'the phrase is shown while it sings'
  p.wait_for_function("!__r.rhythmDemo()",timeout=20000);p.wait_for_timeout(200)
  assert p.evaluate("__r.ritmoHideSignals()") and p.evaluate("__r.journeyCubeRing(12)") is None
  p.wait_for_timeout(500);p.screenshot(path=str(SHOTS/'ritmo-eco-ronda-390.png'))
  # Without sound there is nothing to remember: the steps come back; with sound again, hidden again.
  p.evaluate("()=>{__r.S.sound=false;}");assert not p.evaluate("__r.ritmoHideSignals()");p.evaluate("()=>{__r.S.sound=true;}")
  # Leave it from the menu: back at the portal, nothing lost, nothing kept as Eco.
  p.locator('#bMenu').click();leave=p.locator('#bLeavePlace');assert leave.is_visible();leave.click()
  p.wait_for_function("!__r.placeRun()",timeout=5000)
  assert p.evaluate("JSON.stringify(__r.placesData().stars)")==stars_before and p.evaluate("JSON.stringify(__r.ritmoState().save.echo)")=='{}'
  assert not p.evaluate("__r.ritmoHideSignals()")
  # The portal sheet of a complete place offers it beside Jugar, Maestro and Libre.
  p.evaluate(HIDE);spot=p.evaluate("__r.ringState().spots.find(s=>s.id==='bosque')");p.evaluate("([x,y])=>{__r.S.wx=x;__r.S.wy=y+200;}",[spot['x'],spot['y']]);p.wait_for_timeout(300)
  p.evaluate("([x,y])=>{__r.S.wx=x;__r.S.wy=y;}",[spot['x'],spot['y']]);p.wait_for_function("!document.getElementById('mPortal').hidden",timeout=5000)
  assert p.locator('#portalEcho').is_visible() and p.locator('#portalEcho').inner_text()=='Eco'
  p.screenshot(path=str(SHOTS/'ritmo-eco-portal-390.png'))
  p.locator('#portalEcho').click();p.wait_for_function("__r.placeRun()?.id==='bosque'",timeout=5000);assert p.evaluate("__r.ritmoState().round.echo")
  finish(p,'bosque')
  assert p.inner_text('#placeTitle')=='Bosque · Eco',p.inner_text('#placeTitle')
  rows=p.inner_text('#placeRows');assert 'De memoria, sin señales.' in rows and 'Ritmo · 80 % / 75 % a tiempo' in rows,rows
  assert p.evaluate("__r.placesData().stars.bosque")==[True,True,False],'an Eco round earns its stars like any round'
  assert (p.evaluate("__r.S.sparks||0"))==sparks_before and '✦' not in p.inner_text('#mPlace'),'no sparks'
  assert p.evaluate("__r.ritmoState().save.echo.bosque")=={'best':.8,'rounds':1}
  assert p.locator('#placeEcho').is_visible()
  white=p.evaluate("()=>[...document.querySelectorAll('#mPlace button')].filter(b=>b.getClientRects().length&&getComputedStyle(b).backgroundColor==='rgb(255, 255, 255)').map(b=>b.id)")
  assert white==['placeNext'],white
  assert p.locator('#mPlace .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2')
  p.screenshot(path=str(SHOTS/'ritmo-eco-hoja-390.png'))
  # From the card, Eco again; then an ordinary round says «Completo».
  p.locator('#placeEcho').click();p.wait_for_function("__r.placeRun()?.id==='bosque'",timeout=5000);assert p.evaluate("__r.ritmoState().round.echo")
  finish(p,'bosque',60);assert p.inner_text('#placeTitle')=='Bosque · Eco'
  assert p.evaluate("__r.ritmoState().save.echo.bosque")=={'best':.8,'rounds':2},'the best share stays'
  p.locator('#placeAgain').click();p.wait_for_function("__r.placeRun()?.id==='bosque'",timeout=5000);assert not p.evaluate("__r.ritmoState().round.echo")
  finish(p,'bosque');assert p.inner_text('#placeTitle')=='Bosque · Completo' and 'De memoria' not in p.inner_text('#placeRows')
  # Kept after a reload; the Bitácora says which places were played from memory.
  p.evaluate(HIDE);p.reload();p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()',timeout=20000);p.evaluate(HIDE)
  assert p.evaluate("__r.ritmoState().save.echo.bosque.rounds")==2
  sec=p.evaluate("__r.ritmoSection()");assert 'Eco · Bosque' in sec,sec
  # The Cueva, once complete, still has no Eco: it already plays from memory.
  p.evaluate("()=>{__r.placesData().stars.cueva=[true,false,false];__r.placesData().won=true;__r.S.elevenNote={version:1,seen:true};__r.save();}");lugares(p)
  assert p.locator('[data-place-id=cueva] [data-echo]').count()==0 and p.locator('[data-place-id=lago] [data-echo=lago]').count()==1
  assert not errors,errors;ctx.close()
  # English, at 1280×800, from a fresh save.
  ctx,p,errors=open_page(b,(1280,800),'en')
  lugares(p);assert p.locator('[data-place-id=lago] [data-echo=lago]').inner_text()=='Echo'
  p.locator('[data-place-id=lago] [data-echo=lago]').click();p.wait_for_function("__r.placeRun()?.id==='lago'",timeout=8000)
  p.wait_for_function("!__r.rhythmDemo()",timeout=20000);p.wait_for_timeout(300);assert p.evaluate("__r.ritmoHideSignals()")
  p.screenshot(path=str(SHOTS/'ritmo-eco-ronda-1280.png'))
  finish(p,'lago');assert p.inner_text('#placeTitle')=='Lake · Echo',p.inner_text('#placeTitle')
  assert 'From memory, no signals.' in p.inner_text('#placeRows') and p.inner_text('#placeEcho')=='Echo'
  p.screenshot(path=str(SHOTS/'ritmo-eco-hoja-1280.png'))
  assert not errors,errors;ctx.close()
  b.close()
 print(f'PASS ritmo eco: Lugares, portal and card offer Eco on complete places (not the Cueva); the phrase is sung, then the Line and the ring hide its steps; without sound they return; leaving loses nothing; an ordinary round (★, no sparks) titled Eco and kept; 390×844 and 1280×800 in English ({time.time()-t0:.0f} s)',flush=True)
finally:server.shutdown();server.server_close()
