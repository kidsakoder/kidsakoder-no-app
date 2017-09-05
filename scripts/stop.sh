#!/bin/bash
source scripts/env.sh
export COMPOSE_PROJECT_NAME="$PROJECTNAME"

echo "Stopping Enonic XP Docker containers"

pushd enonic-server
docker-compose stop
popd
