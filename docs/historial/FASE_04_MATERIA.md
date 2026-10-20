> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Fase 4 · Materia + Fase 8 · Compartir (rama `feat/phase-04-materia-y-compartir`)

Entrega de Claude **integrada por #75**. El control de dedo descrito originalmente fue sustituido por el cubo en #77; revisión vigente en [FASE_06.md](FASE_06.md).

## Materia (fase 4, familias nuevas)
Tres instalaciones con gestos directos, sin paneles. Todo cuantizado a tempo y en la escala del lugar.
- **Cuerdas tensables**: arrastra una cuerda para tensarla y suéltala (más tensión = nota más alta); cruza las cuatro para rasguear. Las dos graves son bajo, las dos agudas melodía.
- **Prisma de luz**: gíralo arrastrando alrededor. El abanico de colores enciende de 1 a 5 cristales; al soltar suena su acorde y el ángulo queda guardado.
- **Membrana resonante**: toca (centro grave, borde agudo); mantén el dedo para redoblar a corcheas.
- Presencia con flujo de semilla propio (`materia:presence:v1:*`): **no toca catálogo ni recetas**, ningún lugar existente cambia. Rareza: cuerdas y membrana ~19 %, prisma ~13 % de regiones de tierra. En el origen están las tres (1100,2550 · 1800,2700 · 2500,2550). Encuentro de prueba: `?encounter=materia`.
- Guardado: solo `seen` y el ángulo del prisma (`S.materiaSites`, máx. 96). Cancelar un gesto (menú, modal, blur) restaura el estado.
- Logros: cuerda1, cuerdaTensa (oculto), prisma1, prismaArcoiris (oculto), membrana1, materia3.
- Módulos: `src/materia-music.js` (puro, probado en Node), `src/materia.js` (runtime).

## Mesa FX
Chorus, Phaser y Freeze (la última corchea queda girando en bucle y la música sigue debajo). Logros fx_chorus, fx_phaser, fx_freeze.

## Compartir (fase 8)
- **Código de lugar** `WD1-…` (Favoritos): copia dónde estás; pegar un código lo guarda en Favoritos y, si es del mismo mundo, te orienta hacia él (no teletransporta). Si es de otro mundo, indica la semilla para abrirlo desde Explorar mundos.
- **Grabar set** (menú): hasta 60 s de pantalla con el audio real del juego. Al terminar: ver, descargar o compartir (Web Share). mp4 en Safari, webm en Chrome/Android. Logros codigo1, codigoAbierto, set1.
- Módulo: `src/share-tools.js`.

## Pruebas
- Node: `tests/materia.mjs`, `tests/share_tools.mjs` (53 suites PASS).
- Navegador: `tests/materia_smoke.py` en móvil y escritorio (gestos, no mueve al pixel, cancelar, FX, código, grabación).
- `tests/offline_smoke.py`: la cobertura de módulos en caché pasa; la aserción final ("missing JS must fail") falla también en `main` limpio en este contenedor (la emulación offline no llega al service worker). No es de esta rama.
- La suite completa `npm run test:browser` no se corrió en esta entrega.

## Probar en el teléfono
1. Jugar → Explorar. Bajar desde el origen: cuerdas a la izquierda, prisma al centro, membrana a la derecha.
2. Mesa FX → Chorus / Phaser / Freeze.
3. Menú → Favoritos → Copiar código; pegarlo y Abrir.
4. Menú → Grabar set → tocar el punto rojo para terminar.
