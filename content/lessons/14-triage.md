---
title: Triage
slug: triage
order: 14
part: 3
image: /photos/triage.jpg
imageAlt: Black-and-white photo of postal workers sorting letters into wall-mounted cubby-holes.
imageCredit: Library of Congress
---

When reports pile up from other people, triage sorts each one into a brief an agent can build from, a precise question for the reporter, or a closed issue with the reason written down.

```goals
- You'll be able to tell work that needs triage (reports from other people) from work that never does, like the tickets `/to-tickets` made.
- You'll be able to read an issue's two roles, one category and one state, and say where it can move next.
- You'll be able to run a `/triage` session: list what needs attention, take one item from recommendation through verification to an outcome, or move it yourself with a quick override.
- You'll be able to judge an agent brief and decide which closed requests belong in `.out-of-scope/`.
```

## Why it matters

Picture this site a few months from now. Visitors (anyone reading it; nobody has an account) leave Comments in the Discussion panel beside each Lesson, and some of those Comments are really bug reports or wishes. "My comment showed up blank." "Please add accounts so I can edit my old comments." You copy each one into the project's issue tracker: the list where a project keeps its reported problems and requests, each one called an issue. On GitHub that's the Issues tab. On this site it's one Markdown file per issue, kept in the repo (the project folder, tracked with Git).

Every report is in the reporter's words, not yours. Some are real bugs, some can't be reproduced, some ask for things you ruled out long ago, and some are already built. Hand one straight to Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) and it takes the reporter's word for everything. It may chase a bug that doesn't exist, or build the accounts you ruled out on day one. Sort forty reports by hand instead, and you spend an evening re-reading code and re-arguing old decisions.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, built `/triage` for exactly this. A Skill is a short instruction file the agent loads when you type its name; [Skills](/learn/skills) covers the details. In his May 2026 video on triage, Matt points out that most Skill setups suit a solo developer. Once other people file ideas, someone has to decide whether each one is worth building, whether it's really a bug, and whether it reproduces (0:00–0:31). Triage hands that legwork to the agent while every call stays yours: ==it recommends, then waits==.

```callout big-idea
Triage itself writes no code. Every item ends one of three ways: an agent-ready brief, specific questions for the reporter, or a closed issue with the reason on record.
```

## The idea: two roles and a small state machine

A label is a tag on an issue, like `bug`. Triage treats labels as **roles**, and every triaged issue carries exactly two:

- **One category:** `bug` (something is broken) or `enhancement` (a new feature or an improvement).
- **One state**, out of five:

| State | Means |
|---|---|
| `needs-triage` | The maintainer (you: the person who looks after the project) still needs to evaluate it |
| `needs-info` | Waiting on the reporter to answer questions |
| `ready-for-agent` | Fully specified, with a brief attached, ready for an AFK agent |
| `ready-for-human` | Specified, but a person has to do it |
| `wontfix` | Closed; it won't be acted on |

AFK means away from keyboard: an agent working unattended, perhaps overnight, with nobody to ask. That's who `ready-for-agent` is for, so anything carrying it must be safe to build without a single question.

An issue can't be "ready for a human" and "not evaluated yet" at once, so the rule is ==exactly one category and one state==. If triage finds two state labels on one issue, it flags the clash and asks you before doing anything else. That rule is what makes this a state machine: a fixed set of states, and fixed moves between them.

- A new, unlabelled issue normally goes to `needs-triage` first.
- From there it moves to `needs-info`, `ready-for-agent`, `ready-for-human` or `wontfix`.
- When the reporter answers, a `needs-info` issue goes back to `needs-triage` for another look.
- You can override any of this at any time. If a move looks unusual, triage flags it and asks first.

The five names are canonical: the Skills always say `ready-for-agent`, but your tracker might call it something else. `/setup-matt-pocock-skills`, the Skill you run once per repo before Matt's other engineering Skills, records the mapping in `docs/agents/triage-labels.md`, and on GitHub or GitLab it creates any labels the tracker is missing. This site's repo keeps the five default names. Its tracker is local Markdown, so an issue's state is simply a `Status:` line near the top of its file.

