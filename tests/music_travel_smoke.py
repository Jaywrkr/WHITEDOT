"""Production-visible style travel, truthful heard state, silence and optional auto pulses."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(320,568),(390,844),(844,390)]:
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=musictravel&generation=2');page.wait_for_function('__testRuntime?.inWorld()');page.evaluate("()=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const r=__testRuntime;r.S.sound=false;r.S.cat.kept=true;r.S.journal.music.genres={};window.__old={x:r.S.wx,y:r.S.wy};}")
   page.wait_for_function('!document.getElementById("bStyles").hidden');page.locator('#bStyles').tap();page.wait_for_function('document.querySelectorAll("[data-music-genre]").length===52')
   assert page.locator('.music-heard').count()==0
   page.locator('#musicTravelSearch').fill('disco');assert page.locator('[data-music-genre="nudisco"]').count()==1
   page.locator('[data-music-genre="nudisco"]').tap();page.wait_for_function('document.getElementById("mMusicTravel").hidden',timeout=60000)
   assert page.evaluate('__testRuntime.regionOfPos(__testRuntime.S.wx,__testRuntime.S.wy).genre')=='nudisco'
   assert page.evaluate('__testRuntime.S.cat.kept&&__testRuntime.waves.length===0&&Object.keys(__testRuntime.S.journal.music.genres).length===0'),'menu travel must not award listening or launch notes'
   page.locator('#bStyles').tap();assert page.locator('.music-heard').count()==0
   page.locator('#musicTravelBack').tap();assert page.evaluate('__testRuntime.S.wx===__old.x&&__testRuntime.S.wy===__old.y')
   page.locator('#bStyles').tap();page.locator('#musicTravelSolo').tap();page.wait_for_function('document.getElementById("mMusicTravel").hidden',timeout=60000)
   assert page.evaluate('async()=>{const r=__testRuntime,{labScore}=await import("/src/lab-score.js");return labScore(r.regionOfPos(r.S.wx,r.S.wy),r.seedOf,r.rng).electronic.count===1;}')
   page.locator('#bStyles').tap();assert page.locator('.music-heard').count()==0
   if width==390:
    page.locator('#musicTravelHybrids').tap();assert page.locator('[data-music-genre]').count()==18
    page.locator('#musicTravelSearch').fill('guitarra');page.locator('[data-music-genre="fusion:guitar-machine"]').tap();page.wait_for_function('document.getElementById("mMusicTravel").hidden',timeout=60000)
    assert page.evaluate('async()=>{const r=__testRuntime,{hybridIdentity}=await import("/src/musical-hybrids.js");return hybridIdentity(r.regionOfPos(r.S.wx,r.S.wy),r.seedOf,r.rng).id==="guitar-machine";}')
    assert page.evaluate('Object.keys(__testRuntime.S.journal.music.hybrids||{}).length===0'),'silent menu cannot award a heard fusion'
   page.evaluate("()=>{const r=__testRuntime;document.getElementById('mMusicTravel').hidden=true;r.S.sound=true;r.audio();r.MU.dnaA=r.regionOfPos(r.S.wx,r.S.wy);r.hookInst('p_tinepiano',60,r.ac.currentTime+.02,.05,r.MU.dnaA);}")
   page.locator('#bStyles').tap();assert page.locator('.music-heard').count()>=1
   if width==390:page.screenshot(path='/tmp/whitedot-music-travel.png')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.locator('#musicTravelClose').tap();page.evaluate("__testRuntime.startAutopilot('wander')");page.locator('#autoPulse').tap();assert page.evaluate('__testRuntime.S.autoPulse===true')
   page.evaluate("()=>{const r=__testRuntime;r.stopAutopilot();r.startAutopilot('wander');r.S.autoPulse=false;}")
   page.evaluate("()=>{const r=__testRuntime;for(let i=0;i<500;i++)r.autopilotVector(.05,false,false);}");assert page.evaluate('__testRuntime.waves.length')==0
   # Enabling pulses remains silent until enough active walking has passed.
   page.locator('#autoPulse').tap();page.evaluate("()=>{const r=__testRuntime;for(let i=0;i<460;i++)r.autopilotVector(.05,false,false);}");page.wait_for_function('__testRuntime.waves.some(w=>w.origin==="ambient")',timeout=3000)   # Q5: the wave waits for its heard note
   page.evaluate("__testRuntime.stopAutopilot();__testRuntime.save()");page.reload();page.wait_for_function('__testRuntime?.inWorld()');assert page.evaluate('__testRuntime.S.autoPulse===true&&__testRuntime.S.cat.kept')
   page.evaluate("()=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const r=__testRuntime;window.__beforeFailure={x:r.S.wx,y:r.S.wy};window.__setItem=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key===r.saveStore.key)throw new DOMException('Full','QuotaExceededError');return __setItem.call(this,key,value);};}")
   page.locator('#bStyles').tap();page.locator('[data-music-genre="ambient"]').tap();page.wait_for_function('document.getElementById("musicTravelStatus").textContent.includes("guardado")')
   assert page.evaluate('__testRuntime.S.wx===__beforeFailure.x&&__testRuntime.S.wy===__beforeFailure.y'),'failed save must not move the player'
   page.evaluate('()=>{Storage.prototype.setItem=__setItem;}')
   assert not errors,errors;page.close()
  print('PASS three phone sizes: production styles, silent real travel, actual heard check, preserved progress and opt-in autonomous pulses');b.close()
finally:server.shutdown()
