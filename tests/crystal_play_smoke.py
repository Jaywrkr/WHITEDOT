"""Real pulse/chase flow with seeded variants, persistent partial payouts and music-clock visuals."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.sparkTick')
   page.locator('#returnContinue').click();page.locator('#hcGo').click()
   page.evaluate('''async()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.help.mundo=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'play:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.noticeLane.quietRoutine();const {crystalField}=await import('/src/crystal-sparks.js');let runner=null,rare=null,chain=null;for(let i=0;i<500&&!(runner&&rare&&chain);i++){const field=crystalField(i*1200,0,r.seedOf);runner||=field.find(p=>p.runner&&p.size===2&&field.every(o=>o.id===p.id||Math.hypot(o.x-p.x,o.y-p.y)>400));rare||=field.find(p=>p.rare&&!p.runner&&p.size===3&&field.every(o=>o.id===p.id||Math.hypot(o.x-p.x,o.y-p.y)>245));if(!chain)for(const a of field.filter(p=>p.size===1)){const b=field.find(p=>p.id!==a.id&&Math.hypot(p.x-a.x,p.y-a.y)<230);if(b){chain={root:a,neighbor:b};break;}}}if(!(runner&&rare&&chain))throw Error('Missing natural variant fixtures');window.fixtures={runner,rare,chain};r.S.wx=runner.x;r.S.wy=runner.y-40;}''')
   page.wait_for_timeout(600);page.mouse.click(25,height/2);page.wait_for_function('__r.savedCrystal(fixtures.runner.id)?.hits===1')
   page.wait_for_timeout(500)
   runner=page.evaluate('__r.crystalState.near.find(o=>o.id===fixtures.runner.id).run')
   assert page.evaluate('p=>Math.hypot(p.x-fixtures.runner.x,p.y-fixtures.runner.y)>15',runner)
   page.screenshot(path=str(ROOT.parent/f'runner-{width}.png'))
   # A later pulse catches it; no extra control is introduced.
   page.evaluate('()=>{const p=__r.crystalState.near.find(o=>o.id===fixtures.runner.id).run;__r.S.wx=p.x;__r.S.wy=p.y-25;}')
   page.wait_for_timeout(500);page.mouse.click(25,height/2);page.wait_for_function('__r.savedCrystal(fixtures.runner.id).broken')
   page.evaluate('''()=>{const r=__r,p=fixtures.rare;r.S.wx=p.x;r.S.wy=p.y-50;r.S.sparks=19;r.sparkEconomy.spent=0;r.sparkEconomy.earned=19;r.save();}''')
   page.wait_for_timeout(600)
   for _ in range(3):page.mouse.click(25,height/2);page.wait_for_timeout(900)
   page.wait_for_function('__r.savedCrystal(fixtures.rare.id)?.broken')
   page.wait_for_timeout(1600)
   assert page.evaluate('__r.S.sparks')==31,'ordinary shards pay twelve (four ×3, H1); the rare shard remains to chase'
   assert not page.evaluate('__r.savedCrystal(fixtures.rare.id).collected')
   # Jay (alpha.230): «Otro paisaje» waits for the eleven places of the ring; then it is there.
   page.wait_for_timeout(300);assert page.locator('#bJump').is_hidden(),'no jump before the eleven places'
   page.evaluate("(()=>{const d=__r.placesData();for(const k of Object.keys(d.stars))d.stars[k][0]=true;__r.save();})()");page.wait_for_function("!document.getElementById('bJump').hidden",timeout=3000);assert page.locator('#bJump').is_visible()
   # Panel 11 (Q1, D10-B): ✦ stays legible but never larger than ★ (the HUD's three numbers share 11 px).
   assert page.locator('#sparkCount').evaluate("e=>{const t=document.querySelector('.hud-tally');return parseFloat(getComputedStyle(e).fontSize)===parseFloat(getComputedStyle(t).fontSize)&&parseFloat(getComputedStyle(e).fontSize)>=11}")
   assert page.evaluate('()=>{const p=__r.crystalState.near.find(o=>o.id===fixtures.rare.id).particles.find(p=>p.rare);return Math.hypot(p.x-fixtures.rare.x,p.y-fixtures.rare.y)>40;}')
   page.screenshot(path=str(ROOT.parent/f'rare-shards-{width}.png'))
   rare_id=page.evaluate('fixtures.rare.id');mask=page.evaluate('__r.savedCrystal(fixtures.rare.id).fragments')
   from browser_helpers import keep_place_on_reload
   keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.sparkTick');page.locator('#returnContinue').click()
   assert page.evaluate('__r.S.sparks')==31
   assert page.evaluate('id=>__r.savedCrystal(id).fragments',rare_id)==mask
   # The rare fragment runs for five seconds: chase it straight away to keep its bonus.
   held=set()
   for _ in range(150):
    info=page.evaluate('''id=>{const s=__r.savedCrystal(id);if(s.collected)return {done:true};const o=__r.crystalState.near.find(p=>p.id===id),p=o?.particles?.find(p=>p.rare);if(!p)throw Error('Missing persisted rare fragment');return {dx:p.x-__r.S.wx,dy:p.y-__r.S.wy};}''',rare_id)
    if info.get('done'):break
    # Chase like a player: both arrows when the fragment is diagonal, one when it is straight ahead.
    want=set()
    if abs(info['dx'])>6:want.add('ArrowRight' if info['dx']>0 else 'ArrowLeft')
    if abs(info['dy'])>6:want.add('ArrowDown' if info['dy']>0 else 'ArrowUp')
    for k in held-want:page.keyboard.up(k)
    for k in want-held:page.keyboard.down(k)
    held=want
    page.wait_for_timeout(40)
   for k in held:page.keyboard.up(k)
   page.wait_for_function('id=>__r.savedCrystal(id).collected',arg=rare_id)
   assert page.evaluate('__r.S.sparks')==43,'the cian fragment pays one plus three bonus sparks, ×3 since H1'
   before=page.evaluate('__r.S.sparks');keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.sparkTick');page.locator('#returnContinue').click();page.wait_for_timeout(300)
   assert page.evaluate('__r.S.sparks')==before
   # Find a natural adjacent pair again after reload; a single real pulse starts the chain.
   page.evaluate('''async()=>{const r=__r,{crystalField}=await import('/src/crystal-sparks.js');let pair=null;for(let i=0;i<100&&!pair;i++){const field=crystalField(i*1200,0,r.seedOf);for(const a of field.filter(p=>p.size===1&&!r.savedCrystal(p.id)?.broken)){const b=field.find(p=>p.id!==a.id&&!r.savedCrystal(p.id)?.hits&&Math.hypot(p.x-a.x,p.y-a.y)<230);if(b){pair={root:a,neighbor:b};break;}}}if(!pair)throw Error('No chain fixture');window.pair=pair;r.S.wx=pair.root.x;r.S.wy=pair.root.y-40;window.pulseCount=r.S.session.pulses;}''')
   page.wait_for_timeout(500);page.mouse.click(25,height/2)
   page.wait_for_function('__r.savedCrystal(pair.root.id)?.broken&&__r.savedCrystal(pair.neighbor.id)?.hits>0')
   assert page.evaluate('__r.S.session.pulses')==page.evaluate('pulseCount')+1,'chain impacts never generate more player pulses'
   # Breathing follows the actual running Web Audio beat, then fades on mute and reduced motion.
   page.evaluate('__r.S.sound=true;__r.audio()');page.wait_for_function('__r.ac?.state==="running"')
   samples=page.evaluate('''async()=>{const out=[];for(let i=0;i<150;i++){await new Promise(requestAnimationFrame);out.push({b:__r.worldBreath,beat:__r.beat(),opacity:__r.worldOpacity(120)});}return out;}''')
   assert max(p['beat'] for p in samples)>0 and max(p['b'] for p in samples)>.01
   assert all(0<=p['b']<=1 for p in samples)
   assert max(p['opacity'] for p in samples)-min(p['opacity'] for p in samples)>.001
   page.evaluate('__r.S.reducedMotion=true');page.wait_for_timeout(800);assert page.evaluate('__r.worldBreath')<.001
   page.evaluate('__r.S.reducedMotion=false;__r.S.sound=false');page.wait_for_timeout(800);assert page.evaluate('__r.worldBreath')<.001
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert not errors,errors
   print(f'PASS {width}: real runner pulses, visible rare escape, partial reload, keyboard chase/bonus once, chain, counter and real music-clock breathing',flush=True)
   page.close()
  browser.close()
finally:server.shutdown();server.server_close()