```scene flow
title: One Visitor report moving through the states (illustrative)
node: new | Unlabelled
node: triage | needs-triage
node: info | needs-info | side
node: human | ready-for-human | side
node: wontfix | wontfix | side
node: agent | ready-for-agent
# A Visitor's report arrives with no labels at all: it has never been triaged.
at: new
# Triage gives it a category, bug, and the first state: you need to evaluate it.
at: triage
# The reporter's steps are too vague to try, so it asks them specific questions.
at: info
# The reporter replies with exact steps, which sends the issue back for another look.
at: triage
# This time the bug reproduces. It gets an agent brief, and an AFK agent can take it.
at: agent
```

```checkpoint state-conflict
On a book-swap site's tracker, one issue carries `bug`, `ready-for-human` and `needs-triage`. You ask `/triage` to look at it. What does it do first?
- [ ] Keeps `ready-for-human`, because it's the further along of the two states.
  > Triage doesn't pick a winner on its own. Which state is right is your call.
- [ ] Removes both states and treats the issue as unlabelled again.
  > That silently throws away someone's decision. Triage asks instead of guessing.
- [x] Flags the clash and asks you before doing anything else.
  > Right. Every issue gets exactly one state, so two at once is a conflict for the maintainer to settle first.
- [ ] Closes it as `wontfix`, since conflicting labels make it impossible to act on.
  > A labelling mix-up says nothing about whether the bug is worth fixing.
```

## When to reach for it, and when not

Triage is for work ==you didn't create==: bug reports, feature requests, anything that arrives raw from someone else. Matt runs it on every open-source repo he maintains (0:33). It can also cover external pull requests (a PR is a proposed change to the code, waiting to be merged) if you switch that on in `docs/agents/issue-tracker.md`; it's off by default. The Skill then treats a PR as an issue with code attached, using the same roles and states.

It is **not** for your own plans. When the idea is yours, Matt's Main flow (the path most work takes, from idea to shipped) goes `/grill-with-docs` → `/to-spec` → `/to-tickets`. A spec is a written description of what to build and why; tickets are small tasks cut from it, each buildable in one session (one Claude Code conversation). `/to-tickets` marks every ticket `ready-for-agent` as it writes it. On this site, each ticket file says `Status: ready-for-agent` from the start. Running triage over them only redoes finished work. See [Spec + tickets](/learn/spec-and-issues).

So there are two lanes, and they ==meet at the same label==. Your ideas take the Main flow; other people's reports take triage. Both end as an issue marked `ready-for-agent`, which `/implement` (Matt's Skill that builds one ticket) or an AFK runner picks up the same way. See [Implement](/learn/implement) and [The main flow](/learn/main-flow).

| What you have | Reach for |
|---|---|
| Raw reports and requests from other people | `/triage` |
| A rough idea of your own | `/grill-with-docs` |
| A settled conversation to write down | `/to-spec` |
| Tickets that `/to-tickets` just made | Nothing: they're already `ready-for-agent` |
| A confirmed bug whose root cause you need | `/diagnosing-bugs` (see [Diagnosing bugs](/learn/diagnosing-bugs)) |

One more thing: `/triage` is a user-invoked Skill. The agent never starts it on its own, and plain words like "can you triage these?" won't start it either. Type `/triage` at the start of your message, followed by what you want.

```checkpoint who-starts-triage
Twelve new bug reports land in your tracker overnight. In the morning you type "lots of new issues, can you triage them?" with no slash anywhere. What happens?
- [ ] The agent loads `/triage`, because your words match its description.
  > Only model-invoked Skills can be started by plain words. `/triage` is user-invoked.
- [x] Nothing loads `/triage`. You have to type it yourself.
  > Right. Type `/triage` at the start of your message, then say what you want in plain words.
- [ ] The agent waits until enough reports pile up, then starts triage on its own.
  > There's no threshold. The agent never starts `/triage` by itself.
- [ ] `/setup-matt-pocock-skills` runs first and then hands over to `/triage`.
  > Setup is user-invoked too, and no Skill can start a user-invoked one.
```

## A session, step by step

You start with `/triage` and plain words. The Skill's own examples are "Show me anything that needs my attention", "Let's look at #42", "Move #42 to ready-for-agent" and "What's ready for agents to pick up?"

**"Show me anything that needs my attention"** lists three buckets, oldest first, with a count and a one-line summary per item: unlabelled issues (never triaged), `needs-triage` (evaluation in progress), and `needs-info` issues where the reporter has replied since the last triage notes. Then you pick one.

