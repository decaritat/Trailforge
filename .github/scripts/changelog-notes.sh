#!/usr/bin/env bash
# Prints the Changelog.md section of the given version (e.g. 0.2.0).
# Exits with an error if the section is missing or empty.
set -euo pipefail
version="$1"
notes=$(awk -v v="$version" '
  /^## \[/ { if (found) exit; if (index($0, "## [" v "]") == 1) { found = 1; next } }
  found { print }
' Changelog.md | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}')
if [[ -z "${notes//[[:space:]]/}" ]]; then
  echo "::error::Changelog.md has no non-empty section '## [$version]'" >&2
  exit 1
fi
printf '%s\n' "$notes"
