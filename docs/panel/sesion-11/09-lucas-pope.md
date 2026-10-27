# 09 · Lucas Pope — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): `index.html`, `src/ui.js`, `src/places.js`, `src/song.js`, `src/song-stage.js`, `src/achievements.js`, `src/house-model.js`, `src/refugio-lugares.js`, `src/journey-mode.js`, `styles/estilo-j.css`; capturas `21-lugares`, `22-cancion`, `20-anillo`, `30-menu`, `33-resultado`; menús `tel-libre-menu-mas`, `esc-libre-menu-mas`, `tel-libre-refugio`, `tel-libre-bitacora`. Sin navegador. Sin manos ni oídos en un teléfono.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7 | Negro, recto y sobrio. El anillo (`20-anillo`) tiene una línea de texto y un botón. El Refugio (`tel-libre-refugio`) se pisa: «PRISMA» sobre el cubo, un aviso sobre «CIELO». |
| Audio | — | Me abstengo. Solo leí el código de `song.js`; no oí nada. |
| Creatividad | 7,5 | Una idea fuerte y propia: cada lugar es una capa de una misma canción (`song.js:11-15`). Es la recompensa y el mapa a la vez. |
| Sensación | — | Me abstengo. Nadie ha tocado esto con las manos. El código de la tarjeta y del tic de la ronda es correcto (`places.js:84`), pero eso no es sensación. |
| Cohesión | 6,5 | El verbo es uno. Alrededor siguen viviendo muchos sistemas: ✦, piezas, Reliquias, unos 230 logros, Remezcla, favoritos, semillas, saltos, Refugio con objetos y cápsulas. |
| Pulido | 6,5 | Reglas exactas y sin redondeo a favor (`places.js:26`). Pero el mismo número sale dos o tres veces por pantalla, hay dorado en lo que no es ★ y una etiqueta mezcla estado y acción. |

## Lo que funciona hoy
- **Un verbo.** Tocar a tiempo decide todo lo que importa: ★, capa de Tu canción y ✦. Nada se compra para avanzar (`places.js:8-10`).
- **La regla de las ★ cabe en una línea.** «★ terminar · ★★ 75 % a tiempo · ★★★ Maestro al 70 %». El código dice exactamente eso (`places.js:24`, `:32`).
- **La tarjeta hace la cuenta delante de ti.** «Ritmo · 74,6 % / 75 % a tiempo», «A 0,4 de ★★», «+102 ✦» (`33-resultado`). Redondea hacia abajo (`places.js:26`, `:89`). Es un libro de cuentas honrado.
- **El tic en vivo.** La ronda dice si vas por encima del umbral, sin palabras, con el mismo cálculo que la tarjeta (`places.js:84`).
- **El HUD cumple D3.** Tres cifras: ★ 5/33, ✦, 5/11 lugares (`ui.js:22-24`; `esc-libre-menu-mas`). En el anillo no hay ninguna (`20-anillo`).
- **El menú se ordenó.** Una acción principal, cuatro destinos, dos utilidades y «Más» cerrado (`30-menu`, `hor-libre-menu`). El laboratorio no se ve (`estilo-j.css:105`).
- **Tu canción se cuenta de un vistazo.** Once círculos, cinco con color: «5 de 11» (`22-cancion`).

## Lo que falta o salió mal
1. **Alta · El mismo número, dos o tres veces por pantalla.** En `tel-libre-refugio` cuento siete lecturas numéricas: ★ 5/33 (HUD), ✦ 0, 5/11 lugares (HUD), «LUGARES · ★ 5 / 33» (estante, `refugio-lugares.js:35`), «8 lugares o 15 ★», «11 lugares o 24 ★» (`house-model.js:10`) y otra vez «5/11 lugares» en el botón del panel (`refugio-lugares.js:81`). D3 limpió el HUD; las hojas lo repiten.
2. **Alta · Dos monedas para abrir cada sala.** «6 lugares o 9 ★», «8 o 15», «11 o 24» (`house-model.js:6`). Son seis números para tres puertas. No cabe en una línea. D3 lo decidió así y no lo reabro; pero el jugador no sabe cuál de las dos condiciones tiene más cerca.
3. **Media · Dorado en lo que no es ★.** D4 dice «dorado solo para ★». «5 / 11» de la hoja Lugares es `#f0d27a` (`estilo-j.css:599`; `21-lugares`). El botón «5/11 lugares» del Refugio también (`estilo-j.css:597`). Ese botón se llama `houseStars` y su texto de partida es «★ 0 / 33» (`index.html:397`): el nombre dice una cosa y la pantalla otra.
4. **Media · La capa que crece no se ve.** Entre ★ y ★★ la capa gana un tiempo cada 1,25 puntos desde el 55 % (`song.js:42-45`). Medido: 60 % → tier 1,25; 70 % → 1,75. El anillo usa `Math.floor(tier)` y pinta 1,25 y 1,75 igual (`song-stage.js:33`). Una regla que el jugador no puede contar es una regla oculta.
5. **Media · «Lugares» cuenta dos cosas.** 5/11 son completos; la Bitácora dice «6 lugares abiertos (○)» (`map.js:78`; `tel-libre-bitacora`). Mismo sustantivo, otra cuenta.
6. **Media · La misma orden, tres veces en una hoja.** `21-lugares`: «Siguiente: Jardín.», la fila de Jardín con «Seguir» y el botón «Seguir hacia Jardín». Más el menú. Una basta por pantalla.
7. **Media · Siguen muchos sistemas.** Unos 109 logros en `data.js:75` y 126 reglas más de aventura y casa (medido con Node). Piezas «9 de 50» (`tel-libre-tu-cubo`), Reliquias, Remezcla, favoritos, saltos, semillas, otras tierras, Refugio con objetos y cápsulas. El menú «Más» abre tres grupos y nueve filas (`esc-libre-menu-mas`). Casi nada de eso cambia lo que hace el dedo.
8. **Baja · Etiqueta que mezcla estado y acción.** «Vista completa · Ocultar contadores» (`journey-mode.js:20`). El título dice dónde estás; el subtítulo, lo que hará. Se lee como contradicción.
9. **Baja · Solapes en el Refugio.** «PRISMA» pisa el cubo y el aviso «Tu Refugio viaja» tapa «CIELO» (`tel-libre-refugio`).
10. **Baja · Vocabulario.** El mapa llama «tu Estudio» al Refugio (`map.js:78`). «Estrellas fijas» y «Estrellas de pulso» son criaturas (`data.js:74`, `vida-music.js:14`). La remezcla se anuncia como «1 · 2y · 3 · 4» (`21-lugares`): notación de músico. «Maestro · otra ronda» no dice qué pide (`places.js:165`).