**Looking at one item** runs five steps:

1. **Gather context.** It reads the whole issue, comments and earlier triage notes included, so it never re-asks a settled question. It explores the code with help from `GLOSSARY.md` (the project's word list) and ADRs (short records of past decisions). Two checks run here: is this **already built** (searched by idea, not by the reporter's wording, and it tells you where it looked), and was it **rejected before** (it reads `.out-of-scope/`, covered below).
2. **Recommend.** One category and one state, with reasons and a short summary of the code involved. Then it waits for you.
3. **Verify the claim**, before any grilling. For a bug, it reproduces it from the reporter's steps; for a PR, it checks it out and runs the tests. You get one of three results: confirmed (with the code path, meaning which code actually runs), failed, or not enough detail to try. That last one is the strongest sign the issue needs `needs-info`.
4. **Grill, if needed.** If the request is fuzzy, it interviews you a round of questions at a time, using the grilling and domain-modeling Skills, and writes settled terms into `GLOSSARY.md` as you go. See [Grilling](/learn/grilling).
5. **Apply the outcome.** `ready-for-agent` gets an agent brief. `ready-for-human` gets the same brief plus why an agent can't do it: a judgment call, outside access, a design decision, testing by hand. `needs-info` gets Triage Notes. `wontfix` gets a closing comment whose shape depends on why.

Triage Notes have two parts, "What we've established so far" and "What we still need from you", and the questions must be specific enough to answer, never "please provide more info". ==Every comment or issue triage posts starts with a disclaimer== line, `> *This was generated by AI during triage.*`, so readers know who wrote it. If an issue already has notes from an earlier session, triage reads them, checks what's been answered, and shows you the updated picture first.

```scene chat
title: Triaging a Visitor report in this site's repo (illustrative)
# You type the Skill, then say what you want in plain words.
you: `/triage` Show me anything that needs my attention.
# Three buckets, oldest first, with a count and one line per item. Then you pick.
agent: **Unlabelled (2):** 01, "My comment showed up blank". 02, "Please add accounts so I can edit my old comments". **needs-triage (0). needs-info with replies (0).** Which one?
you: Let's look at 01.
# It reads the report, searches the code by idea, checks `.out-of-scope/`, then recommends and waits.
agent: No earlier rejection. The comments module trims every body and refuses an empty one, so this shouldn't happen. I recommend **bug**, probably **needs-info**: the report has no steps. Shall I try to reproduce it first?
# You say go. Verification comes before any brief or grilling.
you: Yes, try it.
agent: Failed to reproduce. A comment of only spaces is refused with "Comment can't be empty." Without the reporter's exact steps I can't go further.
# It drafts Triage Notes with questions the reporter can actually answer.
agent: **What we've established:** empty and spaces-only comments are refused. **What we still need from you:** which Lesson, the exact text you typed, and whether the blank comment is still there after a reload.
# You approve. It writes the note, disclaimer first, and sets one state.
you: Post it.
agent: Added under `## Comments`, starting with the AI-triage disclaimer. The Status line now says needs-info.
```

**Quick override.** When you already know the answer, say so: `/triage Move #42 to ready-for-agent.` Triage trusts you. It tells you what it's about to change (labels, any comment, closing), then does it, with no grilling. If you move something to `ready-for-agent` this way, it asks whether you want a brief written.

```checkpoint vague-report-question
A report on a recipe app says only "search is broken". Triage can't reproduce it and picks `needs-info`. Which question belongs in its Triage Notes?
- [ ] "Please provide more information about the problem."
  > That's exactly the kind of question the Skill forbids. The reporter can't tell what you need.
- [ ] "Have you tried turning it off and on again?"
  > It asks for nothing triage can use, and it doesn't help reproduce the bug.
- [x] "What did you search for, and what did you expect to see?"
  > Right. It's specific and answerable, and the answer gives triage steps to reproduce.
- [ ] "Could you file a fresh report the next time it happens to you?"
  > That pushes the work back without gathering anything. Ask for the details now.
```

## The agent brief: what an AFK agent builds from

