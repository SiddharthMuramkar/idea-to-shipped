---
title: Issues: keeping track of work
slug: issues-and-keeping-track
summary: What a GitHub Issue is, how to write and read one, and how labels, assignees, sub-issues and a Closes line keep work on track.
---

Say you're building a small recipe website. Search misses "Soup" with a capital S, a friend has asked for search by ingredient, and the About page has a broken link. A week later, which of these is fixed, and who is working on the rest? If the list lives in your head, on a sticky note or in one chat with a coding agent, it gets lost.

```goals
- Write an Issue that a teammate or a coding agent could act on, on github.com or with `gh issue create`.
- Read a long Issue quickly, knowing which parts to read first and which can wait.
- Use labels and assignees to show what an Issue needs next and who is on it.
- Link a pull request to its Issue with `Closes #12`, so merging the pull request closes the Issue.
- Split bigger work into a task list or sub-issues, and mark which Issue waits for which.
- Ask a coding agent to file, update or close Issues, and check what it did.
```

## What an Issue is

GitHub keeps that list for you. Every **repository** (a project's files and their history, as [What Git and GitHub are](/learn/what-git-and-github-are) explains) has an **Issues** tab.

An **Issue** is one piece of work written down on GitHub: a title, a description, and a conversation underneath. GitHub numbers each one, so "#12" always means the same Issue in that repo.

**Give every piece of work its own Issue: open while it waits, closed once it's done.**

A repo's whole list of Issues is its **Issue tracker**. Everyone with access to the repo sees the same list. So it doesn't matter who wrote an Issue down, or when.

```checkpoint quick-1
You fixed the About page's broken link last week, but its Issue is still open. What does the tracker tell everyone who looks?
- [x] That the work is still waiting, because an open Issue means not done.
- [ ] That the work is done, because the fix is already in the code.
- [ ] Nothing, because the tracker only lists the Issues filed this week.
Why: An Issue is open while the work waits and closed once it's done. Nobody reading the tracker can see your fix, so close the Issue when the work is finished.
```

You can read the list in a browser, or in a terminal with `gh`, GitHub's command-line tool. For example, in the `recipes` repo:

```sh
gh issue list
```

```text
Showing 4 of 4 open issues in your-name/recipes

ID   TITLE                           LABELS       UPDATED
#13  Search by ingredient            enhancement  about 1 day ago
#12  Search ignores capital letters  bug          about 2 days ago
#10  Better search                                about 1 day ago
#9   Broken link on the About page   bug          about 3 days ago
```

The LABELS column shows each Issue's labels, which you'll meet below.

A **coding agent** is an AI program, such as Claude Code, that edits files and runs commands for you. It needs this list even more than you do, because each new session starts fresh: unless told, it doesn't know what's planned or finished. Anthropic, the company behind Claude Code, has a picture for this. It's like "engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift."

So the notes have to live where the next shift can read them, and an Issue is such a place. [How coding agents work](/learn/how-agents-work) explains why each session starts fresh.

```checkpoint quick-2
Tomorrow, a fresh agent session will pick up the search bug. Where should today's notes about it be?
- [x] In Issue #12, where any later session or person can read them.
- [ ] In today's chat with the agent, which tomorrow's session reads by itself.
- [ ] In the agent's memory, which saves today's whole chat for tomorrow.
Why: Each new agent session starts fresh: unless told, it doesn't know what's planned or finished. Notes in Issue #12 are there for whoever picks the work up next, person or agent.
```

## Writing a good Issue

A good Issue lets someone who wasn't there do the work. That might be a teammate, you next month, or an agent. It holds four things:

- A title that says what's wrong or wanted, in a few words: "Search ignores capital letters", not "Bug".
- What happens now, and what should happen instead.
- The steps to see it for yourself.
- How you'll know it's done: one or two checks anyone could run. These are the Issue's **acceptance criteria**.

For example, Issue #12's description could read:

```markdown
Searching for "Soup" finds nothing. Searching for "soup" finds Tomato soup.

Steps: open the home page and type Soup in the search box.

