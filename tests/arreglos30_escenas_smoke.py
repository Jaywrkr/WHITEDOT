"""Arreglos de la media hora (alpha.242) · scenes and notices on phone and desktop. A living encounter keeps the kind it
was, so the next is another (kept on reload). A mischief scene that does not move on holds nothing back after 10 s (a
living encounter may start, and the idle scene steps aside) and says goodbye by itself at 40 s («Se despidió.»). In the
first half hour of the free World two achievements earned together bring one notice; the other waits, unread in the
Bitácora; a minor one («· N») brings none."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# A mischief site on land near the origin, from the game's own cells.
SITE="""async()=>{const r=__r,M=await import('/src/universe-mischief-model.js');for(let n=0;n<30;n++)for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++){if(Math.max(Math.abs(i),Math.abs(j))!==n)continue;
 for(const o of M.mischiefCell(i,j,r.seedOf,'superficie'))if(['imitator','shadow'].includes(o.kind)&&!r.regionOfPos(o.x,o.y).sea&&!r.S.mischief?.done?.[o.id])return {x:o.x,y:o.y,kind:o.kind,id:o.id};}return null;}"""
def page_for(browser,width,height,query='?anillo=1'):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/'+query);page.wait_for_function("!!window.__r?.discoverState&&__r.ringState?.().active&&!!__r.liveEncounterSpawn&&!!__r.mischiefBusy",timeout=20000)
 page.evaluate(FREE);page.wait_for_timeout(300);return page,errors
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   page,errors=page_for(browser,width,height)
   # --- 3 · A living encounter remembers its kind (the next one is another); kept on reload.
   assert page.evaluate("__r.liveEncounterSpawn('polilla')");assert page.evaluate("__r.liveEncounterState().book.last")=='polilla'
   page.evaluate("()=>{const s=__r.liveEncounterState().scene;s.stage=s.result='escaped';s.over=9;}");page.wait_for_function("!__r.liveEncounterState().scene",timeout=5000)
   page.evaluate("__r.save()");page.reload();page.wait_for_function("!!window.__r?.liveEncounterState&&!!__r.mischiefBusy",timeout=20000);page.evaluate(FREE)
   assert page.evaluate("__r.liveEncounterState().book.last")=='polilla','kept on reload'
   ok=page.evaluate("""async()=>{const L=await import('/src/live-encounters-model.js');const scope=JSON.stringify(__r.worldIdentity)+':superficie';let last='';for(let n=0;n<60;n++){for(const b of ['llanura','bosque','vacio']){const d=L.livePick(b,scope,n,{last,km:1,land:'bosque'});if(d.id===last)return false;last=d.id;}}return true;}""");assert ok
   # --- 4 · A mischief scene that does not move on.
   site=page.evaluate(SITE);assert site
   page.evaluate(f"()=>{{__r.S.wx={site['x']};__r.S.wy={site['y']};}}");page.wait_for_function("!!__r.mischiefState.scene",timeout=6000)
   assert page.evaluate("__r.mischiefBusy()"),'a fresh scene keeps the others waiting'
   assert not page.evaluate("__r.liveEncounterSpawn('polilla')"),'no encounter while it moves on'
   # Ten seconds without a step (its clock moved on): it holds nothing back; an encounter starts and the scene steps aside.
   page.evaluate("()=>{const m=__r.mischiefState;m.scene.movedAt=m.clock-11;}");assert not page.evaluate("__r.mischiefBusy()")
   assert page.evaluate("__r.liveEncounterSpawn('polilla')"),'an idle scene holds nothing back'
   page.wait_for_function("!__r.mischiefState.scene",timeout=4000);aside=page.evaluate("__r.mischiefState.clock")
   page.evaluate("()=>{const s=__r.liveEncounterState().scene;s.stage=s.result='escaped';s.over=9;}");page.wait_for_function("!__r.liveEncounterState().scene",timeout=5000)
   # Forty seconds without a step: it says goodbye by itself. Away past its 15 s of rest, then back to the same site.
   page.evaluate(f"()=>{{__r.S.wx={site['x']}+2000;__r.S.wy={site['y']};}}");page.wait_for_function(f"__r.mischiefState.clock>{aside}+15.5",timeout=40000);page.wait_for_timeout(300)
   page.evaluate(f"()=>{{__r.S.wx={site['x']};__r.S.wy={site['y']};}}");page.wait_for_function("!!__r.mischiefState.scene",timeout=25000);page.wait_for_timeout(2500)
   page.evaluate("()=>{const m=__r.mischiefState;m.scene.movedAt=m.clock-39.5;}");page.wait_for_function("!__r.mischiefState.scene",timeout=4000)
   page.wait_for_timeout(1500);assert not page.evaluate("__r.mischiefState.scene"),'it does not come back while you stay'
   # --- 6 · Achievements in the first half hour: one notice for two; a minor one, none; all unread in the Bitácora.
   page.evaluate(HIDE);page.evaluate("()=>{__r.S.firstWorldSeconds=10;}")
   assert page.evaluate("__r.achievementsFirstWorld().first")
   v2=page.evaluate("__r.ACH.find(a=>a[0].startsWith('v2:')&&!__r.S.ach[a[0]])[0]")
   page.evaluate(f"()=>{{__r.S.ach['{v2}']=__r.S.todayKey;__r.achievementEarned(['{v2}']);}}");page.wait_for_timeout(2600)
   assert not page.evaluate("document.getElementById('toast').textContent.includes('{}')".replace('{}',page.evaluate(f"__r.ACH.find(a=>a[0]==='{v2}')[1]"))),'a minor one waits in silence'
   ids=page.evaluate("__r.ACH.filter(a=>!a[0].startsWith('v2:')&&!__r.S.ach[a[0]]&&!__r.achievementRetired(a[0])).slice(0,2).map(a=>[a[0],a[1]])")
   page.evaluate(f"()=>{{for(const id of {[i for i,_ in ids]})__r.S.ach[id]=__r.S.todayKey;__r.achievementEarned({[i for i,_ in ids]});}}")
   page.wait_for_function("document.getElementById('toast').textContent.startsWith('Logro · ')",timeout=8000)
   shown=page.evaluate("document.getElementById('toast').textContent");page.wait_for_timeout(2600)
   names=[n for _,n in ids];assert sum(1 for n in names if n in shown)==1,(shown,names)
   fw=page.evaluate("__r.achievementsFirstWorld()");assert fw['lastNotice']>=0,fw
   assert page.evaluate("__r.achievementsUnread()"),'all wait unread in the Bitácora'
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS arreglos de la media hora · escenas on phone and desktop in {elapsed:.0f} s: a living encounter keeps its kind so the next is another (kept on reload); a mischief scene that does not move on lets an encounter start after 10 s and says goodbye by itself at 40 s; in the first half hour two achievements bring one notice, a minor one none, all unread in the Bitácora',flush=True)
finally:server.shutdown()
