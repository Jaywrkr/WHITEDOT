# Auditoría externa de Kubono

Guía para un equipo externo (por ejemplo Codex) que audita el juego sin haber trabajado en él. Vigente para **2.3.0-alpha.221** en `main` (`1a898ce`, 27 de octubre de 2026).

## Cómo funciona el ciclo

1. **Ustedes auditan.** Revisan `main`, puntúan y entregan un informe con hallazgos y un plan por fases.
2. **Jay decide aquí.** Con Claude revisa el plan punto por punto. Cada propuesta sale con «sí», «no» o «después», una razón y la nota que esperamos que mueva.
3. **Se construye lo aprobado.** Una rama por fase, pruebas, CI completo en verde y merge.

Ustedes proponen; no implementan ni hacen push a `main`. Si quieren demostrar una propuesta, háganlo en una rama propia y díganlo.

## Qué queremos

- **Meta de Jay: diez en cada categoría.** No está acreditada. Queremos saber qué falta, con pruebas.
- **Un plan corto y ordenado:** primero fallos de reglas o de juego, después lo que se ve y se siente, al final lo que es gusto.
- **Honestidad sobre el alcance.** Separen siempre lo **comprobado en código o medido**, lo **visto en captura** y lo **supuesto**. Nadie ha oído el juego en un teléfono ni lo ha probado con personas: no lo den por hecho.

## Qué es Kubono

Juego musical para teléfono, web y escritorio. Eres un cubo pequeño en un universo negro. El único verbo es **tocar a tiempo**: el juego nunca suena mal, pero solo a tiempo cuenta y da más premio.

- **El Viaje** (≈15–20 min): el Camino y cinco capítulos (Llanura, Lago, Bosque, Tormenta, Vacío). Termina con «Tu mundo se abrió».
- **El Mundo libre:** once lugares en anillo, en orden. ★ completar, ★★ 75 % a tiempo, ★★★ Maestro al 70 %. Cada estrella hace crecer Tu canción; la ronda once desemboca en el final.
- **Universo abierto:** música procedural, criaturas, hallazgos, favoritos y saltos.
- **Refugio:** casa voluntaria; sus salas se abren por lugares completos o por ★.

Guías: [El mundo](MUNDO.md), [El Viaje](VIAJE.md), [Universo](UNIVERSO.md), [Arquitectura](ARQUITECTURA.md), [Verificación](VERIFICACION.md).

## Lo que no se discute

Son decisiones de Jay. Pueden señalar un efecto medible, pero no proponer revertirlas.

- **El cubo es pequeño.** La legibilidad se busca con contraste, brillo, color y señales, nunca con tamaño.
- **La música no se rehace:** generación, notas, armonías, voces y mezcla. Se puede proponer cómo se presenta o responde.
- Tocar a tiempo es el verbo. ★★ al 75 %, ★★★ al 70 %. Lugares en orden.
- Interfaz: negro puro, esquinas rectas, Geist Mono, blanco para estados; dorado solo para ★ y ✦ (D10).
- Nada ganado se borra; los guardados se migran. La nube (Supabase) está en pausa.
- Decisiones D1–D11 ([sesión 10](panel/sesion-10/informe.md) y [sesión 11](panel/sesion-11/informe.md)): capa por mejor porcentaje, tocar donde sea, tres cifras, color ganado, final de once, cuenta oculta, día nuevo sin volver al Camino, tema con sus notas, final sin radio, dorado, un gesto en todo el juego.

## Cómo se puntúa

Seis ejes, de 0 a 10 con medios puntos. Dos notas especiales para quien revise menús y detalle visual.

| Eje | Qué juzga |
|---|---|
| Visual | Si cada pantalla se lee y se recuerda en un teléfono de 390×844 |
| Audio | La música, la mezcla y si el sonido orienta |
| Creatividad | Si la idea es propia y está a la vista |
| Sensación | Si el acierto se siente: tiempo, luz, tacto y sonido a la vez |
| Cohesión | Si todo sirve a una sola idea (tocar a tiempo) y a un solo arco |
| Pulido | Errores, textos, menús, rendimiento y pruebas |
| Menús | Jerarquía, nombres, toques hasta cada tarea, accesibilidad |
| Detalle visual | Alineación, tipografía, cortes y estados, píxel a píxel |

**Rúbrica:** 10 = referencia del género, comprobado. 8 = muy bueno, pocos defectos. 6 = correcto, defectos visibles. 4 = flojo.

**Abstención:** si un eje no se puede observar con honradez (por ejemplo Audio sin escuchar), pongan «—» y digan por qué. No se promedian ejes no observados.

