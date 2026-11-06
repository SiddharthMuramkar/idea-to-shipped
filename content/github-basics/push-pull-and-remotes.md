---
title: Push, pull and remotes
slug: push-pull-and-remotes
summary: What remotes, origin and upstream are, how clone, fetch, pull and push move commits, how to read ahead and behind, and how to sign in to GitHub from the terminal.
---

Say you made three commits to your recipe site on your laptop. A friend opens your repo on GitHub and sees none of them. Meanwhile, they fixed a typo on github.com, and your laptop doesn't have that either. Git never syncs on its own: you send and fetch commits on purpose.

```goals
- Say what a remote, `origin` and `upstream` are, and list them with `git remote -v`.
- Get a repo with `git clone`, or connect a repo you made to a new, empty GitHub repo.
- Push a branch with `git push -u origin <branch>`, and bring new commits down with fetch and pull.
- Read "ahead", "behind" and "diverged", and bring a branch up to date with `main`.
- Sign in to GitHub from the terminal, and know what a fork is for.
```

## A remote is a copy somewhere else

A **remote** is a copy of your repo that lives somewhere else, usually on GitHub. Your repo knows each remote by a short name and an address, its URL. [What Git and GitHub are](/learn/what-git-and-github-are) covers why you'd want an online copy at all.

**Your repo and its copy on GitHub change only when you tell them to: `git push` sends your commits up, and `git pull` brings new ones down.**

`origin` is the usual name for your own repo on GitHub. `git clone` gives that name to the remote it cloned from, and most tools expect it. The name isn't special to Git, though. It's only the default.

`git remote -v` lists your remotes. For example:

```text
$ git remote -v
origin  https://github.com/sam-lee/recipes.git (fetch)
origin  https://github.com/sam-lee/recipes.git (push)
```

Each remote shows two lines: the address Git fetches from, and the one it pushes to. They're usually the same.

`upstream` is the usual name for a second remote: the repo you started from, which you only read from. You'll see it when you work on a fork of someone else's repo, below. A repo with both looks like this:

```text
$ git remote -v
origin    https://github.com/sam-lee/recipes.git (fetch)
origin    https://github.com/sam-lee/recipes.git (push)
upstream  https://github.com/family-cooks/recipes.git (fetch)
upstream  https://github.com/family-cooks/recipes.git (push)
```

```checkpoint push-to-which
`git remote -v` lists `origin`, your own repo on GitHub, and `upstream`, the repo you started from. Where do you push your branch?
- [x] To `origin`, your own repo, because `upstream` is the one you only read from.
- [ ] To `upstream`, because that's where the original project lives.
- [ ] To both at once, because Git keeps every remote in step.
Why: `origin` is your own repo on GitHub, where you push. `upstream` is the repo you started from, which you only read from.
```

## Get a repo: clone it, or connect one you made

There are two ways to end up with a repo on your computer that's linked to GitHub. Either the repo is already on GitHub and you clone it, or you made it on your computer and connect it to a new GitHub repo.

### Clone a repo that's on GitHub

To **clone** is to download a full copy of a repo, with every version of every file. On github.com, open the repo and click the green Code button. Under HTTPS, copy the address. Then, in a terminal:

```sh
git clone https://github.com/sam-lee/recipes.git
cd recipes
```

A clone does five things. It downloads the whole history, and makes a folder named after the repo. It names the remote `origin`, and checks out the default branch. And it sets your `main` to track GitHub's `main`, so `git pull` knows where to fetch from.

With the GitHub CLI, `gh repo clone sam-lee/recipes` does the same. The Code button also offers Download ZIP, but that's only the files, with no history. It isn't a repo, and you can't push from it.

```checkpoint zip-or-clone
You want to change the recipe site and send your commits back to GitHub. You download it with Download ZIP. What's the problem?
- [x] A ZIP holds only the files, with no history and no remote, so you can't push from it.
- [ ] Nothing: a ZIP holds the same history as a clone, packed into one file.
- [ ] A ZIP can be pushed, but only to a new repo, not the one it came from.
Why: Download ZIP gives the files, not the repo. A clone brings the whole history and sets up `origin`, so you can push.
```

