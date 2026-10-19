"""Historical duet module only: launch uses cloud-account without rooms."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import importlib.util,tempfile,threading,shutil,os
ROOT=Path(__file__).resolve().parents[1];spec=importlib.util.spec_from_file_location('wd_service',ROOT/'server/app.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as tmp:
 server=m.create_server(port=0,database=Path(tmp)/'duets.sqlite');threading.Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);contexts=[browser.new_context(viewport={'width':390,'height':844},has_touch=True) for _ in range(2)];pages=[c.new_page() for c in contexts];errors=[]
   for page in pages:
    page.on('pageerror',lambda e:errors.append(str(e)));page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})");page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()', 'null').replace("./cloud-account.js","./connection.js")+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
    page.route('**/?testSeed=*',lambda route:route.fulfill(body=(ROOT/'index.html').read_text(encoding='utf-8').replace('id="connectionRooms" hidden','id="connectionRooms"'),content_type='text/html'))
    page.goto(server.origin+'/?testSeed=duet-test&layout=wide&generation=2');page.wait_for_function('()=>window.__testRuntime?.duetTransport!==undefined');page.evaluate('()=>{document.querySelectorAll(".modal").forEach(m=>m.hidden=true);document.getElementById("accountGuest").hidden=false;document.getElementById("bConnection").click()}');page.locator('#accountGuest').click();page.wait_for_function('()=>!document.getElementById("roomCreate").disabled')
   pages[0].locator('#roomCreate').click();pages[0].wait_for_function('()=>__testRuntime.duetRoom!==null');code=pages[0].locator('#roomCode').input_value();pages[1].locator('#roomCode').fill(code);pages[1].locator('#roomJoin').click()
   for page in pages:page.wait_for_function('()=>__testRuntime.duetRoom?.members.length===2');page.locator('#connectionClose').click();page.evaluate('()=>{__testRuntime.audio();window.__duetNotes=[];__testRuntime.duetNoteCue=n=>__duetNotes.push(n)}')
   pages[0].evaluate('()=>{const r=__testRuntime;r.playVoice("living:cactus",3,r.ac.currentTime+.1,r.regionOfPos(r.S.wx,r.S.wy),false,.3,{variant:5,x:r.S.wx,y:r.S.wy},"player")}')
   for page in pages:page.wait_for_function('()=>__duetNotes.length>0',timeout=8000)
   a=pages[0].evaluate('__duetNotes[0]');b=pages[1].evaluate('__duetNotes[0]');assert a['target']==b['target'] and a['step']==b['step'] and a['slot']==0 and a['degree']==b['degree'],(a,b)
   # A guest's musical role complements the host; UI alone emits no musical events.
   pages[1].evaluate('()=>{const r=__testRuntime;r.playVoice("living:pulse-fruit",4,r.ac.currentTime+.1,r.regionOfPos(r.S.wx,r.S.wy),false,.3,{variant:6},"player")}')
   for page in pages:page.wait_for_function('()=>__duetNotes.some(n=>n.slot===1)',timeout=8000)
   assert not errors,errors;print('PASS two isolated guest browsers, visible peer presence, native material voices, same target/played step and complementary slots')
   browser.close()
 finally:server.shutdown();server.server_close()
