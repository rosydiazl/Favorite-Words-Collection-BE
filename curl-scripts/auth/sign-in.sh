#!/bin/bash
# ID="610c3794f85382670666a87a" EMAIL="newemail@emails.com" PASSWORD="hellol" sh curl-scripts/auth/sign-in.sh

API="http://localhost:4741"
URL_PATH="/sign-in"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "'"${EMAIL}"'",
      "password": "'"${PASSWORD}"'"
    }
  }'

echo
