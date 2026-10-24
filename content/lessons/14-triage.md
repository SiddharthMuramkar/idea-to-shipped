---
title: Triage
slug: triage
order: 14
part: 3
image: /photos/triage.jpg
imageAlt: Black-and-white photo of postal workers sorting letters into wall-mounted cubby-holes.
imageCredit: Library of Congress
---

When bug reports and requests pile up from other people, triage sorts each one into written instructions an AI agent can build from, a precise question for the reporter, or a closed report with the reason written down.

```goals
- You'll be able to tell work that needs triage (reports from other people) from work that never does, like the tickets `/to-tickets` made.
- You'll be able to read an issue's two roles, one category and one state, and say where it can move next.
- You'll be able to run a `/triage` session: list what needs attention, take one item from recommendation through verification to an outcome, or move it yourself with a quick override.
- You'll be able to judge an agent brief and decide which closed requests belong in `.out-of-scope/`.
```

## Why it matters

Picture this site a few months from now. Visitors (anyone reading it; nobody has an account) leave Comments beside each Lesson, and some are really bug reports or wishes. "My comment showed up blank." "Please add accounts so I can edit my old comments." You copy each one into the project's issue tracker: the list of reported problems and requests, each one an issue. On GitHub (a popular site for hosting code) that's the Issues tab; on this site it's one Markdown (plain text) file per issue, kept in the repo (the project's folder, whose history a tool called Git keeps). An issue gathers its own comments, notes added under the report, separate from the Visitors' Comments on Lessons.

Some reports are real bugs, some can't be reproduced, some ask for things you ruled out long ago, and some are already built. Hand one straight to Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) and it takes the reporter's word for everything. It may chase a bug that doesn't exist, or build the accounts you ruled out on day one. Sort forty reports by hand instead, and you spend an evening re-reading code and re-arguing old decisions.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, built `/triage` for exactly this. A Skill is a short instruction file the agent loads when you type its name, like `/triage`, or, for some Skills, when your request matches what the Skill is for; [Skills](/learn/skills) covers the details. In his May 2026 video on triage, he notes that most Skill setups suit a solo developer: once other people file ideas, someone must decide if each is worth building, really a bug, and reproducible (0:00–0:31). Triage hands that legwork to the agent while every call stays yours: ==it recommends, then waits==.

```callout big-idea
Triage itself writes no code. Every item ends with a brief (for an agent, or for a person), specific questions for the reporter, or a closed issue with the reason on record.
```

## The idea: two roles and a small state machine

A label is a tag on an issue, like `bug`. Triage treats labels as **roles**, and every triaged issue carries exactly two:

- **One category:** `bug` (something is broken) or `enhancement` (a new feature or an improvement).
- **One state**, out of five:

| State | Means |
|---|---|
| `needs-triage` | The maintainer (you: the person who looks after the project) still needs to evaluate it |
| `needs-info` | Waiting on the reporter to answer questions |
| `ready-for-agent` | Fully specified, ready for an agent to build unattended (normally with a brief attached) |
| `ready-for-human` | Specified, but a person has to do it |
| `wontfix` | Closed; it won't be acted on |

Matt calls an agent working unattended an AFK agent: away from keyboard, perhaps overnight, with nobody to ask. So anything marked `ready-for-agent` must be safe to build without a single question.

An issue can't be "ready for a human" and "not evaluated yet" at once, so the rule is ==exactly one category and one state==. If triage finds two state labels on one issue, it flags the clash and asks you before doing anything else. That rule is what makes this a state machine: a fixed set of states, and fixed moves between them.

- A new, unlabelled issue normally goes to `needs-triage` first, and from there to one of the other four. A quick first pass can stop at `needs-triage`; a full look at one issue can make both moves at once, as in the session below.
- When the reporter answers, a `needs-info` issue goes back to `needs-triage` for another look. The Skill doesn't watch for replies: your next triage run lists the reply, and the issue moves back when you look at it.
- You can override any move. If one looks unusual, triage flags it and asks first.

