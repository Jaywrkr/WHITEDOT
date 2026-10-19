from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,math
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
 for width,height in [(390,844),(844,390),(1280,800)]:
  context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
  page=context.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  def visit(kind):
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=deep-lab&encounter={kind}')
   page.wait_for_function(f'window.__testRuntime?.encounterObjects.some(o=>o.id==="preview:{kind}")')
   page.evaluate(f"window.deepObject=__testRuntime.encounterObjects.find(o=>o.id==='preview:{kind}');document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
   return {'x':width/2+100,'y':height/2}
  def drag(a,b):page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=10);page.mouse.up();page.wait_for_timeout(80)
  center=visit('weaver');before=page.evaluate('({x:__testRuntime.S.wx,y:__testRuntime.S.wy})')
  anchors=page.evaluate('__testRuntime.depthAnchors(deepObject).slice(0,3).map(a=>({x:a.x-__testRuntime.S.wx+innerWidth/2,y:a.y-__testRuntime.S.wy+innerHeight/2}))')
  drag(anchors[0],anchors[1]);assert page.evaluate('deepObject.state.weave.edges.length')==1
  page.touchscreen.tap(anchors[1]['x'],anchors[1]['y']);page.touchscreen.tap(anchors[2]['x'],anchors[2]['y']);assert page.evaluate('deepObject.state.weave.edges.length')==2
  assert page.evaluate('!!__testRuntime.S.ach.tejidoVivo')
  mid={'x':(anchors[0]['x']+anchors[1]['x'])/2,'y':(anchors[0]['y']+anchors[1]['y'])/2};page.touchscreen.tap(mid['x'],mid['y']);assert page.evaluate('deepObject.state.weave.edges.length')==1
  page.mouse.move(anchors[0]['x'],anchors[0]['y']);page.mouse.down();page.mouse.move(anchors[2]['x'],anchors[2]['y']);page.evaluate("document.getElementById('w').dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,bubbles:true}))");page.mouse.up();assert page.evaluate('deepObject.state.weave.edges.length')==1
  assert page.evaluate(f'Math.hypot(__testRuntime.S.wx-{before["x"]},__testRuntime.S.wy-{before["y"]})<1')
  page.screenshot(path=f'/tmp/whitedot-depth-weaver-{width}.png')
  center=visit('box');page.touchscreen.tap(center['x'],center['y']);page.wait_for_timeout(80)
  assert page.evaluate('deepObject.state.a>.65');initial=page.evaluate('deepObject.state.box.parts[0].steps[0]')
  page.touchscreen.tap(center['x'],center['y']-92);assert page.evaluate('deepObject.state.box.parts[0].steps[0]')!=initial
  original=page.evaluate('JSON.stringify(deepObject.state.box)')
  a={'x':center['x'],'y':center['y']-92};b={'x':center['x']+48,'y':center['y']-65}
  page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=8);page.evaluate("document.getElementById('w').dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,bubbles:true}))");page.mouse.up();assert page.evaluate('JSON.stringify(deepObject.state.box)')==original
  drag({'x':center['x']-28,'y':center['y']+20},{'x':center['x'],'y':center['y']-28});assert page.evaluate('deepObject.state.box.parts[2].id')=='bass'
  page.touchscreen.tap(center['x']+28,center['y']+20);page.touchscreen.tap(center['x']+26,center['y']-85);assert page.evaluate('!!__testRuntime.S.ach.cajaEditable')
  page.mouse.move(center['x']+28,center['y']+20);page.mouse.down();page.wait_for_timeout(600);page.mouse.up();assert not page.evaluate('deepObject.state.box.parts[1].enabled');assert not page.evaluate('__testRuntime.depthGate(2)');assert not page.evaluate('__testRuntime.scanning')
  page.screenshot(path=f'/tmp/whitedot-depth-box-{width}.png')
  saved=page.evaluate('JSON.stringify(deepObject.state.box)');page.touchscreen.tap(center['x'],center['y']+56);assert page.evaluate('deepObject.state.a<.65'),page.evaluate('({a:deepObject.state.a,engaged:__testRuntime.depthEngaged,other:__testRuntime.encounterEngaged,target:document.elementFromPoint(innerWidth/2+100,innerHeight/2+56)?.id,point:{x:deepObject.x-__testRuntime.S.wx,y:deepObject.y-__testRuntime.S.wy},near:__testRuntime.encounterObjects.map(o=>({kind:o.kind,x:o.x-__testRuntime.S.wx,y:o.y-__testRuntime.S.wy}))})');page.touchscreen.tap(center['x'],center['y']);assert page.evaluate('JSON.stringify(deepObject.state.box)')==saved
  # The former box is fixed terrain: standing awakens it, rest stays respected.
  page.evaluate("""()=>{const r=__testRuntime,o=deepObject;r.S.wx=o.x+10;r.S.wy=o.y;r.MU.speed=0;o.state.a=.15;o.state.rested=false;o.state.charge=.6;r.depthTick(o,.1);if(o.state.a<.65)throw Error('standing did not awaken ground');}""")
  page.touchscreen.tap(width/2-10,height/2+56)
  page.evaluate("""()=>{const r=__testRuntime,o=deepObject;r.depthTick(o,.1);if(o.state.a>.65||!o.state.rested)throw Error('rest reopened while standing');r.S.wx=o.x+210;r.depthTick(o,.1);if(o.state.a>.65||o.state.rested)throw Error('ground must rest after leaving');r.S.wx=o.x+10;o.state.charge=.6;r.depthTick(o,.1);if(o.state.a<.65)throw Error('return did not awaken ground');}""")
  center=visit('animal');page.touchscreen.tap(center['x'],center['y']);page.wait_for_timeout(100)
  before_voice=page.evaluate('deepObject.state.a')
  page.mouse.move(center['x'],center['y']);page.mouse.down();page.wait_for_timeout(600);page.mouse.up()
  assert page.evaluate('deepObject.state.a')!=before_voice
  assert page.evaluate('deepObject.state.dialogue.phase')=='listening','changing voice should preserve lesson'
  page.wait_for_timeout(1800);assert page.evaluate('deepObject.state.dialogue.elapsed')==0,'lesson timer must wait for first player note'
  assert page.evaluate('deepObject.state.dialogue.phase')=='listening';assert not page.evaluate('__testRuntime.scanning')
  page.evaluate("const r=__testRuntime;r.playVoice('pulso',0,r.ac.currentTime+.05,r.regionOfPos(r.S.wx,r.S.wy),false,.1,null,'ambient')")
  assert page.evaluate('deepObject.state.dialogue.events.length')==0,'ambient must not teach'
  page.mouse.click(30,height/2);page.wait_for_function('deepObject.state.dialogue.events.length>0');page.evaluate('deepObject.state.dialogue.events=[]')
  # One event-loop turn keeps the harmonic center stable for this exact interval assertion.
  page.evaluate("()=>{const r=__testRuntime;for(const [step,degree]of [[0,0],[4,2],[12,4],[24,2]]){deepObject.state.dialogue.elapsed=r.SIX*step;r.playVoice('pulso',degree,r.ac.currentTime+.05,r.regionOfPos(r.S.wx,r.S.wy),false,.1,null,'player');}document.getElementById('bMenu').click();}")
  assert page.evaluate('deepObject.state.dialogue.events.length')==4
  taught=page.evaluate('deepObject.state.dialogue.events');assert [(n['degree']-taught[0]['degree'])%7 for n in taught]==[0,2,4,2],taught
  # Pause in the teaching turn; a delayed automation click can cross the idle timeout.
  assert page.evaluate('deepObject.state.dialogue.phase')=='listening'
  frozen=page.evaluate('deepObject.state.dialogue.elapsed');page.wait_for_timeout(300);assert page.evaluate('deepObject.state.dialogue.elapsed')==frozen;page.locator('#mnClose').click()
  # Waiting is the automatic-response gesture. A late tap may start a new lesson.
  page.wait_for_function('deepObject.state.dialogue.phase==="replying"')
  assert page.evaluate('deepObject.state.dialogue.phrase.map(n=>n.index)')==[0,2,4,2],page.evaluate('({phrase:deepObject.state.dialogue.phrase,events:deepObject.state.dialogue.events})')
  emitted=page.evaluate("""()=>{const r=__testRuntime,ac=r.ac,old=ac.createOscillator.bind(ac);let n=0;ac.createOscillator=()=>{n++;return old();};r.encounterBar(ac.currentTime+.1,2000);ac.createOscillator=old;return n;}""")
  assert emitted>0,'learned answer must actually emit audio';assert page.evaluate('!!__testRuntime.S.ach.respuestaAnimal')
  page.touchscreen.tap(center['x'],center['y']);assert page.evaluate('deepObject.state.dialogue.phase')=='listening'
  # Test the manual reply handler atomically, before its independent idle timer.
  page.evaluate("()=>{const r=__testRuntime,d=deepObject.state.dialogue;for(const [step,index]of [[0,0],[4,2]]){d.elapsed=r.SIX*step;r.playVoice('pulso',index,r.ac.currentTime+.05,r.regionOfPos(r.S.wx,r.S.wy),false,.1,null,'player');}if(!r.depthTap(deepObject,0))throw Error('manual reply gesture rejected');}")
  assert page.evaluate('deepObject.state.dialogue.phase')=='replying'
  assert page.evaluate('deepObject.state.dialogue.phrase.map(n=>n.index)')==[0,2]
  page.touchscreen.tap(center['x'],center['y']);assert page.evaluate('deepObject.state.dialogue.phase')=='listening'
  page.mouse.click(30,height/2);page.wait_for_function('deepObject.state.dialogue.events.length>0')
  page.wait_for_function('deepObject.state.dialogue.phase==="replying"')
  page.touchscreen.tap(center['x'],center['y']);page.touchscreen.tap(center['x'],center['y']);assert page.evaluate('deepObject.state.dialogue.phase')=='idle';assert page.evaluate('deepObject.state.dialogue.empty')
  page.screenshot(path=f'/tmp/whitedot-depth-animal-{width}.png')
  page.locator('#bMenu').click();page.locator('#bAch').click();page.locator('[data-journal-detail="Tu recorrido creativo"] > summary').click();assert 'Frases respondidas' in page.locator('#journalBody').inner_text()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print(f'PASS {width}x{height}: free threads, removal/cancellation, editable box parts, learned phrase, silent ambient exclusion, pause and real reply audio',flush=True)
  context.close()
 browser.close()
server.shutdown()
