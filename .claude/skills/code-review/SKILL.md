---
name: code-review
description: This skill should be used when the user asks to "review code", "review changes", "review PR", "review pull request", "check my changes", "audit the diff", "look for bugs", "find security issues", "check code quality", or wants feedback on correctness, security, or maintainability before committing or merging.
allowed-tools: Bash(gh *) Bash(git diff *) Bash(git log *)
version: 0.1.0
---

# Code Review

## Overview

Perform structured code reviews of local changes or pull requests. Surface real issues with actionable recommendations — not cosmetic nit-picks.

Covers: correctness, security, performance, maintainability, and project conventions.

## Review Process

### Step 1: Gather Context

Run `scripts/diff-summary.sh` first to understand the scope, then read the relevant files:

```bash
bash .claude/skills/code-review/scripts/diff-summary.sh
```

Identify: what changed, which files are affected, and what the intent was (commit message, PR description).

### Step 2: Scan for Quick Wins

Run `scripts/find-issues.sh` to catch common problems automatically:

```bash
bash .claude/skills/code-review/scripts/find-issues.sh
```

Note all flagged lines for investigation — they are leads, not guaranteed bugs.

### Step 3: Apply the Review Checklist

Work through `references/checklist.md` systematically. Apply each section only to files that are in scope. For unfamiliar patterns, consult `references/patterns.md`.

### Step 4: Check Project Conventions

This project is Next.js + TypeScript + Tailwind. Verify:

- TypeScript types are explicit — no untyped `any` without a justified comment
- `NEXT_PUBLIC_` prefix required for any env var accessed in the browser; server-only vars must never be bundled client-side
- No `console.log` in committed code (pre-push hook checks, but verify in diff)
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- ESLint + Prettier pass — run `npm run lint` if changes touch logic
- Docker / GitHub Actions changes: verify secrets are referenced as `${{ secrets.NAME }}`, not hardcoded

### Step 5: Report Findings

Structure the report as:

```
## Code Review: <branch or description>

### Summary
One paragraph: what changed and overall quality assessment.

### Critical  (must fix before merge)
- `file.ts:42` — Description. Why it's a problem. How to fix it.

### Warnings  (should fix)
- `file.ts:17` — Description.

### Suggestions  (optional)
- `file.ts:88` — Idea and its benefit.

### Positives
- What was done well.
```

Omit sections with no findings. Always include Summary and Positives.

## Scope Targets

- **No args** — review all staged + unstaged changes vs HEAD
- **`/review <branch>`** — review commits on branch vs `main`
- **`/review <PR#>`** — fetch diff with `gh pr diff <PR#>` and review

## Additional Resources

### Reference Files

- **`references/checklist.md`** — full review checklist (correctness, security, performance, style)
- **`references/patterns.md`** — common problematic patterns in TypeScript / Next.js / React

### Scripts

- **`scripts/diff-summary.sh`** — print changed files with diff stats
- **`scripts/find-issues.sh`** — scan changed files for code smells and red flags
