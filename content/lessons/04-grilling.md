---
title: Grilling
slug: grilling
order: 4
part: 2
---

Before an agent writes a single line of code, let it interview you until you both want the same thing.

```goals
- You'll be able to explain why misalignment is the most common way agent work goes wrong, and how a grilling session prevents it.
- You'll be able to run a session with `/grill-me` and answer a whole round of numbered questions in one short reply.
- You'll be able to tell a decision (yours) from a fact (the agent's job), and push back when a recommendation isn't what you want.
- You'll be able to choose between `/grill-me` and `/grill-with-docs` (both run `/grilling` underneath), and say what to type once the interview is over.
```

## Why it matters

You type one sentence into Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal): "add comments to my site". The agent gets to work. Twenty minutes later you have login screens, a moderation queue and a database table you never asked for, and no way to leave a comment without an account. Nothing is broken. It's just not what you meant.

Matt Pocock, a developer and teacher, publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name, like `/grill-me`, or when a task matches its description. Matt calls the problem above the most common failure in software, with or without AI: ==misalignment==. The README (front-page guide) of his Skills repo (short for repository: a project's folder, with its history tracked by a tool called Git) borrows a line from *The Pragmatic Programmer*: "No-one knows exactly what they want." You don't, at the start. And an agent can't read your mind, so every gap in your sentence gets filled with a guess. The guesses look confident, so the problem stays hidden until you use what was built.

The fix is cheap. Questions cost minutes; wrong code costs hours, and a lot of tokens (the small chunks of text that AI usage is measured, and often billed, in). So you flip the direction of the conversation. Instead of you briefing the agent, ==the agent interviews you==. It asks about every decision your idea depends on, suggests an answer for each one, and doesn't stop until nothing is left to guess. That interview is a grilling session (a session is one Claude Code conversation, from starting `claude` until you clear it or quit).

```callout big-idea
A grilling session writes no code. Its output is a set of decisions you've both agreed on, sitting in the conversation, ready for the next step.
```

## The idea: a tree of decisions, asked in rounds

The grilling Skill pictures your idea as a ==design tree==: each decision branches into smaller decisions that depend on it. Take the comment box on this site, used by Visitors (anyone reading it):

- "Do Visitors need an account to comment?" is near the root.
- If the answer is no, a new question appears: "Then is a name required, or optional?"
- If the answer had been yes, a different branch would open: "Which login provider?"

The agent can't sensibly ask about login providers until it knows there's a login at all. So it asks in **rounds**. The **frontier** is every decision that's ready to ask: everything it depends on is already settled, so the agent isn't guessing at answers it hasn't heard. Each round asks the whole frontier at once. Every question is numbered, with a recommended answer on its own line, in a fixed format (v1 means the first version):

```text
❓ Q1 - Accounts: Can Visitors comment without an account?

➡️ Yes: no login in v1, anyone can comment.

---

❓ Q2 - Editing: Should comments be permanent once posted?

➡️ Yes: no editing or deleting in v1.
```

Questions are worded so that a plain **"yes" accepts the recommendation**. That lets you answer a round of five in one short line. Each answer settles a branch, and whatever it unlocks joins the next round. The agent picks each round by judgement, so once in a while one of your answers changes another question from the same round. If you spot that, say so, and it reopens that branch next round.

Two rules keep the interview honest:

1. **Facts are the agent's job; decisions are yours.** If a question needs a fact it could look up (like which database the project already uses), it sends a helper agent (a sub-agent) to find out instead of asking you. It doesn't wait for that lookup: only the questions that depend on the answer wait. Decisions, like "should comments be editable?", always come to you.
2. **It isn't over until the frontier is empty and you say so.** Every branch gets visited and nothing is silently assumed. Then it asks you to confirm that you share an understanding, and it doesn't act until you do.

How long does that take? It varies: Matt's docs on AI Hero (his teaching site) say a plan can need as few as three questions or as many as fifty, and his own sessions usually run to about twenty. There's no limit; to stop early, say "let's wrap up".

```scene flow
title: The frontier moving outward (illustrative)
node: idea | A comment box under each Lesson
node: editing | Can comments be edited? | side
node: accounts | Do Visitors need accounts?
node: name | Is a name required?
node: done | Shared understanding
# Everything starts from your idea, however rough.
at: idea
# Round 1 asks what depends only on the idea: do Visitors need accounts?
at: accounts
# Editing depends only on the idea too, so it's asked in the same round.
at: editing
# You answer "no accounts". That unlocks round 2: is a name required? The login-provider question is never asked, because the answer it hung off was no.
at: name
# The frontier is empty. The agent asks you to confirm before anything is built.
at: done
```

```checkpoint frontier-wait
You're grilling a book-club site. Round 1 asks "Should members vote on next month's book?" Why doesn't it also ask "How many votes does each member get?"
- [x] It only matters if members vote, and that's still undecided.
  > Right. It hangs off a question that's still open, so it waits for round 2, or is never asked if the answer is no.
- [ ] The agent asks the easy questions first and saves the detailed ones for later.
  > Difficulty doesn't set the order. Dependencies do: a question waits only if it hangs off one that's still open.
- [ ] Each round is capped at three questions.
  > There's no cap. A round asks the whole frontier, however many questions that is.
- [ ] It's a fact, so the agent will look it up instead of asking.
  > How many votes members get is a choice, not something in the project to look up. It's a decision, so it comes to you, just later.
```

## Which grilling Skill to type

Some Skills only start when you type their name. Matt calls these ==user-invoked Skills==. Others, model-invoked Skills, can also be picked up by the agent on its own when a task fits their description. The grilling family uses both kinds; see [Skills](/learn/skills).

- **`/grill-me` is user-invoked.** The whole Skill is one line telling the agent to load `grilling`, under a name the agent never starts by itself. It's **stateless**: it saves nothing to disk.
- **`/grilling` is model-invoked.** It holds the whole technique described above. You can type it yourself, and the agent may also reach for it when you say something like "grill me on this plan". It's also the engine inside other Skills: `/grill-with-docs`, `/triage`, `/wayfinder` and `/improve-codebase-architecture` all run it.

Plain words can start a model-invoked Skill, but never a user-invoked one. If you write "let's grill with docs" in a sentence, the agent can't start `/grill-with-docs` for you; you have to type its name yourself, at the start of your message.

The third way in is the one you'll use most on a real project: `/grill-with-docs`. It runs the same interview *plus* the domain-modeling Skill, which writes the project's terms into a glossary (`GLOSSARY.md`) as you go, and offers a short decision record (an ADR) for the rare choice that's hard to reverse. Matt makes it the first step of his Main flow (the path most work takes, from idea to shipped) whenever you're working in a project folder (Matt calls it a working directory). Files in that folder outlive the conversation, so the next session, or the next agent, can read the words you agreed on. The glossary and decision records get their own Lesson: [Domain modeling](/learn/domain-modeling).

| Your situation | Reach for |
|---|---|
| No project folder, or not code at all: a plan, a decision, a talk, a job offer | `/grill-me` |
| In a project folder: any change you can plan in one sitting, even if building it takes several sessions | `/grill-with-docs` |
| A question you can't settle by talking, like how a page should look | `/prototype` (a quick throwaway build you can look at), then come back |
| A huge, foggy effort you can't even plan in one sitting, like a big new product | `/wayfinder` |
| You want just the interview with nothing added, or a Skill of your own that needs one | `/grilling` |

```checkpoint who-can-start
You're in your project's repo. Without typing any Skill's name, you write: "Before we build this, stress-test my plan with hard questions." Which Skill can the agent load on its own?
- [ ] `/grill-me`
  > `/grill-me` is user-invoked, so it only starts when you type its name. Asking for a grilling in plain words isn't enough.
- [ ] `/grill-with-docs`
  > Also user-invoked. The agent can't start it for you, even in a repo.
- [x] `/grilling`
  > Right. `/grilling` is model-invoked: the one member of the family the agent may load on its own when your words match its description.
```

## A session, step by step

Here's a short grilling session about the comment box on this site. It uses `/grill-with-docs` because it happens inside this site's repo. With `/grill-me` the rhythm is identical; it just skips the glossary work (sharpening terms, writing `GLOSSARY.md`). Real sessions are longer.

```scene chat
title: Grilling a comment box in this site's repo (illustrative)
# You type the Skill and a rough idea. Messy is fine.
you: `/grill-with-docs` I want a comment box under each Lesson, saved in a database. Keep v1 small.
# The agent looks around the project, then asks round 1: the whole frontier, each with a recommendation (squeezed onto one line here; a real session puts each ➡️ on its own line).
agent: ❓ **Q1** - **Accounts**: Can Visitors comment without an account? ➡️ Yes: no login in v1.
agent: ❓ **Q2** - **Editing**: Should comments be permanent once posted? ➡️ Yes: no editing or deleting in v1.
agent: ❓ **Q3** - **Order**: Should the oldest comments show first, like a conversation? ➡️ Yes.
# You answer the whole round in one line. "Yes" accepts a recommendation; "no" plus a few words replaces it.
you: 1 yes, 2 yes, 3 no: newest first, so a new question gets seen. And no moderation in v1.
# It looks facts up itself instead of asking you, and writes down a word you've just settled.
agent: I checked the project: it already has a Postgres database, so I won't ask which one to use. Added **Visitor** (anyone reading the site; no account) to GLOSSARY.md.
# Your answers unlock round 2: questions that hung off them are now on the frontier.
agent: ❓ **Q4** - **Name**: With no accounts, should a name be optional, shown as "Anonymous" when empty? ➡️ Yes.
# You steer: you own the scope, it owns the small details, like CSS (the code that styles a page).
you: 4 yes. And don't ask me about CSS or file names: decide those yourself using best practice.
# The frontier is empty. It summarises and waits for your confirmation before building anything.
agent: That covers every branch. Anonymous comments, optional name, permanent, newest first. Out of scope: login, editing, moderation. Is that our shared understanding?
```

```checkpoint confirm-summary
The agent ends: "Anonymous comments, optional name, permanent, newest first. Out of scope: login, editing, moderation. Is that our shared understanding?" You actually wanted people to be able to edit a comment for five minutes. What do you do?
- [ ] Say yes for now, and ask for editing once the code has been written.
  > Then the code gets built on a decision you don't share. Fixing it now costs one sentence; fixing it later costs a rebuild.
- [x] Correct it now, answer any new questions, then confirm.
  > Right. The confirmation is there so nothing gets built on a guess. Editing anonymous comments can raise new questions (how does the site know who wrote one?), so answer that round, then say yes.
- [ ] Start a separate grilling session just about editing.
  > One wrong line doesn't need a new session. Correct it here, where every other decision still lives.
- [ ] Say nothing; the agent will notice the gap when it starts to build.
  > It can't notice what it was never told. It builds what the summary says.
```

## Your half of the interview

A grilling session is only as good as your answers. The agent asks the questions, but you don't just sit and answer: as Matt's docs put it, "It's a conversation, not an interview."

- **Push back.** If you answer "agreed" to forty questions, you get the agent's plan with your name on it. Disagree with recommendations when they're wrong, and say why. Saying "I don't know" is fine too. Often it means you need to see a prototype before you can decide.
- **Own the architecture and the scope; hand over the details.** Tell the agent which branches you care about and let it decide the rest, as in the Scene above, where you handed over CSS and file names.
- **Send facts back.** If the agent asks something it could look up, reply "look that up yourself".
- **Spot the questions talking can't settle.** "Should comments open in a pop-up or sit under the Lesson?" is hard to answer in words. Matt calls these ungrillable: you need to *see* them. Detour through a quick throwaway build, in a fresh session so its tokens stay out of your interview. First type `/handoff`, a Skill that writes a summary of the conversation to a file and tells you where it is. In a second terminal window, start `claude` in the same folder, ask it to read that file, then type `/prototype` (if it says "unknown skill", type `/mattpocock-skills:prototype`). Once you've seen the answer, a second `/handoff` there writes it to a new file; back in the first window, ask the agent to read it. [Prototype](/learn/prototype) shows each step.
- **Keep the scope small.** A huge idea produces hundreds of questions. Split it and grill one piece at a time.
- **Leave plan mode off.** Plan mode, a Claude Code setting where the agent only reads and drafts a plan, rushes the agent to that plan instead of asking. And begin the grilling in a new conversation, before the agent has drafted any plan of its own.

If whole rounds feel like too much, there's a supported opt-out. Add one line to your global `CLAUDE.md`, a file of standing instructions the agent reads at the start of every session: "When grilling, ask one question at a time." It lives in your home folder, at `~/.claude/CLAUDE.md`. The easy way: ask Claude Code to add the line for you. Or type `/memory` (a Built-in command: it comes with Claude Code, it isn't a Skill), pick the user file and add the line there; the file is created if it doesn't exist yet.

