#!/bin/bash -eu

# Helper script for triggering deployment pipeline from espoon-voltti/hoivakoti-infra

curl -u ${CIRCLECI_TOKEN}: -X POST --fail --header "Content-Type: application/json" -d "{
  \"parameters\": {
    \"frontend_version\": \"${CIRCLE_SHA1}\",
    \"service_version\": \"${CIRCLE_SHA1}\"
  }
}" https://circleci.com/api/v2/project/github/espoon-voltti/hoivakoti-infra/pipeline
