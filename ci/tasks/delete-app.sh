#!/bin/bash

set -e

cf api $CF_API
cf auth

cf t -o $CF_ORG -s $CF_SPACE

# Delete the preview app
cf delete -f $CF_APP_NAME

# Delete preview app route
cf delete-route -f app.cloud.gov --hostname $HOSTNAME

# A function to query the s3 credentials from the cf service instance
setCFAWSS3 () {
	SERVICE_INSTANCE_NAME="$1"
	KEY_NAME="$SERVICE_INSTANCE_NAME-key"

	S3_CREDENTIALS=`cf service-key $SERVICE_INSTANCE_NAME $KEY_NAME | tail -n +2 | jq -r .credentials`
	export AWS_ACCESS_KEY_ID=`echo "$S3_CREDENTIALS" | jq -r .access_key_id`
	export AWS_SECRET_ACCESS_KEY=`echo "$S3_CREDENTIALS" | jq -r .secret_access_key`
	export BUCKET_NAME=`echo "$S3_CREDENTIALS" | jq -r .bucket`
	export AWS_DEFAULT_REGION=`echo "$S3_CREDENTIALS" | jq -r '.region'`
}

# Get the S3 credentials
setCFAWSS3 $S3_SERVICE_INSTANCE_NAME

# Delete the site config from the S3 bucket
aws s3 rm s3://$BUCKET_NAME/$S3_SITE_CONFIG_KEY
