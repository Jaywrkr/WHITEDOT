"""Explicit place reloads use the same public address format as the game."""
def keep_place_on_reload(page):
 page.evaluate('''async()=>{
  const r=window.__testRuntime||window.__r,{encodePlace}=await import('/src/share-tools.js'),{placeAddress}=await import('/src/world-identity.js');
  if(!r.save())throw Error('Cannot persist place fixture');
  const url=new URL(location.href);url.searchParams.set('addr',encodePlace(placeAddress(r.worldIdentity,r.S.wx,r.S.wy,r.S.layer||'superficie')));history.replaceState(null,'',url);
 }''')


def complete_path_fixture(page):
 """Set the current entry prerequisite for tests of unrelated World systems.
 Real ten-crystal mining remains covered by crystal_path_smoke.py.
 """
 page.evaluate("""()=>{const r=window.__testRuntime||window.__r;
  if(!r)throw Error('Runtime fixture missing');
  r.S.pathCrystals=Array.from({length:10},(_,i)=>'fixture:path:'+i);
 }""")
