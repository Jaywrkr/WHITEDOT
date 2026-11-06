"""Pick the browser and audio flows a pull request can affect; anything unsure means the full catalogue.

Pull requests run only the flows this selects (.github/workflows/checks.yml); main, the nightly run and a manual run
keep the full catalogue. The rules, in order, for each changed file:
  documentation (*.md, docs/, validation records), Node-only tests, android/, desktop/, tools/, supabase/: no flow;
  shared core (src/main.js, src/audio.js, src/render.js, index.html, styles/, sw.js, the test harness, workflows,
  assets, a module imported by HUB or more modules, any unknown path): the full catalogue;
  a flow file: that flow; a Python helper: the flows that import it;
  a src module: flows named after its family (scanner.js, scanner-model.js…), flows that name the family or one of
  its direct importers, and every audio flow when
  the audio render (tests/audio_mix.mjs) loads it; a module no browser flow names: the full catalogue;
  another script or test file: the flows that name it.
The result depends only on the list of changed files, so every runner computes the same selection.
With --base, a file whose diff only moves the version strings scripts/bump-version.mjs writes (index.html, sw.js,
package.json, src/release-info.js) is left out of that list: a release bump selects no flow.

  python3 tests/flow_impact.py --base REV [--head REV]      changed files from git diff BASE HEAD
  python3 tests/flow_impact.py --files PATH...              a given list (dry run)
  python3 tests/flow_impact.py --full                       the full catalogue (nightly, manual, merge queue)
  python3 tests/flow_impact.py --none REASON                no flow (a push to main the merge queue validated)
  add --github-output to write mode, flow lists and shard matrices to $GITHUB_OUTPUT
"""
from pathlib import Path
import json,os,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tests'))
import flow_shards
BROWSER_SHARDS,AUDIO_SHARDS,HUB=10,8,15
CORE={'src/main.js','src/audio.js','src/render.js','index.html','sw.js','manifest.webmanifest','package.json',
 'requirements-dev.txt','vercel.json','recovery.html','tests/browser_helpers.py','tests/creative_regression.py',
 'tests/flow_shards.py','tests/flow_impact.py','tests/flow-durations.json','tests/audio_mix.mjs',
 'scripts/run-browser-tests.py','scripts/browser-processes.py','scripts/chromium-constrained.sh'}
CORE_DIRS=('styles/','.github/','assets/','icons/','server/')
NO_FLOW_DIRS=('docs/','android/','desktop/','tools/','supabase/')
NO_FLOW=re.compile(r'(\.md$|^LICENSE$|^scripts/.*-validation\.json$|^scripts/.*-ci\.json$|^\.gitignore$)')
IMPORT=re.compile(r'''(?:from\s*|import\s*\(\s*)['"](\./[^'"]+\.js)['"]''')

def catalogue():
 audio=sorted(p.name for p in (ROOT/'tests').glob('*_mix.py'))
 # offline_smoke.py runs after the catalogue (scripts/run-browser-tests.py); desktop_smoke.py is manual.
 return flow_shards.browser_flows()+['offline_smoke.py'],audio

def graph():
 """Direct importers of each src module, from static and literal dynamic imports."""
 users={}
 for p in sorted((ROOT/'src').glob('*.js')):
  for spec in IMPORT.findall(p.read_text(encoding='utf-8',errors='ignore')):
   users.setdefault('src/'+spec[2:],set()).add('src/'+p.name)
 return users

def audio_closure(users):
 """src modules the audio render loads: the names in tests/audio_mix.mjs and everything they import."""
 text=(ROOT/'tests/audio_mix.mjs').read_text(encoding='utf-8',errors='ignore')
 pending=[f'src/{n}.js' for n in re.findall(r"['\"/]([a-z0-9-]+)(?:\.js)?['\"]",text) if (ROOT/'src'/f'{n}.js').exists()]
 pending+=['src/'+m for m in re.findall(r'src/([a-z0-9-]+\.js)',text)]
 imports={}
 for m,us in users.items():
  for u in us:imports.setdefault(u,set()).add(m)
 seen=set()
 while pending:
  m=pending.pop()
  if m in seen:continue
  seen.add(m);pending+=sorted(imports.get(m,()))
 return seen

def full_result(why):
 browser,audio=catalogue();return {'mode':'full','reason':why,'browser':browser,'audio':audio}

