# Fase 2 · Paisajes vivos

Rama `feat/phase-02-living-world-recipes`, iniciada desde fase 1 (`7bed0ca`) y actualizada a main `e26ef93` al cierre: Jay ya integró fase 1 mediante PR #68. Crear el PR de fase 2 directamente hacia main. Una sola rama agrupa toda la entrega; no hay una rama por objeto.

## Probar

1. **Menú → Explorar mundos.** Paisaje: **Paisajes vivos**; Espacio: **Amplio**. Elegir Humedal, Salinas, Basalto o Micelio. El acceso anterior desde Prototipo → Semillas también permanece.
2. Cada centro tiene un elemento pequeño cercano para aprender. Tócalo para responder a tempo; arrástralo para modelar su tensión y carga. El jugador permanece donde estaba durante ese gesto.
3. Quédate cerca unos diez segundos: crece su influencia en una parte musical. Al alejarte disminuye. Una vaina sale volando y regresa; juncos y corales se doblan; piedras, filamentos y micelio tienen otras siluetas/respuestas.
4. Mantén en el vacío para **Escuchar**: muestra nombre, instrumento, función y gesto de los elementos cercanos. Consulta **Bitácora** para hábitats y familias descubiertas.
5. Guarda un favorito y exporta un respaldo. La recarga conserva coordenadas, descubrimientos y logros; los gestos y vuelos son temporales. Elegir **Original** permite comparar la misma semilla con su generación anterior, en otra partida. **Mi partida** vuelve al guardado habitual.

Elegir otro paisaje/semilla no reemplaza la partida habitual. Los mundos originales siguen usando sus recetas, tamaños, coordenadas y guardados existentes.

## Qué se implementó

### Recetas de ambiente

Se mantienen **11 biomas base y 52 estilos musicales**. Encima se agrega un catálogo de **33 perfiles de hábitat**, tres por bioma, con combinaciones diferentes de terreno visual, flora, material, densidad y composición. No se anuncian 33 biomas base nuevos ni instrumentos de síntesis nuevos.

| Base | Perfiles |
|---|---|
| Llanura | Estepa de hilos, Pradera de semillas, Tundra luminosa |
| Bosque | Canopia de filamentos, Bosque de micelio, Bosque de juncos |
| Lago | Humedal de pulsos, Manglar de luz, Laguna de vidrio |
| Ruinas | Ruinas de basalto, Terrazas dormidas, Ruinas de cobre |
| Jardín | Jardín de polen, Jardín de raíces, Jardín de vainas |
| Dunas | Salinas resonantes, Dunas de seda, Oasis de cobre |
| Cristales | Campo de geodas, Agujas de luz, Cristales de escarcha |
| Faros | Acantilados de eco, Faros de marea, Faros de bruma |
| Tormenta | Campo de fulguritas, Llanura magnética, Archipiélago de nubes |
| Cueva | Gruta de esporas, Gruta de agujas, Lago subterráneo |
| Vacío | Mar de silencio, Mar de sal, Vacío de constelaciones |

Humedad, temperatura, elevación visual y fertilidad tienen campos suaves independientes. Afinidad climática guía el bioma; bloques relacionados mantienen vecindad, con variación local de densidad/fauna/estructura. Los hábitats cambian materiales, vegetación y terreno dibujado mediante raíces, estratos, células minerales, ondas o marcas pequeñas. El relieve es **visual**, no terreno 3D ni nuevas barreras físicas. No se cambia la velocidad/gravedad existente.

El clima condiciona aire y probabilidad diaria de eventos: lugares húmedos favorecen lluvia. Los eventos y las estaciones anteriores permanecen; no se añadió una simulación meteorológica continua nueva.

Las regiones amplias de Paisajes vivos miden **10.800 unidades de ancho**, frente a 7.200 del Amplio original y 3.600 del Clásico. El Clásico vivo conserva 3.600 para comparar ventanas. Se reduce densidad física según fertilidad/hábitat y se mantienen claros/espacios de ensamble. La flora/fauna tiene proporciones y rasgos de movimiento regionales, además de sus personalidades individuales anteriores.

### Seis familias de materia musical

| Familia | Forma/respuesta | Papeles posibles |
|---|---|---|
| Junco de pulso | Tres tallos que se doblan | Bajo, groove, espacio |
| Vaina viajera | Vaina curva que vuela y vuelve | Bajo, motivo, groove |
| Micelio resonante | Ramificaciones radiales, crecimiento local | Bajo, groove, espacio |
| Piedra estriada | Piedra achatada con estrías | Bajo, groove |
| Filamento de bruma | Hilo curvo de aire | Espacio, motivo, groove |
| Coral de cobre | Ramas tensadas y movimiento propio | Bajo, groove, motivo |

Los contratos de fase 1 se aplican a la generación real de estas familias: biomas compatibles, presencia regional/local, materiales, papel y variante con flujos separados. Hasta cuatro elementos nuevos por chunk; el mar y los vacíos sin densidad no los generan. Los centros de prueba tienen una excepción deliberada de aprendizaje: garantizan uno compatible, preferentemente propio del preset, aunque su tirada natural no lo eligiera.

