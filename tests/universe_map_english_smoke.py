"""Mapa del universo (alpha.235) in English and sideways: the map's screen, its legend, a card with «Go» and one with
«Mark», the mark's compass line in the World and the mini map switch in Settings, at 390×844 and turned to 844×390. No
Spanish on the page, its labels or the canvas; no text cut (tests/english_helpers.py). Sideways, the zoom buttons, the
legend and the card stay inside the screen and clear of each other."""
from playwright.sync_api import sync_playwright
from english_helpers import serve,launch,new_page,open_game,check,OUT
WALK="""()=>{const r=__r,RP=r.REG*r.WCH,c=r.ringState().center;for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++){if(Math.abs(i)+Math.abs(j)>5)continue;r.S.places[(Math.floor(c.x/RP)+i)+','+(Math.floor(c.y/RP)+j)]=1;}
 const q=r.S.skyMap||(r.S.skyMap={version:1,figures:{},sites:{},earned:0,halo:null,wear:{}});q.sites||={};q.figures||={};q.sites['en:casiopea']={fig:'casiopea',x:c.x-2400,y:c.y+2200,turn:0,lit:2,done:false,onTime:false,at:''};
 r.mapNoteLive({kind:'ola',x:c.x+1800,y:c.y-900,won:false});document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);}"""
def drawn(page,kind,id=None):
 return next((d for d in page.evaluate('__r.universeMapState().drawn') if d['kind']==kind and (id is None or d.get('id')==id)),None)
def inside(box,w,h):return box and box['x']>=0 and box['y']>=0 and box['x']+box['width']<=w+.5 and box['y']+box['height']<=h+.5
def apart(a,b):return a['x']+a['width']<=b['x'] or b['x']+b['width']<=a['x'] or a['y']+a['height']<=b['y'] or b['y']+b['height']<=a['y']
server=serve()
try:
 with sync_playwright() as pw:
  browser=launch(pw)
  for width,height in [(390,844),(844,390)]:
   tag=f'{width}x{height}'
   page,errors=new_page(browser,width,height);open_game(page,server.server_port,'?anillo=1')
   page.wait_for_function("__r.ringState().active",timeout=10000);page.evaluate(WALK);page.wait_for_function("!document.getElementById('bUniverseMap').hidden",timeout=3000)
   assert page.locator('#bUniverseMap').get_attribute('aria-label')=='Map'
   page.locator('#bUniverseMap').click();page.wait_for_timeout(300)
   assert page.inner_text('#umapLevel')=='Region' and 'Up to 5 km' in page.inner_text('#umapShare'),page.inner_text('#umapShare')
   check(page,f'map-en-region-{tag}')
   tools=page.locator('.umap-tools').bounding_box();legend=page.locator('#umapLegend').bounding_box();head=page.locator('.umap-head').bounding_box()
   assert inside(tools,width,height) and inside(legend,width,height) and apart(tools,legend),(tools,legend)
   page.locator('#umapLegend summary').click();page.wait_for_timeout(200);legend=page.locator('#umapLegend').bounding_box()
   assert inside(legend,width,height) and apart(tools,legend),(tools,legend);check(page,f'map-en-legend-{tag}')
   page.locator('#umapLegend summary').click()
   page.locator('#umapIn').click();page.wait_for_timeout(200);assert page.inner_text('#umapLevel')=='Ring'
   lago=drawn(page,'place','lago');page.mouse.click(lago['x'],lago['y']);page.wait_for_function("!document.getElementById('umapCard').hidden")
   assert page.inner_text('#umapGo')=='Go' and 'from you' in page.inner_text('#umapCardDist');card=page.locator('#umapCard').bounding_box()
   assert inside(card,width,height) and apart(card,tools),(card,tools);check(page,f'map-en-card-go-{tag}')
   page.keyboard.press('Escape')
   page.locator('#umapOut').click();page.wait_for_timeout(200);sky=drawn(page,'sky','en:casiopea');assert sky,page.evaluate('__r.universeMapState().drawn')
   page.mouse.click(sky['x'],sky['y']);page.wait_for_function("!document.getElementById('umapCard').hidden")
   assert page.inner_text('#umapCardName')=='Cassiopeia' and page.inner_text('#umapMark')=='Mark' and 'Constellation · 2 of 5' in page.inner_text('#umapCardWhat'),page.inner_text('#umapCard')
   check(page,f'map-en-card-mark-{tag}')
   page.locator('#umapMark').click();page.wait_for_timeout(200);assert page.inner_text('#umapMark')=='Remove mark'
   page.locator('#umapOut').click();page.wait_for_timeout(200);assert page.inner_text('#umapLevel')=='Universe';page.keyboard.press('Escape');check(page,f'map-en-universe-{tag}')
   page.keyboard.press('Escape');page.wait_for_timeout(300);assert page.locator('#mUniverseMap').is_hidden()
   page.wait_for_function("!document.getElementById('ringRoute').hidden",timeout=3000);assert page.inner_text('#ringRoute').startswith('Your mark · Cassiopeia'),page.inner_text('#ringRoute')
   check(page,f'world-en-mark-{tag}')
   page.locator('#bMenu').click();page.locator('#bSettings').click();page.wait_for_timeout(300);page.locator('#miniMapRow').scroll_into_view_if_needed()
   assert page.inner_text('#miniMapRow').strip()=='Mini map in a corner';check(page,f'settings-en-minimap-{tag}')
   assert not errors,errors;page.close()
  browser.close()
finally:server.shutdown();server.server_close()
print('PASS universe map in English and sideways: map, legend, cards with Go and Mark, compass line and mini map setting at 390×844 and 844×390;',OUT)
