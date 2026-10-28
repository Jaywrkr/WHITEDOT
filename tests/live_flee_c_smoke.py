"""Living encounters, batch 2 (Jay, 27 Oct 2026): the last three «huir» (Tormenta solar, Pozo, Vacío), each forced with
«?encuentro=<id>» and played to its three endings (live_flee_helpers.py), and where they never come: not in a round of
a place, a chapter of the Journey or under its finale, even with the shortcut. Screenshots at 390×844."""
from playwright.sync_api import sync_playwright
import os,shutil,json
import live_flee_helpers as H
server=H.start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  shots=[]
  for i,kind in enumerate(['llamaradas','pozo','agujero']):
   p=H.flee(browser,kind,shot=kind=='pozo',toast=i==0)
   if p:shots.append(str(p))
  # Never in a round of a place, a chapter of the Journey or under its finale, even with the shortcut.
  page,errors=H.page_for(browser,H.URL+'?lugar=jardin&encuentro=ola');page.wait_for_function('!!__r.placeRun?.()',timeout=8000);page.evaluate('__r.S.sound=false')
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<300;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  assert page.evaluate('!__r.liveEncounterState().scene&&__r.liveEncounterState().travel===0'),'not in a round'
  assert not page.evaluate("__r.liveEncounterSpawn('ola')")
  assert not errors,errors;page.close()
  page,errors=H.page_for(browser,H.URL+'?encuentro=agujero')
  page.evaluate("()=>{"+H.HIDE+";const r=__r,s=r.S;s.sound=false;s.pathCrystals=Array.from({length:10},(_,i)=>'j:'+i);s.help.camino=s.help.mundo=true;r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();}")
  page.wait_for_timeout(300);assert page.evaluate("__r.journeyMode()=='viaje'&&__r.inWorld()&&__r.travelInLevel()")
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<300;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  assert page.evaluate('!__r.liveEncounterState().scene') and not page.evaluate("__r.liveEncounterSpawn('agujero')"),'not in a chapter'
  page.evaluate("()=>{const j=__r.S.journey;j.chapter=6;j.done={llanura:true,lago:true,bosque:true,tormenta:true,vacio:true};__r.save();}")
  page.evaluate('__r.journeyFinale()');page.wait_for_function('__r.journeyFinaleState().running',timeout=5000)
  assert not page.evaluate("__r.liveEncounterSpawn('pozo')"),'not under the finale'
  assert not errors,errors;page.close();browser.close()
 print('PASS living encounters, batch 2 (c): llamaradas, pozo and agujero forced with «?encuentro=», ahead with their line; out with pulses on time 15 ✦ (Bitácora and one notice the first time), on foot 10 ✦, reached nothing given or taken and a short nudge; never in rounds, chapters or the finale; screenshots '+json.dumps(shots),flush=True)
finally:server.shutdown()
