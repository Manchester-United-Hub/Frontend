#!/usr/bin/env bash
# Summarize the current git diff scope for code review.
# Usage:
#   bash diff-summary.sh              → staged + unstaged vs HEAD
#   bash diff-summary.sh <branch>     → commits on branch vs main
#   bash diff-summary.sh --pr <num>   → PR diff via gh CLI

set -euo pipefail

TARGET="${1:-}"
PR_NUM=""

if [[ "$TARGET" == "--pr" ]]; then
  PR_NUM="${2:-}"
  if [[ -z "$PR_NUM" ]]; then
    echo "Usage: diff-summary.sh --pr <pr-number>" >&2
    exit 1
  fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Code Review — Diff Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Branch / PR mode ──────────────────────────────────────────────────────────
if [[ -n "$PR_NUM" ]]; then
  if ! command -v gh &>/dev/null; then
    echo "Error: gh CLI not installed. Install with: brew install gh" >&2
    exit 1
  fi
  echo "PR #${PR_NUM}"
  echo ""
  gh pr view "$PR_NUM" --json title,author,baseRefName,headRefName \
    --template '  Title : {{.title}}
  Author: {{.author.login}}
  Base  : {{.baseRefName}}
  Head  : {{.headRefName}}
'
  echo ""
  echo "Changed files:"
  gh pr diff "$PR_NUM" --name-only | sort | while read -r f; do
    printf "  %s\n" "$f"
  done
  echo ""
  echo "Diff stat:"
  gh pr diff "$PR_NUM" | git apply --stat --cached - 2>/dev/null || \
    gh pr diff "$PR_NUM" | grep -E '^\+\+\+|^---' | grep -v '^--- /dev/null' | \
    sed 's|^+++ b/||;s|^--- a/||' | sort -u | while read -r f; do printf "  %s\n" "$f"; done
  exit 0
fi

# ── Branch mode ──────────────────────────────────────────────────────────────
if [[ -n "$TARGET" ]]; then
  BASE="main"
  echo "Branch: ${TARGET}  (vs ${BASE})"
  echo ""
  echo "Commits:"
  git log "${BASE}..${TARGET}" --oneline | sed 's/^/  /'
  echo ""
  echo "Changed files:"
  git diff --name-only "${BASE}...${TARGET}" | sort | sed 's/^/  /'
  echo ""
  echo "Diff stat:"
  git diff --stat "${BASE}...${TARGET}" | tail -n1 | sed 's/^/  /'
  exit 0
fi

# ── Default: local changes vs HEAD ───────────────────────────────────────────
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
echo "Branch : ${BRANCH}"
echo "Status : local changes vs HEAD"
echo ""

echo "Recent commits:"
git log --oneline -5 | sed 's/^/  /'
echo ""

STAGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
UNSTAGED=$(git diff --name-only | wc -l | tr -d ' ')
UNTRACKED=$(git ls-files --others --exclude-standard | wc -l | tr -d ' ')

echo "Change counts:"
printf "  Staged   : %s file(s)\n" "$STAGED"
printf "  Unstaged : %s file(s)\n" "$UNSTAGED"
printf "  Untracked: %s file(s)\n" "$UNTRACKED"
echo ""

if [[ "$STAGED" -gt 0 ]]; then
  echo "Staged files:"
  git diff --cached --name-status | sed 's/^/  /'
  echo ""
fi

if [[ "$UNSTAGED" -gt 0 ]]; then
  echo "Unstaged files:"
  git diff --name-status | sed 's/^/  /'
  echo ""
fi

if [[ "$UNTRACKED" -gt 0 ]]; then
  echo "Untracked files:"
  git ls-files --others --exclude-standard | sed 's/^/  /'
  echo ""
fi

echo "Diff stat (staged + unstaged):"
git diff HEAD --stat 2>/dev/null | tail -n1 | sed 's/^/  /'
if [[ "$STAGED" -gt 0 && "$UNSTAGED" -eq 0 ]]; then
  git diff --cached --stat | tail -n1 | sed 's/^/  /'
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
