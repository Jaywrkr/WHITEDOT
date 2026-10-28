"""Living encounters, clearer (Jay, 28 Oct 2026, alpha.230), on a 390×844 phone, one of each verb (polilla, ola, motas):
the start draws its name and verb («Polilla de luz · atrápala»), a thin white ring of the time left round the cube and a
white arrow to the next step; a win bursts in the biome's light and leaves «Polilla · atrapada · +15 ✦»; a loss drifts
away fading with its goodbye and leaves «… · sin premio». With «Textos en el universo» off the words go, the ring and the
arrow stay (as in the quiet view, which writes no words in the World). Rules and rewards are the ones of tests/live-encounters.mjs; here only what the player sees."""
from playwright.sync_api import sync_playwright
from live_do_helpers import serve,page_for,HIDE,FIND,DRIVE,GONE,SHOTS
import os,shutil
# What the World's canvas draws in a frame: the words (after «Textos en el universo»), white arcs round the cube and
# white filled shapes (the arrow).
WATCH="""()=>{const r=__r,c=r.cx;if(c.__watched)return;c.__watched=true;window.__drawn={texts:[],rings:[],white:0};const fill=c.fillText,arc=c.arc,f=c.fill;
 c.fillText=function(t,...a){if(r.inWorld()&&r.S.universeTexts!==false&&!r.journeyQuiet())__drawn.texts.push({t:String(t),font:this.font,fill:this.fillStyle,w:this.measureText(String(t)).width});return fill.call(this,t,...a);};
 c.arc=function(x,y,rad,a0,a1,...rest){if(Math.abs(x-r.W/2)<1&&Math.abs(y-r.H/2)<1&&rad===20&&this.strokeStyle==='#ffffff')__drawn.rings.push({sweep:a1-a0,alpha:this.globalAlpha});return arc.call(this,x,y,rad,a0,a1,...rest);};
 c.fill=function(...a){if(this.fillStyle==='#ffffff')__drawn.white++;return f.apply(this,a);};}"""
FRAME="()=>new Promise(res=>{__drawn.texts=[];__drawn.rings=[];__drawn.white=0;requestAnimationFrame(()=>requestAnimationFrame(()=>res(JSON.parse(JSON.stringify(__drawn)))))})"
SUMMARY="t=>__r.liveEncounterState().summary===t"
server=serve()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page,errors=page_for(browser,f'http://127.0.0.1:{server.server_port}/?anillo=1')
  page.wait_for_function('__r.inWorld()&&__r.liveEncounterState().allowed',timeout=20000)
  # The full view, as after the Journey (the quiet view writes no words in the World, these included).
  page.evaluate("()=>{"+HIDE+";const r=__r;r.S.sound=false;r.setJourneyMode('libre');r.stopAutopilot?.();r.save();}");page.evaluate(WATCH)
  assert page.evaluate('__r.journeyMode()')=='libre'
  shots=[]
  def shot(name):
   p=SHOTS/f'kubono-ae-{name}-390.png';page.screenshot(path=str(p));shots.append(str(p))
  def start(kind,biome,title):
   spot=page.evaluate(FIND,biome);assert spot,biome
   page.evaluate("p=>{const r=__r;r.S.wx=p.x;r.S.wy=p.y;}",spot);page.wait_for_timeout(250);page.evaluate(HIDE)
   assert page.evaluate(f"__r.liveEncounterSpawn('{kind}')"),kind;page.wait_for_timeout(350)
   st=page.evaluate("__r.liveEncounterState()");assert st['title']==title and st['hint'],st['title']
   f=page.evaluate(FRAME);t=[x for x in f['texts'] if x['t']==title]
   # The notice: white, 12 px, whole on the phone; the ring of the time left and the white arrow by the cube.
   assert t and t[0]['fill']=='#ffffff' and '12px' in t[0]['font'] and t[0]['w']<=358,(kind,f['texts'])
   assert any(r['alpha']>.5 and r['sweep']>0 for r in f['rings']),(kind,'time ring',f['rings'])
   assert f['white']>=1,(kind,'white arrow')
   return spot
  def ending(kind,summary,name,bye=None):
   # Never a cut: a few frames after the end the encounter is still drawn (burst or fading drift), then its summary.
   page.wait_for_function("__r.liveEncounterState().scene&&__r.liveEncounterState().scene.stage!=='run'",timeout=20000)
   page.wait_for_timeout(250);s=page.evaluate("__r.liveEncounterState().scene");assert s and s['stage']!='run',kind
   if bye:assert page.evaluate("__r.liveEncounterState().line")==bye,kind;f=page.evaluate(FRAME);assert any(x['t']==bye for x in f['texts']),(kind,f['texts'])
   shot(name)
   page.wait_for_function(SUMMARY,arg=summary,timeout=5000);f=page.evaluate(FRAME);t=[x for x in f['texts'] if x['t']==summary]
   assert t and t[0]['w']<=358,(kind,f['texts'])
   shot(name+'-resumen');page.wait_for_function("!__r.liveEncounterState().summary",timeout=6000)
  # Chase: the moth, caught with a pulse on time; then one that gets away.
  start('polilla','llanura','Polilla de luz · atrápala');shot('polilla-inicio')
  got=page.evaluate(DRIVE,['pulse',20]);assert got['stage']=='caught',got
  ending('polilla','Polilla · atrapada · +15 ✦','polilla-gana')
  start('polilla','llanura','Polilla de luz · atrápala');page.evaluate("__r.S.wx+=1600")
  ending('polilla','Polilla · se escapó · sin premio','polilla-escapa','La polilla se fue volando.')
  # Flee: the wave, reached by walking to the white ring; then standing still, it reaches the cube.
  start('ola','lago','Ola gigante · llega al anillo');shot('ola-inicio')
  got=page.evaluate(DRIVE,['walk',14]);assert got['stage']=='safe',got
  ending('ola','Ola · a salvo · +10 ✦','ola-gana')
  start('ola','lago','Ola gigante · llega al anillo')
  ending('ola','Ola · te alcanzó · sin premio','ola-escapa','La ola te mojó. Ya pasó.')
  # Do: the five motes, sown with pulses on time; then walking away from them.
  start('motas','llanura','Cinco motas · siémbralas en orden');shot('motas-inicio')
  got=page.evaluate(DRIVE,['pulse',25]);assert got['stage']=='done',got
  ending('motas','Motas · hecho · +15 ✦','motas-gana')
  start('motas','llanura','Cinco motas · siémbralas en orden');page.evaluate("__r.S.wx+=1600")
  ending('motas','Motas · sin terminar · sin premio','motas-escapa','El viento guardó las motas.')
  # «Textos en el universo» off: no words, the ring and the arrow stay.
  page.evaluate("()=>{__r.S.universeTexts=false;}");spot=page.evaluate(FIND,'llanura');page.evaluate("p=>{__r.S.wx=p.x;__r.S.wy=p.y;}",spot)
  assert page.evaluate("__r.liveEncounterSpawn('polilla')");page.wait_for_timeout(300);f=page.evaluate(FRAME)
  assert not f['texts'] and any(r['alpha']>.5 for r in f['rings']) and f['white']>=1,f
  assert not errors,errors;browser.close()
 print('PASS living encounters, clearer, on 390×844: name and verb at the start, the time ring and the white arrow, a visible end (burst or fading goodbye) and one summary line for chase, flee and do; words off with «Textos en el universo»',flush=True)
 print('\n'.join(shots),flush=True)
finally:server.shutdown()
