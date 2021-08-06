#!/bin/bash
# TOKEN="d4b387d44b1424ea42fcfce42f67b39c" WORD="hola" DEFINITION="saludar" ORIGIN="latin" LANGUAGE="espanol" SENTENCE="hola" sh curl-scripts/words/create.sh 

API="http://localhost:4741"
URL_PATH="/words"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "word": {
      "word": "'"${WORD}"'",
      "definition": "'"${DEFINITION}"'",
      "origin": "'"${ORIGIN}"'",
      "language": "'"${LANGUAGE}"'",
      "sentence": "'"${SENTENCE}"'"
    }
  }'

echo
