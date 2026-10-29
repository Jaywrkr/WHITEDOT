"""Ganas de volver (alpha.236) in the real game, on phone and desktop. Racha suave: each played day lights a star in the
Refugio's sky, days in a row join a thread, a missed day loses nothing and the next one starts again; the sky is drawn
above the house (phone) or beside the Cielo (desktop) with its caption clear of the frame, a tap explains it, a
milestone goes to the Bitácora, and nothing pays sparks. Carta del universo: a first opening has no letter; after a few
hours away one short line from the game's own data shows once, in the shared notice lane, after the greeting; a tap
closes it; in the quiet view (the Journey's) it waits until the free World."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,re,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('VOLVER_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
def cross(a,b):return a['x']<b['x']+b['w'] and b['x']<a['x']+a['w'] and a['y']<b['y']+b['h'] and b['y']<a['y']+a['h']
def seg(l):
 x0,x1=sorted([l['x0'],l['x1']]);y0,y1=sorted([l['y0'],l['y1']]);return {'x':x0-.5,'y':y0-.5,'w':x1-x0+1,'h':y1-y0+1}
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active&&!!__r.skyStreakState&&!!__r.universeLetterState",timeout=20000)
   page.evaluate("()=>{"+HIDE+";if(__r.journeyMode()!=='libre')__r.setJourneyMode('libre');}")
   # --- A first opening has no letter: nothing to tell yet.
   st=page.evaluate("__r.universeLetterState()");assert not st['wasDue'] and not st['pending'],st
   sparks=page.evaluate("__r.S.sparks")
   # --- Racha suave: the stars of the days already played are lit (5A: they only add up).
   base=page.evaluate("__r.skyStreakState().lit")
   assert base==page.evaluate("__r.S.totalDays"),('every played day already lit',base)
   # Today: a played day (onFirstLight) lights its star within a second.
   def play():
    page.evaluate("()=>{if(__r.S.lastDay!==__r.S.todayKey)__r.onFirstLight();}")
   def next_day(n):
    page.evaluate(f"()=>{{__r.S.offset+={n};__r.checkDay(true);"+HIDE+"}")
   play();page.wait_for_function(f"__r.skyStreakState().lastDay===__r.S.todayKey&&__r.skyStreakState().lit>={base}",timeout=4000)
   lit0=page.evaluate("__r.skyStreakState().lit");run0=page.evaluate("__r.skyStreakState().run")
   # Two more days in a row: a thread of three or more, and the milestone of three days in the Bitácora.
   for _ in range(2):
    next_day(1);play();page.wait_for_function("__r.skyStreakState().lastDay===__r.S.todayKey",timeout=4000)
   s=page.evaluate("__r.skyStreakState()");assert s['lit']==lit0+2 and s['run']==run0+2 and s['run']>=3,s
   assert 'run:3' in s['marks'],s
   # A missed day: nothing is lost; the next day starts a new thread. No sad words on the way.
   next_day(1);s=page.evaluate("__r.skyStreakState()");assert s['lit']==lit0+2 and s['run']==run0+2,('yesterday still counts',s)
   next_day(1);s=page.evaluate("__r.skyStreakState()");assert s['lit']==lit0+2 and s['run']==0,s
   assert not re.search(r'perd|rot|lástima|0 días',s['caption'],re.I),s['caption']
   next_day(1);play();page.wait_for_function("__r.skyStreakState().lastDay===__r.S.todayKey",timeout=4000)
   s=page.evaluate("__r.skyStreakState()");assert s['lit']==lit0+3 and s['run']==1 and s['best']>=3,s
   # A few more days so the sky has two threads to draw.
   for _ in range(2):
    next_day(1);play();page.wait_for_function("__r.skyStreakState().lastDay===__r.S.todayKey",timeout=4000)
   assert page.evaluate("__r.S.sparks")==sparks,'the sky never pays sparks'
   # --- In the Refugio: the sky is drawn above the house (phone) or beside the Cielo (desktop), its caption measured.
   page.evaluate("__r.landHouse()");page.wait_for_function("__r.houseActive()&&__r.houseSettled()&&!!__r.skyStreakState().hits",timeout=15000);page.evaluate(HIDE)
   page.wait_for_timeout(300)
   lay=page.evaluate('__r.houseLayout()');hits=page.evaluate("__r.skyStreakState().hits");cap=page.evaluate("__r.skyStreakState().caption")
   texts=lay['texts'];mine=[t for t in texts if t['text']==cap];assert mine,(cap,[t['text'] for t in texts])
   assert re.fullmatch(r'\d+ estrellas · 3 días seguidos',cap),cap
   for t in mine:
    for o in texts:
     if o is not t:assert not cross(t,o),('caption crosses a text',t,o)
    for l in lay['lines']:assert not cross(t,seg(l)),('caption crosses the frame',t,l)
    assert t['x']>=0 and t['x']+t['w']<=width and t['y']>=0,t
   house=page.evaluate("(()=>{const g=__r.houseGeometry();return g;})()")
   if width<600:assert hits['y']+hits['h']<=page.evaluate("__r.houseLayout().lines.reduce((m,l)=>Math.min(m,l.y0,l.y1),1e9)"),('above the house on the phone',hits)
   if SHOTS:page.screenshot(path=f'{SHOTS}/volver-refugio-{width}.png')
   # A tap on the sky says what it is, without blame.
   page.mouse.click(hits['x']+hits['w']/2,hits['y']+hits['h']/2)
   page.wait_for_function("document.getElementById('toast').textContent.startsWith('Cada día que juegas enciende una estrella')",timeout=5000)
   # The Bitácora keeps the milestone.
   page.evaluate("__r.exitHouse()");page.wait_for_function("!__r.houseActive()",timeout=5000);page.evaluate(HIDE)
   page.evaluate("__r.openJournal('places')");page.wait_for_function("!!document.querySelector('#journalBody [data-sky-streak]')",timeout=5000)
   card=page.inner_text('#journalBody [data-sky-streak]') if page.locator('#journalBody [data-sky-streak]').is_visible() else page.evaluate("document.querySelector('#journalBody [data-sky-streak]').textContent")
   assert 'Cielo del Refugio' in card and '3 días seguidos' in card and 'Hitos' in card,card
   page.evaluate(HIDE)
   # --- Carta del universo: away a few hours (the test hook moves the last time seen back and stops rewriting it).
   # In the quiet view it waits; the free World shows it.
   page.evaluate("__r.setJourneyMode('viaje')");assert page.evaluate("__r.universeLetterAway(5)")
   page.reload();page.wait_for_function("!!window.__r?.universeLetterState",timeout=20000)
   st=page.evaluate("__r.universeLetterState()");assert st['wasDue'],st
   page.wait_for_timeout(3200);page.evaluate(HIDE)
   assert page.evaluate("__r.universeLetterState().pending"),'the letter waits in the quiet view'
   assert page.evaluate("document.getElementById('toast').dataset.detail")!='carta'
   page.evaluate("__r.setJourneyMode('libre')")
   page.wait_for_function("document.getElementById('toast').dataset.detail==='carta'&&document.getElementById('toast').classList.contains('on')",timeout=8000)
   text=page.inner_text('#toast');lines=[l for l in text.split('\n') if l.strip()]
   assert lines[0]=='Mientras no estabas' and len(lines)==2,lines
   st=page.evaluate("__r.universeLetterState()");assert not st['pending'] and st['shown']['text']==lines[1] and st['count']>=1,st
   assert re.match(r'^(Un|Una|Unas|Unos|Los|Las|Cinco|Cuatro|Llovieron|.+ brilló)',lines[1]) and len(lines[1])<=60,lines[1]
   pool=page.evaluate("async()=>{const m=await import('/src/universe-letter.js');return m.letterPool(__r.S).map(l=>l.text);}")
   assert lines[1] in pool,('from real game data',lines[1])
   if SHOTS:page.screenshot(path=f'{SHOTS}/volver-carta-{width}.png')
   # Silent and light: it does not block the game (no dialog), and a tap closes it.
   assert page.evaluate("!document.querySelector('.modal:not([hidden])')")
   box=page.locator('#toast').bounding_box();page.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)
   page.wait_for_function("!document.getElementById('toast').classList.contains('on')",timeout=3000)
   # Once per opening: nothing else is pending.
   page.wait_for_timeout(800);assert not page.evaluate("__r.universeLetterState().pending")
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS Ganas de volver on phone and desktop in {elapsed:.0f} s: a star per played day, threads for days in a row, nothing lost on a missed day, the sky in the Refugio with its caption clear and a tap that explains it, the milestone in the Bitácora, no sparks; the universe letter after hours away, from real data, waiting out the quiet view, closed with a tap, once per opening',flush=True)
finally:server.shutdown()
