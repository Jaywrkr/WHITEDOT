"""Jay's fix G3 (28 Oct 2026, alpha.232), on a 390×844 phone, after the Journey with ten places complete: the Cueva round
completes the eleven and flows into their finale as before (no card in front); when the finale closes, one note on black
says the eleven are done, what stars are left, that the jump to another landscape is open (the first free) and that the
universe is endless. One white button, «Explorar»: it closes and leaves you in the World, with «Otro paisaje» in the dock.
Once per save (a reload does not bring it back); Lugares keeps it to read again. In English too."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
TEN="()=>{const r=__r,d=r.placesData();for(const k of Object.keys(d.stars))d.stars[k]=[true,false,false];d.stars.cueva=[false,false,false];r.S.sparks=0;r.save();}"
def open_page(b,lang='es'):
 p=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.add_init_script("Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1'+('&lang=en' if lang=='en' else ''));p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&!!__r.ringState().active',timeout=20000)
 p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');document.body.classList.remove('dev');}");p.wait_for_timeout(300);p.evaluate(HIDE);return p,errors
def play_eleventh(p):
 p.evaluate(TEN);assert not p.evaluate('__r.placesAllComplete()') and not p.evaluate('!!__r.placesData().won')
 assert p.evaluate("__r.startPlace('cueva',{from:{x:__r.S.wx,y:__r.S.wy}})");p.wait_for_function('!__r.rhythmDemo()',timeout=20000)
 p.evaluate("()=>{for(let i=0;i<100;i++)__r.placeHear('cueva',i<60,{});__r.placeFinish('cueva');}")
 p.wait_for_function('__r.songStageState().running&&__r.songStageState().final',timeout=20000)
 # Under the finale, nothing: the note waits for it to close.
 p.wait_for_timeout(1200);assert p.locator('#mEleven').is_hidden() and p.locator('#mPlace').is_hidden()
 p.evaluate('__r.closeSong()');p.wait_for_function("!document.getElementById('mEleven').hidden",timeout=5000)
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  p,errors=open_page(b)
  play_eleventh(p)
  text=p.inner_text('#mEleven')
  for line in ('Completaste los once lugares.','★★ a tiempo, ★★★ Maestro.','Ya puedes saltar a otro paisaje. El primer salto es gratis.','El universo es infinito. Explóralo: encontrarás maravillas.'):assert line in text,(line,text)
  st=p.evaluate("()=>{const m=document.getElementById('mEleven'),btns=[...m.querySelectorAll('button')].filter(b=>b.getClientRects().length);return {bg:getComputedStyle(m).backgroundColor,buttons:btns.map(b=>[b.id,b.textContent,getComputedStyle(b).backgroundColor]),gold:[...m.querySelectorAll('*')].filter(e=>getComputedStyle(e).color==='rgb(240, 210, 122)').length,focus:document.activeElement?.id}}")
  assert st['bg']=='rgb(0, 0, 0)' and st['buttons']==[['elevenExplore','Explorar','rgb(255, 255, 255)']] and st['gold']==0 and st['focus']=='elevenTitle',st
  assert p.evaluate('__r.S.elevenNote.seen') and p.evaluate("JSON.parse(localStorage.getItem('kubono:lugar')||'{}').elevenNote?.seen")==True,'kept in the save'
  p.screenshot(path=str(SHOTS/'kubono-g3-once-lugares-390.png'))
  # Touching the black does not close it; «Explorar» does, and you are in the World with «Otro paisaje» in the dock.
  p.mouse.click(20,20);p.wait_for_timeout(300);assert p.locator('#mEleven').is_visible()
  p.locator('#elevenExplore').click();p.wait_for_timeout(500)
  assert p.locator('#mEleven').is_hidden() and p.evaluate('__r.inWorld()') and p.evaluate('__r.placeRun()') is None
  assert p.locator('#bJump').is_visible(),'«Otro paisaje» after the eleven'
  p.wait_for_timeout(1000);assert p.locator('#mEleven').is_hidden(),'once'
  assert not errors,errors
  # A reload does not bring it back; Lugares has it to read again.
  p.reload();p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()',timeout=20000);p.evaluate(HIDE);p.wait_for_timeout(1500)
  assert p.locator('#mEleven').is_hidden() and p.evaluate('__r.elevenNoteState().seen')
  p.locator('#bMenu').click();p.locator('#bLugares').click();p.wait_for_function("!document.getElementById('mLugares').hidden")
  link=p.locator('#lugaresEleven');assert link.is_visible() and link.inner_text()=='Completaste los once lugares ›'
  link.click();p.wait_for_timeout(200);assert p.locator('#mEleven').is_visible() and p.locator('#mLugares').is_hidden()
  p.locator('#elevenExplore').click();assert p.locator('#mEleven').is_hidden()
  assert not errors,errors;p.close()
  # English, from a fresh save of its own.
  ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True);p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1&lang=en');p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&!!__r.ringState().active',timeout=20000)
  p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');}");p.wait_for_timeout(300);p.evaluate(HIDE)
  play_eleventh(p)
  text=p.inner_text('#mEleven')
  for line in ('The eleven places','You completed the eleven places.','★★ on time, ★★★ Master.','You can now jump to another landscape. The first jump is free.','The universe is endless. Explore it: you will find wonders.','Explore'):assert line in text,(line,text)
  assert 'Completaste' not in text,text
  p.locator('#elevenExplore').click();assert p.locator('#mEleven').is_hidden()
  assert not errors,errors;ctx.close()
  b.close()
 print('PASS eleven note (G3): after the finale of the eleven, once, on black with one white «Explorar»; stars left and the free jump said; «Otro paisaje» in the dock after; not again after a reload; Lugares reopens it; English',flush=True)
finally:server.shutdown();server.server_close()
