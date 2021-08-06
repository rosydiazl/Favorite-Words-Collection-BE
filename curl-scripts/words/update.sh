#!/bin/bash

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
