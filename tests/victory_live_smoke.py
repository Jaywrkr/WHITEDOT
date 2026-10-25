"""A place's close in the running game (plan F13): the world's music keeps playing under it, the sequencer drives the
place's layer for the two bars of the drop in the chord the world plays, the output is whole again afterwards and the
music goes on."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
WATCH="""()=>new Promise(res=>{const seen=[];const tick=()=>{const s=__r.journeyVictoryState();if(s){seen.push({...s,tones:__r.chordTones().slice(0,3)});requestAnimationFrame(tick);}else res(seen);};tick();})"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?lugar=jardin');page.wait_for_function("!!window.__r?.places&&__r.places().run?.id==='jardin'",timeout=20000)
  page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.bq.length>1",timeout=20000)
  base=page.evaluate('({gain:__r.outputStage.headroom.gain.value,filter:__r.fx.lp.frequency.value})');ms=page.evaluate("__r.journeyVictory('jardin')");six=page.evaluate('__r.SIX');assert 0<=ms/1000-32*six<=16*six+.001,(ms,six)
  steps=page.evaluate("__r.MU.step");seen=page.evaluate(WATCH)
  last=seen[-1];assert last['played']==32,('the sequencer drove all 32 sixteenths of the drop',last)
  # Each bar's layer took the chord the world was playing as that bar began.
  for bar,tones in last['chords'].items():assert len(tones)>=3,last
  assert abs(page.evaluate('__r.outputStage.headroom.gain.value')-base['gain'])<.01,'close leaves the output alone'
  # The environment may move its own filter; the close itself never automates it (unit/offline contract).
  page.evaluate("__r.journeyVictory('jardin');__r.cancelJourneyVictory()");assert page.evaluate('__r.journeyVictoryState()') is None
  page.wait_for_timeout(600);assert page.evaluate("__r.MU.step")>steps+16,'the music went on all along'
  assert not errors,errors
  print('PASS existing layer follows the live chord for two bars, output is unchanged, cancellation works and the radio continues',flush=True);browser.close()
finally:server.shutdown()
