"""Plan F3 and H5: in the free World a pulse on time doubles the sparks of what it breaks (shown ×2 in gold), from the eighth in a row it triples them, off time it earns its base value (K2), and without sound there is no multiplier."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os, threading
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
ON="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq,bar=r.SIX*4;if(ac&&bq.length){const last=bq[bq.length-1],next=last>ac.currentTime?last:last+bar*Math.ceil((ac.currentTime-last)/bar),own=r.journeyRhythmTarget?.(ac.currentTime),d=own?(own.hit?own.hit.dist:1):Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)),Math.abs(next-ac.currentTime));if(d<.02){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
OFF="""()=>new Promise(res=>{const r=__r;const tick=()=>{const ac=r.ac,bq=r.MU.bq;if(ac&&bq.length){const d=Math.min(...bq.map(b=>Math.abs(ac.currentTime-b)));if(d>r.SIX*1.6){r.sonar('player');return res(d);}}requestAnimationFrame(tick);};tick();})"""
PICK="""(size)=>{const r=__r;r.crystalTick(.02);const o=r.crystalState.near.find(o=>o.size===size&&!o.runner&&!o.rare&&!o.hits&&!o.broken&&!(window.used||[]).includes(o.id));if(!o)return null;(window.used||=[]).push(o.id);r.S.wx=o.x;r.S.wy=o.y-45;return o;}"""
def mine(page,size,pulse):
 # A wave or a chain of breaks still spreading from the last pulse would break the next crystal before its own pulse.
 page.wait_for_function('!(__r.waves||[]).length',timeout=5000);page.wait_for_timeout(900)
 o=page.evaluate(PICK,size);assert o,'no crystal fixture'
 page.wait_for_timeout(500);before=page.evaluate('__r.S.sparks')
 for i in range(size):page.evaluate(pulse);page.wait_for_timeout(700)
 page.wait_for_function(f"__r.crystalState.near.find(o=>o.id==='{o['id']}')?.collected",timeout=8000)
 return o,page.evaluate('__r.S.sparks')-before,page.evaluate(f"__r.sparkEconomy.sites['{o['id']}'].mult??1")
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=laboratorio&layout=wide&generation=2&travel=1');page.wait_for_function('!!window.__r?.crystalTick')
  page.evaluate("()=>{const r=__r;r.S.sound=true;r.S.firstJourney.skipped=true;r.S.wx=5000;r.S.wy=5200;r.stopAutopilot?.();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.audio();}")
  page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=10000)
  # K2: an off-time break still pays the base value; rhythm adds a bonus.
  o,gain,m=mine(page,1,OFF);assert m==1 and gain>=o['value'],(gain,m,o)
  # On time: double, kept in the save, and the pickup says ×2.
  o,gain,m=mine(page,1,ON);assert m==2 and gain>=2*o['value'],(gain,m,o)
  # Eight on time in a row: triple.
  for i in range(7):page.evaluate(ON);page.wait_for_timeout(330)
  assert page.evaluate('__r.sparkStreak()')>=7
  o,gain,m=mine(page,1,ON);assert m==3 and gain>=3*o['value'],(gain,m,o,page.evaluate('__r.sparkStreak()'))
  # Without sound there is no beat: no multiplier.
  page.evaluate("()=>{__r.S.sound=false;}");o,gain,m=mine(page,1,"()=>__r.sonar('player')");assert m==1 and gain>=o['value'],(gain,m,o)
  assert not errors,errors;browser.close()
 print('PASS spark rhythm: off time a crystal pays its base value, on time it is worth double (saved), from eight in a row triple, without sound no multiplier',flush=True)
finally:server.shutdown()