When an issue moves to `ready-for-agent`, triage posts an **agent brief**: a structured comment that becomes the contract. The original report and discussion are just background; the brief is what the agent builds from. An issue can sit in the queue for days or weeks while the code changes underneath it, so the Skill asks for briefs that are ==durable rather than precise==:

- **Behaviour, not procedure.** Say what the system should do, not how to change it. The agent will explore the code fresh and make its own choices.
- **Names that last.** Name types, function signatures and config shapes. Never file paths or line numbers: files get renamed and moved, and lines shift.
- **Acceptance criteria you can check,** each one testable on its own, so the agent knows when it's done.
- **An out-of-scope list,** so the agent doesn't gold-plate (add extras nobody asked for) or wander into neighbouring features.

Here's the Skill's template filled in for a real quirk of this site. The ticket that built Lesson pages accepted, for v1, that an unknown address like `/learn/nope` shows the not-found page but answers with status 200 instead of 404. If a Visitor reported it and you decided to fix it, the brief might read:

```md
> *This was generated by AI during triage.*

## Agent Brief

**Category:** bug
**Summary:** An unknown Lesson address shows the not-found page but answers 200

**Current behavior:**
Visiting /learn/<slug> for a Slug that doesn't exist renders the not-found
page, but the HTTP status is 200, so link checkers treat it as a real page.

**Desired behavior:**
An unknown Slug answers 404 with the same not-found page. Known Slugs are
unchanged.

**Key interfaces:**
- `lessonExists(slug: string): Promise<boolean>`: the existing lookup to reuse
- Whatever check runs before a Lesson page renders

**Acceptance criteria:**
- [ ] GET /learn/nope returns 404 and shows the not-found page
- [ ] GET /learn/grilling still returns 200
- [ ] A test covers both cases

**Out of scope:**
- Redesigning the not-found page
- Redirecting misspelled Slugs
```

There's no "open this file" and no line number, so if someone reorganises the folders next week, every line is still true. And because triage reproduced the problem first, "Current behavior" is a checked fact, not the reporter's guess.

```checkpoint testable-criterion
You're reviewing a brief for a bug on a bike-rental site. Which acceptance criterion could an agent actually check?
- [ ] Booking should work properly again for everyone.
  > "Properly" can't be checked. The agent wouldn't know when it's done.
- [ ] Fix the date bug in the booking handler around line 120.
  > That's a procedure with a line number, which goes stale. It never says what "fixed" looks like, either.
- [ ] Use a better date library so this kind of bug can never happen.
  > That's an implementation choice, not an outcome. Briefs describe behaviour and let the agent choose how.
- [x] Booking a bike for 31 March shows 31 March on the receipt.
  > Right. It's concrete and checkable on its own, and says nothing about how to get there.
```

## `.out-of-scope/`: saying no once

Some requests you'll refuse for good. Refuse them only in a closing comment and the reason vanishes with the issue, so the next request means arguing it all again. So when triage closes a **rejected enhancement**, it writes the decision to a folder at the root of the repo, `.out-of-scope/`. Matt describes it as a decision record for features you won't build (3:45–4:29).

- **One file per idea, not per issue.** `visitor-accounts.md`, not `issue-02.md`. Every later request for the same thing joins that file's "Prior requests" list.
- **Written like a short design note:** what was rejected and a real, lasting reason, such as the project's scope, a technical constraint or a strategic choice. "We're too busy right now" isn't a rejection; it's a delay.
- **Matched by idea, not keyword.** Triage reads every file in the folder while gathering context, so a request for "a night theme" matches `dark-mode.md`. On a match it shows you the old decision and its reason, and asks whether you still agree. You can confirm (the new issue joins Prior requests and is closed), reconsider (the file is updated or deleted, and triage carries on), or say the two requests are different (normal triage).

==Only rejected enhancements go here.== A rejected bug gets a polite explanation and is closed. A request that's **already built** is closed with a comment pointing to where the feature lives, and nothing is written to `.out-of-scope/`: recording a built feature as "rejected" would mislead every future duplicate check.

