"""Ritmo · Fantasma y combo (Jay, 29 Oct 2026, alpha.237), on a 390×844 phone and at 1280×800.
The ghost: a round keeps its path in spaced samples; the next round of that place shows a faint outline of the cube
running it; a faster round replaces it («Le ganaste a tu fantasma»), a slower one does not («Tu fantasma · 0:02»); it
survives a reload. The combo: eight hits on time in a row and the cube leaves a trail that grows; a miss fades it, softly,
and nothing is taken away (stars, sparks). Only drawings: no sparks, no rule changed."""
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
TEN="()=>{const r=__r,d=r.placesData();for(const k of Object.keys(d.stars))d.stars[k]=[true,false,false];d.stars.cueva=[false,false,false];r.S.sound=true;r.save();}"
def open_page(b,size):
 ctx=b.new_context(viewport={'width':size[0],'height':size[1]},has_touch=size[0]<600);p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&!!__r.ringState().active',timeout=20000)
 p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');document.body.classList.remove('dev');}");p.wait_for_timeout(300);p.evaluate(HIDE);p.evaluate(TEN);return ctx,p,errors
def round_(p,id,seconds,walk=True):
 """A round of `seconds` (by the round's own clock), walking east then south; finished with 80 % on time."""
 p.evaluate(HIDE);assert p.evaluate("id=>__r.startPlace(id,{from:{x:__r.S.wx,y:__r.S.wy}})",id)
 p.wait_for_function("!__r.rhythmDemo()",timeout=20000)
 # Only the time the round itself counts matters: move its start so it lasts exactly `seconds` when it closes.
 p.evaluate("ms=>{__r.S.lugares.run.startedAt=Date.now()-ms;}",int(seconds*1000)-1200)
 o=p.evaluate("[__r.S.wx,__r.S.wy]")
 for k in range(6):
  if walk:p.evaluate("([x,y,k])=>{__r.S.wx=x+k*30;__r.S.wy=y+(k>2?(k-2)*30:0);}",[o[0],o[1],k])
  p.wait_for_timeout(200)
 p.evaluate("id=>{for(let i=0;i<100;i++)__r.placeHear(id,i<80,{});}",id)
 p.evaluate("([id,ms])=>{const r=__r.S.lugares.run;r.startedAt=Date.now()-ms;if(!__r.placeFinish(id))throw Error('no finish');}",[id,int(seconds*1000)])
 p.wait_for_function("!document.getElementById('mPlace').hidden",timeout=20000);p.wait_for_timeout(700)
 return p.inner_text('#placeRows')
