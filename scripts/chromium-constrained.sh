#!/bin/bash
# Optional local profile for cloud hosts short of available threads.
exec taskset -c 0 "${WHITEDOT_SYSTEM_CHROMIUM:-/usr/bin/chromium}" "$@" --disable-gpu --in-process-gpu --disable-software-rasterizer --no-zygote --num-raster-threads=1 --renderer-process-limit=1 --disable-threaded-animation --disable-threaded-scrolling --js-flags=--single-threaded --disable-features=SpareRendererForSitePerProcess,AudioServiceOutOfProcess --enable-features=NetworkServiceInProcess2
