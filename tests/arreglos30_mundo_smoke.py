"""Arreglos de la media hora (alpha.242) · the free World on phone and desktop, sound off. A wild spark is caught by
passing through it (the same 15 ✦, «Atrapada», never «Se fue»). The first rumor after a caught living encounter points
near, at 1 to 3 km; a second one completed right away rolls nothing yet (the rumors come spaced); walking to the first
fulfils it and owes another, which comes with time. Activities, finds of the cube and magic boxes within 300 m leave a
small white mark at the screen's edge; further away, none."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,re,math
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('ARREGLOS30_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
CATCH="""async()=>{const r=__r;for(let i=0;i<40;i++){const s=r.liveEncounterState().scene;if(!s||s.stage!=='run')break;r.S.wx=s.x-40;r.S.wy=s.y;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});await new Promise(f=>setTimeout(f,120));}
 const s=r.liveEncounterState().scene;return s&&{stage:s.stage}}"""
# The nearest target of each kind around a point, from the same cells the game reads (nothing moved).
FIND="""async([kind,x,y])=>{const r=__r;const A=await import('/src/universe-activities-model.js'),W=await import('/src/musical-wonders-model.js'),E=await import('/src/expansion-music.js');
 const size=kind==='activity'?A.ACTIVITY_CELL:kind==='wonder'?W.WONDER_CELL:r.WCH,i0=Math.floor(x/size),j0=Math.floor(y/size);let best=null;
 for(let n=0;n<40&&!best;n++)for(let i=i0-n;i<=i0+n;i++)for(let j=j0-n;j<=j0+n;j++){if(Math.max(Math.abs(i-i0),Math.abs(j-j0))!==n)continue;let list=[];
  if(kind==='activity')list=A.activityCell(i,j,r.seedOf,'superficie').filter(o=>!r.S.activities?.done?.[o.id]);
  else if(kind==='wonder')list=W.wonderCell(i,j,r.seedOf,'superficie').filter(o=>r.S.musicalWonders?.found?.[o.kind]!==true);
  else{const b=E.boxAt(i,j,r.WCH,r.seedOf,r.rng);list=b&&!r.S.boxes?.[b.id]&&!r.regionOfPos(b.x,b.y).sea?[b]:[];}
  for(const o of list)if(!best)best={x:o.x,y:o.y};}
 return best;}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.discoverState&&__r.ringState?.().active&&!!__r.liveEncounterSpawn&&!!__r.wildState",timeout=20000)
 page.evaluate(FREE);page.wait_for_timeout(300);return page,errors
def catch(page):
 assert page.evaluate("__r.liveEncounterSpawn('polilla')");got=page.evaluate(CATCH);assert got and got['stage']=='caught',got
 page.wait_for_function("!__r.liveEncounterState().scene",timeout=8000)
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   page,errors=page_for(browser,width,height)
   # --- 1 · A wild spark with the sound off: passing through it catches it.
   assert page.evaluate("__r.wildState().active");sparks=page.evaluate("__r.S.sparks")
   assert page.evaluate("__r.wildSpawn()") is True
   sp=page.evaluate("__r.wildState().spark");page.evaluate(f"()=>{{__r.S.wx={sp['x']}-12;__r.S.wy={sp['y']};}}")
   page.wait_for_function("__r.wildState().spark===null",timeout=4000);st=page.evaluate("__r.wildState()");assert st['caught']==1 and st['today']==1,st
   assert page.evaluate("__r.S.sparks")-sparks==15,page.evaluate("__r.S.sparks")-sparks
   # --- 2 · Rumors: the first one near; the next roll waits; one fulfilled owes another.
   page.evaluate(HIDE);catch(page);page.wait_for_function("__r.discoverState().rumors.open.length===1",timeout=9000)
   r1=page.evaluate("__r.discoverState().rumors.open[0]");m=re.fullmatch(r'Dicen que (al [a-z]+), a (\d+) km, (.+)\.',r1['text']);assert m and 1<=int(m.group(2))<=3,r1['text']
   frm=page.evaluate("({x:__r.S.wx,y:__r.S.wy})");km=math.hypot(r1['x']-frm['x'],r1['y']-frm['y'])/10000;assert .6<=km<=3.6,km
   n=page.evaluate("__r.discoverState().rumors.n");page.evaluate(HIDE);catch(page);page.wait_for_timeout(600)
   st=page.evaluate("__r.discoverState()");assert st['rumors']['n']==n and len(st['rumors']['open'])==1,('the next roll waits its gap',st['rumors'])
   page.evaluate(f"(()=>{{__r.S.wx={r1['x']}-300;__r.S.wy={r1['y']};}})()")
   page.wait_for_function(f"!__r.discoverState().rumors.open.some(e=>e.id==='{r1['id']}')",timeout=6000)
   st=page.evaluate("__r.discoverState()");assert st['rumors'].get('owed')==1 and st['refillAt'] is not None,('one owed, with time',st['rumors'].get('owed'),st['refillAt'])
   page.reload();page.wait_for_function("!!window.__r?.discoverState&&!!__r.liveEncounterSpawn",timeout=20000);page.evaluate(FREE)
   assert page.evaluate("__r.discoverState().rumors.owed")==1,'the owed rumor survives a reload'
   # --- 5 · Marks at the edge: within 300 m, one for each kind; beyond, none.
   page.evaluate(HIDE)
   for kind in ['activity','wonder','box']:
    o=page.evaluate(FIND,[kind,page.evaluate("__r.S.wx"),page.evaluate("__r.S.wy")]);assert o,kind
    page.evaluate(f"()=>{{__r.S.wx={o['x']}-2400;__r.S.wy={o['y']};}}")
    page.wait_for_function(f"(__r.discoverState().drawn.marks?.{kind}?.d??9e9)<=2500",timeout=6000);mk=page.evaluate(f"__r.discoverState().drawn.marks.{kind}")
    assert mk['x']>=width-40 and 90<=mk['y']<=height-90 and 2300<=mk['d']<=2500,(kind,mk)
    if SHOTS:page.screenshot(path=f'{SHOTS}/borde-{kind}-{width}.png')
    page.evaluate(f"()=>{{__r.S.wx={o['x']}-3800;__r.S.wy={o['y']};}}");page.wait_for_timeout(400)
    mk=page.evaluate(f"__r.discoverState().drawn.marks?.{kind}");assert not mk or mk['d']<3000,(kind,'beyond 300 m, that one has no mark',mk)
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS arreglos de la media hora · Mundo on phone and desktop in {elapsed:.0f} s: with the sound off a wild spark is caught by passing through it (15 ✦); the first rumor points at 1–3 km, the next roll waits its gap, one fulfilled owes another (kept on reload); activities, finds and boxes within 300 m leave a mark at the edge, none further',flush=True)
finally:server.shutdown()