def select(changes):
 browser,audio=catalogue();everything=browser+audio
 text={f:(ROOT/'tests'/f).read_text(encoding='utf-8',errors='ignore') for f in everything if (ROOT/'tests'/f).exists()}
 names=lambda needle:{f for f,t in text.items() if needle in t}
 users=graph();loaded=audio_closure(users);picked=set();reasons=[]
 for path in sorted(set(changes)):
  if NO_FLOW.search(path) or path.startswith(NO_FLOW_DIRS) or re.match(r'^tests/[^/]+\.mjs$',path) and path!='tests/audio_mix.mjs':continue
  if path in CORE or path.startswith(CORE_DIRS):return full_result(f'shared core: {path}')
  name=path.rsplit('/',1)[-1]
  if path.startswith('tests/') and name in everything:picked.add(name);reasons.append(f'{path} -> itself');continue
  if re.match(r'^tests/[a-z_]+_helpers\.py$',path):
   hits={f for f,t in text.items() if re.search(rf'\b{name[:-3]}\b',t)}
   if not hits:return full_result(f'helper used by no flow: {path}')
   picked|=hits;reasons.append(f'{path} -> {len(hits)} flows');continue
  if re.match(r'^src/[^/]+\.js$',path):
   if len(users.get(path,()))>=HUB:return full_result(f'hub module ({len(users[path])} importers): {path}')
   # A module's family shares its stem: scanner.js, scanner-model.js and scanner-art.js are named src/scanner….
   family=re.sub(r'-(model|view|art|play|rules|state)$','',name[:-3]);stem=family.replace('-','_')
   hits={f for f in text if f.startswith((stem+'_',name[:-3].replace('-','_')+'_'))}|names('src/'+family)
   for m in sorted(users.get(path,set())-{'src/main.js'}):hits|=names(m)
   # Every flow loads the whole game: a module no browser flow names is not mapped, whatever audio renders it.
   if not hits&set(browser):return full_result(f'module no browser flow names: {path}')
   if path in loaded:hits|=set(audio)
   picked|=hits;reasons.append(f'{path} -> {len(hits)} flows');continue
  if path.startswith(('scripts/','tests/')):
   hits=names(name)
   picked|=hits;reasons.append(f'{path} -> {len(hits)} flows');continue
  return full_result(f'unmapped path: {path}')
 return {'mode':'selected' if picked else 'none','reason':'; '.join(reasons) or 'no flow affected',
  'browser':[f for f in browser if f in picked],'audio':[f for f in audio if f in picked]}

# The exact strings scripts/bump-version.mjs rewrites, per file. A diff that only moves them changes no behaviour.
VERSION={
 'index.html':[r'id="releaseVersion">v[^<]+'],
 'sw.js':[r'''const CACHE\s*=\s*['"][^'"]+['"]'''],
 'package.json':[r'"version":\s*"[^"]+"'],
 'src/release-info.js':[r"version:\s*'[^']+'",r"deployedAt:\s*(?:null|'[^']*')",r"revision:\s*(?:null|'[^']*')"],
}

def version_only(path,before,after):
 """True when before and after differ only in the version strings bump-version.mjs writes."""
 if path not in VERSION or before is None or after is None or before==after:return False
 def norm(text):
  for pattern in VERSION[path]:text=re.sub(pattern,'@VERSION@',text)
  return text
 return norm(before)==norm(after)

def show(rev,path):
 r=subprocess.run(['git','show',f'{rev}:{path}'],cwd=ROOT,capture_output=True,text=True)
 return None if r.returncode else r.stdout

def changed(base,head):
 r=subprocess.run(['git','diff','--name-only',base,head,'--'],cwd=ROOT,capture_output=True,text=True)
 if r.returncode:return None
 files=[l for l in r.stdout.splitlines() if l]
 bumped=[f for f in files if f in VERSION and version_only(f,show(base,f),show(head,f))]
 if bumped:print('Version strings only (no flow): '+', '.join(bumped))
 return [f for f in files if f not in bumped]

if __name__=='__main__':
 args=sys.argv[1:];value=lambda k:args[args.index(k)+1] if k in args and args.index(k)+1<len(args) else None
 if '--full' in args or '--none' in args:files=[]
 elif '--files' in args:files=[a for a in args[args.index('--files')+1:] if not a.startswith('--')]
 elif value('--base'):files=changed(value('--base'),value('--head') or 'HEAD')
 else:raise SystemExit(__doc__)
 if '--none' in args:result={'mode':'none','reason':value('--none') or 'no flow requested','browser':[],'audio':[]}
 else:result=full_result('full run') if '--full' in args else select(files) if files is not None else full_result('diff unavailable')
 b,a=result['browser'],result['audio']
 # Shards over the selected set: no more shards than flows, none at all for an empty set.
 # offline_smoke.py runs after the catalogue in the first shard, so it does not count towards the split.
 catalogue_b=[f for f in b if f!='offline_smoke.py']
 bt,at=min(BROWSER_SHARDS,len(catalogue_b)) or int(bool(b)),min(AUDIO_SHARDS,len(a))
 print(f"Flow impact: {len(files or [])} changed files -> {result['mode']} ({result['reason']})")
 print(f'Browser: {len(b)} flows in {bt} shards'+(': '+', '.join(b) if result['mode']!='full' and b else ''))
 print(f'Audio: {len(a)} flows in {at} shards'+(': '+', '.join(a) if result['mode']!='full' and a else ''))
 if '--github-output' in args:
  with open(os.environ['GITHUB_OUTPUT'],'a',encoding='utf-8') as out:
   out.write(f"mode={result['mode']}\nbrowser_flows={','.join(b) if result['mode']!='full' else ''}\naudio_flows={','.join(a) if result['mode']!='full' else ''}\n")
   out.write(f'browser_total={bt}\naudio_total={at}\nbrowser_shards={json.dumps(list(range(1,bt+1)))}\naudio_shards={json.dumps(list(range(1,at+1)))}\n')
