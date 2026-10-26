"""Native mobile font loading, source-onset colors and actual interaction instrument routing."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=sonidos&generation=2&layout=vasto')
  page.wait_for_function('__testRuntime?.inWorld()')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  page.wait_for_function('!document.getElementById("w").inert')
  page.locator('#w').tap(position={'x':190,'y':390})
  page.wait_for_function('__testRuntime.ac?.state==="running"')
  result=page.evaluate('''async()=>{
   const r=__testRuntime;await document.fonts.ready;
   const fonts=[];for(const w of [100,200,300,400,500,600,700,800,900])fonts.push((await document.fonts.load(w+' 14px "Geist Mono"')).length===1);
   const inks=[];r.clearSoundCues();const stroke=r.cx.stroke;
   r.cx.stroke=function(...args){inks.push(this.strokeStyle);return stroke.apply(this,args);};
   // P5: a cue shows when its note is heard, after the output latency; wait for it before drawing.
   try{for(const role of ['bajo','perc','acorde','lead','agudo'])r.soundCue({x:r.S.wx,y:r.S.wy},role,r.ac.currentTime);
    const {lightLatency}=await import('/src/journey-pulse.js');await new Promise(f=>setTimeout(f,lightLatency(r.ac)*1000+60));
    r.drawSoundCues(0,0,100);}finally{r.cx.stroke=stroke;r.clearSoundCues();}
   const {createRegionalVoices}=await import('/src/voices.js');const base=r.regionOfPos(r.S.wx,r.S.wy);
   for(const id of ['pad','plucked','strings','bowed'])delete r.S.journal.music.instruments[id];
   const pending=new Set(['pad','plucked','strings','bowed']),source={x:r.S.wx,y:r.S.wy};
   // The game caps a player's touches per bar; a refused touch (no return value) waits for the next bar.
   for(let attempt=0;attempt<4&&pending.size;attempt++){if(attempt){const bar=Math.floor(r.MU.step/16);await new Promise(f=>{const t=setInterval(()=>{if(Math.floor(r.MU.step/16)!==bar){clearInterval(t);f();}},20);});}
   for(const genre of Object.keys(r.GEN)){
    for(let i=0;i<96&&pending.size;i++){const region={...base,genre,key:'touch-'+genre+'-'+i};
     const profile=createRegionalVoices(region,r.BIOMES,r.GEN,r.seedOf,r.rng);
     for(const kind of Object.keys(profile)){const voice=r.getVoice(kind,region,source);if(!pending.has(voice.instrument))continue;
      if(r.playVoice(kind,0,r.ac.currentTime+.02,region,false,.12,source,'player'))pending.delete(voice.instrument);}}}}
   return {fonts,inks,gold:r.GOLD,heard:Object.keys(r.S.journal.music.instruments),family:getComputedStyle(document.body).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth};
  }''')
  assert all(result['fonts']) and 'Geist Mono' in result['family'],result
  assert len(set(result['inks']))>=4 and result['gold'].lower() not in result['inks'],result
  assert {'pad','plucked','strings','bowed'} <= set(result['heard']),result
  assert not result['overflow'] and not errors,(result,errors)
  page.locator('#bMenu').click();page.screenshot(path='/tmp/whitedot-geist-phone.png')
  print('PASS all nine Geist weights, mobile layout, five colored musical roles and native pad/plucked/strings/bowed routing',flush=True);b.close()
finally:server.shutdown()