The five names are canonical; your tracker might call them something else. `/setup-matt-pocock-skills`, which you run once per repo before triage, records the mapping in `docs/agents/triage-labels.md` and, on GitHub or GitLab, creates any missing labels. This site's tracker is local Markdown: each issue is a file under `.scratch/<feature>/issues/`, with its state on a `Status:` line near the top. That convention names no line for the category, so the agent picks one, such as `Category: bug`.

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
# The reporter replies with exact steps. Your next triage run lists the reply and sends the issue back for another look.
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
- [x] Points out that it has two states and asks which one you want.
  > Right. Every issue gets exactly one state, so two at once is a conflict for the maintainer to settle before anything else.
- [ ] Closes it as `wontfix`, since conflicting labels make it impossible to act on.
  > A labelling mix-up says nothing about whether the bug is worth fixing.
```

## When to reach for it, and when not

Triage is for work ==you didn't create==: bug reports, feature requests, anything that arrives raw from someone else. Matt runs it on every open-source repo he maintains (0:33). On GitHub or GitLab it can also cover external pull requests (a PR is a proposed change to the code, waiting to be merged) if you switch that on in `docs/agents/issue-tracker.md`; it's off by default. It then treats each PR as an issue with code attached.

It's **not** for your own plans. When the idea is yours, Matt's Main flow (the path most work takes, from idea to shipped) goes `/grill-with-docs` (the agent interviews you about your idea), then `/to-spec` → `/to-tickets` if it's too big for one session (one Claude Code conversation). A spec is a written description of what to build and why; tickets are small tasks cut from it, each buildable in one session. `/to-tickets` marks its tickets `ready-for-agent` by default, so triaging them only redoes finished work. See [Spec + tickets](/learn/spec-and-issues).

So there are two lanes, yours and other people's. When yours ends in tickets, they ==meet at the same label==: `ready-for-agent`, which `/implement` (Matt's Skill that builds from a ticket) or an AFK runner (a script that hands each ticket to an agent) picks up the same way. See [Implement](/learn/implement) and [The main flow](/learn/main-flow).

| What you have | Reach for |
|---|---|
| Raw reports and requests from other people | `/triage` |
| A rough idea of your own | `/grill-with-docs` |
| Tickets that `/to-tickets` just made | Nothing: they're already `ready-for-agent` |
| A confirmed bug whose root cause you need | `/diagnosing-bugs` (see [Diagnosing bugs](/learn/diagnosing-bugs)) |

`/triage` is user-invoked. The agent can load a model-invoked Skill by itself when your words match its description, but never a user-invoked one, so "can you triage these?" won't start it. Type `/triage` at the start of your message, then what you want.

```checkpoint who-starts-triage
Twelve new bug reports land in your tracker overnight. In the morning you type "lots of new issues, can you triage them?" with no slash anywhere. What happens?
- [ ] The agent loads `/triage`, because your words match its description.
  > Only model-invoked Skills can be started by plain words. `/triage` is user-invoked.
- [x] Nothing loads `/triage` until you type it at the start of a message.
  > Right. Type `/triage` at the start of your message, then say what you want in plain words.
- [ ] `/triage` loads, but only after you approve a permission prompt.
  > There's no prompt to approve. Plain words never load a user-invoked Skill, so type `/triage` yourself.
- [ ] `/setup-matt-pocock-skills` runs first and then hands over to `/triage`.
  > Setup is user-invoked too, and no Skill can start a user-invoked one.
```

## A session, step by step

Type `/triage` and say what you want; later messages in the same session carry on with it. You can ask what needs attention, look at one issue, move one yourself, or ask what agents can pick up. Examples below use `#42`, meaning issue number 42; on a local tracker, give the file's number instead, like 01.

**`/triage Show me anything that needs my attention`** lists three buckets, oldest first, with a count and a one-line summary per item: unlabelled issues (never triaged), `needs-triage` (evaluation in progress), and `needs-info` issues where the reporter has replied since the last triage notes. Then you pick one.

