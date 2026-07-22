#!/usr/bin/env bash

trap "exit" SIGINT

SCRIPT_PATH="$(dirname "$(realpath "$0")")"
ROOT_DIR="$(dirname "$SCRIPT_PATH")"
VARIANTS=("$@")
ALL_VARIANTS="false"


echo "==> Generating icons for variants: ${VARIANTS[*]:-<all>}"

rm -rf "$ROOT_DIR/out"

if ((${#VARIANTS[@]} <= 0)); then
    VARIANTS=($(ls $ROOT_DIR/icons/*.svg))
    ALL_VARIANTS="true"
fi

for file in "${VARIANTS[@]}"; do
    VARIANT_NAME=$(basename "${file%.*}")

    if [[ ! -f "$ROOT_DIR/icons/$VARIANT_NAME.svg" ]]; then
        echo "File not found: $file"
        exit 1
    fi

    bash "$SCRIPT_PATH/generate_outlined_svg.sh" "$VARIANT_NAME"
    bash "$SCRIPT_PATH/generate_pngs.sh" "$VARIANT_NAME"
    bash "$SCRIPT_PATH/generate_sizes.sh" "$VARIANT_NAME"
done

bash "$SCRIPT_PATH/generate_iconsheet.sh" "${VARIANTS[@]}"

echo "==> Finished"
