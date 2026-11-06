#!/usr/bin/env node
// Writes the static Kubono site in site/: landing, privacy and press kit, in Spanish and English.
// The privacy pages come from the public part of docs/PRIVACIDAD.md, never from Jay's notes.
// The site is not part of the game: it stays out of sw.js, the itch.io zip, Android and desktop builds.
//   node scripts/site-build.mjs          write site/*.html
//   node scripts/site-build.mjs --check  exit 1 when a page is out of date
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const ROOT=new URL('..',import.meta.url).pathname,SITE=join(ROOT,'site');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// Placeholders stay visible until Jay fills them in.
const todo=s=>s.replace(/\[(NOMBRE LEGAL|CORREO|FECHA|ENLACE DEL TRÁILER|TRAILER LINK)\]/g,'<mark class="todo">[$1]</mark>');
const inline=s=>todo(esc(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>'));

const T={
 es:{lang:'es',other:'en',home:'index.html',privacy:'privacidad.html',press:'prensa.html',
  title:'Kubono · Un cubo. Un universo que suena.',
  description:'Un cubo en un universo que suena. Explora, encuentra once lugares y crea música.',
  tagline:'Un cubo. Un universo que suena.',
  lead:'Eres un cubo en un universo abierto. La música responde a lo que haces.',
  stores:['Pronto en itch.io','Pronto en Google Play'],
  points:[['Mundo abierto','Desde el primer segundo. Camina hacia donde quieras.'],
   ['Escáner','Mantén pulsado. Una onda muestra lo que hay cerca.'],
   ['Once lugares','El primero está a 0,5 km. El último, a 40 km.'],
   ['Música que reacciona','Cada región tiene su género. Lo que haces cambia el arreglo.']],
  galleryTitle:'Capturas',
  gallery:[['escaner','El escáner: criaturas, cajas y secretos cerca.'],['portal','Al llegar, el portal del lugar aparece delante.'],
   ['ronda','Una ronda a tiempo. Hasta tres <span class="earned">★</span>.'],['cubo','Tu cubo: más de ochenta piezas, por chispas que ganas explorando.'],
   ['refugio','Tu Refugio viaja contigo.']],
  heroAlt:'El cubo en el mundo abierto de Kubono, al empezar.',
  alts:{escaner:'Las marcas del escáner alrededor del cubo.',portal:'El portal de Llanura con sus estrellas.',ronda:'Una ronda del Lago en juego.',cubo:'La hoja Tu cubo, pestaña Piezas.',refugio:'El Refugio con su primera frase escrita.'},
  terms:'Pago único. Sin anuncios ni compras dentro del juego. Sin cuenta y sin conexión. En español e inglés. Mejor con auriculares.',
  nav:{privacy:'Privacidad',press:'Prensa',contact:'Contacto'},
  langName:'Español',otherName:'English',
  pressTitle:'Kubono · Prensa',pressH1:'Prensa',
  facts:[['Nombre','Kubono'],['Desarrollo','[NOMBRE LEGAL]'],['Plataformas','Android (Google Play) y escritorio: Windows, macOS y Linux (itch.io)'],
   ['Precio','Por confirmar. Pago único, sin compras dentro del juego'],['Idiomas','Español e inglés'],['Salida','Por confirmar'],['Contacto','[CORREO]']],
  pressAbout:'Descripción',
  pressShort:'Un cubo explora un universo abierto donde cada región suena distinta. Encuentra once lugares, cada uno más lejos, y juega sus rondas a tiempo. La música responde a lo que hace.',
  pressLong:['Sin tutorial largo: el mundo está abierto desde el primer segundo.','Mantén pulsado y el escáner muestra lo que hay cerca.','Más de ochenta piezas para el cubo y un Refugio que viaja con él. Las chispas solo se ganan jugando.'],
  media:'Material',trailer:'Tráiler: [ENLACE DEL TRÁILER]',shotsLink:'Capturas en la página principal',
  files:[['icono-512.png','Icono, 512 × 512, PNG'],['cabecera-1024x500.jpg','Cabecera, 1024 × 500, JPG'],['og-1200x630.jpg','Imagen para compartir, 1200 × 630, JPG']],
  privacyTitle:'Kubono · Privacidad',privacySection:'## Texto para publicar · español'},
 en:{lang:'en',other:'es',home:'en.html',privacy:'privacy.html',press:'press.html',
  title:'Kubono · A cube. A universe that sounds.',
  description:'A cube in a universe that sounds. Explore, find eleven places, make music.',
  tagline:'A cube. A universe that sounds.',
  lead:'You are a cube in an open universe. The music answers what you do.',
  stores:['Soon on itch.io','Soon on Google Play'],
  points:[['Open world','From the first second. Walk wherever you like.'],
   ['Scanner','Hold, and a wave shows what is near.'],
   ['Eleven places','The first is 0.5 km away. The last, 40 km.'],
   ['Music that reacts','Every region has its own genre. What you do changes the arrangement.']],
  galleryTitle:'Screenshots',
  gallery:[['escaner','The scanner: creatures, boxes and secrets nearby.'],['portal','When you arrive, the place\'s portal appears ahead.'],
   ['ronda','A round in time. Up to three <span class="earned">★</span>.'],['cubo','Your cube: over eighty pieces, for sparks you earn by exploring.'],
   ['refugio','Your Refuge travels with you.']],
  heroAlt:'The cube in Kubono\'s open world, at the start.',
  alts:{escaner:'Scanner marks around the cube.',portal:'The Plain\'s portal with its stars.',ronda:'A Lake round being played.',cubo:'The Your cube sheet, Pieces tab.',refugio:'The Refuge with its first phrase written.'},
  terms:'One-time purchase. No ads and no in-app purchases. No account and no connection. In English and Spanish. Best with headphones.',
  nav:{privacy:'Privacy',press:'Press',contact:'Contact'},
  langName:'English',otherName:'Español',
  pressTitle:'Kubono · Press',pressH1:'Press',
  facts:[['Name','Kubono'],['Developer','[NOMBRE LEGAL]'],['Platforms','Android (Google Play) and desktop: Windows, macOS and Linux (itch.io)'],
   ['Price','To be confirmed. One-time purchase, no in-app purchases'],['Languages','English and Spanish'],['Release','To be confirmed'],['Contact','[CORREO]']],
  pressAbout:'Description',
  pressShort:'A cube explores an open universe where every region sounds different. It finds eleven places, each farther away, and plays their rounds in time. The music answers what it does.',
  pressLong:['No long tutorial: the world is open from the first second.','Hold, and the scanner shows what is near.','Over eighty pieces for the cube and a Refuge that travels with it. Sparks are only earned by playing.'],
  media:'Media',trailer:'Trailer: [TRAILER LINK]',shotsLink:'Screenshots on the main page',
  files:[['icono-512.png','Icon, 512 × 512, PNG'],['cabecera-1024x500.jpg','Header, 1024 × 500, JPG'],['og-1200x630.jpg','Share image, 1200 × 630, JPG']],
  privacyTitle:'Kubono · Privacy',privacySection:'## Text to publish · English'}
};
const page=(t,{title,file,body})=>{const o=T[t.other],twin=file===t.home?o.home:file===t.privacy?o.privacy:o.press;
 return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta name="referrer" content="no-referrer">
<meta property="og:title" content="Kubono">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:image" content="img/og-1200x630.jpg">
<link rel="icon" href="img/favicon-64.png">
<link rel="apple-touch-icon" href="img/icono-180.png">
<link rel="alternate" hreflang="${o.lang}" href="${twin}">
<link rel="stylesheet" href="site.css">
</head>
<body>
<div class="wrap">
<header class="top"><a class="brand" href="${t.home}"><img src="img/favicon-64.png" alt="" width="28" height="28">Kubono</a>
<nav class="lang" aria-label="Idioma · Language"><span aria-current="true">${t.lang.toUpperCase()}</span><a href="${twin}" hreflang="${o.lang}" lang="${o.lang}">${o.lang.toUpperCase()}</a></nav></header>
<main>
${body}
</main>
<footer><nav><a href="${t.privacy}">${t.nav.privacy}</a><a href="${t.press}">${t.nav.press}</a><span>${t.nav.contact}: ${todo('[CORREO]')}</span></nav>
<p>© ${todo('[NOMBRE LEGAL]')} · Kubono</p></footer>
</div>
</body>
</html>
`;};

function landing(t){
 const stores=t.stores.map(s=>`<span class="store" aria-disabled="true">${s}</span>`).join('');
 const points=t.points.map(([h,p])=>`<div><h3>${h}</h3><p>${p}</p></div>`).join('\n');
 const gallery=t.gallery.map(([k,c])=>`<li><figure><img src="img/${t.lang}-${k}.webp" alt="${esc(t.alts[k])}" width="1280" height="720" loading="lazy"><figcaption>${c}</figcaption></figure></li>`).join('\n');
 return page(t,{title:t.title,file:t.home,body:`<section class="hero">
<h1>Kubono</h1>
<p class="lead">${t.tagline}</p>
<p class="dim">${t.lead}</p>
<div class="stores">${stores}</div>
<img class="shot" src="img/${t.lang}-inicio.webp" alt="${esc(t.heroAlt)}" width="1280" height="720">
</section>
<section class="points">
${points}
</section>
<section id="capturas">
<h2>${t.galleryTitle}</h2>
<ul class="gallery">
${gallery}
</ul>
</section>
<p class="note dim small">${t.terms}</p>`});
}

function privacy(t){
 const md=readFileSync(join(ROOT,'docs/PRIVACIDAD.md'),'utf8');
 const start=md.indexOf(t.privacySection);if(start<0)throw Error('Missing section in docs/PRIVACIDAD.md: '+t.privacySection);
 const rest=md.slice(start+t.privacySection.length),end=rest.search(/\n## /);
 const lines=(end<0?rest:rest.slice(0,end)).split('\n').map(l=>l.trim()).filter(Boolean);
 const out=[];let list=false;
 for(const line of lines){
  const item=line.match(/^- (.*)$/);
  if(item){if(!list){out.push('<ul>');list=true;}out.push(`<li>${inline(item[1])}</li>`);continue;}
  if(list){out.push('</ul>');list=false;}
  const heading=line.match(/^\*\*([^*]+)\*\*$/);
  out.push(heading?`<h1>${esc(heading[1])}</h1>`:`<p>${inline(line)}</p>`);
 }
 if(list)out.push('</ul>');
 return page(t,{title:t.privacyTitle,file:t.privacy,body:`<article class="doc hero">\n${out.join('\n')}\n</article>`});
}

function press(t){
 const facts=t.facts.map(([k,v])=>`<dt>${k}</dt><dd>${todo(esc(v))}</dd>`).join('\n');
 const files=t.files.map(([f,d])=>`<li><img src="img/${f}" alt="" width="64" height="64"><a href="img/${f}" download>${d}</a></li>`).join('\n');
 return page(t,{title:t.pressTitle,file:t.press,body:`<article class="doc hero">
<h1>${t.pressH1}</h1>
<dl class="facts">
${facts}
</dl>
<h2>${t.pressAbout}</h2>
<p>${t.pressShort}</p>
${t.pressLong.map(p=>`<p class="dim">${p}</p>`).join('\n')}
<h2>${t.media}</h2>
<ul class="files">
${files}
</ul>
<p><a href="${t.home}#capturas">${t.shotsLink}</a></p>
<p>${todo(esc(t.trailer))}</p>
</article>`});
}

const pages={};
for(const t of Object.values(T)){pages[t.home]=landing(t);pages[t.privacy]=privacy(t);pages[t.press]=press(t);}
const check=process.argv.includes('--check');let stale=0;
for(const [name,html] of Object.entries(pages)){
 const path=join(SITE,name);
 if(check){if(!existsSync(path)||readFileSync(path,'utf8')!==html){console.log('Out of date: site/'+name);stale++;}}
 else writeFileSync(path,html);
}
console.log(check?(stale?`${stale} page(s) out of date: run node scripts/site-build.mjs`:'Site pages are up to date.'):`Wrote ${Object.keys(pages).length} pages in site/.`);
process.exit(stale?1:0);
