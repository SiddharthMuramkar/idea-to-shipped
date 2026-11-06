---
title: Reading a repository
slug: reading-a-repository
summary: You’ll know what a repo, an ADR, a ticket and a glossary are, what each file in your project folder does, which parts of the brief feed the wayfinder map from Lesson 1, and how to tell a wayfinder…
---

Your Care4Mind folder looks like a wall of jargon, but it is really nine short text files and one shortcut, and each file has one job. This lesson gives every file and every strange word a plain meaning, so lines like “read the brief, snapshot, ADR-0001 and glossary” stop sounding like code.

```goals
- You’ll know what a repo, an ADR, a ticket and a glossary are, what each file in your project folder does, which parts of the brief feed the wayfinder map from Lesson 1, and how to tell a wayfinder ticket’s status from a build ticket’s.
```

## First, the most surprising fact: there is no website code yet

A **repo** (repository) is just a folder whose changes are tracked over time by a tool called Git, so nothing is ever really lost. Your project repo is `~/Desktop/project1`. Right now it contains no website, no app and no code at all — only planning documents, written before any building starts.

Every file ends in `.md`. That means **Markdown**: plain text where `#` makes a heading and `**word**` makes a word bold. You can read any of them as plain text, exactly as they are. Nothing is hidden inside a database.

```text
project1/                              the repo (one folder)
├── AGENTS.md                          standing orders for AI agents
├── CLAUDE.md -> AGENTS.md             a shortcut to the same file
├── GLOSSARY.md                        the agreed dictionary
└── docs/
    ├── project-brief.md               what we are going to build
    ├── client-brief.md                what the client first asked for
    ├── current-site.md                what the live site actually is
    ├── adr/
    │   └── 0001-rebuild-...md         decision no. 1, written down
    └── agents/                        how agents should work here
        ├── domain.md
        ├── issue-tracker.md
        └── triage-labels.md
```

`CLAUDE.md` is not a tenth file. It is a shortcut that points at `AGENTS.md`, so whichever name a tool looks for, it reads the same standing orders. Different AI tools look for different names; the shortcut means there is still only one text to keep right, and you always edit `AGENTS.md`.

```callout remember
Today the repo holds only planning documents: nine plain-text Markdown files and `CLAUDE.md`, a shortcut to `AGENTS.md`. There is no website code yet, and nothing is hidden in a database.
```

```checkpoint check-1
An agent says it will “fix the Questionnaire scoring code” in `~/Desktop/project1`. Why should that make you suspicious?
- [ ] Agents may not edit scoring code
- [ ] Scoring code lives in the glossary
- [x] The repo contains no code yet
- [ ] `CLAUDE.md` says agents can’t change code
Why: Right now the repo holds only planning documents: no website, no app and no code at all. There is no scoring code to fix, so ask what the agent is really looking at.
```

```checkpoint check-2
An agent deletes a paragraph from `docs/project-brief.md` by mistake. Why isn’t it lost for good?
- [x] Git tracks the folder’s changes over time
- [ ] Markdown files keep a hidden backup copy
- [ ] The same paragraph is still inside `CLAUDE.md`
- [ ] A database behind the folder stores it
Why: A repo is a folder whose changes Git tracks over time, so nothing is ever really lost. Markdown is plain text with no hidden copy, and nothing sits in a database.
```

## Three kinds of file live in this folder

Every file above does exactly one of three jobs. Once you can tell which job a file does, the folder stops being confusing, because you stop expecting a file to answer questions it was never meant to answer.

| Kind | Files | Plain meaning |
|---|---|---|
| Standing orders | `AGENTS.md`, everything in `docs/agents/` | Instructions to the AI agent: where things live, which words to use, how work is tracked. Not about Care4Mind’s content at all. |
| Project facts | The two briefs, `current-site.md`, `GLOSSARY.md` | What was asked for, what exists today, and what the project’s special words mean. |
| Decisions | Files in `docs/adr/` | One big choice per file, with the reasons, so nobody has to re-argue it later. |

