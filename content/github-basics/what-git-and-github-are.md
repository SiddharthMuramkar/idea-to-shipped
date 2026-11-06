---
title: What Git and GitHub are
slug: what-git-and-github-are
summary: What Git and GitHub are, how they differ, and how to install Git, open a GitHub account and get the optional gh tool ready.
---

Say you're building a small recipe website with a coding agent. On Monday the recipe list works. On Tuesday the agent changes twelve files, and the list is blank. Which change broke it, and how do you get Monday's version back? Without a record of every version, you can't answer either question.

```goals
- Say in plain words what Git, a repository, a commit and the history are.
- Tell Git from GitHub, and name what GitHub adds: hosting, Issues, pull requests and Actions.
- Install Git, check it with `git --version`, and tell it who you are.
- Open a GitHub account and, if you want it, sign in to the `gh` tool.
- Know what to ask a coding agent about all this, and how to check its answer.
```

## Two tools, two jobs

**Git records your project's history on your computer; GitHub keeps a copy online, where people and tools work on it together.**

Git is a program. It answers Tuesday's questions: it lists every saved version of the recipe site, shows what changed, and brings back an old one. GitHub is a website. It holds a copy of the same project, so a teammate, a reviewer or an automatic test can reach it.

For example, here is the start of the recipe site's history, as Git lists it. Each line is one saved version, newest first, with a short ID and a message:

```text
$ git log --oneline
9c41d5a (HEAD -> main) Show cooking time on each recipe
7b2e8d0 Add a page for each recipe
5d6c0f2 Add a README
```

The command `git log --oneline` printed that list. On the newest line, `(HEAD -> main)` marks where you are: on `main`, the project's main line of work.

Nothing in that list needed the internet. GitHub would show the same three versions, but only after you send them there.

```checkpoint two-jobs
A teammate in another city wants to see the recipe site's history. What do you need besides Git?
- [x] GitHub, which keeps a copy of the history online where they can reach it.
- [ ] Nothing, because Git shares every saved version with your teammates by itself.
- [ ] A second Git, installed on their computer, which reads your laptop's history.
Why: Git records the history on your computer. GitHub keeps a copy online, where people and tools can work on it together.
```

## What Git does: repositories, commits and history

**Version control** is keeping a record of changes to your files over time, so you can go back to any version later. Git is a version control system.

A **repository**, or **repo**, is a project folder that Git tracks. Inside it sits a hidden `.git` folder, which holds the whole history. Delete `.git` and your files stay where they are, but the history is gone.

A **commit** is a saved snapshot of the whole project, with a message saying what changed. You decide when to make one. Git never saves a version on its own, so work you haven't committed isn't in the history yet.

The **history** is the chain of commits, each one pointing back to the commit before it. A **branch** is a name, such as `main`, that points at the newest commit of one line of work. You'll meet branches properly in [Branches and worktrees](/learn/branches-and-worktrees).

Git works on your computer, with or without the internet. Making a commit, reading the history and comparing two versions are all local. Only sending commits to another copy, or fetching them from one, needs a network.

```checkpoint delete-dot-git
You delete the hidden `.git` folder inside your `recipes` project. What happens?
- [x] Your files stay, but the history of every commit is gone.
- [ ] Your files and the history both disappear from the folder.
- [ ] Nothing changes, because Git keeps a spare copy of `.git` elsewhere.
Why: The `.git` folder holds the whole history. Deleting it leaves your files alone, but the record of every commit goes with it.
```

```checkpoint commit-offline
You make three commits on a train with no internet. Where are they?
- [x] In the repo on your laptop, because commits are made locally.
- [ ] Nowhere yet, because Git waits for a connection before it commits.
- [ ] On GitHub, which takes the commits as soon as you get a signal.
Why: Making a commit is local. The three commits sit in your repo's history until you send them to another copy.
```

## What GitHub adds

GitHub is a website that hosts Git repositories. A **remote** is a copy of your repo that lives somewhere else, usually on GitHub. An online copy is a backup, and a place other people can reach.

To **push** is to send your new commits up to a remote, and to **pull** is to bring new commits down from it. Neither happens by itself. You'll do both in [Push, pull and remotes](/learn/push-pull-and-remotes).

To **clone** is the third move: downloading a full copy of a repo from GitHub, with every version of every file. On github.com, a repo's page lists its files and has a green Code button for copying the repo's address. Below the files it shows the **README**: a file, usually `README.md`, that says what the project is and how to start.

