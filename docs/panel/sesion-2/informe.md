# Kubono · Panel creativo, segunda sesión

24 de octubre de 2026, sobre `main` (2.3.0-alpha.160, fases F0–F18). Mismos diez perfiles **simulados** que el 22 de octubre: no son sus opiniones reales. Juzgaron código, capturas de teléfono y simulaciones; **nadie salvo Jay ha jugado esta versión** y nadie oyó el audio en un teléfono. Análisis completos: `2-01-mizuguchi.md` … `2-10-wintory.md`.

**Corrección:** la captura `00-inicio.png` (HUD «DÍA 1», cifras y texto) no es lo que ve un jugador. Con un navegador automatizado el juego abre el modo «Todo a la vista» (`journey-mode.js:7`). La entrada real es negra, con un cubo, dos cristales y la palabra «Pulso».

## 1. Notas

| Creador | Visual | Audio | Creatividad | Sensación | Cohesión | Pulido | Media (22 oct) |
|---|---|---|---|---|---|---|---|
| Mizuguchi | 6,5 | 8,5 | 8,5 | 7 | 7 | 6,5 | 7,3 (6,4) |
| Iwai | 6,5 | 8,5 | 8 | 6,5 | 6,5 | 6,5 | 7,1 (6,4) |
| Matsuura | 7,5 | 8,5 | 8,5 | 7 | 7 | 7 | 7,6 (6,6) |
| Simogo | 7,5 | 8,5 | 8 | 7 | 6 | 7 | 7,3 (6,5) |
| Proteus | 6,5 | 8,5 | 7,5 | 7 | 6 | 6,5 | 7,0 (6,3) |
| Jenova Chen | 7 | 8,5 | 8 | 7 | 6 | 6 | 7,1 (6,4) |
| Roset | 6,5 | 8 | 8 | 6,5 | 6,5 | 6,5 | 7,0 (6,3) |
| Ken Wong | 7 | 7,5 | 8 | 6,5 | 6,5 | 7 | 7,1 (6,4) |
| Pope | 7 | 8 | 8 | 7 | 5,5 | 6 | 6,9 (6,3) |
| Wintory | 7,5 | 8 | 8 | 7 | 6,5 | 7 | 7,3 (6,7) |
| **Hoy** | **7,0** | **8,3** | **8,0** | **6,9** | **6,4** | **6,6** | **7,2** |
| 22 de octubre | 6,5 | 7,9 | 7,9 | 5,6 | 4,8 | 6,1 | 6,4 |
| Meta | 8,5 | 9 | 9 | 8,5 | 8,5 | 8,5 | 8,7 |

Todos suben. Lo que más subió: **Sensación** (+1,3) y **Cohesión** (+1,6), gracias al verbo único a tiempo, el Viaje cerrado y la Cueva. Lo que más falta: **Cohesión** (−2,1 a la meta), **Pulido** (−1,9) y **Sensación** (−1,6).

## 2. En qué coinciden

1. **El verbo funciona.** Diez de diez: «tocar a tiempo» sin castigo es el centro. Pope: los once verbos cumplen «un solo verbo» porque cada lugar es una regla del día sobre el mismo gesto. Matsuura y Simogo: la Cueva es lo mejor (llamada y respuesta).
2. **El Viaje es un EP coherente; lo que sigue es una lista.** Simogo, Chen y Wintory: tras el Viaje, 11 lugares sin orden, los cinco primeros repiten el Viaje y el final de 33 ★ es más pequeño que el del Viaje (unos 30 s de house fijo, sin tus notas).
3. **Hay un muro de estrellas.** Chen: el Viaje da 5 ★ y el Jardín 1; las Dunas piden 8 y la ★★ exige 85 % a tiempo. Un jugador al 75 % se atasca hacia el minuto 35.
4. **No se ve bien en el teléfono.** Mizuguchi y Ken Wong: el cubo mide unos 10 px. Roset: el color ganado son motas sueltas, no un tono. Proteus: el filtro gris apaga el oro de portales y chispas. Ken Wong: las 11 puertas no entran en el encuadre.
5. **El acierto no siempre se siente.** Mizuguchi: el brillo dorado del cubo solo sale si el teléfono **no** vibra. Matsuura y Mizuguchi: no hay calibración de latencia. Matsuura: tres reglas en pantalla a la vez (Línea, puntos bajo el cubo y puntos del capítulo).
6. **El tema no crece.** Wintory: el tema del cubo suena igual en todas partes, como aviso de «nivel completo»; 22 de las 33 ★ no cambian la música. «Tu canción» (house en La mayor a 120 BPM) es ajena a la música del mundo.
7. **Sobra ruido.** Pope: 311 módulos, diez contadores y 17 entradas de menú. Proteus: tras los créditos vuelven chispas, contadores y un logro burlón. Roset: rótulos en el Viaje que debería ser mudo.
8. **Bug visible:** la hoja Lugares pone ★ y «Sin visitar» en la misma fila (Pope, Iwai, Ken Wong).