```checkpoint steer-details
You're grilling a plant-swap site. Two rounds in, most questions have been about button colours, fonts and what to name each page's file. You only care about who can list plants and what's left out of v1. What do you do?
- [ ] Answer every question carefully, so nothing is silently assumed.
  > That's grilling forever. "Nothing silently assumed" means nothing gets guessed behind your back, not that you must rule on every detail.
- [ ] Stop and restart with a smaller idea; the questions never end.
  > The idea isn't too big. The questions are aimed at things you don't care about, so steer instead of restarting.
- [ ] Turn on plan mode so it focuses on the big picture.
  > Plan mode pushes the agent to rush to a plan instead of interviewing you.
- [x] Hand those details to it and steer it to your priorities.
  > Right. You own the scope; the agent owns the details. Tell it which branches matter to you and to decide the rest itself, and the rounds go there.
```

## What comes next

When you confirm the summary, the decisions are sitting in the conversation, and everything in it lives in the agent's ==context window==: its working memory for that conversation, measured in tokens. As the window fills up, the model (the AI inside Claude Code that does the thinking; `/model` switches it) reasons less sharply. Matt calls the part where it still thinks clearly the Smart zone, and his Skills put it at about 150k tokens on today's best models, as a rule of thumb (see [The context window](/learn/context-window)). Type `/context` to see how full yours is.

