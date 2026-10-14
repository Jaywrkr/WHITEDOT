"""Existing cosmetics and new source grants survive reload/export with silent UI."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import json,threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  legacy={'ach':{'tope':'2026-10-01','mundo':'2026-10-02','r3':'2026-10-03','estrella1':'2026-10-04','poder_cometa':'2026-10-05','quietud5':'2026-10-06','tiempo':'2026-10-07','bandada1':'2026-10-08'},'cube':{'color':'#f0d27a','trail':'line','halo':'pulse'},'color':'#f0d27a','helpV2':True,'help':{'camino':True,'mundo':True},'favorites':{'version':1,'items':[]}}
  page.add_init_script('if(!localStorage.getItem("pixel-blanco-v4"))localStorage.setItem("pixel-blanco-v4",'+json.dumps(json.dumps(legacy))+');')
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('__testRuntime?.rewardCatalog?.length>86')
  assert page.evaluate('__testRuntime.cubeColor()')=='#f0d27a'
  assert page.evaluate('__testRuntime.S.cube.trail')=='line'
  assert page.evaluate('__testRuntime.rewardBook.items["cube:color:f0d27a"].obtainedAt')=='2026-10-01'
  assert page.evaluate('__testRuntime.recordRewardSource("study","canon").length')==1
  first=page.evaluate('__testRuntime.rewardBook.items["study:canon"].obtainedAt')
  assert page.evaluate('__testRuntime.recordRewardSource("study","canon").length')==0
  page.evaluate('__testRuntime.save()');page.reload();page.wait_for_function('__testRuntime?.rewardBook')
  assert page.evaluate('__testRuntime.rewardBook.items["study:canon"].obtainedAt')==first
  page.locator('#bMenu').click();page.locator('#bCube').click()
  before=page.evaluate('({waves:__testRuntime.waves.length,context:!!__testRuntime.ac})')
  page.get_by_role('button',name='Blanco',exact=True).click()
  assert page.evaluate('__testRuntime.waves.length')==before['waves']
  assert page.evaluate('!!__testRuntime.ac')==before['context']
  assert page.evaluate('__testRuntime.rewardBook.items["cube:color:f0d27a"]!==undefined')
  page.evaluate('()=>{const r=__testRuntime;r.S={...r.fresh()};if(r.ownsReward("study:canon"))throw Error("scope leaked");}')
  assert not errors,errors
  print('PASS reward migration, source grants, immutable dates, reload, silent wardrobe and replacement scope at 390x844')
  browser.close()
finally:server.shutdown()