The three files in `docs/agents/` are setup files for Matt’s skills. `domain.md` tells agents to read the glossary and any ADRs before working. `issue-tracker.md` says work items will live as files under `.scratch/`. `triage-labels.md` lists the labels build tickets can carry. You rarely open them yourself; the agent does, and later in this lesson you will see why the last two matter more than they look.

```callout remember
Every file does one of three jobs: standing orders for the agent (`AGENTS.md`, `docs/agents/`), project facts (the two briefs, `current-site.md`, the glossary) or decisions (`docs/adr/`). Know a file’s job and you know which questions it can answer.
```

```checkpoint check-3
You want to know where this repo’s work items will be kept. Which file tells the agent?
- [ ] `domain.md`
- [ ] `triage-labels.md`
- [ ] `current-site.md`
- [x] `issue-tracker.md`
Why: `docs/agents/issue-tracker.md` says work items will live as files under `.scratch/`. `triage-labels.md` lists the labels build tickets can carry, and `domain.md` sends agents to the glossary and ADRs.
```

```checkpoint check-4
`triage-labels.md` lists the labels build tickets can carry. Which of the three kinds of file is it?
- [ ] A decision, with reasons
- [x] Standing orders for agents
- [ ] Project facts about Care4Mind
Why: It sits in `docs/agents/` and tells the agent how work is tracked, so it’s standing orders. It says nothing about Care4Mind’s content, which is the project-facts files’ job.
```

## The glossary: the project’s agreed dictionary

A **glossary** is a short dictionary for one project. Its job is to stop the same thing being called three different names by three different people, or by an AI on three different days. Yours is `GLOSSARY.md` at the top of the repo, and it currently defines six words. Notice the capital letters in the other documents — _Concept_, _Questionnaire_ — that is the signal “this word has the glossary meaning.”

| Word | What it means here | Do not call it |
|---|---|---|
| Concept | A single idea from Indian psychology, such as _guṇa_ or _citta_, usually named by its Sanskrit term | knowledge concept, knowledge page |
| Reference | One published work (a paper, book or website), recorded with its bibliographic details | research record, reference record |
| Questionnaire | A set of questions with documented scoring rules that gives the person answering a result | assessment, quiz, test |
| Content editor | Someone who adds and updates the site’s content after launch | editor (on its own), administrator |
| Research editor | The subject-matter person who checks sources and the accuracy of References | editor (on its own), subject expert |
| Psychology expert | The subject-matter person responsible for each Questionnaire’s scoring, interpretation and stated limitations | assessment expert, assessment owner |

That third column is the point. Every entry has an _Avoid_ line naming the tempting wrong words, exactly as spelled in `GLOSSARY.md`. So on this project the casual short names are not harmless shortcuts: if a set of questions has no documented scoring and gives no result, it is simply not a Questionnaire, whatever a page title calls it. When an agent’s output uses an Avoid word, the glossary is how you catch it — and ticket titles are exactly where agents slip.

```callout remember
The glossary picks one word for each thing and names the words to avoid. A capitalised word like _Questionnaire_ carries the glossary meaning, and an Avoid word in an agent’s output, above all in a ticket title, is yours to catch.
```

```checkpoint check-5
A document writes “Concept” with a capital C. What does the capital letter tell you?
- [x] The word has its glossary meaning
- [ ] The word begins a new heading
- [ ] The word is a Sanskrit term
- [ ] The word names a page title
Why: Capitals like _Concept_ and _Questionnaire_ signal “this word has the glossary meaning.” A Concept is usually named by its Sanskrit term, but the capital is about the glossary, not the language.
```

```checkpoint check-6
Suppose a page titled “Questionnaire” lists ten questions but has no documented scoring and gives no result. In this project’s words, what is it?
- [ ] A Questionnaire, because of its title
- [ ] A Concept, named by its title
- [x] Not a Questionnaire, whatever its title
- [ ] A Reference, since it’s published work
Why: A Questionnaire is a set of questions with documented scoring rules that gives the person answering a result. Without those, it isn’t one, whatever a page title calls it.
```

