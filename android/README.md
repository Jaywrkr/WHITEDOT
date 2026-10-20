# Android de Kubono · vista previa de cuentas

Estado documental: 20 de octubre de 2026. Juego empaquetado en WebView con assets HTTPS locales mediante `WebViewAssetLoader`; mismo cliente, sin añadir anuncios/cobros. Android 8 o superior y WebView actualizado. Validado en emulador Android 15, no en Android físico ni en una compra de tienda.

## Edición actual y firma

| Elemento | Estado vigente |
|---|---|
| Paquete de prueba activo | `com.jaywrkr.whitedot.accounts` (`-PaccountPreview`) |
| Versión de código | 2.3.0-alpha.58; requiere cuenta en el primer acceso y conserva sesión/progreso local para offline posterior |
| Workflow | [Android account preview](../.github/workflows/android-account-preview.yml), rama `feature/account-recovery-link` y disparo manual |
| Artefacto | `Kubono-account-preview`: APK de cuenta, instrumentación, par `.accounts.signingprobe`, SHA256SUMS y certificado público; retención de nuevos artefactos 7 días |
| Firma estable de prueba | Secreto CI `KUBONO_ACCOUNT_PREVIEW_KEYSTORE_B64`; ausencia detiene el build, no genera otra identidad. Archivo temporal eliminado al finalizar |
| Copia privada local | `AndroidPlayer/signing/kubono-account-preview.p12`, fuera del repositorio y excluida de la limpieza de respaldos. Conservar copia externa segura |
| Firma de tienda | Pendiente; esta clave/edición debug no es una entrega comercial |

No imprimir claves ni tokens. No basar la firma en una caché efímera. La aplicación usa un origen local propio: sus credenciales no aparecen automáticamente desde Safari/Chrome; el progreso online llega al entrar con la misma cuenta. No hay botones normales de guardar/importar/exportar. El adaptador conserva soporte técnico para selectores de archivos, no una interfaz de respaldo manual para el jugador.

## Jugar en el computador preparado

En este entorno Windows, `AndroidPlayer/Jugar-WHITEDOT.ps1` abre `emulator-5580` y el APK `Kubono-accounts.apk`. Ese directorio está fuera del repositorio: no se obtiene al clonar GitHub. El lanzador y su marcador de hash se actualizaron tras validar la migración.

Para actualizar una instalación con la misma firma y applicationId:

```sh
adb install -r Kubono-accounts.apk
```

No desinstalar para una actualización normal: borra datos privados. Si Android rechaza la firma, detenerse y comprobar certificado/paquete; no generar otra clave ni borrar la partida para ocultar el problema.

## Compilar

JDK 17, SDK 36, Gradle 8.13 y Node 18 o superior. Para compilar la edición de cuentas con la clave retenida, definir `KUBONO_ACCOUNT_KEYSTORE` con su ruta privada y ejecutar:

```sh
gradle -p android assembleDebug assembleDebugAndroidTest -PaccountPreview --no-daemon
```

Salida Gradle: `android/app/build/outputs/apk/debug/app-debug.apk`. El workflow la copia al nombre `Kubono-accounts.apk`. No instalar una compilación local con clave distinta encima de la validada. Sin `-PaccountPreview`, la configuración usa el sufijo histórico `.preview`; no es el paquete activo de cuentas.

Gradle genera assets sin cambiar originales; el APK gestiona su actualización y no incluye el service worker web. El sellado usa revisión/hora reales y el mecanismo existente. `versionCode` comercial y AAB release están pendientes; las propiedades de versión/paquete de `.signingprobe` son solo para probar actualizaciones aisladas.

## Evidencia y alcance

- [CI estable 39337750907](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907), fuente `165a356`: APKs/hashes/certificado comprobados; prueba aislada v1→v2 conserva guardado de 137 chispas y compra dust. La fixture espera que WebView escriba en disco antes de salir.
- [CI de retención 39455805125](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39455805125), fuente `32e2102`: compilación aprobada con retención de siete días. No equivale a repetir la aceptación funcional.
- Instalación inicial alpha.57: Jay entró y confirmó saldo igual a PC/iPhone; puerta `requiresAccountBeforeWorld` probada en WebView real.
- La firma alpha.57 se perdió con el runner. La migración única a alpha.58 fue autorizada: restauración exacta de 280 archivos, sesión conectada, 52 chispas/72 ganadas/20 gastadas, también tras `install -r` y reapertura en frío. Está completada, no pendiente. El respaldo privado de rollback es temporal y tiene limpieza local programada.
- Los tests históricos de audio/Home/rotación/offline del APK previo no prueban por sí solos el flujo de cuenta actual. CI compila los APKs de cuentas; las comprobaciones instrumentadas citadas se ejecutaron aparte en el emulador local.

Pendientes de tienda: firma/upload key y respaldo, identificador final y versionCode, AAB sin depuración, Play Console y pruebas requeridas, Android físico/escucha humana, WebView/Android adicionales y archivos por proveedor. No hay publicación ni contratación autorizadas.

[Cuenta/progreso](../docs/CUENTA_Y_RESPALDO.md) · [Verificación](../docs/VERIFICACION.md) · [Contenido local oficial de WebView](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content).
