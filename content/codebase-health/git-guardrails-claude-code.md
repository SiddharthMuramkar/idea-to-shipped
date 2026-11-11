---
title: git-guardrails-claude-code: block dangerous git commands
slug: git-guardrails-claude-code
summary: git-guardrails-claude-code sets up a Claude Code hook that blocks dangerous git commands, such as git reset --hard, before Claude runs them.
image: /images/lessons/git-guardrails-claude-code.jpg
imageAlt: A curving road at night lined with a yellow-and-black guardrail and chevron signs steering traffic around the bend.
---

## What it's for

Say you leave Claude Code working alone on Ticket #13 of the yoga-studio site, without asking your permission for each command. It can run any git command, and one `git reset --hard`, a command that throws changes away, can wipe out weeks of work. A line in `CLAUDE.md`, the agent's instruction file, only shapes what Claude tries to do, so it won't stop that.

```checkpoint quick-1
You add "never run `git reset --hard`" to `CLAUDE.md`, then leave the agent alone. What has that line done?
- [x] It has shaped what Claude tries to do, but it can't stop the command.
- [ ] It has blocked the command, because Claude Code enforces `CLAUDE.md`.
- [ ] It has changed nothing, because Claude skips `CLAUDE.md` when alone.
Why: A line in `CLAUDE.md` only shapes what Claude tries to do. It won't stop a command from running, which is why this Skill uses a hook instead.
```

**git-guardrails-claude-code sets up a hook that blocks dangerous git commands before Claude runs them.** That's [Fix the environment](/learn/fix-the-environment) at work.

It's a **`PreToolUse` hook**: a script Claude Code runs automatically before a tool is used. It watches the **Bash tool**, the tool Claude Code uses to run terminal commands on a Mac or on Linux. Windows differs, as Where it goes wrong explains.

Claude writes a command, and the hook compares it with a list of patterns. A match is blocked. Anything else runs as normal. A pattern describes the text to look for.

```diagram
type: chain
caption: "Claude writes a command, and the hook compares it with a list of patterns."
steps:
  - "Claude writes a command"
  - "the hook compares it with a list of patterns"
  - parallel:
      - "A match is blocked."
      - "Anything else runs as normal."
```

By default it blocks:

- `git push`, with or without `--force`: sends your commits to the [remote](/learn/push-pull-and-remotes), the copy of your repo on GitHub;
- `git reset --hard`: throws away uncommitted changes, and given a commit such as `HEAD~3`, moves the branch back so the commits after it are dropped;
- `git clean -f` and `git clean -fd`: delete files git isn't tracking;
- `git branch -D`: deletes a branch, even one that isn't merged;
- `git checkout .` and `git restore .`: discard edits you haven't staged with `git add` yet ([Undo and merge conflicts](/learn/undo-and-conflicts) shows where changes live).

```checkpoint quick-2
The agent runs `git push origin my-branch`, with no `--force`. What does the hook do by default?
- [x] It blocks the push, because `git push` is on the list, with or without `--force`.
- [ ] It allows the push, because only `git push --force` is on the blocked list, not plain pushes.
- [ ] It allows the push, because only pushes to `main` are on the blocked list.
Why: The default list covers `git push` with or without `--force`, so a plain push to any branch is blocked, as well as a forced one.
```

Say the agent tries to push. The command never runs, and Claude sees a message saying it has no authority to run it:

```text
BLOCKED: 'git push origin main' matches dangerous pattern 'git push'.
The user has prevented you from doing this.
```

## When to use it

- You're leaving the agent working alone, and you want `git reset --hard` refused.
- You keep catching the agent pushing before you've looked at anything.

```checkpoint quick-3
You're about to leave the agent working alone. What do you want this Skill for?
- [x] To have `git reset --hard` refused before it can run.
- [ ] To have `git reset --hard` undone soon after it has run.
- [ ] To have each `git reset --hard` saved in a report.
Why: This Skill fits when you want a command like `git reset --hard` refused. It stops the command, so there's nothing to undo or report afterwards.
```

## When not to use it

If you want each commit's code formatted, type-checked and tested, use [setup-pre-commit](/learn/setup-pre-commit) instead, because this Skill checks no code.