```checkpoint check-7
An agent’s ticket says “the editor checks this”. Why is that a problem on this project?
- [ ] Editors only join after the launch
- [x] “Editor” alone could mean two roles
- [ ] Tickets must never name any roles
- [ ] “Editor” is the Psychology expert’s title
Why: “Editor (on its own)” is on the Avoid list for both Content editor and Research editor. The full name tells you whether it’s the person who adds content or the one who checks References.
```

## An ADR: one big decision, written down once

**ADR** stands for **Architecture Decision Record**. Ignore the “architecture” part — in plain words it is a short note that records one big decision: what was decided, why, and what follows from it. ADRs are numbered in the order they are made. On 26 October you had exactly one (the map has since added ADR-0002, Vercel and Neon), so “ADR-0001” simply means “decision record number one.”

ADR-0001 is titled _Rebuild the site instead of enhancing the current one_, and its status is _accepted_. In short: the client first asked for the existing WordPress site to be improved, then approved scrapping it and building a new one, carrying over the content worth keeping by scraping the public site. The ADR gives the reasons. Three of them, in its own order, are that the linked layer the brief wants — Concepts, traditional texts, References and Questionnaires linked to one another — does not exist on the current site, so it has to be built from scratch either way; that the current content sits inside page layouts rather than tidy fields, so it has to be pulled out and restructured either way; and that there is no access to the current site’s code, database or admin login anyway.

ADR-0001 also lists _consequences_ — the price of the decision. For example, every Questionnaire’s scoring has to be rebuilt, so its scoring rules must be obtained first, and scraping may not reveal them. That “reasons plus price” shape is what makes an ADR useful months later, when someone asks “wait, why aren’t we just fixing the old site?” The answer is one file, not a memory. And if the rebuild decision were ever reversed, you would not edit ADR-0001: a new ADR would supersede it, leaving the old reasoning on record.

```callout remember
An ADR is a short note recording one big decision: what was decided, why, and its price. Only decisions that are hard to reverse, surprising without context and a real trade-off, all three at once, get one.
```

```checkpoint check-8
You decide the colour of links on the new site. It’s easy to change later, and nobody would be surprised by it. Does it get an ADR?
- [ ] Yes, every decision gets an ADR
- [x] No, it needs all three conditions
- [ ] Yes, if the client approves it
- [ ] Only once the map is finished
Why: An ADR is offered only when a decision is hard to reverse, surprising without context and the result of a real trade-off, all three at once. A link colour fails the first two, so like most decisions it never becomes an ADR.
```

```checkpoint check-9
ADR-0001’s consequences say every Questionnaire’s scoring has to be rebuilt. What has to happen before that?
- [ ] Scrape every Questionnaire page first
- [ ] Write a second ADR first
- [ ] Name the hosting platform first
- [x] Obtain the scoring rules first
Why: Its scoring rules must be obtained first, and scraping the public site may not reveal them. Scraping is how content comes over, but it can’t be relied on for scoring.
```

```checkpoint check-10
ADR-0001 notes that the linked layer of Concepts, traditional texts, References and Questionnaires doesn’t exist on the current site. Why does that favour a rebuild?
- [x] It must be built from scratch
- [ ] WordPress cannot store any linked pages
- [ ] The client asked for it first
- [ ] Scraping would copy the links over
Why: The linked layer has to be built from scratch either way, so keeping the old site saves nothing there. What the client first asked for was to improve the old site, not rebuild it.
```

## Brief versus snapshot: wanted, decided, actual

A **brief** is the document that says what is to be done. You have two, and telling them apart matters. The _client brief_ is what the client originally asked for: improve the WordPress site, do not rebuild. The _project brief_ — usually just “the brief” — is the rewritten, working version after ADR-0001 overturned that. When the two disagree, the project brief wins, so the client brief is now history and original intent, not instructions.

