#!/usr/bin/env bash

BASE_DIR="out/$1"
SOURCE_DIR="${BASE_DIR}/1024x"
SIZES=(512 256 128 64 32 16)

echo "==> Generating sizes for $1 variant..."

for SIZE in "${SIZES[@]}"; do
    DEST_DIR="${BASE_DIR}/${SIZE}x"

    echo "==> Generating ${SIZE}px..."

    find "$SOURCE_DIR" -type f -name "*.png" | while read -r FILE; do
        REL_PATH="${FILE#$SOURCE_DIR/}"
        OUT_FILE="$DEST_DIR/$REL_PATH"

        mkdir -p "$(dirname "$OUT_FILE")"

        magick "$FILE" -filter Lanczos -resize ${SIZE}x${SIZE} "$OUT_FILE"
    done
done