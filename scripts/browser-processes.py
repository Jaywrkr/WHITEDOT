"""Reap this test's adopted children, without touching the container supervisor."""
import ctypes,os,signal,subprocess,sys,time

def adopted():
 result=[]
 # Some cloud /proc implementations omit task/*/children.
 for name in os.listdir('/proc'):
  if not name.isdigit():continue
  try:
   with open('/proc/'+name+'/stat') as file:fields=file.read().rsplit(')',1)[1].split()
   if int(fields[1])==os.getpid():result.append(int(name))
  except (OSError,ValueError,IndexError):pass
 return result

def reap():
 live=False
 while True:
  try:
   pid,status=os.waitpid(-1,os.WNOHANG)
   if not pid:live=True;break
   yield pid,status
  except ChildProcessError:break
 return live

def live_children():
 while True:
  try:
   pid,_=os.waitpid(-1,os.WNOHANG)
   if not pid:return True
  except ChildProcessError:return False

def main():
 command=sys.argv[1:];timeout=None
 if not command:raise SystemExit('Expected a test command')
 if command[0].startswith('--timeout='):timeout=float(command.pop(0).split('=',1)[1])
 linux=sys.platform.startswith('linux')
 if not linux:
  try:raise SystemExit(subprocess.run(command,timeout=timeout).returncode)
  except subprocess.TimeoutExpired:raise SystemExit(124)
 if linux and ctypes.CDLL(None,use_errno=True).prctl(36,1,0,0,0)!=0:raise OSError(ctypes.get_errno(),'Cannot enable child reaping')
 if os.environ.get('WHITEDOT_TEST_SERIAL_HTTP')=='1' and len(command)>1 and command[1].endswith('.py'):
  bootstrap="""import http.server,runpy,sys
from pathlib import Path
from playwright._impl import _page
http.server.ThreadingHTTPServer.process_request=http.server.HTTPServer.process_request
async def write_inline(path,data):
 Path(path).write_bytes(data)
# Screenshot evidence is small; the constrained runner needs no extra I/O thread.
_page.async_writefile=write_inline
sys.argv=sys.argv[1:]
runpy.run_path(sys.argv[0],run_name='__main__')
"""
  command=[command[0],'-c',bootstrap,*command[1:]]
 process=subprocess.Popen(command);deadline=time.monotonic()+timeout if timeout else float('inf');timed_out=False;stop_at=None
 def stop(sig,_):
  try:os.kill(process.pid,sig)
  except ProcessLookupError:pass
 for sig in [signal.SIGTERM,signal.SIGINT]:signal.signal(sig,stop)
 while process.returncode is None:
  for pid,status in reap():
   if pid==process.pid:process.returncode=os.waitstatus_to_exitcode(status)
  if process.returncode is not None:break
  if time.monotonic()>deadline and stop_at is None:
   timed_out=True;stop(signal.SIGTERM,None);stop_at=time.monotonic()+1
  if stop_at and time.monotonic()>stop_at:stop(signal.SIGKILL,None)
  time.sleep(.05)
 # All remaining children belong to this test. Ordinary runs usually have none.
 list(reap())
 if linux:
  for sig in [signal.SIGTERM,signal.SIGKILL]:
   if not live_children():break
   remaining=adopted()
   for pid in remaining:
    try:os.kill(pid,sig)
    except ProcessLookupError:pass
   until=time.monotonic()+.4
   while live_children() and time.monotonic()<until:list(reap());time.sleep(.02)
 list(reap());code=124 if timed_out else process.returncode
 raise SystemExit(code if code>=0 else 128-code)
if __name__=='__main__':main()