```checkpoint quick-4
You want each commit's code formatted, type-checked and tested. Which Skill fits?
- [x] setup-pre-commit, because this Skill checks no code.
- [ ] This Skill, because it stops bad commits before they land.
- [ ] This Skill, because it tests the code before each command.
Why: Formatting, type checks and tests at each commit are setup-pre-commit's job. This Skill checks no code at all.
```

Don't treat the hook as a lock, either. It compares text, so a command written another way can slip past. Going deeper shows how.

```checkpoint quick-5
Why shouldn't you treat the hook as a lock?
- [x] It compares text, so a command written another way can slip past.
- [ ] It compares meaning, so a command it misreads as safe can slip past.
- [ ] It compares your code, not the command, so a bad command can slip past.
Why: The hook compares text, not meaning. The same command written another way may match no pattern, and then the hook doesn't stop it.
```

## What it needs to start

You type `/git-guardrails-claude-code`, or you ask for git guardrails and the agent starts it on its own. It needs:

- **`jq`** on your machine: a command-line tool for reading JSON, a common data format. The hook's script uses it to pull `.tool_input.command` out of its JSON input.
- One answer from you, before it installs anything: **this project only** (`.claude/settings.json`) or **all projects** (`~/.claude/settings.json`). Those are Claude Code's settings files.

```checkpoint quick-6
What does the script need `jq` for?
- [x] To pull `.tool_input.command` out of the hook's JSON input.
- [ ] To write the `PreToolUse` entry into your project's settings file.
- [ ] To print the BLOCKED message for Claude to read.
Why: `jq` is a command-line tool for reading JSON. The script uses it to get the command Claude wants to run out of the hook's JSON input.
```

## What it creates

- A copy of the script `block-dangerous-git.sh`, in `.claude/hooks/` or, for all projects, `~/.claude/hooks/`. It's made runnable with `chmod +x`.
- A `PreToolUse` entry with the **matcher** `Bash`, merged into the settings file without overwriting your other settings. A matcher names which tool a hook applies to.
- Any patterns you ask it to add or remove, edited into that copy.

```checkpoint quick-7
Your settings file already holds other settings. What happens when the Skill adds its hook?
- [x] It merges in a `PreToolUse` entry and keeps your other settings.
- [ ] It replaces the whole file with a new one that holds only the hook.
- [ ] It leaves the file alone and asks you to paste the entry in.
Why: The `PreToolUse` entry is merged into the settings file, so nothing you already have there is overwritten.
```

Last, it feeds a pretend `git push origin main` into the script as a test. The script should end with **exit code** 2: the number a program returns when it ends. It should also print a BLOCKED message to stderr, its error output.

## Going deeper

### Why it exists

Matt Pocock, who wrote the Skill, wanted Claude Code working on its own, without asking permission for every command. He did that inside **Docker Sandbox**, which runs the agent in a small virtual machine, so it can't reach outside the project folder. But your git history lives inside that folder, so a bad `git reset --hard` still does its damage. Matt names the gap: the sandbox "doesn't restrict _what_ commands Claude can run". It only limits where they run.

```checkpoint quick-8
Claude Code is running inside Docker Sandbox. Can it still run `git reset --hard` on your project?
- [x] Yes, because the sandbox limits where commands run, not which ones.
- [ ] No, because the sandbox refuses any git command that could destroy work.
- [ ] No, because the sandbox keeps your git history out of reach.
Why: Your git history lives inside the sandboxed folder, and the sandbox doesn't restrict what commands Claude can run. So a bad `git reset --hard` still does its damage.
```

So he built this Skill to fill that gap. In his words: "It's a hard guardrail, not a suggestion buried in prose."

Today Matt keeps this Skill in `misc`, his bucket of Skills he rarely uses. Since October 2026 the bucket has been frozen: bug reports, feature requests and pull requests against it are closed. His reason: "I'm not running them day to day, so I can't tell whether a fix is right". So read his page as why the Skill was made, not as a promise that it's kept working.

