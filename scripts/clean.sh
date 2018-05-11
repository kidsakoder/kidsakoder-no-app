#!/bin/bash
echo "Removing Enonic XP Docker containers"

pushd enonic-server > /dev/null
docker-compose rm --force
popd > /dev/null

echo "Clearing node_modules and build folders"
DELETE_FOLDERS="code/build code/node_modules"

if [ $EUID != 0 ]; then
  for i in $DELETE_FOLDERS; do
    if [[ -n $i && $(stat -c %u $i) = 0 ]]; then
      echo "Need root permission to delete folder: $i"
      sudo "$0" "$@"
      if [ $? != 0 ]; then
        echo "Failed to login as root"
        exit $?
      fi
    fi
  done
fi

rm -rf $DELETE_FOLDERS

echo "Done!"
