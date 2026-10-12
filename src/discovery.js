import { gravityOf } from './gravity.js';

// Catálogo, retos y recompensas de exploración.
export function initialize(runtime) {
  function discover(sp){if(runtime.S.cat[sp.id])return;runtime.S.cat[sp.id]=1;runtime.S.catN=(runtime.S.catN||0)+1;runtime.S.catRecent=[{n:sp.name,r:sp.region,d:runtime.S.todayKey}].concat(runtime.S.catRecent||[]).slice(0,40);
    runtime.toast("<em>Forma nueva</em> · "+sp.name+" · "+runtime.S.catN);runtime.unlock("forma1");if(runtime.S.catN>=25)runtime.unlock("cat25");if(runtime.S.catN>=100)runtime.unlock("cat100");if(runtime.S.catN>=500)runtime.unlock("cat500");runtime.save();}
  function showRegion(d,first){
    const el=document.getElementById("zone");
    document.getElementById("zMood").textContent=runtime.GEN[d.genre].name+" · "+d.bpm+" BPM";
    document.getElementById("zName").textContent=d.name;
    document.getElementById("zDo").textContent=gravityOf(d,runtime.seedOf).name+" · "+gravityOf(d,runtime.seedOf).movement;
    el.classList.add("on");clearTimeout(zoneT);zoneT=setTimeout(()=>el.classList.remove("on"),first?3200:2200);
  }

  let curRegion=null,RP=null;
  function retoUI(){const el=document.getElementById("reto");if(!RP||!runtime.inWorld()||runtime.S.retos[RP.key]){el.hidden=true;return;}el.hidden=false;
    el.textContent="Reto · "+runtime.RETOTXT[RP.type](RP.goal)+" · "+Math.min(RP.goal,Math.floor(RP.val))+" / "+RP.goal;}
  function retoSet(type,v){if(!RP||RP.type!==type||runtime.S.retos[RP.key])return;RP.val=v;retoUI();if(RP.val>=RP.goal)retoDone();}
  function retoDone(){runtime.S.retos[RP.key]=1;runtime.S.retosN=(runtime.S.retosN||0)+1;const ks=Object.keys(runtime.SAMPLES),k=ks[Math.floor(Math.random()*ks.length)];
    runtime.flash=.8;runtime.pulse=1;burst(runtime.S.wx,runtime.S.wy,30,true);runtime.soon(q=>runtime.chordTones().forEach((n,i)=>runtime.pluck(n+12,q+i*runtime.SIX,runtime.vel(.08),4)));
    runtime.say(runtime.VOZ.reto,"Reto cumplido");runtime.gain(k);runtime.unlock("reto1");if(runtime.S.retosN>=10)runtime.unlock("reto10");if(runtime.S.retosN>=50)runtime.unlock("reto50");retoUI();runtime.save();}
  function touched(){if(!RP||RP.type!=="compas")return;const n=performance.now();RP.touches=RP.touches.filter(x=>n-x<runtime.SIX*16*1000);RP.touches.push(n);retoSet("compas",RP.touches.length);}
  function enterRegion(d,z){
    runtime.MU.dnaT=d;runtime.MU.timbre=runtime.GEN[d.genre].pt;const newPlace=!runtime.S.places[d.key];
    RP=runtime.S.retos[d.key]?null:{key:d.key,type:d.reto.type,goal:d.reto.goal,val:0,set:new Set(),touches:[],pst:0};retoUI();
    if(d.mix!=null)runtime.unlock("frontera");
    const ev=runtime.eventOf(d);if(ev&&!runtime.S.events[ev[0]+":"+d.key+runtime.S.todayKey]){runtime.S.events[ev[0]+":"+d.key+runtime.S.todayKey]=1;runtime.S.events[ev[0]]=1;runtime.unlock("evento1");if(runtime.EVENTS.every(e=>runtime.S.events[e[0]]))runtime.unlock("eventos4");runtime.say(runtime.VOZ[ev[0]],"Evento · "+ev[1]);}
    if(newPlace){runtime.S.places[d.key]=1;runtime.S.placesN=(runtime.S.placesN||0)+1;if(runtime.S.placesN>=10)runtime.unlock("lugar10");if(runtime.S.placesN>=50)runtime.unlock("lugar50");if(runtime.S.placesN>=200)runtime.unlock("lugar200");}
    if(z!==runtime.curZone){runtime.curZone=z;enterZone(z);}
    showRegion(d,newPlace);runtime.save();
  }
  let zoneT;
  function showZone(z,first){
    const B=runtime.BIOMES[z],Z=runtime.ZINFO[B.id],el=document.getElementById("zone");
    document.getElementById("zMood").textContent=Z[0]+" · "+Z[1]+" · "+Math.round(92+runtime.style()*30+B.bpm)+" BPM";
    document.getElementById("zName").textContent=B.name;
    document.getElementById("zDo").textContent=Z[2].join(" · ");
    el.classList.add("on");clearTimeout(zoneT);zoneT=setTimeout(()=>el.classList.remove("on"),first?7000:4500);
  }
  function burst(x,y,n,gold){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=40+Math.random()*120;runtime.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,g:gold});}}
  function seen(id){if(runtime.S.species[id])return;runtime.S.species[id]=runtime.S.todayKey;const n=Object.keys(runtime.S.species).length;runtime.toast("<em>Vida</em> · "+runtime.SPECIES.find(s=>s[0]===id)[1]+" · "+n+" / "+runtime.SPECIES.length);if(n>=runtime.SPECIES.length)runtime.unlock("vida");runtime.save();}

  function collect(m){
    runtime.collected.add(m.id);runtime.S.collected.push(m.id);
    const c=runtime.chunks.get(m.id.split(",").slice(0,2).join(","));if(c){const i=c.indexOf(m);if(i>=0)c.splice(i,1);}
    if(runtime.isFree()){runtime.playerNote(.06);burst(m.x,m.y,4,false);if(runtime.S.capPlusDay!==runtime.S.todayKey){runtime.S.capPlusDay=runtime.S.todayKey;runtime.say(runtime.VOZ.capPlus);}return;}
    runtime.S.luzN=(runtime.S.luzN||0)+1;if(runtime.S.luzN%20===0)runtime.gain("luz");
    if(runtime.S.lastDay!==runtime.S.todayKey) runtime.onFirstLight();
    const r=Math.random(), gold=r<(m.off?.25:.05), big=!gold&&r<(m.off?.6:.25);
    const val=gold?10:big?3:1, before=runtime.level();
    const added=Math.min(val,runtime.CAP-runtime.S.todayLight);runtime.S.todayLight+=added;runtime.S.totalLight+=added;
    runtime.playerNote(big?.17:.14,gold);
    if(gold){runtime.flash=1;runtime.unlock("dorada");}
    burst(m.x,m.y,gold?18:6,gold||runtime.grooveFx>.9);
    const L=runtime.level();
    if(L>before){runtime.pulse=1;runtime.showPhrase(runtime.PHRASES[(L-1)%runtime.PHRASES.length]);if(L>=10)runtime.unlock("s10");}
    if(runtime.isFree()&&!runtime.S.capShown){runtime.S.capShown=true;runtime.unlock("tope");setTimeout(runtime.openCap,700);}
    runtime.hud();
  }

  function takeRelic(rl){
    if(rl.got||rl.id&&runtime.S.relicSites?.[rl.id])return;
    rl.got=true;
    if(rl.id){runtime.S.relicSites||={};runtime.S.relicSites[rl.id]={day:runtime.S.todayKey,name:rl.name};}
    const idx=runtime.S.stars.length;runtime.S.stars.push({d:runtime.S.todayKey,s:rl.s,name:rl.name,id:rl.id,magical:!!rl.magical,p:idx%runtime.ECOS.length,region:runtime.regionOfPos(rl.x,rl.y).key});
    runtime.flash=1;runtime.pulse=1;burst(rl.x,rl.y,40,true);
    runtime.soon(t=>runtime.chordTones().slice(0,3).forEach(n=>runtime.pluck(n,t,runtime.vel(.035),0)));
    const n=runtime.relicsGot();
    runtime.showPhrase(runtime.ECOS[idx%runtime.ECOS.length],true);
    runtime.toast("<em>Estrella "+runtime.S.stars.length+"</em> · "+(rl.name||"Reliquia"));
    runtime.unlock("estrella1");if(n>=3){runtime.unlock("dia3");setTimeout(()=>runtime.showPhrase("Tres hallazgos en un día. El mundo todavía guarda secretos."),5200);}
    if(runtime.S.stars.length>=30)runtime.unlock("e30");if(runtime.S.stars.length>=100)runtime.unlock("e100");
    runtime.save();runtime.hud();
  }

  function enterZone(z){
    const B=runtime.BIOMES[z];runtime.setBiome(z);runtime.zoneHops++;if(runtime.zoneHops>=10)runtime.unlock("turista");
    const isNew=!runtime.S.zones[B.id];
    if(isNew){runtime.S.zones[B.id]=runtime.S.todayKey;const n=Object.keys(runtime.S.zones).length;
      if(n>1)runtime.toast("<em>Familia nueva</em> · "+B.name+" · "+n+" / "+runtime.BIOMES.length);
      if(n>=5)runtime.unlock("zona5");if(n>=runtime.BIOMES.length)runtime.unlock("atlas");runtime.save();}
  }


  Object.defineProperties(runtime, {
    discover: { get: () => discover },
    showRegion: { get: () => showRegion },
    curRegion: { get: () => curRegion, set: value => { curRegion = value; } },
    RP: { get: () => RP, set: value => { RP = value; } },
    retoUI: { get: () => retoUI },
    retoSet: { get: () => retoSet },
    touched: { get: () => touched },
    enterRegion: { get: () => enterRegion },
    burst: { get: () => burst },
    seen: { get: () => seen },
    collect: { get: () => collect },
    takeRelic: { get: () => takeRelic },
  });
}
