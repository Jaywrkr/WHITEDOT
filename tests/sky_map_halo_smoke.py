"""Mapa del cielo (F1), its prize and its limits. Closing the zodiac gives the star halo round the cube (gold: earned),
with one notice naming it, worn at once and kept across a reload; Tu cubo → Llevar shows it under «Mapa del cielo» to
take off and put on again. The figures never appear in a round of a place, a chapter of the Journey or under its
finale, even with «?cielo=»; one scene at a time with the living encounters and the mischief scenes, both ways. In
English the words follow (Sky map · Cat). Screenshot of the cube with the halo at 390×844."""
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
def page_for(browser,query='',lang='es-ES'):
 page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['"+lang+"']});")
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(URL+query);page.wait_for_function('!!window.__r?.skyMapTick&&!!window.__r?.liveEncounterSpawn',timeout=20000);return page,errors
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# Joins the whole figure being joined, star by star, in the page's frames.
JOIN="""async()=>{const r=__r,{skyStar}=await import('/src/sky-map-model.js');for(let i=0;i<600;i++){const s=r.skyMapState().scene;if(!s||s.stage!=='run')break;const q=skyStar(s.site,s.site.lit),dx=q.x-r.S.wx,dy=q.y-r.S.wy,l=Math.hypot(dx,dy);if(l>.5){const k=Math.min(l,8);r.S.wx+=dx/l*k;r.S.wy+=dy/l*k;}await new Promise(f=>requestAnimationFrame(f));}return r.skyMapState().scene?.stage;}"""
TRAVEL="""async()=>{const r=__r;for(let i=0;i<300;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  # 1 · Eleven signs already in the map; Pisces closes the zodiac: the halo, one notice, worn at once.
  page,errors=page_for(browser,'?anillo=1');page.wait_for_timeout(500);page.evaluate(FREE)
  page.evaluate("async()=>{const r=__r,m=await import('/src/sky-map-model.js');r.skyMapTick(0);for(const f of m.skySeries('zodiaco').filter(f=>f.id!=='piscis'))r.S.skyMap.figures[f.id]={first:'2026-10-28',done:1,onTime:0};r.save();}")
  assert page.evaluate("__r.skyMapSpawn('piscis')");assert page.evaluate(JOIN)=='done'
  page.wait_for_function("(document.getElementById('toast')?.innerText||'').includes('Halo de estrellas')",timeout=5000);assert 'Zodiaco completo' in page.locator('#toast').inner_text()
  assert 'Constelación nueva' not in page.locator('#toast').inner_text(),'one notice, naming one thing'
  st=page.evaluate("(()=>{const r=__r;return {halo:r.S.skyMap.halo,wear:r.S.skyMap.wear,on:r.skyMapState().halo}})()");assert st['halo'] and st['wear']['halo'] is True and st['on'],st
  page.wait_for_function("!__r.skyMapState().scene",timeout=6000);page.wait_for_timeout(3200)
  page.evaluate("()=>{const p=document.getElementById('phrase');if(p)p.style.visibility='hidden';}")
  path=SHOTS/'kubono-f1-halo-de-estrellas-390.png';page.screenshot(path=str(path));shot=str(path)
  # Gold round the cube, never larger than it was: the cube itself is untouched.
  gold=page.evaluate("""(()=>{const c=document.querySelector('canvas'),x=c.getContext('2d'),dpr=c.width/innerWidth,cx=Math.round(c.width/2),cy=Math.round(c.height/2),R=Math.round(30*dpr),d=x.getImageData(cx-R,cy-R,2*R,2*R).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]>200&&d[i+1]>170&&d[i+1]<230&&d[i+2]<160)n++;return n;})()""")
  assert gold>4,('gold points round the cube',gold)
  # 2 · Tu cubo → Llevar: under «Mapa del cielo», earned; off and on again; kept across a reload.
  page.evaluate("()=>__r.openCube('wear')");page.wait_for_timeout(300)
  assert page.is_visible('#cubeSkySection') and page.get_attribute('#cubeSkyHalo','aria-pressed')=='true' and page.get_attribute('#cubeSkyHalo','data-earned')=='true'
  page.click('#cubeSkyHalo');page.wait_for_timeout(150);assert page.get_attribute('#cubeSkyHalo','aria-pressed')=='false' and page.evaluate('__r.S.skyMap.wear.halo')==False
  page.click('#cubeSkyHalo');page.wait_for_timeout(150);assert page.get_attribute('#cubeSkyHalo','aria-pressed')=='true'
  page.evaluate("()=>document.getElementById('cubeClose').click()")
  page.reload();page.wait_for_function('!!window.__r?.skyMapTick',timeout=20000);page.wait_for_timeout(400)
  assert page.evaluate("(()=>{__r.skyMapTick(0);return __r.skyMapState().halo&&__r.S.skyMap.figures.piscis.done===1})()"),'kept across a reload'
  page.evaluate("()=>{"+HIDE+";}")
  # The Bitácora's zodiac shows the prize.
  page.evaluate("()=>__r.openJournal('places')");page.wait_for_selector('#journalSkyMap')
  assert 'Halo de estrellas' in page.evaluate("document.querySelector('#journalSkyMap [data-sky-series=\"zodiaco\"]').textContent")
  assert not errors,errors;page.close()
  # 3 · One scene at a time with the living encounters and the mischief scenes, both ways.
  page,errors=page_for(browser,'?anillo=1');page.wait_for_timeout(500);page.evaluate(FREE)
  assert page.evaluate("__r.liveEncounterSpawn('polilla')");assert not page.evaluate("__r.skyMapSpawn('gato')"),'not while an encounter runs'
  page.evaluate("(()=>{__r.S.wx+=3000;})()");page.wait_for_function("!__r.liveEncounterState().scene",timeout=6000)
  assert page.evaluate("__r.skyMapSpawn('gato')");assert not page.evaluate("__r.liveEncounterSpawn('polilla')"),'no encounter while a figure is joined'
  site=page.evaluate("""async()=>{const {mischiefCell}=await import('/src/universe-mischief-model.js'),r=__r,x0=Math.floor(r.S.wx/1800),y0=Math.floor(r.S.wy/1800);
   for(let d=0;d<30;d++)for(let x=x0-d;x<=x0+d;x++)for(let y=y0-d;y<=y0+d;y++){for(const o of mischiefCell(x,y,r.seedOf,'superficie'))if(['rain','breath','twin'].includes(o.kind)&&!r.regionOfPos(o.x,o.y).sea&&!r.S.mischief?.done?.[o.id])return o;}return null;}""")
  assert site,'a mischief site nearby'
  # The cube walks onto the mischief site with its figure close by: no mischief scene while the figure runs.
  page.evaluate(f"(()=>{{const s=__r.skyMapState().scene.site;__r.S.wx={site['x']};__r.S.wy={site['y']};s.x={site['x']}+200;s.y={site['y']};}})()");page.wait_for_timeout(600)
  assert page.evaluate('!!__r.skyMapState().scene') and page.evaluate('!__r.mischiefState.scene'),'no mischief scene while a figure runs'
  page.evaluate("(()=>{__r.S.wx+=2400;})()");page.wait_for_function("!__r.skyMapState().scene",timeout=4000)
  page.evaluate(f"(()=>{{__r.S.wx={site['x']};__r.S.wy={site['y']};}})()");page.wait_for_function('!!__r.mischiefState.scene',timeout=20000)
  assert not page.evaluate("__r.skyMapSpawn('cubo')"),'no figure while a mischief scene plays'
  assert not errors,errors;page.close()
  # 4 · Never in a round, a chapter or under the Journey's finale, even with the shortcut.
  page,errors=page_for(browser,'?lugar=jardin&cielo=orion');page.wait_for_function('!!__r.placeRun?.()',timeout=8000);page.evaluate('__r.S.sound=false');page.evaluate(TRAVEL)
  assert page.evaluate('!__r.skyMapState().scene&&!__r.skyMapState().allowed') and not page.evaluate("__r.skyMapSpawn('orion')"),'not in a round'
  assert not errors,errors;page.close()
  page,errors=page_for(browser,'?cielo=orion')
  page.evaluate("()=>{"+HIDE+";const r=__r,s=r.S;s.sound=false;s.pathCrystals=Array.from({length:10},(_,i)=>'j:'+i);s.help.camino=s.help.mundo=true;r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();}")
  page.wait_for_timeout(300);assert page.evaluate("__r.journeyMode()=='viaje'&&__r.inWorld()&&__r.travelInLevel()")
  page.evaluate(TRAVEL);assert page.evaluate('!__r.skyMapState().scene') and not page.evaluate("__r.skyMapSpawn('orion')"),'not in a chapter'
  page.evaluate("()=>{const j=__r.S.journey;j.chapter=6;j.done={llanura:true,lago:true,bosque:true,tormenta:true,vacio:true};__r.save();}")
  page.evaluate('__r.journeyFinale()');page.wait_for_function('__r.journeyFinaleState().running',timeout=5000)
  assert not page.evaluate("__r.skyMapSpawn('orion')"),'not under the finale'
  assert not errors,errors;page.close()
  # 5 · English: the words follow.
  page,errors=page_for(browser,'?anillo=1&lang=en',lang='en-US');page.wait_for_timeout(500);page.evaluate(FREE)
  assert page.evaluate("__r.skyMapSpawn('gato')")
  words=page.evaluate("async()=>{const {translate}=await import('/src/i18n.js'),s=__r.skyMapState();return [translate(s.title),translate(s.hint),translate('Gato · 2 de 5 · guardada'),translate('Orión · completa · +30 ✦')]}")
  assert words==['Sky map · Cat','Pass through its stars in order.','Cat · 2 of 5 · saved','Orion · complete · +30 ✦'],words
  page.evaluate("()=>{__r.openJournal('places');}");page.wait_for_selector('#journalSkyMap');page.wait_for_timeout(200)
  text=page.evaluate("document.querySelector('#journalSkyMap summary').innerText");assert text=='Sky map · 0 of 28',text
  assert not errors,errors;page.close();browser.close()
 print('PASS sky map halo: the zodiac closed gives the star halo (one notice, gold round the cube, worn at once, kept across a reload), Tu cubo takes it off and on; one scene at a time with living encounters and mischief, both ways; never in a round, a chapter or the finale; English words; screenshot '+json.dumps(shot),flush=True)
finally:server.shutdown()
