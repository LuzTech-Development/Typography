#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "$(realpath "$0")")"
ROOT_DIR="$(dirname "$SCRIPT_PATH")"
source "$SCRIPT_PATH/imagemagick.sh"

BACKGROUND_IMAGE="$ROOT_DIR/assets/background.png"
VARIANT_NAME="${1}"
INPUT_SVG="$ROOT_DIR/out/$VARIANT_NAME.svg"

if [ -z "$VARIANT_NAME" ]; then
    echo "Usage: $0 <variant-name>"
    exit 1
fi

if [ ! -f "$INPUT_SVG" ]; then
    echo "Error: outlined SVG file '$INPUT_SVG' not found. Run generate_outlined_svg.sh first."
    exit 1
fi

OUTPUT_DIR="$ROOT_DIR/out/$VARIANT_NAME/1024x"

echo "==> Generating $VARIANT_NAME icons..."

mkdir -p "$OUTPUT_DIR/inverted"

echo "==> Rendering SVG to PNG..."

inkscape "$INPUT_SVG" -w 1024 -o "$OUTPUT_DIR/black.png"

echo "==> Creating white and color variants..."

imagemagick "$OUTPUT_DIR/black.png" -negate "$OUTPUT_DIR/white.png"
imagemagick "$BACKGROUND_IMAGE" '(' "$OUTPUT_DIR/black.png" -alpha extract ')' -compose CopyOpacity -composite "$OUTPUT_DIR/color.png"

echo "==> Creating inverted variants..."

imagemagick -size 1024x1024 "$BACKGROUND_IMAGE" '(' "$OUTPUT_DIR/black.png" -alpha extract -negate ')' -compose CopyOpacity -composite "$OUTPUT_DIR/inverted/color.png"
imagemagick -size 1024x1024 "xc:white" '(' "$OUTPUT_DIR/black.png" -alpha extract -negate ')' -compose CopyOpacity -composite "$OUTPUT_DIR/inverted/white.png"
imagemagick -size 1024x1024 "xc:black" '(' "$OUTPUT_DIR/black.png" -alpha extract -negate ')' -compose CopyOpacity -composite "$OUTPUT_DIR/inverted/black.png"