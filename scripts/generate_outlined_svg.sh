#!/usr/bin/env bash

set -e

SCRIPT_PATH="$(dirname "$(realpath "$0")")"
ROOT_DIR="$(dirname "$SCRIPT_PATH")"

VARIANT_NAME="${1}"
INPUT_SVG="$ROOT_DIR/icons/$VARIANT_NAME.svg"
OUTPUT_SVG="$ROOT_DIR/out/$VARIANT_NAME.svg"
FONTS_DIR="$ROOT_DIR/assets/fonts"

if [ -z "$VARIANT_NAME" ]; then
    echo "Usage: $0 <variant-name>"
    exit 1
fi

if [ ! -f "$INPUT_SVG" ]; then
    echo "Error: SVG file '$INPUT_SVG' not found."
    exit 1
fi

if [ ! -d "$FONTS_DIR" ]; then
    echo "Error: vendored fonts directory '$FONTS_DIR' not found."
    exit 1
fi

mkdir -p "$(dirname "$OUTPUT_SVG")"

# Point fontconfig at the repository-vendored fonts so Inkscape can render the
# typography variants without relying on any system-wide font installation.
# We generate a throwaway fonts.conf that adds our fonts directory on top of
# the standard system configuration (kept via <include>).
FC_TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$FC_TMP_DIR"' EXIT

cat > "$FC_TMP_DIR/fonts.conf" <<EOF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
    <dir>${FONTS_DIR}</dir>
    <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
    <include ignore_missing="yes">/usr/local/etc/fonts/fonts.conf</include>
    <include ignore_missing="yes">/opt/homebrew/etc/fonts/fonts.conf</include>
    <cachedir>${FC_TMP_DIR}/cache</cachedir>
</fontconfig>
EOF

export FONTCONFIG_FILE="$FC_TMP_DIR/fonts.conf"

echo "==> Outlining text in $VARIANT_NAME.svg using vendored Space Grotesk..."

inkscape "$INPUT_SVG" \
    --actions="select-all:all;object-to-path;export-filename:${OUTPUT_SVG};export-plain-svg;export-do"

if [ ! -f "$OUTPUT_SVG" ]; then
    echo "Error: failed to generate outlined SVG at '$OUTPUT_SVG'."
    exit 1
fi

echo "==> Wrote outlined SVG to $OUTPUT_SVG"
