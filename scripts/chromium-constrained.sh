#!/bin/bash
# Optional local profile for cloud hosts short of available threads.
extra=()
if [ "${WHITEDOT_CHROMIUM_SINGLE_PROCESS:-0}" = "1" ]; then extra+=(--single-process); fi
# One-process mode is only for tests designed to reuse a single browser context.
exec taskset -c "${WHITEDOT_CHROMIUM_CPU:-0}" "${WHITEDOT_SYSTEM_CHROMIUM:-/usr/bin/chromium}" "$@" "${extra[@]}" --disable-gpu --in-process-gpu --disable-software-rasterizer --no-zygote --num-raster-threads=1 --renderer-process-limit=1 --disable-threaded-animation --disable-threaded-scrolling --disable-threaded-compositing --js-flags=--single-threaded --disable-features=SpareRendererForSitePerProcess,AudioServiceOutOfProcess --enable-features=NetworkServiceInProcess2
