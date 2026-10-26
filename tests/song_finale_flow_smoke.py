"""Panel 10 (P6, D5-A, Simogo): the round that completes the eleven places flows into the finale without pressing
anything. On ?lugar=cueva (the ten before it complete) a ★ round with sound closes: its drop plays at its tier (★ with
growth from its best share), no card opens in front, the stage opens by itself and its first bar starts less than a bar
after the drop ends. Under your phrases only the pad and the bass go on; the silence carries no words; the credits of
authorship come at the end. Closing the finale brings back the round's card."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
WATCH='''()=>{const r=__r;window.__flow={end:null,tier:null,card:false};const tick=()=>{const v=r.journeyVictoryState?.();if(v&&Number.isFinite(v.end)){__flow.end=v.end;__flow.tier=v.tier;}if(!document.getElementById('mPlace').hidden)__flow.card=true;if(!r.songStageState().running||r.songStageState().start===null)requestAnimationFrame(tick);};requestAnimationFrame(tick);}'''
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?lugar=cueva');p.wait_for_function('__r?.placeRun()?.id==="cueva"',timeout=20000)
  p.evaluate("()=>{__r.S.sound=true;__r.audio();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}");p.wait_for_function("__r.ac?.state==='running'&&__r.MU?.sq?.length>0",timeout=20000)
  assert p.evaluate('!__r.placesData().won'),'the finale has not played yet'
  # 64 % on time: ★, and the layer grown by its best share (song.js placeTier).
  p.evaluate("()=>{for(let i=0;i<100;i++)__r.placeHear('cueva',i<64,{midi:60+i%7,step:(i*4)%16,tick:i*4});}");p.evaluate(WATCH)
  assert p.evaluate("__r.placeFinish('cueva')")
  p.wait_for_function('__r.songStageState().running&&__r.songStageState().final&&__r.songStageState().start!==null',timeout=20000)
  flow=p.evaluate('__flow');st=p.evaluate('__r.songStageState()')
  assert not flow['card'],'no card in front of the finale'
  assert abs(flow['tier']-(1+7/16))<1e-9,('the drop at the level won',flow)
  assert flow['end'] is not None and -.01<=st['start']-flow['end']<16*st['six'],('the first bar less than a bar after the drop',st['start'],flow['end'],st['six'])
  assert p.evaluate('__r.songStageState().tiers.cueva')==1+7/16
  assert p.evaluate("document.getElementById('mPlace').hidden")
  # Through the phrases and the silence: no words in the silence; the authorship at the end.
  p.wait_for_function("__r.songStageState().caption?.startsWith('Tu frase')",timeout=60000)
  p.wait_for_function("__r.songStageState().caption===''",timeout=60000)
  assert 'Espacio' not in p.inner_text('#songStage')
  p.wait_for_function("__r.songStageState().credits",timeout=60000);assert 'Jay · diseño y código' in p.inner_text('#songStage')
  p.locator('#songClose').click()
  p.wait_for_function("!document.getElementById('mPlace').hidden",timeout=5000);assert 'Cueva' in p.inner_text('#placeTitle'),'the round\'s card after the finale'
  assert not errors,errors;b.close()
 print('PASS song finale flow (P6, D5-A): the eleventh round closes at its tier, no card in front, the finale starts by itself within a bar of the drop, a silence without words, authorship at the end, and the card after it',flush=True)
finally:srv.shutdown();srv.server_close()