```scene files
title: Rejecting a Visitor feature request for good (illustrative)
# A Visitor's request arrives in the local tracker: accounts, so they can edit old Comments.
+ .scratch/visitor-reports/issues/02-accounts.md
# The Glossary says Visitors have no accounts and Comments can't be edited. You agree it's out, so triage writes one file for the idea.
+ .out-of-scope/visitor-accounts.md
# It adds a closing comment that links the file, and sets the Status line to wontfix.
~ .scratch/visitor-reports/issues/02-accounts.md
# Months later another Visitor asks to sign in with Google. Different words, same idea.
+ .scratch/visitor-reports/issues/07-google-sign-in.md
# You confirm the old decision. The new request joins Prior requests and is closed too.
~ .out-of-scope/visitor-accounts.md
~ .scratch/visitor-reports/issues/07-google-sign-in.md
```

```checkpoint concept-match
A book-club site has `.out-of-scope/member-profiles.md`. A new request asks for "a page about each member with their favourite books". What does triage do?
- [ ] Ignores the old file, because the new request never uses the word "profile".
  > Matching is by idea, not keyword. A page about each member is a member profile.
- [x] Shows you the old decision and reason, and asks if you still agree.
  > Right. You can then confirm and close it, reconsider, or say the two requests differ.
- [ ] Closes the request at once, quoting the reason from the old file.
  > Triage never decides alone. A human confirms the match first.
- [ ] Writes a new file, `favourite-books.md`, for this request.
  > One file per idea. If you confirm the match, the request joins the existing file's Prior requests.
```

## How Matt and others use it

**Matt Pocock**, in his May 2026 video "Burn through the backlog from hell with /triage":