### Connect a repo you made on your computer

Say you made the `recipes` repo on your laptop first, with a commit or two. Create an empty repo on GitHub to receive it. In the top-right corner of github.com, open the + menu and choose New repository. Name it `recipes`, pick private or public, and leave the README, `.gitignore` and license off.

It must start empty. If GitHub's repo held a commit of its own, such as a README, your first push would be refused, because GitHub would hold work your repo doesn't. Then connect the two, and push:

```sh
git remote add origin https://github.com/YOUR-USERNAME/recipes.git
git push -u origin main
```

`git remote add` gives the name `origin` to that address. The push sends `main` up, and `-u` is explained in the next part. With the GitHub CLI, one command does all of it, from inside the folder: `gh repo create recipes --private --source=. --push`.

Brad Traversy's CI/CD crash course starts this way too. You clone his starter app, delete its history with `rm -rf .git`, and start your own with `git init -b main`. Then you commit, and run the two commands above. The [CI/CD lab](/learn/lab-gated-pipeline) walks through it.

```checkpoint why-empty
You're about to create the GitHub repo for a project that already has commits on your laptop. Why leave "Add a README" off?
- [x] A README would be a commit your repo doesn't have, so your first push would be refused.
- [ ] GitHub can't show a README for a repo that came from a laptop.
- [ ] A README would overwrite the one already in your project when you push.
Why: The new repo must start empty. A commit made on GitHub would be work your repo doesn't have, and Git refuses a push that would lose it.
```

## Push: send your commits up

To **push** is to send your branch's new commits to a remote. The first push of a new branch looks like this:

```sh
git push -u origin add-search
```

That sends `add-search` to `origin`, creating the branch on GitHub. `-u`, short for `--set-upstream`, records GitHub's `add-search` as your branch's **upstream**: the branch on GitHub it tracks. After that, a plain `git push` or `git pull` on that branch knows where to go.

The output ends with two useful lines. GitHub replies with a link to open a pull request, and Git confirms the tracking:

```text
$ git push -u origin add-search
…
remote: Create a pull request for 'add-search' on GitHub by visiting:
remote:      https://github.com/sam-lee/recipes/pull/new/add-search
…
 * [new branch]      add-search -> add-search
branch 'add-search' set up to track 'origin/add-search'.
```

Forget `-u` on a new branch, and a plain `git push` stops with "The current branch add-search has no upstream branch". Git then prints the command to run, with `--set-upstream`. `git push -u origin HEAD` also works: it pushes the branch you're on, under the same name.

A push sends commits, and only commits. Edits you haven't committed stay on your computer. [Commits and diffs](/learn/commits-and-diffs) shows how to check that nothing was left out.

Many repos refuse pushes straight to `main`, so changes arrive through pull requests instead. [How teams protect main](/learn/how-teams-do-it) shows how. Editors have buttons for all this: VS Code's Sync Changes pulls first, then pushes.

```checkpoint no-upstream
On a new branch, you run `git push`, and Git says the current branch has no upstream branch. What do you run?
- [x] `git push -u origin add-search`, which pushes and records the upstream.
- [ ] `git pull`, which fetches the upstream branch from GitHub first.
- [ ] `git push --force`, which pushes without needing an upstream.
Why: A new branch has no upstream until you set one. `-u` pushes the branch and records GitHub's copy as its upstream.
```

```checkpoint push-takes-commits
An agent edits two files, commits one of them, and pushes. What does GitHub get?
- [x] The commit with the one file. The other edit stays on your computer.
- [ ] Both edits, because a push sends every changed file in the folder.
- [ ] Nothing, because a push waits until every edit is committed.
Why: A push sends commits, and only commits. An edit that isn't in a commit never leaves your computer.
```

## Fetch and pull: bring new commits down

A **remote-tracking branch**, such as `origin/main`, is Git's memory of where a branch on GitHub was the last time Git talked to GitHub. Think of it as a bookmark. It lives on your computer, and it moves only when you fetch, pull or push.

`git fetch` downloads new commits from `origin` and moves those bookmarks. It changes none of your files and none of your own branches, so it's safe at any time. `git pull` is a fetch, then a second step: it brings the new commits into the branch you're on.

