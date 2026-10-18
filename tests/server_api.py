"""Real HTTP/SQLite auth, origin/CSRF, CAS saves, invite capacity and persisted edits."""
from pathlib import Path
import importlib.util,tempfile,threading,json,urllib.request,urllib.error,http.cookiejar,concurrent.futures
ROOT=Path(__file__).resolve().parents[1];spec=importlib.util.spec_from_file_location('wd_server',ROOT/'server/app.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
with tempfile.TemporaryDirectory() as tmp:
 server=module.create_server(port=0,database=Path(tmp)/'test.sqlite');threading.Thread(target=server.serve_forever,daemon=True).start();origin=server.origin
 class Client:
  def __init__(self):self.http=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
  def call(self,path,method='GET',data=None,csrf=True,origin_value=None):
   request=urllib.request.Request(origin+path,data=json.dumps(data).encode() if data is not None else None,method=method,headers={'Content-Type':'application/json','Origin':origin_value or origin,'X-WD-CSRF':self.csrf if csrf else ''})
   try:response=self.http.open(request);code=response.status;body=response.read()
   except urllib.error.HTTPError as error:code=error.code;body=error.read()
   try:value=json.loads(body)
   except ValueError:value={}
   if value.get('user'):self.csrf=value['user']['csrf']
   return code,value
 try:
  a,b,c=Client(),Client(),Client();assert a.call('/api/health')[0]==200;assert a.call('/server/data/world.sqlite')[0]==404;assert a.call('/.git/config')[0]==404;assert a.call('/src/main.js')[0]==200
  assert a.call('/api/register','POST',{'name':'test_a','password':'test-only-password'})[0]==200
  assert b.call('/api/register','POST',{'name':'test_b','password':'test-only-password'})[0]==200
  assert c.call('/api/guest','POST',{})[0]==200
  world={'seed':'duet','layout':'immense','generatorVersion':2,'catalogVersion':2,'layoutVersion':2};state={'worldIdentity':world,'wx':500,'wy':500};save={'scope':'test','revision':0,'state':state}
  assert a.call('/api/save','PUT',save,csrf=False)[0]==403;assert a.call('/api/save','PUT',save,origin_value='https://evil.invalid')[0]==403
  with concurrent.futures.ThreadPoolExecutor(2) as pool:codes=list(pool.map(lambda _:a.call('/api/save','PUT',save)[0],range(2)))
  assert sorted(codes)==[200,409],codes;assert a.call('/api/save?scope=test')[1]['revision']==1;assert b.call('/api/save?scope=test')[1]['state'] is None;assert c.call('/api/save','PUT',save)[0]==403
  code,room=a.call('/api/rooms','POST',{'world':world,'x':500,'y':500,'bpm':120});assert code==201;route='/api/rooms/'+room['code'];assert b.call(route)[0]==403
  assert b.call(route+'/join','POST',{'world':{**world,'seed':'other'}})[0]==409;assert b.call(route+'/join','POST',{'world':world})[0]==200;assert c.call(route+'/join','POST',{'world':world})[0]==409
  data=a.call(route+'/event','POST',{'kind':'living:cactus','index':3,'variant':4});assert data[0]==200;event=b.call(route)[1]['events'][0];assert event['slot']==0 and event['step']>=0;assert b.call(route+'?after='+str(event['seq']))[1]['events']==[]
  assert a.call(route+'/presence','POST',{'x':99999,'y':500})[0]==400;assert a.call(route+'/edit','PATCH',{'id':'living:v1:0,0:1'})[0]==200
  assert b.call(route)[1]['edits']['living:v1:0,0:1']['open'];assert a.call(route+'/event','POST',{'kind':'<script>','index':3})[0]==400
  assert a.call('/api/logout','POST',{})[0]==200;assert a.call('/api/save?scope=test')[0]==401
  # Restart the service/store, not the test process: copies and shared place edits survive.
  restarted=module.Store(Path(tmp)/'test.sqlite')
  with restarted.db() as db:assert db.execute('SELECT revision FROM saves').fetchone()[0]==1;assert db.execute('SELECT COUNT(*) FROM edits').fetchone()[0]==1
  try:db.execute('SELECT 1')
  except module.sqlite3.ProgrammingError:pass
  else:raise AssertionError('Database context leaked its connection')
  try:
   with restarted.db() as failed:
    failed.execute("INSERT INTO users(id,name) VALUES('rollback-fixture','rollback-fixture')")
    raise RuntimeError('rollback fixture')
  except RuntimeError:pass
  with restarted.db() as checked:assert checked.execute("SELECT COUNT(*) FROM users WHERE id='rollback-fixture'").fetchone()[0]==0
  try:failed.execute('SELECT 1')
  except module.sqlite3.ProgrammingError:pass
  else:raise AssertionError('Exceptional database context leaked its connection')
  print('PASS HTTP accounts/guests, protected files, origin/CSRF, concurrent CAS, save isolation, 2-slot rooms, clocked events, validation and persistent edits')
 finally:server.shutdown();server.server_close()
