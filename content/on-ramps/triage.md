---
title: triage: sort Issues other people file
slug: triage
summary: triage sorts Issues that other people file, with labels and checks, until each is ready to build, waiting on its reporter, or turned down.
---

## What it's for

Say your yoga-studio booking site is public, and strangers file [Issues](/learn/issues-and-keeping-track): crash reports, feature requests, vague ideas. You can't tell which hold up, and an agent can't build from them yet.

**triage moves each one through a small set of labels until it's ready to build, waiting on the person who filed it, or turned down.** That person is its **reporter**. A label is a tag on the Issue.

```checkpoint quick-1
You run triage on a stranger's Issue. Where can that Issue end up?
- [x] Ready to build, waiting on its reporter, or turned down.
- [ ] Built and merged into main, with its branch removed.
- [ ] Moved into your Spec, as one more of its Tickets.
Why: triage sorts Issues and doesn't build them. It moves each one through labels until it's ready to build, waiting on the person who filed it, or turned down.
```

You type `/triage` and describe what you want. Say Issue #42 reports an error page, with no steps:

```text
You:   /triage Let's look at #42
Agent: I'd call it bug and needs-info (waiting on the reporter): it gives no steps. Go ahead?
You:   Yes.
Agent: Done. I've asked the reporter for the steps.
```

With steps, the agent would follow them to check the claim. Then, if a request is vague, it [grills](/learn/grill-before-you-build) you with questions before applying labels.

```checkpoint quick-2
A report gives clear steps to follow. What does the agent do with them?
- [x] Follows them itself, to check that the claim holds up.
- [ ] Copies them into a comment, for the reporter to confirm.
- [ ] Skips them, since a report with steps needs no check.
Why: Steps let the agent check the claim for itself, by following them. Any grilling comes after that check.
```

triage is an **on-ramp**: a starting point that creates work, then joins the [main flow](/learn/main-flow). [implement](/learn/implement) later picks up its `ready-for-agent` Issues.

```checkpoint quick-3
A triaged Issue has got `ready-for-agent`. What happens to it later?
- [x] implement picks it up, so the work joins the main flow.
- [ ] The reporter picks it up and builds the fix themselves.
- [ ] triage builds it, since an on-ramp stays off the main flow.
Why: An on-ramp creates work, then joins the main flow. Here, implement later picks up the `ready-for-agent` Issues that triage produces.
```

## When to use it

- You maintain something public, and reports are piling up. Type `/triage Show me anything that needs my attention`.
- You want one Issue sorted. Type `/triage Let's look at #42`.

```checkpoint quick-4
Which of these is a job for triage?
- [x] Reports from outsiders are piling up on your public repo.
- [ ] Your settled Spec needs splitting into Tickets for agents.
- [ ] A build went badly, and you want to know what to change.
Why: triage is for reports piling up on something you maintain. It sorts what's waiting, or one Issue you name.
```

## When not to use it

- If [to-tickets](/learn/to-tickets) made the [Ticket](/learn/issues-and-keeping-track), use [implement](/learn/implement) instead, because it's already ready for an agent. triage is only for Issues you didn't create.
- If you want a hard bug's cause, use [diagnosing-bugs](/learn/diagnosing-bugs) instead, because triage only checks that a report holds up.

```checkpoint quick-5
to-tickets has published your Tickets. Do you run triage over them?
- [x] No: they're already ready for an agent, so use implement.
- [ ] Yes: every new Issue must be sorted before an agent builds it.
- [ ] Yes: triage adds the blockers that those new Tickets are missing.
Why: triage is only for Issues you didn't create. Tickets from to-tickets are already ready for an agent, so implement can take them without another pass.
```

## What it needs to start

Only you can start it, by typing `/triage`. It needs an [Issue tracker](/learn/issues-and-keeping-track) whose labels [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) has set up.

```checkpoint quick-6
Reports are piling up, and you haven't said anything. Does the agent start triage?
- [x] No. Only you can start it, by typing `/triage`.
- [ ] Yes. It starts by itself when an Issue has no labels.
- [ ] Yes. It starts by itself after each merge into `main`.
Why: Only you can start triage, by typing `/triage`. However many reports are waiting, the agent won't begin without you.
```

