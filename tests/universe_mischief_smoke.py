"""Natural encounters completed through real cube keyboard motion and existing mining pulses."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading,math
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
def move(page,x,y):
 inverse={'x':False,'y':False}
 for attempt in range(350):
  p=page.evaluate('({x:__r.S.wx,y:__r.S.wy,done:!!__r.mischiefState.scene?.done})')
  if p['done']:return
  dx=x-p['x'];dy=y-p['y']
  if math.hypot(dx,dy)<13:return
  axis='x' if abs(dx)>abs(dy) else 'y';delta=dx if axis=='x' else dy
  positive=(delta>0)!=inverse[axis];key=('ArrowRight' if positive else 'ArrowLeft') if axis=='x' else ('ArrowDown' if positive else 'ArrowUp')
  page.keyboard.down(key);page.wait_for_timeout(55 if abs(delta)<28 else 85);page.keyboard.up(key)
  after=page.evaluate('({x:__r.S.wx,y:__r.S.wy})')
  if (after[axis]-p[axis])*delta<-.1:inverse[axis]=not inverse[axis]
 raise AssertionError(('Could not walk to',x,y,page.evaluate('({x:__r.S.wx,y:__r.S.wy,scene:__r.mischiefState.scene?.kind})')))
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});page.set_default_timeout(30000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.mischiefTick');page.locator('#returnContinue').click();page.locator('#hcGo').click()
  fixtures=page.evaluate('''async()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();const {mischiefCell}=await import('/src/universe-mischief-model.js'),{crystalField}=await import('/src/crystal-sparks.js'),{totemCell}=await import('/src/sculpture-totems-model.js');const out={};for(let x=-90;x<90;x++)for(let y=-90;y<90;y++){for(const o of mischiefCell(x,y,r.seedOf)){if(out[o.kind]||o.kind==='dance'||r.regionOfPos(o.x,o.y).sea)continue;if(o.kind==='helper'){const t=crystalField(o.x,o.y,r.seedOf).filter(p=>p.size===3&&Math.hypot(p.x-o.x,p.y-o.y)<450).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0];if(!t||t.runner)continue;}out[o.kind]=o;}if(!out.dance)for(const t of totemCell(x,y,r.seedOf))if(!r.regionOfPos(t.x,t.y).sea){out.dance={id:'mischief:'+t.id,kind:'dance',x:t.x,y:t.y};break;}if(Object.keys(out).length===10)break;}return out;}''')
  assert len(fixtures)==10,fixtures
  cases=os.environ.get('WHITEDOT_MISCHIEF_CASES','rain,imitator,shadow,race,breath,twin,farewell,audience,dance,helper').split(',')
  for kind in cases:
   o=fixtures[kind];page.evaluate('''o=>{const r=__r;const state=structuredClone(r.S);state.wx=o.x+(o.kind==='dance'?65:0);state.wy=o.y;state.sound=false;r.S=state;r.stopAutopilot?.();for(const k of Object.keys(r.keys))r.keys[k]=false;r.ptr=null;}''',o)
   page.wait_for_function('kind=>__r.mischiefState.scene?.kind===kind',arg=kind)
   o['id']=page.evaluate('__r.mischiefState.scene.id')
   if kind=='dance':
    target=page.evaluate('__r.mischiefState.scene.target');o['x']=target['x'];o['y']=target['y'];move(page,o['x']+65,o['y'])
   page.screenshot(path=str(ROOT.parent/f'mischief-{kind}-390.png'))
   if kind=='rain':
    page.locator('#bMenu').click();age=page.evaluate('__r.mischiefState.scene.age');page.wait_for_timeout(350);assert page.evaluate('__r.mischiefState.scene.age')==age;page.locator('#mnClose').click()
    for q in page.evaluate('__r.mischiefState.scene.drops'):move(page,q['x'],q['y'])
   elif kind=='imitator':
    for dx,dy in [(70,0),(70,70),(-30,70),(-30,-25)]:move(page,o['x']+dx,o['y']+dy)
    page.wait_for_function('__r.mischiefState.scene?.done')
   elif kind=='shadow':
    page.wait_for_function('__r.mischiefState.scene?.stage===2')
    drops=page.evaluate('__r.mischiefState.scene.drops')
    for i in [0,2,4]:move(page,drops[i]['x'],drops[i]['y'])
    q=page.evaluate('__r.mischiefState.scene.actor');move(page,q['x'],q['y'])
   elif kind=='race':
    page.wait_for_timeout(4000);q=page.evaluate('__r.mischiefState.scene.goal');move(page,q['x'],q['y'])
   elif kind=='breath':
    page.wait_for_function('__r.mischiefState.scene.held>8.1');move(page,o['x']+135,o['y'])
   elif kind=='twin':
    page.wait_for_function('__r.mischiefState.scene.stage===2');move(page,o['x']+110,o['y']);page.wait_for_function('__r.mischiefState.scene.stage===3')
    for q in page.evaluate('__r.mischiefState.scene.drops'):move(page,q['x'],q['y'])
   elif kind=='farewell':
    move(page,o['x']+120,o['y']);move(page,o['x']+1200,o['y'])
   elif kind=='audience':
    page.wait_for_function('__r.mischiefState.scene.stage===1&&__r.mischiefState.scene.still>5.1')
    move(page,o['x']+110,o['y'])
    for i in range(1,23):
     a=i*math.tau/20;move(page,o['x']+math.cos(a)*110,o['y']+math.sin(a)*110)
    assert page.evaluate('__r.mischiefState.scene.orbitNote'), 'the procession really orbits after circling'
    page.screenshot(path=str(ROOT.parent/'mischief-procession-orbit-390.png'))
   elif kind=='dance':
    for i in range(1,27):
     a=i*math.tau/20;move(page,o['x']+math.cos(a)*65,o['y']+math.sin(a)*65)
   elif kind=='helper':
    page.wait_for_function('__r.mischiefState.scene.stage===2');q=page.evaluate('__r.mischiefState.scene.target');move(page,q['x'],q['y']-20)
    for i in range(3):page.mouse.click(25,422);page.wait_for_timeout(900)
    page.wait_for_function('id=>__r.savedCrystal(id)?.broken',arg=q['id'])
   page.wait_for_function('id=>!!__r.S.mischief.done[id]',arg=o['id']);assert page.evaluate('kind=>__r.S.mischief.counts[kind]',kind)==1
   print('PASS natural '+kind+' keyboard/contact completion',flush=True)
  page.wait_for_function('Object.keys(__r.S.ach).some(id=>id.startsWith("adventure:"))');assert page.evaluate('__r.ACH.length')==370
  page.locator('#bMenu').click();page.locator('#bAch').click();page.evaluate('__r.openJournal("achievements")');assert 'Logros' in page.locator('#journalBody').inner_text();assert page.locator('#mJournal .sheet').evaluate('e=>e.scrollWidth<=e.clientWidth+2');page.screenshot(path=str(ROOT.parent/'mischief-achievements-390.png'))
  page.locator('#mJournal .sheet-close').click()
  count=page.evaluate('Object.keys(__r.S.mischief.done).length');assert count==len(cases)
  from browser_helpers import keep_place_on_reload
  keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.mischiefTick');page.locator('#returnContinue').click();assert page.evaluate('Object.keys(__r.S.mischief.done).length')==count
  assert not errors,errors;browser.close();print('PASS '+str(len(cases))+' natural scenes, existing real mining, native sculpture orbit, menu pause, persisted claims/reload and 370-entry journal',flush=True)
finally:server.shutdown();server.server_close()
