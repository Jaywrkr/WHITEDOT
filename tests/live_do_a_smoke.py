"""Living encounters, batch 3 (Jay, 28 Oct 2026): the first four «hacer» (Polvo, Cúmulo, Marea, Restos), each forced with
«?encuentro=<id>» and played to its three endings (live_do_helpers.py): done with pulses on time for 15 ✦ (the Bitácora
and one notice the first time), done on foot for 10 ✦, walking away for nothing but a kind goodbye. One at a time, also
with the mischief scenes. Screenshots at 390×844."""
from playwright.sync_api import sync_playwright
import os,shutil,json
import live_do_helpers as H
server=H.start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  shots=[]
  for i,kind in enumerate(['motas','estrellita','burbujas','guardian']):
   p=H.task(browser,kind,shot={'motas':1200,'burbujas':1800}.get(kind,0),toast=i==0)
   if p:shots.append(str(p))
  # One at a time with the mischief scenes: with a task under way, walking onto a mischief site starts nothing.
  page,errors=H.page_for(browser,H.URL+'?anillo=1');page.evaluate("()=>{"+H.HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();r.setJourneyMode('libre');}")
  site=page.evaluate("""async()=>{const {mischiefCell}=await import('/src/universe-mischief-model.js'),r=__r,x0=Math.floor(r.S.wx/1800),y0=Math.floor(r.S.wy/1800);
   for(let d=0;d<30;d++)for(let x=x0-d;x<=x0+d;x++)for(let y=y0-d;y<=y0+d;y++){for(const o of mischiefCell(x,y,r.seedOf,'superficie'))if(['rain','breath','twin'].includes(o.kind)&&!r.regionOfPos(o.x,o.y).sea&&!r.S.mischief?.done?.[o.id])return o;}return null;}""")
  assert site,'a mischief site nearby'
  page.evaluate(f"(()=>{{const r=__r;r.S.wx={site['x']}-150;r.S.wy={site['y']};}})()");page.wait_for_timeout(100)
  assert page.evaluate("__r.liveEncounterSpawn('burbujas')")
  page.evaluate(f"(()=>{{__r.S.wx={site['x']};__r.S.wy={site['y']};}})()");page.wait_for_timeout(500)
  assert page.evaluate("__r.liveEncounterState().scene?.kind==='burbujas'"),'the encounter still runs'
  assert page.evaluate('!__r.mischiefState.scene'),'no mischief scene while an encounter runs'
  assert not errors,errors;page.close();browser.close()
 print('PASS living encounters, batch 3 (a): motas, estrellita, burbujas and guardian forced with «?encuentro=», ahead with their line; done with pulses on time 15 ✦ (Bitácora and one notice the first time), on foot 10 ✦, walking away nothing given or taken; one at a time, also with mischief; screenshots '+json.dumps(shots),flush=True)
finally:server.shutdown()
