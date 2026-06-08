---
name: code-review
description: Review code for correctness and bugs
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git:*)
  - Bash(ls:*)
when_to_use: Use when the user asks to review code, find bugs, or check for correctness. Trigger phrases: "code review", "review this", "check my code", "find bugs", "review the diff", "review <path>". Auto-invoke on review intent; also available as /code-review.
argument-hint: "[path-or-scope]"
arguments:
  - target
context: inline
---

# Code Review

Review the specified code for correctness and bugs. Operate on one of: a git diff, specific files/paths, or the whole project. Deliver findings inline with file:line references and a severity tag.

## Inputs

- `$target` (optional): What to review. Resolution order:
  1. A file path or glob (e.g. `src/Player.js`, `*.ts`).
  2. `diff` or empty — review staged + unstaged git changes.
  3. `project` — review the whole project (warn on large repos).

## Goal

Produce a focused, actionable list of correctness issues with file:line references. Skip style nits unless they hide bugs. Each finding explains the problem and a suggested fix.

## Severity Levels

- **bug** — Correctness defect. Will or may produce wrong behavior, crash, or data loss. Must fix.
- **warning** — Suspicious code likely to cause issues under edge cases or future changes. Should fix.
- **nit** — Minor concern, cosmetic, or low-risk improvement. Optional.

## Steps

### 1. Resolve the review target
Determine what to review based on `$target` or the user's request.

- If a path/glob is given, use `Glob` to find matching files.
- If `$target` is `diff`, empty, or unspecified, run `git diff` (staged + unstaged). If empty, also include `git diff --staged`.
- If `$target` is `project`, list the project root and prioritize source files (skip lockfiles, generated files, vendored assets).
- If the target is a commit/branch, run `git diff <base>...HEAD`.

**Success criteria**: A concrete set of files (or a diff) to review is identified before any analysis begins.

### 2. Gather context
Read enough of the surrounding code to evaluate each piece in isolation.

- Read each file under review fully when small; otherwise read the changed regions plus the surrounding function/class.
- For diffs, run `git diff` and read the affected files to understand context.
- Note relevant project conventions from `PUKU.md` or similar config files.

**Success criteria**: Each file/region under review is understood in its surrounding context.

### 3. Analyze for correctness and bugs
Walk the code looking for defects. Check at minimum:

- **Logic errors**: wrong operator, off-by-one, swapped arguments, inverted conditions.
- **Boundary & null handling**: missing checks, unsafe property access, wrong base case.
- **Type & contract mismatches**: arguments/returns that don't match how callers use them.
- **State & lifecycle**: stale references, double-free, missed cleanup, init-order bugs.
- **Concurrency**: race conditions, mutation of shared state, missing awaits.
- **Game/project-specific**: entity lifecycle (`markForDeletion`), delta-time usage in `requestAnimationFrame` loops, sprite-sheet frame math, collision math (AABB), game-loop invariants.

**Success criteria**: All findings are real defects or well-justified concerns — not speculation. When in doubt, downgrade severity or omit.

### 4. Format and deliver findings inline
Present findings as a numbered list in the chat. For each:

- **Severity tag**: `[bug]`, `[warning]`, or `[nit]`.
- **Location**: `path/to/file.ext:LINE` (and function/class when helpful).
- **Problem**: 1-2 sentences on what is wrong and why.
- **Suggested fix**: A short code snippet or concrete change.

Group by file. Sort within each file by line number. If there are no findings, say so explicitly and note any caveats (e.g., "no obvious defects in the diff — recommend a closer look at X").

**Success criteria**: Output is in the chat, not written to a file. Each finding has a severity, location, problem, and suggested fix.

## Rules

- Stay focused on correctness. Do not pad with style comments unless they mask a bug.
- Always cite file:line. Never assert a problem exists without a reference.
- Prefer the minimal fix; do not propose architectural rewrites in a review.
- If a finding depends on assumptions about runtime context, state the assumption.
- Do not auto-edit files. The user reviews findings and applies fixes themselves.
