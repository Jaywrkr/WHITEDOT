"""Mapa del cielo (F1, Jay, 28 Oct 2026): in the free World after the Journey, «?cielo=orion» brings Orion ahead of the
cube after a few seconds of travel, with its name. The next star is white with a ring and the white arrow points to it;
passing through the stars in order lights them (another star does nothing), a pulse on time near the next one lights it
and the one after; walking away leaves it half-done and saved, coming back resumes it; complete, it shines a moment,
pays its ✦ once (by difficulty, distance and rarity) with one notice and goes to the Bitácora («Mapa del cielo»), drawn, the others as silhouettes. A figure
of the map itself (from hashKey, no shortcut) starts when the cube walks to it. Screenshots at 390×844."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}/'
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
def page_for(browser,query=''):
 page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(URL+query);page.wait_for_function('!!window.__r?.skyMapTick&&!!window.__r?.liveEncounterSpawn',timeout=20000);return page,errors
# After the Journey and a first place seen, notices speak (achievements.js: the calm right after the Journey keeps them).
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# Walks the cube to star k of the figure being joined, in the page's own frames, and stops there.
WALK="""async([k,speed])=>{const r=__r,{skyStar}=await import('/src/sky-map-model.js');let last=performance.now();
 for(let i=0;i<400;i++){const s=r.skyMapState().scene;if(!s||s.site.lit>k)break;const q=skyStar(s.site,k),dx=q.x-r.S.wx,dy=q.y-r.S.wy,l=Math.hypot(dx,dy);
  await new Promise(f=>requestAnimationFrame(f));const now=performance.now(),step=Math.min(l,speed*Math.min(.05,(now-last)/1000));last=now;if(l>.5){r.S.wx+=dx/l*step;r.S.wy+=dy/l*step;}}
 return r.skyMapState().scene?.site.lit??null;}"""
SCENE="(()=>{const s=__r.skyMapState();return {scene:!!s.scene,id:s.scene?.site.id,fig:s.scene?.site.fig,lit:s.scene?.site.lit,stage:s.scene?.stage,title:s.title,hint:s.hint,summary:s.summary,saved:s.book.sites}})()"
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  shots=[]
  # 1 · The shortcut: a few seconds of travel in the free World bring Orion, ahead of the cube, with its name.
  page,errors=page_for(browser,'?anillo=1&cielo=orion');page.wait_for_timeout(500);page.evaluate(FREE)
  assert page.evaluate('__r.inWorld()&&!__r.travelInLevel()&&__r.skyMapState().allowed&&__r.skyMapState().forced==="orion"')
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<500&&!r.skyMapState().scene;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  st=page.evaluate(SCENE);assert st['scene'] and st['fig']=='orion' and st['lit']==0,st
  assert st['title']=='Mapa del cielo · Orión' and st['hint']=='Pasa por sus estrellas en orden.',st
  assert page.evaluate("!__r.liveEncounterSpawn('polilla')"),'one scene at a time'
  # 2 · In order: another star does nothing; the next lights; a pulse on time near the next counts (and the one after, if near).
  page.evaluate("""async()=>{const r=__r,{skyStar}=await import('/src/sky-map-model.js'),s=r.skyMapState().scene,q=skyStar(s.site,4);r.S.wx=q.x;r.S.wy=q.y;await new Promise(f=>setTimeout(f,150));}""")
  assert page.evaluate(SCENE)['lit']==0,'another star first does nothing'
  assert page.evaluate(WALK,[0,320])==1;assert page.evaluate(WALK,[1,320])==2
  lit=page.evaluate("""async()=>{const r=__r,{skyStar}=await import('/src/sky-map-model.js'),s=r.skyMapState().scene,q=skyStar(s.site,2),p=skyStar(s.site,3);r.S.wx=q.x+(q.x-p.x)*.2+90;r.S.wy=q.y+60;await new Promise(f=>setTimeout(f,120));
   r.waves.push({x:(q.x+p.x)/2,y:(q.y+p.y)/2,r:0,prev:0,max:340,n:0,origin:'player',beat:false});await new Promise(f=>setTimeout(f,150));const off=r.skyMapState().scene.site.lit;
   r.waves.push({x:(q.x+p.x)/2,y:(q.y+p.y)/2,r:0,prev:0,max:340,n:0,origin:'player',beat:true});await new Promise(f=>setTimeout(f,150));return [off,r.skyMapState().scene.site.lit,r.skyMapState().scene.site.onTime];}""")
  assert lit==[2,4,True],('off time does not count; on time counts double',lit)
  saved=page.evaluate(SCENE)['saved'];sid=page.evaluate(SCENE)['id'];assert saved[sid]['lit']==4,saved
  # Half-done, the next star marked: the screenshot.
  page.evaluate("""async()=>{const r=__r,{skyStar}=await import('/src/sky-map-model.js'),s=r.skyMapState().scene,q=skyStar(s.site,4),p=skyStar(s.site,3);r.S.wx=p.x+(q.x-p.x)*.35;r.S.wy=p.y+(q.y-p.y)*.35;}""")
  page.wait_for_timeout(700);path=SHOTS/'kubono-f1-orion-a-medias-390.png';page.screenshot(path=str(path));shots.append(str(path))
  # 3 · Walking away: half-done, saved where it was, a short line; the stars wait. Coming back resumes it.
  page.evaluate("(()=>{const s=__r.skyMapState().scene.site;__r.S.wx=s.x+1400;__r.S.wy=s.y;})()");page.wait_for_function("!__r.skyMapState().scene",timeout=4000)
  st=page.evaluate(SCENE);assert st['summary']=='Orión · 4 de 7 · guardada',st;assert st['saved'][sid]['lit']==4 and not st['saved'][sid]['done']
  page.reload();page.wait_for_function('!!window.__r?.skyMapTick',timeout=20000);page.wait_for_timeout(400);page.evaluate(FREE)
  assert page.evaluate(f"__r.S.skyMap.sites['{sid}'].lit")==4,'kept across a reload'
  page.evaluate(f"(()=>{{const s=__r.S.skyMap.sites['{sid}'];__r.S.wx=s.x;__r.S.wy=s.y;}})()");page.wait_for_function(f"__r.skyMapState().scene?.site.id==='{sid}'",timeout=4000)
  st=page.evaluate(SCENE);assert st['lit']==4 and st['title']=='Orión · 4 de 7' and st['hint']=='La dejaste aquí. Sigue.',st
  # 4 · Complete: it shines, its ✦ once (a pulse on time made it), one notice; then the summary.
  before=page.evaluate('__r.S.sparks')
  for k in range(4,7):assert page.evaluate(WALK,[k,320])==k+1 or page.evaluate(SCENE)['stage']=='done'
  page.wait_for_function("__r.skyMapState().scene?.stage==='done'",timeout=3000)
  # H1 (Jay, alpha.233): base 4 × difficulty (7 stars: ×1,5) × distance × rarity, ×1,5 on time; asked of the model where it is.
  exp=page.evaluate("async()=>{const m=await import('/src/sky-map-model.js'),s=__r.skyMapState().scene.site;return m.skyReward({...s,onTime:true},true);}")
  page.evaluate("(()=>{const s=__r.skyMapState().scene.site;__r.S.wx=s.x+40;__r.S.wy=s.y+150;const p=document.getElementById('phrase');if(p)p.style.visibility='hidden';})()");page.wait_for_timeout(350)
  path=SHOTS/'kubono-f1-orion-completa-390.png';page.screenshot(path=str(path));shots.append(str(path))
  page.wait_for_function("(document.getElementById('toast')?.innerText||'').includes('Constelación nueva')",timeout=5000);assert 'Orión' in page.locator('#toast').inner_text()
  q=page.evaluate("(()=>{const r=__r;return {sparks:r.S.sparks,earned:r.S.skyMap.earned,fig:r.S.skyMap.figures.orion,log:r.sparkEconomy.log.at(-1)}})()")
  assert exp>=9 and q['earned']==exp and q['sparks']>=before+exp and q['fig']['done']==1 and q['fig']['onTime']==1 and q['log']['text']==f'Mapa del cielo · +{exp} chispas',(q,exp)
  page.wait_for_function("!__r.skyMapState().scene",timeout=6000);assert page.evaluate(SCENE)['summary']==f'Orión · completa · +{exp} ✦'
  # 5 · The Bitácora: «Mapa del cielo», Orion drawn, the rest as silhouettes, the series' progress.
  page.evaluate("()=>{__r.openJournal('places');}");page.wait_for_selector('#journalSkyMap')
  page.evaluate("()=>{const d=document.getElementById('journalSkyMap');d.open=true;d.querySelector('[data-sky-series=sur]').scrollIntoView({block:'start'});}");page.wait_for_timeout(300)
  info=page.evaluate("""(()=>{const d=document.getElementById('journalSkyMap');return {summary:d.querySelector('summary').innerText,done:[...d.querySelectorAll('[data-state="done"]')].map(a=>a.dataset.skyFigure),none:d.querySelectorAll('[data-state="none"]').length,heads:[...d.querySelectorAll('h3.sky-series')].map(h=>h.innerText),mano:d.querySelector('[data-sky-figure="mano"] h4').innerText}})()""")
  assert info['summary']=='Mapa del cielo · 1 de 28' and info['done']==['orion'] and info['none']==27 and info['mano']=='???',info
  assert 'Cielo del sur · 1 de 3' in info['heads'] and 'Zodiaco · 0 de 12' in info['heads'],info
  path=SHOTS/'kubono-f1-bitacora-mapa-del-cielo-390.png';page.screenshot(path=str(path));shots.append(str(path))
  page.evaluate("()=>{document.getElementById('journalClose').click();}")
  # 6 · Another Orion pays nothing and says so.
  page.evaluate("(()=>{__r.S.wx+=6000;})()");page.wait_for_timeout(200)
  assert page.evaluate("__r.skyMapSpawn('orion')");assert page.evaluate(SCENE)['title']=='Orión · ya en tu mapa'
  for k in range(7):page.evaluate(WALK,[k,400])
  page.wait_for_function("!__r.skyMapState().scene",timeout=6000);assert page.evaluate(SCENE)['summary']=='Orión · completa · ya en tu mapa' and page.evaluate('__r.S.skyMap.earned')==exp
  assert not errors,errors;page.close()
  # 7 · A figure of the map itself (no shortcut): from hashKey, near the cube; walking to it starts it with its name.
  page,errors=page_for(browser,'?anillo=1');page.wait_for_timeout(500);page.evaluate(FREE)
  site=page.evaluate("""async()=>{const r=__r,m=await import('/src/sky-map-model.js'),{hashKey,newRegionOf}=await import('/src/universe-regions.js'),world=Math.floor(hashKey(JSON.stringify(r.worldIdentity))*4294967296).toString(36),
   under=(x,y)=>{const d=r.regionOfPos(x,y);return {biome:d?.sea?'vacio':r.BIOMES?.[d?.z]?.id||'vacio',region:d?.sea?newRegionOf(d.key,true)?.id||null:null};},i0=Math.floor(r.S.wx/m.SKY_CELL),j0=Math.floor(r.S.wy/m.SKY_CELL);
   for(let d=0;d<12;d++)for(let i=i0-d;i<=i0+d;i++)for(let j=j0-d;j<=j0+d;j++){if(Math.max(Math.abs(i-i0),Math.abs(j-j0))!==d)continue;const s=m.skyCell(world,i,j,under,{night:m.skyNight()});if(s)return s;}return null;}""")
  assert site,'a figure in the map nearby'
  page.evaluate(f"(()=>{{__r.S.wx={site['x']}-1200;__r.S.wy={site['y']};}})()");page.wait_for_timeout(300)
  assert not page.evaluate('__r.skyMapState().scene')
  assert any(n['id']==site['id'] for n in page.evaluate('__r.skyMapState().near')),'seen from 1.2 km: something to see'
  page.evaluate(f"""async()=>{{const r=__r;for(let i=0;i<400&&!r.skyMapState().scene;i++){{r.S.wx=Math.min({site['x']},r.S.wx+6);await new Promise(f=>requestAnimationFrame(f));}}}}""")
  st=page.evaluate(SCENE);assert st['scene'] and st['id']==site['id'] and st['fig']==site['fig'],(st,site)
  assert st['title'].startswith('Mapa del cielo · '),st
  assert not errors,errors;page.close();browser.close()
 print('PASS sky map: «?cielo=orion» brings Orion ahead with its name; joined in order (another star does nothing, off time does not count, a pulse on time counts double), saved with each star, left half-done and kept across a reload, resumed; complete: 30 ✦ once with one notice and its summary; the Bitácora draws it among 27 silhouettes with the series; a repeat pays nothing; a figure of the map itself starts when walked to; screenshots '+json.dumps(shots),flush=True)
finally:server.shutdown()