**Don't throw the decisions away.** The next step depends on the size of the work:

- **It fits in the room this session has left**, like a small change: type `/implement` (Matt's Skill that builds the agreed change) in the same conversation.
- **It's a multi-session build**: type `/to-spec` in the same conversation to turn the decisions into a spec (a written description of what to build and why), then `/to-tickets` to split it into tickets (small tasks that can each be built in one session). [Spec + tickets](/learn/spec-and-issues) covers that step.

In his July 2026 walkthrough, Matt judged that a small cleanup fitted his remaining room, so he'd normally type `/implement` there; he took the `/to-spec` road only to demo it. The whole map lives in [The main flow](/learn/main-flow).

```callout watch-out
Don't type `/clear` after grilling. `/clear` is a Built-in command that empties the conversation, and the conversation *is* the record of your decisions. `/to-spec` writes from it, so clearing first leaves it without your decisions.
```

```checkpoint small-change-next
Grilling settled a small change: rename one button and update its tests. The session still has plenty of room. What do you type next?
- [ ] `/to-spec`, then `/to-tickets`
  > That's the road for a multi-session build. For a change this small it's overhead.
- [x] `/implement`, right here
  > Right. The decisions are in this conversation and the work fits, so build it here.
- [ ] `/clear`, then describe the change again
  > Clearing empties the decisions you just made out of the conversation, and you'd have to explain them all over again.
```

## How Matt and others use it

**Matt Pocock**'s README says to grill before every change you make. His habits, from his videos and docs:

- **He starts vague.** In his July 2026 walkthrough he kicked off with a few vague sentences about trimming a command-line tool. The agent explored the code first, then asked. That session took six questions.
- **Auto mode, not plan mode.** In the same video he grills in auto mode, where Claude Code skips routine permission prompts but still checks riskier actions first.
- **His strongest model goes on grilling.** In May 2026 he argued that grilling leans on the model's own knowledge of how software works to raise things you hadn't considered, so it deserves the best model; building can use a cheaper one. (See [Models, effort & ultracode](/learn/models-effort-ultracode).)
- **He splits big ideas first,** and usually runs two grilling sessions side by side, answering one while the other is thinking.
- **He uses it outside code too.** He used grill-me to decide which course to make next.

**Other developers:**

- A Hacker News commenter now reaches for `/grill-me` instead of plan mode, and made a personal copy that asks through Claude Code's built-in question tool, for a smoother experience.
- A Reddit post shares a prompt for building a grill-me variant that saves every question, answer and decision where an agent can read them later. Without that, the decisions live only in the chat until `/to-spec` turns them into a spec.

## Try it yourself

````try
You need Claude Code installed and signed in (Anthropic's [quickstart](https://code.claude.com/docs/en/quickstart) shows how).

1. In your terminal, make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir book-club
cd book-club
claude
```

2. Type a slash and the word grill. If `grill-me` is in the list that pops up, delete what you typed and go on. If it isn't, delete it, type `/exit`, run this in your terminal to install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes. Any other mode is fine.
4. Type this. It uses `/grill-me` so the practice run writes no files; in a real project you'd type `/grill-with-docs`.

```text
/grill-me I want a one-page site for my book club where members can leave a comment on this month's book. Keep v1 small.
```

5. Answer round 1 **by number** in one reply. Accept at least one recommendation with a plain "yes" and change at least one.
6. Push back on scope once, for example "No moderation in v1."
7. After two or three rounds, type: "Let's wrap up. Summarise what we decided and what's out of scope."
8. Read the summary. Reply with any corrections, and end with: "Don't build anything." If it starts creating files anyway, press Esc to stop it (or choose No if it asks permission). Type `/exit` when you're done.

**It's working if:**

- [ ] Each round arrives as numbered questions (❓ Q1, ❓ Q2…), each with its own ➡️ recommendation.
- [ ] You answered a whole round in one short reply.
- [ ] Replying "yes" accepted the ➡️ recommendation.
- [ ] Round 2 asked things round 1 couldn't have, because they build on your answers.
- [ ] Questions in one round didn't hang off each other, or you said so when one did.
- [ ] It ended by asking you to confirm, not by writing code or files.
- [ ] You can explain every decision, including what's out of scope, to someone who wasn't there.

If the questions come without ➡️ recommendations, the `grilling` Skill probably didn't load. Ask: "Did you load the grilling skill?" If it starts building after a question or two, switch to a stronger model with `/model`.
````

## Common mistakes

- **A weak model or low effort** (effort is the setting for how hard the model thinks, changed with `/effort`). Two quick questions, then it starts building. Use a stronger model, or add a line to your global `CLAUDE.md`: "never start implementing without my permission".
- **Writing a user-invoked Skill's name in plain words.** The agent can't start it; type it yourself, slash first.
- **The rest is covered above,** in "Your half of the interview" and "What comes next": being passive, grilling forever, grilling a question you need to see, starting too big, using plan mode, and clearing before `/to-spec`.

```site-story
My first message was messy and long:

    /grilling i want to built a small site simple white background with royal blue
    accents all over sharp layout ... one lesson per page, its for me, it teaches
    matt pococks skills and how to build end to end projects using agentic coding
    ... plus a comment box on each lesson saved in Neon.

That was fine: turning a messy idea into decisions is the whole point.

**Round 1 had 8 questions,** and it overwhelmed me. I said "one or two at a time please", and it adapted. (Big rounds are normal.)

**It asked about details I didn't care about yet:** file formats, navigation, colours. So I told it to grill me on the architecture and decide the details itself using best practice. That was my biggest lesson: *I own the architecture and the scope. The agent owns the details.*

**The real decisions I made.** Don't worry if the stack names mean nothing yet; each row was my call, not the agent's guess.

| Decision | What I chose |
|---|---|
| Backend | Real REST endpoints, `GET` and `POST` `/api/comments`, so I can learn APIs by `curl`ing them |
| Layers | endpoint → comments module → Drizzle → Neon, the same shape as FastAPI → crud → SQLAlchemy → Postgres |
| Databases | A Neon branch each for my laptop, the tests, every preview of a proposed change, and production |
| Tests | Against a real test database, no mocks |
| Styling | One small plain CSS file |

**We also agreed what's out:** no login, no editing or deleting comments, no moderation, no dark mode, no search, no custom domain. Saying "not now" is what made the first version shippable.

**It ended by checking that we agreed.** Nothing got built on a guess.

Two things I'd do differently today. I typed `/grilling` directly; in a project folder I'd now type `/grill-with-docs`, which also writes the glossary. And later, planning a new Lesson and a site redesign, I typed "you can start grilling with docs" in plain words. The agent can't start a user-invoked Skill, so it ran `/grilling` and `/domain-modeling` one after the other instead.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Start, no project folder | `/grill-me <your rough idea>` |
| Start, in a project folder | `/grill-with-docs <your rough idea>` |
| Answering a round | By number, in one reply; "yes" accepts a recommendation |
| It asks for a fact | "Look that up yourself" |
| A question you need to see | `/handoff`, `/prototype` in a fresh session, `/handoff` back |
| Rounds too big | `CLAUDE.md`: "When grilling, ask one question at a time." |
| Done | Frontier empty, and you confirm the summary |
| Next, small change | `/implement` in the same conversation |
| Next, multi-session | `/to-spec`, then `/to-tickets`, in the same conversation; never `/clear` first |

## Final test

```test scenario-no-repo
You want to stress-test your plan for a two-week cycling trip with three friends before anyone books anything. Nothing about it involves code. Which Skill do you type?
- [ ] `/grill-with-docs`
  > That one also writes the project's terms to `GLOSSARY.md` and may offer a decision record. A trip plan has no project folder for those files to live in.
- [ ] `/to-spec`
  > `/to-spec` turns an already-grilled conversation into a spec for software. You haven't been grilled yet.
- [x] `/grill-me`
  > Right. It's the stateless interview for anything, anywhere, code or not.
- [ ] `/prototype`
  > That builds a quick throwaway version of software so you can see it. A trip plan is something you can settle by talking.
```

```test scenario-repo-change
You're in your project's repo, planning a feature that should fit in one session. Which Skill is the best place to start?
- [ ] `/grill-me`
  > It runs the same interview but saves nothing. In a repo, there's a better option.
- [x] `/grill-with-docs`
  > Right. Same interview, plus the domain-modeling Skill writing the project's terms to `GLOSSARY.md` as you go.
- [ ] `/wayfinder`
  > That's for huge, foggy efforts you can't plan in one sitting. A well-scoped feature starts with `/grill-with-docs`.
- [ ] `/implement`, describing the feature as you go
  > Building before you've agreed what to build is exactly how misalignment starts. Grill first.
```

```test scenario-ungrillable
Halfway through grilling a recipe site, a question comes up that matters to you: "Should each recipe show its steps on one scrolling page, or as swipeable cards?" You've tried to describe both twice and still can't choose. What's the best move?
- [ ] Accept the agent's recommendation and move on.
  > You'd be agreeing to something you can't evaluate, which is the passive trap.
- [ ] Ask the agent to decide it for you as a detail.
  > It matters to you, and how a page feels to use is a product decision, not a small detail.
- [ ] Ask the agent for a fuller written description of each layout, then choose.
  > More words won't help: you've read two descriptions already. This question needs something you can look at.
- [x] Detour through `/prototype`, then bring the answer back.
  > Right. Questions you need to see are ungrillable. Build a quick throwaway version, look at it, then answer.
```

```test scenario-overwhelmed
Grilling a running club's website, round 1 brings nine questions at once and you lose track halfway. You want smaller rounds in every grilling session from now on, not just this one. What do you do?
- [ ] Ask it to cap the whole session at ten questions in total.
  > A total cap doesn't make rounds smaller: round 1 could still bring nine at once.
- [x] Tell it in `CLAUDE.md` to ask one question at a time.
  > Right. `CLAUDE.md` is read at the start of every session, and the line "When grilling, ask one question at a time." in your global one is the documented opt-out.
- [ ] Turn on plan mode so the agent slows down.
  > Plan mode rushes the agent toward a plan, so it asks less, not in smaller rounds.
- [ ] Switch from `/grill-me` to `/grilling`, which asks fewer questions.
  > `/grill-me` is one line that loads `grilling`, so it's the same interview with the same rounds.
```

```test scenario-round-reply
Round 2 asks three numbered questions, each with a ➡️ recommendation. You agree with Q4 and Q6. Q5 recommends a 500-character limit on comments, but you want 1,000. What do you reply?
- [x] "4 yes, 5 no: 1,000 characters, 6 yes"
  > Right. One reply per round, by number. "Yes" accepts a recommendation; "no" plus a few words replaces it.
- [ ] "yes"
  > That accepts all three recommendations, including the 500-character limit you didn't want.
- [ ] "4 no, 5 yes: make it 1,000 characters, 6 no"
  > That's backwards. Each question is worded so "yes" accepts the recommendation, so this rejects the two you agreed with.
- [ ] "Agreed", then raise the 1,000 limit once it starts building.
  > "Agreed" accepts all three, the 500 limit included, so the agent starts from a decision you don't hold. A few words now beat a rewrite later.
```

```test spot-passive
Lee spent an hour grilling a new feature, answering each round in one reply and taking every ➡️ recommendation as written. Now Lee dislikes what got built. Spot the mistake.
- [ ] The session ran too long: an hour is more than grilling needs.
  > Session length varies a lot; Matt's docs say some plans need fifty questions.
- [ ] Answering whole rounds in one reply rushed Lee's choices.
  > Answering a round in one reply is the intended rhythm. The problem was what Lee answered.
- [x] Lee never pushed back, so the decisions were the agent's.
  > Right. A grilling session only aligns you if you actually decide. Disagree, steer and say "I don't know" when it's true.
```

```test spot-asked-for-fact
During a grilling session the agent asks: "❓ Q2 - Language: Is your site's code written in TypeScript? ➡️ Yes, probably." What's wrong with this question?
- [x] It asks you for a fact it should look up itself.
  > Right. Which language the files use is a fact. Facts are the agent's job, done by a sub-agent; only decisions come to you.
- [ ] It's too detailed for round 1, which is only for big decisions.
  > Rounds are set by what depends on what, not by size. Nothing here hangs off an open question.
- [ ] It offers one guess instead of listing every language it might be.
  > Multiple choice is fine in grilling, but the format isn't the problem: you shouldn't be asked this at all.
```

```test spot-cleared-early
Priya grilled a big feature for 45 minutes, typed `/clear` to free up space, then typed `/to-spec`. The spec is vague and misses half her decisions. What went wrong?
- [ ] `/to-spec` ran too late; it belonged before the grilling.
  > `/to-spec` writes from the grilled conversation. Run first, it would have no decisions to write from.
- [x] `/clear` emptied out the decisions `/to-spec` writes from.
  > Right. The conversation is the record of the grilling, and `/clear` emptied it out of the session. Run `/to-spec` in the same conversation. (`/resume` can reopen the old one, so the decisions aren't gone for good.)
- [ ] Forty-five minutes was too short to settle a feature this big.
  > Forty-five minutes is plenty. The decisions existed; then `/clear` emptied them out of the conversation.
- [ ] Splitting the questions into rounds scattered her answers.
  > Rounds follow the design tree, and all her answers sat in one conversation until `/clear` emptied it.
```

```test sequence-multi-session
You're in a repo, planning a feature that will take several sessions. Which order is right?
- [ ] `/grill-with-docs` → confirm the summary → `/to-tickets` → `/to-spec`
  > Backwards. In the Main flow `/to-tickets` splits the finished spec into tickets, so `/to-spec` comes first.
- [ ] `/to-spec` → `/grill-with-docs` → confirm the summary → `/to-tickets`
  > `/to-spec` writes from a grilled conversation. Before the grilling, there are no decisions for it to write from.
- [ ] `/grill-with-docs` → confirm the summary → `/implement` in this same session
  > That's the road for a change that fits in one session. A multi-session build needs a spec and tickets to carry the decisions across sessions.
- [x] `/grill-with-docs` → confirm the summary → `/to-spec` → `/to-tickets`
  > Right. Interview, agree, then turn the same conversation into a spec, and the spec into tickets.
```

```test why-grill-first
A friend says: "Grilling is a waste of time. The agent writes good code, so I just tell it what I want." What's the strongest reply?
- [ ] "The agent's code is usually buggy, and grilling catches the bugs before they ship."
  > Grilling writes no code and tests nothing. Its job is agreeing on what to build, not checking how it's built.
- [x] "Working code can still miss what you meant, because it's built on guesses."
  > Right. That's misalignment: every gap in a short request gets filled with a confident guess. Minutes of questions are cheaper than hours of rebuilding.
- [ ] "Grilling writes the spec file the agent needs before it's allowed to code."
  > No grilling Skill writes a spec. The decisions live in the conversation (`/grill-with-docs` adds glossary terms); a spec comes later, from `/to-spec`, and only for bigger builds.
- [ ] "It's only worth it for big projects; for a small change your way is fine."
  > Matt grills before every change. A small change just means a short session.
```

```sources
- [grilling SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/grilling/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [grill-me SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/grill-me/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [grill-with-docs SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/grill-with-docs/SKILL.md) and [domain-modeling SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the Main flow, the Smart zone, the prototype detour, `/wayfinder` vs `/grill-with-docs`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) ("The Agent Didn't Do What I Want"; user-invoked vs model-invoked): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [Claude Code quickstart](https://code.claude.com/docs/en/quickstart), Anthropic docs (installing and signing in), read 2026-10-23.
- [The /grilling Skill](https://www.aihero.dev/skills-grilling), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [The /grill-me Skill](https://www.aihero.dev/skills-grill-me), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (grilling and the `/implement` vs `/to-spec` fork at 8:24–11:23).
- [9 Things People Get Wrong With My /grill-* skills](https://www.youtube.com/watch?v=UzMNBN6xLLA), Matt Pocock, 2026-05-25 (ungrillable questions 1:28, scope 3:44, passivity 5:41, models 8:40, parallel sessions 10:24); written version [on AI Hero](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), updated 2026-05-25.
- [I stopped using /grill-me for coding. Here's what I use instead](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, 2026-05-14 (when to pick grill-me vs grill-with-docs, 13:26).
- [My "Grill Me" Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral), Matt Pocock, updated 2026-03-23.
- [Hacker News discussion: /grill-me instead of plan mode](https://news.ycombinator.com/item?id=49851420), read 2026-10-23.
- [r/SpecDrivenDevelopment: saving grill-me decisions](https://www.reddit.com/r/SpecDrivenDevelopment/comments/1tv1ruy/grillme), 2026-06-03.
```
