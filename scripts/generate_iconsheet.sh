#!/usr/bin/env bash

set -e

SCRIPT_PATH="$(dirname "$(realpath "$0")")"
ROOT_DIR="$(dirname "$SCRIPT_PATH")"

VARIANTS=("$@")
OUT_DIR="$ROOT_DIR/out"
OUT_FILE="$OUT_DIR/ICONSHEET.md"
TEMPLATE_ZIP="$OUT_DIR/template.zip"

if ((${#VARIANTS[@]} <= 0)); then
    VARIANTS=($(ls $ROOT_DIR/assets/*.svg))
fi

echo "==> Generating iconsheet for variants: ${VARIANTS[*]}"

cp "$ROOT_DIR/assets/ICONSHEET.md" "$OUT_FILE"

echo "==> Adding icons to icon sheet..."

for variant in "${VARIANTS[@]}"; do
    VARIANT_NAME=$(basename ${variant%%.*})

    echo "==> Adding $VARIANT_NAME to icon sheet..."

    echo "![](./$VARIANT_NAME/1024x/color.png)" >> "$OUT_FILE"
    echo "![](./$VARIANT_NAME/1024x/black.png)" >> "$OUT_FILE"
    echo "![](./$VARIANT_NAME/1024x/inverted/black.png)" >> "$OUT_FILE"
    echo "![](./$VARIANT_NAME/1024x/inverted/color.png)" >> "$OUT_FILE"
    echo "" >> "$OUT_FILE"
done

echo "==> Generating icon sheet PDF..."

function run_ifmd() {
    if command -v ifmd >/dev/null 2>&1; then
        ifmd generate -t grid "$OUT_FILE"
        return
    fi

    curl -fsSL -o "$TEMPLATE_ZIP" "https://giancarl021media.blob.core.windows.net/cdn/ifmd-templates/grid.zip"
    mkdir -p "$OUT_DIR/ifmd-config/templates/grid"

    chmod -R 777 "$OUT_DIR/ifmd-config"

    unzip -o "$TEMPLATE_ZIP" -d "$OUT_DIR/ifmd-config/templates/grid" > /dev/null

    docker run --rm \
        -v "$OUT_DIR:/data" \
        -v "$OUT_DIR/ifmd-config:/home/node/.ifmd" \
        -w "/data" giancarl021/ifmd:latest generate -t grid "$(basename "$OUT_FILE")"
}

run_ifmd

rm -rf "$OUT_FILE" "$TEMPLATE_ZIP" "$OUT_DIR/ifmd-config"