## 3. Plan: qué hacer y cómo

Cada fase en su rama, como siempre. Primero lo que no necesita decisión.

### G1 · Arreglos (sin decisión, ~1 día)
- **Lugares:** quitar «Sin visitar» donde hay ★; un solo botón principal (`refugio-lugares.js`).
- **Acierto siempre visible:** el brillo dorado del cubo también cuando vibra (`journey-pulse.js`); la onda a tiempo en dorado (`updWaves` ya recibe `beat`).
- **Pruebas honestas:** que `?anillo=1` siembre los colores ganados y que las capturas automáticas muestren la entrada real.
- *Bien cuando:* las capturas de 6 pulsos muestran el oro en el cubo y ninguna fila de Lugares se contradice.

### G2 · Que se vea (Mizuguchi, Ken Wong, Roset, Proteus)
- **Cámara:** zoom base en móvil para que el cubo mida ≥ 28–32 px (`world-camera.js`), sin tocar mundo ni semillas.
- **Color ganado como tono:** cada bioma recuperado se tiñe de su color al 18–30 % (`world-sheet.js`), no motas.
- **El oro por encima del gris:** portales, chispas y objetos dorados se dibujan después del filtro.
- **Portales a la vista:** columna de luz dorada hacia el portal siguiente (`places-ring.js`).
- *Bien cuando:* en una captura de teléfono se distinguen cubo, color del lugar y un portal sin leer nada.

### G3 · Que se sienta (Matsuura, Mizuguchi, Iwai)
- **Calibración sin menú:** los primeros 12 pulsos del Camino miden el retraso y lo guardan (`S.latencyOffset`, sumado en `outputLatency()`); «Ajustar el tiempo» en Ajustes. *Bien:* un bot con +150 ms pasa de <30 % a >95 % a tiempo.
- **Una sola guía:** la Línea anticipa los pasos del ritmo que vienen hacia el cursor; se retiran los puntos bajo el cubo.
- **El ritmo se oye antes:** el lugar canta su patrón un compás al empezar (la llamada de la Cueva) y desaparecen las frases «Aquí el ritmo es…».
- **Cubo Vibri:** cuatro formas según la racha (un fallo baja un nivel, no reinicia).

### G4 · La cara B como disco (Simogo, Chen, Wintory) · necesita decisiones
- **Sin muro:** escalera 5·6·7·8·9·10 o ★★ también por mejorar tu marca (`places.js`).
- **Orden de pistas:** cada lugar con número; el siguiente se señala al cerrar el anterior; un portal dorado en vez de tarjeta.
- **El tema crece:** cada nivel de ★ cambia la forma del tema en su capa (fragmento → tema → variación) (`song.js`, `layerEvents(id,tier)`).
- **Final de 33 ★ verdadero:** 60–90 s con tus notas de los 11 lugares, silencio y el tema sobre las 11 capas (`song-stage.js`, `journey-finale.js`).

### G5 · Menos ruido (Pope, Roset, Proteus) · necesita decisiones
- Viaje sin rótulos cuando la pantalla está en modo Viaje (`sayOnce`, `chapterToast`).
- Tras los créditos, pantalla tranquila: sin contadores ni logros durante unos minutos.
- Menú de 6 entradas; en pantalla, como mucho ★ y ✦.

### G6 · Mundo salvaje que se escucha (Proteus)
- Voces salvajes en vez de chispa con flecha: se encuentran con el oído (`spatial.js`) y luego te siguen.
- El anillo como paisaje sonoro: cada portal abierto suena en su paso del compás y desde su dirección.

### G7 · Medir (Chen) y personas (F19)
- `scripts/journey-curve.py` a 2 h con jugadores al 60, 75 y 90 %; regla: nunca más de 12 min sin novedad.
- Sesiones con Jay y Luca (`?prueba=1`).

## 4. Decisiones que son de Jay

1. **Estrellas** (Chen, Simogo): ¿escalera más suave? ¿Se gana con 11 ★ y las 33 son la versión Maestro?
2. **Chispas** (Pope, Matsuura): ¿fuera de tiempo, 0 ✦ en el Mundo libre? ¿La tienda pasa a post-juego?
3. **Texto** (Roset, Mizuguchi): ¿Viaje mudo? ¿El narrador solo en la tarjeta final y la Bitácora?
4. **Tu canción** (Wintory): ¿se reescribe desde el tema del cubo, quizá con un músico coautor?
5. **Tras el Viaje** (Proteus): ¿Mundo libre tranquilo por defecto?
6. **Festival** (Ken Wong): ¿el jurado ve solo el Viaje (`?festival=1`), sin 33 ★, remezcla ni tienda?
7. **Modo Libre por lugar** (Iwai): ¿sin barra ni estrellas, para jugar con la música?