**Looking at one item** runs five steps:

1. **Gather context.** It reads the whole issue, comments and earlier triage notes included, so it never re-asks a settled question. It explores the code with help from `GLOSSARY.md` (the project's word list) and ADRs (short records of past decisions). Two checks run here: is this **already built** (searched by idea, not the reporter's wording, and it says where it looked), and was it **rejected before** (it reads `.out-of-scope/`, covered below).
2. **Recommend.** One category and one state, with reasons and a short summary of the code involved. Then it waits for you.
3. **Verify the claim**, before any grilling. For a bug, it tries the reporter's steps itself; for a PR, it downloads the proposed change and runs the relevant tests. The result is confirmed (with the code path: which code actually runs), failed, or not enough detail to try, the strongest sign of `needs-info`.
4. **Grill, if needed.** If the request is fuzzy, it interviews you a round of questions at a time, using the grilling and domain-modeling Skills, and writes settled terms into `GLOSSARY.md` as you go. See [Grilling](/learn/grilling).
5. **Apply the outcome.** `ready-for-agent` gets an agent brief. `ready-for-human` gets the same kind of brief, plus the reason a person must do it: a judgment call, outside access, a design decision, testing by hand. `needs-info` gets Triage Notes. `wontfix` closes the issue with a comment whose shape depends on why.

Triage Notes have two parts, **What we've established so far** and **What we still need from you**, and the questions must be specific enough to answer, never "please provide more info". ==Every comment or issue triage posts starts with a disclaimer== line, `> *This was generated by AI during triage.*`, so readers know who wrote it. On a local tracker, comments go at the bottom of the issue's file, under `## Comments`.

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
agent: Not enough detail to try. The obvious case, a comment of only spaces, is refused with "Comment can't be empty." Without the reporter's exact steps I can't go further.
# It drafts Triage Notes with questions the reporter can actually answer.
agent: **What we've established:** empty and spaces-only comments are refused. **What we still need from you:** which Lesson, the exact text you typed, and whether the blank comment is still there after a reload.
# You approve. It writes the note, disclaimer first, and records one category and one state.
you: Post it.
agent: Added under `## Comments`, starting with the AI-triage disclaimer. The file now records **bug** as its category and `Status: needs-info`.
```

**Quick override.** When you already know the answer, say so: `/triage Move #42 to ready-for-agent.` Triage trusts you and applies the state directly, with no grilling, after telling you what it will change (labels, any comment, closing). It doesn't reproduce anything first, so use it on claims you've already checked. For `ready-for-agent`, it asks whether you want a brief written.

```checkpoint vague-report-question
A report on a recipe app says only "search is broken". Triage can't reproduce it and picks `needs-info`. Which question belongs in its Triage Notes?
- [ ] "Please provide more information about the problem."
  > That's exactly the kind of question the Skill forbids. The reporter can't tell what you need.
- [ ] "Which part of the search code do you think is failing?"
  > The reporter can't see the code. Ask what they did and what they saw, which gives triage steps to reproduce.
- [x] "What did you search for, and what did you expect to see?"
  > Right. It's specific and answerable, and the answer gives triage steps to reproduce.
- [ ] "Could you file a fresh report the next time it happens to you?"
  > That pushes the work back without gathering anything. Ask for the details now.
```

## The agent brief: what an AFK agent builds from

When an issue moves to `ready-for-agent`, triage posts an **agent brief**, a structured comment that becomes the contract; the report and discussion are just background. An issue can sit in the queue for days or weeks while the code changes underneath it, so the Skill asks for briefs that are ==durable rather than precise==:

- **Behaviour, not procedure.** Say what the system should do, not how to change it; the agent explores the code fresh and makes its own choices.
- **Names that last.** Name the pieces of code to look for: types (the shapes data takes), function signatures (a function's name, inputs and output) and the shape of any settings. Never file paths or line numbers: files get renamed and moved, and lines shift.
- **Acceptance criteria you can check:** the tests of "done", each one checkable on its own, so the agent knows when it's finished.
- **An out-of-scope list,** so the agent doesn't gold-plate (add extras nobody asked for) or wander into neighbouring features.

Here's the Skill's template filled in for a quirk this site's notes record. The ticket that built Lesson pages accepted, for v1, that an unknown address like `/learn/nope` showed the not-found page but answered with status 200 (the web's code for "OK") instead of 404 ("not found"). If a Visitor reported it, triage reproduced it, and you decided to fix it, the brief might read:

```md
> *This was generated by AI during triage.*

## Agent Brief

**Category:** bug
**Summary:** An unknown Lesson address shows the not-found page but answers 200

**Current behavior:**
Visiting /learn/<slug> for a Slug that doesn't exist renders the not-found
page, but the HTTP status is 200, so tools that check links treat it as a
real page.

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

There's no "open this file" and no line number, so if someone reorganises the folders next week, every line is still true. And because triage's normal flow reproduces a bug before briefing it, "Current behavior" would be a checked fact, not the reporter's guess.

```checkpoint testable-criterion
You're reviewing a brief for a bug on a bike-rental site. Which acceptance criterion could an agent actually check?
- [ ] Booking should work properly again for everyone.
  > "Properly" can't be checked. The agent wouldn't know when it's done.
- [ ] Customers stop complaining about wrong dates on their receipts.
  > The agent can't check that when it finishes. A criterion has to be something it can test itself.
- [ ] Use a better date library so this kind of bug can never happen.
  > That's an implementation choice, not an outcome. Briefs describe behaviour and let the agent choose how.
- [x] Booking a bike for 31 March shows 31 March on the receipt.
  > Right. It's concrete and checkable on its own, and says nothing about how to get there.
```

## `.out-of-scope/`: saying no once

Some requests you'll refuse for good. Refuse one only in a closing comment and the reason vanishes with the issue, so the next request restarts the argument. So when triage closes a **rejected enhancement**, it writes the decision to a folder at the root of the repo, `.out-of-scope/`. Matt describes it as a decision record for features you won't build (3:45–4:29).

- **One file per idea, not per issue.** `visitor-accounts.md`, not `issue-02.md`. Every later request for the same thing joins that file's Prior requests list.
- **Written like a short design note:** what was rejected and a real, lasting reason, such as the project's scope, a technical constraint or a strategic choice. "We're too busy right now" isn't a rejection; it's a delay.
- **Matched by idea, not keyword.** Triage reads every file in the folder while gathering context, so a request for a night theme matches `dark-mode.md`. On a match it brings up the earlier decision and its reason, and checks you still agree. You can confirm (the new issue joins Prior requests and is closed), reconsider (the file is updated or deleted, and triage carries on), or say the requests differ.

==Only rejected enhancements go here.== A rejected bug gets a polite explanation and is closed. A request that's **already built** is closed with a comment pointing to where it lives, and nothing goes into `.out-of-scope/`: a built feature recorded as rejected would mislead every later duplicate check.

```scene files
title: Rejecting a Visitor feature request for good (illustrative)
# A Visitor's request arrives in the local tracker: accounts, so they can edit old Comments.
+ .scratch/visitor-reports/issues/02-accounts.md
# The project's word list, `GLOSSARY.md`, says Visitors have no accounts and Comments can't be edited. You agree it's out, so triage writes one file for the idea.
+ .out-of-scope/visitor-accounts.md
# It adds a closing note to the issue under `## Comments`, linking the new file, and sets its Status line to wontfix.
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
- [x] Brings up the earlier rejection and asks whether it still stands.
  > Right. You can then confirm and close it, reconsider, or say the two requests differ.
- [ ] Closes the request at once, quoting the reason from the old file.
  > Triage never decides alone. A human confirms the match first.
- [ ] Writes a new file, `favourite-books.md`, for this request.
  > One file per idea. If you confirm the match, the request joins the existing file's Prior requests.
