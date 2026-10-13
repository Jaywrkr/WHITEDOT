// A held contact is not a second player gesture. Leaving rearms the object.
export function contactEntry(object,inside,enabled=true){
 if(!enabled)return false;
 const entered=!!inside&&!object.touching;object.touching=!!inside;return entered;
}