**Puntuación ciega:** pongan sus notas antes de leer notas anteriores del panel. Después pueden contrastar.

## Notas de referencia

Para comparar después de puntuar, no antes. Son revisiones simuladas del mismo agente, no opiniones reales ni escucha humana.

| Sesión | Versión | Visual | Audio | Creat. | Sensación | Cohesión | Pulido | Media | Menús | Detalle |
|---|---|---|---|---|---|---|---|---|---|---|
| 10 | alpha.207 | 6,9 | 7,0 | 7,5 | 6,2 | 6,4 | 6,5 | 6,7 | 5,5 | 5,5 |
| 11 | alpha.215 | 7,0 | 6,3 (3 notas) | 7,5 | 6,3 (6 notas) | 6,6 | 6,5 | 6,7 | 7 | 5,5 |

Desde la sesión 11 se construyó Q1–Q6 (alpha.216–221). **Nadie ha puntuado alpha.221.**

## Material

- **Código:** `src/` (módulos ES), `index.html`, `styles/estilo-j.css`. Sin compilación: `python3 -m http.server 8000`.
- **Capturas de teléfono:** `OUT=carpeta python3 scripts/panel-capture.py` (21 pantallas a 390×844) y `OUT=carpeta python3 docs/panel/sesion-11/evidencia/capturas-menus.py` (menús en teléfono, horizontal y escritorio; repetir con `LIBRE=libre`). Simulan un navegador normal; sin eso el juego abre su modo de pruebas y la captura engaña.
- **Atajos de URL:** `?capitulo=`, `?lugar=` (`&maestro=1`), `?anillo=1`, `?festival=1`. Lista en [El mundo](MUNDO.md#herramientas-de-prueba).
- **Estado del juego en pruebas:** sirviendo `src/main.js` con `window.__r=runtime;` al final se lee y se fuerza todo (`__r.S`, `__r.openLugares()`, `__r.openSong()`). `runtime` no existe en producción.
- **Modelo de dos horas:** `node scripts/play-curve.mjs` (jugadores simulados, no personas).
- **Pruebas:** `npm test` (265 suites Node), `node scripts/release-audit.mjs`, recorridos `tests/*_smoke.py` y renders `tests/*_mix.py`. Detalle en [Verificación](VERIFICACION.md).
- **Grabaciones del final:** `docs/panel/sesion-11/escucha/` en la rama `panel11/q7-finales` (Q7, pendiente de la escucha de Jay).

## Qué entregar

Un informe en `docs/panel/auditoria-codex/informe.md` (o en el formato que prefieran, con estas partes):

1. **Notas:** tabla de ejes con evidencia y alcance de cada nota.
2. **Lo que funciona hoy**, comprobado.
3. **Hallazgos**, numerados con ID (`A01`, `A02`…). Cada uno con:
   - gravedad: alta, media o baja;
   - prueba: `archivo:línea`, captura o medida;
   - si es comprobado, visto o supuesto.
4. **Plan por fases**, pocas y ordenadas. Cada fase con:
   - nombre y rama propuesta (`auditoria/a1-…`);
   - qué cambia y dónde;
   - «Bien cuando:» con un criterio medible;
   - nota que esperan que suba y en qué eje;
   - si necesita una decisión de Jay.
5. **Decisiones para Jay:** solo lo que es suyo de verdad, con opciones y una recomendación.
6. **Lo que no pueden saber** sin teléfono, escucha o personas.

Español, frases cortas, una idea por frase.

## Cómo lo decidimos aquí

Con el informe, Jay y Claude rellenan esta tabla en `docs/panel/auditoria-codex/decision.md`:

| ID | Propuesta | Eje | Nota esperada | Decisión | Por qué |
|---|---|---|---|---|---|
| A01 | … | Sensación | +0,5 | sí / no / después | … |

- **Sí:** entra en una fase con rama, pruebas y CI.
- **No:** choca con una decisión de Jay, cuesta más de lo que da o no se sostiene en el código.
- **Después:** depende de escucha, teléfono o personas.

Una nota simulada no certifica nada. La meta se acredita con CI verde, escucha de Jay y pruebas con personas.

## Reglas técnicas

Las de [AGENTS.md](../AGENTS.md). Las más importantes: módulos ES sin dependencias, cada módulo nuevo una vez en `SHELL` de `sw.js`, no consumir el RNG antiguo (usar `hashKey`), conservar los ID de HTML, migrar guardados sin borrar, nunca desactivar pruebas, nunca subir secretos.
