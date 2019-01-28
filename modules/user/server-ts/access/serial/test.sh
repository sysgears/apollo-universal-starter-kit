#!/bin/bash
set -euo pipefail

URL="http://localhost:8080/graphql"
KEY="admin-123"

curl -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $KEY" \
    -d @data.json \
    "$URL"