```

## How Matt and others use it

**Matt Pocock**, in his May 2026 video "Burn through the backlog from hell with /triage":

- **A first pass, then one at a time.** On Sandcastle, his tool for running AFK agents, he opened a new session and asked triage for just the issues he hadn't triaged yet. It found nine. He had it give each a category and `needs-triage`, so he'd face fewer decisions, then started on the bugs, beginning with #477 (3:04–4:48).
- **Make it check, not believe.** For that bug it recommended `ready-for-agent`, but he felt it was trusting the reporter too much. He had it reproduce the bug itself with his diagnosing Skill (today's `/diagnosing-bugs`) in the same session, then fixed it there (4:45–5:28, 7:29–7:37). In 1.3.1, the normal flow runs that check before any brief.
- **Labels feed the AFK agents.** He calls much of running AFK agents "queue management": you're the go-between for the people filing tickets and the AI building them. Sandcastle only touches issues marked `ready-for-agent` (6:02–6:29).

**Matt's own repo:** in October 2026 its `.out-of-scope/` folder held nine idea files; `new-skills.md` groups five requests for new Skills under one reason. GitHub automations added on 2026-10-05 label each new issue `needs-triage`, close `needs-info` issues after 14 silent days, and send an issue back to `needs-triage` when someone replies. That's his repo's automation, not the Skill, running the same state machine.

**Other developers:**

- A developer whose non-technical team feeds user feedback into GitHub reported in August 2026 (issue #863) that the team finds the `needs-info` comments long and draining. A question costs the agent nothing to write and a person real time to answer, so keep them few and short.
- afk.sh, a community project from September 2026, runs `/implement` overnight on each ticket triage labelled `ready-for-agent`, one fresh session per ticket. Its author's last run finished ten tickets in 62 minutes.
- Matt's docs tell of a bulk pass over many issues. The agent judged them all from the quick listing meant for picking one, which in that setup left out comments, so three issues whose comments already said "already fixed, recommend closing" got fresh briefs.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). On Windows you also need Git for Windows (git-scm.com), which lets Claude Code run the practice project's bash script. Allow 20 minutes.

1. In your terminal, make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir triage-practice
cd triage-practice
claude
```

2. Type a slash and the word triage. If `triage` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode (where the agent only reads and proposes) is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes.
4. Type `/setup-matt-pocock-skills`. Choose **Local markdown** for the tracker, keep the default triage labels, and pick `CLAUDE.md` (standing instructions Claude Code reads every session) if it asks which file to create. If it never asks about labels, tell it: "triage is installed; keep the default labels." When it shows drafts, say yes, and choose Yes when it asks to create files.
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

8. Type "Let's look at 01. Don't fix anything." When it recommends and waits, say go ahead, and answer any questions as the project's owner. At a permission prompt, choose Yes unless it wants to change `count.sh`. If it does, or starts changing it anyway, press Esc and type "Don't fix it; carry on with the triage." Then do 02: let it post Triage Notes, but don't answer them (you aren't the reporter). Then do 03: say you won't build it, because the README says the tool never changes files.
9. To see what it wrote, ask "Show me 01-wrong-count.md": its notes are at the bottom, under `## Comments`. Type `/exit` when you're done.

**It's working if:**

- [ ] It listed the three reports as unlabelled, with a count and one line each, and let you pick.
- [ ] For each, it recommended one category and one state with reasons, then waited for you.
- [ ] For 01 it ran `count.sh` to reproduce the miscount before writing any brief.
- [ ] The brief for 01 describes behaviour, with checkable acceptance criteria, an Out of scope list and no line numbers.
- [ ] For 02 it asked specific questions under "What we still need from you".
- [ ] For 03, once you said no, it wrote a file in `.out-of-scope/` with a reason and a Prior requests list.
- [ ] Every note it wrote starts with the AI-triage disclaimer.
- [ ] Each report ends with one state on its `Status:` line and one category written in the file.
````

