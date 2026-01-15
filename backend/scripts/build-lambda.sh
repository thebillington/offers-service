#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT}/dist"
CA_FILENAME="rds-ca-bundle.pem"
CA_SOURCE="${ROOT}/assets/${CA_FILENAME}"

mkdir -p "${OUT_DIR}"

npx esbuild "${ROOT}/src/handler.ts" \
  --bundle \
  --platform=node \
  --target=node20 \
  --format=cjs \
  --outfile="${OUT_DIR}/index.js"

if [ "${LOCAL_SAM:-0}" = "1" ]; then
  if [ "${CI:-0}" != "0" ]; then
    echo "Refusing to package .env in CI. Unset LOCAL_SAM or CI to continue." >&2
    exit 1
  fi

  if [ -f "${ROOT}/.env" ]; then
    cp "${ROOT}/.env" "${OUT_DIR}/.env"
  fi
fi

if [ -f "${CA_SOURCE}" ]; then
  cp "${CA_SOURCE}" "${OUT_DIR}/${CA_FILENAME}"
fi

zip_items=("index.js")
if [ -f "${OUT_DIR}/.env" ]; then
  zip_items+=(".env")
fi
if [ -f "${OUT_DIR}/${CA_FILENAME}" ]; then
  zip_items+=("${CA_FILENAME}")
fi
(cd "${OUT_DIR}" && zip -q function.zip "${zip_items[@]}")

echo "Built ${OUT_DIR}/function.zip"
