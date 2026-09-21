#!/usr/bin/env bash
set -euo pipefail

# This is a script to verify there are now raw hex codes or uswds tokens in the individual component styling

ignore_file=".lintstylesignore"
files=$(find src -type f \( -name '*.astro' -o -name '*.scss' -o -name '*.css' \))

if [[ -f "$ignore_file" ]]; then
  while IFS= read -r ignored; do
    [[ -z "$ignored" ]] && continue
    files=$(printf '%s
' "$files" | grep -v "$ignored" || true)
  done < "$ignore_file"
fi

component_files=$(printf '%s
' "$files" | grep -E 'src/components/.*\.astro$' || true)

if printf '%s
' "$component_files" | xargs -I{} rg -n --no-heading --color never -- '--uswds-' {} 2>/dev/null; then
  echo 'Direct --uswds-* usage found in component styles.'
  exit 1
fi

if printf '%s
' "$component_files" | xargs -I{} rg -n --no-heading --color never '#[0-9a-fA-F]{3,8}' {} 2>/dev/null; then
  echo 'Raw hex literals found in component files.'
  exit 1
fi

echo 'Style lint passed.'