## Common mistakes

- **Triaging your own tickets.** `/to-tickets` output is already `ready-for-agent`.
- **Skipping setup.** Without `/setup-matt-pocock-skills` there's no label mapping, and triage will tell you to run it.
- **Bulk passes from the listing.** Ask it to read each issue in full, comments included.
- **Writing `.out-of-scope/` for a built feature.** Point to where it lives instead.
- **Expecting a root cause.** Verification is shallow on purpose: is it real, and roughly where? For a stubborn bug, use `/diagnosing-bugs`.

```site-story
Not used on this site yet. Every ticket here came from my own planning, never from someone else's report: the v1 tickets started as `ready-for-agent`, apart from one `ready-for-human` step only I could do (connecting GitHub, Vercel and Neon). The repo is ready, with the five default labels in `docs/agents/triage-labels.md`; a Visitor's bug report would be the first thing to triage.
```

## Cheat sheet

| Moment | What to type or expect |
|---|---|
| Once per repo | `/setup-matt-pocock-skills` |
| See the queue | `/triage Show me anything that needs my attention.` |
| One item | `/triage Let's look at #42` |
| You already know the answer | `/triage Move #42 to ready-for-agent` (quick override) |
| What agents can take | `/triage What's ready for agents to pick up?` |
| Looking at one item | It reproduces the bug, or runs the PR's tests, before any brief |
| Vague report | `needs-info`, with specific questions in Triage Notes |
| Rejected feature | `wontfix`, plus a file in `.out-of-scope/` |
| Already built | `wontfix`, pointing to where it lives; nothing in `.out-of-scope/` |

## Final test

```test scenario-which-to-triage
Your tracker holds six new items for a climbing gym's booking page: four tickets `/to-tickets` cut from a plan you grilled yourself, plus a bug report and a feature idea a member emailed in, which you pasted in as issues. Which go through `/triage`?
- [x] Only the two pasted ones, because they came from someone else.
  > Right. Triage is the lane for work other people send in. Your own tickets are already `ready-for-agent`.
- [ ] All six: nothing should reach an agent without a triage pass.
  > Both lanes end at `ready-for-agent`. Your tickets got there through the Main flow, so triaging them would only redo the work.
- [ ] Only the four tickets, so triage can check your own plan first.
  > That's backwards. Grilling already tested your plan; the member's raw reports are what still need sorting.
- [ ] Only the member's bug report, since triage is built for bugs.
  > Triage handles bugs and enhancements alike. What matters is who created the work, not its category.
```

```test scenario-which-out-of-scope
Four requests on a bus-timetable site end up closed or set aside this week. Which one gets a file in `.out-of-scope/`?
- [ ] A bug report about a layout glitch that only one ad-blocker causes, which you won't fix.
  > A rejected bug gets a polite explanation and is closed. The folder is only for rejected enhancements.
- [x] A request for live bus positions, ruled out because the site only shows timetables.
  > Right. It's a rejected enhancement with a lasting reason, so it gets one file for the idea, and later requests join its Prior requests.
- [ ] A request to download timetables as a PDF, which the Download button already does.
  > Already built: close it with a pointer to the button. Recording a built feature as rejected would mislead later duplicate checks.
- [ ] A request for a route planner you'd like but have no time for yet.
  > That's a delay, not a rejection. "No time yet" isn't a lasting reason, so nothing goes in the folder.
```

```test scenario-quick-override
Yesterday you reproduced the bug in issue #31 yourself, and the reporter answered your last question in the issue's comments. You're sure it's ready for an agent. What's the fastest correct move?
- [ ] Write "please move #31 to ready-for-agent" in plain words and wait for triage to start.
  > Plain words can't start a user-invoked Skill. Type `/triage` first.
- [x] `/triage Move #31 to ready-for-agent.`, then say yes to a brief.
  > Right. Triage trusts you, says what it will change and applies it without grilling. Say yes to the brief: an AFK agent builds from it.