t0=time.time()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  ctx,p,errors=open_page(b,(390,844))
  sparks=p.evaluate("__r.S.sparks||0")
  rows=round_(p,'llanura',4)
  assert 'Tu fantasma correrá contigo la próxima vez.' in rows,rows
  g=p.evaluate("__r.ritmoState().save.ghosts.llanura");assert abs(g['ms']-4000)<=60 and g['every']==600 and len(g['pts'])>=3,g
  assert max(x for x,y in g['pts'])>=60,'the path walked is in it'
  # The next round: the ghost runs; walking off its path shows the faint outline beside the cube.
  p.evaluate(HIDE);assert p.evaluate("__r.startPlace('llanura',{from:{x:__r.S.wx,y:__r.S.wy}})")
  p.wait_for_timeout(300);st=p.evaluate("__r.ritmoState().round");assert st['ghost'] and st['id']=='llanura',st
  o=p.evaluate("[__r.S.wx,__r.S.wy]");p.evaluate("ms=>{__r.S.lugares.run.startedAt=Date.now()-ms;}",2400);p.evaluate("([x,y])=>{__r.S.wx=x-60;__r.S.wy=y-40;}",o);p.wait_for_timeout(500)
  p.screenshot(path=str(SHOTS/'ritmo-fantasma-390.png'))
  # The outline is drawn where the ghost is, on its path from the round's start (60 right and 40 below the cube now).
  d=p.evaluate("__r.ritmoState().drawn.ghost");assert d and d['x']>=58 and d['y']>=38 and d['alpha']>.5,d
  p.evaluate("()=>{__r.abandonPlace();}");p.wait_for_function("!__r.placeRun()")
  assert abs(p.evaluate("__r.ritmoState().save.ghosts.llanura.ms")-4000)<=60,'leaving keeps the ghost as it was'
  # Faster: the ghost is beaten and replaced. Slower: it stays.
  rows=round_(p,'llanura',2);assert 'Le ganaste a tu fantasma · 0:04.' in rows,rows;assert abs(p.evaluate("__r.ritmoState().save.ghosts.llanura.ms")-2000)<=60
  p.screenshot(path=str(SHOTS/'ritmo-fantasma-hoja-390.png'))
  rows=round_(p,'llanura',3);assert 'Tu fantasma · 0:02.' in rows,rows;assert abs(p.evaluate("__r.ritmoState().save.ghosts.llanura.ms")-2000)<=60
  # Maestro and Libre neither show nor keep a ghost.
  p.evaluate(HIDE);p.evaluate("()=>{__r.placesData().stars.llanura=[true,true,false];}");assert p.evaluate("__r.startPlace('llanura',{maestro:true,from:{x:__r.S.wx,y:__r.S.wy}})");p.wait_for_timeout(300)
  assert not p.evaluate("__r.ritmoState().round.ghost");p.evaluate("__r.abandonPlace()")
  # A reload keeps it.
  p.evaluate(HIDE);p.reload();p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()',timeout=20000);p.evaluate(HIDE)
  assert abs(p.evaluate("__r.ritmoState().save.ghosts.llanura.ms")-2000)<=60
  assert 'Fantasmas · Llanura 0:02' in p.evaluate("__r.ritmoSection()")
  assert (p.evaluate("__r.S.sparks||0"))==sparks,'no sparks'
  assert not errors,errors;ctx.close()
  # The combo, at 1280×800: eight hits in a row light the trail; it grows while you walk; a miss fades it.
  ctx,p,errors=open_page(b,(1280,800))
  assert p.evaluate("__r.startPlace('lago',{from:{x:__r.S.wx,y:__r.S.wy}})");p.wait_for_function("!__r.rhythmDemo()",timeout=20000)
  stars=p.evaluate("JSON.stringify(__r.placesData().stars)")
  # Without sound every pulse is on time: a quick way to eight hits in a row.
  p.evaluate("()=>{__r.S.sound=false;}")
  for i in range(7):p.evaluate("__r.journeyPulse()");p.wait_for_timeout(140)
  p.wait_for_timeout(150);assert p.evaluate("__r.ritmoState().combo")==7 and p.evaluate("__r.ritmoState().trail")==0,'seven is not yet a combo'
  p.evaluate("__r.journeyPulse()");p.wait_for_timeout(150);assert p.evaluate("__r.ritmoState().combo")==8
  o=p.evaluate("[__r.S.wx,__r.S.wy]")
  for k in range(1,16):p.evaluate("([x,y,k])=>{__r.S.wx=x+k*9;__r.S.wy=y+Math.sin(k/3)*30;}",[o[0],o[1],k]);p.wait_for_timeout(40)
  short=p.evaluate("__r.ritmoState().trail");assert short>2,short
  for i in range(6):p.evaluate("__r.journeyPulse()");p.wait_for_timeout(140)
  for k in range(16,40):p.evaluate("([x,y,k])=>{__r.S.wx=x+k*9;__r.S.wy=y+Math.sin(k/3)*30;}",[o[0],o[1],k]);p.wait_for_timeout(40)
  long=p.evaluate("__r.ritmoState().trail");assert long>short,(short,long)
  p.screenshot(path=str(SHOTS/'ritmo-combo-1280.png'))
  # A miss (sound on, a touch off the beat): the streak ends and the trail fades out; nothing else changes.
  p.evaluate("()=>{__r.S.sound=true;}");p.wait_for_function("!__r.rhythmDemo()",timeout=20000)
  before=p.evaluate("__r.journeyPulseState().misses")
  for i in range(40):
   p.evaluate("__r.journeyPulse()");p.wait_for_timeout(97)
   if p.evaluate("__r.journeyPulseState().misses")>before:break
  p.wait_for_timeout(120);st=p.evaluate("__r.ritmoState()");assert st['combo']<8 and st['trail']==0 and st['fading'],st
  p.wait_for_timeout(1000);assert not p.evaluate("__r.ritmoState().fading"),'faded in under a second'
  assert p.evaluate("JSON.stringify(__r.placesData().stars)")==stars,'a miss takes nothing'
  # Leaving the round ends the combo too.
  p.evaluate("()=>{__r.S.sound=false;}")
  for i in range(9):p.evaluate("__r.journeyPulse()");p.wait_for_timeout(140)
  assert p.evaluate("__r.ritmoState().combo")>=8;p.evaluate("__r.abandonPlace()");p.wait_for_timeout(200);assert p.evaluate("__r.ritmoState().combo")==0
  assert not errors,errors;ctx.close()
  b.close()
 print(f'PASS ritmo fantasma y combo: the path kept in spaced samples, a faint outline running it next time, replaced only by a faster round, not in Maestro, kept after a reload, in the Bitácora; the trail from eight hits, growing, fading after a miss without taking anything; no sparks; 390×844 and 1280×800 ({time.time()-t0:.0f} s)',flush=True)
finally:server.shutdown();server.server_close()
