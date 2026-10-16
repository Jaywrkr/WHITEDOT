// Experimental color remains part of the electronic score in production.
export const PRODUCTION_EXPERIMENT_NAMES={libre:'Textura libre',irregular:'Acentos cruzados',glitch:'Cortes rítmicos',micro:'Batimientos suaves'};
export function productionExperimentEvents(mode,step,bar,level){
 if(level<.3)return [];
 if(mode==='libre'&&step===10&&bar%4===2)return [{kind:'voice',chord:1,offset:0,level:.012}];
 if(mode==='irregular'&&bar%2===0&&[3,6,10,14].includes(step))return [{kind:step===6?'tom':'wood',offset:0,level:.018}];
 if(mode==='glitch'&&step===14&&bar%4===3)return [0,.5].map(offset=>({kind:'noise',offset,level:.009}));
 if(mode==='micro'&&step===0&&bar%8===4)return [0,1,2].map(chord=>({kind:'voice',chord,offset:0,level:.005}));
 return [];
}