## What it creates

One category, one state: every triaged Issue should carry exactly one **category label**, `bug` (broken) or `enhancement` (a new feature). It also needs exactly one **state label**, saying where it stands:

- `needs-triage`: you still need to look at it.
- `needs-info`: waiting on the reporter.
- `ready-for-agent`: an agent can build it without you.
- `ready-for-human`: a person has to build it.
- `wontfix`: it won't be done.

```checkpoint quick-8
A report is fully described, but only a person can do the work. Which state label fits?
- [x] `ready-for-human`
- [ ] `ready-for-agent`
- [ ] `needs-info`
- [ ] `wontfix`
Why: `ready-for-human` means a person has to build it. `ready-for-agent` would send it to an agent, `needs-info` waits on the reporter, and `wontfix` means it won't be done.
```

```diagram
type: tree
caption: "One category, one state"
root:
  label: "every triaged Issue"
nodes:
  - label: "exactly one category label"
    children:
      - label: "`bug`"
      - label: "`enhancement`"
  - label: "exactly one state label"
    children:
      - label: "`needs-triage`"
        note: "you still need to look at it"
      - label: "`needs-info`"
        note: "waiting on the reporter"
      - label: "`ready-for-agent`"
        note: "an agent can build it without you"
      - label: "`ready-for-human`"
        note: "a person has to build it"
      - label: "`wontfix`"
        note: "it won't be done"
```

```checkpoint quick-7
An Issue has the category label `bug`. How many state labels does it carry too?
- [x] Exactly one: a triaged Issue has one of each kind.
- [ ] One for each state it has passed through so far.
- [ ] None, because a category label is enough on its own.
Why: Every triaged Issue carries exactly one category label and exactly one state label. The first says what it is, and the second says where it stands.
```

triage also leaves a comment, starting "This was generated by AI during triage."

- For `ready-for-agent`, an **agent brief**: a contract an agent works from without you there. It says what happens now, what should happen, and testable **acceptance criteria**: the checks that decide whether the work is done. It should name no file paths or line numbers, because they go stale.
- For `needs-info`, triage notes: what's settled, and specific questions for the reporter.

```checkpoint quick-9
You're checking an agent brief. Which of these should it leave out?
- [x] File paths and line numbers, because those go stale.
- [ ] Acceptance criteria, because the agent decides when it's done.
- [ ] What happens now, since the agent can see the code.
Why: A brief says what happens now, what should happen, and testable acceptance criteria. It leaves out file paths and line numbers, because those go stale.
```

`wontfix` closes the Issue. Only a turned-down feature request, not a bug, gets a file in `.out-of-scope/`: a folder remembering why, so nobody argues it again. Something already built is also `wontfix`: it gets a pointer to where it lives, not a file.

```checkpoint quick-10
A feature request turns out to be built already. What does it get?
- [x] A pointer to where it lives, and no file in `.out-of-scope/`.
- [ ] A file in `.out-of-scope/`, so that nobody argues for it again.
- [ ] A new Ticket, so that an agent can build it a second time.
Why: Only a turned-down feature request gets a file in `.out-of-scope/`. Something already built wasn't turned down, so it gets a pointer to where it lives.
```

## Going deeper

### Why it exists

Work from outside arrives, in the words of Matt Pocock, who wrote the Skill, "in whatever shape the reporter left it." Some reports don't hold up. Others ask for something you've already built or already turned down. So triage checks each one, then leaves an agent-ready brief, a specific question for the reporter, or a closed Issue with a recorded reason.

triage is older than the Spec flow ([to-spec](/learn/to-spec), then [to-tickets](/learn/to-tickets), then [implement](/learn/implement)), and it does a different job: it handles reports other people filed. So if everything in your tracker came from your own planning, you'll rarely use it. Its main use is open-source repos that take Issues from outside contributors.

```checkpoint quick-11
All your Issues come from your own planning. How much will you use triage?
- [x] Rarely, because it handles reports other people filed.
- [ ] Daily, because every Issue must be sorted before it's built.
- [ ] Weekly, because its labels go stale as the code changes.
Why: triage does a different job from the Spec flow. It handles reports other people filed, so with none of those you'll rarely use it.
```

