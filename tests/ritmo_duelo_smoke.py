"""Ritmo · Duelo final (Jay, 29 Oct 2026, alpha.237), on a 390×844 phone (the eleven rhythms) and at 1280×800 with
?rapido=2 in English (four of them). It is secret until the eleven places are complete, their finale played and their
note seen (eleven-note.js); then it is announced once, drawn white in the centre of the ring with a column of light, and
Lugares takes you there. Walking into it asks; «Ahora no» closes. The duel sings each place's rhythm for a bar and you
answer it in the next; a real touch counts; «Dejar la ronda» or walking away ends it, losing nothing. Completing it gives
its own ★ (outside the 33), the Corona de los once (worn, in Tu cubo, can be taken off) and its entry in the Bitácora,
never sparks; it is kept after a reload."""
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
ELEVEN="()=>{const r=__r,d=r.placesData();for(const k of Object.keys(d.stars))d.stars[k]=[true,false,false];d.won=true;r.S.sound=true;r.save();}"
def open_page(b,size,query=''):
 ctx=b.new_context(viewport={'width':size[0],'height':size[1]},has_touch=size[0]<600);p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1'+query);p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&!!__r.ringState().active',timeout=20000)
 p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');document.body.classList.remove('dev');}");p.wait_for_timeout(300);p.evaluate(HIDE);return ctx,p,errors
def at(p,dx,dy):
 c=p.evaluate("__r.ringState().center");p.evaluate("([x,y])=>{__r.S.wx=x;__r.S.wy=y;}",[c['x']+dx,c['y']+dy]);p.wait_for_timeout(250)
def walk_in(p):
 p.evaluate(HIDE);at(p,0,200);at(p,0,0);p.wait_for_function("!document.getElementById('mDuel').hidden",timeout=5000);p.wait_for_timeout(500)
def answer_all(p,real=False,limit=90):
 """Answer every answer bar on its steps (on the audio clock); with `real`, one answer is a real touch on the screen."""
 t0=time.time();touched=None
 while time.time()-t0<limit:
  st=p.evaluate("__r.ritmoState().duel")
  if not st:return touched
  ph=st['phase']
  if ph and ph['kind']=='answer' and not ph['steps'] and not ph['wrong']:
   if real and touched is None:
    # A real touch, anywhere on the canvas, at the right moment by the audio clock: it is heard and counted.
    p.wait_for_function("()=>{const p=__r.ritmoState().duel?.phase;return !p||p.kind!=='answer'||__r.ac.currentTime>=p.start+.2;}",timeout=8000)
    vw=p.viewport_size;p.mouse.click(vw['width']*.3,vw['height']*.35);p.wait_for_timeout(300)
    after=p.evaluate("__r.ritmoState().duel?.phase");touched=bool(after and (after['steps'] or after['wrong']))
   else:p.evaluate("()=>{const p=__r.ritmoState().duel.phase,six=__r.SIX;for(const s of p.pattern)__r.ritmoDuelPulse(p.start+s*six+.01);}")
  p.wait_for_timeout(120)
 raise AssertionError('the duel did not end')