On top of the copy, GitHub adds tools for working together. Each one has its own tab on a repo's page:

- **Issues**: the repo's list of work. Each Issue is one bug, idea or task, with a page for discussing it. You close it when it's done.
- **Pull requests**: a pull request (PR) asks to merge the changes on one branch into another, usually `main`. Its page shows the changes, so people and checks can review them before they land.
- **Actions**: GitHub's built-in automation. When something happens in the repo, such as a new pull request, it runs the tasks you wrote down, such as your tests.

A **coding agent** is an AI program, such as Claude Code, that runs commands and edits files on your computer. Each session of an agent starts fresh: unless told, it doesn't know what's planned or finished. Matt Pocock puts the problem this way: "AI agents are like super-smart experts who forget everything between tasks."

So the list of work lives outside the agent, as Issues on GitHub, where the next session can read it. [Issues: keeping track of work](/learn/issues-and-keeping-track) shows how.

```checkpoint which-github-feature
You want your tests to run by themselves every time someone opens a pull request. Which GitHub feature does that?
- [x] Actions, which runs the tasks you wrote down when something happens in the repo.
- [ ] Issues, which keeps the repo's list of bugs, ideas and tasks to work on.
- [ ] Pull requests, which ask to merge one branch's changes into another.
Why: Actions is GitHub's built-in automation. When an event happens, such as a new pull request, it runs the tasks you wrote down, such as your tests.
```

## Git or GitHub?

The two names are easy to mix up. This table keeps them apart:

| | Git | GitHub |
|---|---|---|
| What it is | A program on your computer | A website and service |
| What it does | Records your project's history in commits | Keeps a copy of your repo online, and adds Issues, pull requests and Actions |
| Needs the internet? | No | Yes |
| Where your commits are | In the `.git` folder of your project | On github.com, once you push them |

Git came first. Linus Torvalds and the Linux community built it in 2005, to manage the code of Linux. GitHub came later, as a place to host Git repos and work on them together.

You can use Git with no GitHub at all. You can also edit a file on github.com with no Git installed, and GitHub makes the commit for you. But most work uses Git on your computer, and so does a coding agent in your terminal.

Other sites host Git repos too, such as GitLab and Bitbucket. Git works the same there, but the website's buttons and names differ: GitLab calls a pull request a merge request.

```checkpoint committed-not-pushed
A friend says "I saved it to GitHub", but all they ran was `git commit`. Where is their new commit?
- [x] Only on their computer, until they push it to GitHub.
- [ ] On GitHub, because a commit goes online as soon as it's made.
- [ ] In both places, because Git and GitHub are the same thing.
Why: A commit is made in the repo on your computer. It reaches GitHub only when you push it.
```

## Install Git and tell it who you are

A **terminal** is a window where you type commands, one line at a time, and read what they print. On macOS, open the Terminal app. On Linux, open your terminal app. On Windows, use Git Bash, which comes with Git for Windows. No Git Bash in your Start menu? Install Git for Windows first (below), then open Git Bash.

First, check whether Git is already there:

```sh
git --version
```

If you see a version, such as `git version 2.56.0`, Git is installed. If not, install it:

- On macOS, running `git --version` offers to install Apple's Command Line Tools, which include Git. Accept it. If you use Homebrew, a tool that installs programs from the terminal, `brew install git` works too.
- On Windows, download Git for Windows from git-scm.com and run the installer. It adds Git Bash.
- On Linux, use your package manager: `sudo apt install git` on Debian or Ubuntu, or `sudo dnf install git` on Fedora.

Then tell Git who you are, once per computer. Every commit records this name and email, and they stay baked into it for good.

```sh
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

`--global` means "for every repo on this computer". The third line names the first branch of each new repo `main`, the name GitHub uses. Without it, Git may name that branch `master`.

Want to keep your email private? GitHub gives you a `noreply` address on its Settings page, under Emails. Use that address as your `user.email`.

```checkpoint why-user-email
Why set `user.email` before your first commit?
- [x] Every commit records the name and email set in Git, baked into it for good.
- [ ] Git sends a copy of each commit to that email address, as a backup.
- [ ] GitHub signs you in with that email address whenever you push.
Why: Every commit records your name and email, and they stay baked into it. So set them before the first one.
```

## Open a GitHub account

An account is free. To open one:

1. Go to [github.com/signup](https://github.com/signup).
2. Follow the prompts for your email, a password and a username. You can also sign up with a Google or Apple account.
3. Verify your email address with the code GitHub sends you.

Your username appears in the address of every repo you own, such as `https://github.com/your-username/recipes`. So pick one you're happy to show.

