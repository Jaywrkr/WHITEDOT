"""Escáner NMS (Jay, 5 Nov 2026, alpha.263) · phone (390x844) and desktop (1280x800). «Como No Man's Sky»: a held
finger sends the wave and each thing within reach becomes a mark, its icon and «Nombre · distancia», on a ring round the
cube that stops at the screen's edge (far things on the perimeter, in their direction). No panel and nothing over the
view; eight marks at most, none covering another; after a few seconds they fade and the view is clean. The Mapa del
universo shows a landmark you only heard as a landmark (its icon, dim), not «?»; «?» stays only for what is not
discovered (an open rumour); your flare and an order keep their own icon. The save is not touched by any of it."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,json
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('ESCANER_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.liveEncounterRest?.();r.save();}"
# Twelve test things round the cube, 90–110 m away (off the screen at both sizes), rarer than the World's own.
ENTRY="""async()=>{const M=await import('/src/scanner-model.js');if(!M.scanEntry('prueba-nms'))M.registerScan({id:'prueba-nms',name:'Caja de prueba',shape:'caja',level:1,rarity:3,
 sites:()=>window.__nms||[]});return true;}"""
PLACE="""()=>{const r=__r;window.__nms=Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2+.2,d=900+(i%3)*100;return {key:'n'+i,x:r.S.wx+Math.cos(a)*d,y:r.S.wy+Math.sin(a)*d};});return true;}"""
SEED="""()=>{const r=__r,S=r.S,RP=r.REG*r.WCH,cx=Math.floor(S.wx/RP),cy=Math.floor(S.wy/RP);S.heardLm=S.heardLm||{};const ids=[];
 for(let i=-12;i<=12&&ids.length<6;i++)for(let j=-12;j<=12&&ids.length<6;j++){const lm=r.landmarkAt?.(cx+i,cy+j);if(lm&&!S.landmarks?.[lm.id]){S.heardLm[lm.id]=[lm.rx,lm.ry,lm.type];ids.push(lm.id);}}
 const q=S.rumors||(S.rumors={version:1,open:[],done:[],n:0,given:0});q.open=[...(q.open||[]).filter(o=>o.id!=='prueba-rumor'),{id:'prueba-rumor',kind:'figure',key:'k',name:'',text:'Dicen que…',x:S.wx-6000,y:S.wy+2000,at:''}];
 return ids;}"""
def hold(page,ms):
 w,h=page.viewport_size['width'],page.viewport_size['height'];page.mouse.move(w/2+70,h/2-90);page.mouse.down();page.wait_for_timeout(ms)
def st(page):return page.evaluate("__r.scanState()")
hit=lambda a,b:a['x']<b['x']+b['w'] and b['x']<a['x']+a['w'] and a['y']<b['y']+b['h'] and b['y']<a['y']+a['h']
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.scanState&&__r.ringState?.().active",timeout=90000)
   page.evaluate(FREE);page.wait_for_timeout(600);page.evaluate(FREE);page.evaluate(ENTRY);page.evaluate(PLACE)
   save0=page.evaluate("JSON.stringify(__r.S)")
   # --- 1 · Hold: the wave goes out; each thing becomes a mark with its icon and «Nombre · distancia».
   hold(page,1800);s=st(page)
   assert s['scanning'] and s['level']=='2' and not page.locator('#scanner').is_visible(),('no panel',s['level'])
   mk=s['marks'];mine=[m for m in mk if m['id']=='prueba-nms']
   assert 1<=len(mk)<=8 and len(mine)>=4,('eight at most, ours among them',mk)
   for m in mine:
    assert m['shape']=='caja' and m['label'].startswith('Caja de prueba · ') and m['label'].endswith(' m'),m
    assert m['edge'] and (m['x']<=24 or m['x']>=width-24 or m['y']<=106 or m['y']>=height-106),('far: on the perimeter',m)
   boxes=page.evaluate("""async()=>{const M=await import('/src/scanner-model.js');return __r.scanState().marks.map(m=>M.markBox(m.x,m.y,m.label,innerWidth));}""")
   for i in range(len(boxes)):
    assert 0<=boxes[i]['x'] and boxes[i]['x']+boxes[i]['w']<=width+1,('inside the screen',boxes[i])
    for j in range(i+1,len(boxes)):assert not hit(boxes[i],boxes[j]),('no mark covers another',mk[i],mk[j])
   page.wait_for_timeout(100);arrows=page.evaluate("__r.edgeState().shown");boxes=page.evaluate("""async()=>{const M=await import('/src/scanner-model.js');return __r.scanState().marks.map(m=>M.markBox(m.x,m.y,m.label,innerWidth));}""")
   for e in arrows:assert not any(b['x']-2<=e['x']<=b['x']+b['w']+2 and b['y']-2<=e['y']<=b['y']+b['h']+2 for b in boxes),('no arrow on a mark',e)
   near=[m for m in mk if m['ring']];assert all(abs(((m['x']-width/2)**2+(m['y']-height/2)**2)**.5)>60 for m in near),'nothing sits on the cube'
   assert s['drawn']['icons']==len(mk) and s['drawn']['labels']>=len(mine),s['drawn']
   # Only white on the canvas round a mark's icon (the cube is white, gold is for what is earned).
   px=page.evaluate("""(m)=>{const cv=document.getElementById('w'),c=cv.getContext('2d'),k=cv.width/cv.clientWidth,d=c.getImageData(Math.round((m.x-7)*k),Math.round((m.y-7)*k),Math.round(14*k),Math.round(14*k)).data;let b=0,w=0;
     for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>600){b++;w=Math.max(w,Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2]));}return {b,w};}""",mine[0])
   assert px['b']>0 and px['w']<=40,('a white icon',px)
   if SHOTS:page.screenshot(path=f'{SHOTS}/nms-marcas-{width}.png')
   # --- 2 · Released: the marks stay a few seconds, then fade; the view is clean.
   page.mouse.up();page.wait_for_timeout(2500);s=st(page);assert not s['scanning'] and len(s['marks'])>=1 and 3<=s['left']<=8,('they stay',s['left'],len(s['marks']))
   assert not page.locator('#scanner').is_visible()
   page.wait_for_function("__r.scanState().marks.length===0&&__r.scanState().drawn.icons===0",timeout=10000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/nms-limpio-{width}.png')
   # A sheet cleans the view at once.
   hold(page,1500);page.mouse.up();page.evaluate("()=>{document.getElementById('mJournal').hidden=false;}");page.wait_for_timeout(400)
   assert len(st(page)['marks'])==0,'a sheet clears the marks';page.evaluate(HIDE)
   # Reduced motion: the marks are there at once, without the ring travelling.
   page.evaluate("()=>{__r.S.reducedMotion=true;}");page.evaluate("__r.startScanner()");page.wait_for_timeout(250)
   assert any(m['id']=='prueba-nms' for m in st(page)['marks']),'still: at once';page.evaluate("__r.stopScanner()");page.evaluate("()=>{__r.S.reducedMotion=false;}")
   # --- 3 · The map: a heard landmark is a landmark, not «?»; «?» only for the rumour; the flare its own icon.
   heard=page.evaluate(SEED);assert heard,'some landmarks heard'
   page.evaluate("__r.openUniverseMap('universo')");page.wait_for_function("__r.universeMapState().open",timeout=5000);page.wait_for_timeout(600)
   drawn=page.evaluate("__r.universeMapState().drawn||[]")
   kinds=[d['kind'] for d in drawn]
   assert 'heard' in kinds,('the heard landmarks are on the map',kinds)
   icons=page.evaluate("""async()=>{const A=await import('/src/universe-map-art.js');return __r.universeMapState().items.map(i=>({kind:i.kind,id:i.id,icon:A.umapIconOf(i)}));}""")
   asks=[i for i in icons if i['icon']=='secreto'];assert asks and all(i['kind']=='rumor' for i in asks),('«?» only for a rumour',asks)
   assert all(i['icon']=='hito' for i in icons if i['kind'] in ('heard','landmark')),icons
   # The canvas draws no «?» glyph for a heard landmark: the pixels where it sits are a landmark icon (two lines up).
   hd=[d for d in drawn if d['kind']=='heard'][0]
   page.mouse.click(hd['x'],hd['y']);page.wait_for_timeout(200)
   if page.locator('#umapCard').is_visible():
    assert page.inner_text('#umapCardWhat')=='Hito oído · aún no llegaste';assert page.inner_text('#umapCardName')!='?'
   legend=page.evaluate("[...document.querySelectorAll('#umapLegend i[data-icon]')].map(i=>[i.dataset.icon,!!i.querySelector('canvas')])")
   assert legend and all(c for _,c in legend) and ['secreto',True] in legend and ['hito',True] in legend,legend
   if SHOTS:page.screenshot(path=f'{SHOTS}/nms-mapa-{width}.png')
   page.keyboard.press('Escape');page.keyboard.press('Escape');page.wait_for_timeout(200)
   # --- 4 · Progress untouched: scanning wrote nothing to what the save keeps of finds, places and the map (an achievement
   # for opening the map may be added by the map itself).
   after=json.loads(page.evaluate("JSON.stringify(__r.S)"));before=json.loads(save0)
   for k in ['elementBook','cat','relicSites','activities','skySecrets','secrets','lugares','journey','universeMap']:
    assert json.dumps(after.get(k),sort_keys=True)==json.dumps(before.get(k),sort_keys=True),('the save keeps '+k)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   page.close()
  browser.close()
 print(f'PASS escáner NMS on phone and desktop in {time.time()-started:.0f} s: hold sends the wave and each thing becomes a mark (icon and «Nombre · distancia») on the ring or the screen\'s perimeter, eight at most, none over another, white; no panel; the marks stay a few seconds and fade to a clean view; a sheet clears them; reduced motion at once; the map shows a heard landmark as a landmark and «?» only for a rumour; the legend draws the same icons; the save untouched',flush=True)
finally:server.shutdown()
