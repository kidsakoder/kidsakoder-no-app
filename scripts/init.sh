#!/bin/bash

source scripts/env.sh

echo $ENONIC_REMOTE

if [ -d "$ENONIC_REMOTE" ]; then
  echo "It would seem this project is already set up, because the '$ENONIC_REMOTE' directory exists."
  exit 1
fi

if [ -n "$ENONIC_REMOTE" ]; then
  echo "Cloning Enonic XP server repository into enonic-server/ ..."
  git clone $ENONIC_REMOTE enonic-server
else
  echo "This project has not been correctly set up. You will have to enter the Enonic XP server repository URL manually in scripts/env.sh:"
  echo '  $ENONIC_REMOTE=[Remote git URL]'
  exit 1
fi

echo "Setting up local development environment for project..."

BASEDIR=$(pwd)
CODEDIR=$BASEDIR/code/

echo "Adding local development environment settings for docker-compose..."
sed "s#{{CODEDIR}}#$CODEDIR#g ; s#{{PROJECTNAME}}#$PROJECTNAME#g" scripts/templates/docker-compose.dev.yml.src > enonic-server/docker-compose.dev.yml

echo "Done."
