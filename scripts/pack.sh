#!/bin/sh

set -e

# pack
#
# Pack workspaces.
#
# References:
#
# - https://yarnpkg.com/cli/pack

for workspace in packages/*/; do
  cd ${workspace}
  mv CHANGELOG.md _CHANGELOG.md
  yarn pack --out ../../%s-%v.tgz
  mv _CHANGELOG.md CHANGELOG.md
  cd ../..
done
