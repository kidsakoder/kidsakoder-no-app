#!/bin/bash
pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd "$@" > /dev/null
}

echo "Creating new Enonic XP project"

echo "Enter project name (no spaces) and press [ENTER]:"
read PROJECTNAME

if [ -z "$PROJECTNAME" ]; then
  echo "Error: No project name entered"
  exit 1
fi
if [ -d "$PROJECTNAME" ]; then
  echo "Error: Project name in use"
  exit 1
fi

echo "Creating project directory $PROJECTNAME in current directory"
mkdir $PROJECTNAME

git clone https://git.bouvet.no/scm/exm/enonic-xp-vanilla-starter.git $PROJECTNAME

# Delete connection to starter project git repository
rm -rf $PROJECTNAME/.git

pushd $PROJECTNAME
BASEDIR=$(pwd)
CODEDIR=$BASEDIR/code

echo "PROJECTNAME=$PROJECTNAME" > $BASEDIR/scripts/env.sh
echo "Project environment variables added to scripts/env.sh"

echo "Generating .gitignore"
curl -L -s "https://www.gitignore.io/api/linux%2Cosx%2Cjava%2Cnode%2Csass%2Cjetbrains%2Csublimetext" >> .gitignore
cat scripts/resources/gitignore.src >> .gitignore

echo "Creating Enonic XP server Docker application from template"
mkdir enonic-server

git clone https://github.com/enonic-cloud/docker-compose-enonic-xp.git enonic-server
rm -rf enonic-server/.git

pushd enonic-server
echo "--------------------------------------------------------------"
echo "Initializing local git repository for project Enonic XP server"
git init
echo "/docker-compose.dev.yml" >> .gitignore

pushd exp
echo "Adding Java command line options to server Dockerfile"
sed 's/.*FROM.*/&\
ENV JAVA_OPTS "-Xms2048M -Xmx2048M -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=60 -XX:+ScavengeBeforeFullGC -XX:+CMSScavengeBeforeRemark -Djsse.enableSNIExtension=true"/' Dockerfile > Dockerfile_new
rm Dockerfile
mv Dockerfile_new Dockerfile
popd

echo "Configuring Enonic XP server for localhost"
./configure.sh localhost

git add .

echo "Enter URL for remote git repository for the project's Enonic XP server *DOCKER CONTAINER* (if you leave this empty, you can set remote later) and press [ENTER]:"
read ENONIC_REMOTE

if [ -n "$ENONIC_REMOTE" ]; then
  git remote add origin $ENONIC_REMOTE
  echo "ENONIC_REMOTE=$ENONIC_REMOTE" >> $BASEDIR/scripts/env.sh
  echo "Remote repository for Enonic XP server added, and added to scripts/env.sh"
else
  echo "No remote entered. You can add one later by doing:"
  echo "  cd $PROJECTNAME/enonic-server"
  echo "  git remote add origin [URL]"
  echo "Important: You will also have to enter the repository URL manually in scripts/env.sh:"
  echo '  $ENONIC_REMOTE=[Remote git URL]'
fi

echo ""
popd

# Remove project setup scripts
rm -rf code/scripts/setup

echo "---------------------------------------------"
echo "Initializing local git repository for project"
git init
git add .

echo "Enter URL for remote git repository for project *APPLICATION* (if you leave this empty, you can set remote later) and press [ENTER]:"
read APP_REMOTE

if [ -n "$APP_REMOTE" ]; then
  git remote add origin $APP_REMOTE
  echo "Remote repository for project added."
else
  echo "No remote entered. You can add one later by doing:"
  echo "  cd $PROJECTNAME"
  echo "  git remote add origin [URL]"
fi

popd
echo ""
echo "============================================================================================="
echo "Project setup for '$PROJECTNAME' is finished."
echo "Please inspect the generated project files before pushing them to remote:"
echo "  cd $PROJECTNAME"
echo "  git commit -am \"Initial project setup\""
echo "  git push origin master"
echo "  cd enonic-server"
echo "  git commit -am \"Initial project setup\""
echo "  git push origin master"


#
# TODO
# - kopiere over readme.md template for prosjekt
# - legge inn prosjektinfo i gradle.properties
# - legge inn prosjektinfo i package.json
#