```checkpoint quick-9
You find a bug in the hook and report it on Matt's repo. What should you expect?
- [x] It's closed, because the `misc` bucket is frozen.
- [ ] It's fixed soon, because Matt runs the Skill daily.
- [ ] It's left open until someone sends a pull request.
Why: The `misc` bucket has been frozen since October 2026. Matt isn't running these Skills day to day, so he can't tell whether a fix is right.
```

### How it works underneath

Claude Code can run a hook, such as a shell command, automatically at fixed points in its work. These hooks are Claude Code's own, so this Skill only works there. A `PreToolUse` hook runs before a tool call, and its exit code decides what happens next.

The Skill's script is short. Claude writes a Bash command. Claude Code passes it to the hook as JSON. The script pulls out the command with `jq` and checks it against each pattern. A match exits with code 2, and the tool call is blocked. No match exits 0, and the normal permission flow applies. That flow is Claude Code's usual rules and prompts.

```diagram
type: chain
caption: "The script pulls out the command with `jq` and checks it against each pattern."
steps:
  - "Claude writes a Bash command."
  - "Claude Code passes it to the hook as JSON."
  - "The script pulls out the command with `jq`"
  - parallel:
      - "A match exits with code 2, and the tool call is blocked."
      - "No match exits 0, and the normal permission flow applies."
```

Here's the core of the script, with comments added and its message cut short:

```bash
INPUT=$(cat)                                            # the JSON from Claude Code
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')  # the command Claude wrote

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: ..." >&2                             # >&2 sends it to stderr
    exit 2
  fi
done

exit 0
```

On exit 2, the hook's stderr is the message Claude sees. Any exit code but 0 or 2, or a hook that fails to start, is a non-blocking error. The action goes ahead, unless the hook is set to block when it fails.

```checkpoint quick-10
A `PreToolUse` hook crashes and exits with code 1. What happens to the tool call?
- [x] It goes ahead, unless the hook is set to block when it fails.
- [ ] It's stopped, and the hook's stderr is the message Claude sees.
- [ ] It's stopped, and Claude Code's usual prompts ask you to decide.
Why: Only exit 2 blocks. Any exit code but 0 or 2, or a hook that fails to start, is a non-blocking error, so the action goes ahead unless the hook is set to block when it fails.
```

If your agent must push to a pull request, you can remove `git push` from your copy. `push --force` is its own pattern, so `git push --force` stays blocked, but `git push -f` doesn't.

```checkpoint quick-11
You remove `git push` from your copy so the agent can push. What happens to `git push --force`?
- [x] It stays blocked, because `push --force` is its own pattern.
- [ ] It's allowed now, because `git push` covered every kind of push.
- [ ] It's allowed now, because removing a pattern removes its variants.
Why: `push --force` is a separate pattern on the list. Taking out `git push` leaves it in place, so `git push --force` still matches. That spelling only: `git push -f` then matches nothing.
```

### A real example

In September 2026, a user with this hook installed caught Claude Code pushing anyway. The report, issue #1077, says: "It used glab to push code instead of the explicitly blocked `git push`". `glab` is GitLab's command-line tool. The reporter wrote a fix covering `glab` and `gh`, but the issue was closed as not planned, because the Skill is frozen.

The hook did what it was built to do: it blocked `git push`. The agent found another program that pushes. So the hook guards the commands on its list, not the push itself.

```checkpoint quick-12
`git push` is blocked, but `glab` isn't on the hook's list. What can the agent still do?
- [x] Push with `glab`, because the hook guards only the commands on its list.
- [ ] Nothing, because the hook blocks any program that tries to push code.
- [ ] Nothing, because Claude stops trying to push for good once it has been blocked.
Why: The hook did what it was built to do and blocked `git push`. It guards the commands on its list, not the push itself, so another program that pushes gets through.
```

### Where it goes wrong

**The hook looks installed, but blocks nothing.** A machine without `jq` does this. The command comes out as an empty string, no pattern matches, and the script exits 0. The normal permission flow then decides the command. The Skill lists no requirements, so only its test warns you: exit 0, not 2. This is called **failing open**: when something breaks, the command isn't blocked. Run `jq --version` before you trust the hook. For a lasting fix, copy one that **fails closed** and blocks instead: issues #898 and #1293 both link one.

