"""Optional cloud test tool; no npm/runtime dependency or package script is changed."""
from pathlib import Path
import base64,hashlib,io,json,os,subprocess,tarfile,urllib.request
VERSION='153.0.0'
INTEGRITY='sha512-jiGWqSvPMdu4+P9TilYqAR7yEGPEHINx+lCvE/NqNO/EHYzF/x1hUiI5T6ioVIt7dEy7n88byyT0vk+dnsgQwA=='
root=Path('/tmp/whitedot-headless');root.mkdir(exist_ok=True)
archive=root/'browser.tgz'
valid=lambda data:'sha512-'+base64.b64encode(hashlib.sha512(data).digest()).decode()==INTEGRITY
if archive.exists() and valid(archive.read_bytes()):payload=archive.read_bytes()
else:
 with urllib.request.urlopen(f'https://registry.npmjs.org/@sparticuz/chromium/-/chromium-{VERSION}.tgz',timeout=90) as response:payload=response.read()
 if not valid(payload):raise SystemExit('Browser integrity mismatch')
 archive.write_bytes(payload)
with tarfile.open(fileobj=io.BytesIO(payload)) as package:
 for member in ['package/bin/chromium.br','package/LICENSE']:
  data=package.extractfile(member)
  if data is None:raise SystemExit('Missing browser asset')
  (root/Path(member).name).write_bytes(data.read())
script="const fs=require('node:fs'),z=require('node:zlib'),p=process.argv[1];fs.writeFileSync(p+'/chromium',z.brotliDecompressSync(fs.readFileSync(p+'/chromium.br')));fs.chmodSync(p+'/chromium',0o755);"
subprocess.run(['node','--v8-pool-size=1','-e',script,str(root)],check=True)
print(json.dumps({'chromium':str(root/'chromium'),'version':VERSION,'integrity':INTEGRITY,'scope':'test tool only; no game dependencies'}))
