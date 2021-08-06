#!/bin/bash
# TOKEN="d4b387d44b1424ea42fcfce42f67b39c" ID="610d46b18a8eec80673c78a5" WORD="adios" DEFINITION="despedirse" ORIGIN="latin" LANGUAGE="espanol" SENTENCE="adios" sh curl-scripts/words/update.sh 

API="http://localhost:4741"
URL_PATH="/words"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
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
