"""L2 · the standard panel screens in English, part 1: the start, the five chapters of the Viaje and the six places
(scripts/panel-capture.py 00–15). No Spanish on the page, in its labels or on the canvas; no text cut at 390×844 (tests/english_helpers.py)."""
from playwright.sync_api import sync_playwright
from english_helpers import serve,launch,new_page,open_game,check,OUT
SHOTS=[('00-inicio','')]+[(f'0{i+1}-capitulo-{c}',f'?capitulo={c}') for i,c in enumerate(['llanura','lago','bosque','tormenta','vacio'])]
SHOTS+=[(f'1{i}-lugar-{p}',f'?lugar={p}') for i,p in enumerate(['jardin','dunas','cristales','faros','ruinas','cueva'])]
server=serve()
try:
 with sync_playwright() as pw:
  browser=launch(pw)
  for name,query in SHOTS:
   page,errors=new_page(browser);open_game(page,server.server_port,query);check(page,name);assert not errors,errors;page.close()
  browser.close()
finally:server.shutdown();server.server_close()
print('PASS English screens: start, five chapters and six places, no Spanish and no cut text at 390×844;',OUT)