```checkpoint quick-13
You've installed the hook on a new machine. What should you check before you trust it?
- [x] Run `jq --version`, because without `jq` the hook blocks nothing.
- [ ] Run `git --version`, because an old git makes the hook block nothing.
- [ ] Read your `CLAUDE.md`, because the hook loads its patterns from there.
Why: Without `jq`, the command comes out as an empty string, no pattern matches, and the script exits 0. The Skill lists no requirements, so only its test warns you.
```

**On Windows, the hook may never fire.** There Claude Code can run shell commands through its PowerShell tool instead of Bash, and the Skill's entry matches only `Bash`. The docs put it plainly: "A hook that matches only `Bash` never fires there." If you use Windows, change the matcher in your settings file to `Bash|PowerShell`.

**A push got through, spelled another way.** The script matches text, not meaning. A pattern like `git push` needs the two words side by side. Git allows **global options**, settings that sit between `git` and a subcommand such as `push`. So `git -C /tmp push origin main` gets through. `git branch --delete --force` and `git clean -d -f` get through too: "the long and reordered spellings of `-D` and `-fd`". Even a double space gets through. To close one spelling, add a pattern to your copy, as Try it does. To cover far more, copy fszcd's fix from a comment on issue #898.

**A deny rule lets the same push through.** Claude Code also has built-in **deny rules**: lines in your settings that refuse a matching tool call. Say you swap the hook for `Bash(git push *)`. A Bash rule matches the command text Claude writes, so other spellings of the same push get past it. The docs list `git -C . push origin main` among the commands it doesn't stop. For your own logic on the full command text, they point to a `PreToolUse` hook.

**Your bug report gets closed.** The Skill is frozen, so nobody upstream will fix it. Matt's advice is to "fix your copy: the files are yours to edit."

One reporter sums up the risk: "The failure mode of an overstated guardrail is misplaced trust". So treat the hook as one layer. It catches the listed spellings, not every way to run git. Matt built it to fill a gap in a sandbox, not to replace one. To limit files and network access whatever the command text says, the docs point to sandboxing.

```checkpoint quick-14
Given these gaps, how should you treat the hook?
- [x] As one layer that catches the listed spellings, not every way to run git.
- [ ] As a lock that stops every way there is of running a dangerous git command.
- [ ] As useless, because a guardrail with any gap gives you no protection.
Why: It catches the listed spellings, not every way to run git. An overstated guardrail leads to misplaced trust, so use it alongside other layers such as sandboxing.
```

### Try it

You'll need your practice project, the yoga-studio booking site, with a terminal open in its root folder. If you haven't set the project up, do the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. Check `jq` is installed: `jq --version`. You should see a version number. If you see "command not found", install `jq` first: `brew install jq` on a Mac, `sudo apt-get install jq` on Ubuntu or Debian, or `winget install jqlang.jq` on Windows. Then run `jq --version` again.
2. If you don't have this Skill yet, install it: `npx skills add mattpocock/skills/skills/misc/git-guardrails-claude-code`.
3. In Claude Code, ask it to set up git guardrails.
4. When it asks where to install, choose **this project only**. You should see `.claude/hooks/block-dangerous-git.sh` appear.
5. Run the Skill's test in your terminal:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | .claude/hooks/block-dangerous-git.sh; echo "exit=$?"
```

You should see the BLOCKED message, then `exit=2`.

6. Start a fresh Claude Code session. On Windows, first change the matcher in your settings file to `Bash|PowerShell`, and run steps 5, 8 and 10 in Git Bash.
7. Ask Claude Code to run `git push`. You should see it fail with the BLOCKED message.
8. Now test a spelling with a global option:

```bash
echo '{"tool_input":{"command":"git -C . push origin main"}}' | .claude/hooks/block-dangerous-git.sh; echo "exit=$?"
```

You should see no BLOCKED message, and `exit=0`. That's the gap.

9. Open `.claude/hooks/block-dangerous-git.sh`, and add this line to `DANGEROUS_PATTERNS`: `"git -C [^ ]+ push"`.
10. Run step 8's command again. You should see `exit=2`.

In step 9's pattern, `[^ ]+` means any text with no space. To let the agent push in this project again, remove the `git push` line and the one you added.

### Read more

- [This Hook Stops Claude Code Running Dangerous Git Commands](https://www.aihero.dev/this-hook-stops-claude-code-running-dangerous-git-commands), Matt Pocock, 10 February 2026
- [Changes to `misc/` skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock, 6 October 2026
- [Issue #898: hook fails open without jq and misses common git spellings](https://github.com/mattpocock/skills/issues/898), mtu-soft-matter, 18 August 2026
- [Issue #301: `block-dangerous-git.sh` is bypassed by any git global option (e.g. `git -C <dir> push`)](https://github.com/mattpocock/skills/issues/301), stoneLeaf, 3 June 2026
- [Issue #1293: hook fails open when jq is missing](https://github.com/mattpocock/skills/issues/1293), nabeelkhawaja3-hash, 17 October 2026
- [Issue #1077: Prevent Cunning Models working around git-hooks](https://github.com/mattpocock/skills/issues/1077), ACregan, 13 September 2026
- [Hooks reference](https://code.claude.com/docs/en/hooks), Anthropic
- [Configure permissions](https://code.claude.com/docs/en/permissions), Anthropic

## Remember

```flashcards
Q: What does git-guardrails-claude-code create?
A: A hook script in `.claude/hooks/` (or `~/.claude/hooks/`) and a `PreToolUse` entry for Bash in the settings file.

