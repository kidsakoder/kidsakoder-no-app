#!/bin/bash
echo "Removing Enonic XP Docker containers"

pushd enonic-server > /dev/null
docker-compose rm --force
popd > /dev/null

DELETE_FOLDERS="code/build code/node_modules"
echo "Clearing $DELETE_FOLDERS"

if [ $EUID != 0 ]; then
  for i in $DELETE_FOLDERS; do
    if [ -d $i ]; then
      if [[ $(stat -c %u $i) = 0 ]]; then
        echo "Need root permission to delete folder: $i"
        sudo rm -rf $i
        if [ $? != 0 ]; then
          echo "Failed to login as root"
          exit $?
        fi
      else
        rm -rf $i
      fi
    fi
  done
else
  sudo rm -rf $DELETE_FOLDERS
fi

echo "Done!"
