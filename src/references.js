const MINOR=[[0,2,3,5,7,8,10],[0,2,3,5,7,9,10]],WARM=[[0,2,4,5,7,9,10],[0,2,3,5,7,9,10]];
export const REFERENCE_GENRES={
 techhouse:{name:'Tech house',bpm:[124,128],sw:.12,pt:0,bassI:'roll',bassP:['roll','pluck'],hookP:['clav','keys'],percP:['kick','rim','shaker','clap'],scales:MINOR},
 andean:{name:'Electrónica andina',bpm:[96,112],sw:.12,pt:1,bassI:'sub',bassP:['sub','rubber'],hookP:['flute','kalimba'],percP:['wood','conga','shaker'],scales:MINOR,melodyDegrees:[0,2,3,4,6],pad:.12},
 cosmic:{name:'Cosmic disco',bpm:[110,116],sw:.1,pt:0,bassI:'rubber',bassP:['rubber','sub'],hookP:['strings','clav','rhodes'],percP:['kick','clap','guiro','shaker'],scales:WARM,pad:.2},
 melodictechno:{name:'Melodic techno',bpm:[124,130],sw:.02,pt:5,bassI:'roll',bassP:['roll','fm'],hookP:['saw','strings'],percP:['kick','rim','hat'],scales:MINOR,pad:.25},
 organic:{name:'Organic house',bpm:[92,112],sw:.16,pt:1,bassI:'sub',bassP:['sub','rubber'],hookP:['kalimba','marimba','flute'],percP:['wood','conga','shaker'],scales:WARM,pad:.15},
 amapiano:{name:'Amapiano',bpm:[108,114],sw:.2,pt:0,bassI:'logdrum',bassP:['logdrum','sub'],hookP:['rhodes','keys'],percP:['kick','shaker','conga','rim'],scales:WARM,pad:.08},
 jazztronica:{name:'Jazztronica',bpm:[94,118],sw:.22,pt:0,bassI:'rubber',bassP:['rubber','sub'],hookP:['rhodes','clav'],percP:['rim','shaker','wood'],scales:WARM,melodyDegrees:[0,2,4,6],pad:.12},
 berlin:{name:'Berlin School',bpm:[90,116],sw:.02,pt:5,bassI:'fm',bassP:['fm','sub'],hookP:['organ','strings'],percP:['wood','shaker','rim'],scales:MINOR,pad:.25},
 idm:{name:'IDM',bpm:[100,150],sw:.06,pt:3,bassI:'machine',bassP:['machine','fm'],hookP:['metalkeys','kalimba'],percP:['rim','wood','timbale','hat'],scales:MINOR,pad:.06},
 liquid:{name:'Liquid drum & bass',bpm:[168,172],sw:.02,pt:0,bassI:'sub',bassP:['sub','reese'],hookP:['rhodes','strings'],percP:['kick','rim','shaker','hat'],scales:WARM,pad:.2},
 ebm:{name:'Darkwave / EBM',bpm:[118,138],sw:.02,pt:5,bassI:'machine',bassP:['machine','acid'],hookP:['vocalform','organ'],percP:['kick','rim','hat'],scales:MINOR,pad:.1},
 algorave:{name:'Algorave',bpm:[118,150],sw:.04,pt:3,bassI:'fm',bassP:['fm','machine'],hookP:['metalkeys','clav'],percP:['wood','rim','shaker','timbale'],scales:MINOR,pad:0}
};
export const REFERENCE_STEPS={techhouse:[0,3,7,10],andean:[0,3,6,10,14],cosmic:[0,4,7,10,14],melodictechno:[0,2,6,10,14],organic:[0,3,7,10],amapiano:[0,6,8,11,14],jazztronica:[0,3,6,10,14],berlin:[0,2,6,8,10,14],idm:[0,3,7,11,14],liquid:[0,4,6,10,12],ebm:[0,2,6,10],algorave:[0,3,6,9,13]};
export const REFERENCE_BASS={techhouse:[0,3,6,10,14],andean:[0,6,10],cosmic:[0,3,6,8,14],melodictechno:[0,2,6,8,10,14],organic:[0,6,10,14],amapiano:[0,3,6,8,11,14],jazztronica:[0,3,6,10],berlin:[0,2,4,6,8,10,12,14],idm:[0,3,8,11,14],liquid:[0,2,6,8,10,14],ebm:[0,2,4,6,8,10,12,14],algorave:[0,3,6,9,13]};
const FOUR=[0,4,8,12],OFF=[2,6,10,14],EIGHT=[0,2,4,6,8,10,12,14];
export function referenceRhythm(id,variation=0){
 const rhythms={
  techhouse:{kick:FOUR,clap:[4,12],hat:OFF,rim:[3,11]},
  andean:{kick:[0,8],wood:[0,3,6,10,12],conga:[6,14],shaker:[2,6,10,14]},
  // Cosmic disco: spacey and straight. No clap; timbales fall like echoes and strings close the bar.
  cosmic:{kick:FOUR,hat:OFF,timbale:[6,14],guiro:[7],chord:[14]},
  melodictechno:{kick:FOUR,clap:[4,12],hat:OFF,rim:[11]},
  organic:{kick:[0,10],wood:[3,7,11],conga:[6,14],shaker:[1,5,9,13]},
  amapiano:{kick:[0,7,10],rim:[4,12],hat:[2,6,10,14],shaker:[1,3,5,7,9,11,13,15]},
  jazztronica:{kick:[0,10],rim:[4,12],hat:[2,7,10,15],wood:[6],chord:[0]},
  berlin:{kick:[0],hat:[6,14],wood:[3,11]},
  idm:{kick:[0,6,9,14],snare:[5,12],hat:[2,7,11],timbale:[3,15]},
  // Liquid: the smooth two-step. Kick on one and the and of three, hats only off the beat, chords twice a bar.
  liquid:{kick:[0,10],snare:[4,12],hat:OFF,shaker:[3,7,11,15],chord:[0,8]},
  ebm:{kick:FOUR,snare:[4,12],hat:OFF,rim:[7,15]},
  algorave:{kick:[0,8],hat:[2,6,10,14],wood:Array.from({length:16},(_,i)=>i).filter(i=>((i+variation)*5)%16<5),timbale:[11]}
 };
 return rhythms[id]||null;
}
