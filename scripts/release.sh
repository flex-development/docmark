#!/bin/sh

set -e

# Local Release Workflow
#
# References:
#
# - https://git-scm.com/docs/git-commit
# - https://github.com/flex-development/grease
# - https://jqlang.github.io

yarn typecheck
yarn check:types
yarn test:cov
yarn build
yarn check:types:attw
git commit --allow-empty -S -s -m "release(chore): $@"
