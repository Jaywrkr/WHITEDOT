"""Local-only callback for Supabase's default http://localhost:3000 Site URL."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ALLOWED={'/':'recovery.html','/recovery.html':'recovery.html','/src/cloud-config.js':'src/cloud-config.js','/src/cloud-client.js':'src/cloud-client.js','/src/cloud-recovery.js':'src/cloud-recovery.js'}
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  path=ALLOWED.get(self.path.split('?')[0])
  if not path:self.send_error(404);return
  self.path='/'+path
  super().do_GET()
 def do_HEAD(self):self.send_error(405)
 def translate_path(self,path):return str(ROOT/path.lstrip('/'))
 def end_headers(self):
  self.send_header('Cache-Control','no-store');self.send_header('Referrer-Policy','no-referrer');super().end_headers()
 def log_message(self,*args):pass
if __name__=='__main__':
 print('Kubono recovery: http://localhost:3000/ (local only)',flush=True)
 ThreadingHTTPServer(('127.0.0.1',3000),Handler).serve_forever()
