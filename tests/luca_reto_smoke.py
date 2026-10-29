"""Con Luca · Reto entre dos (Jay, 29 Oct 2026, alpha.239), on a 390×844 phone and at 1280×800 in English.
Two people on the same phone: Lugares opens the challenge sheet; the players get a short name and a symbol; the first
round leaves the mark («Primera marca.»); the card hands the turn to the other player («Le toca a …», the white button);
the rival's mark runs as the ghost; a slower round says «Casi: a 1,2 s.» and keeps the mark; a faster one makes a new
mark («¡Nueva marca!»). Leaving a challenge round loses nothing; a mark can be erased (two taps); names and marks survive
a reload. The ★ are those of an ordinary round and there are no sparks. From the portal sheet: «Reto», place fixed."""
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
def open_page(b,size,query=''):
 ctx=b.new_context(viewport={'width':size[0],'height':size[1]},has_touch=size[0]<600);p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1{query}');p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()&&!!__r.ringState().active',timeout=20000)
 p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');document.body.classList.remove('dev');}");p.wait_for_timeout(300);p.evaluate(HIDE);p.evaluate(TEN);return ctx,p,errors
def finish(p,id,seconds):
 """The round being played closes after `seconds` by its own clock, walking a little, with 80 % on time."""
 p.wait_for_function("!__r.rhythmDemo()",timeout=20000);o=p.evaluate("[__r.S.wx,__r.S.wy]")
 for k in range(4):p.evaluate("([x,y,k])=>{__r.S.wx=x+k*30;__r.S.wy=y;__r.S.lugares.run.startedAt=Date.now()-k*700;}",[o[0],o[1],k]);p.wait_for_timeout(150)
 p.evaluate("id=>{for(let i=0;i<100;i++)__r.placeHear(id,i<80,{});}",id)
 p.evaluate("([id,ms])=>{const r=__r.S.lugares.run;r.startedAt=Date.now()-ms;if(!__r.placeFinish(id))throw Error('no finish');}",[id,int(seconds*1000)])
 p.wait_for_function("!document.getElementById('mPlace').hidden",timeout=20000);p.wait_for_timeout(500)
 return p.inner_text('#placeTitle'),p.inner_text('#placeRows')
def lugares(p):
 p.evaluate(HIDE);p.locator('#bMenu').click();p.locator('#bLugares').click();p.wait_for_function("!document.getElementById('mLugares').hidden")
