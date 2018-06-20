#!/bin/sh

DIRECTORY="<%= dest.replace(/\/$/, "") %>"
BRANCH="dist/frontend"
CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

# Check if the environment is ready for publishing ===========================
if [ "$CURRENT_BRANCH" != "master" ]
then
    echo "⚠️  Please run this script from master branch"
    exit 1;
fi

if [[ $(git status -s) ]]
then
    echo "⚠️  The working directory is dirty. Please commit any pending changes."
    exit 1;
fi

if [ $2 ]
then
  npm whoami || { echo "⚠️  You must be logged in to NPM to push a new release" ; exit 1; }
fi

jq --version || { echo "⚠️  You have jq installed on your machine (brew install jq)" ; exit 1; }

# Proceed =====================================================================
echo "rebuild frontend assets"
yarn build

echo "update package.json version to $1 and write a copy for publishing"
npm version $1
cp package.json $DIRECTORY/package.json
jq -e ".dependencies = {} | .devDependencies = {}" $DIRECTORY/package.json > $DIRECTORY/package.json.tmp && cp $DIRECTORY/package.json.tmp $DIRECTORY/package.json && rm $DIRECTORY/package.json.tmp

echo "backup dist content"
mkdir "$DIRECTORY-tmp"
cp -r $DIRECTORY/* "$DIRECTORY-tmp/"

echo "Deleting dist"
rm -rf $DIRECTORY
mkdir $DIRECTORY
git worktree prune
rm -rf .git/worktrees/$DIRECTORY/

echo "Checking out $BRANCH branch into dist"
git worktree add -B $BRANCH $DIRECTORY

echo "Removing existing files"
rm -rf $DIRECTORY/*

echo "Generating dist using the backup"
cp -r "$DIRECTORY-tmp"/* $DIRECTORY/
rm -rf "$DIRECTORY-tmp"

echo "Updating $BRANCH branch"
if [ $2 ]
then
  cd $DIRECTORY && git add --all && git commit -m "Publishing to $BRANCH (publish.sh)"
  git push --force origin $BRANCH --tags && npm publish
else
  cd $DIRECTORY && git add --all && git commit -m "Publishing to $BRANCH (publish.sh)"
  git push --force origin $BRANCH --tags
fi