When you have no new commits of your own, the pull is a **fast-forward**: your branch's label moves ahead to the newest commit, and there's nothing to combine. For example, after a friend fixed a typo on github.com:

```text
$ git fetch
From https://github.com/sam-lee/recipes
   a3f9c21..d7e0b44  main       -> origin/main
$ git status
On branch main
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)
$ git pull
Updating a3f9c21..d7e0b44
Fast-forward
 README.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Two more commands keep the bookmarks honest. `git fetch --prune` also forgets the `origin/` names of branches that were deleted on GitHub. `git ls-remote --heads origin` skips Git's memory and asks GitHub directly which branches it has right now.

```checkpoint fetch-or-pull
You want to see what's new on GitHub without changing any of your files or branches yet. Which command?
- [x] `git fetch`, which only downloads commits and moves the `origin/` names.
- [ ] `git pull`, which downloads commits and brings them into your branch.
- [ ] `git push`, which compares your branch with GitHub's copy.
Why: `git fetch` downloads and updates Git's memory of GitHub, and touches nothing else. `git pull` also changes the branch you're on.
```

```checkpoint stale-bookmark
`git branch -r` still lists `origin/old-search`, but a teammate says they deleted that branch on GitHub yesterday. Who's right?
- [x] Probably the teammate: `origin/` names are Git's memory, kept until a fetch with `--prune`.
- [ ] Git, because `origin/` names always show what GitHub has right now.
- [ ] Neither, because GitHub can't delete a branch that you've fetched.
Why: An `origin/` name moves only when Git talks to GitHub. `git fetch --prune` drops names GitHub deleted, and `git ls-remote --heads origin` asks GitHub directly.
```

## Ahead, behind and diverged

`git status` compares your branch with its upstream, and says one of four things:

| `git status` says | It means | What next |
|---|---|---|
| Your branch is up to date with 'origin/main'. | The same commits on both | Nothing |
| Your branch is ahead of 'origin/main' by 2 commits. | 2 commits here that GitHub doesn't have | `git push` |
| Your branch is behind 'origin/main' by 3 commits, and can be fast-forwarded. | 3 commits on GitHub that you don't have | `git pull` |
| Your branch and 'origin/main' have diverged | Both sides have new commits | Combine them (next part), then push |

Those numbers are only as fresh as your last fetch. `git status` doesn't ask GitHub; it compares with Git's memory. So "up to date" can be out of date. Run `git fetch` first when it matters.

`git branch -vv` shows the same for every branch at once, such as `[origin/add-search: ahead 2, behind 1]`. [Branches and worktrees](/learn/branches-and-worktrees) explains its other marks.

When the two sides have diverged, Git won't guess how to combine them. `git push` is refused, because GitHub holds work you don't have. A plain `git pull` stops too, and asks you to choose how to combine: merge or rebase.

```checkpoint stale-up-to-date
A teammate pushed to `main` five minutes ago, but `git status` says your `main` is up to date with `origin/main`. Why?
- [x] You haven't fetched since, and `git status` compares with Git's memory, not GitHub.
- [ ] Their push failed, because `git status` checks GitHub every time you run it.
- [ ] Their push went to another branch, because `main` can't change while you're on it.
Why: `git status` compares your branch with the `origin/` bookmark, which moves only when you fetch. Run `git fetch`, then `git status` again.
```

```checkpoint diverged-push
`git status` says your branch and `origin/main` have diverged, with 1 and 2 different commits. What happens if you `git push` now?
- [x] Git refuses, because GitHub holds 2 commits you don't have.
- [ ] Git pushes your commit, and GitHub's 2 commits are kept beside it.
- [ ] Git pushes your commit, and GitHub's 2 commits are thrown away.
Why: A normal push only moves GitHub's branch forward. When GitHub has work you don't, the push is refused until you combine the two.
```

## Keeping your branch up to date with `main`

While you work on `add-search`, other pull requests land on `main`. Your branch still starts from the older `main`. There are two ways to bring the new commits in.

A **merge** joins the two lines of work. Run `git fetch`, then `git merge origin/main`. Git adds a merge commit, a commit with two parents, and rewrites nothing. So a normal `git push` works afterwards.

A **rebase** replays your branch's commits on top of the newest `main`. Run `git fetch`, then `git rebase origin/main`. The history ends up in one straight line, but your commits are replaced by new copies with new IDs. So pushing needs `git push --force-with-lease`, which replaces GitHub's copy only if nobody else pushed to it since your last fetch.

Pro Git puts the rule for rebasing in one line: "Do not rebase commits that exist outside your repository and that people may have based work on." If you're unsure, merge. On a repo that squash-merges its pull requests, the extra merge commit vanishes into the squash anyway.

On github.com, a pull request can show an Update branch button, which merges `main` into its branch. A menu beside it offers to update with a rebase instead. GitHub shows the button only when the repo asks branches to be up to date before merging, or a setting asks it to always suggest updates.

If both sides changed the same lines, Git stops with a **merge conflict** and waits for you to choose. [Undo and merge conflicts](/learn/undo-and-conflicts) shows how to read and resolve one.

```checkpoint rebase-shared
A teammate has built on your pushed `add-search` branch. An agent offers to rebase it onto `main` and force-push. What do you say?
- [x] No: merge `main` in instead, because rebasing rewrites commits someone has built on.
- [ ] Yes: a rebase keeps the history tidy, and the force-push fixes GitHub's copy.
- [ ] Yes, as long as it uses `--force-with-lease` instead of `--force`.
Why: A rebase replaces your commits with new copies. Never rebase commits that people may have based work on. A merge rewrites nothing.
```

## Signing in to GitHub from the terminal

To push, GitHub needs proof that it's you. Your account password doesn't work for Git any more: GitHub removed password sign-in for Git operations. Instead, you use a **token**, a long password-like key, which a helper stores for you.

The simplest helper is the GitHub CLI. `gh auth login` signs you in through your browser and stores a token. If you pick HTTPS and say yes when it offers to authenticate Git, Git uses the same login when you push. [What Git and GitHub are](/learn/what-git-and-github-are) walks through it, and `gh auth status` checks it.

Git for Windows can also install Git Credential Manager, a helper that signs you in through the browser in the same way. Without a helper, Git asks for a username and password, and the "password" it wants is a personal access token you make on GitHub.

Remote addresses come in two kinds. An HTTPS address, such as `https://github.com/sam-lee/recipes.git`, works everywhere, even behind strict firewalls, and uses a token through a helper. An SSH address, such as `git@github.com:sam-lee/recipes.git`, uses a key pair instead: a private key that stays on your computer, and a public key you add to your GitHub account. Picking SSH in `gh auth login` can make and upload a key for you. Either works, and HTTPS with `gh auth login` is the simplest start. `git remote -v` shows which kind a repo uses, and `git remote set-url origin` with a new address switches it.

