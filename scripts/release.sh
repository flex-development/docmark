#!/bin/sh

set -e

# Local Release Workflow
#
# References:
#
# - https://git-scm.com/docs/git-commit

if [[ -z $* ]]; then
  echo "[ERROR] missing release tag or version."
  exit 1
fi

if compgen -G .yarn/versions/*.yml >/dev/null; then
  echo "[READY] version manifest found."
else
  echo "[ERROR] missing version manifest."
  exit 1
fi

git commit -S -s -m "release(chore): $@"
