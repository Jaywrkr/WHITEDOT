"""Optional same-origin service. Python stdlib, SQLite, invite-only two-person rooms.
Run behind HTTPS in production; see SERVIDOR_Y_DUETOS.md. Never log secrets or saves.
"""
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from http.cookies import SimpleCookie
from pathlib import Path
from urllib.parse import urlparse,parse_qs,unquote
from collections import deque
import os,json,sqlite3,secrets,hashlib,hmac,time,threading,re,argparse
ROOT=Path(__file__).resolve().parents[1]
MAX_BODY=8*1024*1024
class APIError(Exception):
 def __init__(self,code,message,**extra):self.code=code;self.body={'error':message,**extra}
def number(value,low,high):return isinstance(value,(int,float)) and not isinstance(value,bool) and low<=value<=high

def world_key(value):
 if not isinstance(value,dict) or not isinstance(value.get('seed'),str) or len(value['seed'])>40 or value.get('layout') not in ['classic','wide','vasto','grand','immense']:raise APIError(400,'Mundo inválido')
 versions=tuple(value.get(k) for k in ['generatorVersion','catalogVersion','layoutVersion'])
 if not all(type(v) is int for v in versions) or versions not in [(1,1,1),(2,2,2)]:raise APIError(400,'Versión no compatible')
 return json.dumps({k:value[k] for k in ['seed','layout','generatorVersion','catalogVersion','layoutVersion']},sort_keys=True,separators=(',',':'))

class Store:
 def __init__(self,path):
  self.path=str(path);self.lock=threading.RLock();self.rooms={};self.rates={}
  with self.db() as db:
   db.executescript('CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT UNIQUE,salt TEXT,hash TEXT); CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user TEXT,csrf TEXT,expires REAL,guest INTEGER); CREATE TABLE IF NOT EXISTS saves(user TEXT,scope TEXT,revision INTEGER,state TEXT,PRIMARY KEY(user,scope)); CREATE TABLE IF NOT EXISTS edits(world TEXT,id TEXT,data TEXT,PRIMARY KEY(world,id));')
 def db(self):
  conn=sqlite3.connect(self.path,timeout=10);conn.execute('PRAGMA journal_mode=WAL');return conn
 def limit(self,ip,kind,maximum):
  with self.lock:
   now=time.time();key=(ip,kind);q=self.rates.setdefault(key,deque())
   while q and q[0]<now-60:q.popleft()
   if len(q)>=maximum:raise APIError(429,'Espera un momento antes de intentar de nuevo')
   q.append(now)
   if len(self.rates)>2048:self.rates={k:v for k,v in self.rates.items() if v and v[-1]>now-60}
 def session(self,token):
  with self.db() as db:row=db.execute('SELECT s.user,s.csrf,s.guest,u.name FROM sessions s JOIN users u ON u.id=s.user WHERE token=? AND expires>?',(token,time.time())).fetchone()
  return {'id':row[0],'csrf':row[1],'guest':bool(row[2]),'name':row[3]} if row else None
 def new_session(self,user,guest=False):
  token=secrets.token_urlsafe(32);csrf=secrets.token_urlsafe(32)
  with self.db() as db:
   db.execute('DELETE FROM sessions WHERE expires<?',(time.time(),))
   # Bound active credentials per user, do not let login grow the database indefinitely.
   db.execute('DELETE FROM sessions WHERE user=? AND token NOT IN (SELECT token FROM sessions WHERE user=? ORDER BY expires DESC LIMIT 3)',(user,user))
   db.execute('INSERT INTO sessions VALUES(?,?,?,?,?)',(token,user,csrf,time.time()+(86400 if guest else 604800),int(guest)))
  return token
 def prune(self):
  now=time.time()
  for code,room in list(self.rooms.items()):
   room['members']={u:m for u,m in room['members'].items() if m['seen']>now-30}
   if not room['members'] or now-room['created']>7200:del self.rooms[code]

