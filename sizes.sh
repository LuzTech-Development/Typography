#!/usr/bin/env bash

BASE_DIR="clean/1024x"
SIZES=(512 256 128 64 32 16)

for SIZE in "${SIZES[@]}"; do
  DEST_DIR="${BASE_DIR}/${SIZE}x"

  echo "Gerando tamanho ${SIZE}px..."

  # Percorre todos os PNGs mantendo estrutura
  find "$BASE_DIR" -type f -name "*.png" | while read -r FILE; do
    REL_PATH="${FILE#$BASE_DIR/}"
    OUT_FILE="$DEST_DIR/$REL_PATH"

    mkdir -p "$(dirname "$OUT_FILE")"

    magick "$FILE" -resize ${SIZE}x${SIZE} "$OUT_FILE"
  done
done

echo "Finalizado."