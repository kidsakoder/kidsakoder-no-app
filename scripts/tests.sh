#!/bin/bash
source scripts/env.sh
export COMPOSE_PROJECT_NAME="$PROJECTNAME"

echo "Running tests ..."

pushd enonic-server
docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm tests
popd
