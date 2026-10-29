"""Mapa del universo (alpha.235): what is yours on the map and the mark. A figure of the Mapa del cielo complete and one
half done, a living encounter caught (a real one, recorded where it ended), a rumour heard and the Refugio show; a tap on
a far point opens a card with «Marcar» (no «Ir»: nothing there can be travelled to), the compass by the cube and the line
under the HUD lead to the mark, it survives a reload, «Quitar marca» removes it and reaching it clears it. The mini map
in Ajustes: off by default, on in a corner that covers neither the HUD nor the notices, a tap opens the map, off again.
Screenshots go to $KUBONO_MAP_CAPTURES (a temporary folder when unset)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,math,tempfile
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('KUBONO_MAP_CAPTURES') or tempfile.mkdtemp(prefix='kubono-map-'));OUT.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
WALK="""()=>{const r=__r,RP=r.REG*r.WCH,c=r.ringState().center;for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++){if(Math.abs(i)+Math.abs(j)>5)continue;r.S.places[(Math.floor(c.x/RP)+i)+','+(Math.floor(c.y/RP)+j)]=1;}document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);}"""
# Two figures of the Mapa del cielo near the ring (one complete, one half done) and a landmark only heard.
SKY="""()=>{const r=__r,c=r.ringState().center,q=r.S.skyMap||(r.S.skyMap={version:1,figures:{},sites:{},earned:0,halo:null,wear:{}});q.version=1;q.sites||={};q.figures||={};
 q.sites['map:orion']={fig:'orion',x:c.x+2600,y:c.y-1800,turn:0,lit:7,done:true,onTime:false,at:r.S.todayKey||''};q.figures.orion={first:r.S.todayKey||'',done:1,onTime:0};
 q.sites['map:casiopea']={fig:'casiopea',x:c.x-2400,y:c.y+2200,turn:.2,lit:2,done:false,onTime:false,at:''};
 const RP=r.REG*r.WCH;r.S.heardLm||={};r.S.heardLm['lm:9,9']=[Math.floor(c.x/RP)+3,Math.floor(c.y/RP)-3,'torre'];r.save();}"""
CATCH="""async()=>{const r=__r;for(let i=0;i<120;i++){const s=r.liveEncounterState().scene;if(!s)break;if(s.stage==='run'){r.S.wx=s.x-40;r.S.wy=s.y;r.waves.push({x:r.S.wx,y:r.S.wy,r:0,prev:0,max:340,n:0,origin:'player',beat:true});}await new Promise(f=>setTimeout(f,120));}const s=r.liveEncounterState();return s.scene?{stage:s.scene.stage,paid:s.scene.paid,allowed:s.allowed,modal:[...document.querySelectorAll(".modal:not([hidden])")].map(m=>m.id)}:null}"""
def state(page):return page.evaluate('__r.universeMapState()')
def icon(page,kind,id=None):
 return next((d for d in state(page)['drawn'] if d['kind']==kind and (id is None or d.get('id')==id)),None)
def heading(page):
 r=page.evaluate('__r.ringRoute()');return r
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  base=f'http://127.0.0.1:{server.server_port}/?anillo=1'
  page.goto(base);page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active&&!!__r.liveEncounterSpawn",timeout=20000)
  page.evaluate(WALK);page.evaluate(SKY)
  assert page.evaluate('__r.S.universeMap.version')==1 and page.evaluate('__r.S.universeMap.mark') is None and page.evaluate('__r.S.universeMap.mini')==False
  # A real living encounter, caught: it stays on the map where it ended.
  c=page.evaluate('__r.ringState().center');page.evaluate(f"()=>{{__r.S.wx={c['x']+1500};__r.S.wy={c['y']+300};}}");page.wait_for_timeout(300)
  assert page.evaluate("__r.liveEncounterSpawn('polilla')");left=page.evaluate(CATCH);assert left is None,left
  live=page.evaluate('__r.S.universeMap.live');assert len(live)==1 and live[0]['k']=='polilla' and live[0]['w'],live
  page.evaluate(f"()=>{{__r.S.wx={c['x']};__r.S.wy={c['y']+400};document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}}");page.wait_for_timeout(600)
  page.locator('#bUniverseMap').click();page.wait_for_timeout(200)
  kinds={d['kind'] for d in state(page)['drawn']};assert {'sky','live','heard','place','me'}<=kinds,kinds
  assert {'refugio','ringHome'}&kinds,kinds
  items={i['id']:i for i in state(page)['items']};assert items['map:orion']['name']=='Orión' and items['map:casiopea']['name']=='Casiopea'
  page.screenshot(path=str(OUT/'mapa-lo-tuyo-390x844.png'))
  # The half-done figure: its card says how far it is; it can only be marked.
  cas=icon(page,'sky','map:casiopea');page.mouse.click(cas['x'],cas['y']);page.wait_for_function("!document.getElementById('umapCard').hidden")
  assert page.inner_text('#umapCardName')=='Casiopea' and 'Constelación · 2 de 5' in page.inner_text('#umapCardWhat') and page.locator('#umapGo').is_hidden() and page.inner_text('#umapMark')=='Marcar'
  lv=icon(page,'live');page.mouse.click(lv['x'],lv['y']);page.wait_for_timeout(100);assert page.inner_text('#umapCardName')=='Polilla de luz' and 'logrado' in page.inner_text('#umapCardWhat'),page.inner_text('#umapCard')
  # A far point in the dark: «Marcar», no «Ir».
  page.locator('#umapOut').click();page.wait_for_timeout(150);page.mouse.click(70,640);page.wait_for_function("!document.getElementById('umapCard').hidden")
  assert page.locator('#umapGo').is_hidden() and page.locator('#umapMark').is_visible() and page.inner_text('#umapMark')=='Marcar' and 'de ti' in page.inner_text('#umapCardDist')
  page.screenshot(path=str(OUT/'mapa-tarjeta-marcar-390x844.png'))
  sparks=page.evaluate('__r.S.sparks');pos=page.evaluate('[__r.S.wx,__r.S.wy]')
  page.locator('#umapMark').click();page.wait_for_timeout(150)
  mark=page.evaluate('__r.S.universeMap.mark');assert mark and page.inner_text('#umapMark')=='Quitar marca',mark
  assert page.evaluate('[__r.S.wx,__r.S.wy]')==pos and page.evaluate('__r.S.sparks')==sparks,'marking moves nothing and costs nothing'
  assert icon(page,'mark'),'the mark is drawn'
  page.keyboard.press('Escape');page.keyboard.press('Escape');page.wait_for_timeout(300);assert page.locator('#mUniverseMap').is_hidden()
  # The compass by the cube and the line under the HUD lead to the mark.
  page.wait_for_function("!document.getElementById('ringRoute').hidden",timeout=3000)
  r=heading(page);assert r['id']=='mark' and r['name']=='Tu marca' and 'Tu marca' in page.inner_text('#ringRoute'),(r,page.inner_text('#ringRoute'))
  x,y=page.evaluate('[__r.S.wx,__r.S.wy]');assert abs(math.atan2(r['dy'],r['dx'])-math.atan2(mark['y']-y,mark['x']-x))<1e-6
  page.screenshot(path=str(OUT/'mundo-brujula-marca-390x844.png'))
  # It is kept: after a reload the compass still leads to it.
  page.wait_for_timeout(2300);page.reload();page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000);page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)")
  assert page.evaluate('__r.S.universeMap.mark')==mark and heading(page)['id']=='mark'
  # «Quitar marca» from the mark's card: the compass goes back to the next place.
  page.locator('#bUniverseMap').click();page.wait_for_timeout(200);page.locator('#umapOut').click();page.wait_for_timeout(150)
  m=icon(page,'mark');assert m,state(page)['drawn'];page.mouse.click(m['x'],m['y']);page.wait_for_timeout(100)
  assert page.inner_text('#umapCardName')=='Tu marca' and page.inner_text('#umapMark')=='Quitar marca';page.locator('#umapMark').click();page.wait_for_timeout(100)
  assert page.evaluate('__r.S.universeMap.mark') is None and heading(page)['id']=='jardin'
  # One mark at a time; reaching it clears it.
  page.mouse.click(300,250);page.locator('#umapMark').click();first=page.evaluate('__r.S.universeMap.mark')
  page.mouse.click(90,300);page.locator('#umapMark').click();second=page.evaluate('__r.S.universeMap.mark');assert second!=first and len([d for d in state(page)['drawn'] if d['kind']=='mark'])==1
  page.locator('#umapClose').click();page.evaluate(f"()=>{{__r.S.wx={second['x']+50};__r.S.wy={second['y']};}}");page.wait_for_timeout(400)
  assert page.evaluate('__r.S.universeMap.mark') is None and heading(page)['id']!='mark','reached: the mark is gone'
  # «Seguir hacia» from Lugares takes the compass back from a mark.
  page.locator('#bUniverseMap').click();page.wait_for_timeout(150);page.mouse.click(300,250);page.locator('#umapMark').click();page.locator('#umapClose').click()
  assert heading(page)['id']=='mark';page.evaluate("__r.ringGuide('jardin')");assert page.evaluate('__r.S.universeMap.mark') is None and heading(page)['id']=='jardin'
  # A whole distance ring discovered is won: kept with its day, drawn gold; the header moves on to the next ring.
  page.evaluate("""()=>{const r=__r,RP=r.REG*r.WCH,R=50000,n=Math.ceil(R/RP)+1;for(let x=-n;x<=n;x++)for(let y=-n;y<=n;y++)if(Math.hypot((x+.5)*RP,(y+.5)*RP)<=R)r.S.places[x+','+y]=1;r.universeMapTick();}""")
  assert page.evaluate("__r.S.universeMap.bands['5']")==page.evaluate('__r.S.todayKey')
  page.locator('#bUniverseMap').click();page.evaluate("__r.universeMapLevel('universo')");page.wait_for_timeout(200)
  b=state(page)['bands'];assert b[0]['complete'] and b[0]['pct']==100 and not b[1]['complete'],b;assert page.inner_text('#umapShare').startswith('Hasta 20 km'),page.inner_text('#umapShare')
  ring5=icon(page,'band','5');assert ring5 and ring5['complete'] and ring5['r']>20,ring5
  # Gold pixels on the ring's line, where it crosses the dark outside the disc.
  gold=page.evaluate("""b=>{const c=document.getElementById('umapCv'),k=c.width/c.clientWidth,x=c.getContext('2d');let n=0;for(let a=0;a<360;a+=3){const px=Math.round((b.x+Math.cos(a*Math.PI/180)*b.r)*k),py=Math.round((b.y+Math.sin(a*Math.PI/180)*b.r)*k);const d=x.getImageData(px-2,py-2,5,5).data;for(let i=0;i<d.length;i+=4)if(d[i]>140&&d[i]-d[i+2]>50&&d[i+1]-d[i+2]>30){n++;break;}}return n}""",ring5)
  assert gold>40,'the full ring is gold: '+str(gold)
  page.screenshot(path=str(OUT/'mapa-5km-ganado-390x844.png'));page.locator('#umapClose').click()
  # The mini map: off by default; on, in a corner, clear of the HUD and the notices; a tap opens the map.
  assert page.locator('#miniMap').is_hidden() and state(page)['miniDraws']==0,'off by default, never drawn'
  page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.locator('#bSettings').click()
  assert not page.locator('#miniMapSetting').is_checked();page.locator('#miniMapSetting').check();page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  page.wait_for_function("!document.getElementById('miniMap').hidden",timeout=3000);page.wait_for_timeout(600)
  assert page.evaluate('__r.S.universeMap.mini')==True and state(page)['miniDraws']>0
  mini=page.locator('#miniMap').bounding_box();assert mini['x']>=8 and mini['y']+mini['height']<=844 and mini['width']<=96,mini
  page.evaluate("__r.toast('Prueba de aviso',{force:true})");page.wait_for_timeout(300)
  def overlap(a,b):return a and b and a['width']>0 and b['width']>0 and not(a['x']+a['width']<=b['x'] or b['x']+b['width']<=a['x'] or a['y']+a['height']<=b['y'] or b['y']+b['height']<=a['y'])
  for sel in ['.hud','#toast','#ringRoute','#bMenu','#bUniverseMap','#zone','.goal']:
   el=page.locator(sel).first
   if el.count() and el.is_visible():assert not overlap(mini,el.bounding_box()),(sel,mini,el.bounding_box())
  page.screenshot(path=str(OUT/'mini-mapa-390x844.png'))
  page.locator('#miniMap').click();page.wait_for_timeout(150);assert not page.locator('#mUniverseMap').is_hidden() and page.locator('#miniMap').is_hidden(),'a tap opens the map; the mini map hides under it'
  page.keyboard.press('Escape');page.evaluate("()=>__r.startPlace('lago')");page.wait_for_timeout(700);assert page.locator('#miniMap').is_hidden(),'no mini map inside a round'
  page.evaluate("__r.abandonPlace()");page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.wait_for_function("!document.getElementById('miniMap').hidden",timeout=4000)
  page.locator('#bMenu').click();page.locator('#bSettings').click();page.locator('#miniMapSetting').uncheck();page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
  page.wait_for_function("document.getElementById('miniMap').hidden",timeout=3000);assert page.evaluate('__r.S.universeMap.mini')==False
  n=state(page)['miniDraws'];page.wait_for_timeout(1200);assert state(page)['miniDraws']==n,'off: never drawn'
  assert not errors,errors
  browser.close()
finally:server.shutdown()
print('PASS universe map marks: figures, encounters, rumours and the Refugio on the map; Marcar, compass, reload, Quitar marca, arrival, one mark; mini map on and off · '+str(OUT))
