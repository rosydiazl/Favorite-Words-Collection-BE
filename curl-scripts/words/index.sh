#!/bin/sh

# TOKEN="d52fbcae148c1460a30037bfa9f3f106" sh curl-scripts/words/index.sh

API="http://localhost:4741"
URL_PATH="/words"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
