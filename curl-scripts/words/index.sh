#!/bin/sh

# TOKEN="d4b387d44b1424ea42fcfce42f67b39c" sh curl-scripts/words/index.sh

API="http://localhost:4741"
URL_PATH="/words"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
