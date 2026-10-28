"""Shared walk for the living encounters of batch 2 (the eleven «huir»), used by live_flee_a_smoke.py and
live_flee_b_smoke.py (two files, so each stays under the 145 s of a browser flow). For each one: the page opens with
«?anillo=1&encuentro=<id>» in its biome, a few seconds of travel bring it ahead of the cube with its line, and then
three endings on the same page: escaping with pulses on time (15 ✦, the Bitácora and its notice the first time),
escaping on foot (10 ✦) and being reached (no sparks given or taken, its kind goodbye and a nudge of about a second).
Lasting is the only way out of the falling stones and the pollen: after a second of play the walk skips to their last
seconds. The odds of escaping on foot are measured in tests/live-encounters.mjs, not here: on foot the pulsar's core is
reached in one step."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
def serve():
 s=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=s.serve_forever,daemon=True).start();return s
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
def page_for(browser,url):
 page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(url);page.wait_for_function('!!window.__r?.liveEncounterSpawn&&!!window.__r?.mischiefTick',timeout=20000);return page,errors
FIND="""id=>{const r=__r,W=r.WCH,x0=Math.floor(r.S.wx/W),y0=Math.floor(r.S.wy/W);for(let d=0;d<60;d++)for(let x=x0-d;x<=x0+d;x++)for(let y=y0-d;y<=y0+d;y++){if(Math.max(Math.abs(x-x0),Math.abs(y-y0))!==d)continue;const q=r.regionOfPos(x*W+W/2,y*W+W/2),b=q.sea?'vacio':r.BIOMES[q.z]?.id;
 if(b===id){const n=[[1,0],[-1,0],[0,1],[0,-1]].every(([a,c])=>{const z=r.regionOfPos((x+a)*W+W/2,(y+c)*W+W/2);return (z.sea?'vacio':r.BIOMES[z.z]?.id)===id;});if(n)return {x:x*W+W/2,y:y*W+W/2};}}return null;}"""
# The page's own frames move the cube: toward the white arrow (pulse/walk), still (still; the pulsar's rings are met by
# drifting slowly outward). pulse: a pulse on time every quarter second.
DRIVE="""async([mode,seconds])=>{const r=__r,{liveGoal,liveDefinition}=await import('/src/live-encounters-model.js'),start=performance.now();let last=start,pulse=0,skipped=false;
 await new Promise(done=>{const step=now=>{const s=r.liveEncounterState().scene;if(!s||s.stage!=='run'||now-start>seconds*1000){done();return;}const dt=Math.min(.05,(now-last)/1000);last=now;
  if(mode==='walk'&&s.kind==='ondas'){r.S.wx=s.safe.x;r.S.wy=s.safe.y;}
  else if(mode!=='still'){const g=liveGoal(s,{x:r.S.wx,y:r.S.wy}),dx=g.x-r.S.wx,dy=g.y-r.S.wy,l=Math.hypot(dx,dy)||1;r.S.wx+=dx/l*Math.min(l,190*dt);r.S.wy+=dy/l*Math.min(l,190*dt);}
  else if(s.kind==='ondas'){const dx=r.S.wx-s.x,dy=r.S.wy-s.y,l=Math.hypot(dx,dy)||1;r.S.wx+=dx/l*40*dt;r.S.wy+=dy/l*40*dt;}
  if(mode==='pulse'&&now-pulse>250){pulse=now;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});}
  if(!skipped&&mode!=='still'&&['derrumbe','polen'].includes(s.kind)&&s.age>1){s.age=liveDefinition(s.kind).life-2;skipped=true;}
  requestAnimationFrame(step);};requestAnimationFrame(step);});
 const s=r.liveEncounterState().scene;return s&&{stage:s.stage,onTime:s.onTime,kind:s.kind,at:{x:r.S.wx,y:r.S.wy}};}"""
GONE="!__r.liveEncounterState().scene"
STATE="""id=>{const r=__r,k=r.S.liveEncounters.kinds[id]||{};return {earned:r.S.liveEncounters.earned,sparks:r.S.sparks,caught:k.caught||0,onTime:k.onTime||0,hit:k.hit||0,book:!!r.S.elementBook?.found?.['live:'+id],log:r.sparkEconomy.log.slice(-4),line:r.liveEncounterState().line,reward:r.liveEncounterState().scene?.reward,at:{x:r.S.wx,y:r.S.wy}};}"""
def flee(browser,kind,shot=False,toast=False):
 """One «huir» forced by its shortcut, then its three endings. Returns the screenshot path, if one was asked."""
 page,errors=page_for(browser,URL+'?anillo=1&encuentro='+kind);page.wait_for_timeout(300)
 d=page.evaluate("async id=>{const d=(await import('/src/live-encounters-model.js')).liveDefinition(id);return {id:d.id,name:d.name,line:d.line,bye:d.bye,biome:d.biome,verb:d.verb}}",kind);assert d['verb']=='huir',d
 page.evaluate("()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();r.setJourneyMode('libre');const p=r.placesData?.();if(p)p.seen={...(p.seen||{}),llanura:true};r.save();}")
 assert page.evaluate('__r.liveEncounterState().allowed&&__r.liveEncounterState().forced')==d['id']
 if toast:assert not page.evaluate('__r.achievementsCalm()'),'notices speak here'
 home=page.evaluate(FIND,d['biome']);assert home,d
 page.evaluate(f"(()=>{{__r.S.wx={home['x']};__r.S.wy={home['y']};}})()");page.wait_for_timeout(150);page.evaluate(HIDE)
 # A few seconds of travel north bring it, ahead of the cube, with its line.
 page.evaluate("""async()=>{const r=__r;for(let i=0;i<600&&!r.liveEncounterState().scene;i++){r.S.wy-=4;await new Promise(f=>requestAnimationFrame(f));}}""")
 st=page.evaluate("(()=>{const r=__r,s=r.liveEncounterState(),sc=s.scene;return sc&&{kind:sc.kind,verb:sc.verb,line:s.line,dy:sc.dir.y}})()")
 assert st and st['kind']==d['id'] and st['verb']=='huir' and st['line']==d['line'] and st['dy']<-.5,(d['id'],st)
 # One at a time, whatever the verb.
 assert not page.evaluate("__r.liveEncounterSpawn('polilla')") and not page.evaluate("__r.liveEncounterSpawn('ola')")
 path=None
 if shot:
  # A pulse on time just before: the white shield round the cube shows in the picture.
  page.wait_for_timeout(900);page.evaluate("(()=>{const r=__r;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});})()")
  page.wait_for_timeout(550);path=SHOTS/f"kubono-e2-{d['id']}-390.png";page.screenshot(path=str(path))
 # 1 · Pulses on time: always out, 15 ✦; the first time, into the Bitácora (and one notice naming it).
 before=page.evaluate(STATE,d['id'])
 got=page.evaluate(DRIVE,['pulse',20]);assert got and got['stage']=='safe' and got['onTime'],(d['id'],got)
 page.wait_for_function("__r.liveEncounterState().scene?.paid",timeout=4000);after=page.evaluate(STATE,d['id'])
 assert after['reward']==15 and after['earned']==before['earned']+15 and after['sparks']>=before['sparks']+15 and after['caught']==1 and after['onTime']==1 and after['book'],(d['id'],before,after)
 # Other finds on the way (a crystal, an achievement) may log their own sparks just after.
 assert {'title':d['name'],'text':'Encuentro vivo · +15 chispas'} in [{'title':e['title'],'text':e['text']} for e in after['log']],after
 # Achievements earned on the way (a landscape, the World) may show first: the notice waits its turn (as in live_do_helpers.py).
 if toast:page.wait_for_function("(document.getElementById('toast')?.innerText||'').includes('Encuentro nuevo')",timeout=15000);t=page.locator('#toast').inner_text();assert d['name'] in t and 'Logro' not in t,t
 page.wait_for_function(GONE,timeout=5000)
 # 2 · On foot, no pulse: out, 10 ✦.
 assert page.evaluate(f"__r.liveEncounterSpawn('{d['id']}')");before=page.evaluate(STATE,d['id'])
 got=page.evaluate(DRIVE,['walk',20]);assert got and got['stage']=='safe' and not got['onTime'],(d['id'],got)
 page.wait_for_function("__r.liveEncounterState().scene?.paid",timeout=4000);after=page.evaluate(STATE,d['id'])
 assert after['reward']==10 and after['earned']==before['earned']+10 and after['caught']==2 and after['onTime']==1,(d['id'],after)
 page.wait_for_function(GONE,timeout=5000)
 # 3 · Reached: nothing given, nothing taken, its kind goodbye, a nudge of about a second, then it goes.
 assert page.evaluate(f"__r.liveEncounterSpawn('{d['id']}')");before=page.evaluate(STATE,d['id'])
 got=page.evaluate(DRIVE,['still',25]);assert got and got['stage']=='hit',(d['id'],got)
 hit=page.evaluate(STATE,d['id']);assert hit['line']==d['bye'] and hit['hit']==1 and hit['earned']==before['earned'] and hit['sparks']>=before['sparks'] and hit['caught']==2,(d['id'],hit)
 page.wait_for_function(GONE,timeout=5000);end=page.evaluate(STATE,d['id'])
 moved=((end['at']['x']-got['at']['x'])**2+(end['at']['y']-got['at']['y'])**2)**.5
 assert moved<=70 and end['earned']==before['earned'],(d['id'],moved,end)
 assert not errors,errors;page.close();return path
URL=''
def start():
 global URL;s=serve();URL=f'http://127.0.0.1:{s.server_port}/';return s
