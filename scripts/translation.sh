#!/bin/bash

if [ -z "$1" ]; then
  echo
  echo "Usage: $0 <output_language_code>"
  exit 1
fi

# AI engine and model to use
ENGINE="gemini"
MODEL="gemini-2.0-flash"
# API key
GOOGLE_AI_STUDIO_API_KEY=$(grep '^GOOGLE_AI_STUDIO_API_KEY=' .env | cut -d '=' -f2-)

if [ -z "$GOOGLE_AI_STUDIO_API_KEY" ]; then
  echo
  echo "Error: GOOGLE_AI_STUDIO_API_KEY is not set in .env"
  exit 1
fi

# directory where the <locale>.json files are located
LOCALES_DIR="./app/locales"
# default language resource
DEFAULT_LANG="en"
# language to translate to
OUTPUT_LANG="$1"

echo
echo "⌛ Translating to "$OUTPUT_LANG.json" from "$DEFAULT_LANG.json" with gemini-2.0-flash:"
echo

# see: https://github.com/taahamahdi/i18n-ai-translate
NODE_OPTIONS="--no-deprecation" \
  npx i18n-ai-translate translate \
  -i $LOCALES_DIR/$DEFAULT_LANG.json \
  -o $OUTPUT_LANG \
  --engine $ENGINE \
  --model $MODEL \
  --api-key=$GOOGLE_AI_STUDIO_API_KEY

echo
echo "✅ Translations to "$OUTPUT_LANG.json" finished."
echo