"""Read real scheduler metadata and record two valid pulses on separate bars."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
PULSE='''min=>new Promise(resolve=>{const r=__r;function tick(){const now=r.ac.currentTime-Math.min(.4,r.ac.outputLatency||r.ac.baseLatency||0),target=r.journeyRhythmTarget(now)?.hit;if(target&&target.step===2&&target.dist<.015&&target.time>=min){r.sonar('player');resolve(target.time);}else requestAnimationFrame(tick);}tick();})'''
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);p=b.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?lugar=lago');p.wait_for_function('__r?.placeRun()?.id==="lago"')
  p.evaluate("()=>{__r.S.sound=true;__r.audio();document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}");p.wait_for_function('__r.ac?.state==="running"&&__r.MU.sq.length>2')
  p.wait_for_function('!__r.rhythmDemo()',timeout=15000)  # Panel 11 (Q2): the round counts after the place sings.
  first=p.evaluate(PULSE,0);p.evaluate(PULSE,first+.5)
  timing=p.evaluate('({steps:__r.S.lugares.run.noteSteps,ticks:__r.S.lugares.run.noteTicks,sq:__r.MU.sq})')
  assert len(timing['ticks'])>=2 and timing['ticks'][-1]>timing['ticks'][-2] and timing['ticks'][-1]-timing['ticks'][-2]>=16,timing
  assert timing['steps'][-2:]==[2,2],timing
  assert all(e['tick']%16==e['s'] for e in timing['sq']),timing
  assert not errors,errors;b.close()
 print('PASS real transport: repeated step across bars retains increasing absolute ticks and judged step',flush=True)
finally:srv.shutdown();srv.server_close()
