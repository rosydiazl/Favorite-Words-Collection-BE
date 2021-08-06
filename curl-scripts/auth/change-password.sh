#!/bin/bash
# TOKEN="bf371720251ca569fa95d303fbf400fb" OLDPW="hello" NEWPW="goodbye" sh curl-scripts/auth/change-password.sh 

API="http://localhost:4741"
URL_PATH="/change-password"

curl "${API}${URL_PATH}/" \
  --include \
  --request PATCH \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "'"${OLDPW}"'",
      "new": "'"${NEWPW}"'"
    }
  }'

echo
