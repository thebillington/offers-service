#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT}/dist"

mkdir -p "${OUT_DIR}"

npx esbuild "${ROOT}/src/handler.ts" \
  --bundle \
  --platform=node \
  --target=node20 \
  --format=cjs \
  --outfile="${OUT_DIR}/index.js"

if [ "${LOCAL_SAM:-0}" = "1" ] && [ -f "${ROOT}/.env" ]; then
  cp "${ROOT}/.env" "${OUT_DIR}/.env"
fi

if [ "${LOCAL_SAM:-0}" = "1" ] && [ -f "${OUT_DIR}/.env" ]; then
  (cd "${OUT_DIR}" && zip -q function.zip index.js .env)
else
  (cd "${OUT_DIR}" && zip -q function.zip index.js)
fi

echo "Built ${OUT_DIR}/function.zip"