Q: Which git commands does git-guardrails-claude-code block by default?
A: `git push` (including `--force`), `git reset --hard`, `git clean -f`/`-fd`, `git branch -D`, `git checkout .` and `git restore .`

Q: What exit code does the guardrails script use to block a command?
A: Exit code 2, with a BLOCKED message on stderr.

Q: What tool does the guardrails script use to read the command?
A: `jq`, which pulls `.tool_input.command` out of the hook's JSON input.

Q: Is git-guardrails-claude-code still maintained?
A: No. It's in Matt's misc bucket, frozen since 6 October 2026, so bug reports and PRs against it are closed.

Q: In Claude Code, what happens when a PreToolUse hook exits with a code other than 0 or 2?
A: It's a non-blocking error, and the action goes ahead, unless the hook is set to block when it fails.

Q: Does a `Bash(git push *)` deny rule stop `git -C . push origin main`?
A: No. A Bash rule matches the command text Claude writes, so other spellings of the same push get past it.
```

## Final test

```final-test git-guardrails-claude-code-what-it-sets
What does git-guardrails-claude-code set up?
- [x] A Claude Code PreToolUse hook that blocks dangerous git commands before Claude runs them.
- [ ] A Husky pre-commit hook that formats, type-checks and tests your code on every commit.
- [ ] A GitHub branch rule that refuses force-pushes to `main` from anyone on the team.
Why: The hook lives in Claude Code and acts on the command, not on your code. Before Claude runs a Bash command, the hook checks it and blocks dangerous git commands such as `git push` and `git reset --hard`.
```

```final-test git-guardrails-claude-code-scope
What does the Skill ask you before it installs anything?
- [x] Whether to install it for this project only or for all your projects.
- [ ] Which remote branch the agent is allowed to push to without being blocked.
- [ ] Whether to run the hook before each commit or only before each push.
Why: The hook can live in one project or in all of them, so the Skill has to ask where before it copies anything. This project only uses `.claude/settings.json`, and all projects uses `~/.claude/settings.json`.
```

```final-test git-guardrails-claude-code-verify
How does the Skill check that the installed hook works?
- [x] It pipes a pretend `git push origin main` into the script and expects exit code 2.
- [ ] It pushes a test branch to GitHub and checks that the push was rejected.
- [ ] It runs `git reset --hard` in a scratch repo and checks that no files changed.
Why: A pretend command tests the script without really pushing anything. Feed it `git push origin main` as JSON, and a working script exits with code 2, the blocking code, and prints a BLOCKED message to stderr.
```

```final-test git-guardrails-claude-code-deeper-no-jq
On a machine without `jq`, what happens when the agent runs `git push --force` with the hook installed?
- [x] The hook doesn't block it: the command reads as empty, nothing matches and the script exits 0.
- [ ] The push is blocked, because Claude Code refuses every Bash command when a hook script fails.
- [ ] The hook blocks it, because a missing `jq` makes the script exit with code 2.
Why: The script needs `jq` to read the command. Without `jq`, the command comes out as an empty string, so no pattern matches and the script exits 0. Exit 0 blocks nothing: the hook looks installed, and the normal permission flow decides the push.
```

```final-test git-guardrails-claude-code-deeper-git-c
Which of these commands gets past the hook's default patterns?
- [x] `git -C /tmp push origin main`, because a global option sits between `git` and `push`.
- [ ] `git push origin main`, because pushes to `main` are allowed unless you add a pattern.
- [ ] `git reset --hard HEAD~1`, because only a bare `git reset --hard` is on the list.
Why: The patterns compare raw text, so `git push` matches only when the two words sit side by side. Git allows global options such as `-C` before the subcommand, which pulls them apart. So `git -C /tmp push origin main` was allowed while `git push origin main` was blocked.
```

```final-test git-guardrails-claude-code-unattended
You're about to leave Claude Code working on the yoga-studio repo for an hour on its own. You're worried it might run `git reset --hard` or force-push and throw away work. You want those commands refused before they run. Which fits best?
- [x] Set up a Claude Code hook that blocks dangerous git commands before they run.
  > Right: that's `/git-guardrails-claude-code`.
