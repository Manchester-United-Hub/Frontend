#!/usr/bin/env bash
# Scan changed files for common code smells and red flags.
# Usage:
#   bash find-issues.sh              → scan staged + unstaged vs HEAD
#   bash find-issues.sh <branch>     → scan branch diff vs main

set -euo pipefail

TARGET="${1:-}"
FOUND=0

# Collect list of changed files
if [[ -n "$TARGET" ]]; then
  FILES=$(git diff --name-only "main...${TARGET}" 2>/dev/null || true)
else
  FILES=$(git diff --name-only HEAD 2>/dev/null || true)
  STAGED=$(git diff --cached --name-only 2>/dev/null || true)
  FILES=$(echo -e "${FILES}\n${STAGED}" | sort -u | grep -v '^$' || true)
fi

if [[ -z "$FILES" ]]; then
  echo "No changed files found."
  exit 0
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Code Review — Issue Scanner"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Scanning $(echo "$FILES" | wc -l | tr -d ' ') file(s)..."
echo ""

flag() {
  local severity="$1"   # CRIT | WARN | INFO
  local file="$2"
  local line="$3"
  local msg="$4"
  case "$severity" in
    CRIT) prefix="[CRITICAL]" ;;
    WARN) prefix="[ WARN   ]" ;;
    *)    prefix="[ INFO   ]" ;;
  esac
  printf "%s  %s:%s\n          %s\n\n" "$prefix" "$file" "$line" "$msg"
  FOUND=$((FOUND + 1))
}

scan_file() {
  local f="$1"
  [[ -f "$f" ]] || return

  # Skip binary, lock, generated files
  case "$f" in
    *.png|*.jpg|*.jpeg|*.gif|*.svg|*.ico|*.woff*|*.ttf|*.eot) return ;;
    package-lock.json|yarn.lock|pnpm-lock.yaml) return ;;
    *.min.js|*.min.css) return ;;
  esac

  local lineno=0
  while IFS= read -r line; do
    lineno=$((lineno + 1))

    # ── Secrets / credentials ─────────────────────────────────────────────
    if echo "$line" | grep -qiE '(api_key|secret_key|private_key|password|passwd|token)\s*[:=]\s*["\x27][^"\x27]{8,}'; then
      flag CRIT "$f" "$lineno" "Possible hardcoded secret: $line"
    fi

    # AWS key pattern
    if echo "$line" | grep -qE 'AKIA[0-9A-Z]{16}'; then
      flag CRIT "$f" "$lineno" "AWS access key ID detected"
    fi

    # ── console.log / debugger ────────────────────────────────────────────
    if echo "$line" | grep -qE 'console\.(log|warn|error|debug|info)\('; then
      flag WARN "$f" "$lineno" "console statement — remove before committing: $line"
    fi
    if echo "$line" | grep -qE '^\s*debugger\s*;?\s*$'; then
      flag WARN "$f" "$lineno" "debugger statement left in code"
    fi

    # ── TypeScript red flags ──────────────────────────────────────────────
    if echo "$line" | grep -qE ':\s*any\b|as\s+any\b'; then
      flag WARN "$f" "$lineno" "Untyped 'any' — verify it's justified: $line"
    fi
    if echo "$line" | grep -qE '\!\.' && ! echo "$line" | grep -qE '^\s*//'; then
      flag WARN "$f" "$lineno" "Non-null assertion (!) — verify assumption: $line"
    fi

    # ── TODO / FIXME / HACK ───────────────────────────────────────────────
    if echo "$line" | grep -qiE '\b(TODO|FIXME|HACK|XXX)\b'; then
      flag INFO "$f" "$lineno" "Unresolved marker: $line"
    fi

    # ── React / Next.js ───────────────────────────────────────────────────
    if echo "$line" | grep -qE 'dangerouslySetInnerHTML'; then
      flag CRIT "$f" "$lineno" "dangerouslySetInnerHTML — verify source is sanitized: $line"
    fi
    if echo "$line" | grep -qE '\beval\s*\('; then
      flag CRIT "$f" "$lineno" "eval() detected — potential code injection: $line"
    fi
    if echo "$line" | grep -qE '\.innerHTML\s*='; then
      flag CRIT "$f" "$lineno" "innerHTML assignment — XSS risk if value is user-supplied: $line"
    fi
    if echo "$line" | grep -qE 'useEffect\s*\(\s*async'; then
      flag WARN "$f" "$lineno" "async useEffect — use an inner async fn instead: $line"
    fi

    # ── Next.js env vars ──────────────────────────────────────────────────
    if echo "$line" | grep -qE 'process\.env\.[A-Z_]+' && ! echo "$line" | grep -qE 'process\.env\.NEXT_PUBLIC_'; then
      if echo "$f" | grep -qE '\.(tsx|jsx)$' && echo "$line" | grep -qvE '^\s*//'; then
        flag WARN "$f" "$lineno" "Non-public env var in TSX — ensure this is a Server Component: $line"
      fi
    fi

    # ── Docker / CI secrets ───────────────────────────────────────────────
    if echo "$f" | grep -qE '(Dockerfile|\.github/workflows/)'; then
      if echo "$line" | grep -qiE '(api_key|secret|token|password)\s*=\s*[^$\{]'; then
        flag CRIT "$f" "$lineno" "Possible secret in CI/Docker file — use secrets manager: $line"
      fi
      if echo "$line" | grep -qE '\$\{\{\s*github\.event\.' && echo "$line" | grep -qE '^\s+run:'; then
        flag CRIT "$f" "$lineno" "GitHub Actions script injection risk — pass via env: instead: $line"
      fi
    fi

  done < "$f"
}

echo "$FILES" | while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  scan_file "$f"
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ "$FOUND" -eq 0 ]]; then
  echo "  No automatic issues found."
else
  printf "  %d issue(s) flagged. Verify each — scanner finds leads, not guaranteed bugs.\n" "$FOUND"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
