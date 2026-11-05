import {normalizeSurprise} from './box-surprises-model.js';
// T3 «la carga» (Kubono coherente, decision 4 of Jay, approved): a box gives one power and no surprise. The surprises
// are retired: nothing is drawn, heard or given, and the HUD (#surpriseHud, its id kept) stays hidden. A save keeps
// S.boxSurprises as it was (normalized; a future format untouched), so a surprise saved while active simply ends and
// nothing is lost. The runtime keeps its names so the frame, the save and the scheduler call nothing missing.
const CUBE=Object.freeze({speed:1,scale:1,shape:'cube'});
export function initialize(runtime){
 let owner=null;
 function ensure(){if(owner===runtime.S)return;owner=runtime.S;owner.boxSurprises=normalizeSurprise(owner.boxSurprises);}
 function hide(){const panel=runtime.$?.('surpriseHud');if(panel){panel.hidden=true;if(panel.dataset)panel.dataset.return='false';}}
 const snapshot=()=>{ensure();return runtime.S.boxSurprises;};
 const none=()=>{ensure();hide();return false;};
 const undo=runtime.$?.('surpriseUndo');if(undo)undo.onclick=()=>hide();
 Object.defineProperties(runtime,{giveBoxSurprise:{get:()=>()=>null},giveSurprise:{get:()=>none},clearSurprise:{get:()=>none},snapshotBoxSurprises:{get:()=>snapshot},
  surpriseTick:{get:()=>()=>{ensure();hide();}},surpriseStep:{get:()=>()=>{}},drawSurprises:{get:()=>()=>{}},drawSurpriseBody:{get:()=>()=>false},
  surpriseStyle:{get:()=>CUBE},surpriseState:{get:()=>({ids:[],path:0,marks:0,returnPoint:null,retired:true})}});
 ensure();hide();
}