- **A first pass, then one at a time.** On Sandcastle, his tool for running AFK agents, he opened a new session and asked triage for just the issues he hadn't triaged yet. It found nine. He had it give each a category and `needs-triage`, so he'd face fewer decisions, then worked through the bugs one by one (3:04–4:45).
- **Make it check, not believe.** For one bug it recommended `ready-for-agent`, but he felt it was trusting the reporter too much. He had it reproduce the bug itself with his diagnosing Skill (today's `/diagnosing-bugs`) in the same session, then fixed it there (4:45–5:28, 7:29–7:37). In 1.3.1 that check is a required step before any brief.
- **Labels feed the AFK agents.** He calls much of running AFK agents "queue management", with you translating between the people filing tickets and the AI building them. Sandcastle only touches issues marked `ready-for-agent` (6:02–6:29).
- **A PR closes the loop.** He usually fixes through a PR that references the issue, so merging it closes the issue (8:05–8:17).

**Matt's own repo:** its `.out-of-scope/` folder held nine idea files in October 2026; `new-skills.md` groups five earlier requests for new Skills under one reason. Workflows added on 2026-10-05 label every new issue `needs-triage` and close `needs-info` issues after 14 days with no reply, while a reply sends the issue back to `needs-triage`. That automation belongs to his repo, not the Skill, but it runs the same state machine.

**Other developers:**

- A developer whose non-technical team feeds user feedback into GitHub reported in August 2026 (issue #863) that his team finds the `needs-info` comments long and draining. Writing a question costs the agent nothing; answering costs a person time, so keep questions few and short.
- afk.sh, a community project from September 2026, picks up whatever triage has labelled `ready-for-agent` and runs `/implement` on each ticket in its own fresh session overnight. Its author's last run finished ten tickets in 62 minutes.
- Matt's docs describe a user who asked for one bulk pass over many issues. The agent worked from the quick listing, which shows issue bodies but not comments, so three issues whose comments already said "already fixed, recommend closing" got fresh briefs.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). This takes about 20 minutes in a throwaway folder.

1. In your terminal, make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir triage-practice && cd triage-practice && claude
```

2. Type a slash and the word triage. If `triage` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes.
4. Type `/setup-matt-pocock-skills`. Choose **Local markdown** for the issue tracker, keep the default triage labels, and pick `CLAUDE.md` if it asks which file to create. If it never asks about labels, tell it: "triage is installed; keep the default labels."
5. Ask for a tiny project with a hidden bug and three reports from "strangers":

```text
Make a tiny practice project. Create count.sh, a bash script that prints how many words a text file has (bash count.sh notes.txt), plus a sample notes.txt. Give it one hidden bug: it counts lines instead of words. Don't mention the bug in any file. Add a README.md that says what the tool does and, under "Out of scope", that it only counts and never changes the file. Then create three issue files in .scratch/reports/issues/, written as if strangers sent them, with no Status line:
01-wrong-count.md: "My file has two lines and ten words, but count.sh says 2."
02-broken.md: "It doesn't work on my computer."
03-fix-spelling.md: "Please add a --fix flag that corrects spelling mistakes in my file."
Don't triage or fix anything.
```

6. Type `/clear`. It empties the conversation but keeps the files, so the agent meets the reports cold.
7. Type:

```text
/triage Show me anything that needs my attention.
```

8. Type "Let's look at 01. Don't fix anything." Push back on its recommendation if you disagree, let it verify, and approve the outcome. Then do 02 and 03, playing the reporter if it asks you questions.
9. If it asks permission for something you don't want, choose No; if it's already working, press Esc to stop it. Type `/exit` when you're done, and delete the folder if you like.

**It's working if:**

- [ ] It listed the three reports as unlabelled, oldest first, with a count and one line each, and let you pick.
- [ ] For each, it recommended one category and one state with reasons, then waited for you.
- [ ] For 01 it ran `count.sh` to reproduce the miscount before writing any brief.
- [ ] The brief for 01 describes behaviour, lists checkable acceptance criteria and an Out of scope section, and has no line numbers.
- [ ] For 02 it asked specific questions under "What we still need from you".
- [ ] For 03 it spotted the README's out-of-scope line and, once you agreed, wrote a file in `.out-of-scope/` with a reason and a Prior requests list.
- [ ] Every comment it wrote starts with the AI-triage disclaimer.
- [ ] Each report ends with exactly one state on its `Status:` line.
````

## Common mistakes

- **Triaging your own tickets.** `/to-tickets` output is already `ready-for-agent`.
- **Waiting for the agent to start it.** Type `/triage` yourself.
- **Skipping setup.** Without `/setup-matt-pocock-skills` there's no label mapping, and triage will tell you to run it.
- **Briefing before verifying, or briefs with paths and line numbers.** See the session and brief sections above.
- **Bulk passes from the listing.** Tell it to read every issue's comments.
- **Writing `.out-of-scope/` for a built feature.** Point to where it lives instead.
- **Expecting a root cause.** Verification is shallow on purpose. For a stubborn bug, use `/diagnosing-bugs`.

```site-story
Not used on this site yet. Every issue in this repo came from my own planning through `/to-spec` and `/to-tickets`, so each one started as `ready-for-agent` and nothing needed triage. The repo is set up for it (`docs/agents/triage-labels.md` keeps the five default labels), and a bug report from a Visitor would be the trigger.
```

## Cheat sheet

| Moment | What to type or expect |
|---|---|
| Once per repo | `/setup-matt-pocock-skills` |
| See the queue | `/triage Show me anything that needs my attention.` |
| One item | "Let's look at #42" |
| You already know the answer | "Move #42 to ready-for-agent" (quick override) |
| What agents can take | "What's ready for agents to pick up?" |
| Before any brief | It reproduces the bug, or runs the PR's tests |
| Vague report | `needs-info`, with specific questions in Triage Notes |
| Rejected feature | `wontfix`, plus a file in `.out-of-scope/` |
| Already built | `wontfix`, pointing to where it lives; nothing in `.out-of-scope/` |
| Tickets from `/to-tickets` | Don't triage them |

## Final test

```test scenario-own-tickets
You've grilled a newsletter feature, then run `/to-spec` and `/to-tickets`, and five ticket files now sit in your tracker. A teammate suggests a `/triage` pass over them before anyone builds. What do you say?
- [x] No need: `/to-tickets` already marked them `ready-for-agent`.
  > Right. Triage is the lane for work other people send in. Your tickets are agent-ready by construction.
- [ ] Yes: nothing should reach an agent without a triage pass first.
  > Both lanes end at `ready-for-agent`. Your tickets got there through the Main flow, so triage would only redo the work.
- [ ] Only the tickets that fix bugs, since triage is built for bugs.
  > Triage handles bugs and enhancements alike. What matters is who created the work, not its category.
- [ ] Yes, but only so it can add the `enhancement` category to each ticket.
  > A whole triage pass to add one label, on tickets that are already agent-ready, is wasted work.
```

```test scenario-hard-bug
A Visitor reported that the comment box sometimes posts a Comment twice. Triage reproduced it, but only once in ten tries, and nobody knows why. You want the root cause found now. Which Skill do you reach for?
- [ ] `/triage` again, asking it to verify more carefully this time.
  > Triage's check is shallow on purpose: is it real, and roughly where? It doesn't hunt root causes.
- [ ] `/grill-with-docs`, so it can interview you about the comment box.
  > There's nothing to decide here; there's a cause to find. An interview won't find it.
- [ ] `/to-tickets`, so the bug becomes an agent-ready ticket.
  > `/to-tickets` cuts a spec into tickets. It doesn't investigate anything.
- [x] `/diagnosing-bugs`
  > Right. It builds a tight feedback loop for a stubborn bug and hunts down the cause before fixing it.
```

```test scenario-quick-override
Yesterday you discussed issue #31 with its reporter at length, and you're sure it's fully specified. What's the fastest correct move?
- [ ] Write "please move #31 to ready-for-agent" in plain words and wait for triage to start.
  > Plain words can't start a user-invoked Skill. Type `/triage` first.
- [x] `/triage Move #31 to ready-for-agent.`
  > Right. Triage trusts you, says what it will change, applies it without grilling, and asks whether you want a brief.
- [ ] `/triage Let's look at #31`, then answer every grilling question again.
  > That works, but you'd re-argue decisions you've already made. The quick override exists for exactly this.
- [ ] Wait for the reporter to add the label to the issue themselves.
  > Reporters don't set triage state. You're the maintainer, so the call is yours.
```

```test scenario-already-built
On a recipe site, someone asks for a printable version of each recipe. Triage's redundancy check finds a working Print button already on every recipe page. What's the right outcome?
- [ ] `wontfix`, with a new `.out-of-scope/printable-recipes.md` file.
  > That folder is for rejected requests. Recording a built feature there would make future checks call it "rejected".
- [ ] `ready-for-agent`, with a brief to build the printable version again.
  > It already exists. Building it twice wastes the work and adds confusion.
- [x] `wontfix`, with a comment pointing to where the feature lives.
  > Right. Already built means closing with a pointer, and nothing goes into `.out-of-scope/`.
- [ ] `needs-info`, asking the reporter why they want a feature that already exists.
  > The redundancy check already answered the question. Point them to the button and close.
```

```test scenario-needs-human
Which of these reports should end up `ready-for-human` rather than `ready-for-agent`?
- [ ] A reproduced crash whenever the sign-up form is sent with an empty email field.
  > Confirmed, specific and testable: exactly what an AFK agent can take with a good brief.
- [ ] A request for a feature that the out-of-scope folder already rejects.
  > That's a match to confirm with you, then `wontfix`. Nobody builds it.
- [ ] A vague report that "something broke", with no steps at all.
  > Not enough detail to try means `needs-info`: ask the reporter specific questions first.
- [x] A confusing checkout page that needs design calls and testing by hand.
  > Right. Judgment calls and manual testing are the classic reasons an agent can't take it. The brief says why.
```

```test spot-brief-paths
A triage brief for a to-do app says: "Open src/lib/tasks.ts and change line 88 so the due date uses the user's time zone." Spot the mistake.
- [x] It names a file and a line number that will go stale.
  > Right. Briefs should be durable: describe the behaviour and name types or functions, never paths or lines.
- [ ] It's too short; a brief needs at least a page of detail.
  > Length isn't the problem. A short brief is fine if it's durable and checkable.
- [ ] It should start with "Fix:" so the agent knows it's a bug.
  > The Category field already says bug or enhancement. The real problem is the path and line number.
- [ ] It mentions the user's time zone, which is an implementation detail.
  > The time zone is the behaviour that matters here. It's the path and line number that won't last.
```

```test spot-no-verify
Sam's triage turned a report into a `ready-for-agent` brief straight from the reporter's description. Overnight, an AFK agent spent hours on a bug that turned out not to exist. What went wrong?
- [ ] It should have been `ready-for-human`, since bugs always need a person.
  > Plenty of bugs suit an agent. The problem is that nobody checked this one was real.
- [ ] The AFK agent should have grilled the reporter before starting.
  > An AFK agent works with nobody to ask. The check belongs in triage, before the label goes on.
- [ ] Sam should have used `/to-tickets` instead of `/triage`.
  > `/to-tickets` splits your own spec. A report from someone else is triage's job.
- [x] Nobody verified the claim before the brief was written.
  > Right. Triage reproduces a bug first; a failed or vague result points to `needs-info`, not a brief.
```

```test spot-bulk-listing
Ana asked triage to brief all 20 open issues in one go. Three of them already had comments saying "fixed, recommend closing", yet got fresh agent briefs. What went wrong?
- [ ] Triage refuses to read more than ten issues in a single session.
  > There's no fixed cap. The problem is what the agent read for each issue.
- [ ] Those three should have been recorded in `.out-of-scope/`.
  > They were fixed, not rejected. Built or fixed work never goes into `.out-of-scope/`.
- [x] It worked from the quick listing, which leaves out comments.
  > Right. For a bulk pass, tell it to read every issue's comments, not just the summary line.
- [ ] Ana should have run `/diagnosing-bugs` on every issue first.
  > That's for hunting a stubborn bug's cause, not for sorting twenty issues.
```

```test sequence-one-item
Triage is looking at one bug report from a stranger. Which order matches the Skill?
- [ ] Recommend → gather context → grill if needed → verify → apply the outcome
  > It can't recommend before reading anything, and verification comes before any grilling.
- [x] Gather context → recommend → verify → grill if needed → apply outcome
  > Right. Read and check first, recommend and wait, prove the claim, flesh it out if needed, then act.
- [ ] Gather context → grill → apply outcome → verify
  > Verifying after the outcome means a brief could already be out on an unproven claim.
- [ ] Verify → apply outcome → recommend → gather context
  > Triage recommends and waits for you before any outcome is applied, and it reads the issue first.
```

```test predict-reporter-replies
An issue has sat in `needs-info` for a week. The reporter finally replies with exact steps. What happens to it?
- [ ] It moves straight to `ready-for-agent`, because the missing information has arrived.
  > New information still has to be evaluated, and the claim verified, before anything is agent-ready.
- [ ] It stays in `needs-info` until you remove the label by hand.
  > The state machine sends it back when the reporter replies, and triage surfaces it for you.
- [x] It goes back to `needs-triage` and shows up as needing your attention.
  > Right. A reply sends it back for evaluation, and needs-info issues with new replies are one of the three attention buckets.
- [ ] It goes to `wontfix`, because a week without an answer means the report has gone stale.
  > The reporter did answer. Auto-closing silent issues is something Matt's own repo automates, not the Skill.
```

```sources
- [triage SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/triage/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [triage AGENT-BRIEF.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/triage/AGENT-BRIEF.md) and [OUT-OF-SCOPE.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/triage/OUT-OF-SCOPE.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [setup-matt-pocock-skills SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md) and [triage-labels.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/triage-labels.md) (label mapping, local `Status:` line): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md) (on-ramps: triage only issues you didn't create) and [to-tickets SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md) (tickets are labelled `ready-for-agent`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /triage Skill](https://www.aihero.dev/skills-triage), AI Hero docs (verify before you brief, the bulk-pass report), read 2026-10-23.
- [Burn through the backlog from hell with /triage](https://www.youtube.com/watch?v=MzWIIlx0Gpc), Matt Pocock, 2026-05-07 (teams 0:00–0:31, every repo 0:33, roles 0:52–2:09, Sandcastle first pass 3:04–4:45, `.out-of-scope/` 3:45–4:29, reproduce it yourself 4:45–5:28, queue management 6:02–6:29, fixing in the session 7:29–7:37, PR habit 8:05–8:17).
- [mattpocock/skills `.out-of-scope/` folder](https://github.com/mattpocock/skills/tree/main/.out-of-scope), added 2026-10-06, read 2026-10-23.
- [mattpocock/skills triage workflows](https://github.com/mattpocock/skills/tree/main/.github/workflows) (`triage-label.yml`, `needs-info.yml`), added 2026-10-05, read 2026-10-23.
- [Issue #863: my team finds needs-info comments hard](https://github.com/mattpocock/skills/issues/863), opened 2026-08-14, read 2026-10-23.
- [Discussion #1136: afk.sh](https://github.com/mattpocock/skills/discussions/1136), Warshoow, 2026-09-28.
- [AFK](https://www.aihero.dev/ai-coding-dictionary/afk), AI Coding Dictionary, 2026-09-24, read 2026-10-23.
```