```checkpoint password-prompt
You push over HTTPS for the first time, with no helper set up, and Git asks for a password. What do you enter?
- [x] A personal access token, or better, cancel and run `gh auth login` first.
- [ ] Your GitHub account password, which is what Git is asking for.
- [ ] Nothing: leave it empty, and GitHub signs you in by your email.
Why: GitHub removed password sign-in for Git. When Git asks for a password, it needs a token, and `gh auth login` sets one up for you.
```

## Forks, in short

A **fork** is a new repo that starts as a copy of someone else's, under your account, with its own settings. It stays connected to the original, which GitHub calls the upstream repo. You fork to propose changes to a project you can't push to.

On github.com, open the repo and click Fork, in the top-right corner. Pick yourself as the owner, and create the fork. Then clone your fork, not the original.

In that clone, `origin` is your fork. Add the original as `upstream`:

```sh
git remote add upstream https://github.com/family-cooks/recipes.git
```

`gh repo fork family-cooks/recipes --clone` does both steps for you. To bring in new work from the original, use the Sync fork button on your fork's page, or run `git fetch upstream`, then `git merge upstream/main`, then push. To propose your change, push a branch to your fork and open a pull request into the original repo.

One trap: in a clone of a fork, `gh` treats the original repo as the default for Issues and pull requests. That's handy for a pull request, but a new Issue can land in someone else's repo. Agents working in forks have filed Issues into the wrong repo this way. Before the first `gh issue create`, check the target with `gh repo view --json nameWithOwner`.

