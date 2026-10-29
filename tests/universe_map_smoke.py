"""Mapa del universo (alpha.235): a screen of its own, opened with one touch from the World (#bUniverseMap) and from the
Bitácora's map («Abrir el mapa» and a tap on the drawing). Three zooms with + and − (Anillo, Región, Universo), the wheel
and dragging; «centrar en mí»; a tap on a place of the ring opens its card with «Ir», which travels beside its portal;
Escape closes the card first and then the map; nothing is drawn while it is closed; at 390×844 and 1280×800.
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
# Regions walked around the ring (the fog opens there) and a far patch.
WALK="""()=>{const r=__r,RP=r.REG*r.WCH,c=r.ringState().center;for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++){if(Math.abs(i)+Math.abs(j)>5)continue;r.S.places[(Math.floor(c.x/RP)+i)+','+(Math.floor(c.y/RP)+j)]=1;}
 for(const k of ['14,3','15,3','15,4'])r.S.places[k]=1;document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);}"""
def state(page):return page.evaluate('__r.universeMapState()')
def level(page):return page.inner_text('#umapLevel').strip()
def icon(page,kind,id=None):
 for d in state(page)['drawn']:
  if d['kind']==kind and (id is None or d.get('id')==id):return d
 return None
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   tag=f'{width}x{height}'
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   page.evaluate(WALK);page.wait_for_function("!document.getElementById('bUniverseMap').hidden",timeout=3000)
   # One touch from the World: the button in the dock, beside the menu, inside the screen.
   box=page.locator('#bUniverseMap').bounding_box();menu=page.locator('#bMenu').bounding_box()
   assert box and box['width']>=44 and box['height']>=44 and box['x']+box['width']<=menu['x'] and box['y']+box['height']<=height,(box,menu)
   page.locator('#bUniverseMap').click();page.wait_for_function("!document.getElementById('mUniverseMap').hidden",timeout=3000);page.wait_for_timeout(200)
   s=state(page);assert s['open'] and s['level']=='region' and level(page)=='Región',s['level']
   assert s['fogCells']>=40 and any(d['kind']=='me' for d in s['drawn']) and any(d['kind']=='place' for d in s['drawn']),s['drawn']
   assert 'Hasta 5 km' in page.inner_text('#umapShare') and '%' in page.inner_text('#umapShare'),page.inner_text('#umapShare')
   # The canvas fills the screen and is not left blank: colour where you walked (the fog is lifted there only).
   colors=page.evaluate("""()=>{const c=document.getElementById('umapCv'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let lit=0,black=0;for(let i=0;i<d.length;i+=16){const m=Math.max(d[i],d[i+1],d[i+2]);if(m>30)lit++;else black++;}return {lit,black,w:c.width,h:c.height}}""")
   assert colors['lit']>500 and colors['black']>colors['lit'],colors
   page.screenshot(path=str(OUT/f'mapa-region-{tag}.png'))
   page.locator('#umapIn').click();page.wait_for_timeout(150);assert level(page)=='Anillo' and state(page)['level']=='anillo'
   assert page.locator('#umapIn').is_disabled(),'the ring is the closest zoom'
   ring=page.evaluate('__r.ringState()');v=state(page)['view'];assert abs(v['x']-ring['center']['x'])<1 and abs(v['y']-ring['center']['y'])<1,'the ring on its centre'
   places=[d for d in state(page)['drawn'] if d['kind']=='place'];assert len(places)==11,places
   tools=page.locator('.umap-tools').bounding_box()
   assert all(not(tools['x']-8<=d['x']<=tools['x']+tools['width']+8 and tools['y']-8<=d['y']<=tools['y']+tools['height']+8) for d in places),'no place under the buttons'
   page.screenshot(path=str(OUT/f'mapa-anillo-{tag}.png'))
   page.locator('#umapOut').click();page.wait_for_timeout(100);assert level(page)=='Región'
   page.locator('#umapOut').click();page.wait_for_timeout(150);assert level(page)=='Universo' and page.locator('#umapOut').is_disabled()
   v=state(page)['view'];assert v['x']==0 and v['y']==0,'the universe on the origin'
   assert icon(page,'ring'),'far out the eleven places are one small ring'
   page.screenshot(path=str(OUT/f'mapa-universo-{tag}.png'))
   # The wheel zooms around the pointer; dragging moves; «centrar en mí» brings you back to the middle.
   before=state(page)['view']['scale'];page.mouse.move(width/2,height/2);page.mouse.wheel(0,-600);page.wait_for_timeout(150);assert state(page)['view']['scale']>before*1.5
   v0=state(page)['view'];page.mouse.move(width/2,height/2);page.mouse.down();page.mouse.move(width/2+80,height/2+40,steps=6);page.mouse.up();page.wait_for_timeout(100)
   v1=state(page)['view'];assert v1['x']<v0['x'] and v1['y']<v0['y'] and state(page)['card'] is None,'a drag moves the map and opens no card'
   page.locator('#umapMe').click();page.wait_for_timeout(100);v=state(page)['view'];me=page.evaluate('[__r.S.wx,__r.S.wy]');assert abs(v['x']-me[0])<1 and abs(v['y']-me[1])<1
   # A place of the ring with ★ (the five of the Journey): its card offers «Ir», which travels beside its portal.
   for _ in range(3):
    if level(page)=='Anillo':break
    page.locator('#umapIn').click();page.wait_for_timeout(150)
   assert level(page)=='Anillo'
   lago=icon(page,'place','lago');assert lago,state(page)['drawn']
   page.mouse.click(lago['x'],lago['y']);page.wait_for_function("!document.getElementById('umapCard').hidden",timeout=2000)
   assert page.inner_text('#umapCardName')=='Lago' and page.locator('#umapGo').is_visible() and page.inner_text('#umapGo')=='Ir' and page.locator('#umapMark').is_hidden()
   assert 'de ti' in page.inner_text('#umapCardDist') and 'Lugar del anillo' in page.inner_text('#umapCardWhat')
   assert page.evaluate("getComputedStyle(document.getElementById('umapLegend')).display")=='none','the card replaces the legend'
   page.screenshot(path=str(OUT/f'mapa-tarjeta-ir-{tag}.png'))
   # Escape: first the card, then the map; nothing is drawn while it is closed.
   page.keyboard.press('Escape');page.wait_for_timeout(100);assert page.locator('#umapCard').is_hidden() and not page.locator('#mUniverseMap').is_hidden()
   page.mouse.click(lago['x'],lago['y']);page.wait_for_function("!document.getElementById('umapCard').hidden",timeout=2000)
   spark=page.evaluate('__r.S.sparks');page.locator('#umapGo').click();page.wait_for_timeout(200)
   assert page.locator('#mUniverseMap').is_hidden(),'Ir closes the map'
   s=page.evaluate("__r.ringState().spots.find(q=>q.id==='lago')");x,y=page.evaluate('[__r.S.wx,__r.S.wy]');assert math.hypot(x-s['x'],y-s['y'])<200 and page.evaluate('__r.S.sparks')==spark,'free, beside the Lago'
   d0=state(page)['draws'];page.wait_for_timeout(800);assert state(page)['draws']==d0,'nothing is drawn while the map is closed'
   page.locator('#bUniverseMap').click();page.wait_for_timeout(150);page.keyboard.press('Escape');page.wait_for_timeout(100);assert page.locator('#mUniverseMap').is_hidden(),'Escape closes the map'
   page.locator('#bUniverseMap').click();page.wait_for_timeout(100);page.locator('#umapClose').click();assert page.locator('#mUniverseMap').is_hidden(),'× closes it'
   # From the Bitácora: its map draws the same fog; «Abrir el mapa» and a tap on the drawing open the whole screen.
   page.evaluate('__r.openMap()');page.wait_for_function("!document.getElementById('mJournal').hidden",timeout=3000);page.wait_for_timeout(200)
   assert page.inner_text('#mapZoom')=='Abrir el mapa' and page.locator('#journalMapPart').is_visible() and not page.locator('#ringTravel').is_hidden()
   page.locator('#mapZoom').click();page.wait_for_timeout(150);assert page.locator('#mJournal').is_hidden() and not page.locator('#mUniverseMap').is_hidden() and level(page)=='Universo'
   page.locator('#umapClose').click();page.evaluate('__r.openMap()');page.wait_for_timeout(200);page.locator('#mapCv').click();page.wait_for_timeout(150)
   assert not page.locator('#mUniverseMap').is_hidden(),'a tap on the drawing opens it';page.keyboard.press('Escape')
   if width==390:
    # Far from the ring (beyond where its next portal is heard): far out the ring is one small mark and its card offers
    # «Volver al anillo»; on the ring, the next place offers «Ir» (free, only that one), another place not yet entered
    # can only be marked; a favourite offers «Ir» (as in Favoritos).
    c=page.evaluate('__r.ringState().center');page.evaluate(f"()=>{{__r.S.wx={c['x']+2500};__r.S.wy={c['y']-2500};__r.addFavorite('Mi rincón');}}")
    fav=page.evaluate("__r.favorites.at(-1)");assert fav and fav['name']=='Mi rincón',fav
    page.evaluate("()=>{const r=__r;r.S.wx+=77000;r.S.wy+=1200;r.save();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}");page.wait_for_timeout(300);assert page.evaluate('__r.ringAway()')
    page.locator('#bUniverseMap').click();page.wait_for_timeout(150)
    while not page.locator('#umapOut').is_disabled():page.locator('#umapOut').click();page.wait_for_timeout(120)
    ring=icon(page,'ring');assert ring,state(page)['drawn'];page.mouse.click(ring['x'],ring['y']);page.wait_for_function("!document.getElementById('umapCard').hidden")
    assert page.inner_text('#umapCardName')=='Los once lugares' and page.inner_text('#umapGo')=='Volver al anillo' and page.locator('#umapMark').is_hidden()
    page.keyboard.press('Escape');page.evaluate("__r.universeMapLevel('anillo')");page.wait_for_timeout(150)
    nxt=page.evaluate('__r.ringState().next');p=icon(page,'place',nxt);page.mouse.click(p['x'],p['y']);page.wait_for_timeout(100)
    assert page.locator('#umapGo').is_visible() and page.inner_text('#umapGo')=='Ir','the next place, free from far away'
    other=next(q for q in page.evaluate('__r.ringPortals()') if not q['open'])
    p=icon(page,'place',other['id']);page.mouse.click(p['x'],p['y']);page.wait_for_timeout(100)
    assert page.inner_text('#umapCardName')==other['name'] and page.locator('#umapGo').is_hidden() and page.inner_text('#umapMark')=='Marcar','a closed place is only marked'
    f=icon(page,'favorite',fav['id']);assert f,state(page)['drawn'];page.mouse.click(f['x'],f['y']);page.wait_for_timeout(100)
    assert page.inner_text('#umapCardName')=='Mi rincón' and page.inner_text('#umapGo')=='Ir';page.locator('#umapGo').click();page.wait_for_timeout(600)
    page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000);page.evaluate("document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)")
    assert page.locator('#mUniverseMap').is_hidden() and math.hypot(page.evaluate('__r.S.wx')-fav['x'],page.evaluate('__r.S.wy')-fav['y'])<50,'Ir to a favourite, as Favoritos does'
    page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.wait_for_function("!document.getElementById('bUniverseMap').hidden",timeout=4000)
    page.locator('#bUniverseMap').click();page.evaluate("__r.universeMapLevel('anillo')");page.wait_for_timeout(150)
    home=icon(page,'refugio') or icon(page,'ringHome');page.mouse.click(home['x'],home['y']);page.wait_for_timeout(100);assert page.inner_text('#umapGo')=='Volver al anillo',page.inner_text('#umapCard')
    page.locator('#umapGo').click();page.wait_for_timeout(300);assert math.hypot(page.evaluate('__r.S.wx')-c['x'],page.evaluate('__r.S.wy')-c['y'])<400,'back at the ring'
    page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
   # Inside a round the button goes; back in the World it comes back.
   page.evaluate("__r.startPlace('lago')");page.wait_for_timeout(600);assert page.locator('#bUniverseMap').is_hidden(),'no map inside a round'
   page.evaluate("__r.abandonPlace()");page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.wait_for_function("!document.getElementById('bUniverseMap').hidden",timeout=4000)
   assert not errors,errors;page.close()
  browser.close()
finally:server.shutdown()
print('PASS universe map: one touch from the World and the Bitácora, three zooms, wheel, drag, centre, card with Ir, Escape, nothing drawn while closed, 390×844 and 1280×800 · '+str(OUT))
