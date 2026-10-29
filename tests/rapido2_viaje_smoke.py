"""«?rapido=2» short for real (Jay, 28 Oct 2026, alpha.230): a bot plays the whole Journey on a phone screen, from the
first screen through the Camino, the five chapters and the finale, walking at the cube's speed and pulsing on time, and
the run is timed. The Camino asks for two crystals, each chapter closes in two or three actions and its portal opens
at once beside the cube. The quick save is its own («kubono:rapido»); the player's game is untouched."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,json,sys
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}/'
QUERY=os.environ.get('RAPIDO_QUERY','?rapido=2')
# A bot never hesitates: a person takes longer (reading, finding the next thing). The bound catches a regression.
LIMIT=float(os.environ.get('RAPIDO_LIMIT','120'))
MAIN=json.dumps({'mark':'player-save'})
# The bot: it walks the cube at its own speed (190 u/s) and pulses on the next beat it can hear, like a player who
# never misses. It never moves the game's state by hand: everything comes from walking and pulsing.
BOT=r"""()=>{const r=__r,SPEED=190;
 const frame=()=>new Promise(res=>requestAnimationFrame(()=>res()));
 const pos=()=>r.inWorld()?{x:r.S.wx,y:r.S.wy}:{x:r.S.px,y:r.S.py};
 const put=(x,y)=>{if(r.inWorld()){r.S.wx=x;r.S.wy=y;}else{r.S.px=x;r.S.py=y;}};
 async function walk(x,y,near=4){let last=performance.now(),was=null;for(let i=0;i<2000;i++){await frame();const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;const p=pos();if(was&&Math.hypot(p.x-was.x,p.y-was.y)>60)return true;const dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy);if(d<=near)return true;const k=Math.min(1,SPEED*dt/d);put(p.x+dx*k,p.y+dy*k);was=pos();}return false;}
 // (A portal or a jump moves the cube: the walk stops there.)
 // A loop around a point, at the cube's speed: what the Bosque asks.
 async function circle(cx,cy,rad){const p=pos(),a0=Math.atan2(p.y-cy,p.x-cx);await walk(cx+Math.cos(a0)*rad,cy+Math.sin(a0)*rad);let last=performance.now(),a=a0;while(a<a0+6.283+.5){await frame();const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;a+=SPEED*dt/rad;put(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad);}}
 // On the next beat the player can hear (the same judge as the game's), a pulse of the player.
 const on=(downbeat=false)=>new Promise(res=>{const tick=()=>{const ac=r.ac,bq=r.MU?.bq||[],bar=(r.SIX||.125)*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),own=r.journeyRhythmTarget?.(ac.currentTime),d=own?(own.hit?own.hit.dist:1):Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));
  if(d<.02&&(!downbeat||((r.MU.step||0)%16)<2)){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();});
 window.__bot={walk,circle,on,pos,frame};}"""
def say(*a):print(*a,flush=True)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(URL+'tests/');page.evaluate(f"localStorage.clear();localStorage.setItem('pixel-blanco-v4',{json.dumps(MAIN)})")
  t0=time.time();page.goto(URL+QUERY);page.wait_for_function('!!window.__r?.journeyFinale&&!!window.__r?.crystalState')
  page.evaluate(BOT)
  # The first screen: straight on the Camino (the quick test skips the welcome); the sound on.
  if page.locator('#hcGo').is_visible():page.locator('#hcGo').click()
  page.evaluate("()=>{__r.S.sound=true;__r.audio?.();}")
  page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000)
  marks={}
  def mark(name):marks[name]=round(time.time()-t0,1);say(f'{marks[name]:6.1f}s  {name}')
  mark('primera pantalla')
  # 1 · The Camino: walk to the next crystal and pulse on time until the World opens.
  for i in range(14):
   if page.evaluate('__r.inWorld()'):break
   page.evaluate("""async()=>{const r=__r,o=r.crystalState.near.filter(o=>!r.S.pathCrystals.includes(o.id)&&!o.broken&&o.x>r.S.px-40).sort((a,b)=>a.x-b.x)[0];if(!o)return;await __bot.walk(o.x,o.y-25);await __bot.on();await new Promise(res=>setTimeout(res,250));}""")
  page.wait_for_function('__r.inWorld()',timeout=8000);crystals=page.evaluate('__r.S.pathCrystals.filter(id=>!id.startsWith("rapido:")).length');mark(f'Camino ({crystals} cristales)')
  HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
  def close_help():
   # A player closes the World's help with its button; the bot does the same.
   for sel in ['#hwGo','#returnContinue']:
    if page.locator(sel).count() and page.locator(sel).is_visible():page.locator(sel).click()
   page.evaluate(HIDE)
  def portal(name):
   page.wait_for_function("__r.journeyChapter().portalOpen",timeout=60000);mark('  portal abierto')
   before=page.evaluate('__r.journeyChapter().chapter')
   page.evaluate("async()=>{const p=__r.journeyChapter().portal;await __bot.walk(p.x,p.y,6);}")
   page.wait_for_function(f"(__r.journeyChapter().chapter||0)>{before}",timeout=60000);mark(name)
  actions={}
  # 2 · Llanura «Pégate»: next to the nearest thing that shines, a pulse on time.
  close_help();page.wait_for_function("__r.journeyStick().active",timeout=10000)
  n=0
  while not page.evaluate('__r.journeyStick().cloud') and n<12:
   page.evaluate("""async()=>{const m=await import('./src/journey-stick.js'),r=__r,cx=Math.floor(r.S.wx/m.STICK_CELL),cy=Math.floor(r.S.wy/m.STICK_CELL),taken=new Set(r.S.journey.stick.gone);let best=null;
    for(let i=cx-6;i<=cx+6;i++)for(let j=cy-6;j<=cy+6;j++){const it=m.cellItem(i,j);if(!it||taken.has(it.id)||r.BIOMES[r.biomeOfPos(it.x,it.y)].id!=='llanura')continue;const d=Math.hypot(it.x-r.S.wx,it.y-r.S.wy);if(!best||d<best.d)best={...it,d};}
    if(best)await __bot.walk(best.x+4,best.y);await __bot.on();}""");n+=1;page.wait_for_timeout(120)
  page.evaluate('__bot.on()');n+=1;page.wait_for_function('__r.journeyChapter().done.llanura',timeout=5000);actions['llanura']=n;mark(f'Llanura ({n} pulsos)')
  portal('portal a Lago')
  # 3 · Lago «Encadena»: just before the first flower of a cluster, a pulse on time; the ripple runs through it.
  close_help();page.wait_for_function("__r.journeyChain().active",timeout=10000);n=0
  while not page.evaluate('__r.journeyChain().flower') and n<12:
   page.evaluate("""async()=>{const m=await import('./src/journey-chain.js'),r=__r,cx=Math.floor(r.S.wx/m.CHAIN_CELL),cy=Math.floor(r.S.wy/m.CHAIN_CELL),lit=new Set(r.S.journey.chain.lit);
    for(let d=0;d<10;d++)for(let i=cx-d;i<=cx+d;i++)for(let j=cy-d;j<=cy+d;j++){const list=m.cellFlowers(i,j);if(list.length<4||list.some(f=>lit.has(f.id)||r.BIOMES[r.biomeOfPos(f.x,f.y)].id!=='lago'))continue;
     const f=list[0],a=Math.atan2(f.y-list[1].y,f.x-list[1].x);await __bot.walk(f.x+Math.cos(a)*90,f.y+Math.sin(a)*90);await __bot.on();return;}}""");n+=1;page.wait_for_timeout(1600)
  page.evaluate('__bot.on()');n+=1;page.wait_for_function('__r.journeyChapter().done.lago',timeout=5000);actions['lago']=n;mark(f'Lago ({n} pulsos)')
  portal('portal a Bosque')
  # 4 · Bosque «Rodea»: a loop around a group of fireflies, then a pulse on time.
  close_help();page.wait_for_function("__r.journeyLasso().active",timeout=10000);n=0
  while not page.evaluate('__r.journeyLasso().friend') and n<10:
   page.evaluate("""async()=>{const m=await import('./src/journey-lasso.js'),r=__r,cx=Math.floor(r.S.wx/m.LASSO_CELL),cy=Math.floor(r.S.wy/m.LASSO_CELL),caught=new Set(r.S.journey.lasso.caught);
    for(let d=0;d<10;d++)for(let i=cx-d;i<=cx+d;i++)for(let j=cy-d;j<=cy+d;j++){const list=m.cellFireflies(i,j).filter(f=>!caught.has(f.id)&&r.BIOMES[r.biomeOfPos(f.x,f.y)].id==='bosque');if(list.length<4)continue;
     const x=list.reduce((s,f)=>s+f.x,0)/list.length,y=list.reduce((s,f)=>s+f.y,0)/list.length;await __bot.circle(x,y,80);await __bot.on();return;}}""");n+=1;page.wait_for_timeout(200)
  page.evaluate('__bot.on()');n+=1;page.wait_for_function('__r.journeyChapter().done.bosque',timeout=5000);actions['bosque']=n;mark(f'Bosque ({n} pulsos)')
  portal('portal a Tormenta')
  # 5 · Tormenta «Baila»: into the circle, a pulse on time when it is there.
  close_help();page.wait_for_function("__r.journeyDance().active",timeout=10000);n=0
  while not page.evaluate('__r.journeyDance().eye') and n<12:
   page.wait_for_function('!!__r.journeyDance().target||!!__r.journeyDance().eye',timeout=5000)
   page.evaluate("""async()=>{const t=__r.journeyDance().target;if(t)await __bot.walk(t.x,t.y,6);await __bot.on();}""");n+=1
  page.evaluate('__bot.on()');n+=1;page.wait_for_function('__r.journeyChapter().done.tormenta',timeout=5000);actions['tormenta']=n;mark(f'Tormenta ({n} pulsos)')
  portal('portal a Vacío')
  # 6 · Vacío «Suelta»: a pulse on the «1» lets one thing go; then your light.
  close_help();page.wait_for_function("__r.journeyRelease().active",timeout=10000);n=0
  while not page.evaluate('__r.journeyRelease().light') and n<30:
   page.evaluate("""async()=>{const p=__bot.pos();await __bot.walk(p.x+110,p.y);await __bot.on(true);}""");n+=1
  # A slow machine can miss the «1» with the closing pulse: pulse again, a few times at most, until the chapter closes.
  for attempt in range(4):
   page.evaluate('__bot.on()');n+=1
   try:page.wait_for_function('__r.journeyChapter().done.vacio',timeout=5000);break
   except Exception:
    if attempt==3:raise
  actions['vacio']=n;mark(f'Vacío ({n} pulsos)')
  # 7 · The last portal opens the finale; it plays whole (nobody presses «Saltar») and leaves the free World.
  page.wait_for_function("__r.journeyChapter().portalOpen",timeout=20000)
  page.evaluate("async()=>{const p=__r.journeyChapter().portal;await __bot.walk(p.x,p.y,6);}")
  page.wait_for_function("__r.journeyFinaleState().running",timeout=8000);mark('final empieza')
  page.wait_for_function("!__r.journeyFinaleState().running&&__r.S.journey.finished",timeout=60000);mark('final termina')
  total=time.time()-t0
  state=page.evaluate("()=>({mode:__r.journeyMode(),finished:__r.S.journey.finished,keys:Object.keys(localStorage)})")
  assert state['finished'] and state['mode']=='libre',state
  assert page.evaluate("localStorage.getItem('pixel-blanco-v4')")==MAIN,"the player's save is untouched"
  assert 'kubono:rapido' in state['keys'],state
  say('acciones por capítulo:',actions)
  say(f'TOTAL {total:.1f} s')
  if QUERY=='?rapido=2':
   assert crystals==2,crystals
   assert all(v<=3 for v in actions.values()),actions
   assert total<=LIMIT,total
  assert not errors,errors;browser.close()
 print(f'PASS ?rapido=2 whole Journey by a bot on 390×844: Camino {crystals} crystals, chapters {actions}, finale whole, {total:.0f} s in all; own save, the player\'s untouched',flush=True)
finally:server.shutdown()