A free account can hold public and private repos. A **public** repo can be seen by anyone on the internet. A **private** repo can be seen only by you and the people you invite.

Then turn on **two-factor authentication** (2FA): a second proof at sign-in, such as a code from an app on your phone. GitHub strongly recommends it, and requires it for many accounts that contribute code.

```checkpoint which-visibility
You're making a repo for a client's half-built site, which you don't want strangers to read. Which visibility fits?
- [x] Private, so only you and the people you invite can see it.
- [ ] Public, so that GitHub can keep an online copy of it.
- [ ] Either, because nobody can open a repo without its owner's password.
Why: A public repo can be seen by anyone on the internet. A private one only by you and the people you invite, and both are kept online.
```

## The GitHub CLI, `gh` (optional)

The **GitHub CLI**, `gh`, is GitHub's own command-line tool: CLI is short for command-line interface. It does GitHub things from the terminal: create a repo, open a pull request, list Issues. Git can't do those. Git moves commits; `gh` works with GitHub's features.

You don't need `gh` to use GitHub, because the everyday actions all have a button on github.com. Coding agents use it a lot, though, and later lessons show its commands next to the click paths. To install it:

- On macOS, with Homebrew: `brew install gh`. No Homebrew? Install it from [brew.sh](https://brew.sh), then run the commands it shows under "Next steps". Or skip `gh` for now.
- On Windows: `winget install --id GitHub.cli --source winget`. Then close the terminal and open a new window: one that was open during the install won't find `gh`.
- On Linux: follow GitHub's instructions for your distribution, linked from cli.github.com.

Sign in once, in your own terminal:

```sh
gh auth login
```

It asks a few questions, and their order can change between versions of `gh`. Answer them like this:

- Where you use GitHub: pick GitHub.com.
- How to authenticate: pick Login with a web browser.
- Protocol for Git operations: pick HTTPS.
- Authenticate Git with your GitHub credentials: say yes.

It may also print a tip about expiring tokens, which you can ignore. Then `gh` shows a one-time code. Press Enter to open your browser, and paste the code into the page that opens.

`gh` keeps a **token**, a long password-like key that proves who you are, in your computer's credential store. Because you said yes, Git uses the same login when you push. To check, run `gh auth status`: it should say you're logged in to github.com, with your username.

```checkpoint gh-or-git
An agent needs to open a pull request from the terminal. Which tool does it use?
- [x] `gh`, because opening a pull request is a GitHub feature, not a Git one.
- [ ] `git`, because pull requests are part of every Git repo's history.
- [ ] Neither, because pull requests can only be opened by clicking on github.com.
Why: Git moves commits. `gh` works with GitHub's features, such as pull requests and Issues, from the terminal.
```

## Working with a coding agent

An agent runs in your terminal, with your tools and your identity. Its commits carry the name and email you set in Git. Anything it does with `gh` is done as your GitHub account. So the agent's work shows up as yours.

That's why you set up Git and sign in to `gh` yourself. Then ask the agent to check, and show you the evidence. For example:

> Check that Git and the GitHub CLI are installed and signed in. Run `git --version`, `git config --global user.name`, `git config --global user.email` and `gh auth status`. Show me each output. Don't change any settings.

Its summary is a claim; the outputs are the evidence. Read them, or run the same four commands in your own terminal.

Never paste a password or a token into the chat. If something needs signing in, run `gh auth login` yourself.

```checkpoint paste-token
An agent offers to sign you in to GitHub if you paste your token into the chat. What do you do?
- [x] Decline, and run `gh auth login` yourself in your own terminal.
- [ ] Paste it, since the agent works as your account anyway.
- [ ] Paste it, then ask the agent to delete it once it's done.
Why: Never paste a password or token into the chat. `gh auth login` signs you in through your browser and stores the token safely.
```

## Where to go from here

GitHub from zero follows one change from start to finish, the way GitHub suggests. GitHub calls it **GitHub flow**: make a branch, commit and push your changes, open a pull request, merge it, then delete the branch.

Four lessons give you the Git half:

- [Reading a repository](/learn/reading-a-repository): what each common file and folder is for.
- [Commits and diffs](/learn/commits-and-diffs): what a commit holds, and how to read a change.
- [Branches and worktrees](/learn/branches-and-worktrees): keeping work off `main`.
- [Push, pull and remotes](/learn/push-pull-and-remotes): moving commits to and from GitHub.

Then come the GitHub half and the habits: [Issues](/learn/issues-and-keeping-track), [pull requests](/learn/pull-requests), [checking a pull request](/learn/checking-a-pr), [merging](/learn/merging-and-cleaning-up) and [undoing mistakes](/learn/undo-and-conflicts).

```checkpoint github-flow-order
In GitHub flow, which order does one change take?
- [x] Make a branch, commit and push, open a pull request, merge it, delete the branch.
- [ ] Open a pull request, make a branch, merge it, then commit and push the work.
- [ ] Commit to `main`, push it, open a pull request, then make a branch for it.
Why: GitHub flow starts with a branch. You commit and push on it, open a pull request, merge, and delete the branch.
```

## Try it

````try
You need a terminal and about ten minutes. On Windows, use Git Bash, and if you don't have it yet, install Git for Windows first (see above). This makes a practice `recipes` repo on your computer, with one commit.

1. Check that Git is installed:

   ```sh
   git --version
   ```

   You should see a version line. If not, install Git first (see above).
2. Set your name, with your own name in the quotes:

   ```sh
   git config --global user.name "Your Name"
   ```

3. Set your email, or your GitHub `noreply` address:

   ```sh
   git config --global user.email "you@example.com"
   ```

4. Name the first branch of new repos `main`:

   ```sh
   git config --global init.defaultBranch main
   ```

5. Make a folder for the practice repo, and go into it:

   ```sh
   mkdir recipes && cd recipes
   ```

6. Turn the folder into a repo:

   ```sh
   git init
   ```

   You should see `Initialized empty Git repository`, ending in `recipes/.git/`.
7. Make a first file:

   ```sh
   echo "# Recipes" > README.md
   ```

8. Tell Git to include it in the next commit:

   ```sh
   git add README.md
   ```

9. Make the commit:

   ```sh
   git commit -m "Add a README"
   ```

   You should see a line starting `[main (root-commit)`, then `1 file changed`.
10. List the history:

    ```sh
    git log --oneline
    ```

    You should see one line: a short ID, `(HEAD -> main)` and `Add a README`.
11. Optional: if you installed `gh`, check that you're signed in:

    ```sh
    gh auth status
    ```

    You should see that you're logged in to github.com, with your username.

Keep this folder. [Push, pull and remotes](/learn/push-pull-and-remotes) puts it on GitHub, and [Commits and diffs](/learn/commits-and-diffs) explains `git add` and `git commit` in depth.
````

## Remember

```flashcards
Q: What is Git?
A: A version control program on your computer. It records your project's history as commits, and works without the internet.

Q: What is GitHub?
A: A website that keeps a copy of your Git repo online, and adds Issues, pull requests and Actions for working together.

Q: What is a repository?
A: A project folder that Git tracks. Its hidden `.git` folder holds the whole history.

Q: What is a commit?
A: A saved snapshot of the whole project, with a message saying what changed. You decide when to make one.

Q: What do push, pull and clone mean?
A: Push sends your new commits to a remote copy. Pull brings new commits down from it. Clone downloads a full copy of a repo, history and all.

Q: What three settings do you give Git once per computer?
A: `user.name`, `user.email` and `init.defaultBranch main`, each with `git config --global`.

Q: What is `gh`, and is it required?
A: The GitHub CLI: GitHub's tool for its features, such as pull requests and Issues, from the terminal. It's optional, but agents use it a lot.

Q: Whose name is on a commit an agent makes in your terminal?
A: Yours: it uses the name and email set in your Git. Anything it does with `gh` is done as your GitHub account.
```

## Final test

```final-test git-versus-github
Which statement about Git and GitHub is right?
- [x] Git records the history on your computer; GitHub keeps a copy online with tools for working together.
- [ ] GitHub records the history on your computer; Git keeps a copy online with tools for working together.
- [ ] Git and GitHub are two names for one program, the one you install from git-scm.com.
- [ ] Git needs GitHub to make commits, so it stops working whenever you're offline.
Why: Git is a program that records your project's history locally. GitHub is a website that hosts a copy and adds Issues, pull requests and Actions.
```

```final-test what-a-commit-is
What is a commit?
- [x] A saved snapshot of the whole project, with a message saying what changed.
- [ ] A copy of the project that Git saves by itself every few minutes.
- [ ] A request, kept on GitHub, to merge one branch into another.
- [ ] A list of the files you changed today, kept until you push them.
Why: A commit is a snapshot of the whole project, plus a message. You decide when to make one. A request to merge is a pull request.
```

```final-test train-commits
You commit twice on a train, offline, then open your repo's page on github.com from your phone. What do you see?
- [x] Neither commit, because they reach GitHub only when you push them.
- [ ] Both commits, because GitHub copies them the moment you're back online.
- [ ] Both commits, marked as waiting, because GitHub saw you make them.
Why: Commits are made in the repo on your computer. GitHub gets them only when you push.
```

```final-test missing-history
An agent "tidies up" your `recipes` folder and deletes the hidden `.git` folder. Your files are all still there. What did you lose?
- [x] The history: every commit and its message.
- [ ] Nothing, because GitHub rebuilds `.git` by itself.
- [ ] Your files, which Git will now delete one by one.
- [ ] Only your Git name and email settings.
Why: `.git` holds the whole history. The files stay, but without `.git` the folder is no longer a repo with a history.
```

```final-test which-feature-fits
You find a bug in the recipe search, and you want it written down where any session of your agent can find it later. Which GitHub feature fits?
- [x] An Issue, the repo's list of bugs, ideas and tasks.
- [ ] A pull request, which proposes merging a branch.
- [ ] Actions, which runs your tests on each change.
- [ ] A commit, which records the project's files.
Why: Each agent session starts fresh, so the list of work lives outside it, as Issues on GitHub, where the next session can read it.
```

```final-test set-identity-first
You're about to make your first commit on a new laptop. What should you have done first?
- [x] Set `user.name` and `user.email` with `git config --global`.
- [ ] Signed in with `gh auth login`, which Git needs to commit.
- [ ] Made a GitHub repo, because commits need one to exist.
- [ ] Installed the GitHub CLI, which records who made each commit.
Why: Every commit records the name and email set in Git, and they stay baked into it. Committing needs no GitHub repo and no `gh`.
```

```final-test agent-identity
An agent commits in your terminal, then opens a pull request with `gh`. Whose name is the commit's author, and whose account opens the pull request?
- [x] Yours both times: the commit uses your Git name and email, and `gh` acts as your account.
- [ ] The agent's both times: it signs up for a GitHub account of its own for the job.
- [ ] Nobody's: commits and pull requests made by agents are anonymous on GitHub.
Why: The agent runs with your tools and identity. Its commits carry your Git name and email, and `gh` works as your GitHub account.
```

```final-test spot-the-token-mistake
Spot the mistake. To save time, you paste your GitHub token into the agent's chat so it can push for you.
- [x] A token is like a password: never paste it into the chat; sign in with `gh auth login` yourself.
- [ ] Nothing is wrong, as long as you delete the chat afterwards.
- [ ] The mistake is using a token at all, since GitHub accepts your account password for pushes.
Why: A token proves who you are, like a password. Run `gh auth login` in your own terminal, and Git can use that login when it pushes.
```

```sources
- [Pro Git, About Version Control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control), Scott Chacon and Ben Straub
- [Pro Git, A Short History of Git](https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git), Scott Chacon and Ben Straub
- [Pro Git, What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F), Scott Chacon and Ben Straub
- [Pro Git, Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), Scott Chacon and Ben Straub
- [Pro Git, First-Time Git Setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup), Scott Chacon and Ben Straub
- [Install Git for Windows](https://git-scm.com/install/windows), the Git project
- [Install Git for macOS](https://git-scm.com/install/mac), the Git project
- [Install Git for Linux](https://git-scm.com/install/linux), the Git project
- [About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories), GitHub Docs
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions), GitHub Docs
- [Creating an account on GitHub](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github), GitHub Docs
- [About mandatory two-factor authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/about-mandatory-two-factor-authentication), GitHub Docs
- [Setting your commit email address](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address), GitHub Docs
- [GitHub CLI](https://cli.github.com/), GitHub
- [gh auth login](https://cli.github.com/manual/gh_auth_login), GitHub CLI manual
- [gh auth status](https://cli.github.com/manual/gh_auth_status), GitHub CLI manual
- [Installing gh on Windows](https://github.com/cli/cli/blob/trunk/docs/install_windows.md), GitHub CLI
- [Installing gh on macOS](https://github.com/cli/cli/blob/trunk/docs/install_macos.md), GitHub CLI
- [11 Tips For AI Coding With Ralph Wiggum](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum), Matt Pocock, 2026-01-08
```
