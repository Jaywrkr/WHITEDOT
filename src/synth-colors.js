import {GENRE_CHARACTERS} from './musical-character.js';
import {activeWorldFamily} from './world-families.js';
// Original synth programs, not recordings or presets imported from commercial instruments.
// Slopes are real cascades: each biquad low-pass contributes 12 dB/octave.
export const SYNTH_PROGRAMS=Object.freeze([
 ['madera','Madera abierta','lowpass',1,'open',.65,.6],
 ['resina','Resina cálida','lowpass',2,'close',.55,.8],
 ['terciopelo','Terciopelo','lowpass',3,'close',.45,.5],
 ['sombra','Sombra profunda','lowpass',4,'close',.4,.45],
 ['amanecer','Amanecer','lowpass',1,'open',.9,.7],
 ['respira','Respira','lowpass',2,'breathe',.7,.65],
 ['pliegue','Pliegue analógico','lowpass',3,'open',.65,.9],
 ['marea','Marea','lowpass',4,'breathe',.6,.6],
 ['vocal','Vocal móvil','bandpass',1,'open',.8,.75],
 ['junco','Junco hueco','bandpass',1,'close',.65,.5],
 ['cavidad','Cavidad','notch',1,'breathe',.75,.65],
 ['orbita','Órbita','notch',1,'open',.9,.8],
 ['modulo','Módulo seco','lowpass',2,'close',.9,1.25],
 ['cristal','Cristal FM','lowpass',1,'open',1,1.35],
 ['nube','Nube suave','lowpass',2,'breathe',.55,.45],
 ['fibra','Fibra pulsada','lowpass',1,'close',.7,.85],
].map(([id,name,type,stages,motion,harmonics,fmIndex])=>Object.freeze({id,name,type,stages,motion,harmonics,fmIndex,slope:type==='lowpass'?stages*12:null})));
export function synthProgram(region,role,identity,seedOf){
 const h=seedOf(`synth:program:v1:${region.key}:${region.genre}:${role}:${identity}`);
 const choices={floor:[0,1,3,4,7,12,15],bass:[1,2,5,7,12,15],warm:[0,1,4,5,8,14,15],organic:[0,1,4,5,8,9,14,15],
  melodic:[0,5,6,11,13,14],disco:[0,4,8,11,13,15],calm:[0,1,2,5,7,14],machine:[6,7,10,11,12,13],broken:[5,8,9,10,12,13]};
 const palette=(choices[GENRE_CHARACTERS[region.genre]]||choices.warm).map(i=>SYNTH_PROGRAMS[i]);
 const nativePool=role==='bajo'?SYNTH_PROGRAMS.filter(p=>p.type==='lowpass'&&p.stages<=2):
  role==='perc'?SYNTH_PROGRAMS.filter(p=>p.type==='lowpass'&&p.stages===1):palette;
 const f=activeWorldFamily(region),preferences={wood:['madera','resina','fibra','junco'],glass:['respira','marea','cristal'],metal:['sombra','pliegue','modulo','cavidad'],air:['nube','terciopelo','amanecer','orbita']};
 const compatible=f?nativePool.filter(p=>preferences[f.material].includes(p.id)):[],pool=compatible.length?compatible:nativePool;
 return pool[h%pool.length];
}
export function filterMovement(program,cutoff,role,time,six=.125,gesture=0,weather=0){
 const bass=role==='bajo',low=bass?150:role==='perc'?500:380,high=bass?1200:6500;
 const centre=Math.max(low,Math.min(high,cutoff*(1+Math.max(0,Math.min(1,gesture))*.4)));
 const shift=1-Math.max(0,Math.min(1,weather))*.18;
 const a=program.motion==='open'?.3:1,b=program.motion==='open'?1:program.motion==='breathe'?.5:.22;
 return {start:Math.max(low,centre*a*shift),end:Math.max(low,centre*b*shift),
  duration:Math.max(.08,Math.min(.8,six*(bass?2:3))),type:bass?'lowpass':program.type,stages:program.stages,slope:program.slope,time};
}