```checkpoint fork-default
You cloned your fork of `family-cooks/recipes` with `gh`. You want to file an Issue in your own fork. What do you check first?
- [x] The target repo, with `gh repo view --json nameWithOwner`, because `gh` may default to the original.
- [ ] Nothing, because `gh` always files Issues in the repo you cloned.
- [ ] Your SSH key, because forks can only be reached over SSH.
Why: In a clone of a fork, `gh` treats the original as the default repo. A quick check stops an Issue landing in someone else's repo.
```

## Tell your agent

Pushing is where an agent's mistakes leave your computer, so ask for exactly what you want. For example:

> Push the `add-search` branch to `origin` and set its upstream. Don't force-push, and don't push to `main`. Then show me `git status` and `git log --oneline -3 origin/add-search`.

Then check it yourself. `git status` should say your branch is up to date with `origin/add-search`. `git ls-remote --heads origin add-search` asks GitHub directly whether the branch is there. On github.com, the branch shows in the branch menu.

Two habits keep pushes safe with agents. If a push is refused, the fix is to fetch and combine, not to force it. And Git can run checks of its own before a push, called hooks: `--no-verify` skips them, so don't let an agent use it to get past one. [git-guardrails-claude-code](/learn/git-guardrails-claude-code) is a Skill that blocks risky Git commands, pushes included, so you run those yourself.

```checkpoint refused-push-agent
An agent's push is refused, because GitHub has commits it doesn't have. It offers to run `git push --force`. What do you tell it?
- [x] No: fetch, combine GitHub's commits with yours, then push normally.
- [ ] Yes: force-pushing is the usual fix for a refused push.
- [ ] Yes, but only with `--no-verify`, so nothing slows it down.
Why: A force push would throw away the commits GitHub has and you don't. Fetch, merge them in, and a normal push goes through.
```

## Try it

````try
You need Git, a GitHub account, and a way to sign in from the terminal, such as `gh auth login`. You also need a practice repo with a commit or two, such as the `recipes` repo from [What Git and GitHub are](/learn/what-git-and-github-are). Run the commands inside that folder.

1. On github.com, open the + menu in the top-right corner and choose New repository. Name it `recipes`, choose Private, leave the README, `.gitignore` and license off, and create it.

   With `gh` instead, run `gh repo create recipes --private --source=. --push`, then skip to step 5.
2. Connect your repo to it, with your own username:

   ```sh
   git remote add origin https://github.com/YOUR-USERNAME/recipes.git
   ```

3. Check the remote:

   ```sh
   git remote -v
   ```

   You should see two `origin` lines, one for fetch and one for push.
4. Push `main` and set its upstream:

   ```sh
   git push -u origin main
   ```

   You should see `branch 'main' set up to track 'origin/main'.`
5. Reload the repo's page on github.com. You should see your README and your commits.
6. On github.com, open `README.md`, click the pencil icon to edit it, add a line, and commit the change to `main`.
7. Back in the terminal, ask Git:

   ```sh
   git status
   ```

   You should still see `up to date with 'origin/main'`, because Git hasn't talked to GitHub since.
8. Fetch:

   ```sh
   git fetch
   ```

9. Ask again:

   ```sh
   git status
   ```

   You should now see `behind 'origin/main' by 1 commit, and can be fast-forwarded`.
10. Pull it in:

    ```sh
    git pull
    ```

    You should see `Fast-forward`, and `README.md` with your new line.
11. Make a branch with one commit on it:

    ```sh
    git switch -c add-notes
    echo "Notes go here." > NOTES.md
    git add NOTES.md
    git commit -m "Add a notes file"
    ```

12. Push the new branch:

    ```sh
    git push -u origin add-notes
    ```

    You should see GitHub's link to create a pull request for `add-notes`. Keep it for [Opening a pull request](/learn/pull-requests).
