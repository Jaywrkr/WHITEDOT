export const ACH_CATEGORIES=['Camino','Mundo','Música','Vida','Colección','Casa','Secretos'];
// «paseo1» retired with the «Paseo musical» button (Jay, alpha.232, G2): kept for whoever earned it, never asked again.
// «dorada» and «s10» (T0, Kubono coherente, bug 4): the gold light and the cube's size belonged to the light code that
// nothing calls any more, so nobody could earn them; kept for whoever has them, never asked again.
export const RETIRED_ACHIEVEMENTS=new Set(['dj','paseo1','dorada','s10']);
export function legacyAchievementCategory(a){const id=a[0];if(a[3])return 'Secretos';if(/^(r\d|t\d|dia|tope|regreso|s10|cap|fallo)/.test(id))return 'Camino';if(/(mascota|bandada|formacion|vida|lira|flor|jardin|luciernaga)/i.test(id))return 'Vida';if(/(studio|estudio|hogar|casa)/i.test(id))return 'Casa';if(/(tarjeta|elementos|reliquia|colecc|fosil)/i.test(id))return 'Colección';if(/(dj|fx_|set|cuerda|prisma|membrana|vidrio|espejo|perc|tambor|banda|tejido|respuesta|ecology|fijar|cultivar|instrument|compos|under|tiempo|escucha)/i.test(id))return 'Música';return 'Mundo';}
export function baseAchievementMeta(a){return {id:a[0],category:legacyAchievementCategory(a),tier:a[3]?'oro':/^(r30|r100|r365|t100)/.test(a[0])?'plata':'bronce',hidden:!!a[3]};}