### How it works underneath

**It recommends, then waits.** When you label by hand, you do the reading and the deciding. triage does the reading, then stops. It gives you its category and state call with its reasons, plus what it found in the code. It applies nothing until you tell it to.

```checkpoint quick-12
triage has read an Issue and formed a view. What does it do next?
- [x] Gives you its call and reasons, then stops until you answer.
- [ ] Applies the labels, then tells you so that you can undo them.
- [ ] Posts an agent brief, so that an agent can start straight away.
Why: triage does the reading but not the deciding. It gives you its category and state call with its reasons, and applies nothing until you tell it to.
```

For one Issue, the steps run in this order: gather context, recommend and wait, verify the claim, grill if needed, then apply the outcome.

```diagram
type: chain
caption: "the steps run in this order"
steps:
  - "gather context"
  - "recommend and wait"
  - "verify the claim"
  - "grill if needed"
  - "apply the outcome"
```

**Two cheap checks run while it gathers context.** Both look for what a request means, not its exact words:

- **Redundancy.** Is the request already built? A hit is an already-built `wontfix`.
- **Prior rejection.** Does `.out-of-scope/` already say no? A request for a "night theme" matches `dark-mode.md`. triage shows you the old reason and asks if you still agree. You decide: close it, reconsider, or call the requests different.

```checkpoint quick-13
While it gathers context on a request, what two things does triage ask?
- [x] Is it already built, and does `.out-of-scope/` already say no?
- [ ] Do the tests pass, and does the code meet the coding standards?
- [ ] Is the reporter a contributor, and is the Issue under 14 days old?
Why: These are the two cheap checks. Redundancy asks if the request is already built, and prior rejection asks if `.out-of-scope/` already says no.
```

**Verifying the claim is shallow on purpose.** It asks whether the report is real and roughly where it lives, not what caused it. It ends in one of three results: confirmed, couldn't reproduce it, or not enough detail to try. That last result is the strongest sign for `needs-info`.

```checkpoint quick-14
The check on a report ends in "not enough detail to try". Which state does that suggest?
- [x] `needs-info`, because that result is its strongest sign.
- [ ] `wontfix`, because a thin report is turned down at once.
- [ ] `ready-for-human`, because a person can add the detail.
Why: Not enough detail to try is the strongest sign for `needs-info`. The verifying is shallow on purpose, so it stops there and doesn't hunt for a cause.
```

**The brief is written to last.** An Issue may wait days or weeks while the code changes, so a brief names types and function signatures. It also says what's out of scope. A confirmed claim makes it much stronger. `ready-for-human` gets the same structure, plus why a person has to do it.

**The listing is for choosing.** `/triage Show me anything that needs my attention` shows three groups, oldest first: Issues with no labels, `needs-triage` ones, and `needs-info` ones the reporter has answered. You pick one from there.

```checkpoint quick-15
You type `/triage Show me anything that needs my attention`. What do you get?
- [x] Issues with no labels, `needs-triage` ones, and answered `needs-info` ones.
- [ ] Every open Issue, newest first, with each of its comments in full.
- [ ] Only the `ready-for-agent` Issues, so you can pick one to build next.
Why: The listing shows three groups, oldest first. They're the Issues waiting on you, so `ready-for-agent` ones aren't among them.
```

**Your label names can differ.** Matt calls these labels "roles", and your tracker's labels may use other names. setup-matt-pocock-skills records which is which. If it hasn't, triage tells you to run it.

**Outsiders' pull requests can join in.** A setting in `docs/agents/issue-tracker.md` brings them in. Then "a PR is an issue with attached code", with the same labels. The setting is off by default.

### A real example

Matt runs his own repo this way. Its `SCOPE.md` file sets a two-part bar for an idea or feedback Issue to stay open. It must describe a failure in a real session. It also can't match an earlier rejection, or be a config option or one person's tweak.

An Issue that can't be judged against the bar gets one round of questions and the `needs-info` label. With no reply from the reporter in 14 days, it's closed.

