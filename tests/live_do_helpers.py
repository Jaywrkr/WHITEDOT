"""Shared walk for the living encounters of batch 3 (the eleven «hacer»), used by live_do_a_smoke.py, live_do_b_smoke.py
and live_do_c_smoke.py (three files, so each stays under the 145 s of a browser flow). For each one: the page opens with
«?anillo=1&encuentro=<id>» in its biome, a few seconds of travel bring it ahead of the cube with its line, and then
three endings on the same page: done with pulses on time (its ✦ by the universe's rule, the Bitácora and its notice the first time), done on
foot toward the white arrow (a little less, off time) and walking away or running out of time (its kind goodbye, nothing given or taken). Sound is off, so the
beat is the steady clock. How often a late or slow player finishes is measured in tests/live-encounters.mjs, not here."""
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
# The page's own frames move the cube toward the white arrow (liveGoal) at the cube's pace; pulse: a pulse on time every
# quarter second. While the prism's nodes sound there is nowhere to go: the cube waits.
DRIVE="""async([mode,seconds])=>{const r=__r,{liveGoal}=await import('/src/live-encounters-model.js'),start=performance.now();let last=start,pulse=0;
 await new Promise(done=>{const step=now=>{const s=r.liveEncounterState().scene;if(!s||s.stage!=='run'||now-start>seconds*1000){done();return;}const dt=Math.min(.05,(now-last)/1000);last=now;
  const g=liveGoal(s,{x:r.S.wx,y:r.S.wy});if(g){const dx=g.x-r.S.wx,dy=g.y-r.S.wy,l=Math.hypot(dx,dy)||1;r.S.wx+=dx/l*Math.min(l,190*dt);r.S.wy+=dy/l*Math.min(l,190*dt);}
  if(mode==='pulse'&&now-pulse>250){pulse=now;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});}
  requestAnimationFrame(step);};requestAnimationFrame(step);});
 const s=r.liveEncounterState().scene;return s&&{stage:s.stage,onTime:s.onTime,kind:s.kind,done:s.done,need:s.need};}"""