Cada respuesta usa instrumentos del género actual, registro grave/medio y volumen contenido, con límite compartido de respuestas. Cultivar/modelar conduce las partes existentes mediante influencia; no apila una pista continua adicional. La distribución de funciones cambia por semilla/región/elemento. La UI no emite sonidos. Arrastrar horizontalmente cambia la variante musical; verticalmente cambia carga/intensidad. El cultivo tarda 6–14 segundos según familia. Mutear, abrir menú, Escuchar, ocultar pestaña o salir de superficie detiene las respuestas/cultivo; cancelar el puntero restaura el gesto.

### Composición y continuidad

Paisajes vivos añade arquitecturas `breathing`, `rooted`, `interlocking` y `floating` como variable regional, frases de 8/12/16 compases y motivos acotados a 2–4 notas. Los instrumentos siguen siendo los del catálogo actual. Voces regionales comunes y las seis familias nuevas usan bandas graves/medias; los blobs conservan sus bandas anteriores. La desafinación ambiental lejana se limita a ±12 cents en esta generación.

La elección de género comparte contexto entre vecinos y conserva tempo/tonalidad continental. La caché de pesos musicales se separa por semilla en la generación nueva y queda limitada a ocho entradas. La radio sigue cambiando en quietud con sus reglas existentes; no se guardan escenas ni audio exacto. El margen final de salida en Paisajes vivos pasa de .98 a .96 (aproximadamente −0,18 dB), para conservar margen ante ensembles densos; el Original mantiene .98.

### Guardado y documentación del juego

Generación original: `{generatorVersion:1, catalogVersion:1, layoutVersion:1}`. Paisajes vivos: las tres versiones `2`. Se reconocen ambas; mezclas de versiones inválidas/futuras siguen protegidas. Para la generación viva, las claves de prueba llevan `v2:`. Las claves originales y la partida habitual no cambian.

Favoritos, orientación/autopilot y respaldos exigen la identidad completa correspondiente. El nombre del respaldo distingue `vivo`/`original`. No se migra un mapa antiguo silenciosamente. Una URL sin `generation=2` conserva la generación original; el selector del menú propone la nueva explícitamente.

Bitácora registra hábitats y familias tocadas. Logros nuevos: **Materia que escucha**, **Un lugar contigo**, **Cuatro maneras de tocar**. Solo aparecen en Paisajes vivos; los registros dinámicos de logros de otros sistemas se conservan. El shell offline se actualiza con los dos módulos nuevos.

## Medición y límites

```bash
npm run audit:universe -- 10000 4 1 classic
npm run audit:universe -- 10000 4 2 classic
npm run audit:universe -- 250000 4 2 classic
node scripts/world-variation.mjs 100
```

Comparación de cuatro semillas y 40.000 regiones: original 39.880 firmas detalladas; vivo 39.998. Coincidencia de bioma entre vecinos terrestres: **9,7 % → 57,2 %**; coincidencia de género: **14,8 % → 34,0 %**. Los 33 perfiles y los 52 estilos aparecieron en la muestra viva. La firma viva incluye ecología y duración/límite del motivo: esas cifras no significan canciones distintas ni una mejora perceptual cuantificada.

El original mantiene exactamente la medición antigua de 39.952 recetas detalladas y 9.732 perfiles musicales terrestres en 40.000 regiones. Una captura del código de fase 1 verifica además recetas y posiciones reales de chunks seleccionados mediante SHA-256; esa comprobación no usa una copia del nuevo algoritmo como referencia.

La auditoría de un millón de candidatos entre cuatro semillas registró **999.512 firmas detalladas** y **586.200 firmas musicales terrestres**: [resultado](scripts/phase-02-million-sample.json). Las cachés de terreno respetaron sus límites. El auditor acumula conjuntos de firmas en memoria proporcionalmente al tamaño de la muestra; el juego mantiene residencia acotada. Resultados finales en [HANDOFF.md](HANDOFF.md). Mantener la distinción entre **regiones muestreadas**, **recetas estructurales distintas** y **experiencias que se sienten diferentes**. El mapa no tiene un total de mundos completos enumerado ni promete infinito literal.

## Pendiente después de esta fase

Más modelos de instrumento, identidades audibles de estilos, secuencias moduladas y escucha curada larga corresponden a fase 3. La migración voluntaria del guardado habitual a un paisaje vivo y el acabado del selector para la release deben acompañarse de pruebas de actualización; hoy el acceso desde el menú conserva partidas separadas. Culturas/reliquias históricas, color/espejos avanzados y multijugador continúan en sus fases. No se declara lista toda la V1.

## Validación final

49 suites Node, 32 recorridos Chromium, shell offline con 79 módulos y gestos finales en móvil vertical/horizontal/escritorio. Doce renders del paisaje vivo y seis del Original verifican audio real, densidad, modo suave y margen de salida a 44,1/48 kHz: [mediciones](scripts/phase-02-validation.json). No sustituyen Safari/Android/PWA reales ni escucha artística prolongada. GitHub Actions quedó preparado; su ejecución remota depende del PR/merge de Jay.