- [ ] Set up Husky pre-commit hooks that format, type-check and test each commit.
  > That's `/setup-pre-commit`. Those hooks check code when you commit. They don't stop the agent running `git reset --hard` or `git push --force`.
- [ ] Review the agent's diff against the Spec and the standards when it's done.
  > That's `/code-review`. A review happens after the fact. By then a `git reset --hard` has already thrown the work away.
- [ ] Look back over the session afterwards and suggest changes to the environment.
  > That's `/retro`. A look back comes after the damage. You want the command refused before it runs.
Why: You want the command refused before it runs, and only the Claude Code hook acts at that point. It blocks commands like `git reset --hard` and `git push --force` before Claude executes them. The other options act at a commit, or after the damage is done.
```

```final-test git-guardrails-claude-code-early-push
Mid-task, Claude Code keeps trying to run `git push origin main` before you've looked at anything. You want that command refused in Claude Code, with a message telling it why. Which fits best?
- [x] Block `git push` with a Claude Code hook that refuses it before it runs.
  > Right: that's `/git-guardrails-claude-code`.
- [ ] Write a pull request body for the branch so the push has a description.
  > That's `/pr`. A good PR body doesn't stop the agent pushing. You want the push refused.
- [ ] Write a handoff document and continue the task in a fresh session.
  > That's `/handoff`. A fresh session has the same tools. Nothing would stop it pushing either.
Why: You want `git push` refused, and this Skill's hook does that before the command runs. Claude then sees a message saying it doesn't have authority to run the command, so it knows why it was stopped.
```

```final-test git-guardrails-claude-code-one-repo
In the yoga-studio repo only, you never want Claude Code to run `git branch -D` or `git clean -fd`. In your other repos it can. You'd like the rule saved in that repo's `.claude/settings.json`. Which fits best?
- [x] Install a git-blocking hook for this project only, in `.claude/settings.json`.
  > Right: that's `/git-guardrails-claude-code`.
- [ ] Generate a bash script that walks you through cleaning up branches by hand.
  > That's `/wizard`. A wizard walks a human through steps only they can do. It doesn't stop the agent's commands.
- [ ] Add Husky pre-commit hooks to the repo so each commit is checked first.
  > That's `/setup-pre-commit`. Pre-commit hooks check code at commit time. They don't refuse `git branch -D` or `git clean -fd`.
