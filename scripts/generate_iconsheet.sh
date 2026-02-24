SCRIPT_PATH="$(dirname "$(realpath "$0")")"
ROOT_DIR="$(dirname "$SCRIPT_PATH")"

VARIANTS=("$@")
OUT_FILE="$ROOT_DIR/out/ICONSHEET.md"

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

ifmd generate --template grid "$OUT_FILE" > /dev/null

rm -rf "$OUT_FILE"