A **snapshot** is different again: not wishes or plans, but a dated record of what was actually observed. `current-site.md` is a snapshot of care4mind.org on one day — its software versions, its 33 published pages and 6 published posts, the broken and empty pages, and the three places its questionnaires are scattered. The client brief assumed more of the site worked than does; the snapshot is the evidence that corrected it, which is why you trust the snapshot for facts and the project brief for scope.

| Document | Answers | Trust it for |
|---|---|---|
| `client-brief.md` | What did the client first want? | History and original intent |
| `project-brief.md` | What are we actually building? | Scope, requirements, open questions |
| `current-site.md` | What exists on the live site today? | Facts, with sources, as of 2026-10-26 |

```callout remember
The client brief is what was first asked for, the project brief is what you’re building, and the snapshot is what the live site actually was on 26 October 2026. Trust the snapshot for facts and the project brief for scope.
```

```checkpoint check-11
The client brief assumes a page on the live site works; `current-site.md` records it as broken. Which do you trust about the live site?
- [ ] The client brief, which came first
- [ ] Whichever one the agent read last
- [x] The snapshot, which records what’s observed
- [ ] Neither, until the client confirms it
Why: The snapshot is a dated record of what was actually observed. The client brief assumed more of the site worked than does, and the snapshot is the evidence that corrected it.
```

```checkpoint check-12
Months from now, an agent quotes “33 published pages” from `current-site.md` as today’s count. What should you keep in mind?
- [x] It was observed on one particular day
- [ ] It is the brief’s target page count
- [ ] It counts the pages the client wants
- [ ] It includes drafts as well as pages
Why: A snapshot records what was observed on one day, 26 October 2026 for this one. It’s evidence for that date, not a live count and not a target.
```

## The brief, section by section

The project brief is the one document wayfinder will feed on most, so it is worth knowing which of its sections do what. Five of them matter directly for the map. Each one below is paired with what it becomes once charting starts, so you can read the brief with the map already in mind.

| Section | What it holds | What it means for the map |
|---|---|---|
| Requirements | Numbered rows FR-01 to FR-09 (what the site must do) and NFR-01 to NFR-04 (qualities it must have, such as accessible and fast), each with a “Done when” check. Rows marked † are defaults the client still has to confirm. | The destination has to lead to a build that can pass every “Done when”. A ticket whose answer would break one — say, search that cannot match every spelling of a Sanskrit term — is settled wrong. |
| Constraints | The limits no decision may break: one developer who knows Docker and SQL; no access to the current site’s code, database or admin login, so content comes over by scraping; and subject-matter calls are not the developer’s to make. | Constraints narrow every ticket before it starts. The platform question, for example, is not “what is best?” but “what fits these skills, with no access to lean on?” |
| Roles | Who owns what: Project owner, Developer, Psychology expert and Research editor. Three of the four are still marked TBD, to be named by the client. | Roles tell you whose head an answer lives in. A TBD role means some tickets cannot be settled until a person is named — Lesson 4 is about exactly that wait. |
| Out of scope | What this project will not do, such as a mobile app, user accounts beyond an editing login, or new psychometric instruments. | This becomes the map’s own Out of scope section. Work ruled out here never becomes a ticket, however interesting it looks mid-chart. |
| Open questions | Twelve numbered questions the brief deliberately decides none of: platform, who runs the site after launch, which Questionnaires are in scope, where scoring rules come from, and more. | These seed the first tickets and the fog. Questions sharp enough to state precisely become tickets; the dimmer ones wait under Not yet specified until answers clear them. |

Two of those sections deserve a second look, because they are easy to skim past. Out of scope is a decision, not an absence of one: the brief has already ruled those things out, so charting should copy that boundary into the map rather than rediscover it. And the open questions are honest about being open — settling them is not a failure of the brief, it is the whole job of the map from Lesson 1.