t0=time.time()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  ctx,p,errors=open_page(b,(390,844))
  # Secret before the eleven, their finale and their note.
  p.evaluate("()=>{const d=__r.placesData();for(const k of Object.keys(d.stars))d.stars[k]=[true,false,false];d.stars.cueva=[false,false,false];__r.save();}")
  assert not p.evaluate("__r.ritmoDuelOpen()")
  assert not p.evaluate("()=>{("+ELEVEN+")();__r.S.elevenNote={version:1,seen:false};return __r.ritmoDuelOpen();}"),'the note of the eleven first'
  at(p,0,0);assert p.locator('#mDuel').is_hidden()
  # The note of the eleven comes first, as always; «Explorar» closes it and then the duel is announced.
  p.wait_for_function("!document.getElementById('mEleven').hidden",timeout=5000);assert not p.evaluate("__r.ritmoState().save.said.duel")
  p.locator('#elevenExplore').click();p.wait_for_function("__r.ritmoState().save.said.duel",timeout=3000)
  assert p.evaluate("__r.ritmoDuelOpen()") and p.evaluate("__r.ritmoState().save.said.duel"),'announced once'
  assert p.locator('#mDuel').is_hidden(),'standing on it already does not ask'
  # Lugares has its line; it takes you to the centre of the ring.
  at(p,3000,0);p.locator('#bMenu').click();p.locator('#bLugares').click();p.wait_for_function("!document.getElementById('lugaresDuel').hidden")
  assert p.inner_text('#lugaresDuel')=='Duelo final · en el centro del anillo ›' and p.locator('#lugaresList li').count()==11
  p.locator('#lugaresDuel').click();p.wait_for_timeout(400);assert p.locator('#mLugares').is_hidden()
  c=p.evaluate("__r.ringState().center");assert p.evaluate("([x,y])=>Math.hypot(__r.S.wx-x,__r.S.wy-y)",[c['x'],c['y']])<400,'back at the centre'
  at(p,0,170);p.screenshot(path=str(SHOTS/'ritmo-duelo-anillo-390.png'))
  # Walking in asks; «Ahora no» closes it.
  walk_in(p);text=p.inner_text('#mDuel')
  for line in ('Duelo final','Los once ritmos, uno tras otro.','Escucha un compás. Repítelo en el siguiente.','Jugar','Ahora no'):assert line in text,(line,text)
  st=p.evaluate("()=>{const m=document.getElementById('mDuel');return {bg:getComputedStyle(m).backgroundColor,white:[...m.querySelectorAll('button')].filter(b=>getComputedStyle(b).backgroundColor==='rgb(255, 255, 255)').map(b=>b.id),star:getComputedStyle(m.querySelector('#duelStars span')).color}}")
  assert st['bg']=='rgb(0, 0, 0)' and st['white']==['duelPlay'] and st['star']!='rgb(240, 210, 122)',st
  p.screenshot(path=str(SHOTS/'ritmo-duelo-hoja-390.png'))
  p.locator('#duelClose').click();assert p.locator('#mDuel').is_hidden() and not p.evaluate("__r.ritmoDuelActive()")
  # Play; leave from the menu: nothing kept, nothing lost.
  walk_in(p);p.locator('#duelPlay').click();p.wait_for_function("__r.ritmoState().duel?.phase?.kind==='call'",timeout=8000)
  assert p.evaluate("__r.ritmoState().duel.n")==11
  p.locator('#bMenu').click();assert p.locator('#bLeavePlace').is_visible();p.locator('#bLeavePlace').click()
  assert not p.evaluate("__r.ritmoDuelActive()") and not p.evaluate("__r.ritmoState().save.duel.won")
  # Walking away ends it too.
  walk_in(p);p.locator('#duelPlay').click();p.wait_for_function("__r.ritmoDuelActive()",timeout=5000);at(p,1500,0)
  p.wait_for_function("!__r.ritmoDuelActive()",timeout=3000);assert not p.evaluate("__r.ritmoState().save.duel.won")
  # The whole duel: eleven rhythms, a call and an answer each; one answer is a real touch.
  sparks=p.evaluate("__r.S.sparks||0");stars=p.evaluate("JSON.stringify(__r.placesData().stars)")
  walk_in(p);p.locator('#duelPlay').click();p.wait_for_function("__r.ritmoState().duel?.phase?.kind==='call'",timeout=8000)
  seen=[];shot=False;t1=time.time()
  while time.time()-t1<10:
   ph=p.evaluate("__r.ritmoState().duel?.phase")
   if ph and ph['kind']=='call' and ph['id'] not in seen:seen.append(ph['id'])
   if ph and ph['kind']=='answer':break
   p.wait_for_timeout(100)
  assert seen==['llanura'],seen
  assert p.evaluate("__r.ritmoLineSteps()")==[0,4,8,12],'the Line shows the rhythm in play'
  touched=answer_all(p,real=True);assert touched,'a real touch is heard and counted'
  p.wait_for_function("!document.getElementById('mDuel').hidden",timeout=10000);p.wait_for_timeout(800)
  text=p.inner_text('#mDuel')
  for line in ('Duelo final · Completo','Ecos · ','de 11','% a tiempo','Nuevo adorno: Corona de los once. Está en Tu cubo.','Queda en la Bitácora.','Explorar','Otra vez'):assert line in text,(line,text)
  st=p.evaluate("()=>{const m=document.getElementById('mDuel');return {white:[...m.querySelectorAll('button')].filter(b=>getComputedStyle(b).backgroundColor==='rgb(255, 255, 255)').map(b=>b.id),star:getComputedStyle(m.querySelector('#duelStars span')).color,fit:m.querySelector('.sheet').scrollWidth<=m.querySelector('.sheet').clientWidth+2}}")
  assert st['white']==['duelPlay'] and st['star']=='rgb(240, 210, 122)' and st['fit'],st
  p.screenshot(path=str(SHOTS/'ritmo-duelo-final-390.png'))
  d=p.evaluate("__r.ritmoState().save.duel");assert d['won'] and d['wear'] and d['rounds']==1 and d['echoes']>=10,d
  assert p.evaluate("__r.S.sparks||0")==sparks and '✦' not in text,'no sparks'
  assert p.evaluate("JSON.stringify(__r.placesData().stars)")==stars and p.evaluate("__r.places().count")==11,'its ★ is its own, outside the 33'
  p.locator('#duelPlay').click();assert p.locator('#mDuel').is_hidden()
  # Tu cubo: the ornament, worn; taking it off is kept.
  p.evaluate("()=>{document.getElementById('mCube').hidden=false;}");p.wait_for_timeout(200)
  assert p.locator('#cubeRitmoSection').is_visible() and p.locator('#cubeRitmoCrown').get_attribute('aria-pressed')=='true'
  p.locator('#cubeRitmoCrown').click();assert p.locator('#cubeRitmoCrown').get_attribute('aria-pressed')=='false' and not p.evaluate("__r.ritmoState().save.duel.wear")
  p.locator('#cubeRitmoCrown').click();assert p.evaluate("__r.ritmoState().save.duel.wear");p.evaluate(HIDE)
  at(p,0,260);p.wait_for_timeout(400);p.screenshot(path=str(SHOTS/'ritmo-duelo-corona-390.png'))
  # Kept after a reload; in the Bitácora; Lugares says it is won.
  p.reload();p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()',timeout=20000);p.evaluate(HIDE)
  assert p.evaluate("__r.ritmoState().save.duel.won");sec=p.evaluate("__r.ritmoSection()");assert 'Duelo final' in sec and 'Corona de los once' in sec,sec
  p.locator('#bMenu').click();p.locator('#bLugares').click();p.wait_for_function("!document.getElementById('lugaresDuel').hidden")
  assert p.inner_text('#lugaresDuel')=='Duelo final ★ · en el centro del anillo ›';p.evaluate(HIDE)
  assert not errors,errors;ctx.close()
  # At 1280×800, ?rapido=2 and in English: four rhythms, the same sheets.
  ctx,p,errors=open_page(b,(1280,800),'&rapido=2&lang=en');p.evaluate(ELEVEN);p.evaluate("()=>{__r.S.elevenNote={version:1,seen:true};__r.save();}")
  p.wait_for_timeout(300);walk_in(p);text=p.inner_text('#mDuel')
  for line in ('Final duel','The eleven rhythms, one after another.','Listen to a bar. Repeat it in the next one.','Play','Not now'):assert line in text,(line,text)
  p.screenshot(path=str(SHOTS/'ritmo-duelo-hoja-1280.png'))
  p.locator('#duelPlay').click();p.wait_for_function("__r.ritmoState().duel?.phase",timeout=8000);assert p.evaluate("__r.ritmoState().duel.n")==4
  p.wait_for_function("__r.ritmoState().duel?.phase?.kind==='answer'",timeout=8000);p.wait_for_timeout(300);p.screenshot(path=str(SHOTS/'ritmo-duelo-ronda-1280.png'))
  answer_all(p);p.wait_for_function("!document.getElementById('mDuel').hidden",timeout=10000);p.wait_for_timeout(800);text=p.inner_text('#mDuel')
  for line in ('Final duel · Complete','Echoes · 4 of 4','100 % on time','New ornament: Crown of the eleven. It is in Your Cube.','It stays in the Logbook.','Explore','Again'):assert line in text,(line,text)
  p.screenshot(path=str(SHOTS/'ritmo-duelo-final-1280.png'))
  assert not errors,errors;ctx.close()
  b.close()
 print(f'PASS ritmo duelo: secret until the eleven, their finale and note; announced once, white in the centre, Lugares takes you; asks when you walk in; the eleven rhythms called and answered, a real touch counted; leaving from the menu or walking away loses nothing; its own ★, the Corona de los once (worn, can be taken off), the Bitácora, no sparks, kept after a reload; ?rapido=2 four rhythms in English at 1280×800 ({time.time()-t0:.0f} s)',flush=True)
finally:server.shutdown();server.server_close()