- [ ] `/triage Let's look at #31` and let it run every step again.
  > That works, but it re-reads, re-checks and re-recommends what you already know. The quick override skips all that.
- [ ] Wait for the reporter to add the label to the issue themselves.
  > Reporters don't set triage state. You're the maintainer, so the call is yours.
```

```test scenario-already-built
On a recipe site, someone asks for a printable version of each recipe. Searching the code, triage finds a working Print button on every recipe page. What's the right outcome?
- [ ] `wontfix`, with a new `.out-of-scope/printable-recipes.md` file.
  > That folder is for rejected requests. Recording a built feature there would make future checks call it rejected.
- [ ] `ready-for-human`, so a person can check the Print button works.
  > The check already found it working. Nothing needs building or testing by hand, so close it with a pointer.
- [x] `wontfix`, with a closing comment that points to the Print button.
  > Right. Already built means closing with a pointer, and nothing goes into `.out-of-scope/`.
- [ ] `needs-info`, asking the reporter why they want a feature that already exists.
  > Triage's search already answered the question. Point them to the button and close.
```

```test scenario-needs-human
Which of these reports should end up `ready-for-human` rather than `ready-for-agent`?
- [ ] A reproduced crash whenever the sign-up form is sent with an empty email field.
  > Confirmed, specific and testable: exactly what an AFK agent can take with a good brief.
- [ ] A request for a feature that the out-of-scope folder already rejects.
  > That's a match to confirm with you, then `wontfix`. Nobody builds it.
- [ ] A vague report that "something broke", with no steps at all.
  > Not enough detail to try means `needs-info`: ask the reporter specific questions first.
- [x] A clearly described bug that only shows up on the shop's card reader.
  > Right. An agent can't reach the hardware to reproduce the bug or test a fix, so a person has to do it. The brief says why.
```

```test spot-brief-paths
One line of a triage brief for a to-do app reads: "Open src/lib/tasks.ts and change line 88 so the due date uses the user's time zone." Spot the mistake.
- [x] It points to a file and a line number, and both will soon go stale.
  > Right. Briefs should be durable: describe the behaviour and name types or functions, never paths or lines.
- [ ] It should spell out the code to write, so the agent can't get it wrong.
  > That adds procedure. Briefs describe behaviour and let the agent choose how.
- [ ] It should name the reporter, so the agent can ask them questions.
  > An AFK agent works with nobody to ask, so the brief must stand alone. The real problem is the path and line number.
- [ ] It mentions the user's time zone, which is an implementation detail.
  > The time zone is the behaviour that matters here. It's the path and line number that won't last.
```

```test spot-no-verify
Sam typed `/triage Move #12 to ready-for-agent` on a bug report and had it write a brief from the report. Overnight, an AFK agent spent hours and found the code already handled that case correctly. What went wrong?
- [ ] Sam should have chosen `ready-for-human`, since bugs always need a person.
  > Plenty of bugs suit an agent. The problem is that nobody checked this one was real.
- [ ] The AFK agent should have asked the reporter for steps before starting.
  > An AFK agent works with nobody to ask. The check belongs in triage, before the label goes on.
- [ ] Sam should have had triage grill him before writing the brief.
  > Grilling fleshes out a fuzzy request. It can't tell you whether a bug is real; reproducing it can.
- [x] Sam should have had triage check the bug was real before the brief.
  > Right. The normal flow reproduces a bug before any brief; a quick override skips that, so use it only on a claim you've already checked.
```

```test spot-bulk-listing
Ana types `/triage` and asks it to handle all 30 open issues on her shop's tracker in one go. Afterwards, several Triage Notes ask reporters questions they had already answered in the issue's comments. What went wrong?
- [x] It sorted them from the overview list, never reading each one in full.
  > Right. Looking at one issue properly means reading all of it, comments and earlier notes included. For a bulk pass, ask for that on every issue.
