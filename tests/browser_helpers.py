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


# A known moment for flows whose scene follows the real clock (storms, the day's region events, seasons, sky
# schedules): 2 Jun 2026 02:00 UTC opens a 40-minute storm slot. Time still advances from there at the real rate, so
# timers, frames and durations behave as usual; only the schedule's starting point is fixed.
PINNED_MOMENT='2026-06-02T02:00:00Z'
def pinned_clock_script(moment=PINNED_MOMENT):
 return """(()=>{const Real=Date,start=Real.parse('%s'),t0=performance.now(),now=()=>start+(performance.now()-t0);
  class Pinned extends Real{constructor(...a){a.length?super(...a):super(now());}static now(){return now();}}
  globalThis.Date=Pinned;})();"""%moment
def pin_clock(target,moment=PINNED_MOMENT):
 """Start the page's Date at a fixed moment (a page or a context, before it loads)."""
 target.add_init_script(pinned_clock_script(moment))
