#!/bin/bash
# ID="610c380df85382670666a87b" TOKEN="dbe59dd7f551e5460a55a4a1211b2f71" sh curl-scripts/auth/sign-out.sh 

API="http://localhost:4741"
URL_PATH="/sign-out"

curl "${API}${URL_PATH}/" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
