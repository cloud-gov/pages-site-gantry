export PAYLOAD_API_KEY="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "pages-editor-creds" ".[][] | select(.name == \$service_name) | .credentials.PAYLOAD_API_KEY")"