```callout remember
Read the brief with the map in mind. Requirements set the “Done when” checks, Constraints narrow every ticket, Roles say whose head an answer lives in, Out of scope is already decided, and the twelve open questions are what the map exists to settle.
```

```checkpoint check-13
Mid-chart, someone suggests a Care4Mind mobile app. Where does the idea go?
- [ ] It becomes a new wayfinder ticket
- [ ] It waits under Not yet specified
- [ ] It joins the brief’s Requirements section
- [x] It goes on a later-phases list
Why: A mobile app is in the brief’s Out of scope section, which says new ideas go on a later-phases list. Out of scope is a decision, so the idea never becomes a ticket, however interesting it looks.
```

```checkpoint check-14
A requirement row in the brief carries a † mark. What does that tell you?
- [ ] A requirement the client has dropped
- [x] A default the client must confirm
- [ ] A target the live site meets
- [ ] A row ruled out of scope
Why: † marks a standard default, chosen where the client brief set no measurable target. The client still has to confirm it: that is open question 11.
```

```checkpoint check-15
Three of the brief’s four roles are still TBD. What does that mean for the map?
- [ ] The developer settles those tickets alone
- [ ] The map cannot be charted yet
- [x] Some tickets wait for named people
- [ ] Those roles become out of scope
Why: Roles tell you whose head an answer lives in. Until the client names a person, the tickets that need that person’s answer cannot be settled; only those have to wait.
```

## Tickets: work that does not exist yet

A **ticket** (also called an _issue_ — same thing, two names) is one small, tracked unit of work or one question to settle, written down so it can be picked up, done, and marked finished. A **spec** (specification) is the bigger document a group of build tickets is cut from: “here is the feature, in detail.” Your repo has neither yet. When they appear, they will live here:

```text
.scratch/<feature>/                 one folder per chunk of work
├── spec.md                          the feature, in detail
└── issues/
    ├── 01-first-ticket.md           one file per ticket
    └── 02-second-ticket.md

.scratch/<effort>/                  a wayfinder effort, from Lesson 1
├── map.md                           the map: Destination, Notes, Decisions so far,
│                                    Not yet specified, Out of scope
└── issues/                          one file per question
```

Each ticket file carries a `Status:` line near the top saying whose move it is. Sorting tickets by that line is called **triage** — a hospital word for “look at each case and decide what happens to it next.” Here is the catch that catches readers of this repo: the same `Status:` line carries two different vocabularies, depending on which kind of ticket you are holding.

| Kind of ticket | Its `Status:` line says | What else it carries |
|---|---|---|
| Wayfinder ticket (Lesson 1) | `claimed` while a session works it, `resolved` once its question is settled | A `Type:` line (research, prototype, grilling or task), a `Blocked by:` line when it must wait, a `## Question`, and later an `## Answer` |
| Build ticket (later lessons) | One of five triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human` or `wontfix` | The piece of building work to do, cut from a spec. Comments gather under `## Comments` |

So `Status: resolved` on a wayfinder ticket and `Status: ready-for-agent` on a build ticket are not two spellings of the same idea. The first means “this question has been answered”; the second means “this building work is clear enough for an agent to do alone.” If you ever see a triage label on a map ticket, or `claimed` on a build ticket, something has been filed in the wrong vocabulary.

```callout remember
The `Status:` line speaks two vocabularies: wayfinder tickets say `claimed` or `resolved`, and build tickets carry a triage label such as `ready-for-agent`. Seeing one on the other kind of ticket means it was filed wrong.
```