```checkpoint quick-16
On Matt's repo, an Issue can't be judged against his bar. What happens to it?
- [x] One round of questions, and it's closed after 14 days with no reply.
- [ ] It's closed at once, because anything unclear falls short of the bar.
- [ ] It stays open until Matt reads it himself, however long that takes.
Why: It gets one round of questions and the `needs-info` label. With no reply from the reporter in 14 days, it's closed.
```

In May 2026, Issue #139 asked for a sixth state, `blocked`. The reporter's problem was a fully briefed Issue that depended on another one. The cost, in their words: "An agent picks it up, hits a wall because the prerequisite isn't done yet, and you've wasted a cycle." Matt agreed the same day, but wondered whether `paused` was a better name.

In October 2026, a triage pass reached it. Its comment, on Matt's account, opens with the AI disclaimer and keeps the Issue open, because it clears the bar. It chooses `ready-for-human` "because the fix is a design call, not a mechanical edit". Matt had agreed a state is needed, but its name, `blocked` or `paused`, was still open.

```checkpoint quick-17
A triage pass keeps an Issue open but gives it `ready-for-human`. Why a person?
- [x] The fix is a design call, not a mechanical edit.
- [ ] The fix is a mechanical edit, too small for an agent.
- [ ] The Issue fell short of the bar for staying open.
Why: A person has to make a design call. A state was agreed, but its name was still open, and the Issue did clear the bar.
```

The same day, a triage comment on Issue #616 wrote a one-paragraph agent brief, and `ready-for-agent` was added. Pull request #1197 closed that Issue the next day.

So the state label says who takes the work next: a person for a design call, an agent for a fully described fix.

### Where it goes wrong

**An agent ignores your new Tickets.** One user ran the Spec flow and saw `needs-triage` on the output, and the agent they'd left working alone ignored everything. to-tickets applies `ready-for-agent` when it publishes Tickets. So check for that label, and don't run triage over them: you'd waste the work.

**An agent gets stuck on a fully briefed Issue.** The Issue waits on another one, but `ready-for-agent` lets an agent pick it up anyway. The five states have no slot for this. It's the most-filed gap on the Skill. It has two more forms: future work waiting for something to happen, and work "implemented, awaiting verification". None of these has shipped, so people add an extra label of their own beside the category. A triage comment on #139 asks whether triage still needs its own state now that Tickets carry blocking edges.

```checkpoint quick-18
An Issue is fully briefed but waits on another Issue. Which of the five states says so?
- [x] None of them, so people add an extra label beside the category.
- [ ] `needs-info`, since it's waiting on something before it can start.
- [ ] `wontfix`, until the Issue it's waiting on has been closed.
Why: The five states have no slot for an Issue that's ready but waiting. None of the proposed states has shipped, so people add an extra label of their own.
```

**Issues marked "already fixed" get new briefs.** One user's three Issues had comments saying so, and all three got new agent briefs. The listing is cheap, for picking one Issue. Across many Issues, the agent can use it as its only evidence, and in that case it returned Issue bodies but not comments. So for a bulk pass, tell it to read the comments on each Issue.

```checkpoint quick-19
You want triage to sort twenty Issues in one go. What must you tell it?
- [x] To read the comments on each Issue.
- [ ] To skip any Issue that has a comment.
- [ ] To apply labels before it reads Issues.
Why: One user's listing returned Issue bodies but not comments, and the agent used it as its only evidence. So for a bulk pass, tell it to read each Issue's comments.
```

**`gh` says a label wasn't found.** In Issue #616, the agent's `gh issue edit` failed with "'ready-for-human' not found". Setup used to write the label names to a file without creating the labels. Matt's page still calls this an open bug and says to run `gh label create` yourself, which works. But #616 closed in October 2026, and the current setup-matt-pocock-skills creates each configured label the tracker lacks.

```checkpoint quick-20
`gh` says `ready-for-human` wasn't found. Which Skill creates that label today?
- [x] setup-matt-pocock-skills, which creates each missing label.
- [ ] triage, which creates each label the moment it needs one.
- [ ] to-tickets, which creates each label as it publishes Issues.
Why: Setup used to write the label names to a file without creating the labels. The current setup-matt-pocock-skills creates each configured label the tracker lacks.
```

