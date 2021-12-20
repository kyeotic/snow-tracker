#!/bin/bash

set -e

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${_dir}/../.env"

DELIM=$'\n------\n'

echo "Base64 Encoded .env file (Use for GitHub secret env_config) $DELIM"
cat "${_dir}/../.env" | base64
echo "$DELIM"