GONE="!__r.liveEncounterState().scene"
# H1 (Jay, alpha.233): the reward is the universe's rule (base × difficulty × distance × rarity, ×1.5 on time), so the
# expected amount is asked of the model for this encounter where it appeared.
EXPECT="""async onTime=>{const m=await import('/src/live-encounters-model.js'),s=__r.liveEncounterState().scene;return m.liveRewardFor(m.liveDefinition(s.kind),{x:s.origin.x,y:s.origin.y,onTime});}"""
STATE="""id=>{const r=__r,k=r.S.liveEncounters.kinds[id]||{};return {earned:r.S.liveEncounters.earned,sparks:r.S.sparks,caught:k.caught||0,onTime:k.onTime||0,escaped:k.escaped||0,book:!!r.S.elementBook?.found?.['live:'+id],log:r.sparkEconomy.log.slice(-4),line:r.liveEncounterState().line,reward:r.liveEncounterState().scene?.reward};}"""
def task(browser,kind,shot=0,toast=False):
 """One «hacer» forced by its shortcut, then its three endings. shot: milliseconds to wait before a screenshot (0: none)."""
 page,errors=page_for(browser,URL+'?anillo=1&encuentro='+kind);page.wait_for_timeout(300)
 d=page.evaluate("async id=>{const d=(await import('/src/live-encounters-model.js')).liveDefinition(id);return {id:d.id,name:d.name,line:d.line,bye:d.bye,biome:d.biome,verb:d.verb,need:d.need}}",kind);assert d['verb']=='hacer',d
 page.evaluate("()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();r.setJourneyMode('libre');const p=r.placesData?.();if(p)p.seen={...(p.seen||{}),llanura:true};r.save();}")
 assert page.evaluate('__r.liveEncounterState().allowed&&__r.liveEncounterState().forced')==d['id']
 if toast:assert not page.evaluate('__r.achievementsCalm()'),'notices speak here'
 home=page.evaluate(FIND,d['biome']);assert home,d
 page.evaluate(f"(()=>{{__r.S.wx={home['x']};__r.S.wy={home['y']};}})()");page.wait_for_timeout(150);page.evaluate(HIDE)
 # A few seconds of travel north bring it, laid out ahead of the cube, with its line and its counter.
 page.evaluate("""async()=>{const r=__r;for(let i=0;i<600&&!r.liveEncounterState().scene;i++){r.S.wy-=4;await new Promise(f=>requestAnimationFrame(f));}}""")
 st=page.evaluate("(()=>{const r=__r,s=r.liveEncounterState(),sc=s.scene;return sc&&{kind:sc.kind,verb:sc.verb,line:s.line,dy:sc.dir.y,done:sc.done,need:sc.need,ahead:(sc.y-r.S.wy)}})()")
 assert st and st['kind']==d['id'] and st['verb']=='hacer' and st['line']==d['line'] and st['dy']<-.5 and st['done']==0 and st['need']==d['need'],(d['id'],st)
 # One at a time, whatever the verb.
 assert not page.evaluate("__r.liveEncounterSpawn('polilla')") and not page.evaluate("__r.liveEncounterSpawn('ola')") and not page.evaluate("__r.liveEncounterSpawn('motas')")
 path=None
 if shot:page.wait_for_timeout(shot);path=SHOTS/f"kubono-e3-{d['id']}-390.png";page.screenshot(path=str(path))
 # 1 · Pulses on time: done, more ✦; the first time, into the Bitácora (and one notice naming it).
 before=page.evaluate(STATE,d['id'])
 got=page.evaluate(DRIVE,['pulse',25]);assert got and got['stage']=='done' and got['onTime'],(d['id'],got)
 page.wait_for_function("__r.liveEncounterState().scene?.paid",timeout=4000);after=page.evaluate(STATE,d['id']);exp=page.evaluate(EXPECT,True)
 assert after['reward']==exp and after['earned']==before['earned']+exp and after['sparks']>=before['sparks']+exp and after['caught']==1 and after['onTime']==1 and after['book'],(d['id'],before,after)
 assert {'title':d['name'],'text':f'Encuentro vivo · +{exp} chispas'} in [{'title':e['title'],'text':e['text']} for e in after['log']],after
 # Achievements earned on the way (a landscape, the World) may show first: the notice waits its turn.
 if toast:page.wait_for_function("(document.getElementById('toast')?.innerText||'').includes('Encuentro nuevo')",timeout=15000);t=page.locator('#toast').inner_text();assert d['name'] in t and 'Logro' not in t,t
 page.wait_for_function(GONE,timeout=5000)
 # 2 · On foot, no pulse: done, its ✦.
 assert page.evaluate(f"__r.liveEncounterSpawn('{d['id']}')");before=page.evaluate(STATE,d['id'])
 got=page.evaluate(DRIVE,['walk',30]);assert got and got['stage']=='done' and not got['onTime'],(d['id'],got)
 page.wait_for_function("__r.liveEncounterState().scene?.paid",timeout=4000);after=page.evaluate(STATE,d['id']);exp=page.evaluate(EXPECT,False)
 assert after['reward']==exp and after['earned']==before['earned']+exp and after['caught']==2 and after['onTime']==1,(d['id'],after)
 page.wait_for_function(GONE,timeout=5000)
 # 3 · Walking away (the bubbles rise round the cube wherever it goes: their time runs out instead): its kind goodbye,
 # nothing given, nothing taken, then it goes.
 assert page.evaluate(f"__r.liveEncounterSpawn('{d['id']}')");before=page.evaluate(STATE,d['id'])
 page.evaluate("(()=>{const s=__r.liveEncounterState().scene;if(s.kind==='burbujas')s.age=30;else __r.S.wx+=1600;})()");page.wait_for_function("__r.liveEncounterState().scene?.stage==='escaped'",timeout=3000)
 left=page.evaluate(STATE,d['id']);assert left['line']==d['bye'] and left['escaped']==before['escaped']+1 and left['earned']==before['earned'] and left['sparks']>=before['sparks'] and left['caught']==2,(d['id'],left)
 page.wait_for_function(GONE,timeout=5000);assert page.evaluate(STATE,d['id'])['earned']==before['earned']
 assert not errors,errors;page.close();return path
URL=''
def start():
 global URL;s=serve();URL=f'http://127.0.0.1:{s.server_port}/';return s
