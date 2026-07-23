# Kilo Code Session Rules (Strict Mode v2)

> These rules define the required behavior for this repository.
>
> Follow these rules for the entire session unless the user explicitly overrides them.

---

# Highest Priority

These rules override default coding preferences whenever possible.

Optimize in the following order:

1. Correctness
2. Minimal risk
3. Minimal token usage
4. Minimal terminal output
5. Minimal code changes
6. Minimal execution time

Never trade correctness for optimization.

---

# Session Initialization

At the beginning of every conversation:

1. Read this file completely.
2. Read `.kilocode/rules/rtk-rules.md`.
3. Read `.kilocode/PROJECT.md` if it exists.
4. Apply these rules immediately.
5. Continue following these rules for the remainder of the session.

Do not repeat initialization.

Do not re-read these files unless they change.

---

# Primary Objective

Complete the requested task while minimizing:

- terminal output
- file reads
- tool calls
- code changes
- execution time
- LLM token usage

Favor execution over speculation.

---

# RTK

RTK is installed and available.

Always use RTK wrappers whenever supported.

Never execute the raw command if an RTK wrapper exists.

If RTK availability has not yet been verified in the current environment:

```bash
rtk --version
```

Do not assume RTK is unavailable because of previous failures.

Always prefer:

```
rtk git
rtk rg
rtk read
rtk ls
rtk find
rtk grep
rtk docker
rtk kubectl
rtk npm
rtk pnpm
rtk cargo
rtk pytest
rtk go
```

Never execute both RTK and raw versions of the same command.

---

# Command Execution

When the user requests terminal work:

Execute first.

Explain only after execution if explanation is useful.

Never:

- predict failures
- explain commands before execution
- execute duplicate commands
- execute alternative commands "just in case"

Run only the minimum commands required.

---

# Verification

Always verify inexpensive facts before concluding.

Use current command output.

Do not rely on previous failures.

Do not repeat verification if nothing has changed.

Avoid repeated:

- git status
- ls
- pwd
- branch checks
- RTK verification

unless repository state may have changed.

---

# Tool Usage

Before executing any command:

Determine whether previous verified output already answers the request.

Reuse existing information whenever possible.

Never execute identical commands twice without a reason.

---

# File Reading

Read the smallest amount of code required.

Prefer:

- specific functions
- specific classes
- targeted line ranges

Avoid:

- entire repositories
- repeated reads
- unrelated files

Never read:

- node_modules
- dist
- build
- target
- coverage
- package-lock.json
- yarn.lock
- pnpm-lock.yaml

unless explicitly requested.

Read one file at a time.

Stop reading immediately after sufficient context is obtained.

---

# Searching

Prefer:

```
rtk rg
```

instead of recursive repository scans.

Limit searches to relevant directories.

Avoid global recursive searches unless necessary.

---

# File Editing

Modify only files required to solve the requested problem.

Preserve:

- formatting
- architecture
- naming
- style

Avoid:

- unrelated cleanup
- formatting-only edits
- repository-wide refactors
- speculative improvements

Keep diffs as small as possible.

---

# Coding

Implement the smallest correct solution.

Prefer:

- consistency
- maintainability
- readability

Avoid:

- unnecessary abstractions
- unnecessary dependencies
- premature optimization
- speculative enhancements

Fix the root cause whenever reasonably identifiable.

---

# Debugging

Workflow:

1. Observe
2. Identify
3. Verify
4. Fix
5. Verify again

Never guess.

Never apply blind fixes.

---

# Testing

Run only tests affected by the change.

Avoid full test suites unless requested.

Report only:

- Passed
- Failed
- Skipped

Do not include verbose logs.

---

# Git

Before staging:

- summarize modified files.

Before committing:

- summarize changes.
- suggest a commit message.

Before pushing:

- verify current branch.

Never:

- force push
- rewrite history
- delete branches

unless explicitly requested.

---

# Decision Making

Before modifying code:

Understand:

- objective
- scope
- side effects

Prefer:

- localized fixes
- incremental changes
- low-risk modifications

---

# Token Efficiency

Always optimize for minimal context.

Prefer:

- RTK summaries
- targeted searches
- focused edits
- concise responses

Avoid:

- repeated explanations
- duplicated output
- unnecessary context
- repeated analysis

---

# Response Style

Answer directly.

Be concise.

Be technical.

Do not repeat information.

Only include information relevant to the user's request.

State assumptions only when strictly necessary.

Avoid unnecessary narration.

Never describe your internal reasoning or planning.

Do not include phrases such as:

- "Let me think..."
- "I think..."
- "Maybe..."
- "Probably..."
- "The user is testing..."
- "My reasoning..."
- "My thought process..."

Provide results, not internal deliberation.

---

# Output Budget

Default targets:

- concise command output
- concise summaries
- concise explanations

Only produce large outputs when explicitly requested.

---

# Safety

Always ask before:

- deleting files
- overwriting important files
- force pushing
- rewriting git history
- database migrations
- production deployments

---

# Completion

When finished, summarize only:

Completed:
- ...

Modified Files:
- ...

Commands Executed:
- ...

Tests:
- Passed
- Failed
- Skipped

Remaining Issues:
- None (if applicable)

Do not repeat information already provided.

---

# Continuous Context

Maintain awareness of:

- verified command results
- current repository state
- current branch
- existing modifications

Do not repeat work that has already been verified.

Reuse verified information whenever possible.

---

# Efficiency Rules

Never:

- scan an entire repository without reason
- execute unnecessary commands
- execute duplicate commands
- reread unchanged files
- make assumptions without verification

Always:

- verify cheaply
- edit minimally
- preserve project style
- minimize token usage
- minimize terminal output
- minimize tool usage

# Playwright Locator Rules

When creating new locators:

Prefer:

1. getByRole()
2. getByLabel()
3. getByPlaceholder()
4. getByText()

Avoid:

- unstable CSS selectors
- generated class names
- long XPath

When locator is unknown:
Use Playwright codegen or Inspector before creating manual selectors.

# Playwright Locator Policy

Before creating or modifying locators:

1. Verify actual DOM.
2. Prefer Playwright Inspector/codegen when element behavior is unclear.
3. Do not replace working locators without evidence.
4. Avoid guessing based on screenshot or error message only.

Locator priority:
1. getByRole()
2. getByLabel()
3. getByPlaceholder()
4. getByText()
5. CSS selector
6. XPath (only when necessary)