"""L2 · the standard panel screens in English, part 2: the ring of places and its panels (scripts/panel-capture.py 20–34:
Lugares, Tu canción, a wild spark, the menu, the guide, the book of finds, a result and Favoritos). No Spanish on the
page, its labels or the canvas; no text cut at 390×844 (tests/english_helpers.py). A favorite the player named in
Spanish keeps its name: the player's own words are not translated."""
from playwright.sync_api import sync_playwright
from english_helpers import serve,launch,new_page,open_game,panel,check,OUT
SHOTS=[('20-anillo','?anillo=1',None),('21-lugares','?anillo=1','lugares'),('22-cancion','?anillo=1','song'),('23-salvaje','?anillo=1','wild'),('30-menu','?anillo=1','menu'),('31-guia-jardin','?lugar=jardin','guide'),('32-libro','?anillo=1','cards'),('33-resultado','?lugar=lago','result'),('34-favoritos','?anillo=1','favorites')]
server=serve()
try:
 with sync_playwright() as pw:
  browser=launch(pw)
  for name,query,extra in SHOTS:
   page,errors=new_page(browser);open_game(page,server.server_port,query)
   if extra:panel(page,extra)
   check(page,name)
   if extra=='favorites':
    named=page.evaluate("[...document.querySelectorAll('#favoritesBody [translate=no]')].map(e=>e.value??e.textContent)")
    assert any('Mi primer lugar' in (v or '') for v in named),('the player\'s name stays as written',named)
   assert not errors,errors;page.close()
  browser.close()
finally:server.shutdown();server.server_close()
print('PASS English panels: ring, places, song, spark, menu, guide, book, result and favorites; no Spanish and no cut text;',OUT)
