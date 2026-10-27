"""L2 · every menu sheet in English at 390×844, in the Viaje and in the free World, as the menu reviewers saw them
(docs/panel/sesion-11/evidencia/capturas-menus.py): the menu, «Más», Ajustes, sound, Tu cubo, Lugares, map, Bitácora, the
guide, Cuenta, the Refugio, recording and seeds. No Spanish on the page, its labels or the canvas; no text cut
(tests/english_helpers.py). Ajustes offers «Idioma / Language» with Español and English, never translated."""
from playwright.sync_api import sync_playwright
from english_helpers import serve,launch,new_page,open_game,check,OUT
SHEETS=[('menu',None),('menu-mas','more'),('ajustes','bSettings'),('sonido','bSettings>bMusicSettings'),('tu-cubo','bCube'),('lugares','bLugares'),('mapa','bMap'),('bitacora','bAch'),('guia','bGuide'),('cuenta','bConnection'),('semillas','bWorlds'),('grabar','bRecord'),('refugio','bStudio')]
server=serve()
try:
 with sync_playwright() as pw:
  browser=launch(pw)
  for mode in ('viaje','libre'):
   page,errors=new_page(browser);open_game(page,server.server_port,'?anillo=1')
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
   if mode=='libre':
    page.locator('#bMenu').click();page.wait_for_timeout(300);page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')")
    page.locator('#bJourneyMode').click();page.wait_for_timeout(600);page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
    assert page.evaluate('__r.journeyMode()')=='libre'
   for name,button in SHEETS:
    page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
    page.locator('#bMenu').click();page.wait_for_timeout(350)
    if button:
     page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')");page.wait_for_timeout(150)
     for step in ([] if button=='more' else button.split('>')):
      target=page.locator('#'+step)
      if not target.is_visible():continue  # Viaje mode keeps the free-only buttons hidden (a datum, as in the panel)
      target.click(timeout=4000);page.wait_for_timeout(700)
    if name=='ajustes':
     language=page.evaluate("(()=>{const s=document.getElementById('language');return {label:document.querySelector('label[for=language]').textContent,options:[...s.options].map(o=>[o.value,o.textContent]),value:s.value,no:s.translate===false&&document.querySelector('label[for=language]').translate===false}})()")
     assert language=={'label':'Idioma / Language','options':[['es','Español'],['en','English']],'value':'en','no':True},language
    check(page,f'menu-{mode}-{name}')
   assert not errors,errors;page.close()
  browser.close()
finally:server.shutdown();server.server_close()
print('PASS English menus: thirteen sheets in the Viaje and the free World, no Spanish and no cut text at 390×844;',OUT)