```checkpoint check-16
A ticket has a `## Question`, a `Type: research` line and `Status: ready-for-agent`. What’s wrong?
- [x] It uses the build ticket vocabulary
- [ ] Nothing; an agent can start now
- [ ] Research tickets must always say `needs-info`
- [ ] It needs a `## Comments` section
Why: A `## Question` and a `Type:` line make it a wayfinder ticket, which only says `claimed` or `resolved`. `ready-for-agent` is a triage label for build tickets, so it’s filed in the wrong vocabulary.
```

```checkpoint check-17
What does `Status: resolved` mean on a wayfinder ticket?
- [ ] An agent may build it
- [ ] The client has approved it
- [x] Its question has an answer
- [ ] Its code has been merged
Why: `resolved` means the ticket’s question has been answered. “Clear enough for an agent to do alone” is a different idea, `ready-for-agent`, and it belongs on build tickets.
```

```checkpoint check-18
A spec for one feature is finished. What is cut from it next?
- [ ] A fresh map of questions
- [ ] A new ADR per decision
- [ ] An updated glossary of terms
- [x] A group of build tickets
Why: A spec is the bigger document a group of build tickets is cut from: “here is the feature, in detail.” The map and its question tickets belong to wayfinder, not to a spec.
```

## The trap: expecting every decision to become an ADR

It is tempting to picture the flow as a conveyor belt: grilling produces decisions, decisions become ADRs, ADRs become a spec, and the spec becomes tickets. That picture is wrong, and this repo shows why. From a grilling session, only two kinds of thing are guaranteed a file: a word that got pinned down goes into `GLOSSARY.md` at once, and a rare, hard-to-reverse decision that passes all three ADR gates gets an ADR. Everything else you decided lives in the conversation alone, unless something writes it down.

That “something” is exactly what wayfinder adds. In Lesson 1’s map, every decision — ADR or not — is written into its ticket’s `## Answer`, and the map links to it in one line. The glossary stays a pure dictionary and the ADRs stay rare, but no settled answer depends on a chat window staying open. When you read this repo and find only one ADR, that is not missing paperwork: it is the paper trail working as designed, with the brief holding the still-open questions and future ticket files set to hold the answers.

