#!/bin/sh
# TOKEN="d4b387d44b1424ea42fcfce42f67b39c" ID="610c6005ca64137151924db4" sh curl-scripts/words/show.sh 

API="http://localhost:4741"
URL_PATH="/words"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