13. Read the tracking:

    ```sh
    git branch -vv
    ```

    You should see `add-notes` tracking `[origin/add-notes]`, and `main` tracking `[origin/main]`.
````

## Remember

```flashcards
Q: What is a remote?
A: A copy of your repo that lives somewhere else, usually on GitHub, known by a short name and a URL. `git remote -v` lists them.

Q: What do `origin` and `upstream` usually name?
A: `origin` is your own repo on GitHub, where you push. `upstream` is the repo you started from, such as the original of a fork, which you only read from.

Q: What does `git clone` set up?
A: The full history, a folder named after the repo, a remote called `origin`, the default branch checked out, and that branch tracking GitHub's copy.

Q: What does `-u` do in `git push -u origin add-search`?
A: It records `origin/add-search` as the branch's upstream, so later a plain `git push` or `git pull` knows where to go.

Q: What's the difference between `git fetch` and `git pull`?
A: Fetch downloads new commits and moves the `origin/` names, changing none of your files. Pull fetches, then brings the commits into your branch.

Q: What is `origin/main`?
A: A remote-tracking branch: Git's memory of where GitHub's `main` was the last time Git talked to GitHub. It moves only when you fetch, pull or push.

Q: `git status` says "ahead by 2", "behind by 3" or "diverged". What next in each case?
A: Ahead: push. Behind: pull. Diverged: combine the two, by merging or rebasing, then push. Fetch first, because the numbers are only as fresh as your last fetch.

Q: Merge or rebase to bring `main` into your branch?
A: Merge rewrites nothing, so it's always safe to push. Rebase rewrites your commits, so never rebase commits others may have built on.

Q: Why doesn't your GitHub password work for `git push`?
A: GitHub removed password sign-in for Git. Use a token, stored by a helper such as `gh auth login` or Git Credential Manager.

Q: What is a fork?
A: A new repo that starts as a copy of someone else's, under your account, connected to the original. You fork to propose changes you can't push directly.
```

## Final test

```final-test what-origin-is
You cloned the recipe site from your own GitHub account. What is `origin`?
- [x] The name Git gave the GitHub repo you cloned from, where you push.
- [ ] The very first commit in the repo, where the history starts.
- [ ] The default branch of the repo, which GitHub names `main`.
- [ ] A backup copy of your folder that Git keeps on your computer.
Why: A clone names the remote it came from `origin`. It's your own repo on GitHub, so it's where you push.
```

```final-test first-push-new-branch
You've committed on a new branch, `add-servings`, and want it on GitHub with tracking set up. Which command?
- [x] `git push -u origin add-servings`
- [ ] `git pull origin add-servings`
- [ ] `git fetch -u origin add-servings`
- [ ] `git remote add origin add-servings`
Why: `git push` sends the branch's commits, and `-u` records GitHub's copy as its upstream, so later pushes and pulls know where to go.
```

```final-test fetch-safe
You want to look at a teammate's new commits on GitHub before they touch your work. What do you run first?
- [x] `git fetch`, then look at `origin/main` with `git log`.
- [ ] `git pull`, then undo it if you don't like the commits.
- [ ] `git push`, which shows GitHub's commits as it sends yours.
- [ ] `git clone` again, into a second folder beside the first.
Why: `git fetch` downloads the commits and moves Git's memory of GitHub, without changing your files or branches. Then you can read them first.
```

```final-test behind-what-next
`git status` says "Your branch is behind 'origin/main' by 2 commits, and can be fast-forwarded." What do you do?
- [x] `git pull`, which moves your branch forward to GitHub's newest commit.
- [ ] `git push`, which sends your 2 missing commits up to GitHub.
- [ ] `git push --force`, which makes GitHub match your branch.
Why: Behind means GitHub has 2 commits you don't. With no new commits of your own, a pull fast-forwards your branch to match.
```

```final-test empty-github-repo
You made the `recipes` repo on your laptop, and now create its GitHub repo with "Add a README" ticked. What happens at `git push -u origin main`?
- [x] The push is refused, because GitHub's repo holds a commit yours doesn't have.
- [ ] The push works, and GitHub merges the two READMEs into one file.
- [ ] The push works, and GitHub's README is quietly replaced by yours.
Why: The GitHub repo must start empty. A commit made there is work your repo doesn't have, so Git refuses a push that would throw it away.
```

