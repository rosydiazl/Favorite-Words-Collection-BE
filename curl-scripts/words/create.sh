#!/bin/bash
# TOKEN="6e8b4bb58556ac8b89ce84bc8d22187e" WORD="hello" DEFINITION="greeting" ORIGIN="Latin" LANGUAGE="English" SENTENCE="Hello, friend" sh curl-scripts/words/create.sh 

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
