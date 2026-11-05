"""Use system Chromium or the pinned Playwright browser and preserve test exit codes."""
from pathlib import Path
import os,shutil,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
if not os.environ.get('CHROMIUM_PATH'):
 executable=shutil.which('chromium') or shutil.which('chromium-browser')
 if not executable:
  from playwright.sync_api import sync_playwright
  with sync_playwright() as p:executable=p.chromium.executable_path
 os.environ['CHROMIUM_PATH']=executable
mode=sys.argv[1] if len(sys.argv)>1 else 'browser'
flows={'browser':['creative_regression.py','offline_smoke.py'],'audio':['production_mix.py','encounter_mix.py','audio_mix.py','depth_mix.py','glass_mix.py','ecology_mix.py','composition_mix.py','exploration_mix.py','pet_mix.py','percussion_mix.py','living_mix.py','celebration_mix.py','music_identity_mix.py','synth_bank_mix.py','world_family_mix.py','habitat_mix.py','modular_mix.py','hybrid_mix.py','foreground_mix.py','heritage_mix.py','memory_mix.py','wardrobe_mix.py','house_mix.py','walkers_mix.py','lab_music_mix.py','technique_mix.py','landscape_gestures_mix.py','lab_learning_mix.py','lab_evolution_mix.py','lab_genres_mix.py','experience_learning_mix.py','experience_garden_mix.py','performance_mix.py','music_direction_mix.py','territory_music_mix.py','ensemble_mix.py','energy_mix.py','foundation_mix.py','transition_mix.py']}
if mode not in flows:raise SystemExit('Use browser or audio')
# Keep named order, but never omit a newly added audio regression (living_b_mix.py is the second half of living_mix.py).
flows['audio']+=sorted(p.name for p in (ROOT/'tests').glob('*_mix.py') if p.name not in flows['audio'])
sys.path.insert(0,str(ROOT/'tests'))
import flow_shards
selected=flows[mode]
# Pull requests run only the flows tests/flow_impact.py selects; unset or empty means the full catalogue.
chosen=os.environ.get('WHITEDOT_BROWSER_FLOWS' if mode=='browser' else 'WHITEDOT_AUDIO_FLOWS')
if chosen:
 chosen=set(chosen.split(','))
 selected=[f for f in selected if f=='creative_regression.py' or f in chosen]
# The offline flow runs once, in the first browser shard.
if mode=='browser' and os.environ.get('WHITEDOT_BROWSER_SHARD','1/1').split('/')[0]!='1':selected=[f for f in selected if f!='offline_smoke.py']
# Each flow in exactly one shard, balanced by the seconds measured on CI (tests/flow-durations.json).
if mode=='audio' and os.environ.get('WHITEDOT_AUDIO_SHARD'):
 spec=os.environ['WHITEDOT_AUDIO_SHARD']
 try:selected=flow_shards.shard_of(selected,spec,'audio')
 except ValueError:raise SystemExit('WHITEDOT_AUDIO_SHARD must be index/total, within the catalogue')
 print(f'Audio shard {spec}: '+', '.join(selected),flush=True)
for flow in selected:
 print(f'RUN {mode}: {flow}',flush=True)
 command=[sys.executable,str(ROOT/'tests'/flow)]
 if flow!='creative_regression.py':command=[sys.executable,str(ROOT/'scripts/browser-processes.py'),'--timeout=895',*command]
 # The complete browser catalog exceeds two hours of individual budgets;
 # preserve each flow's 145s limit, but allow the enclosing CI job's 40 minutes.
 result=subprocess.run(command,cwd=ROOT,timeout=2400 if flow=='creative_regression.py' else 900)
 print(('FAIL' if result.returncode else 'PASS')+f' {mode}: {flow}',flush=True)
 if result.returncode:raise SystemExit(result.returncode)