def password_hash(password,salt):return hashlib.scrypt(password.encode(),salt=bytes.fromhex(salt),n=16384,r=8,p=1).hex()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def log_message(self,*args):pass
 def end_headers(self):
  self.send_header('X-Content-Type-Options','nosniff');self.send_header('Referrer-Policy','same-origin');self.send_header('X-Frame-Options','DENY')
  self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'")
  if self.path.startswith('/api/'):self.send_header('Cache-Control','no-store')
  elif self.path.split('?')[0] in ['/sw.js','/index.html','/']:self.send_header('Cache-Control','no-cache')
  super().end_headers()
 def list_directory(self,path):self.send_error(404);return None
 def do_GET(self):
  if self.path.startswith('/api/'):self.api('GET');return
  path=unquote(urlparse(self.path).path)
  allowed=path in ['/','/index.html','/sw.js','/manifest.webmanifest'] or any(path.startswith('/'+d+'/') for d in ['src','styles','icons','assets'])
  if not allowed or '..' in path.split('/') or '\\' in path or '\x00' in path:self.send_error(404);return
  super().do_GET()
 def do_HEAD(self):
  path=unquote(urlparse(self.path).path)
  if not (path in ['/','/index.html','/sw.js','/manifest.webmanifest'] or any(path.startswith('/'+d+'/') for d in ['src','styles','icons','assets'])) or '..' in path.split('/'):self.send_error(404);return
  super().do_HEAD()
 def do_POST(self):self.api('POST')
 def do_PUT(self):self.api('PUT')
 def do_PATCH(self):self.api('PATCH')
 def token(self):
  try:c=SimpleCookie();c.load(self.headers.get('Cookie',''));return c['wd_session'].value if 'wd_session' in c else ''
  except Exception:return ''
 def respond(self,code,payload,cookie=None):
  data=json.dumps(payload,ensure_ascii=False,allow_nan=False).encode();self.send_response(code);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(data)))
  if cookie is not None:self.send_header('Set-Cookie','wd_session='+cookie+'; Path=/api; HttpOnly; SameSite=Strict; Max-Age='+('604800' if cookie else '0')+('; Secure' if self.server.secure else ''))
  self.end_headers();self.wfile.write(data)
 def api(self,method):
  try:
   store=self.server.store;path=urlparse(self.path).path;query=parse_qs(urlparse(self.path).query);data={}
   store.limit(self.client_address[0],'api',1200)
   if method!='GET':
    if self.headers.get('Origin')!=self.server.origin:raise APIError(403,'Origen no permitido')
    if self.headers.get('Content-Type','').split(';')[0]!='application/json':raise APIError(415,'Se requiere JSON')
    try:length=int(self.headers.get('Content-Length','0'))
    except ValueError:raise APIError(400,'Longitud inválida')
    if length<2 or length>MAX_BODY:raise APIError(413,'Solicitud demasiado grande')
    try:data=json.loads(self.rfile.read(length),parse_constant=lambda v:(_ for _ in ()).throw(ValueError()))
    except (ValueError,UnicodeError):raise APIError(400,'JSON inválido')
    if not isinstance(data,dict):raise APIError(400,'Se requiere un objeto')
   after=data.get('after',0) if method!='GET' else query.get('after',['0'])[0]
   try:self.after=max(0,min(2000000000,int(after)))
   except (TypeError,ValueError):raise APIError(400,'Cursor inválido')
   user=store.session(self.token())
   if path=='/api/health' and method=='GET':self.respond(200,{'service':'whitedot','version':json.loads((ROOT/'package.json').read_text())['version']});return
   if path=='/api/session' and method=='GET':self.respond(200,{'user':user,'serverTime':time.time()*1000});return
   if path in ['/api/register','/api/login','/api/guest'] and method=='POST':
    store.limit(self.client_address[0],'auth',12)
    if path=='/api/guest':
     uid=secrets.token_hex(16);name='Viajero '+uid[:6]
     with store.db() as db:
      # Reap expired guests; only guest identities have NULL hashes, never permanent users.
      for row in db.execute('SELECT id FROM users WHERE hash IS NULL AND id NOT IN (SELECT user FROM sessions WHERE expires>?)',(time.time(),)).fetchall():db.execute('DELETE FROM users WHERE id=?',row)
      db.execute('INSERT INTO users VALUES(?,?,NULL,NULL)',(uid,name))
    else:
     name=data.get('name','');password=data.get('password','')
     if not isinstance(name,str) or not re.fullmatch(r'[A-Za-z0-9_-]{3,32}',name) or not isinstance(password,str) or not 12<=len(password)<=128:raise APIError(400,'Nombre de 3–32 caracteres; clave de 12–128')
     with store.db() as db:
      if path=='/api/register':
       uid=secrets.token_hex(16);salt=secrets.token_hex(16)
       try:db.execute('INSERT INTO users VALUES(?,?,?,?)',(uid,name.lower(),salt,password_hash(password,salt)))
       except sqlite3.IntegrityError:raise APIError(409,'Nombre no disponible')
      else:
       row=db.execute('SELECT id,salt,hash FROM users WHERE name=?',(name.lower(),)).fetchone();salt=row[1] if row and row[1] else '0'*32;hashed=password_hash(password,salt)
       if not row or not row[2] or not hmac.compare_digest(hashed,row[2]):raise APIError(401,'Nombre o clave incorrectos')
       uid=row[0]
    token=store.new_session(uid,path=='/api/guest');self.respond(200,{'user':store.session(token)},token);return
   if not user:raise APIError(401,'Inicia sesión o entra como invitado')
   if method!='GET' and not hmac.compare_digest(self.headers.get('X-WD-CSRF',''),user['csrf']):raise APIError(403,'Sesión no válida; vuelve a entrar')
   if path=='/api/logout' and method=='POST':
    with store.db() as db:db.execute('DELETE FROM sessions WHERE token=?',(self.token(),))
    with store.lock:
     for room in store.rooms.values():room['members'].pop(user['id'],None)
    self.respond(200,{'ok':True},'');return
   if path=='/api/save':
    if user['guest']:raise APIError(403,'El invitado guarda en este dispositivo; usa una cuenta para sincronizar')
    scope=query.get('scope',[''])[0] if method=='GET' else data.get('scope');
    if not isinstance(scope,str) or not 1<=len(scope)<=512:raise APIError(400,'Partida inválida')
    with store.lock,store.db() as db:
     old=db.execute('SELECT revision,state FROM saves WHERE user=? AND scope=?',(user['id'],scope)).fetchone()
     if method=='GET':self.respond(200,{'revision':old[0] if old else 0,'state':json.loads(old[1]) if old else None});return
     if method!='PUT':raise APIError(405,'Método no permitido')
     if data.get('revision')!=(old[0] if old else 0):raise APIError(409,'Otra copia cambió. Descarga o conserva ambas.',revision=old[0] if old else 0)
     state=data.get('state');
     if not isinstance(state,dict):raise APIError(400,'Partida inválida')
     world_key(state.get('worldIdentity'));raw=json.dumps(state,allow_nan=False,separators=(',',':'))
     if len(raw.encode())>MAX_BODY-1024:raise APIError(413,'Partida demasiado grande')
     count=db.execute('SELECT COUNT(*) FROM saves WHERE user=?',(user['id'],)).fetchone()[0]
     if not old and count>=64:raise APIError(409,'Máximo 64 partidas sincronizadas')
     revision=(old[0] if old else 0)+1;db.execute('INSERT OR REPLACE INTO saves VALUES(?,?,?,?)',(user['id'],scope,revision,raw))
    self.respond(200,{'revision':revision});return
   with store.lock:
    store.prune()
    if path=='/api/rooms' and method=='POST':
     if len(store.rooms)>=128:raise APIError(503,'Salas ocupadas; intenta después')
     world=world_key(data.get('world'));bpm=data.get('bpm');x=data.get('x');y=data.get('y');layer=data.get('layer','superficie')
     if not number(bpm,45,200) or not number(x,-1e12+1,1e12-1) or not number(y,-1e12+1,1e12-1) or layer not in ['superficie','bajo','cielo']:raise APIError(400,'Lugar o tempo inválido')
     code=secrets.token_hex(6).upper();now=time.time();store.rooms[code]={'code':code,'world':json.loads(world),'worldKey':world,'bpm':bpm,'x':x,'y':y,'layer':layer,'epoch':now*1000+1000,'created':now,'members':{},'events':deque(maxlen=128),'seq':0}
     room=store.rooms[code];room['members'][user['id']]={'id':user['id'],'name':user['name'],'slot':0,'x':x,'y':y,'seen':now,'color':'#ffffff'};self.respond(201,self.snapshot(room,user));return
    match=re.fullmatch(r'/api/rooms/([A-F0-9]{12})(?:/(join|presence|event|edit|leave))?',path)
    if not match or match[1] not in store.rooms:raise APIError(404,'Sala no disponible')
    room=store.rooms[match[1]];action=match[2]
    if action=='join' and method=='POST':
     if world_key(data.get('world'))!=room['worldKey']:raise APIError(409,'Abre la semilla y versión de esta sala',world=room['world'])
     if user['id'] not in room['members']:
      if len(room['members'])>=2:raise APIError(409,'Esta sala es para dos voces')
      slot=next(s for s in [0,1] if s not in [m['slot'] for m in room['members'].values()]);room['members'][user['id']]={'id':user['id'],'name':user['name'],'slot':slot,'x':room['x'],'y':room['y'],'seen':time.time(),'color':'#d6c493' if slot else '#ffffff'}
     self.respond(200,self.snapshot(room,user));return
    member=room['members'].get(user['id'])
    if not member:raise APIError(403,'Únete con el código de invitación')
    if action=='leave' and method=='POST':room['members'].pop(user['id']);self.respond(200,{'ok':True});return
    member['seen']=time.time()
    if action=='presence' and method=='POST':
     x=data.get('x');y=data.get('y');color=data.get('color','#ffffff')
     if not number(x,room['x']-5000,room['x']+5000) or not number(y,room['y']-5000,room['y']+5000):raise APIError(400,'La sala comparte un entorno local')
     member.update(x=x,y=y,color=color if isinstance(color,str) and re.fullmatch(r'#[0-9a-fA-F]{6}',color) else '#ffffff')
    elif action=='event' and method=='POST':
     store.limit(user['id'],'notes',80);kind=data.get('kind');index=data.get('index');variant=data.get('variant',0)
     if not isinstance(kind,str) or not re.fullmatch(r'[a-zA-Z0-9:_,-]{1,90}',kind) or not number(index,0,6) or not number(variant,0,255):raise APIError(400,'Gesto inválido')
     room['seq']+=1;six=60000/room['bpm']/4;step=max(0,int((time.time()*1000-room['epoch'])/six)+8)
     room['events'].append({'seq':room['seq'],'user':user['id'],'slot':member['slot'],'kind':kind,'index':int(index),'variant':int(variant),'step':step,'x':member['x'],'y':member['y']})
    elif action=='edit' and method=='PATCH':
     key=data.get('id')
     if not isinstance(key,str) or not re.fullmatch(r'living:v1:-?\d+,-?\d+:\d+(?::(?:bajo|cielo))?',key):raise APIError(400,'Construcción inválida')
     pos=re.search(r'(-?\d+),(-?\d+)',key)
     if abs(int(pos[1])*900-member['x'])>6000 or abs(int(pos[2])*900-member['y'])>6000:raise APIError(400,'Construcción fuera de la sala')
     with store.db() as db:
      count=db.execute('SELECT COUNT(*) FROM edits WHERE world=?',(room['worldKey'],)).fetchone()[0]
      if count>=512 and not db.execute('SELECT 1 FROM edits WHERE world=? AND id=?',(room['worldKey'],key)).fetchone():raise APIError(409,'Memoria compartida llena')
      db.execute('INSERT OR REPLACE INTO edits VALUES(?,?,?)',(room['worldKey'],key,json.dumps({'open':True,'visits':1})))
    elif action is not None:raise APIError(405,'Método no permitido')
    self.respond(200,self.snapshot(room,user))
  except APIError as e:self.respond(e.code,e.body)
  except (sqlite3.Error,OSError,RecursionError,ValueError,TypeError):self.respond(500,{'error':'No se pudo completar; conserva tu copia local'})
 def snapshot(self,room,user):
  with self.server.store.db() as db:edits={key:json.loads(raw) for key,raw in db.execute('SELECT id,data FROM edits WHERE world=?',(room['worldKey'],))}
  return {k:room[k] for k in ['code','world','bpm','x','y','layer','epoch']}|{'members':[{k:v for k,v in m.items() if k!='seen'} for m in room['members'].values()],'events':[e for e in room['events'] if e['seq']>self.after],'edits':edits,'serverTime':time.time()*1000,'you':user['id']}

def create_server(host='127.0.0.1',port=8080,database=None,origin=None):
 path=Path(database or os.environ.get('WD_DATABASE',str(ROOT/'server/data/world.sqlite')));path.parent.mkdir(parents=True,exist_ok=True)
 server=ThreadingHTTPServer((host,port),Handler);server.daemon_threads=True;server.store=Store(path);server.origin=origin or os.environ.get('WD_ORIGIN') or f'http://{host}:{server.server_port}';server.secure=server.origin.startswith('https://');return server
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--host',default='127.0.0.1');parser.add_argument('--port',type=int,default=8080);args=parser.parse_args();server=create_server(args.host,args.port);print('WHITEDOT ready; same-origin API and static shell',flush=True)
 try:server.serve_forever()
 except KeyboardInterrupt:server.server_close()
