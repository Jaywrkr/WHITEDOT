"""Natural dense connections, audible complementary parts, local color and saved networks."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=groves&generation=2');page.wait_for_function('__testRuntime?.inWorld()');page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  page.wait_for_function('!document.getElementById("bStyles").hidden');page.locator('#bStyles').tap();page.locator('#musicTravelConnections').tap();page.wait_for_function('document.getElementById("mMusicTravel").hidden',timeout=60000)
  page.evaluate('__testRuntime.audio();__testRuntime.S.sound=true')
  page.wait_for_function('__testRuntime.encounterObjects.filter(o=>o.groveStyle).length>=6')
  point=page.evaluate('''()=>{const r=__testRuntime,o=r.encounterObjects.find(o=>o.groveStyle&&Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<30);if(!o)throw Error('Travel missed the natural grove');return {x:o.x,y:o.y,id:o.id};}''')
  page.wait_for_function('''id=>{const o=__testRuntime.encounterObjects.find(o=>o.id===id);return o?.state.weave?.edges.length>0;}''',arg=point['id'])
  page.evaluate('''()=>{const r=__testRuntime;window.__notes=[];r.foregroundNoteCue=n=>__notes.push(n);window.__node=r.encounterObjects.find(o=>o.groveStyle&&Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<30);r.playVoice('encounter:weaver:'+__node.groveRole,0,r.ac.currentTime+.02,r.regionOfPos(__node.x,__node.y),false,.6,__node,'player');r.rememberEncounter(__node);window.__edges=JSON.stringify(__node.state.weave.edges);r.save();}''')
  assert page.evaluate('__notes.length>0&&__node.modularSignal.routes>0'),'the connection must route real audio'
  page.screenshot(path='/tmp/whitedot-connection-grove.png')
  # Opening style travel pauses the actual automatic walk, including lite-sheet ancestors.
  page.evaluate("__testRuntime.startAutopilot('wander')");page.locator('#bStyles').tap();page.wait_for_timeout(150);before=page.evaluate('[__testRuntime.S.wx,__testRuntime.S.wy]');page.wait_for_timeout(250);assert page.evaluate('[__testRuntime.S.wx,__testRuntime.S.wy]')==before
  page.locator('#musicTravelClose').tap();page.evaluate('__testRuntime.stopAutopilot();__testRuntime.save()');page.reload();page.wait_for_function('__testRuntime?.inWorld()');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  page.wait_for_function('''id=>__testRuntime.encounterObjects.some(o=>o.id===id&&o.state.weave?.edges.length>0)''',arg=point['id'])
  # Real Canvas draw emits colored pixels only inside a limited part of the viewport.
  result=page.evaluate('''async()=>{const {distantCloud,GALAXY_PARALLAX}=await import('/src/distant-colors.js'),r=__testRuntime;let q;for(let x=0;x<10&&!q;x++)q=distantCloud(x,0,r.seedOf);r.S.wx=q.x/GALAXY_PARALLAX;r.S.wy=q.y/GALAXY_PARALLAX;r.S.reducedMotion=true;const c=r.cx;c.globalAlpha=1;c.fillStyle='#000';c.fillRect(0,0,r.W,r.H);r.drawDistantColors();const data=c.getImageData(0,0,r.W,r.H).data;let colored=0,bright=0;for(let i=0;i<data.length;i+=4){if(Math.max(data[i],data[i+1],data[i+2])-Math.min(data[i],data[i+1],data[i+2])>2)colored++;if(Math.max(data[i],data[i+1],data[i+2])>100)bright++;}return {colored,bright,pixels:data.length/4};}''')
  assert 100<result['colored']<result['pixels']*.3 and result['bright']==0,result
  assert not errors,errors;print('PASS natural connected grove, real typed audio route, persistent threads, paused style travel and restrained multicolor Canvas');b.close()
finally:server.shutdown()