Done when: "Soup", "SOUP" and "soup" all show Tomato soup.
```

The description is written in **Markdown**: plain text with light formatting, where `-` starts a list item and `**word**` makes a word bold. GitHub shows it formatted.

The "Done when" line matters most when an agent does the work. A **Skill** is a named set of instructions an agent loads for one job. Matt Pocock's [triage](/learn/triage) Skill, for sorting Issues, puts it plainly: "The agent needs to know when it's done."

A line like "search should work" gives nobody anything to check. Name something you could see or run.

```checkpoint quick-3
Which "Done when" line could an agent check for itself?
- [x] "Soup", "SOUP" and "soup" all show Tomato soup.
- [ ] Search works properly for everyone who visits the site.
- [ ] The search box is as good as it can be made this week.
Why: A done line has to name something you could see or run. Typing three words and seeing Tomato soup is a check. "Works properly" gives nobody anything to check.
```

### Creating one

On github.com:

1. Open your repo and click the **Issues** tab.
2. Click **New issue**. If the repo offers templates (ready-made forms for common kinds of Issue), pick one, or open a blank issue.
3. Type the title and the description, then create the Issue. It opens with its new number.

With `gh`, from inside your repo's folder:

```sh
gh issue create --title "Search ignores capital letters" --body "Done when: Soup, SOUP and soup all show Tomato soup." --label bug
```

It prints the new Issue's web address, which ends in its number, such as `/issues/12`. Leave out `--title` and `--body`, and `gh` asks you for them instead.

```checkpoint quick-4
You run `gh issue create` with no `--title` or `--body`. What happens?
- [x] `gh` asks you for the title and the body, then creates the Issue.
- [ ] `gh` creates an empty Issue, and you add the words on GitHub later.
- [ ] `gh` refuses, because only github.com can create an Issue.
Why: Without those flags, `gh issue create` prompts for the title and body. With them, it creates the Issue straight away and prints its address.
```

## Reading an Issue

In a busy repo you can't read every Issue, and you don't need to. **Read an Issue in full when it needs your decision or you're about to start it, and skip the rest.** The list's titles and labels are enough for picking and skipping.

To read one in the terminal, give `gh issue view` its number. For example:

```sh
gh issue view 12
```

```text
Search ignores capital letters your-name/recipes#12
Open • your-name opened 2 days ago • 4 comments
Labels: bug

  Searching for "Soup" finds nothing. Searching for "soup" finds Tomato soup.
  ...
```

Below the description, `gh` shows only the newest comment, marked `Newest comment`. Add `--comments` to see them all, or `--web` to open the Issue in your browser.

In a long Issue, read in this order:

1. The title and labels: what it's about, and what it needs next.
2. The newest comment, which can change what's wanted.
3. The part saying what's wanted, and its "Done when" line.

The rest can wait until you need it.

```checkpoint quick-5
You're about to start a long Issue with twenty comments. What do you read right after the title and labels?
- [x] The newest comment, because it can change what's wanted.
- [ ] The oldest comment, because the first reply says what's wanted.
- [ ] Every comment from the top, because skipping any of them isn't safe.
Why: Read the title and labels, then the newest comment, which can change what's wanted. Then read the part saying what's wanted, and its "Done when" line.
```

## Labels and assignees

A **label** is a coloured tag on an Issue or pull request, such as `bug` or `enhancement`. Labels let you filter the list: `gh issue list --label bug` shows only the bugs.

Every new repo starts with a set of labels, including `bug`, `documentation`, `enhancement`, `good first issue`, `question` and `wontfix`. Labels belong to one repo, so a label you make in `recipes` doesn't appear anywhere else.

- To add a label on github.com, open the Issue, click **Labels** in the right sidebar, and pick one.
- With `gh`, run `gh issue edit 12 --add-label bug`.
- To make a new label, click **Labels** above the Issues list, then **New label**. Or run `gh label create needs-info`.

Some teams add labels that say what an Issue needs next. Sorting Issues this way is called **triage**. Matt Pocock's triage Skill uses five such labels:

| Label | What it asks of you |
|---|---|
| `needs-triage` | Read it, and decide which of the other four it needs. |
| `needs-info` | Wait for whoever opened it to answer a question. If that's you, post your answer. |
| `ready-for-agent` | Nothing yet. It's fully described, so an agent can build it when you start it. |
| `ready-for-human` | Do it yourself, or hand it to a person: an agent can't. |
| `wontfix` | No work. It won't be done: close it, with a comment saying why. |

A label never opens or closes an Issue. A `wontfix` Issue stays open until someone closes it.

```checkpoint quick-6
An Issue someone else opened is labelled `needs-info`, and they haven't replied yet. What do you do with it?
- [x] Skip it for now, because it's waiting on the person who opened it.
- [ ] Read it now and decide what it needs, because that's what the label asks.
- [ ] Close it today, because the label means it will never be done.
Why: `needs-info` means the Issue waits for whoever opened it to answer. When they reply, it goes back to `needs-triage` for a decision. Closing with a reason is for `wontfix`.
```

An **assignee** is a person responsible for an Issue. Click **Assignees** in the sidebar, or run `gh issue edit 12 --add-assignee "@me"` to take it yourself. An Issue can have up to 10 assignees, and `gh issue list --assignee "@me"` lists yours.

An agent that works through your `gh` login acts as you, and its comments and changes appear under your name. Assign its Issues to yourself, since you answer for that work. Some agents, such as GitHub's Copilot, can also be assigned an Issue directly.

```checkpoint quick-7
You share the `recipes` repo with a friend. You start on #12 today. How do you show your friend that you're on it?
- [x] Assign #12 to yourself, so your name shows as its assignee.
- [ ] Add the `bug` label to #12, so your friend can see it's taken.
- [ ] Close #12 now, so your friend knows nobody else should touch it.
Why: An assignee says who is responsible for an Issue. A label only sorts it, and closing it would tell everyone the work is done.
```

## Linking a pull request with `Closes #12`

