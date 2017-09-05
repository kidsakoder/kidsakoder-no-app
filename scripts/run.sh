#!/bin/bash
source scripts/env.sh
export COMPOSE_PROJECT_NAME="$PROJECTNAME"

echo "Building and running Enonic XP Docker container"

pushd enonic-server

docker-compose build
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --no-deps -d
popd
