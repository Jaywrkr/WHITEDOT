"""Natural sculpture encounters, reference-like gradients, existing cards and finite daily rewards."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
def pulse_stack(page,site,height):
 for _ in range(3):
  page.wait_for_function('id=>{const o=__r.totemNear().find(o=>o.id===id);return o&&__r.totemState.clock-(o.last??-10)>=.72;}',arg=site)
  previous=page.evaluate('id=>__r.totemNear().find(o=>o.id===id).last??-10',site)
  page.mouse.click(25,height/2)
  page.wait_for_function('p=>__r.totemNear().find(o=>o.id===p.id)?.last>p.last',arg={'id':site,'last':previous})
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.totemTick')
   page.locator('#returnContinue').click();page.locator('#hcGo').click()
   page.evaluate('''async()=>{const r=__r;r.S.sound=false;r.S.firstJourney.skipped=true;r.S.pathCrystals=Array.from({length:10},(_,i)=>'totem:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.noticeLane.quietRoutine();const {totemCell,TOTEMS}=await import('/src/sculpture-totems-model.js'),{crystalField}=await import('/src/crystal-sparks.js');const fixtures={};for(let x=-30;x<=30;x++)for(let y=-30;y<=30;y++){const a=totemCell(x,y,r.seedOf);if(a.length>1&&!fixtures.group)fixtures.group=a;if(a.length!==1)continue;const o=a[0];if(crystalField(o.x,o.y,r.seedOf).some(c=>Math.hypot(c.x-o.x,c.y-o.y)<220))continue;fixtures[TOTEMS[o.kind].action]||=o;}if(!fixtures.stack||!fixtures.orb||!fixtures.guide||!fixtures.group)throw Error('Missing natural sculptures');window.fixtures=fixtures;r.S.wx=fixtures.stack.x;r.S.wy=fixtures.stack.y-50;window.balance=r.S.sparks;}''')
   page.wait_for_timeout(600)
   pulse_stack(page,page.evaluate('fixtures.stack.id'),height)
   page.wait_for_function('__r.S.sparks===balance+2')
   assert page.evaluate('__r.S.rareBook.items.some(c=>c.type==="totem:"+fixtures.stack.kind&&!c.forced)')
   page.screenshot(path=str(ROOT.parent/f'totem-stack-{width}.png'))
   stack_id=page.evaluate('fixtures.stack.id');stack_kind=page.evaluate('fixtures.stack.kind')
   from browser_helpers import keep_place_on_reload
   keep_place_on_reload(page);page.reload();page.wait_for_function('!!window.__r?.totemTick');page.locator('#returnContinue').click()
   before=page.evaluate('__r.S.sparks')
   pulse_stack(page,stack_id,height)
   page.wait_for_function('id=>__r.totemNear().find(o=>o.id===id)?.done>0',arg=stack_id)
   assert page.evaluate('__r.S.sparks')==before
   assert page.evaluate('kind=>__r.S.rareBook.items.filter(c=>c.type==="totem:"+kind).length',stack_kind)==1
   # Locate the remaining fixtures again, through the same independent generator.
   page.evaluate('''async()=>{const r=__r,{totemCell,TOTEMS}=await import('/src/sculpture-totems-model.js'),{crystalField}=await import('/src/crystal-sparks.js');window.fixtures={};for(let x=-30;x<=30;x++)for(let y=-30;y<=30;y++){const a=totemCell(x,y,r.seedOf);if(a.length>1&&!fixtures.group)fixtures.group=a;if(a.length!==1)continue;const o=a[0];if(crystalField(o.x,o.y,r.seedOf).some(c=>Math.hypot(c.x-o.x,c.y-o.y)<220))continue;fixtures[TOTEMS[o.kind].action]||=o;}r.S.wx=fixtures.orb.x;r.S.wy=fixtures.orb.y-50;window.balance=r.S.sparks;}''')
   page.wait_for_timeout(600);page.mouse.click(25,height/2);page.wait_for_function('__r.totemNear().find(o=>o.id===fixtures.orb.id)?.ball')
   page.wait_for_timeout(850)
   for _ in range(50):
    info=page.evaluate('''()=>{const o=__r.totemNear().find(o=>o.id===fixtures.orb.id);if(o.done)return {done:true};const b=o.ball;return {dx:o.x+b.direction*55-__r.S.wx,dy:o.y-10-__r.S.wy};}''')
    if info.get('done'):break
    if abs(info['dx'])>abs(info['dy']):key='ArrowRight' if info['dx']>0 else 'ArrowLeft'
    else:key='ArrowDown' if info['dy']>0 else 'ArrowUp'
    page.keyboard.down(key);page.wait_for_timeout(100);page.keyboard.up(key)
   page.wait_for_function('__r.S.sparks===balance+2')
   assert page.evaluate('__r.S.rareBook.items.some(c=>c.type==="totem:"+fixtures.orb.kind)')
   page.evaluate('''()=>{const p=fixtures.guide;__r.S.wx=p.x;__r.S.wy=p.y-50;window.balance=__r.S.sparks;}''')
   page.wait_for_timeout(600);page.mouse.click(25,height/2);page.wait_for_function('__r.S.sparks===balance+2')
   assert page.evaluate('__r.totemNear().find(o=>o.id===fixtures.guide.id).target!==undefined')
   page.screenshot(path=str(ROOT.parent/f'totem-guide-{width}.png'))
   # Group reply is player-triggered, bounded and silent when muted.
   page.evaluate('''()=>{const p=fixtures.group[0];__r.S.wx=p.x;__r.S.wy=p.y-40;__r.S.sound=true;__r.audio();window.notes=[];__r.totemNoteCue=n=>notes.push(n);}''')
   page.wait_for_timeout(700);page.mouse.click(25,height/2);page.wait_for_function('notes.length>=2')
   page.wait_for_timeout(300);assert page.evaluate('notes.length')<=3
   page.screenshot(path=str(ROOT.parent/f'totem-group-{width}.png'))
   page.evaluate('__r.S.sound=false;notes.length=0');page.wait_for_timeout(800);page.mouse.click(25,height/2);page.wait_for_timeout(900);assert page.evaluate('notes.length')==0
   # The book uses the same coloured forms, without opening a new UI.
   assert page.evaluate('''async()=>{const {rarePortrait}=await import('/src/rare-card-art.js');return __r.S.rareBook.items.filter(c=>c.type.startsWith('totem:')).every(c=>rarePortrait(c).includes('linearGradient'));}''')
   page.evaluate('__r.openJournal("rares")')
   assert page.locator('.rare-portrait svg .rare-glyph path').count()>0
   assert page.locator('.rare-portrait svg .rare-glyph path').first.evaluate('e=>getComputedStyle(e).fill').startswith('url(')
   page.screenshot(path=str(ROOT.parent/f'totem-cards-{width}.png'))
   page.locator('#journalClose').click()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert not errors,errors
   if width==1280:
    page.evaluate('''async()=>{const {TOTEM_KINDS}=await import('/src/sculpture-totems-model.js'),{drawTotem}=await import('/src/sculpture-totems-art.js');const canvas=document.createElement('canvas');canvas.id='testGallery';canvas.width=1200;canvas.height=430;canvas.style='position:fixed;inset:0;z-index:99999;background:black';document.body.append(canvas);const c=canvas.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,1200,430);for(const [i,kind]of TOTEM_KINDS.entries()){c.save();c.translate(110+i*195,350);c.scale(2.6,2.6);drawTotem(c,{kind},{light:0,still:true});c.restore();}}''')
    page.locator('#testGallery').screenshot(path=str(ROOT.parent/'totem-forms.png'))
   print(f'PASS {width}: natural sparse solo/group sculptures, three gestures, daily payout/card once after reload, real limited group reply, mute and gradient portraits',flush=True)
   page.close()
  browser.close()
finally:server.shutdown();server.server_close()
