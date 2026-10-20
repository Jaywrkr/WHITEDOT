// Host adaptation only: pause existing contexts and save existing blob downloads through Android.
(() => {
 const contexts=new Set(),paused=new Set();
 const NativeContext=window.AudioContext;
 if(NativeContext)window.AudioContext=new Proxy(NativeContext,{construct(Target,args){const ac=new Target(...args);contexts.add(ac);return ac;}});
 window.__whitedotHost={
  pause(){for(const ac of contexts)if(ac.state==='running'){paused.add(ac);ac.suspend().catch(()=>{});}},
  resume(){for(const ac of paused)if(ac.state==='suspended')ac.resume().catch(()=>{});paused.clear();}
 };
 document.addEventListener('click',event=>{
  const a=event.target.closest?.('a[download]');if(!a||!a.href.startsWith('blob:')||!window.AndroidFiles)return;
  event.preventDefault();event.stopImmediatePropagation();
  fetch(a.href).then(r=>r.blob()).then(blob=>{
   if(blob.size>64*1024*1024)throw Error('Archivo demasiado grande para exportar en esta vista previa.');
   const reader=new FileReader();reader.onload=()=>AndroidFiles.postMessage(JSON.stringify({name:a.download||'kubono',type:blob.type||'application/octet-stream',data:reader.result.split(',')[1]}));reader.onerror=()=>alert('No se pudo preparar el archivo.');reader.readAsDataURL(blob);
  }).catch(error=>alert(error.message));
 },true);
})();
