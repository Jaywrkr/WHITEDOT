"""Native box contact, inspectable cards, single queue, pause and silent 4:5 sharing."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,struct
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390)]:
   page=browser.new_page(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=boxes-v2&layout=classic&generation=2');page.wait_for_function('__testRuntime?.celebrationState')
   page.evaluate('()=>{const r=__testRuntime;document.querySelectorAll(".modal").forEach(m=>m.hidden=true);r.S.sound=false;r.S.relaxedCreate=true;r.spawnBox(r.S.wx,r.S.wy,"cometa");}')
   page.wait_for_function('__testRuntime.hasPower("cometa")');page.wait_for_function('!document.getElementById("celebration").hidden&&document.getElementById("celebrationName").textContent==="Cometa"')
   assert page.locator('#celebrationTime').inner_text()=='90 s de juego'
   assert page.locator('#celebration').get_attribute('data-power')=='cometa'
   assert page.locator('#celebrationSerial').inner_text().startswith('#')
   assert page.locator('#celebrationPlace').inner_text()
   first_art=page.locator('#celebrationArt').inner_html();first_serial=page.locator('#celebrationSerial').inner_text()
   assert page.locator('#celebrationName').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')<=22
   rect=page.locator('#celebration').bounding_box();assert rect['width']*rect['height']>=width*height*.95,rect
   inner=page.locator('.celebration-card').bounding_box();assert inner['width']>=300 and inner['x']>=0 and inner['x']+inner['width']<=width,inner
   assert page.locator('#rareNotice').is_hidden()
   page.evaluate('__testRuntime.say("Escucha tu nueva voz.","Colección",{requested:true})');page.wait_for_timeout(450)
   assert not page.locator('#voice').evaluate('e=>e.classList.contains("on")'),'voice must wait for the card'
   remaining=page.evaluate('__testRuntime.celebrationState.remaining');power=page.evaluate('__testRuntime.powerSecondsLeft("cometa")');page.wait_for_timeout(650)
   assert page.evaluate('__testRuntime.celebrationState.remaining')==remaining
   assert page.evaluate('__testRuntime.powerSecondsLeft("cometa")')==power,'inspection pauses the earned power'
   assert page.locator('#celebration').get_attribute('role')=='dialog'
   assert page.evaluate('document.getElementById("celebration").contains(document.activeElement)')
   page.evaluate('document.getElementById("bMenu").click()');page.wait_for_timeout(150);assert page.locator('#celebration').is_hidden()
   page.locator('#mnClose').click();page.wait_for_function('!document.getElementById("celebration").hidden')
   before=page.evaluate('({wave:__testRuntime.waves.length,context:!!__testRuntime.ac})')
   with page.expect_download() as dl:page.locator('#celebrationShare').click()
   path=dl.value.path();data=Path(path).read_bytes();assert struct.unpack('>II',data[16:24])==(512,640)
   assert page.evaluate('__testRuntime.waves.length')==before['wave'] and page.evaluate('!!__testRuntime.ac')==before['context']
   page.screenshot(path=f'/tmp/whitedot-v2-f2-power-{width}.png')
   page.locator('#celebrationContinue').click();page.wait_for_function('document.getElementById("celebration").hidden');page.wait_for_function('document.getElementById("voice").classList.contains("on")')
   assert page.evaluate('__testRuntime.S.ach.poder_cometa')
   assert page.evaluate('__testRuntime.ownsReward("box:cometa")')
   page.evaluate('''()=>{const r=__testRuntime;r.celebrateBox({id:'second-native-opening',power:'campo',x:r.S.wx,y:r.S.wy});}''')
   page.wait_for_function('document.getElementById("celebration").dataset.power==="campo" && !document.getElementById("celebration").hidden')
   assert page.locator('#celebrationArt').inner_html()!=first_art
   assert page.locator('#celebrationSerial').inner_text()!=first_serial
   page.emulate_media(reduced_motion='reduce');assert page.locator('#celebration').evaluate('e=>getComputedStyle(e).animationName')=='none'
   assert not errors,errors;print('PASS timed box card, paused power/queue, silent 512x640 export and earned memory at '+str(width),flush=True);page.close()
  browser.close()
finally:server.shutdown()
