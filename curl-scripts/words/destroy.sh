#!/bin/bash
# TOKEN="d4b387d44b1424ea42fcfce42f67b39c" ID="610d46b18a8eec80673c78a5" sh curl-scripts/words/destroy.sh 

API="http://localhost:4741"
URL_PATH="/words"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