## Contraste con la sesión 10
Notas de la sesión 10: 7 · 7 · 7,5 · 6 · 4,5 · 6. Hoy: 7 · — · 7,5 · — · 6,5 · 6,5. Cohesión sube dos puntos; me abstengo en Audio y Sensación porque no hay manos ni oídos.

**Cerrado (comprobado).**
- Un solo ★: las reliquias se llaman «Reliquias» (`journal.js:112`); `#starsN` ya no se escribe (`ui.js:20-21`).
- Contador en vivo: tic al umbral (`places.js:84`).
- HUD con tres cifras (`ui.js:22-24`; `esc-libre-menu-mas`).
- Refugio sin días, con migración (`house-model.js:3-9`).
- Un logro por aviso y ninguno en la tarjeta (`achievements.js:17`; `33-resultado`).
- Menú en apaisado: «Más» ya no tapa «Jugar» (`hor-libre-menu`).

**Abierto.**
- Pedí bajar los logros activos de 127 a menos de 40. Siguen todos; P8 decidió no retirar ninguno.
- Los sistemas laterales siguen: piezas, Remezcla, favoritos, semillas, otras tierras.
- Solapes del Refugio: menos, pero quedan (punto 9).

**Empeoró o es nuevo.**
- Las cifras salieron del HUD y reaparecen en las hojas: Refugio con siete (punto 1).
- La regla de salas cambió días por dos monedas: más justa, menos legible (punto 2).
- La capa que crece (D1) es una regla nueva que no se ve (punto 4).
- Dorado en «lugares», contra D4 (punto 3).

## Qué haría ahora
1. **Una cifra por pantalla y por concepto.** Si el HUD ya muestra ★ y lugares, las hojas no los repiten. Quitar el «5/11 lugares» del panel del Refugio y la cifra del estante; dejar los trofeos.
   - Dónde: `src/refugio-lugares.js:35`, `:81`; `src/refugio-lugares.js:56` (`lugaresCount`).
   - Bien cuando: en cada captura `tel-libre-*`, ninguna cifra aparece dos veces.
2. **Cada sala dice solo lo que te falta.** Sin cambiar D3: mostrar la condición más cercana, una sola. «Cielo · faltan 3 lugares».
   - Dónde: `src/house-model.js:10` (`roomAsks`, con el progreso).
   - Bien cuando: cada rótulo de sala tiene un solo número; una prueba comprueba que elige la condición con menos distancia.
3. **Dorado solo en ★.** «5 / 11» y el botón del Refugio en blanco.
   - Dónde: `styles/estilo-j.css:597`, `:599`.
   - Bien cuando: ningún texto con «lugares» usa `#f0d27a` o `var(--gold)`; prueba con `grep` sobre los selectores.
4. **Que la capa que crece se vea.** Un arco del anillo de Tu canción que se llena con `growthSteps/16`, sin cifra.
   - Dónde: `src/song-stage.js:38-40` (`drawSongRings`).
   - Bien cuando: dos guardados con 60 % y 70 % dan anillos distintos en captura; con ★★ el arco está cerrado.
5. **Una palabra por cuenta.** «Lugares» solo para completos de once; la Bitácora dice «portales abiertos» o nada. Una sola orden «Seguir» por hoja.
   - Dónde: `src/map.js:78`; `src/refugio-lugares.js` (fila «Seguir» o línea «Siguiente»).
   - Bien cuando: `21-lugares` nombra Jardín como destino una sola vez además del botón principal.
