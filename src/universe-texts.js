export function initialize(r){
 const control=r.$('universeTexts'),cx=r.cx,write=cx.fillText.bind(cx);let owner=null,last=null;
 // Only the world canvas is filtered; menus/previews, controls and save warnings remain usable.
 cx.fillText=function(...args){if(r.inWorld()&&r.S.universeTexts===false)return;return write(...args);};
 function sync(){if(owner!==r.S||last!==r.S.universeTexts){owner=r.S;last=r.S.universeTexts;control.checked=last!==false;document.body.classList.toggle('universe-texts-off',last===false);}}
 control.onchange=()=>{const previous=r.S.universeTexts;r.S.universeTexts=control.checked;if(r.save()===false)r.S.universeTexts=previous;owner=null;sync();};
 Object.defineProperty(r,'universeTextsTick',{get:()=>sync});sync();
}