Finished work reaches `main`, the [branch](/learn/branches-and-worktrees) your project grows on, through a **pull request** (PR): a request to bring one branch's changes into another. [Opening a pull request](/learn/pull-requests) covers PRs in full. Here, one line matters.

Write a **closing keyword**, then `#` and the Issue's number, in the PR's description:

```text
Closes #12
```

**When that PR merges into the repo's default branch, usually `main`, GitHub closes #12 by itself.** The rules:

- Nine keywords work: close, closes, closed, fix, fixes, fixed, resolve, resolves and resolved. Capitals and a colon are fine too: `CLOSES: #12`.
- Use one keyword per Issue: `Closes #12, closes #13`. Writing `Closes #12, #13` closes only #12.
- It works only into the default branch. On a PR into any other branch, GitHub ignores the keyword, and merging closes nothing.
- Other words only mention. "Part of #12" or "See #12" link the two pages to each other, but close nothing.

Issues and PRs share one set of numbers in a repo. So if Issue #12 is the bug, its PR might be #14.

You can check the link before anything merges. `gh pr view 14 --json closingIssuesReferences` lists the Issues that PR #14 will close. On github.com, an Issue's right sidebar lists its linked PRs under **Development**, and you can link one by hand there too.

```checkpoint quick-8
A PR into `main` says `Closes #12, #13` in its description. It merges. What happens?
- [x] #12 closes and #13 stays open, because each Issue needs its own keyword.
- [ ] Both close, because one keyword covers every number on its line.
- [ ] Neither closes, because a keyword works only with a single number.
Why: GitHub reads one keyword per Issue. Write `Closes #12, closes #13` to close both.
```

## Bigger work: task lists and sub-issues

Some work is too big for one Issue. GitHub gives you two ways to split it.

A **task list** is a checklist inside an Issue's description. Each line that starts `- [ ]` becomes a box you can tick, and the Issues list shows how many are done:

```markdown
- [x] Trim spaces around the search words
- [ ] Ignore capital letters
- [ ] Say "No recipes found" when nothing matches
```

Use one for small steps that land in the same pull request.

A **sub-issue** is a whole Issue hung under another one, its **parent**. Each sub-issue has its own number, its own conversation and, usually, its own pull request. Use sub-issues when the pieces are big enough to build and check one at a time.

- On github.com, open the parent. Below its description, click **Create sub-issue**. To hang an Issue that already exists, use the arrow beside that button and choose **Add existing issue**.
- With `gh`, `gh issue create --title "Show a message when nothing matches" --parent 10` makes a new sub-issue of #10. `gh issue edit 10 --add-sub-issue 12,13` hangs two existing ones, #12 and #13.

A parent can hold up to 100 sub-issues, and sub-issues can have sub-issues of their own.

```checkpoint quick-9
You want to split "Better search" into two pieces, each built and checked in its own pull request. Which fits?
- [x] Two sub-issues under the "Better search" Issue.
- [ ] A task list of two lines in its description.
- [ ] Two labels on the "Better search" Issue.
Why: A sub-issue is a whole Issue, with its own number and usually its own pull request. A task list suits small steps that land in one pull request, and labels only tag.
```

Sometimes one piece must wait for another. Say #13, search by ingredient, changes the same search code as #12, so it should wait. Mark #13 as **blocked by** #12: in #13's sidebar, click **Relationships**, then **Mark as blocked by**. Or run `gh issue edit 13 --add-blocked-by 12`. The Issues list then shows a "Blocked" icon on #13.

```diagram
type: tree
caption: "Close #12, and nothing open blocks #13 any more."
root:
  label: "#10 Better search"
  note: "the parent"