- [ ] Triage only reads comments on issues that are labelled `needs-info`.
  > Triage reads the whole issue, whatever its label, whenever it looks at one properly. This bulk pass skipped that.
- [ ] The reporters should have edited their reports instead of commenting.
  > Comments are part of the issue, and triage is meant to read them. Nobody needs to rewrite a report.
- [ ] She should have triaged only the unlabelled issues, never the `needs-info` ones.
  > `needs-info` issues with new replies are one of the three buckets triage shows you. Skipping them wouldn't change what it read.
```

```test sequence-one-item
Triage is looking at a stranger's report that the export button crashes the app. In what order does it work through the report?
- [ ] Gather context → recommend → grill if needed → verify → apply outcome
  > Verification comes before any grilling, so you never spend questions fleshing out a claim that turns out to be false.
- [x] Gather context → recommend → verify → grill if needed → apply outcome
  > Right. Read and check first, recommend and wait, prove the claim, flesh it out if needed, then act.
- [ ] Gather context → verify → recommend → grill if needed → apply outcome
  > It recommends and waits for your go-ahead first; the reproduction comes after you say go.
- [ ] Gather context → recommend → grill if needed → apply outcome → verify
  > Verifying after the outcome is too late: the brief would rest on an unchecked claim.
```

```test predict-reporter-replies
On a bakery's tracker, issue #9 carries `bug` and `needs-info`. The customer replies with the exact order that failed. Under the Skill's state machine, which labels should #9 carry next?
- [ ] `bug` and `ready-for-agent`, because the missing details have arrived.
  > New details still have to be evaluated, and the claim verified, before anything is agent-ready.
- [ ] `bug`, `needs-info` and `needs-triage`, until you've read the reply.
  > Two states at once is the clash triage flags. An issue carries exactly one state.
- [x] `bug` and `needs-triage`, so you can evaluate it again with the reply.
  > Right. The category stays; the one state goes back to `needs-triage` for another look.
- [ ] `needs-triage` alone, since the category is decided again from scratch.
  > Every triaged issue keeps exactly one category alongside its one state.
```

```sources
- [triage SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/triage/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [triage AGENT-BRIEF.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/triage/AGENT-BRIEF.md) and [OUT-OF-SCOPE.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/triage/OUT-OF-SCOPE.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [setup-matt-pocock-skills SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/SKILL.md), [triage-labels.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/triage-labels.md) and [issue-tracker-local.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md) (label mapping, the PR flag, the local `Status:` line and `## Comments`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (on-ramps: triage only issues you didn't create) and [to-tickets SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-tickets/SKILL.md) (tickets are labelled `ready-for-agent` unless instructed otherwise): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /triage Skill](https://www.aihero.dev/skills-triage), AI Hero docs (verify before you brief, the bulk-pass report), read 2026-10-23.
- [Burn through the backlog from hell with /triage](https://www.youtube.com/watch?v=MzWIIlx0Gpc), Matt Pocock, 2026-05-07 (teams 0:00–0:31, every repo 0:33, roles 0:52–2:09, Sandcastle first pass 3:04–4:48, `.out-of-scope/` 3:45–4:29, reproduce it yourself 4:45–5:28, queue management 6:02–6:29, fixing in the session 7:29–7:37).
- [mattpocock/skills `.out-of-scope/` folder](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/.out-of-scope), in use since 2026-04-28 (`new-skills.md` added 2026-10-06), read 2026-10-23.
- [mattpocock/skills triage automations](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/.github/workflows) (`triage-label.yml`, `needs-info.yml`), added 2026-10-05, read 2026-10-23.
- [Issue #863: my team finds needs-info comments hard](https://github.com/mattpocock/skills/issues/863), opened 2026-08-14, read 2026-10-23.
- [Discussion #1136: afk.sh](https://github.com/mattpocock/skills/discussions/1136), Warshoow, 2026-09-28.
- [AFK](https://www.aihero.dev/ai-coding-dictionary/afk), AI Coding Dictionary, 2026-09-24, read 2026-10-23.
```