t0=time.time()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  ctx,p,errors=open_page(b,(390,844))
  sparks=p.evaluate("__r.S.sparks||0")
  # Lugares: one line opens the sheet; nothing is marked yet.
  lugares(p);p.wait_for_function("!document.getElementById('lugaresDuo').hidden");assert p.inner_text('#lugaresDuo')=='Reto entre dos ›'
  p.locator('#lugaresDuo').click();p.wait_for_function("!document.getElementById('mDuo').hidden");assert p.locator('#mLugares').is_hidden()
  assert p.inner_text('#duoTitle')=='Reto · Llanura';assert p.locator('#duoPlace').is_visible();assert p.evaluate("document.getElementById('duoPlace').options.length")==10,'the ten places complete'
  assert p.inner_text('#duoMark')=='Sin marca todavía. La primera ronda la deja.';assert p.locator('#duoClear').is_hidden()
  assert p.inner_text('#duoP0')=='● Uno' and p.get_attribute('#duoP0','aria-pressed')=='true'
  # Names: short and the players' own; a symbol is picked by tapping it.
  p.locator('#duoNames').click();assert p.locator('#duoEdit').is_visible() and p.inner_text('#duoNames')=='Listo'
  p.fill('#duoName0','Luca');p.locator('#duoName0').dispatch_event('change');p.locator('#duoSym1').click()
  assert p.evaluate("__r.duoState().save.players[0].name")=='Luca' and p.evaluate("__r.duoState().save.players[1].sym")=='■'
  assert p.get_attribute('#duoName0','maxlength')=='8';p.screenshot(path=str(SHOTS/'luca-reto-nombres-390.png'))
  p.locator('#duoNames').click();assert p.locator('#duoEdit').is_hidden();assert p.inner_text('#duoP0')=='● Luca' and p.inner_text('#duoP1')=='■ Dos'
  assert p.get_attribute('#duoP0 .duo-who','translate')=='no','a name the players wrote is never translated'
  p.screenshot(path=str(SHOTS/'luca-reto-hoja-390.png'))
  # Luca plays first: the round goes to the place's portal; the line on screen says who plays and the time.
  p.locator('#duoPlay').click();p.wait_for_function("!!__r.placeRun()&&!!__r.duoState().active",timeout=10000)
  assert p.evaluate("__r.placeRun().id")=='llanura' and p.evaluate("__r.duoState().active.by")==0
  p.wait_for_function("!document.getElementById('duoLive').hidden");assert p.inner_text('#duoLive').startswith('● Luca · 0:0'),p.inner_text('#duoLive')
  p.screenshot(path=str(SHOTS/'luca-reto-ronda-390.png'))
  title,rows=finish(p,'llanura',4)
  assert title=='Llanura · Reto',title;assert 'Reto · ● Luca · 0:04' in rows and 'Primera marca.' in rows,rows
  assert p.locator('#duoLive').is_hidden(),'the line goes with the round'
  m=p.evaluate("__r.duoState().save.marks.llanura");assert m['by']==0 and abs(m['ms']-4000)<=60 and len(m['ghost']['pts'])>=2,m
  turn=p.locator('#placeDuo');assert turn.is_visible() and turn.inner_text()=='Le toca a ■ Dos' and 'gold' in (turn.get_attribute('class') or '')
  assert 'gold' not in (p.get_attribute('#placeNext','class') or '') and 'gold' not in (p.get_attribute('#placeAgain','class') or ''),'one white button: the turn'
  assert p.evaluate("__r.placesData().stars.llanura")==[True,False,False],'the ★ of an ordinary round'
  p.screenshot(path=str(SHOTS/'luca-reto-primera-390.png'))
  # Dos plays: the mark's path runs as the ghost; slower by 1,2 s, the mark stays.
  turn.click();p.wait_for_function("!!__r.placeRun()&&__r.duoState().active?.by===1",timeout=10000);p.wait_for_timeout(300)
  st=p.evaluate("__r.ritmoState().round");assert st['duo'] and st['ghost'],('the rival runs as the ghost',st)
  assert p.inner_text('#duoLive').startswith('■ Dos · 0:0') and p.inner_text('#duoLive').endswith(' / 0:04')
  title,rows=finish(p,'llanura',5.2);assert 'Casi: a 1,2 s.' in rows and 'La marca es de ● Luca.' in rows,rows
  assert 'fantasma' not in rows,'a challenge speaks of the mark, not of your own ghost'
  assert abs(p.evaluate("__r.duoState().save.marks.llanura.ms")-4000)<=60 and p.evaluate("__r.duoState().save.marks.llanura.by")==0
  p.screenshot(path=str(SHOTS/'luca-reto-casi-390.png'))
  # Luca again, faster: a new mark.
  assert p.inner_text('#placeDuo')=='Le toca a ● Luca';p.locator('#placeDuo').click();p.wait_for_function("!!__r.placeRun()&&__r.duoState().active?.by===0",timeout=10000)
  title,rows=finish(p,'llanura',3);assert '¡Nueva marca!' in rows,rows;assert abs(p.evaluate("__r.duoState().save.marks.llanura.ms")-3000)<=60
  p.screenshot(path=str(SHOTS/'luca-reto-nueva-390.png'));p.evaluate(HIDE)
  # From the portal sheet: «Reto» with the place fixed; leaving the round loses nothing and leaves no card.
  p.evaluate("()=>{__r.ringGo('lago');}");p.wait_for_function("!!__r.placeRun()");p.evaluate("__r.abandonPlace()");p.wait_for_function("!__r.placeRun()");p.evaluate(HIDE)
  p.evaluate("()=>{const s=__r.ringState().spots.find(q=>q.id==='lago');__r.S.wx=s.x;__r.S.wy=s.y;}");p.wait_for_function("!document.getElementById('mPortal').hidden",timeout=8000)
  assert p.locator('#portalDuo').is_visible() and p.inner_text('#portalDuo')=='Reto';p.screenshot(path=str(SHOTS/'luca-reto-portal-390.png'))
  p.locator('#portalDuo').click();p.wait_for_function("!document.getElementById('mDuo').hidden");assert p.locator('#duoPlace').is_hidden() and p.inner_text('#duoTitle')=='Reto · Lago'
  p.locator('#duoPlay').click();p.wait_for_function("!!__r.duoState().active",timeout=10000)
  p.locator('#bMenu').click();p.locator('#bLeavePlace').click();p.wait_for_function("!__r.placeRun()");p.wait_for_timeout(300)
  assert 'lago' not in p.evaluate("__r.duoState().save.marks") and p.locator('#mPlace').is_hidden() and p.locator('#duoLive').is_hidden()
  # Erasing a mark takes two taps.
  p.evaluate(HIDE);p.evaluate("__r.duoOpen({id:'llanura'})");p.wait_for_function("!document.getElementById('mDuo').hidden")
  assert p.inner_text('#duoMark')=='Marca de ● Luca: 0:03 · ¿la superas?',p.inner_text('#duoMark');assert 'Llanura · ● Luca · 0:03' in p.inner_text('#duoMarks')
  p.locator('#duoClear').click();assert p.inner_text('#duoClear')=='¿Borrar? Toca otra vez' and 'llanura' in p.evaluate("__r.duoState().save.marks")
  # A reload keeps the names and the mark.
  p.evaluate(HIDE);p.reload();p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()',timeout=20000);p.evaluate(HIDE)
  sv=p.evaluate("__r.duoState().save");assert sv['players'][0]['name']=='Luca' and abs(sv['marks']['llanura']['ms']-3000)<=60,sv
  p.evaluate("__r.duoOpen({id:'llanura'})");p.wait_for_function("!document.getElementById('mDuo').hidden");p.locator('#duoClear').click();p.locator('#duoClear').click()
  assert 'llanura' not in p.evaluate("__r.duoState().save.marks") and p.inner_text('#duoMark')=='Sin marca todavía. La primera ronda la deja.'
  assert p.evaluate("__r.S.sparks||0")==sparks,'no sparks'
  assert not errors,errors;ctx.close()
  # At 1280×800 in English: the same sheet and card read in English; a written name stays as written.
  ctx,p,errors=open_page(b,(1280,800),'&lang=en')
  lugares(p);p.wait_for_function("!document.getElementById('lugaresDuo').hidden");assert p.inner_text('#lugaresDuo')=='Challenge for two ›'
  p.locator('#lugaresDuo').click();p.wait_for_function("!document.getElementById('mDuo').hidden");p.wait_for_timeout(300);text=p.inner_text('#mDuo')
  for line in ('Challenge · Plain','Who plays?','● One','▲ Two','No record yet. The first round sets it.','Play','Names','Not now'):assert line in text,(line,text)
  p.locator('#duoNames').click();p.fill('#duoName1','Sol');p.locator('#duoName1').dispatch_event('change');p.locator('#duoNames').click();assert p.inner_text('#duoP1')=='▲ Sol','a name is not a note'
  p.locator('#duoP1').click();p.screenshot(path=str(SHOTS/'luca-reto-hoja-1280-en.png'));p.locator('#duoPlay').click();p.wait_for_function("__r.duoState().active?.by===1",timeout=10000)
  title,rows=finish(p,'llanura',4);assert title=='Plain · Challenge',title;assert 'Challenge · ▲ Sol · 0:04' in rows and 'First record.' in rows,rows
  assert p.inner_text('#placeDuo')=='Next up: ● One';p.locator('#placeDuo').click();p.wait_for_function("__r.duoState().active?.by===0",timeout=10000)
  title,rows=finish(p,'llanura',5.2);assert 'So close: 1.2 s away.' in rows and 'The record belongs to ▲ Sol.' in rows,rows
  p.screenshot(path=str(SHOTS/'luca-reto-casi-1280-en.png'))
  assert not errors,errors;ctx.close()
  b.close()
 print(f'PASS luca reto: Lugares and the portal open the sheet; two short names with symbols; the first round leaves the mark, the turn passes with one white button, the rival runs as the ghost, «Casi: a 1,2 s.» keeps the mark and «¡Nueva marca!» replaces it; leaving loses nothing; erasing takes two taps; kept after a reload; ordinary ★, no sparks; English at 1280×800 with a written name kept ({time.time()-t0:.0f} s)',flush=True)
finally:server.shutdown();server.server_close()
