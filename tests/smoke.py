from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/'
CHROMIUM = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser')

with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(5000);page.add_init_script('window.__audioContexts=[];window.AudioContext=class extends AudioContext {constructor(...args){super(...args);window.__audioContexts.push(this);}}');errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click();page.wait_for_function('window.__audioContexts.length === 1 && window.__audioContexts[0].state === "running" && window.__audioContexts[0].currentTime > 0')
  assert page.locator('#reto').is_visible() == page.evaluate('!window.__testRuntime.S.retos[window.__testRuntime.regionOfPos(window.__testRuntime.S.wx,window.__testRuntime.S.wy).key]')
  page.evaluate('''()=>{const r=window.__testRuntime;for(let i=0;i<12;i++){const region=r.regionOfPos(i*3600+900,900);for(const kind of ['arbol','cristal','pilar','loto','luz','pulso','luciernaga'])r.playVoice(kind,i,r.ac.currentTime+.05,region,true);for(const sp of region.species)r.speciesSound(sp,r.ac.currentTime+.05,true);}}''')
  page.evaluate('''async()=>{const r=window.__testRuntime,{gravityOf}=await import('/src/gravity.js');const oldRAF=window.requestAnimationFrame,oldX=r.S.wx,oldY=r.S.wy;window.requestAnimationFrame=()=>0;try{for(const factor of [.55,1,1.65]){let region,x,y;for(let i=-10;i<=10;i++){x=i*3600+1800;y=1800;region=r.regionOfPos(x,y);if(gravityOf(region,r.seedOf).multiplier===factor)break;}if(gravityOf(region,r.seedOf).multiplier!==factor)throw Error('Missing gravity');r.S.wx=x;r.S.wy=y;r.ptr=null;r.keys.d=1;r.frame.l=1000;r.frame(1050);r.keys.d=0;if(Math.abs(r.S.wx-x-r.SPEED*factor*.05)>.001)throw Error('Gravity movement mismatch');r.showRegion(region,true);if(!document.getElementById('zDo').textContent.includes(gravityOf(region,r.seedOf).name))throw Error('Gravity label missing');}}finally{r.S.wx=oldX;r.S.wy=oldY;r.keys.d=0;r.frame.l=performance.now();window.requestAnimationFrame=oldRAF;}}''')
  page.evaluate('''()=>{const r=window.__testRuntime;document.getElementById('voice').classList.add('on');document.getElementById('vX').textContent='Un mensaje largo para verificar que la interfaz compacta permite consultar todo su contenido sin ocupar el mundo constantemente. '.repeat(3);}''')
  page.locator('#voice').click();assert page.locator('#voice').get_attribute('aria-expanded')=='true'
  page.locator('#voice').click();assert page.locator('#voice').get_attribute('aria-expanded')=='false'
  page.evaluate('''()=>{const r=window.__testRuntime,old=r.MU.speed,region=r.regionOfPos(r.S.wx,r.S.wy),g=r.windG.gain,f=r.windF.frequency,gs=g.setTargetAtTime,fs=f.setTargetAtTime;let gain,frequency;g.setTargetAtTime=(...args)=>{gain=args[0];return gs.apply(g,args);};f.setTargetAtTime=(...args)=>{frequency=args[0];return fs.apply(f,args);};try{r.MU.speed=1;r.MU.dnaT={...region,air:'polvo'};r.frame.l=1000;r.frame(1050);if(!(gain>0&&gain<=.012&&frequency>=260&&frequency<=810))throw Error('Wind targets not softened');}finally{g.setTargetAtTime=gs;f.setTargetAtTime=fs;r.MU.speed=old;r.MU.dnaT=region;r.frame.l=performance.now();}}''')
  page.screenshot(path='/tmp/whitedot-polish-'+label+'.png')
  page.locator('#bMenu').click();page.locator('#bAch').click()
  assert page.locator('#mJournal').is_visible()
  assert 'Gravedad' in page.locator('#journalBody').inner_text()
  page.locator('[data-journal-tab="forms"]').click()
  page.evaluate('''()=>{const r=window.__testRuntime;r.discover(r.regionOfPos(900,900).species[0]);}''')
  page.locator('[data-journal-tab="places"]').click();page.locator('[data-journal-tab="forms"]').click()
  assert 'Sin formas descubiertas' not in page.locator('#journalBody').inner_text()
  page.locator('[data-journal-tab="music"]').click();assert 'Instrumentos' in page.locator('#journalBody').inner_text()
  assert page.evaluate('Object.keys(window.__testRuntime.S.journal.music.instruments).length > 0')
  page.evaluate('''()=>{const r=window.__testRuntime,old=r.S.sound;r.S.sound=false;r.recordInstrument('muted-test');r.S.sound=old;if(r.S.journal.music.instruments['muted-test'])throw Error('Muted music incorrectly recorded');}''')
  page.locator('[data-journal-tab="achievements"]').click();assert '???' in page.locator('#journalBody').inner_text()
  page.locator('#journalClose').click()
  # Real pointer gestures: hold scans, drag moves, a short tap pulses.
  center={'x':size['width']/2,'y':size['height']/2}
  page.mouse.move(center['x']+60,center['y']);before=page.evaluate('({x:window.__testRuntime.S.wx,y:window.__testRuntime.S.wy,waves:window.__testRuntime.waves.length})')
  page.mouse.down();page.wait_for_timeout(650);assert page.locator('#scanner').is_visible();page.screenshot(path='/tmp/whitedot-scanner-'+label+'.png')
  after=page.evaluate('({x:window.__testRuntime.S.wx,y:window.__testRuntime.S.wy,waves:window.__testRuntime.waves.length})')
  assert abs(after['x']-before['x'])<.001 and abs(after['y']-before['y'])<.001
  page.mouse.up();assert not page.locator('#scanner').is_visible()
  page.wait_for_timeout(800);page.mouse.click(center['x'],center['y'])
  assert page.evaluate('window.__testRuntime.waves.length > 0')
  page.mouse.move(center['x'],center['y']);before=page.evaluate('window.__testRuntime.S.wx');page.mouse.down();page.mouse.move(center['x']+80,center['y']);page.wait_for_timeout(650)
  assert not page.locator('#scanner').is_visible();assert page.evaluate('window.__testRuntime.S.wx')>before;page.mouse.up()
  page.keyboard.down('e');assert page.locator('#scanner').is_visible();page.keyboard.up('e');assert not page.locator('#scanner').is_visible()
  if label=='mobile':
   cdp=c.new_cdp_session(page);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[center]});page.wait_for_timeout(650);assert page.locator('#scanner').is_visible();cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});assert not page.locator('#scanner').is_visible()
  page.evaluate('''()=>{const r=window.__testRuntime,c=r.wchunk(Math.floor(r.S.wx/900),Math.floor(r.S.wy/900));if(!c.playthings.length)throw Error('No new elements');const o=c.playthings[0];o.x=r.S.wx+5;o.y=r.S.wy;o.cd=0;r.frame.l=1000;r.frame(1050);if(o.lit<=0)throw Error('Contact failed');o.x=r.S.wx+30;o.y=r.S.wy;o.cd=0;o.lit=0;r.waves=[{x:r.S.wx,y:r.S.wy,r:29,prev:0,max:340,n:0}];r.frame.l=1050;r.frame(1100);if(o.lit<=0)throw Error('Pulse failed');r.frame.l=performance.now();}''')
  page.evaluate('''async()=>{const r=window.__testRuntime,{TOY_NAMES}=await import('/src/playthings.js'),c=r.wchunk(Math.floor(r.S.wx/900),Math.floor(r.S.wy/900));window.__toyRestore={c,items:c.playthings};c.playthings=Object.keys(TOY_NAMES).map((kind,i)=>({kind,x:r.S.wx+(i-2)*35,y:r.S.wy-80,hx:r.S.wx+(i-2)*35,hy:r.S.wy-80,size:8,phase:i,rotation:.4,lit:1,jump:.2,ring:.7,vx:0,vy:0,cd:1e12,snd:q=>r.playVoice('toy:'+kind,i,q,r.regionOfPos(r.S.wx,r.S.wy))}));r.frame.l=1000;r.frame(1050);r.frame.l=performance.now();}''')
  page.screenshot(path='/tmp/whitedot-playthings-'+label+'.png')
  page.evaluate('''()=>{window.__toyRestore.c.playthings=window.__toyRestore.items;delete window.__toyRestore;}''')
  page.evaluate('''()=>{const r=window.__testRuntime,oldX=r.S.wx,oldY=r.S.wy,c=r.wchunk(Math.floor(r.S.wx/900),Math.floor(r.S.wy/900));for(const p of c.pockets){r.S.wx=p.x;r.S.wy=p.y;r.frame.l=1000;r.frame(1050);r.hud();if(r.currentPocket()?.kind!==p.kind)throw Error('Pocket not recognized');if(p.kind==='quiet'&&r.MU.near.length)throw Error('Listening center has automatic object ensemble');}r.S.wx=oldX;r.S.wy=oldY;r.frame.l=performance.now();}''')
  page.evaluate('''async()=>{const r=window.__testRuntime,{relicAt}=await import('/src/relics.js');let site;for(let x=2;x<100&&!site;x++)for(let y=2;y<100&&!site;y++){const q=relicAt(x,y,r.WCH,r.seedOf,r.rng);if(q?.magical)site=q;}if(!site)throw Error('No magical site');window.__relicRestore={x:r.S.wx,y:r.S.wy,stars:r.S.stars.slice(),sites:structuredClone(r.S.relicSites||{})};r.S.wx=site.x;r.S.wy=site.y;r.frame.l=performance.now();r.frame(performance.now()+16);if(r.S.stars.length!==window.__relicRestore.stars.length)throw Error('Relic collected by contact');r.pulseRelics();r.pulseRelics();r.pulseRelics();r.pulseRelics();r.pulseRelics();if(r.S.stars.length!==window.__relicRestore.stars.length)throw Error('Relic collected without listening');for(let i=0;i<250;i++)r.visitRelic(site,.05);if(r.S.stars.length!==window.__relicRestore.stars.length+1||!r.S.stars.at(-1).magical)throw Error('Magical awakening failed');r.takeRelic({...site});if(r.S.stars.length!==window.__relicRestore.stars.length+1)throw Error('Repeated reward');if(r.nearbyRelics().some(q=>q.id===site.id))throw Error('Claimed site remains');r.S.wx=window.__relicRestore.x;r.S.wy=window.__relicRestore.y;r.S.stars=window.__relicRestore.stars;r.S.relicSites=window.__relicRestore.sites;r.clearRelicProgress();r.frame.l=performance.now();r.save();}''')
  page.evaluate('''()=>{const r=window.__testRuntime,region=r.regionOfPos(r.S.wx,r.S.wy),bus=r.bus,verb=r.verbIn,send=r.dsend;const names=new Set();for(let i=0;i<100;i++){const kind='effect-probe:'+i,p=r.getEffectProfile(kind,region,{role:'lead'});if(names.has(p.type)||p.type==='dry')continue;names.add(p.type);r.withVoiceEffect(kind,region,{role:'lead'},r.ac.currentTime+.05,()=>r.hookInst('keys',60,r.ac.currentTime+.05,.02));if(r.bus!==bus||r.verbIn!==verb||r.dsend!==send)throw Error('Effect routing leaked');}if(names.size!==4||r.activeEffectCount>12)throw Error('Effects unavailable or unbounded');}''')
  page.locator('#bMenu').click();page.locator('#bSession').click();assert page.locator('#mSession').is_visible()
  assert 'Sesión en curso' in page.locator('#sessionBody').inner_text()
  elapsed=page.evaluate('window.__testRuntime.S.session.seconds');page.wait_for_timeout(250);assert page.evaluate('window.__testRuntime.S.session.seconds')==elapsed
  page.screenshot(path='/tmp/whitedot-session-'+label+'.png')
  page.locator('#sessionShare').click();assert page.locator('#mShare').is_visible()
  page.wait_for_function('document.getElementById("shareImg").naturalWidth === 1080 && document.getElementById("shareImg").naturalHeight === 1350')
  page.locator('#sClose').click();page.locator('#bPrimary').click()
  assert page.evaluate('window.__testRuntime.S.session===null && window.__testRuntime.S.lastSession!==null')
  page.locator('#bMenu').click();page.locator('#bSession').click();assert 'Última sesión' in page.locator('#sessionBody').inner_text();page.locator('#sessionClose').click();page.locator('#bPrimary').click()
  page.evaluate('''async()=>{const r=window.__testRuntime,{INSTRUMENT_SPECS}=await import('/src/instruments.js');for(const id of Object.keys(INSTRUMENT_SPECS)){const t=r.ac.currentTime+.05;r.hookInst(id,id==='rubber'||id==='machine'?43:60,t,.012);}r.guiro(r.ac.currentTime+.05,.01);r.timbale(r.ac.currentTime+.05,.01);const seen=new Map();for(let x=-20;x<=20;x++)for(let y=-20;y<=20;y++){const region=r.regionOfPos(x*3600+900,y*3600+900);if(['tropical','melodic','robotic','nudisco'].includes(region.genre))seen.set(region.genre,region);}if(seen.size!==4)throw Error('Missing electronic palette');for(const region of seen.values()){for(const kind of ['arbol','luz','pulso'])r.playVoice(kind,0,r.ac.currentTime+.1,region,true,.25);}}''')
  page.locator('#bMenu').click();page.locator('#bSoft').click();assert page.locator('#bSoft').get_attribute('aria-pressed')=='true'
  assert page.evaluate('window.__testRuntime.S.softMusic && window.__testRuntime.musicVolume()===.65')
  page.wait_for_timeout(150);assert page.evaluate('window.__testRuntime.comfortLowpass.frequency.value < 18000')
  page.locator('#bMenu').click();page.locator('#bSound').click();assert page.evaluate('window.__testRuntime.musicVolume()===0')
  page.locator('#bMenu').click();page.locator('#bSound').click();assert page.evaluate('window.__testRuntime.musicVolume()===.65')
  page.locator('#bMenu').click();page.locator('#bSoft').click();assert page.evaluate('!window.__testRuntime.S.softMusic && window.__testRuntime.musicVolume()===.85')
  page.wait_for_function('!!window.__testRuntime.MU.radio?.grammar && window.__testRuntime.MU.radio.grammar.hookLimit<=5')
  page.evaluate('''()=>{const r=window.__testRuntime,region=r.regionOfPos(r.S.wx,r.S.wy),source={x:r.S.wx+150,y:r.S.wy},original=[r.bus,r.verbIn,r.dsend];let local;r.withSpatialVoice(source,r.ac.currentTime+.05,()=>{local=r.bus;r.hookInst('strings',60,r.ac.currentTime+.05,.02);});if(r.bus!==original[0]||r.verbIn!==original[1]||r.dsend!==original[2])throw Error('Spatial routing leaked');source.x=r.S.wx;source.y=r.S.wy;r.spatialTick();if(r.activeSpatialCount>32)throw Error('Spatial voices unbounded');r.playVoice('arbol',0,r.ac.currentTime+.1,region,true,.3,source);}''')

  page.evaluate('''()=>{const r=window.__testRuntime;window.__borderRestore={x:r.S.wx,y:r.S.wy};r.S.wx=3590;r.S.wy=1800;r.frame.l=performance.now();r.frame(performance.now()+16);if(!r.MU.nb||r.MU.nbW<.45)throw Error('No border mix');}''')
  page.wait_for_timeout(2200);assert page.evaluate('!!window.__testRuntime.MU.neighborRadio')
  page.evaluate('''()=>{const r=window.__testRuntime;r.S.wx=window.__borderRestore.x;r.S.wy=window.__borderRestore.y;r.frame.l=performance.now();}''')
  page.evaluate('''async()=>{const r=window.__testRuntime,{REFERENCE_GENRES}=await import('/src/references.js'),found=new Map();for(let x=-20;x<=20;x++)for(let y=-20;y<=20;y++){const region=r.regionOfPos(x*3600+900,y*3600+900);if(REFERENCE_GENRES[region.genre])found.set(region.genre,region);}if(found.size!==12)throw Error('Missing reference family');for(const region of found.values()){const t=r.ac.currentTime+.05;r.bassInst(r.GEN[region.genre].bassI,43,t,.025);r.hookInst(r.GEN[region.genre].hookP[0],60,t,.012);r.playVoice('arbol',0,t,region,false,.15);}if(!r.S.journal.music.instruments.logdrum)throw Error('Log drum not recorded');}''')

  page.evaluate('''()=>{const r=window.__testRuntime;window.__phenRestore={x:r.S.wx,y:r.S.wy};const found=new Map();for(let x=-8;x<8&&found.size<3;x++)for(let y=-8;y<8&&found.size<3;y++){r.S.wx=x*900+450;r.S.wy=y*900+450;for(const o of r.nearbyPhenomena())found.set(o.kind,o);}if(found.size!==3)throw Error('Missing environmental phenomenon');window.__phenExamples=[...found.values()];}''')
  for kind in ['bird','shaker','cloud']:
   page.evaluate('''kind=>{const r=window.__testRuntime;let o=window.__phenExamples.find(o=>o.kind===kind);r.S.wx=o.hx-45;r.S.wy=o.hy+35;o=r.nearbyPhenomena().find(item=>item.id===o.id)||o;o.next=0;o.cd=1e12;r.frame.l=performance.now();r.frame(performance.now()+16);const t=r.ac.currentTime+.08;if(!r.triggerPhenomenon(o,t))throw Error('Phenomenon did not sound');if(!o.cues.includes(t))throw Error('Cue not tied to audio clock');}''',kind)
   page.wait_for_timeout(130);page.screenshot(path='/tmp/whitedot-phenomenon-'+kind+'-'+label+'.png')
  page.evaluate('''()=>{const r=window.__testRuntime;r.S.wx=window.__phenRestore.x;r.S.wy=window.__phenRestore.y;r.frame.l=performance.now();}''')
  page.keyboard.press('Space')
  page.keyboard.down('d');page.wait_for_timeout(300);page.keyboard.up('d')
  page.locator('#bPrimary').click();page.locator('#bPrimary').click();assert page.locator('#reto').is_visible() == page.evaluate('!window.__testRuntime.S.retos[window.__testRuntime.regionOfPos(window.__testRuntime.S.wx,window.__testRuntime.S.wy).key]')
  page.locator('#bMenu').click();page.wait_for_timeout(2200);before=page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).lampUsed');page.wait_for_timeout(2200);after=page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).lampUsed');assert abs(after-before)<.1,(before,after)
  page.locator('#dNext').click();assert not page.locator('#reto').is_visible();assert not page.locator('#mCap').is_visible()
  page.wait_for_timeout(2100);assert page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).mode')=='camino'
  page.locator('#bMenu').click();page.locator('#bStudio').click();page.locator('#w').click(position={'x':size['width']/2,'y':size['height']/2-min(size['width'],size['height']-260)*.13});assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).studio.slots).length')==1
  page.locator('#stExit').click();page.reload(wait_until='domcontentloaded');page.wait_for_function('document.getElementById("bMenu").onclick !== null');assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).studio.slots).length')==1
  assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).journal.music.instruments).length > 0')
  page.locator('#bMenu').click();page.locator('#bShare').click();assert page.locator('#shareImg').evaluate('(i)=>i.naturalWidth>0');assert not errors,errors
  print(label+': challenges, day rollover, paused lamp, studio persistence, sharing PASS',flush=True);c.close()
 b.close()
server.shutdown()
