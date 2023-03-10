#!/usr/bin/env bash

SCRIPT_PATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

PACKAGE_JSON_PATH="$SCRIPT_PATH/../package.json"

yarn version patch
yarn build:prod --stats=none

RELEASE_VERSION=$(jq --slurpfile package "$PACKAGE_JSON_PATH" -n '$package[0].version' | tr -d '"')

export RELEASE_VERSION

echo "Creating release $RELEASE_VERSION"

# Create release directory
(cd module && zip -r "../releases/release-v$RELEASE_VERSION.zip" .)

# Generate CHANGELOG.md
yarn conventional-changelog -p conventionalcommits -i CHANGELOG.md -s -r 0

# Format CHANGELOG.md
yarn prettier --write CHANGELOG.md

# Add CHANGELOG.md to git
git add CHANGELOG.md
git add package.json
git add module/module.json

# Commit CHANGELOG.md
HUSKY=0 git commit -m "release: v$RELEASE_VERSION"

# tag release
git tag -a "v$RELEASE_VERSION" -m "Release v$RELEASE_VERSION"
