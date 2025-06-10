#!/bin/bash

# list of language codes
languages=("de" "fr" "es" "it" "pt" "ru" "zh" "ja")

# path to the neighbouring translate.sh script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRANSLATE_SH="$SCRIPT_DIR/translation.sh"

for lang in "${languages[@]}"; do
  "$TRANSLATE_SH" "$lang"
done
