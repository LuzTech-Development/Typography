#!/usr/bin/env bash

SCRIPT_PATH="$(realpath "$0")"
ROOT_DIR="$(dirname "$SCRIPT_PATH")"

BACKGROUND_IMAGE="$ROOT_DIR/base/background.png"
VARIANT_NAME=$1
INPUT_SVG="$ROOT_DIR/base/$1.svg"

if [ -z "$VARIANT_NAME" ]; then
  echo "Usage: $0 <variant-name>"
  exit 1
fi

if [ ! -f "$INPUT_SVG" ]; then
  echo "Error: SVG file '$INPUT_SVG' not found."
  exit 1
fi

OUTPUT_DIR="$VARIANT_NAME/1024x"

echo "==> Generating $VARIANT_NAME icons..."

mkdir -p "$OUTPUT_DIR/inverted"

echo "==> Rendering SVG to PNG..."

inkscape "$INPUT_SVG" -w 1024 -o "$OUTPUT_DIR/black.png"

echo "==> Creating white and color variants..."

convert "$OUTPUT_DIR/black.png" -negate "$OUTPUT_DIR/white.png"
convert "$BACKGROUND_IMAGE" '(' "$OUTPUT_DIR/black.png" -alpha extract ')' -compose CopyOpacity -composite "$OUTPUT_DIR/color.png"

echo "==> Creating inverted variants..."

convert -size 1024x1024 "$BACKGROUND_IMAGE" '(' "$OUTPUT_DIR/black.png" -alpha extract -negate ')' -compose CopyOpacity -composite "$OUTPUT_DIR/inverted/color.png"
convert -size 1024x1024 "xc:white" '(' "$OUTPUT_DIR/black.png" -alpha extract -negate ')' -compose CopyOpacity -composite "$OUTPUT_DIR/inverted/white.png"
convert -size 1024x1024 "xc:black" '(' "$OUTPUT_DIR/black.png" -alpha extract -negate ')' -compose CopyOpacity -composite "$OUTPUT_DIR/inverted/black.png"


BASE_DIR="$VARIANT_NAME"
SOURCE_DIR="${BASE_DIR}/1024x"
SIZES=(512 256 128 64 32 16)

for SIZE in "${SIZES[@]}"; do
    DEST_DIR="${BASE_DIR}/${SIZE}x"

    echo "==> Generating ${SIZE}px..."

    find "$SOURCE_DIR" -type f -name "*.png" | while read -r FILE; do
        REL_PATH="${FILE#$SOURCE_DIR/}"
        OUT_FILE="$DEST_DIR/$REL_PATH"

        mkdir -p "$(dirname "$OUT_FILE")"

        convert "$FILE" -filter Lanczos -resize ${SIZE}x${SIZE} "$OUT_FILE"
    done
done

echo "==> Finished"
