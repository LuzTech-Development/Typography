#!/usr/bin/env bash

trap "exit" SIGINT

SCRIPT_PATH="$(dirname "$(realpath "$0")")"
ROOT_DIR="$(dirname "$SCRIPT_PATH")"
VARIANTS=("$@")


echo "==> Generating icons for variants: ${VARIANTS[*]:-<all>}"

if ((${#VARIANTS[@]} <= 0)); then
    VARIANTS=($(ls $ROOT_DIR/assets/*.svg))
fi

for file in "${VARIANTS[@]}"; do
    VARIANT_NAME=$(basename ${file%%.*})

    if [[ ! -f "$ROOT_DIR/assets/$VARIANT_NAME.svg" ]]; then
        echo "File not found: $file"
        exit 1
    fi

    bash "$SCRIPT_PATH/generate_pngs.sh" "$VARIANT_NAME"
    bash "$SCRIPT_PATH/generate_sizes.sh" "$VARIANT_NAME"
done

echo "==> Finished"