```callout remember
Grilling guarantees a file only for pinned-down words (the glossary) and rare ADR-worthy decisions. Wayfinder writes every other decision into its ticket’s `## Answer`, so one ADR is the paper trail working, not missing paperwork.
```

```checkpoint check-19
Suppose a grilling session settles how Concept pages are ordered. It isn’t a word to pin down and isn’t ADR-worthy. Without wayfinder, where is it recorded?
- [ ] In a new ADR anyway
- [x] Only in the conversation itself
- [ ] In the glossary, as notes
- [ ] In the project brief automatically
Why: From grilling, only pinned-down words (the glossary) and ADR-worthy decisions are guaranteed a file. Everything else lives in the conversation alone: the row Matt warns “catches people out”.
```

```checkpoint check-20
With wayfinder charting the work, where does that same decision get written down?
- [x] Into its ticket’s `## Answer`
- [ ] Into a short, separate ADR
- [ ] Into the glossary’s Avoid lines
- [ ] Into the brief’s open questions
Why: Wayfinder writes every decision, ADR or not, into its ticket’s `## Answer`, and the map links to it in one line. The glossary stays a pure dictionary and ADRs stay rare.
```

```checkpoint check-21
You read through `~/Desktop/project1` and find only one ADR. What does that tell you?
- [ ] Decisions were made but never recorded
- [ ] Someone deleted the other ADR files
- [ ] Grilling has not been used properly
- [x] The paper trail is working normally
Why: ADRs are meant to be rare. The brief holds the still-open questions and future ticket files will hold the answers, so one ADR is the design working, not missing paperwork.
```

## Now that line, decoded

“Read the brief, current-site snapshot, ADR-0001 and glossary.” With the words above, each part names one file, and together they are the _before you touch anything_ pack: goal, facts, settled decision, shared words.

| Words in the line | File | Read it to learn |
|---|---|---|
| the brief | `docs/project-brief.md` | What we are building, for whom, and what is still undecided |
| current-site snapshot | `docs/current-site.md` | What the live site provably is, as of 2026-10-26 |
| ADR-0001 | `docs/adr/0001-rebuild-instead-of-enhancing.md` | The settled rebuild decision — do not re-argue it |
| glossary | `GLOSSARY.md` | The exact words to use, and the ones to avoid |

Skip any one of the four and a predictable mistake follows: without the brief you build the wrong scope; without the snapshot you trust the client brief’s rosier picture; without ADR-0001 you propose “just fix WordPress”; without the glossary you use an Avoid word for a Questionnaire and talk past everyone else.

1. **Facts and rules** (Already done): `brief · snapshot · ADR-0001 · glossary`
   - These four (plus the standing orders) are everything that exists today. They are the input to planning, not the plan itself.
2. **Questions become tickets** (Next, per Lesson 1): `/wayfinder → .scratch/<name>/map.md + issues/`
   - The brief’s twelve open questions get charted into a map, then settled one ticket per session.
3. **Decisions become building work** (Later lessons): `/to-spec → /to-tickets → /implement`
   - Settled decisions become a spec, the spec is cut into build tickets, and only then does code appear in this repo.

```callout remember
Brief, snapshot, ADR-0001 and glossary are the pack you read before you touch anything: goal, facts, settled decision, shared words. They are the input to planning; code appears only after the spec and build tickets.
```

```checkpoint check-22
An agent’s plan builds the wrong things: it adds work nobody wants and misses work that is required. Which of the four files did it skip?
- [ ] The snapshot
- [ ] The ADR
- [x] The brief
- [ ] The glossary
Why: Without the brief you build the wrong scope. Skipping the snapshot means trusting the client brief’s rosier picture instead, and skipping the glossary means using Avoid words.
```

```checkpoint check-23
Going by the flow at the end of this section, when does code first appear in `~/Desktop/project1`?
- [ ] Once wayfinder has charted the map
- [x] After the spec and build tickets
- [ ] Once all four files are read
- [ ] As soon as ADR-0001 was accepted
Why: The four files are input to planning, and the map settles questions. Settled decisions become a spec, the spec is cut into build tickets, and only then does code appear.
```

## Practice

### Which file answers it?

For each question, pick the one file you would open first. You’ll see why straight away.

```checkpoint check-24
How many questions does the KarmaYoga Scale have on the live site today?
- [ ] Brief
- [x] Snapshot
- [ ] ADR-0001
- [ ] Glossary
Why: A dated fact about the live site: 45 single-choice questions, recorded in `current-site.md` on 26 October 2026.
```

```checkpoint check-25
Why aren’t we just improving the existing WordPress site?
- [ ] Brief
- [ ] Snapshot
- [x] ADR-0001
- [ ] Glossary
Why: A settled, hard-to-reverse decision, with its reasons and its price. Changing it would mean a new ADR, not an edit.
```

```checkpoint check-26
Must site search find “vikshepa” as well as “vikṣepa”?
- [x] Brief
- [ ] Snapshot
- [ ] ADR-0001
- [ ] Glossary
Why: A requirement: NFR-03 in the brief says search matches every stored spelling of a Concept’s Sanskrit term.
```

```checkpoint check-27
Should a ticket title say “assessment” or “Questionnaire”?
- [ ] Brief
- [ ] Snapshot
- [ ] ADR-0001
- [x] Glossary
Why: “Assessment” is on the glossary’s Avoid list. A set of questions with documented scoring rules that gives a result is a Questionnaire.
```

```checkpoint check-28
What did the `/triguna/` page show on 26 October 2026?
- [ ] Brief
- [x] Snapshot
- [ ] ADR-0001
- [ ] Glossary
Why: An observed fact: a leftover test message, “Hello, Mind! This is dynamic PHP running via shortcode.” Only the snapshot records what the site actually showed.
```

```checkpoint check-29
Which Questionnaires are in scope for the rebuild?
- [x] Brief
- [ ] Snapshot
- [ ] ADR-0001
- [ ] Glossary
Why: A trick one: the brief lists it as open question 3 and decides nothing. Settling it is a job for the wayfinder map.
```

### Check yourself

From memory, without scrolling up.

```final-test final-30
The client brief and the project brief disagree. Which one do you follow?
- [ ] The client brief, since it’s older
- [x] The project brief, by its rule
- [ ] Whichever file was edited most recently
- [ ] Neither; ask the client to decide
Why: The project brief says so near its top: where it differs from the client’s original, it wins. The client brief is history and original intent.
```

```final-test final-31
In one line, what does ADR-0001 decide?
- [ ] Keep WordPress and improve its pages
- [ ] Switch hosting over to Vercel today
- [ ] Drop the Questionnaires from the project
- [x] Rebuild the site instead of patching
Why: Rebuild the site instead of enhancing the current one. ADR-0001 says nothing about hosting; that was settled later, in ADR-0002.
```

```final-test final-32
Months from now, you change your mind about a decision recorded in an ADR. What happens?
- [x] A new ADR supersedes the old
- [ ] You edit the old ADR’s text
- [ ] You delete the old ADR file
- [ ] Nothing; ADRs can never be revisited
Why: ADRs aren’t rewritten. A new one records the change, and the old one gets the status “superseded by ADR-NNNN”, so its reasoning stays on record.
```

```final-test final-33
An agent writes “assessment owner” in a ticket title. What’s wrong?
- [ ] Nothing, it means the same thing
- [ ] It should say “Research editor” instead
- [x] It’s an Avoid word: Psychology expert
- [ ] Titles must use ticket numbers instead
Why: “Assessment owner” is on the glossary’s Avoid list. The person responsible for each Questionnaire’s scoring is the Psychology expert.
```

```final-test final-34
You want to change the agents’ standing orders. Which file do you edit?
- [ ] `CLAUDE.md`, since Claude reads that one
- [x] `AGENTS.md`, since the other points here
- [ ] Both files, so they stay matched
- [ ] `GLOSSARY.md`, where the orders are kept
Why: `CLAUDE.md` is a symlink to `AGENTS.md`, so there is only one text. The file itself says: “Edit AGENTS.md only.”
```

## Try it: read the brief like a map-maker

Open the brief in your text editor:

```text
xdg-open ~/Desktop/project1/docs/project-brief.md
```

Scroll to _Open questions_. For each of the twelve, decide which of three kinds it is: a fact the agent can find on its own, a decision that is yours to make, or an answer that lives in someone else’s head. The brief gives you a head start on the third kind, because it marks those questions “(Client)”. These three kinds are the ticket types from [Lesson 1](/learn/wayfinder-first-session) in disguise, and the third kind is all of [Lesson 4](/learn/answers-from-other-people).

```callout watch-out
Some questions mix kinds. Open question 1, platform and hosting, is your decision, but the brief says it waits on question 2, which only the client can answer. Spotting that kind of “waits on” is exactly how blocking gets wired when wayfinder charts the map.
```

## Watch and read next

**Read:** your project brief, the primary source for everything Care4Mind. Start with “Open questions” and “Roles”, then skim “Requirements”.

**Then, for the ideas behind the files:** Michael Nygard’s [“Documenting Architecture Decisions”](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (2011), the short post that started ADRs; Martin Fowler’s [“UbiquitousLanguage”](https://martinfowler.com/bliki/UbiquitousLanguage.html), the idea behind a project glossary; and the “paper trail” section of Matt’s [/grill-with-docs article](https://www.aihero.dev/skills-grill-with-docs).

**Watch:** the chapter at 4:30 (“Tracking decisions in your issue tracker”) of Matt’s [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o) shows tickets living in a tracker, the job your `.scratch/` files will do.

```sources
- [GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md)
- [domain-modeling/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md)
- [ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md)
- [wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md)
- [The /grill-with-docs Skill, “The paper trail”](https://www.aihero.dev/skills-grill-with-docs)
```
