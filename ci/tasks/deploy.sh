#!/bin/bash

set -e

cf api $CF_API
cf auth

cf t -o $CF_ORG -s $CF_SPACE

# Get app guid
app_guid=`cf app $CF_APP_NAME --guid`

# Clear buildpack cache
cf curl -X POST /v3/apps/$app_guid/actions/clear_buildpack_cache

# Deploy
cf push $CF_APP_NAME \
  --strategy rolling \
  --path $CF_PATH \
  --manifest $CF_MANIFEST \
  --vars-file $CF_VARS_FILE \
  --var site=$SITE \
  --var api_key=$API_KEY \
  --stack $CF_STACK
