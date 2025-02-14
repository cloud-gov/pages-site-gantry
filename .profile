export PAYLOAD_API_KEY="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.PAYLOAD_API_KEY")"
export OAUTH_CLIENT_ID="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.OAUTH_CLIENT_ID")"
export OAUTH_CLIENT_SECRET="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.OAUTH_CLIENT_SECRET")"
