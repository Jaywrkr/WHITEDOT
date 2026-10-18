"""Movement-only portals/places and an optional world-text setting in real Chrome."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
def walk(page,x,y):
 for axis,target in [('x',x),('y',y)]:
  value=page.evaluate('axis=>__r.activityState.player?.[axis]',axis)
  if value is None:return
  if abs(value-target)<.2:continue
  key=('ArrowRight' if value<target else 'ArrowLeft') if axis=='x' else ('ArrowDown' if value<target else 'ArrowUp')
  page.keyboard.down(key)
  page.wait_for_function('p=>!__r.activityActive||(p.positive?__r.activityState.player[p.axis]>=p.target-.2:__r.activityState.player[p.axis]<=p.target+.2)',arg={'axis':axis,'target':target,'positive':value<target})
  page.keyboard.up(key)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);page.set_default_timeout(15000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.activityWorldTick');page.locator('#returnContinue').click();page.locator('#hcGo').click()
  page.evaluate('''async()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'activity:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();const {activityCell}=await import('/src/universe-activities-model.js');const sites={};for(let x=-120;x<120&&Object.keys(sites).length<30;x++)for(let y=-120;y<120&&Object.keys(sites).length<30;y++)for(const o of activityCell(x,y,r.seedOf))sites[o.kind]||=o;window.sites=sites;if(Object.keys(sites).length!==30)throw Error('Missing activity types');}''')
  page.evaluate('()=>{const p=sites.orchestra;__r.S.wx=p.x;__r.S.wy=p.y;window.balance=__r.S.sparks;window.worldPoint={x:p.x,y:p.y};}')
  page.wait_for_function('__r.activityActive');assert page.evaluate('__r.activityState.kind')=='orchestra'
  nodes=page.evaluate('__r.activityState.level.nodes')
  for node in nodes:walk(page,node['x'],node['y'])
  page.wait_for_function('__r.activityState.player.done');assert page.evaluate('__r.S.sparks')==page.evaluate('balance+5');assert page.evaluate('__r.S.wx===worldPoint.x&&__r.S.wy===worldPoint.y')
  page.screenshot(path=str(ROOT.parent/'activity-orchestra-390.png'))
  page.locator('#bMenu').click();page.locator('#bSettings').click();before=page.evaluate('__r.activityState.player.time');page.wait_for_timeout(200);assert page.evaluate('__r.activityState.player.time')==before
  page.locator('#universeTexts').uncheck();assert page.evaluate('__r.S.universeTexts') is False;assert page.evaluate('document.body.classList.contains("universe-texts-off")')
  page.locator('#settingsClose').click();page.screenshot(path=str(ROOT.parent/'activity-no-text-390.png'))
  exit=page.evaluate('__r.activityState.level.exit');walk(page,exit['x'],exit['y']);page.wait_for_function('!__r.activityActive')
  # A save warning must remain visible with world prose hidden.
  page.evaluate("()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota fixture')};__r.save();}")
  page.wait_for_function('document.getElementById("toast").dataset.detail==="save"&&getComputedStyle(document.getElementById("toast")).visibility==="visible"')
  page.evaluate('()=>{Storage.prototype.setItem=originalSet;__r.save();}')
  from browser_helpers import keep_place_on_reload
  keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.activityWorldTick');page.locator('#returnContinue').click();assert page.evaluate('__r.S.universeTexts') is False
  assert page.evaluate('Object.values(__r.S.activities.done).filter(Boolean).length')==1
  if page.evaluate('__r.activityActive'):
   exit=page.evaluate('__r.activityState.level.exit');walk(page,exit['x'],exit['y']);page.wait_for_function('!__r.activityActive')
  # A real huge maze blocks wall tunnelling and permits walking back out.
  page.evaluate('''async()=>{const r=__r,{activityCell}=await import('/src/universe-activities-model.js');let o;for(let x=-120;x<120&&!o;x++)for(let y=-120;y<120&&!o;y++)o=activityCell(x,y,r.seedOf).find(q=>q.kind==='maze');window.maze=o;r.S.wx=o.x;r.S.wy=o.y;}''')
  page.wait_for_function('__r.activityState.kind==="maze"');assert page.evaluate('__r.activityState.level.n')==51
  page.keyboard.down('ArrowLeft');page.wait_for_timeout(300);page.keyboard.up('ArrowLeft');assert page.evaluate('__r.activityState.player.x')>=1.19
  page.screenshot(path=str(ROOT.parent/'activity-maze-390.png'));exit=page.evaluate('__r.activityState.level.exit');walk(page,exit['x'],exit['y']);page.wait_for_function('!__r.activityActive')
  assert not errors,errors;browser.close();print('PASS real cube-only orchestra completion, one-time payment, unchanged world position, menu pause, persistent text toggle/save warnings, 51x51 maze walls and free exit',flush=True)
finally:server.shutdown();server.server_close()