```final-test rebase-rule
Which way of bringing `main` into a branch that a teammate is also working on is safe?
- [x] Merging `main` into the branch, which rewrites no commits.
- [ ] Rebasing the branch onto `main`, then force-pushing it.
- [ ] Deleting the branch on GitHub, then pushing it again.
Why: A rebase replaces commits with new copies, which breaks the work of anyone who built on them. A merge rewrites nothing.
```

```final-test password-removed
Your first push over HTTPS asks for a password. You type your GitHub account password, and the push fails. Why?
- [x] GitHub removed password sign-in for Git; it needs a token, which `gh auth login` sets up.
- [ ] HTTPS pushes need an SSH key, so the password is the wrong kind of key.
- [ ] The password was right, but GitHub refuses pushes to new repos for a day.
Why: Git over HTTPS needs a token instead of your password. A helper such as `gh auth login` stores one and hands it to Git.
```

```final-test fork-remotes
You forked `family-cooks/recipes` and cloned your fork. Which remote setup is right?
- [x] `origin` is your fork, and `upstream` is `family-cooks/recipes`.
- [ ] `origin` is `family-cooks/recipes`, and `upstream` is your fork.
- [ ] Both names point at your fork, one for fetch and one for push.
- [ ] Only `origin`, because a fork can't fetch from the original.
Why: You push to your own fork, so it's `origin`. The original is the repo you only read from, so it's `upstream`.
```

```final-test agent-force-push
An agent's push to `add-search` is refused, because a teammate pushed to that branch an hour ago. Spot the right fix.
- [x] Fetch, merge the teammate's commits into the branch, then push normally.
- [ ] Push with `--force`, so GitHub's branch matches the agent's copy.
- [ ] Push with `--no-verify`, so Git skips its checks before the push.
- [ ] Delete the branch on GitHub, then push the agent's copy again.
Why: The refusal protects the teammate's commits. Fetching and combining keeps both sides' work, and then a normal push goes through.
```

```sources
- [Pro Git, Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes), Scott Chacon and Ben Straub
- [Pro Git, Remote Branches](https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches), Scott Chacon and Ben Straub
- [Pro Git, Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing), Scott Chacon and Ben Straub
- [git-clone](https://git-scm.com/docs/git-clone), the Git project
- [git-remote](https://git-scm.com/docs/git-remote), the Git project
- [git-fetch](https://git-scm.com/docs/git-fetch), the Git project
- [git-pull](https://git-scm.com/docs/git-pull), the Git project
- [git-push](https://git-scm.com/docs/git-push), the Git project
- [git-status](https://git-scm.com/docs/git-status), the Git project
- [About remote repositories](https://docs.github.com/en/get-started/git-basics/about-remote-repositories), GitHub Docs
- [Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository), GitHub Docs
- [Downloading source code archives](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives), GitHub Docs
- [Quickstart for repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories), GitHub Docs
- [Keeping your pull request in sync with the base branch](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch), GitHub Docs
- [Fork a repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo), GitHub Docs
- [Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork), GitHub Docs
- [Forks](https://docs.github.com/en/pull-requests/reference/forks), GitHub Docs
- [gh auth login](https://cli.github.com/manual/gh_auth_login), GitHub CLI manual
- [gh auth setup-git](https://cli.github.com/manual/gh_auth_setup-git), GitHub CLI manual
- [gh repo clone](https://cli.github.com/manual/gh_repo_clone), GitHub CLI manual
- [gh repo create](https://cli.github.com/manual/gh_repo_create), GitHub CLI manual
- [gh repo fork](https://cli.github.com/manual/gh_repo_fork), GitHub CLI manual
- [Working with repositories and remotes](https://code.visualstudio.com/docs/sourcecontrol/repos-remotes), Visual Studio Code Docs
- [cicd-lab-starter: Start your own repository](https://github.com/bradtraversy/cicd-lab-starter), Brad Traversy
- [CI/CD Crash Course: Commands and Code](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), Brad Traversy
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
```
