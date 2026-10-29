"""Living encounters, batch 1 (Jay, 27 Oct 2026): the eleven «perseguir» in the free World (the eleven «huir» of batch 2
have their own walks, live_flee_a_smoke.py and live_flee_b_smoke.py). Each one forced with the test
shortcut appears ahead of the cube with its line, runs from it, and a pulse on time near it catches it for its ✦ (more on time) (the first
time also into the Bitácora, with one notice naming it); walking into one pays its ✦; an off-time pulse does not count;
one that gets away costs nothing. One at a time, also with the mischief scenes; never in a chapter, a round or the
Journey's finale; «?encuentro=cometa» brings that one after a few seconds of travel. Screenshots at 390×844."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
# H1 (Jay, alpha.233): the reward is the universe's rule (base × difficulty × distance × rarity, ×1.5 on time), so the
# expected amount is asked of the model for this encounter where it appeared.
EXPECT="""async onTime=>{const m=await import('/src/live-encounters-model.js'),s=__r.liveEncounterState().scene;return m.liveRewardFor(m.liveDefinition(s.kind),{x:s.origin.x,y:s.origin.y,onTime});}"""
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}/'
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
def page_for(browser,query=''):
 page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(URL+query);page.wait_for_function('!!window.__r?.liveEncounterSpawn&&!!window.__r?.mischiefTick',timeout=20000);return page,errors
# Moves the cube toward the prey for some seconds in the page's own frames (speed in units per second).
CHASE="""async([seconds,speed])=>{const r=__r,start=performance.now();let last=start;const out={from:null,to:null};
 await new Promise(done=>{const step=now=>{const s=r.liveEncounterState().scene;if(!s||s.stage!=='run'||now-start>seconds*1000){done();return;}
  const dt=Math.min(.05,(now-last)/1000);last=now;out.from??={x:s.x,y:s.y};const dx=s.x-r.S.wx,dy=s.y-r.S.wy,l=Math.hypot(dx,dy)||1;if(l>90){r.S.wx+=dx/l*speed*dt;r.S.wy+=dy/l*speed*dt;}out.to={x:s.x,y:s.y,d:Math.hypot(s.x-r.S.wx,s.y-r.S.wy)};requestAnimationFrame(step);};requestAnimationFrame(step);});return out;}"""
# Pulses on time beside the prey until it is caught (the fish and the pulsar hide between beats).
CATCH="""async()=>{const r=__r;for(let i=0;i<40;i++){const s=r.liveEncounterState().scene;if(!s||s.stage!=='run')break;r.S.wx=s.x-40;r.S.wy=s.y;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});await new Promise(f=>setTimeout(f,120));}
 const s=r.liveEncounterState().scene;return s&&{stage:s.stage,onTime:s.onTime,paid:!!s.paid,reward:s.reward}}"""
GONE="!__r.liveEncounterState().scene"
FIND="""id=>{const r=__r,W=r.WCH,x0=Math.floor(r.S.wx/W),y0=Math.floor(r.S.wy/W);for(let d=0;d<60;d++)for(let x=x0-d;x<=x0+d;x++)for(let y=y0-d;y<=y0+d;y++){if(Math.max(Math.abs(x-x0),Math.abs(y-y0))!==d)continue;const q=r.regionOfPos(x*W+W/2,y*W+W/2),b=q.sea?'vacio':r.BIOMES[q.z]?.id;
 if(b===id){const n=[[1,0],[-1,0],[0,1],[0,-1]].every(([a,c])=>{const z=r.regionOfPos((x+a)*W+W/2,(y+c)*W+W/2);return (z.sea?'vacio':r.BIOMES[z.z]?.id)===id;});if(n)return {x:x*W+W/2,y:y*W+W/2};}}return null;}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  # 1 · The free World after the Journey (?anillo=1): the eleven, each forced, chased and caught on time.
  page,errors=page_for(browser,'?anillo=1');page.wait_for_timeout(600)
  page.evaluate("()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}")
  assert page.evaluate('__r.inWorld()&&!__r.travelInLevel()&&__r.liveEncounterState().allowed&&!__r.journeyQuiet()'),'the free World, after the Journey'
  assert not page.evaluate('__r.achievementsCalm()'),'notices speak here'
  defs=page.evaluate("async()=>(await import('/src/live-encounters-model.js')).LIVE_ENCOUNTERS.filter(d=>d.verb==='perseguir').map(d=>({id:d.id,name:d.name,line:d.line,biome:d.biome}))")
  assert len(defs)==11 and len({d['biome'] for d in defs})==11
  shots=[]
  for i,d in enumerate(defs):
   # Each one where it lives: the cube travels to a region of its biome (the Abyss for the Void).
   home=page.evaluate(FIND,d['biome']);assert home,d
   page.evaluate(f"(()=>{{__r.S.wx={home['x']};__r.S.wy={home['y']};}})()");page.wait_for_timeout(250)
   page.evaluate(HIDE);before=page.evaluate('__r.S.sparks');earned=page.evaluate('__r.S.liveEncounters.earned')
   assert page.evaluate(f"__r.liveEncounterSpawn('{d['id']}')"),d
   st=page.evaluate("(()=>{const r=__r,s=r.liveEncounterState(),sc=s.scene;return {kind:sc.kind,line:s.line,ahead:Math.hypot(sc.x-r.S.wx,sc.y-r.S.wy)}})()")
   assert st['kind']==d['id'] and st['line']==d['line'] and 150<st['ahead']<700,st
   # One at a time.
   assert not page.evaluate("__r.liveEncounterSpawn('polilla')"),'only one at a time'
   chase=page.evaluate(CHASE,[0.7,150]);assert chase['from'] and chase['to'],chase
   moved=abs(chase['to']['x']-chase['from']['x'])+abs(chase['to']['y']-chase['from']['y'])
   assert moved>5 or d['id'] in ('racimo','reflejo','pulsar'),(d['id'],chase)
   if d['id'] in ('polilla','pez','cometa','reflejo','llamarada'):
    page.evaluate("(()=>{const r=__r,s=r.liveEncounterState().scene;r.S.wx=s.x-110;r.S.wy=s.y+50;})()");page.wait_for_timeout(260)
    path=SHOTS/f"kubono-e1-{d['id']}-390.png";page.screenshot(path=str(path));shots.append(str(path))
   got=page.evaluate(CATCH);assert got and got['stage']=='caught' and got['onTime'],(d['id'],got)
   page.wait_for_function("__r.liveEncounterState().scene?.paid",timeout=4000)
   after=page.evaluate("(()=>{const r=__r;return {earned:r.S.liveEncounters.earned,reward:r.liveEncounterState().scene.reward,sparks:r.S.sparks,log:r.sparkEconomy.log.at(-1),book:!!r.S.elementBook?.found?.['live:"+d['id']+"'],kinds:r.S.liveEncounters.kinds['"+d['id']+"']}})()")
   # Other finds on the way (a crystal, a set) may add their own sparks; this encounter paid exactly 15.
   exp=page.evaluate(EXPECT,True)
   assert after['reward']==exp and after['earned']==earned+exp and after['sparks']>=before+exp,(d['id'],before,after)
   assert after['log']['title']==d['name'] and after['log']['text']==f'Encuentro vivo · +{exp} chispas',after
   assert after['book'] and after['kinds']['caught']==1 and after['kinds']['onTime']==1,after
   if i==0:page.wait_for_function("(document.getElementById('toast')?.innerText||'').includes('Encuentro nuevo')",timeout=5000);assert 'Polilla de luz' in page.locator('#toast').inner_text() and 'Logro' not in page.locator('#toast').inner_text()
   page.wait_for_function(GONE,timeout=5000)
  # The Bitácora lists them with the other finds.
  assert page.evaluate("__r.elementBookCards().includes('Encuentros vivos')&&__r.elementBookCards().includes('Estrella fugaz')")
  # 2 · Walking into it: its ✦ off time and no second notice; a pulse off time does not count; getting away costs nothing.
  before=page.evaluate('__r.S.liveEncounters.earned');page.evaluate("__r.liveEncounterSpawn('polilla')")
  page.evaluate("(()=>{const r=__r,s=r.liveEncounterState().scene;r.S.wx=s.x-60;r.S.wy=s.y;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:false});})()");page.wait_for_timeout(200)
  assert page.evaluate("__r.liveEncounterState().scene.stage")=='run','off time is not on time'
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<60;i++){const s=r.liveEncounterState().scene;if(!s||s.stage!=='run')break;r.S.wx=s.x-8;r.S.wy=s.y;await new Promise(f=>requestAnimationFrame(f));}}""")
  page.wait_for_function("__r.liveEncounterState().scene?.paid",timeout=4000)
  exp=page.evaluate(EXPECT,False)
  assert page.evaluate('__r.S.liveEncounters.earned')==before+exp and page.evaluate('__r.liveEncounterState().scene.reward')==exp and page.evaluate("__r.S.liveEncounters.kinds.polilla.caught")==2
  page.wait_for_function(GONE,timeout=5000);before=page.evaluate('[__r.S.liveEncounters.earned,__r.S.sparks]')
  page.evaluate("__r.liveEncounterSpawn('estrella')");page.evaluate("(()=>{__r.S.wx+=1600;})()")
  page.wait_for_function("__r.liveEncounterState().scene?.stage==='escaped'",timeout=3000)
  assert page.evaluate("__r.liveEncounterState().line")=='La estrella pasó de largo.'
  page.wait_for_function(GONE,timeout=5000);assert page.evaluate('__r.S.liveEncounters.earned')==before[0] and page.evaluate('__r.S.sparks')>=before[1],'escaping costs nothing'
  # 3 · One at a time with the mischief scenes, both ways.
  site=page.evaluate("""async()=>{const {mischiefCell}=await import('/src/universe-mischief-model.js'),r=__r,x0=Math.floor(r.S.wx/1800),y0=Math.floor(r.S.wy/1800);
   for(let d=0;d<30;d++)for(let x=x0-d;x<=x0+d;x++)for(let y=y0-d;y<=y0+d;y++){for(const o of mischiefCell(x,y,r.seedOf,'superficie'))if(['rain','breath','twin'].includes(o.kind)&&!r.regionOfPos(o.x,o.y).sea&&!r.S.mischief?.done?.[o.id])return o;}return null;}""")
  assert site,'a mischief site nearby'
  page.evaluate(f"(()=>{{const r=__r;r.S.wx={site['x']}-700;r.S.wy={site['y']};}})()");page.wait_for_timeout(100)
  assert page.evaluate("__r.liveEncounterSpawn('semilla')")
  # The cube walks onto the mischief site with its encounter close by.
  page.evaluate(f"(()=>{{const s=__r.liveEncounterState().scene;__r.S.wx={site['x']};__r.S.wy={site['y']};s.x=s.origin.x={site['x']}+150;s.y=s.origin.y={site['y']};}})()");page.wait_for_timeout(500)
  assert page.evaluate('!!__r.liveEncounterState().scene'),'the encounter still runs'
  assert page.evaluate('!__r.mischiefState.scene'),'no mischief scene while an encounter runs'
  page.evaluate("(()=>{__r.S.wx+=1600;})()");page.wait_for_function(GONE,timeout=5000)
  page.evaluate(f"(()=>{{__r.S.wx={site['x']};__r.S.wy={site['y']};}})()");page.wait_for_function('!!__r.mischiefState.scene',timeout=20000)
  assert not page.evaluate("__r.liveEncounterSpawn('polilla')"),'no encounter while a mischief scene plays'
  assert not errors,errors;page.close()
  # 4 · The shortcut: a few seconds of travel bring the forced encounter, ahead of the cube.
  page,errors=page_for(browser,'?anillo=1&encuentro=cometa');page.evaluate("()=>{"+HIDE+";__r.S.sound=false;__r.stopAutopilot?.();}")
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<600&&!r.liveEncounterState().scene;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  st=page.evaluate("(()=>{const r=__r,s=r.liveEncounterState().scene;return s&&{kind:s.kind,dx:s.x-r.S.wx,forced:r.liveEncounterState().forced}})()")
  assert st and st['kind']=='cometa' and st['forced']=='cometa' and st['dx']>150,st
  assert not errors,errors;page.close()
  # 5 · Never in a round of a place, a chapter of the Journey or under its finale, even with the shortcut.
  page,errors=page_for(browser,'?lugar=jardin&encuentro=polilla');page.wait_for_function('!!__r.placeRun?.()',timeout=8000);page.evaluate('__r.S.sound=false')
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<300;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  assert page.evaluate('!__r.liveEncounterState().scene&&__r.liveEncounterState().travel===0'),'not in a round'
  assert not page.evaluate("__r.liveEncounterSpawn('polilla')")
  assert not errors,errors;page.close()
  page,errors=page_for(browser,'?encuentro=polilla')
  page.evaluate("()=>{"+HIDE+";const r=__r,s=r.S;s.sound=false;s.pathCrystals=Array.from({length:10},(_,i)=>'j:'+i);s.help.camino=s.help.mundo=true;r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();}")
  page.wait_for_timeout(300);assert page.evaluate("__r.journeyMode()=='viaje'&&__r.inWorld()&&__r.travelInLevel()")
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<300;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  assert page.evaluate('!__r.liveEncounterState().scene') and not page.evaluate("__r.liveEncounterSpawn('polilla')"),'not in a chapter'
  page.evaluate("()=>{const j=__r.S.journey;j.chapter=6;j.done={llanura:true,lago:true,bosque:true,tormenta:true,vacio:true};__r.save();}")
  page.evaluate('__r.journeyFinale()');page.wait_for_function('__r.journeyFinaleState().running',timeout=5000)
  assert not page.evaluate("__r.liveEncounterSpawn('polilla')"),'not under the finale'
  assert not errors,errors;page.close();browser.close()
 print('PASS living encounters: the eleven «perseguir» forced, ahead with their line, chased and caught on time for its ✦ (more on time) (Bitácora and one notice the first time), its ✦ walking, off time does not count, escaping costs nothing; one at a time with mischief; «?encuentro=» after travel; never in rounds, chapters or the finale; screenshots '+json.dumps(shots),flush=True)
finally:server.shutdown()
