"""Living encounters, batch 3 (Jay, 28 Oct 2026): the last three «hacer» (Tormenta solar, Pozo, Vacío), each forced with
«?encuentro=<id>» and played to its three endings (live_do_helpers.py), and where they never come: not in a round of a
place, a chapter of the Journey or under its finale, even with the shortcut. Screenshots at 390×844."""
from playwright.sync_api import sync_playwright
import os,shutil,json
import live_do_helpers as H
server=H.start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  shots=[]
  for i,kind in enumerate(['antena','luciernagas','constelacion']):
   p=H.task(browser,kind,shot={'constelacion':1200}.get(kind,0),toast=i==0)
   if p:shots.append(str(p))
  # Never in a round of a place, a chapter of the Journey or under its finale, even with the shortcut.
  page,errors=H.page_for(browser,H.URL+'?lugar=jardin&encuentro=brotes');page.wait_for_function('!!__r.placeRun?.()',timeout=8000);page.evaluate('__r.S.sound=false')
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<300;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  assert page.evaluate('!__r.liveEncounterState().scene&&__r.liveEncounterState().travel===0'),'not in a round'
  assert not page.evaluate("__r.liveEncounterSpawn('brotes')")
  assert not errors,errors;page.close()
  page,errors=H.page_for(browser,H.URL+'?encuentro=constelacion')
  page.evaluate("()=>{"+H.HIDE+";const r=__r,s=r.S;s.sound=false;s.pathCrystals=Array.from({length:10},(_,i)=>'j:'+i);s.help.camino=s.help.mundo=true;r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();}")
  page.wait_for_timeout(300);assert page.evaluate("__r.journeyMode()=='viaje'&&__r.inWorld()&&__r.travelInLevel()")
  page.evaluate("""async()=>{const r=__r;for(let i=0;i<300;i++){r.S.wx+=4;await new Promise(f=>requestAnimationFrame(f));}}""")
  assert page.evaluate('!__r.liveEncounterState().scene') and not page.evaluate("__r.liveEncounterSpawn('constelacion')"),'not in a chapter'
  page.evaluate("()=>{const j=__r.S.journey;j.chapter=6;j.done={llanura:true,lago:true,bosque:true,tormenta:true,vacio:true};__r.save();}")
  page.evaluate('__r.journeyFinale()');page.wait_for_function('__r.journeyFinaleState().running',timeout=5000)
  assert not page.evaluate("__r.liveEncounterSpawn('luciernagas')"),'not under the finale'
  assert not errors,errors;page.close();browser.close()
 print('PASS living encounters, batch 3 (c): antena, luciernagas and constelacion forced with «?encuentro=», ahead with their line; done with pulses on time 45 ✦ (Bitácora and one notice the first time), on foot 30 ✦, walking away nothing given or taken; never in rounds, chapters or the finale; screenshots '+json.dumps(shots),flush=True)
finally:server.shutdown()