nodes:
  - label: "#12 Search ignores capital letters"
    state: closed
  - label: "#13 Search by ingredient"
    state: frontier
links:
  - from: "#13 Search by ingredient"
    to: "#12 Search ignores capital letters"
    label: "blocked by"
```

Two things surprise people:

- `gh issue view 13` keeps its `Blocked by:` row after #12 closes. So check whether each blocker is still open. An Issue can start once every blocker is closed.
- Closing every sub-issue doesn't close the parent. Close it yourself, or give it its own `Closes #10` line in the last PR. [Merging and cleaning up](/learn/merging-and-cleaning-up) shows both.

```checkpoint quick-10
`gh issue view 13` shows a `Blocked by:` row naming #12, and #12 closed yesterday. Can work on #13 start?
- [x] Yes. The row stays after a blocker closes, and nothing open blocks #13.
- [ ] No. The row only shows while #12 is open, so something is still wrong.
- [ ] No. #13 has to wait until someone deletes the row by hand.
Why: The `Blocked by:` row lists blockers whether they're open or closed. An Issue can start once every blocker is closed, so #13 is free.
```

## Working with a coding agent

An agent can do everything above through `gh`. Your part is to say what you want, then check the result. The agent tells you what it meant to do; GitHub shows what happened.

To file an Issue, you say:

> File a bug Issue: search ignores capital letters. "Soup" finds nothing, "soup" finds Tomato soup. Done when "Soup", "SOUP" and "soup" all show Tomato soup. Label it bug, and give me the link.

It runs `gh issue create` with those words. Then you check, with the number from the link:

```sh
gh issue view 12
```

You should see your title, `Labels: bug`, and your "Done when" line, word for word.

Before it builds anything, you say:

> Read Issue #12 and tell me in one line what done means. Don't start yet.

Its line should match the Issue's "Done when" line. If it doesn't, fix the Issue first. The agent builds what it understood, not what you meant.

When the agent reports "done", check the Issue, not the message:

```sh
gh issue view 12 --json state
```

```json
{
  "state": "OPEN"
}
```

`OPEN` means the work isn't recorded as done yet. Often the agent has only made a [commit](/learn/commits-and-diffs). The Issue closes when a PR with `Closes #12` merges, or when someone closes it by hand.

