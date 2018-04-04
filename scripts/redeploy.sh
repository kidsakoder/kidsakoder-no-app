#!/bin/bash
source scripts/env.sh
export COMPOSE_PROJECT_NAME="$PROJECTNAME"

echo "Rebuilding and redeploying Enonic XP Docker container"

pushd enonic-server
docker-compose build
docker-compose stop exp
docker-compose rm -f exp
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --no-deps -d exp
popd

if [[ ! $1 =~ ^(-q|--quiet)$ ]]; then
    docker logs -f kidsakoder-no
fi
