#!/usr/bin/env bash

# Prefer ImageMagick 7's `magick`, but fall back to legacy `convert` when that
# is the only binary available in CI or on older local setups.
imagemagick() {
    local bin=""

    if bin="$(command -v magick 2>/dev/null)"; then
        :
    elif bin="$(command -v convert 2>/dev/null)"; then
        :
    else
        echo "Error: neither 'magick' nor 'convert' was found in PATH." >&2
        return 127
    fi

    "$bin" "$@"
}