One more check before an agent files its first Issue of a session: which repo will `gh` use? Run `gh repo view --json nameWithOwner`. In a **fork** (your own GitHub copy of someone else's repo), `gh` can default to the original repo, and `gh repo set-default` picks yours.

```checkpoint quick-11
Your agent says: "Done. Search now ignores capital letters." What do you check before you count #12 as finished?
- [x] Whether #12 is closed, since "done" may mean the agent only committed.
- [ ] Nothing, since an agent closes the Issue when it reports back.
- [ ] Whether the agent's message names #12, since naming it closes it.
Why: An agent's "done" is a claim. The Issue's state on GitHub shows what happened, and the Issue stays open until a merged PR or a person closes it.
```

## Try it: file your first Issues

````try
You need `gh` 2.94 or later (`gh --version`), logged in (`gh auth status`), and a practice repo of your own on GitHub, such as `recipes`. No repo yet? `gh repo create recipes --public --clone --add-readme` makes one and downloads it.

1. Go into the repo's folder:

   ```sh
   cd recipes
   ```

2. File a bug:

   ```sh
   gh issue create --title "Search ignores capital letters" --body "Done when: Soup, SOUP and soup all show Tomato soup." --label bug
   ```

   You should see a link ending in a number. Note it: that's your bug's number.

3. File a parent Issue:

   ```sh
   gh issue create --title "Better search" --body "Make search easier to use."
   ```

   Note this number too: that's the parent's number.

4. Hang the bug under the parent. Put your two numbers in place of `PARENT` and `BUG`:

   ```sh
   gh issue edit PARENT --add-sub-issue BUG
   ```

5. Read the parent:

   ```sh
   gh issue view PARENT
   ```

   You should see a `Sub-issues · 0/1` row near the bottom, with your bug listed as `Open`.

6. Open the parent in your browser, and find the sub-issue below its description:

   ```sh
   gh issue view PARENT --web
   ```

Keep both Issues open. The Try it in [Opening a pull request](/learn/pull-requests) opens a pull request that will close the bug.
````

## Going deeper

### Where it goes wrong

**`gh` says a label wasn't found.** Labels belong to one repo, and a new repo has only its default set. Create the label first with `gh label create <name>`.

**`gh` says `unknown flag: --parent`, or shows no `Sub-issues` row.** Your `gh` is older than 2.94, the version that added the sub-issue and blocked-by flags. Run `gh --version`, then update it.

**An Issue's text says "Blocked by #12", but GitHub doesn't show it as blocked.** The blocker went in as words, not as a relationship. In a public report on Matt Pocock's Skills (#513), an agent wrote `Blocked by: #346` into an Issue's body. It then wrongly claimed GitHub had no real link to make. The fix is the real link: `gh issue edit 13 --add-blocked-by 12`.

**The work is finished, but the Issue is still open.** Nothing closed it. A user of Matt Pocock's [implement](/learn/implement) Skill reported this (#508). After the agent committed, the Issue was "still open, no closing comment, nothing marking it as done." That Skill stops at the commit, so the closing has to come from a merged PR with `Closes #12`, or from you.

**A new Issue landed in someone else's repo.** You're in a fork, and `gh` defaulted to the original. Check with `gh repo view --json nameWithOwner` before you file, and pick yours with `gh repo set-default`.

```checkpoint quick-12
An Issue's description says `Blocked by: #12`, but the Issues list shows no "Blocked" icon on it. What's the fix?
- [x] Add a real relationship, with `gh issue edit` and `--add-blocked-by 12`.
- [ ] Add the `ready-for-agent` label, so GitHub reads the line in the text.
- [ ] Leave it, since GitHub has no way to record that one Issue waits.
Why: Words in a description don't make a relationship. GitHub records "blocked by" as a real link, set under Relationships in the sidebar or with `--add-blocked-by`.
```

### How agent workflows use Issues

Matt Pocock's Skills build a whole workflow on Issues. A **Spec** is a parent Issue that describes one whole feature: its problem and its planned solution. A **Ticket** is one of its sub-issues: one slice of the feature, small enough to build in one agent session. [to-spec](/learn/to-spec) writes the Spec, and [to-tickets](/learn/to-tickets) splits it into Tickets, joined by blocked-by links.

The **frontier** is the open Tickets whose blockers are all closed: the ones you can start now. Close a blocker, and any Ticket that was waiting only on it joins the frontier. Tickets that don't block each other can even be built at the same time, each in its own session.

In a July 2026 video, Matt opens one such Spec with 11 sub-issues, and calls each Ticket "a single context window session". The **context window** is everything an agent can see at once ([The context window](/learn/context-window) explains it). Most of the acceptance criteria stay in the Spec, so each Ticket can be short.

The Skills need to know where all this lives. [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) records it in `docs/agents/`: which tracker the repo uses, its triage labels, and where its domain docs are. Those are `GLOSSARY.md`, the project's agreed words, and `docs/adr/`, which holds **ADRs**: short records of one hard-to-reverse decision each, and why.

GitHub Issues is the default tracker. A **local tracker** keeps the same things as Markdown files under `.scratch/` instead. Each feature gets a folder: the Spec is `spec.md`, and each Ticket is a numbered file in `issues/`.

```checkpoint quick-13
Ticket #13 is blocked by #12. #12 is now closed, and #13 is still open. Is #13 on the frontier?
- [x] Yes. It's open, and every one of its blockers is closed.
- [ ] No. It stays off until someone deletes its blocked-by link.
- [ ] No. Only the lowest-numbered open Ticket is ever on it.
Why: The frontier is the open Tickets whose blockers are all closed. #13 fits, so you can start it now.
```

## Try it: set up the practice project

This part creates your **practice project**: a yoga-studio booking site that you build for real, in a new repo of your own. It's separate from the practice repo you used above, such as `recipes`. When a Try it step asks for "your practice project", this is the one it means. Other Try it steps build on it. The first is in [Merging and cleaning up](/learn/merging-and-cleaning-up), later in this Course. Many more follow in the Courses after this one, starting with [What CI/CD is](/learn/what-ci-cd-is).

It has two parts: `api/`, a FastAPI backend with Postgres in Docker, and `web/`, a small TypeScript site with Vercel previews of each pull request. If those names are new, don't worry. For now you only describe them in the README, and later Try it steps add the code.

The setup installs Matt Pocock's Skills. Then it creates the project's first Spec, "Booking API", with two Tickets. #2 adds the bookings table. #3 adds the endpoint that creates a booking, and it's blocked by #2.

````try
You'll need `gh` 2.94 or later (`gh --version`), logged in, and Node.js, which gives you the `npx` command in step 5. You'll also need Claude Code: [Start here](/learn/start-here) covers the plan it needs and how to install it.

1. Create and clone the repo. If you're still in `recipes` from the Try it above, run `cd ..` first, so the new repo lands beside it, not inside it. You should see a new `yoga-studio` folder.

   ```sh
   gh repo create yoga-studio --private --clone --add-readme
   ```

2. Go into it:

   ```sh
   cd yoga-studio
   ```

3. Describe those two parts in `README.md`.
4. Commit and push it:

   ```sh
   git add README.md && git commit -m "Describe the project" && git push -u origin HEAD
   ```

5. Install Matt's Skills, if you haven't yet. Choose all of them, for Claude Code, in project scope: installed into this repo, not your whole computer. [What a Skill is](/learn/skills) explains these choices.

   ```sh
   npx skills@latest add mattpocock/skills
   ```

6. Start Claude Code:

   ```sh
   claude
   ```

7. Type `/setup-matt-pocock-skills`, and accept its recommended answers, starting with GitHub as the tracker. If it asks which file to create, choose `CLAUDE.md`. Then approve its drafts.
8. Open `docs/agents/issue-tracker.md`. You should see its "Blocking" and "Count open blockers" lines.
9. Type `/exit` to quit Claude Code, or open a second terminal in `yoga-studio`. Then commit and push the new files:

   ```sh
   git add -A && git commit -m "Set up the Skills" && git push
   ```

10. Check the target. You should see your own repo.

    ```sh
    gh repo view --json nameWithOwner
    ```

11. Create the Spec. You should see a link ending `/issues/1`.

    ```sh
    gh issue create --title "Booking API" --body "Members can book a class."
    ```

12. Create the first Ticket:

    ```sh
    gh issue create --title "Add the bookings table" --body "First slice." --parent 1
    ```

13. Create the second:

    ```sh
    gh issue create --title "Add the endpoint that creates a booking" --body "Second slice." --parent 1 --blocked-by 2
    ```

14. Open the Spec. You should see two sub-issues.

    ```sh
    gh issue view 1 --web
    ```

15. Open the Issues page. You should see a "Blocked" icon on #3.

    ```sh
    gh issue list --web
    ```

16. Count #3's open blockers. You should see `1`.

    ```sh
    gh api repos/{owner}/{repo}/issues/3 --jq .issue_dependencies_summary.blocked_by
    ```

17. Close #2:

    ```sh
    gh issue close 2
    ```

18. Run the count from step 16 again. You should see `0`, so #3 is on the frontier.

You closed #2 only to watch the count drop, so no table exists yet. [implement](/learn/implement)'s Try it builds it with #3.
````

## Remember

```flashcards
Q: What is a GitHub Issue?
A: One piece of work written down on GitHub: a title, a description and a conversation, with a number such as #12.

Q: What does an open Issue tell everyone?
A: The work is still waiting. A closed Issue means it's done, or that it won't be done.

Q: What makes a good "Done when" line?
A: Something you could see or run, such as "Soup, SOUP and soup all show Tomato soup".

Q: In a long Issue, what do you read first?
A: The title and labels, then the newest comment, then the part saying what's wanted and its "Done when" line.

Q: What does a label do, and what can't it do?
A: It tags and sorts an Issue. It never opens or closes one.

Q: When does `Closes #12` close Issue #12?
A: When its pull request merges into the default branch, usually `main`. On a pull request into any other branch, the keyword is ignored.

Q: How do you close two Issues from one pull request?
A: One keyword each: `Closes #12, closes #13`. `Closes #12, #13` closes only #12.

Q: Task list or sub-issues?
A: A task list for small steps in one pull request. Sub-issues for pieces built and checked one at a time, each with its own pull request.

Q: Does closing every sub-issue close the parent?
A: No. Close the parent by hand, or give it its own `Closes` line in the last pull request.

Q: What is the frontier?
A: The open Tickets whose blockers are all closed, so you can start them now.
```

## Final test

```final-test lt-where-work-goes
A friend tells you the About page of your recipe site has a broken link. You track work in GitHub Issues. Where does this piece of work go?
- [x] A new Issue in the repo, with the steps to see the broken link.
- [ ] A new line in the README, so everyone who opens the repo sees it.
- [ ] A message to your coding agent, which keeps it for later sessions.
- [ ] A new branch named after the bug, so the work has somewhere to live.
Why: Every piece of work gets its own Issue, open until it's done. A README line isn't tracked, and each new agent session starts fresh, so a message to the agent isn't a record of the work.
```

```final-test lt-done-when
Which description gives an agent the best chance of building the right fix?
- [x] What happens now, what should happen, the steps, and a "Done when" check.
- [ ] A one-word title, "Search", so the agent is free to choose its own fix.
- [ ] A long story of how you found the bug, with no steps and no checks.
- [ ] A request to "make search better", so the agent decides what done means.
Why: A good Issue lets someone who wasn't there do the work, and an agent needs to know when it's done. Steps and a checkable "Done when" line give it both.
```

```final-test lt-long-issue
You're about to start a long Issue you haven't read. It has a title, labels, a long description and many comments. What do you read first?
- [x] The title and labels, then the newest comment, then the part saying what's wanted.
- [ ] The whole description from the top, then every comment, oldest first.
- [ ] The oldest comment, because the first reply always says what's wanted.
- [ ] Nothing yet, because the agent will read it and tell you what it built.
Why: The title and labels say what it's about and what it needs. The newest comment can change what's wanted. Then the part saying what's wanted gives you the job.
```

```final-test lt-needs-info-yours
You opened an Issue, and it's now labelled `needs-info` because a teammate asked you a question in it. What does the label ask of you?
- [x] Post your answer, so the Issue can go back for a decision.
- [ ] Nothing: the label means an agent is already building it.
- [ ] Close the Issue, because the label means it won't be done.
- [ ] Do the work yourself, because the label means an agent can't.
Why: `needs-info` waits on whoever opened the Issue. That's you, so answer the question. Then it goes back to `needs-triage` for a decision.
```

```final-test lt-wontfix-open
An Issue has carried the `wontfix` label for a month, and it's still open. Why?
- [x] A label never closes an Issue: someone has to close it, saying why.
- [ ] GitHub closes `wontfix` Issues by itself only after 90 days.
- [ ] `wontfix` means the work is planned for later, so it stays open.
- [ ] Only the person who opened an Issue is allowed to close it.
Why: A label tags and sorts an Issue but never changes its state. Close a `wontfix` Issue by hand, with a comment saying why.
```

```final-test lt-two-closes
Your pull request into `main` should close #12 and #13 when it merges. What do you write in its description?
- [x] `Closes #12, closes #13`
- [ ] `Closes #12, #13`
- [ ] `Closes #12 and #13`
- [ ] `Part of #12, part of #13`
Why: GitHub needs one closing keyword per Issue. With one keyword on the line, only #12 closes, and "Part of" only mentions an Issue.
```

```final-test lt-other-branch
A pull request says `Closes #12` and goes into a branch called `search-work`, not `main`. It merges. What happens to #12?
- [x] It stays open, because the keyword is ignored on a pull request into any other branch.
- [ ] It closes, because the keyword is in the pull request's description.
- [ ] It closes, but only once someone has approved the pull request.
- [ ] It's deleted, because its work now lives on another branch.
Why: Closing keywords work only on a pull request into the default branch, usually `main`. Into any other branch, GitHub ignores them, and merging closes nothing.
```

```final-test lt-parent-stays-open
Every sub-issue of "Better search" is now closed. No pull request ever said `Closes` with its number. What state is "Better search" in?
- [x] Still open, until someone closes it or a merged pull request's `Closes` line does.
- [ ] Closed, because GitHub closes a parent when its last sub-issue closes.
- [ ] Deleted, because a parent with no open sub-issues has nothing left to track.
- [ ] Blocked, because a parent waits on sub-issues that have already closed.
Why: Closing every sub-issue doesn't close the parent. Close it by hand, or give it its own `Closes` line in the last pull request.
```

```final-test lt-blocked-row
`gh issue view` on the Issue you want to start shows a `Blocked by:` row naming two other Issues. What do you check before you wait for them?
- [x] Whether either of them is still open, because the row stays after a blocker closes.
- [ ] Nothing, because the row only shows while a blocker is open, so you must wait.
- [ ] Whether the Issue is labelled `ready-for-agent`, because that label overrides blockers.
- [ ] Whether the Issue has an assignee, because assigning it clears its blockers.
Why: The `Blocked by:` row lists blockers whether they're open or closed. An Issue can start once every blocker is closed, so check their state.
```

```final-test lt-agent-done
Your agent says it finished #12 and committed the fix. `gh issue view 12 --json state` prints `"state": "OPEN"`. What's true?
- [x] The work isn't recorded as done until a pull request with `Closes #12` merges, or someone closes #12.
- [ ] The fix failed, because GitHub closes an Issue as soon as its fix is committed.
- [ ] Nothing is wrong, because an agent's report is what marks an Issue as done.
- [ ] The Issue will close by itself within the hour, once GitHub sees the commit.
Why: Committing the fix didn't close #12. A merged pull request with a closing keyword closes it, or a person does it by hand. Until then, the tracker says the work is waiting.
```

```sources
- [About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues), GitHub Docs
- [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue), GitHub Docs
- [Managing labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels), GitHub Docs
- [Assigning issues and pull requests to other GitHub users](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/assigning-issues-and-pull-requests-to-other-github-users), GitHub Docs
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs
- [About tasklists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-tasklists), GitHub Docs
- [Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues), GitHub Docs
- [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies), GitHub Docs
- [Closing an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/closing-an-issue), GitHub Docs
- [gh issue create](https://cli.github.com/manual/gh_issue_create), GitHub CLI manual
- [gh issue view](https://cli.github.com/manual/gh_issue_view), GitHub CLI manual
- [gh issue edit](https://cli.github.com/manual/gh_issue_edit), GitHub CLI manual
- [gh issue list](https://cli.github.com/manual/gh_issue_list), GitHub CLI manual
- [gh issue close](https://cli.github.com/manual/gh_issue_close), GitHub CLI manual
- [gh label create](https://cli.github.com/manual/gh_label_create), GitHub CLI manual
- [gh repo set-default](https://cli.github.com/manual/gh_repo_set-default), GitHub CLI manual
- [GitHub CLI 2.94.0](https://github.com/cli/cli/releases/tag/v2.94.0), GitHub, 2026-06-10
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), Justin Young (Anthropic), 2025-11-26
- [triage: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/SKILL.md), Matt Pocock's Skills
- [triage: AGENT-BRIEF.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/AGENT-BRIEF.md), Matt Pocock's Skills
- [The /triage Skill](https://www.aihero.dev/skills-triage), Matt Pocock, 2026-08-24
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [/implement has no completion step, finished tickets are never marked done (#508)](https://github.com/mattpocock/skills/issues/508), HorvathAlteisen, 2026-07-10
- [to-tickets didn't create blocking relationships between GitHub issues (#513)](https://github.com/mattpocock/skills/issues/513), ctrom, 2026-07-10
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-local.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md), Matt Pocock's Skills
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills), Matt Pocock, 2026-08-24
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), Michael Nygard, 2011-11-15
```
