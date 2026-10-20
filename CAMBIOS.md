# Cambios recientes de Kubono

Estado: 20 de octubre de 2026. Código **2.3.0-alpha.59**. Las entradas describen su revisión, no certifican producción.

## Recuperación configurable, borrado local y CI · alpha.59

Rama `claude/charming-darwin-dvbfc7` desde `feature/account-recovery-link` (`3175b41`). `recoveryUrl` en `cloud-config.js`, validado en `cloud-client.js` (local HTTP o HTTPS limpio) y aviso de puerto 3000 solo con destino local. Eliminar cuenta pide credenciales, luego confirmación, y tras el RPC `purgeUserStorage` borra en el dispositivo solo las claves de esa cuenta. Fixtures de navegador adaptadas a la cuenta obligatoria y al menú sin «Guardar copia»; `checks.yml` con historial completo en `browser`; `bump-version.mjs` reconoce la etiqueta «Versión del código» del README consolidado. Evidencia local: Node de cuentas y nueve recorridos en PASS; catálogo completo, Android y Supabase sin ejecutar. CI de `main` sigue rojo hasta integrar.

## Consolidación para revisión con Claude · 3175b41

Documentación vigente con índice y traspaso en raíz. Corregidas referencias a cuenta opcional, guardado manual, demo, firma por caché y migración pendiente. Plan de lanzamiento con decisiones actuales y estados separados de implementación/prueba/publicación. Documentos históricos identificados como archivo; evidencia anterior preservada y enlazada. 100 Markdown revisados (16 vigentes/84 históricos); 1661 enlaces locales sin roturas y referencias de código/locales comprobadas. Auditoría estática sin errores/avisos; selección de impacto: cero suites Node. Sin cambios de código, nuevas pruebas funcionales ni actividad Supabase.

## Retención gratuita · 32e2102

GitHub Actions configurado a siete días para nuevos logs/artefactos; workflows alineados y [CI aprobado](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39455805125). Tarea local horaria con archivos permitidos para respaldos de migración y logs inactivos, sin incluir firma ni partida activa. Fixture vencida borrada, reciente/clave conservadas; aplicación real inicial cero borrados. Limpieza de Supabase preparada pero no aplicada por solicitud caducada. Trabajo detenido por Jay para revisión documental.

## Privacidad y producción · 8a8a20a, 200da32

Borradores de privacidad, eliminación y lista de producción. Jay aprueba público de 16 años o más y los plazos registrados en [configuración](docs/CONFIGURACION_PRODUCCION.md). Datos legales, país, mercados y correo público pendientes; no se activó verificación de edad ni se publicó política.

## Firma estable y migración · 165a356, c538a1d

[Compilación estable](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907), copia privada local y secreto CI; sin regeneración silenciosa de identidad por perder una caché. Actualización aislada mantiene 137 chispas y compra. Migración real autorizada en emulador: 280 archivos privados restaurados idénticos, cuenta conectada y saldo 52/72 ganadas/20 gastadas tras actualización y reapertura. Lanzador actualizado y respaldos locales retenidos temporalmente. Firma de vista previa, no de tienda.

## Cuenta obligatoria y progreso automático · alpha.55–58

Admisión antes del runtime, sesión persistente, guardados locales aislados por cuenta y conciliación automática cada cinco segundos. Sin invitado/demo ni controles normales de respaldo. Conflictos reales conservan ambas copias y piden elegir; CAS evita reemplazar revisiones ajenas. Reautenticación de eliminación corregida sin recarga prematura. Evidencia real PC/iPhone/emulador y pruebas enfocadas en [cuentas](docs/CUENTA_Y_RESPALDO.md), con límites explícitos.

## Entregas anteriores

[Registro detallado hasta alpha.58](docs/historial/CAMBIOS_HASTA_ALPHA_58.md) conserva comandos, revisiones, incidencias y pruebas de sus entregas. [Archivo anterior a la primera consolidación](docs/historial/CAMBIOS_ANTES_CONSOLIDACION.md). No usar las instrucciones antiguas de cuenta opcional, guardar manualmente o firmar solo con caché como comportamiento vigente.
