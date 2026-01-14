#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v watchexec >/dev/null 2>&1; then
  echo "watchexec is required for dev watch. Install with: brew install watchexec"
  exit 1
fi

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-local}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-local}
export AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN:-local}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-us-east-1}

echo "Starting SAM API with rebuilds on change..."

SAM_ENV_PATH="${ROOT}/sam-env.json"

watchexec -r -e ts -- \
  "cd \"${ROOT}\" && LOCAL_SAM=1 yarn build && node scripts/generate-sam-env.js && sam local start-api --template template.yaml --env-vars \"${SAM_ENV_PATH}\""
