echo "running .profile"
pushd tts.gsa.gov
npm ci
ls node_modules
npm run build
popd

export PAYLOAD_ADMIN_USERNAME="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "payload-secret" ".[][] | select(.name == \$service_name) | .credentials.PAYLOAD_ADMIN_USERNAME")"
export PAYLOAD_ADMIN_PASSWORD="$(echo "$VCAP_SERVICES" | jq --raw-output --arg service_name "payload-secret" ".[][] | select(.name == \$service_name) | .credentials.PAYLOAD_ADMIN_PASSWORD")"