### Try it

Play an outsider on your practice project, and watch triage stop for you. You'll need that project, the yoga-studio booking site, open in Claude Code. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In a terminal, file a report with no steps: `gh issue create --title "Booking a Sunday class shows an error page" --body "Please fix it."`. You should see a link ending in the Issue's number.
2. In Claude Code, type `/triage Let's look at #N`, with that number. You should see its category and state call, with reasons. Then it stops.
3. Tell it to go ahead with `bug` and `needs-info`.
4. Open the Issue: `gh issue view N --web`. You should see both labels, and a comment opening with the AI disclaimer.
5. Read the comment's questions. They should be specific, not "please provide more info".
6. Reply as the reporter: `gh issue comment N --body "Open a Sunday class, then click Book."`.
7. Type `/triage Show me anything that needs my attention`. You should see your Issue in the group of answered `needs-info` ones.

### Read more

- [The /triage Skill](https://www.aihero.dev/skills-triage), Matt Pocock, updated 2026-08-24.
- [SCOPE.md in mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/SCOPE.md), Matt Pocock, 2026-10-06.
- [Suggestion: "blocked" as a sixth triage state (#139)](https://github.com/mattpocock/skills/issues/139), aAtila, with replies from Matt Pocock, 2026-05-06.
- [Triage labels missing (#616)](https://github.com/mattpocock/skills/issues/616), mentelm, 2026-07-18.

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint triage-deeper-blocked-state
A user asks for class waitlists on your booking site. After sorting, the Issue gets a full agent brief and ready-for-agent. But it needs the payments Issue, still open, to land first. An agent picks it up, gets stuck, and the run is wasted. Why did the label let that happen?
- [x] The five states have no slot for "fully briefed, but waiting on another Issue".
- [ ] The brief named file paths that had moved, so the agent couldn't find the code.
  > Nothing here says the brief named files, and a good brief never does. The agent got stuck because the work it needed wasn't done yet.
- [ ] The Issue should have stayed needs-info until the reporter wrote the payments part.
  > needs-info waits on the reporter for information. This Issue was fully specified; it was waiting on other work, not on answers.
- [ ] Waitlists are a feature, and ready-for-agent is meant only for small bug fixes.
  > ready-for-agent covers enhancements too. The gap is that no state says "ready, but blocked by another Issue".
Why: One state label can't say "briefed, but blocked". So ready-for-agent looks true, an agent picks the Issue up, and it hits a wall. A blocked state hasn't shipped, so people add an extra label of their own. Tickets handle this differently: each lists its blocking edges, and only the frontier, the Tickets whose blockers are all done, should be picked up.
```

## Remember

```flashcards
Q: What are triage's five state labels?
A: needs-triage, needs-info, ready-for-agent, ready-for-human and wontfix.

Q: Where does triage merge onto the main flow?
A: At [implement](/learn/implement), which later picks up its agent-ready Issues.

Q: What does triage leave on an Issue it has sorted?
A: One category label and one state label, and usually a comment (optional for needs-triage) that starts with an AI disclaimer, such as an agent brief or triage notes.

Q: When does triage write a file to .out-of-scope/?
A: Only when a feature request is turned down as wontfix. Never for a bug, and never for something already built.

Q: On Matt's own repo, what happens to an Issue that can't be judged against his bar?
A: It gets one round of questions and the needs-info label. With no reply from the reporter in 14 days, it is closed.

Q: Why did a triage pass label Issue #139 on Matt's repo ready-for-human?
A: Because the fix is a design call, not a mechanical edit: Matt agreed a state is needed, but the name, blocked or paused, was still open.

Q: triage fails with "'ready-for-human' not found". Which Skill creates missing labels now?
A: [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills): on GitHub or GitLab it creates each configured label the tracker lacks. Matt's page still calls this an open bug, but #616 closed in October 2026.
```

## Final test

```final-test triage-labels-per-issue
Which labels does a triaged Issue carry?
- [x] Exactly one category label and exactly one state label.
- [ ] Each state label it has passed through, so its history shows.
- [ ] A state label, with the category written in the comment.
- [ ] As many category labels as fit, plus one state label.
Why: The category says what the Issue is (bug or enhancement), and the state says where it stands. Having exactly one state keeps queries simple. If state labels ever conflict, triage flags that and asks you first.
```

```final-test triage-already-built
A feature request turns out to be built already. What does triage do?
- [x] Closes it as wontfix, points to where it lives, and doesn't write to .out-of-scope/.
- [ ] Closes it as wontfix, points to where it lives, and adds an entry to .out-of-scope/.
- [ ] Marks it ready-for-agent so an agent can confirm the feature works as asked.
Why: .out-of-scope/ records requests that were turned down. A built feature wasn't turned down, so a file there would make later checks treat it as a rejection. The closing comment points to the feature instead.
```

```final-test triage-brief-leaves-out
What does a good agent brief leave out?
- [x] File paths and line numbers.
- [ ] Testable acceptance criteria.
- [ ] Types and function signatures.
- [ ] How the system behaves now.
Why: An Issue can sit in ready-for-agent for days or weeks while the code changes. File paths and line numbers go stale in that time, so the brief names behaviour, types and function signatures instead.
```

```final-test triage-deeper-recommend-then-wait
Once it has gathered context on an Issue, what does triage do before it verifies the claim or changes anything?
- [x] Tells you its category and state call, with its reasons, then waits for you to decide.
- [ ] Applies the labels it thinks fit, then tells you what it changed so you can undo it.
- [ ] Posts an agent brief on the Issue straight away, so an agent can start on it.
- [ ] Closes the Issue as wontfix if the reporter left out the steps to reproduce it.
Why: triage does the reading, but you do the deciding. After gathering context, it gives you its category and state call, with its reasons, and waits. Only then does it verify the claim, and it applies nothing until you tell it to.
```

```final-test triage-deeper-concept-match
A new Issue asks for a "night theme". Your repo's `.out-of-scope/` folder holds `dark-mode.md`. What does triage do?
- [x] Matches them by concept, shows you the old reason and asks if you still agree.
- [ ] Finds no match, since no file name contains "night", and sorts it as a new request.
- [ ] Closes the new Issue as a duplicate at once, quoting the old file, without asking you.
- [ ] Deletes `dark-mode.md`, because a new request means the old decision is out of date.
Why: Matching in `.out-of-scope/` goes by what a request means, not by its words, so "night theme" matches `dark-mode.md`. triage shows you the old reason and asks if you still agree, so the request isn't argued again from the start.
```

```final-test triage-raw-reports
Your FastAPI booking backend is public on GitHub. Over a week, strangers have opened six Issues: two crash reports, three feature requests and one you can't make sense of. None has a label yet, and you want to know which are real and what each one needs next. Which fits best?
- [x] Label each Issue, check its claim and brief the ones ready to build.
  > Right: that's `/triage`.
- [ ] Split the Issues into thin Tickets, each with its blocking links.
  > That's `/to-tickets`. It splits a Spec you've already talked through. These are raw Issues from other people that nobody has checked yet.
- [ ] Build a feedback loop for the first crash report and hunt its cause.
  > That's `/diagnosing-bugs`. You don't yet know which reports hold up or matter. Sorting them comes first; a hard bug can get its loop later.
- [ ] Hand the Issues to an agent to build, one at a time, test-first.
  > That's `/implement`. None of them is agent-ready yet. They have no labels, no checked claims and no briefs.
Why: Issues you didn't write arrive raw, so nobody yet knows which hold up or what each one needs. Sorting them with labels, checking each claim and writing agent briefs turns them into work an agent can pick up.
```

```final-test triage-fresh-tickets
Two Issues are open on your website's tracker. #14 is a Ticket you published yesterday, when you split your sign-up page Spec. #15 is a crash report a user filed overnight. The agent moves #15 through labels and checks, but sends #14 straight to be built. Why the difference?
- [x] #14 came from your own Spec, so it's ready; #15 arrived raw.
- [ ] Crash reports are urgent, so #15 gets checked before anything else.
  > Urgency isn't the line. The sorting is only for Issues you didn't create, whatever they report.
- [ ] #14 is a new feature, and the sorting is meant for bugs.
  > The sorting handles feature requests too: enhancement is one of its two categories.
- [ ] #14 has blocking links, which keep it out of the sorting.
  > Blocking links don't decide it. #14 skips the sorting because your own split already made it agent-ready.
Why: What matters is who wrote the Issue, not how urgent it is. #15 came from a user, so it arrived raw and needs sorting. #14 came from splitting your own Spec, so it's already ready for an agent and goes straight to be built.
```

```final-test triage-brief-posted
A user reported that the Docker image of your FastAPI app won't start on ARM laptops. The claim was checked and confirmed, the Issue now carries bug and ready-for-agent, and an agent brief is posted on it. What comes next?
- [x] An agent builds the fix from the brief, in a fresh session.
  > Right: that's `/implement`.
- [ ] Write a Spec for the ARM fix, then split it into Tickets to build.
  > That's `/to-spec`. The brief is already the contract for this one fix. A Spec is for a whole feature built over many sessions.
- [ ] Go through the Issue again to check its labels and brief.
  > That's `/triage`. It's already sorted and briefed. Going over it again only repeats work.
Why: triage joins the main flow at implement, which picks up its `ready-for-agent` Issues. The brief is written to stay useful through days or weeks of waiting, so a fresh session can work from it alone.
```

```final-test triage-why-question-vague-request
Someone asked for "better notifications" in your AI agent dashboard. The agent sorting incoming Issues doesn't mark it ready-for-agent yet. First it asks you a round of questions about it, and only then writes the brief. Why does it ask first?
- [x] A brief needs testable acceptance criteria, and a vague request has none yet.
- [ ] The questions are a polite way to turn it down before closing it as wontfix.
  > The questions shape the request so it can be built. Turning a request down is a separate outcome, with its own comment.
- [ ] It needs your answers to choose which file paths the brief should list.
  > A good brief never names file paths, because they go stale.
Why: A brief must have testable acceptance criteria, and "better notifications" gives you nothing to test yet. So the agent grills you first, a round of questions at a time, until the request is clear enough to brief.
```

```final-test triage-deeper-bulk-pass
Your yoga-studio repo has 15 open Issues from users. You ask the agent to sort all of them in one go. Three of them already had a comment saying "fixed in #40, recommend closing", yet each of the three got a fresh agent brief and ready-for-agent. Why did that happen?
- [x] It worked from a cheap listing of Issue bodies, and never read their comments.
- [ ] Comments from people other than the reporter are ignored on purpose, to avoid bias.
  > Nothing in the Skill ignores comments on purpose. For one Issue it reads the body and the comments; a listing of bodies alone doesn't include them.
- [ ] A brief is always written for a confirmed bug, even when someone says it's fixed.
  > An already-fixed request is a wontfix that points to where the fix lives. The briefs came from missing evidence, not from a rule.
- [ ] Issues stay open until a pull request closes them, so a comment alone can't count.
  > Comments do count when they're read. Here they never reached the agent, because the listing it relied on held bodies only.
Why: The "show what needs attention" pass is a cheap listing for picking one Issue. Across many Issues, the agent can treat a listing as its only evidence, and one of bodies leaves the comments out. An agent can't use what isn't in its context window. So for a bulk pass, tell it to read the comments on each Issue.
```

```sources
- [The /triage Skill](https://www.aihero.dev/skills-triage), Matt Pocock, 2026-08-24
- [triage: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/SKILL.md), Matt Pocock's Skills
- [triage: AGENT-BRIEF.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/AGENT-BRIEF.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [triage: OUT-OF-SCOPE.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/OUT-OF-SCOPE.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [SCOPE.md (mattpocock/skills at a496f55)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/SCOPE.md), Matt Pocock, 2026-10-06
- [Suggestion: "blocked" as a sixth triage state #139](https://github.com/mattpocock/skills/issues/139), aAtila (comments by mattpocock and others), 2026-05-06
- [Triage labels missing #616](https://github.com/mattpocock/skills/issues/616), mentelm (comments by mattpocock and others), 2026-07-18
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
```