Why: The hook blocks `git branch -D` and `git clean -fd` by default. The Skill also asks first whether to install for this project only, in `.claude/settings.json`, or for all projects. So you can keep the rule to this one repo and leave the others alone.
```

```final-test git-guardrails-claude-code-why-a-hook
Last week the agent ran `git checkout .` and wiped your uncommitted changes. You could add "never discard changes" to the repo's instructions. Instead you install a hook that blocks `git checkout .` before Claude executes it. Why is that the better fix?
- [x] The hook changes what the agent's environment allows, so it holds on the next run too.
- [ ] The hook makes the agent ask you a question before it runs any git command at all.
  > The hook doesn't ask anything. It blocks matching commands and lets the rest through.
- [ ] The hook undoes the discarded changes, so nothing is lost when the agent slips up.
  > The hook can't undo anything. It only stops a matching command before it runs.
Why: A sentence in the instructions loads on every run, but it only shapes what Claude tries to do. The hook checks each command before Claude executes it, whatever Claude decides. `git checkout .` is a fixed pattern a program can spot, so it gets a check rather than a written rule. That's fixing the environment: the check holds on every future run.
```

```final-test git-guardrails-claude-code-deeper-glab
The guardrails hook is installed in your repo, and `git push` is blocked. Then you see the agent pushed anyway, through `glab`, a different program. Upstream won't change the frozen Skill. What should you take from this?
- [x] Treat the hook as one layer; fix your own copy and add a sandbox, since it only checks command text.
- [ ] Remove the hook, since a guardrail that can be bypassed once gives you no protection at all.
  > It still blocks the listed spellings. The answer is more layers, like a fixed copy and a sandbox, not none.
- [ ] Wait for an upstream fix to the Skill, since the reporter already wrote a patch for `glab` and `gh`.
  > The misc Skills are frozen, and the request for this fix was closed as not planned. Matt says to fix your own copy.
Why: The hook compares command text with fixed patterns, so another program that pushes slips past. It still blocks the listed spellings, so it's worth keeping as one layer. The Skill is frozen, so Matt says to fix your own copy, and the Claude Code docs point to sandboxing for enforcement that doesn't depend on the command text.
```

```sources
- [git-guardrails-claude-code: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/git-guardrails-claude-code/SKILL.md), Matt Pocock's Skills
- [setup-pre-commit: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/setup-pre-commit/SKILL.md), Matt Pocock's Skills
- [git-guardrails-claude-code: scripts/block-dangerous-git.sh](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/git-guardrails-claude-code/scripts/block-dangerous-git.sh), Matt Pocock's Skills
- [git-guardrails-claude-code: hook fails open without jq and misses common git spellings · Issue #898 · mattpocock/skills](https://github.com/mattpocock/skills/issues/898), mtu-soft-matter, 2026-08-18
- [This Hook Stops Claude Code Running Dangerous Git Commands](https://www.aihero.dev/this-hook-stops-claude-code-running-dangerous-git-commands), Matt Pocock, 2026-02-10
- [mattpocock/skills skills/misc/README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/README.md), Matt Pocock
- [Add SCOPE.md, issue forms, and out-of-scope records · mattpocock/skills@f0588cd](https://github.com/mattpocock/skills/commit/f0588cd3aebe87556bbfc9d82a640e06900be7d0), Matt Pocock, 2026-10-06
- [mattpocock/skills .out-of-scope/frozen-misc-skills.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock
- [Hooks reference](https://code.claude.com/docs/en/hooks), Anthropic
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
- [Configure permissions](https://code.claude.com/docs/en/permissions), Anthropic
- [Prevent Cunning Models working around git-hooks · Issue #1077 · mattpocock/skills](https://github.com/mattpocock/skills/issues/1077), ACregan, 2026-09-13
- [block-dangerous-git.sh is bypassed by any git global option (e.g. `git -C <dir> push`) · Issue #301 · mattpocock/skills](https://github.com/mattpocock/skills/issues/301), stoneLeaf, 2026-06-03
- [git-guardrails: hook fails open when jq is missing, allowing every command it claims to block · Issue #1293 · mattpocock/skills](https://github.com/mattpocock/skills/issues/1293), nabeelkhawaja3-hash, 2026-10-17
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), Anthropic (Claude Code docs)
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [wizard: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wizard/SKILL.md), Matt Pocock's Skills
```
