"""Con Luca · Modo tranquilo para niños (Jay, 29 Oct 2026, alpha.239), on a 390×844 phone and at 1280×800.
A switch in Ajustes. While it is on, in a round of the eleven places and in the Journey: the Tormenta's circle waits (no
clock), the window on time is wider (140 ms), the Line and the ring on the cube are drawn bigger and the next thing to
reach is marked in white; the cube keeps its size and the music does not change. A calm round gives ★ and not ★★ or
★★★, and its card says so without any word of failure; Maestro waits. Switched off at any moment: nothing is lost, the
window goes back and the next round gives ★★ as always. The setting survives a reload; the open World is untouched."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'));SHOTS.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
TEN="()=>{const r=__r,d=r.placesData();for(const k of Object.keys(d.stars))d.stars[k]=[true,false,false];d.stars.cueva=[false,false,false];r.S.sound=true;r.save();}"
def open_page(b,size,query='?anillo=1',ready='!!__r.ringState().active',libre=True):
 ctx=b.new_context(viewport={'width':size[0],'height':size[1]},has_touch=size[0]<600);p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{server.server_port}/{query}');p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&'+ready,timeout=20000)
 p.evaluate("()=>{"+HIDE+";"+("__r.setJourneyMode?.('libre');" if libre else "")+"document.body.classList.remove('dev');__r.S.sound=true;__r.audio?.();}");p.wait_for_timeout(300);p.evaluate(HIDE);return ctx,p,errors
def settings(p):
 p.evaluate(HIDE);p.locator('#bMenu').click();p.locator('#bSettings').click();p.wait_for_function("!document.getElementById('mSettings').hidden")
def finish(p,id,on_time):
 """The round closes with `on_time` of 100 pulses on time, after the place has sung its phrase."""
 p.wait_for_function("!__r.rhythmDemo()",timeout=20000);p.wait_for_timeout(200);p.wait_for_function("!__r.rhythmDemo()",timeout=20000)
 p.evaluate("([id,n])=>{for(let i=0;i<100;i++)__r.placeHear(id,i<n,{});if(!__r.placeFinish(id))throw Error('no finish');}",[id,on_time])
 p.wait_for_function("!document.getElementById('mPlace').hidden",timeout=20000);p.wait_for_timeout(500)
 return p.inner_text('#placeRows')
t0=time.time()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  ctx,p,errors=open_page(b,(390,844));p.evaluate(TEN)
  sparks=p.evaluate("__r.S.sparks||0");cube=p.evaluate("__r.S.size||null")
  # Ajustes: the switch, off; its line says what it does and what it gives.
  settings(p);box=p.locator('#calmKids');assert box.is_visible() and not box.is_checked()
  assert p.inner_text('#calmKidsHint')=='Sin prisa, con señales grandes. Da ★; ★★ y ★★★, en el modo normal.'
  box.check();assert p.evaluate("__r.tranquiloState().save")=={'version':1,'on':True}
  p.locator('#calmKids').scroll_into_view_if_needed();p.screenshot(path=str(SHOTS/'luca-tranquilo-ajustes-390.png'))
  # The open World is untouched: no wider window, no target.
  p.evaluate(HIDE);p.wait_for_timeout(200);st=p.evaluate("__r.tranquiloState()");assert st['on'] and not st['applies'] and st['window'] is None,st
  # The Tormenta: the circle waits; the window is wider; the signals are bigger; the next thing is marked.
  assert p.evaluate("__r.startPlace('tormenta',{from:{x:__r.S.wx,y:__r.S.wy}})");p.wait_for_timeout(300)
  st=p.evaluate("__r.tranquiloState()");assert st['applies'] and abs(st['window']-.14)<1e-9,st;assert p.evaluate("__r.tranquiloSignals()")
  p.wait_for_function("!!__r.journeyDance().target",timeout=15000);first=p.evaluate("__r.journeyDance().target")
  bar=p.evaluate("(__r.SIX||.15)*16*1000");p.wait_for_timeout(int(bar*2.2))
  d=p.evaluate("__r.journeyDance()");assert d['target']==first and d['fallen']==0,('the circle waits',first,d)
  p.evaluate("()=>{const t=__r.journeyDance().target;__r.S.wx=t.x-160;__r.S.wy=t.y-60;}");p.wait_for_timeout(400)
  st=p.evaluate("__r.tranquiloState()");assert st['target'] and st['drawn'] and not st['drawn']['edge'],('the circle is marked',st)
  assert p.evaluate("__r.placeRun().silent"),'a calm round counts without sound: ★ only'
  p.screenshot(path=str(SHOTS/'luca-tranquilo-tormenta-390.png'))
  ring=p.evaluate("__r.journeyCubeRing(12)")
  # Its card: ★, no ★★ even at 100 %, a line that says why; no word of failure; Maestro waits.
  rows=finish(p,'tormenta',100)
  assert 'Modo tranquilo: ★ ganada.' in rows and '★★ y ★★★, en el modo normal.' in rows and 'Con sonido' not in rows,rows
  assert '· Ritmo · en el modo normal' in rows and '100 %' not in rows,rows
  for w in ('Fallaste','fallo','perdiste'):assert w not in rows
  assert p.evaluate("__r.placesData().stars.tormenta")==[True,False,False];assert p.locator('#placeMaestro').is_hidden()
  assert (p.evaluate("__r.placesData().best.tormenta.onTime") or 0)==0,'the wider window does not raise the share of the song'
  p.screenshot(path=str(SHOTS/'luca-tranquilo-hoja-390.png'))
  # The portal sheet: Maestro waits while it is on.
  p.evaluate(HIDE);p.evaluate("()=>{__r.placesData().stars.lago=[true,true,false];const s=__r.ringState().spots.find(q=>q.id==='lago');__r.S.wx=s.x;__r.S.wy=s.y;}")
  p.wait_for_function("!document.getElementById('mPortal').hidden",timeout=8000);assert p.locator('#portalMaestro').is_hidden()
  # A reload keeps it (away from the portal, so its sheet does not open again).
  p.evaluate(HIDE);p.evaluate("()=>{__r.S.wx+=400;__r.save();}");p.wait_for_timeout(200);p.evaluate(HIDE);p.reload();p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&!!__r.ringState().active',timeout=20000)
  p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');document.body.classList.remove('dev');}");p.wait_for_timeout(300);p.evaluate(HIDE);assert p.evaluate("__r.tranquilo()")
  # Off at any moment: nothing lost, the window back, ★★ as always.
  settings(p);assert p.locator('#calmKids').is_checked();p.locator('#calmKids').uncheck();p.evaluate(HIDE);p.wait_for_timeout(200)
  assert p.evaluate("__r.placesData().stars.tormenta")==[True,False,False] and p.evaluate("__r.tranquiloState().window") is None
  p.evaluate("()=>{__r.S.sound=true;__r.audio?.();}");assert p.evaluate("__r.startPlace('tormenta',{from:{x:__r.S.wx,y:__r.S.wy}})");p.wait_for_timeout(300)
  assert not p.evaluate("__r.tranquiloState().applies") and not p.evaluate("__r.placeRun().silent")
  rows=finish(p,'tormenta',80);assert p.evaluate("__r.placesData().stars.tormenta")==[True,True,False],rows;assert 'Modo tranquilo' not in rows
  assert p.evaluate("__r.S.sparks||0")==sparks,'no sparks';assert p.evaluate("__r.S.size||null")==cube,'the cube keeps its size'
  assert not errors,errors;ctx.close()
  # The Journey at 1280×800: the Tormenta chapter, calm. The circle waits; the chapter's ★★ waits for the normal mode.
  ctx,p,errors=open_page(b,(1280,800),'?capitulo=tormenta','true',libre=False)
  p.evaluate("()=>{__r.tranquiloSet(true);}");p.wait_for_timeout(300);st=p.evaluate("__r.tranquiloState()");assert st['applies'] and abs(st['window']-.14)<1e-9,st
  p.wait_for_function("!!__r.journeyDance().target",timeout=20000);first=p.evaluate("__r.journeyDance().target");bar=p.evaluate("(__r.SIX||.15)*16*1000");p.wait_for_timeout(int(bar*2.2))
  d=p.evaluate("__r.journeyDance()");assert d['target']==first and d['fallen']==0,(first,d)
  assert p.evaluate("__r.placesData().journeyShare.tormenta?.silent")==True,'a calm chapter gives its ★, its ★★ later in its place'
  p.evaluate("()=>{const t=__r.journeyDance().target;__r.S.wx=t.x+2000;__r.S.wy=t.y;}");p.wait_for_timeout(400)
  st=p.evaluate("__r.tranquiloState()");assert st['drawn'] and st['drawn']['edge'],('off screen, an arrow at the edge',st)
  p.screenshot(path=str(SHOTS/'luca-tranquilo-viaje-1280.png'))
  # Without it, the circle runs out as before.
  p.evaluate("()=>{__r.tranquiloSet(false);const t=__r.journeyDance().target;if(t){__r.S.wx=t.x+300;__r.S.wy=t.y;}}");p.wait_for_timeout(int(bar*2.2))
  assert p.evaluate("__r.journeyDance().fallen")>0,'the normal mode keeps its clock'
  assert not errors,errors;ctx.close()
  # In English, the switch and its line.
  ctx,p,errors=open_page(b,(1280,800),'?anillo=1&lang=en');settings(p);p.wait_for_timeout(300)
  assert 'Calm mode for kids' in p.inner_text('#mSettings') and p.inner_text('#calmKidsHint')=='No hurry, big signals. It gives ★; ★★ and ★★★ come in the normal mode.'
  p.locator('#calmKids').scroll_into_view_if_needed();p.screenshot(path=str(SHOTS/'luca-tranquilo-ajustes-1280-en.png'))
  assert not errors,errors;ctx.close()
  b.close()
 print(f'PASS luca tranquilo: the switch in Ajustes, kept after a reload; in a round and in the Journey the storm circle waits, the window is 140 ms, the signals are bigger and the next thing is marked (on screen and at the edge); ★ without ★★ and a card that says why, Maestro waits; off at any moment with nothing lost and ★★ as always; the open World untouched; no sparks, the cube its size; English ({time.time()-t0:.0f} s)',flush=True)
finally:server.shutdown();server.server_close()
