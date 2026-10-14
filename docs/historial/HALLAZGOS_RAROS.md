# Libro de hallazgos · RC5

Rama **feat/rare-discovery-cards**, sobre **feat/minimal-discoveries (30d337f)**. Versión **1.0.0-rc.5**. Commit/push; Jay crea PR/merge. La rama reúne todos sus padres pendientes; no altera main ni publica. [Entrega anterior](EXPANSION_RITMICA.md) · [Handoff](HANDOFF.md).

## Al encontrar algo

Una tarjeta pequeña en la esquina superior derecha muestra ilustración original, nombre, lugar y rareza. No abre un modal ni interrumpe el movimiento/música. Dura ocho segundos de juego activo: abrir menú, scanner u ocultar pestaña pausa el aviso; al volver continúa. **Abrir libro** muestra la colección; × oculta el aviso. Son UI silenciosa: no disparan notas, ondas, looper ni cambios del secuenciador. La música del hallazgo pertenece al objeto y conserva su comportamiento anterior.

El aviso evita apilarse con Voz/toasts. Por burst se muestran hasta cuatro avisos pendientes; todas las tarjetas se guardan dentro del límite del libro. No anunciar hallazgos antiguos al arrancar.

## Qué se colecciona

18 tipos de tarjeta, con ilustraciones vectoriales originales: un fósil, dos reliquias, seis anomalías, seis poderes de cajas naturales y tres especies de compañía nacidas de caja. Cada **ejemplar/lugar** obtiene su tarjeta; volver al mismo no duplica. Otra ubicación del mismo tipo sí añade una. El contador **Elementos N/81** sigue contando familias y es independiente del libro.

La tarjeta conserva nombre y probabilidad/unidad/nivel/condiciones del momento de registro (snapshot versionado), glifo/variante, número de colección determinista, nivel de rareza, texto musical, región, bioma, género, semilla, layout, capa, coordenadas, fecha/hora UTC de encuentro y versiones del mundo. La fecha se muestra en hora local; un hallazgo anterior sin hora conserva únicamente su fecha conocida. No se reutiliza la fecha de deploy ni la de un commit.

Los retratos parten de las formas del mundo: espiral del fósil, doce glifos de reliquias, aves/luciérnaga y marcas de anomalías/poderes. Fondo negro, trazos de color local y marcos discretos; ninguna figura/personaje/logo externo. [Aviso móvil real](../images/hallazgo-aviso.png) · [libro en laboratorio](../images/hallazgos-libro.png).

## Rareza con contexto

Las probabilidades se leen de constantes compartidas con los generadores. **Sector** en UI = chunk de 900×900 unidades; una región contiene varios sectores según Original/Amplio/Vasto. Son frecuencias teóricas de aparición, no garantías cada N pasos o visitas. No confundir denominadores.

| Hallazgo | Frecuencia mostrada | Condiciones |
|---|---|---|
| Fósil de ritmo | ≈1/640 sectores de tierra | 30% sin percusión ordinaria × 1/192; no mar |
| Eco antiguo | ≈1/55 sectores elegibles | 1/48 de sitios de reliquia menos 1/384 de constelaciones = 7/384; fuera de nueve sectores centrales |
| Constelación dormida | ≈1/384 sectores elegibles | Mismo stream de reliquias; no es una segunda tirada; exige 12 s y cinco pulsos |
| Cada anomalía rara | ≈1/750 regiones elegibles | Tasa rara 1/250 ÷ tres tipos; tierra y distancia ≥4 regiones del Origen |
| Cada anomalía legendaria | ≈1/2.400 regiones elegibles | 1/1.200 ÷ dos tipos; mismas condiciones |
| Luna de oro | ≈1/6.000 regiones elegibles | Único tipo mítico; mismas condiciones |
| Caja natural de un poder concreto | ≈1/150 sectores de tierra | 4% de cajas ÷ seis poderes; regalos de quietud/formación excluidos |
| Compañía de caja | ≈1/128 cajas naturales | Requiere aún no tener mascota. Es tasa de originar compañía, **no** de esa especie; no se inventa un producto de probabilidades independientes |

Laboratorio → Percusión → Fósil permite probar la tarjeta: **Muestra de laboratorio / muestra forzada**. La frecuencia sigue describiendo la aparición natural; no se presenta la muestra forzada como un descubrimiento natural. No se reequilibran tasas, géneros, sonido ni coordenadas para fabricar más rarezas.

## Libro y retorno

**Menú → Bitácora → Hallazgos**. Se ordena del encuentro más nuevo al antiguo, doce tarjetas por página para limitar el trabajo del DOM en móvil. Cada tarjeta abre «Cómo de raro es» con sus condiciones.

**Copiar lugar** genera WD1 con semilla/layout/versiones/capa/coordenadas. Si el portapapeles no está disponible, aparece un campo seleccionable para copiar manualmente. **Orientar** guarda el punto en Favoritos y usa la navegación existente, sin teletransportar; requiere un hueco entre los 64 favoritos. En otra semilla/versión, Orientar queda deshabilitado y el código permite identificar el mundo que debes abrir. Una reliquia ya recogida no reaparece como recompensa por volver: la tarjeta recuerda el sitio.

Guardado aditivo `S.rareBook={version:1,items:[...]}`: máximo **512 tarjetas por partida**, sin sustituir las antiguas al llenarse; avisa una vez. Progreso y respaldo exporta también el libro. Bibliotecas mayores/archivo en servidor se dejan para V2; no se declara un inventario ilimitado. Semillas de prototipo y partida habitual mantienen su aislamiento. Cambiar/restaurar/resetear partida limpia avisos pendientes y carga su propio libro.

## Recuperación de progreso anterior

Se recuperan reliquias con ID/flags verificables: el generador reconstruye su ubicación. Anomalías guardadas por región se ubican en el **centro aproximado** y lo dicen. Un flag antiguo de fósil solo acredita la familia: carta con **lugar original no registrado**, sin código/Orientar. No se adivina hora, coordenada o especie de mascota de caja. No se migran regalos a cajas naturales. La recuperación es silenciosa y ocurre una vez al crear el libro.

## Verificación

59 suites Node, incluidos probabilidades de los 18 tipos, exclusión de constelaciones en tasa del Eco, direcciones/códigos, datos inválidos, deduplicación por ejemplar/semilla y límite de 512. 43 recorridos de navegador + offline aprobados. Recorrido nuevo en 390×844, 844×390 y 1280×800: contacto real con fósil, muestra forzada y fósil natural, reliquia con escucha/pulsos, aviso compacto/pausa, libro silencioso, coordenadas, retorno, persistencia y migración. Rechecks de paginación, portapapeles bloqueado, otras semillas, cajas/mascota y anomalías con aserciones de tarjeta.

[Integridad](../../scripts/rare-cards-integrity-validation.json) · [registro](../../scripts/rare-cards-validation.json). La mezcla no cambia; la batería de 225 renders de RC4 conserva su evidencia histórica, no se anuncia como repetida en RC5. Teléfono físico, gustos de escucha y publicación/CI remoto siguen pendientes.
