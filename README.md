# WHITEDOT · Pixel Blanco

Un pixel blanco en un mundo negro. Cada día avanzas un camino corto, y cuando lo terminas se abre un **Mundo infinito y procedural donde todo hace música**: electrónica que va del ambient al minimal tech house. Cada región tiene su género, su paisaje y sus criaturas, y todo lo que tocas suena a tempo.

**Jugar:** https://whitedot-inky.vercel.app (funciona en móvil y desktop, con audio. Toca la pantalla una vez para activar el sonido.)

Por Jay · [@jaywrkr](https://instagram.com/jaywrkr)

---

## Cómo se juega

1. **Camino del día:** mueve el pixel (arrastra o usa WASD/flechas) y recoge luces. La barra tiene un tope diario. Volver cada día suma racha.
2. **Mundo:** al terminar el camino entras al Mundo. Tu linterna dura 10 minutos, más 1 minuto por día de racha (máximo 60). El tiempo de linterna se pausa mientras consultas menús y paneles.
3. **Explora:** las regiones son grandes y cambian poco a poco, igual que bajar de la sierra a la costa. Cada una tiene un género (afro house, minimal, rominimal, dub techno, acid, garage, electro, progressive house, microhouse, minimal techno, dubstep y drum & bass…), su escala, su suelo, su aire y su fauna. Aunque te quedes quieto, la música sigue componiendo: cambia frases, instrumentos y secciones con el tiempo y la actividad del ambiente.
4. **Interactúa:**
   - Choca objetos. Encontrarás luces fugitivas, brotes saltarines, cometas flotantes, prismas giratorios y aros resonantes: unos salen volando, otros saltan, giran o resuenan sin moverse. También reaccionan al pulso. Cada objeto tiene rasgos propios: algunos son serenos, otros vivaces o elásticos; varían su movimiento, impulso y recuperación incluso dentro de una misma región.
   - Lanza un **pulso** tocando brevemente la pantalla o con Espacio.
   - **Escuchar:** mantén presionado sin arrastrar durante medio segundo (o mantén E en escritorio). Consulta las fuentes cercanas, su función musical, instrumento, región, género y escala. Suelta para volver a moverte.
   - Deja que las criaturas te sigan y canten.
   - Cumple el reto de cada región.
   - Escucha el reparto musical del lugar: un árbol, cristal o criatura puede aportar bajos, percusión, acordes o melodías según la región. Su función e instrumento se conservan al volver, pero varían incluso dentro del mismo bioma.
   - Cada región muestra su gravedad al entrar: ligera (más rápido), normal o alta (más lento). La velocidad cambia suavemente en sus fronteras: ligera 1,65×, normal 1× y alta 0,55×.
5. **Estudio:** un secuenciador radial portátil. Lo armas con las muestras que recoges y lo despliegas como refugio, que también sirve de checkpoint.
6. **Bitácora:** consulta lugares y su gravedad, formas agrupadas por función musical, música descubierta y logros. Los logros ocultos se muestran como “???”. La Voz del sistema comenta lo que haces sin pedir permiso.
7. **Compartir:** genera una tarjeta para redes con tu racha y tus descubrimientos.

## Tecnología

- HTML en `index.html`, CSS en `styles/game.css` y módulos JavaScript nativos en `src/`.
- Canvas 2D y Web Audio API. Todo el sonido se sintetiza en vivo, sin samples.
- Sin dependencias de aplicación ni build. `package.json` declara módulos ES y el comando de pruebas core; no hace falta `npm install`.
- Guarda el progreso en `localStorage` (clave `pixel-blanco-v4`).

## Correr local

```bash
python3 -m http.server 8000
```

Desde la carpeta del repositorio, ejecuta ese comando y abre `http://localhost:8000`. También puedes usar `npx serve .` y abrir la dirección que indique ese servidor.

## Deploy

El repo está conectado a Vercel (proyecto `whitedot`). Los cambios se preparan en una rama nueva desde `main` actualizado, se verifican y se suben con commit y push. **Jay crea el PR y hace el merge.** El asistente no hace push directo a `main`, no crea PRs y no hace merges.

Al integrar el PR en `main`, Vercel despliega producción automáticamente. No hay paso de build: Vercel sirve `index.html`, `styles/` y `src/` como archivos estáticos.

## Verificar cambios

```bash
npm test
python3 tests/smoke.py
```

Las pruebas core necesitan Node. Para las pruebas de navegador necesitas Python y Playwright: instala `tests/requirements.txt` en un entorno virtual (`python3 -m pip install -r tests/requirements.txt`) y usa Chromium instalado en el sistema, o instala el navegador con `python3 -m playwright install chromium`. Puedes indicar su ejecutable mediante `CHROMIUM_PATH`. El smoke test levanta su propio servidor y verifica móvil y escritorio; no evalúa la calidad audible de la música.

Los módulos requieren servir el juego por HTTP; abrir `index.html` mediante `file://` no es el flujo soportado.

Los avisos del sistema ocupan dos líneas; tócalos para leer el mensaje completo. La tarjeta de entrada es breve y los detalles del lugar quedan en Bitácora y Escuchar.

## Dirección del juego

Queremos encuentros mágicos muy raros y descubrimientos únicos que cueste conseguir. Jay considera que las reliquias actuales son demasiado fáciles: hoy se generan tres alrededor del jugador cada día y una flecha guía hacia ellas. Revisar esa dificultad y añadir encuentros excepcionales es trabajo pendiente; todavía no hay un sistema de rarezas o de objetos únicos coleccionables.

## Para seguir desarrollando

Lee **[HANDOFF.md](HANDOFF.md)**. Tiene todo el contexto: visión, decisiones tomadas, arquitectura del código, sistemas, cómo probar y el roadmap. Está pensado para pegarlo en otra IA (ChatGPT, Claude, etc.) y seguir sin perder nada.
