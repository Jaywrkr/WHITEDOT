"""Cube shop batch 5: pulse voices, cube sounds and step notes are bought with their own pictures, heard in the game, shown beside the cube and kept after a reload."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=cube-shop&layout=wide&generation=2');page.wait_for_function('!!window.__r?.buySparkStyle&&!!window.__r?.cubeShopSounds')
  page.evaluate("""()=>{const r=__r,s=r.S;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);s.sound=true;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();s.sparks=7000;s.sparkEconomy.earned=s.sparkEconomy.spent+7000;r.save();r.audio();}""")
  page.wait_for_function('__r.inWorld()&&__r.ac?.state==="running"')
  pieces=page.evaluate("async()=>{const m=await import('/src/cube-shop-sound.js');return [...m.SHOP_VOICES,...m.SHOP_SOUNDS,'trail:notes'];}")
  assert len(pieces)==12,pieces
  # Each piece has its own picture in the shop, drawn by the game.
  page.evaluate("__r.openCube('shop')")
  pics=page.evaluate("ids=>ids.map(id=>document.querySelector('#sparkShop article[data-piece=\"'+id+'\"] img')?.src||'')",pieces)
  assert all(p.startswith('data:image/png') for p in pics) and len(set(pics))==12,'twelve distinct pictures'
  page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  before=page.evaluate('__r.S.sparks')
  page.evaluate("__r.S.cube.voice='metal'")
  for pid in pieces:assert page.evaluate('id=>__r.buySparkStyle(id)',pid),pid
  assert before-page.evaluate('__r.S.sparks')==6050
  # The last voice bought is worn; buying a voice puts the earned one back to the place's own.
  assert page.evaluate('__r.sparkEconomy.wear.pulseVoice')=='voice:chord' and page.evaluate('__r.S.cube.voice')=='natural'
  assert page.evaluate('__r.sparkEconomy.wear.trail')=='trail:notes' and all(page.evaluate('id=>__r.sparkEconomy.on[id]===true',p) for p in ['sound:hat','sound:filter','sound:hum','sound:dj','sound:antenna'])
  page.evaluate("()=>{window.__cues=[];__r.shopSoundCue=n=>__cues.push(n);__r.equipSparkStyle('voice:bell');document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}")
  page.locator('#w').focus();page.keyboard.press('Space');page.wait_for_function('__cues.length>0',timeout=5000)
  assert page.evaluate('__cues[0].id')=='voice:bell' and 72<=page.evaluate('__cues[0].notes[0]')<=84
  # Walking: hats on the eighths, the filter opens, notes are left behind; standing still hums.
  page.keyboard.down('d');page.wait_for_timeout(1800);page.keyboard.up('d')
  state=page.evaluate('__r.cubeShopSounds()');assert state['hat']>0 and state['marks']>=2 and state['cutoff'] and state['cutoff']>4200,state
  page.keyboard.down('a');page.wait_for_timeout(1800);page.keyboard.up('a')
  state=page.evaluate('__r.cubeShopSounds()');assert state['dj']>0 and state['step']>0,state
  page.wait_for_function('__r.cubeShopSounds().hum>0',timeout=9000)
  # Muted: the cube keeps its marks and plays nothing new.
  page.evaluate('__r.S.sound=false');counts=page.evaluate('__r.cubeShopSounds()');page.keyboard.down('d');page.wait_for_timeout(800);page.keyboard.up('d');after=page.evaluate('__r.cubeShopSounds()')
  assert after['hat']==counts['hat'] and after['step']==counts['step'],(counts,after)
  for reduced in (False,True):
   page.evaluate('r=>{__r.S.reducedMotion=r;}',reduced);page.wait_for_timeout(900)
   lit=page.evaluate("()=>{const c=document.getElementById('w'),x=c.getContext('2d'),w=c.width,h=c.height,d=x.getImageData(Math.floor(w/2-20),Math.floor(h/2-70),40,50).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>300)n++;return n;}")
   assert lit>3,('antenna above the cube',reduced,lit)
  page.evaluate('__r.save()');page.reload();page.wait_for_function('!!window.__r?.sparkEconomy')
  assert page.evaluate('__r.sparkEconomy.wear.pulseVoice')=='voice:bell' and page.evaluate("__r.sparkEconomy.on['sound:antenna']")==True
  page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)");page.evaluate("__r.openCube('shop')")
  assert page.locator('#sparkShop article[data-slot="pulseVoice"]').count()==0 and page.locator('#sparkShop article[data-slot="sound"]').count()==0
  page.locator('#cubeTabWear').click()
  assert page.locator('[data-owned-slot="pulseVoice"] [data-shop-piece]').count()==6 and page.locator('[data-owned-slot="sound"] [data-shop-piece]').count()==5 and page.locator('#cubeTrails [data-shop-piece="trail:notes"]').count()==1
  # Choosing a bought voice in Llevar takes the voice off; choosing an earned one would put back natural first.
  page.locator('[data-owned-slot="pulseVoice"] [data-shop-piece="voice:bell"]').click();assert page.evaluate('__r.sparkEconomy.wear.pulseVoice||""')==''
  assert not errors,errors;browser.close()
 print('PASS 12 sound pieces: own pictures, bought for 6050 sparks, bell heard on the pulse, hats, filter, scratch, step notes and humming in play, silent when muted, antenna visible moving and still, kept after reload and listed in Llevar',flush=True)
finally:server.shutdown()
