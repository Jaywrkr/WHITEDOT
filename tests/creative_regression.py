"""Run actual browser flows, preserve failures, and keep per-flow output for review."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
import subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
flows=sorted(p for p in (ROOT/'tests').glob('*smoke.py') if p.name!='offline_smoke.py')
# The principal existing journey also validates controls, Studio and reload.
if ROOT/'tests/smoke.py' not in flows:flows.append(ROOT/'tests/smoke.py')
def run(path):
 result=subprocess.run([sys.executable,str(path)],cwd=ROOT,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=150)
 (Path('/tmp')/('whitedot-review-'+path.stem+'.txt')).write_text(result.stdout)
 return path.name,result.returncode,result.stdout
failed=[]
with ThreadPoolExecutor(max_workers=2) as pool:
 for future in as_completed([pool.submit(run,path) for path in flows]):
  try:name,code,output=future.result()
  except Exception as error:failed.append(str(error));print('FAIL '+str(error),flush=True);continue
  print(('PASS ' if code==0 else 'FAIL ')+name,flush=True)
  if code:failed.append(name);print(output[-3500:],flush=True)
print(f'{len(flows)-len(failed)}/{len(flows)} browser flows passed',flush=True)
if failed:sys.exit(1)
