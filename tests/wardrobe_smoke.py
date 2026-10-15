"""Earned wardrobe: silhouettes, silent selection, real preview and durable ownership."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390)]:
   page=browser.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('__testRuntime?.cubeSettings')
   page.evaluate('()=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);document.getElementById("bCube").click();}')
   page.evaluate('()=>{const request=window.requestAnimationFrame,cancel=window.cancelAnimationFrame;window.__pendingFrames=new Set();window.requestAnimationFrame=callback=>{let id;id=request(t=>{__pendingFrames.delete(id);callback(t);});if(callback===__testRuntime.frame)__pendingFrames.add(id);return id;};window.cancelAnimationFrame=id=>{__pendingFrames.delete(id);cancel(id);};for(let i=0;i<5;i++)__testRuntime.frame(performance.now());}')
   page.wait_for_timeout(150);assert page.evaluate('__pendingFrames.size')==1
   assert page.locator('#mCube [data-locked]').count()==50
   old=page.evaluate('JSON.stringify(__testRuntime.cubeSettings())')
   page.locator('#cubeMaterials [data-locked="true"]').first.click();assert page.evaluate('JSON.stringify(__testRuntime.cubeSettings())')==old
   assert page.locator('#cubePreview').get_attribute('data-silhouette')=='true'
   page.evaluate('async()=>{const r=__testRuntime;const {CUBE_WARDROBE}=await import("/src/wardrobe-model.js");for(const p of CUBE_WARDROBE)r.awardReward(p.id);r.S.sound=true;document.getElementById("bCube").click();}')
   assert page.locator('#cubeCount').inner_text()=='50 de 50'
   before=page.evaluate('({context:!!__testRuntime.ac,waves:__testRuntime.waves.length})')
   for id in ['cubeMaterials','cubeForms','cubeTrails','cubeHalos','cubeAuras','cubeVoices']:
    page.locator('#'+id+' button').last.click()
   page.locator('#cubePreview').click()
   assert page.evaluate('!!__testRuntime.ac')==before['context'] and page.evaluate('__testRuntime.waves.length')==before['waves']
   page.wait_for_function('document.getElementById("cubePreviewCanvas").width>0');page.screenshot(path=f'/tmp/whitedot-v2-f3-cube-{width}.png')
   selected=page.evaluate('JSON.stringify(__testRuntime.cubeSettings())');page.reload();page.wait_for_function('__testRuntime?.cubeSettings');assert page.evaluate('JSON.stringify(__testRuntime.cubeSettings())')==selected
   assert page.evaluate('Object.keys(__testRuntime.S.rewards.items).filter(id=>id.startsWith("cube:")).length')==50
   assert not errors,errors;print('PASS fifty styles, locked inspection, silent choices, real preview and reload at '+str(width),flush=True);page.close()
  browser.close()
finally:server.shutdown()
