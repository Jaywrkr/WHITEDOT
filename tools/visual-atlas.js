// Review artifact only. Called by render-visual-atlas.py with isolated, instrumented game modules.
export async function renderAtlas(r){
 const [{FAMILIES,createFamilyState},{drawShape},{createPlaythings},{ECOLOGY_CONTENT},{personalityOf},{ECOLOGIES},{createBox}]=await Promise.all([
  import('../src/encounter-families.js'),import('../src/encounters.js'),import('../src/playthings.js'),import('../src/ecology-model.js'),import('../src/personality.js'),import('../src/ecology-model.js'),import('../src/encounter-depth-model.js')]);
 const methods={};for(const name of Object.getOwnPropertyNames(r))try{methods[name]=r[name];}catch(_){}
 const set=(name,value)=>Object.defineProperty(r,name,{value,writable:true,configurable:true});
 const work=document.getElementById('w'),c=work.getContext('2d');work.width=work.height=320;set('W',320);set('H',320);set('cx',c);
 for(const name of ['drawRivers','drawAlive','drawLandmarks','drawPortals','drawGlass','drawMirrors','drawPhenomena','drawJam','drawSoundCues','drawEcology','drawPlaythings','drawPocketHints','drawMateria','drawVida','drawQuietud','drawCajas','drawCultures','drawPet','petTick','drawCubeStyle','bodyTick','quietTick','cajasTick','cultureTick','riverStep','aliveStep','save','hud','toast','say','showPhrase','unlock','pruneRelics'])set(name,()=>{});
 set('eventOf',()=>null);set('nearbyRelics',()=>[]);set('sceneChunk',x=>x);set('blobHabitat',()=>false);set('vitalityAt',()=>.6);
 r.S.mode='world';r.S.layer='superficie';r.S.sound=false;r.S.wx=r.S.wy=1350;r.S.todayLight=r.CAP;r.S.relaxedCreate=true;r.MU.vit=.6;r.MU.speed=0;r.MU.E=.2;r.MU.layers=new Set();
 document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
 const region=r.regionOfPos(1350,1350),palette=region.pal,items=[];
 const card=(group,name,source,draw,scale=2)=>items.push({group,name,source,draw,scale});
 const simple=(fn,scale=2)=>()=>{c.save();c.translate(160,155);c.scale(scale,scale);c.globalAlpha=1;c.strokeStyle=c.fillStyle='#b9d5c4';fn();c.restore();};
 const fields=['grass','flies','walkers','ponds','pillars','motes','crystals','beacons','lotus','flowers','stal','props','plants','sp','playthings','pockets'];
 function native(field,object){return ()=>{
  r.S.wx=r.S.wy=1350;r.curRegion=region.key;r.curZone=region.z;r.MU.dnaT=region;r.waves=[];r.bolts=[];r.beams=[];r.flocks=[];r.wchunks.clear();
  for(let x=0;x<4;x++)for(let y=0;y<4;y++){const chunk={id:x+','+y,z:0,var:0,pal:palette,ground:null,dunes:false};for(const f of fields)chunk[f]=[];r.wchunks.set(chunk.id,chunk);}
  if(field==='bolts')r.bolts=[object];else if(field==='beams')r.beams=[object];else if(field==='flocks')r.flocks=[object];else r.wchunks.get('1,1')[field]=[{x:1430,y:1350,hx:1430,hy:1350,lit:0,cd:Infinity,ph:1,fx:0,fy:0,...object}];
  r.__atlas_render.worldStep(0,0,0,0,.25,true,0);
  // Enlarge the source's own canvas region; native geometry and proportions remain intact.
  const crop=document.createElement('canvas');crop.width=crop.height=320;crop.getContext('2d').drawImage(work,175,75,135,165,50,25,220,270);c.globalAlpha=1;c.fillStyle='#000';c.fillRect(0,0,320,320);c.drawImage(crop,0,0);
 };}
 card('PUNTO, LUZ Y ESTUDIO','Punto blanco','src/render.js',simple(()=>{c.fillStyle='#fff';c.fillRect(-5,-5,10,10);},2));
 card('PUNTO, LUZ Y ESTUDIO','Luz del Camino','src/studio.js',simple(()=>r.__atlas_studio.drawSample('luz',0,0,5,'#fff'),3));
 card('PUNTO, LUZ Y ESTUDIO','Luz dorada','src/studio.js',simple(()=>r.__atlas_studio.drawSample('luz',0,0,5,r.GOLD),3));
 card('PUNTO, LUZ Y ESTUDIO','Estudio radial','src/studio.js',()=>{r.S.studio.slots={'0,0':'luz','1,3':'arbol','2,6':'cristal','3,10':'flor'};methods.studioStep(0,0,.2);});
 card('PUNTO, LUZ Y ESTUDIO','Campamento / recuerdo','src/alive.js',simple(()=>{r.S.camps=[[0,0]];r.__atlas_alive.drawMemory(c,320,320,r.S,0,0);},3));
 for(const t of ['hierba','flor','arbusto','helecho','junco','coral'])card('FLORA Y OBJETOS DEL SUELO',t[0].toUpperCase()+t.slice(1),'src/interactions.js',simple(()=>methods.drawPlant({pt:{t,hue:150,pet:6},h:25,ph:1,lit:0,sw:0},0,14,1200,.3),2.7));
 for(const k of ['piedra','hongo','campanilla','cactus','antena','gota','astro'])card('FLORA Y OBJETOS DEL SUELO',k[0].toUpperCase()+k.slice(1),'src/interactions.js',simple(()=>methods.drawProp({k,lit:0},0,0,'#bdc9c5'),4));
 card('FLORA Y OBJETOS DEL SUELO','Árbol de luz','src/render.js',native('grass',{h:38,tall:true,lit:.25}));
 card('FLORA Y OBJETOS DEL SUELO','Pilar','src/render.js',native('pillars',{w:12,h:65,hit:0}));
 card('FLORA Y OBJETOS DEL SUELO','Cristal','src/render.js',native('crystals',{s:13,rot:.2}));
 card('FLORA Y OBJETOS DEL SUELO','Faro pequeño','src/render.js',native('beacons',{layer:0,on:false}));
 card('FLORA Y OBJETOS DEL SUELO','Faro encendido','src/render.js',native('beacons',{layer:1,on:true}));
 card('FLORA Y OBJETOS DEL SUELO','Estanque','src/render.js',native('ponds',{r:45}));
 card('FLORA Y OBJETOS DEL SUELO','Loto','src/render.js',native('lotus',{deg:2,vx:0,vy:0,pond:{x:1430,y:1350,r:70}}));
 card('FLORA Y OBJETOS DEL SUELO','Estalactita','src/render.js',native('stal',{h:25}));
 card('FLORA Y OBJETOS DEL SUELO','Flor sembrada','src/render.js',native('flowers',{n:2,st:0,hit:0}));
 card('VIDA Y FORMAS PROCEDURALES','Luciérnaga','src/render.js',native('flies',{a:1,ph:2.62,hx:1385,hy:1397}));
 card('VIDA Y FORMAS PROCEDURALES','Caminante','src/render.js',native('walkers',{a:0,near:0,follow:0,done:false,trail:[],lt:null}));
 const species=[];for(let i=0;i<4;i++)species.push(...r.regionOfPos((i+1)*3600+100,800).species);
 species.slice(0,6).forEach((sp,i)=>card('VIDA Y FORMAS PROCEDURALES','Forma procedural '+String.fromCharCode(65+i),'src/interactions.js',simple(()=>methods.drawSprite(sp.bits,0,0,sp.cell,sp.col),3)));
 species.slice(0,4).forEach((sp,i)=>card('VIDA Y FORMAS PROCEDURALES','Blob '+String.fromCharCode(65+i),'src/blobs.js',simple(()=>methods.drawBlob(sp,{x:0,y:0,ph:1,lit:0},0,0,1700,.3),2.4)));
 card('VIDA Y FORMAS PROCEDURALES','Bandada','src/render.js',native('flocks',{x:1430,y:1350,h:0,close:0,done:false,b:Array.from({length:7},(_,i)=>({ox:(i-3)*12,oy:Math.abs(i-3)*6,ph:i}))}));
 const pool=[];for(let x=0;x<30;x++)pool.push(...createPlaythings(x,0,900,2,'ruinas',r.seedOf,r.rng));
 for(const kind of ['spark','spring','kite','rotor','resonator']){
  let o=pool.find(o=>o.kind===kind);if(!o){for(let x=0;x<50&&!o;x++)o=createPlaythings(x,1,900,2,'bosque',r.seedOf,r.rng).find(o=>o.kind===kind);}
  if(!o)throw Error('Missing native toy '+kind);const names={spark:'Luz fugitiva',spring:'Brote saltarín',kite:'Cometa flotante',rotor:'Prisma giratorio',resonator:'Aro resonante'};
  card('JUGUETES MUSICALES',names[kind],'src/playthings.js',simple(()=>{r.S.wx=r.S.wy=-200;const object={...o,x:0,y:0,hx:0,hy:0,cd:Infinity,personality:personalityOf(o.id,r.seedOf,r.rng),growth:.2};methods.drawPlaythings({id:'atlas',playthings:[object]},1000,0,0,0,1000,[]);},2.8));
 }
 for(const definition of ECOLOGY_CONTENT){const kind=definition.id.slice(8);card('PAISAJES VIVOS · SEIS FAMILIAS',definition.name,'src/ecology.js',simple(()=>{
  r.S.wx=r.S.wy=-80;const object={id:definition.id,kind,x:0,y:0,hx:0,hy:0,size:14,phase:1,lit:0,charge:.25,bend:.3,material:definition.materials[0],personality:personalityOf(definition.id,r.seedOf,r.rng)};
  methods.drawEcology({id:'0,0',pal:palette,ecologyObjects:[object]},1200,0,0,600);
 },2.7));}
 for(const [kind,family] of Object.entries(FAMILIES))card('ENCUENTROS',family.name,'src/encounters.js',simple(()=>{r.S.wx=r.S.wy=0;const state=createFamilyState(),o={id:'atlas:'+kind,kind,x:0,y:0,hue:150,variant:2,state};state.charge=.4;state.phase=.6;drawShape(c,family.shape,state,o,r);methods.depthDraw(o);},kind==='weaver'?1.5:2));
 card('ENCUENTROS','Suelo resonante · desplegado','src/encounter-depth.js',simple(()=>{r.S.wx=r.S.wy=0;const state=createFamilyState();state.a=.9;state.box=createBox(region);const o={id:'atlas:box-open',kind:'box',x:0,y:0,state};methods.depthDraw(o);},.85));
 const relicNames=['Triángulo','Círculo','Cruz','Rombo','Aro y punto','Dos cuadrados','Aspa','Hexágono','Arco','Tres puntos','Escuadra','Cuadrado y punto'];
 relicNames.forEach((name,i)=>card('RELIQUIAS · DOCE GLIFOS',name,'src/render.js',simple(()=>{c.fillStyle=c.strokeStyle=r.GOLD;r.__atlas_render.glyph(c,i,0,0,12);},2.7)));
 card('INSTALACIONES','Vidrios cromáticos','src/glass.js',()=>{r.S.wx=1080;r.S.wy=900;methods.drawGlass(1000,0,160-1080,150-900,250);});
 card('INSTALACIONES','Espejos y receptor','src/mirrors.js',()=>{r.S.wx=1600;r.S.wy=900;methods.drawMirrors(1000,0,160-1600,150-900,250);});

 for(const [type,name] of [['torre','Torre de luz'],['arbol','Árbol madre'],['ciudad','Ciudad de formas'],['monolito','Monolito'],['faro','Faro de horizonte']])card('HITOS GRANDES',name,'src/landmarks.js',simple(()=>r.__atlas_landmarks.shape(c,{type,size:.7,d:500,name:''},0,70,1700,1,'#b6d5c5',.1),.85));
 for(const kind of ['grieta','escalera']){const names={grieta:'Grieta al Subsuelo',escalera:'Escalera al Cielo'};card('CAPAS Y RASTROS',names[kind],'src/layers.js',()=>{
  r.S.layer='superficie';let portal;for(let x=1;x<80&&!portal;x++)for(let y=1;y<15&&!portal;y++){r.S.wx=x*3600+1800;r.S.wy=y*3600+1800;portal=r.__atlas_layers.nearPortals().find(p=>p.kind===kind);}
  if(!portal)throw Error('Missing portal '+kind);r.S.wx=portal.x;r.S.wy=portal.y;methods.drawPortals(0,160-portal.x,175-portal.y,.3);
 });}
 for(const [kind,name] of [['bird','Ave de eco'],['shaker','Semillero de caja'],['cloud','Nube de pulso']])card('FENÓMENOS Y RESPUESTAS',name,'src/phenomena.js',simple(()=>{
  r.S.wx=r.S.wy=0;r.__atlas_phenomena.cache.clear();for(let x=-2;x<=2;x++)for(let y=-2;y<=2;y++)r.__atlas_phenomena.cache.set(x+','+y,[]);
  r.__atlas_phenomena.cache.set('0,0',[{kind,id:'atlas:'+kind,x:0,y:0,hx:0,hy:0,phase:0,period:1500,cues:[],cd:Infinity,next:Infinity}]);methods.drawPhenomena(0,0,0,0,600);
 },3));
 card('FENÓMENOS Y RESPUESTAS','Pulso / onda','src/interactions.js',simple(()=>{r.waves=[{x:0,y:0,r:24,prev:0,max:100}];methods.updWaves(0,0,0);r.waves=[];},2));
 card('FENÓMENOS Y RESPUESTAS','Eco fijado','src/jam.js',()=>{r.S.wx=r.S.wy=0;r.jam.loop.ecos=[{id:'atlas',x:0,y:0,layer:'superficie',events:[],start:0,lit:.3}];methods.drawJam(0,0,160,160,.3);r.jam.loop.ecos=[];});
 card('FENÓMENOS Y RESPUESTAS','Conexión luminosa','src/render.js',native('beams',{x1:1410,y1:1310,x2:1470,y2:1380,l:1}));
 card('FENÓMENOS Y RESPUESTAS','Relámpago','src/render.js',native('bolts',{pts:[[1430,1280],[1408,1310],[1445,1308],[1420,1340],[1440,1360]],l:.8}));
 for(const [layer,name] of [['bajo','Subsuelo · vetas y salidas'],['cielo','Cielo · continentes y nubes']])card('CAPAS Y RASTROS',name,'src/layers.js',()=>{r.S.layer=layer;r.S.wx=r.S.wy=5000;r.S.under={x:1250,y:1250};methods.layerStep(1700,0,0,0,.3,true,0);r.S.layer='superficie';});
 card('FENÓMENOS Y RESPUESTAS','Lluvia de tormenta','src/alive.js',()=>{const w=r.__atlas_alive.weather;w.i=.9;w.flash=0;r.MU.season=null;methods.drawAlive(1700,0,0,0,'sky');w.i=0;});
 for(const particle of ['nieve','hojas','polen','brillo'])card('FENÓMENOS Y RESPUESTAS','Estación: '+particle,'src/alive.js',()=>{r.MU.season={particle};methods.drawAlive(1700,0,0,0,'sky');r.MU.season=null;});
 card('SUELOS Y AIRE','Río / corriente','src/wonders.js',()=>{let found=false;for(let x=-80;x<80&&!found;x++)for(let y=-20;y<20&&!found;y++){const a=(x+.5)*3600,b=(y+.5)*3600;if(r.riverAt(a,b)?.on){r.S.wx=a;r.S.wy=b;found=true;}}if(!found)throw Error('Missing real river');methods.drawRivers(1700,160-r.S.wx,160-r.S.wy);});
 for(const ground of ['musgo','arena','piedra','agua','cristal','ceniza'])card('SUELOS Y AIRE',ground[0].toUpperCase()+ground.slice(1),'src/interactions.js',()=>{
  r.S.wx=r.S.wy=1350;r.wchunks.clear();for(let x=0;x<3;x++)for(let y=0;y<3;y++)r.wchunks.set(x+','+y,{ground,pal:palette});methods.drawGround(-1190,-1190,180,1700);
 });
 for(const air of ['niebla','polvo','esporas','ceniza'])card('SUELOS Y AIRE','Aire: '+air,'src/render.js',()=>r.__atlas_render.drawAir({air,pal:palette},1,1700,0));
 for(const terrain of ['roots','ridges','cells','ripples','flecks'])card('SUELOS Y AIRE','Relieve: '+({roots:'raíces',ridges:'estratos',cells:'celdas',ripples:'ondas',flecks:'marcas'}[terrain]),'src/ecology.js',()=>{
  r.S.wx=r.S.wy=450;const ecology={terrain,terrainScale:44,density:.7,material:'wood'};methods.drawEcology({id:'0,0',pal:palette,ecology,ecologyObjects:[]},1700,-290,-290,180);
 });
 const {CULTURES}=await import('../src/culture-model.js');
 for(const [id,culture] of Object.entries(CULTURES))card('GUARDIANES CULTURALES',culture.name,'src/cultures.js',()=>{r.labCulture=id;methods.cultureReset();const site=methods.cultureHome();r.S.wx=site.x;r.S.wy=site.y;methods.drawCultures();});
 for(const [kind,name] of [['strings','Cuerdas tensables'],['prism','Prisma de luz'],['membrane','Membrana resonante']])card('MATERIA',name,'src/materia.js',()=>{const positions={strings:[1100,2550],prism:[1800,2700],membrane:[2500,2550]},[x,y]=positions[kind];r.S.wx=x;r.S.wy=y;methods.drawMateria(1000,0,160-x,155-y,250);});
 const {createPet}=await import('../src/pet-model.js');
 for(const [kind,name] of [['golondrina','Golondrina de eco'],['grulla','Grulla de tierra'],['luciernaga','Luciérnaga de pulso']])for(const grown of [false,true])card('MASCOTAS',name+(grown?' · crecida':' · recién nacida'),'src/pet.js',()=>{r.S.pet=createPet(kind,123);if(grown){r.S.pet.seconds=6000;r.S.pet.places=Array.from({length:20},(_,i)=>i+',0');}methods.petState.ready=true;methods.petState.x=r.S.wx;methods.petState.y=r.S.wy;methods.petState.sleep=0;methods.drawPet(1000);});
 // Same native draw code, fixed snapshots. No assets are redesigned by this review tool.
 const groups=[...new Set(items.map(x=>x.group))];items.sort((a,b)=>groups.indexOf(a.group)-groups.indexOf(b.group));
 const cols=8,cellW=256,cellH=220,margin=32,sectionH=44,header=140;let y=header,previous=null,column=0;
 for(const item of items){if(item.group!==previous){if(column)y+=cellH;y+=sectionH;column=0;previous=item.group;}item.px=margin+column*cellW;item.py=y;if(++column===cols){column=0;y+=cellH;}}
 const height=y+(column?cellH:0)+80,width=cols*cellW+margin*2,board=document.createElement('canvas');board.id='visualAtlas';board.width=width;board.height=height;board.style.cssText=`position:relative;display:block;width:${width}px;height:${height}px;max-width:none;`;const b=board.getContext('2d');b.fillStyle='#050505';b.fillRect(0,0,width,height);
 b.font='bold 34px monospace';b.fillStyle='#fff';b.fillText('WHITEDOT · ATLAS VISUAL ACTUAL',margin,55);b.font='17px monospace';b.fillStyle='#9a9a9a';b.fillText('Figuras nativas numeradas · muestras procedurales · ampliadas para revisión',margin,90);b.fillText('Original + Paisajes vivos · no incluye UI ni diseños descartados',margin,118);
 previous=null;
 for(let i=0;i<items.length;i++){const item=items[i];if(item.group!==previous){b.fillStyle='#d8bf79';b.font='bold 17px monospace';b.fillText(item.group,margin,item.py-15);previous=item.group;}
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.fillStyle='#000';c.fillRect(0,0,320,320);r.S.mode='world';r.S.layer='superficie';r.S.sound=false;r.S.wx=r.S.wy=0;r.waves=[];r.MU.speed=0;
  item.draw();b.drawImage(work,0,0,320,290,item.px+8,item.py+6,cellW-16,cellH-43);
  b.fillStyle='#fff';b.font='13px monospace';b.fillText(`${String(i+1).padStart(2,'0')}  ${item.name}`,item.px+12,item.py+cellH-22,cellW-20);
  b.strokeStyle='#222';b.strokeRect(item.px+4,item.py+2,cellW-8,cellH-5);
 }
 b.font='14px monospace';b.fillStyle='#8f8f8f';b.fillText(`${items.length} vistas · los cuerpos y animaciones procedurales admiten muchas variantes; aquí se muestran familias y estados de referencia.`,margin,height-30,width-margin*2);
 document.body.replaceChildren(board);return {width,height,items:items.map((x,i)=>({number:i+1,group:x.group,name:x.name,source:x.source})),note:'Drawn from the actual renderer, enlarged for inspection. Representative procedural shapes, not an enumeration of all seeds or animation frames.'};
}
