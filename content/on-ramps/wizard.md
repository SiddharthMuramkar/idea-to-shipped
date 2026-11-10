---
title: wizard: guide you through manual steps
slug: wizard
summary: wizard writes a script that walks you through setup steps only you can do, such as copying a key from a website, one stage at a time.
---

## What it's for

Say your yoga-studio project needs a database on Neon, a hosted database service, and [CI](/learn/what-ci-cd-is) needs its connection string, its address and password. An agent can't click through Neon's website for you, and steps in the chat scroll away while you do.

**This Skill writes you a wizard: a script that walks you through steps only you can do, one stage at a time.**

It's written in **bash**, the terminal's standard scripting language. Each **stage** is one focused job.

The agent reads your repo, you confirm the stages, the agent writes the script, and you run it.

```checkpoint quick-1
The agent has finished writing a wizard. Who runs it?
- [x] You do, since the agent only writes the script.
- [ ] The agent does, once you've confirmed the stages.
- [ ] CI does, the next time a pull request opens.
Why: The agent reads your repo, you confirm the stages, the agent writes the script, and then you run it.
```

```diagram
type: chain
caption: "The agent reads your repo, you confirm the stages, the agent writes the script, and you run it."
steps:
  - "The agent reads your repo"
  - "you confirm the stages"
  - "the agent writes the script"
  - "you run it"
```

One stage might show this, with terms explained below:

```text
▸ Stage 1/2 · Neon: database
  ↗ opening https://console.neon.tech
  • Copy the connection string.
  Paste the connection string:
  ✓ wrote DATABASE_URL → .env
  ✓ set GitHub secret DATABASE_URL
```

The script opens the page, says what to copy, and hides what you paste. It writes the value to `.env`, a file of secret settings you keep out of git. CI needs it too, so it also sets a **GitHub secret**, a sensitive value stored on GitHub for workflows to use.

```checkpoint quick-2
You paste a value into a wizard, and CI needs it too. Where does the value go?
- [x] Into `.env`, and also into a GitHub secret.
- [ ] Into `.env` only, since CI can read that file.
- [ ] Into a GitHub secret only, and never into a file.
Why: The script writes the value to `.env`, a file you keep out of git. CI needs it too, so the script also sets a GitHub secret.
```

## When to use it

- You need API keys (passwords your app uses to reach a service), a database or CI secrets from another service.
- You face an unfamiliar **dashboard**, the website where you manage a service.
- You're running a one-off migration or **cutover**, switching a live system to a new host or setup. The script confirms before anything irreversible.

```checkpoint quick-3
Which of these fits a wizard?
- [x] Creating a key on a dashboard you've never used.
- [ ] Renaming a function across the whole of your repo.
- [ ] Running your tests on each new pull request.
Why: An unfamiliar dashboard is a place only you can sign in to and click through. Renaming and testing are things an agent or CI can do without you.
```

## When not to use it

- If the agent could do the steps itself, let it: wizards are for steps needing a human.
- If you need someone's knowledge, not their actions, use [to-questionnaire](/learn/to-questionnaire) instead, because it writes them questions to answer.

```checkpoint quick-4
You need a client to tell you the studio's refund rules. Which fits?
- [x] to-questionnaire, because you need their knowledge.
- [ ] wizard, because someone else must do the steps for you.
- [ ] wizard, because they can run the script themselves.
Why: You need what the client knows, not anything they'd click. So to-questionnaire writes them questions to answer.
```

## What it needs to start

Only a manual procedure. Type `/wizard`, or the agent starts it on its own the moment it hits a step only you can take.

The agent reads your repo first, including your CI workflows. Every `secrets.*` reference there that GitHub doesn't create itself, such as `secrets.DATABASE_URL`, names a GitHub secret the wizard must produce.

```checkpoint quick-5
Your workflow mentions `secrets.NEON_URL`. What does the agent take from that?
- [x] It names a secret that the wizard must produce.
- [ ] That secret is already set, so it can be skipped.
- [ ] It should ask you for the value in the chat.
Why: A `secrets.*` reference names a GitHub secret, so the wizard must produce a value for it.
```

Then it shows you the ordered stages and their values, and you may add, drop or reorder them. Where it doesn't know a dashboard's layout, it asks you or checks the docs, rather than inventing steps.

## What it creates

One bash script: the Skill's template, with the agent's stages added. Above the stages sits a fixed library of helpers, the same in every wizard, which the agent never edits.

```checkpoint quick-6
You ask for one more stage in a wizard. Which part does the agent change?
- [x] The stages, leaving the library alone.
- [ ] The library of helpers above the stages.
- [ ] Both, so the helpers fit the new stage.
Why: The library is the same in every wizard and the agent never edits it, so a new stage changes only the stages.
```

The agent never runs it end to end, because it opens browsers and waits for you. It checks it by reading instead.

By default it's for one run, then deleted. For a repeatable setup path, commit it and link it from the README, so the next person runs it instead of asking an AI.

```checkpoint quick-7
The job's done, and nobody will need this setup again. What happens to the script?
- [x] You delete it, since it was for one run.
- [ ] You commit it and link it from the README.
- [ ] You add it to CI, so that it can run again.
Why: A wizard is for one run by default. You commit one and link it from the README only when you want a repeatable setup path.
```

## Going deeper

### Why it exists

An agent keeps meeting steps it can't take: a key it can't create, a dashboard it can't click. An agent in that spot once "dumped six numbered steps into the chat" for you to follow by hand.

So in v1.2, in August 2026, wizard became **model-invoked**: the agent may start it by itself. Now an agent that hits a step only you can take writes a wizard instead. Typing `/wizard` works as before.

Matt Pocock, who wrote the Skill, aims it at a second habit too: writing setup steps into a README. A wizard is an executable version, "which fails visibly when a step goes stale".

```checkpoint quick-8
You're about to write setup steps into a README. What would a wizard give you?
- [x] An executable version that fails visibly when a step goes stale.
- [ ] A version that rewrites its own steps whenever a page changes.
- [ ] A version that quietly skips any step that has gone out of date.
Why: A wizard is the same steps as something you run, so a stale step fails where you can see it.
```

### How it works underneath

**A program, not a list.** A list of steps leaves you to keep your own place. A wizard is a program: "The script runs each step in order and keeps the values you enter."

**One stage, up close.** The template ships one example stage, which fetches test keys from Stripe, a payments service:

```bash
stage "Stripe: API keys"
say "We'll grab your Stripe test keys and store them for local dev + CI."
open_url "https://dashboard.stripe.com/test/apikeys"
step "On the API keys page, copy the Publishable key (starts pk_test_)."
ask STRIPE_PUBLISHABLE_KEY "Paste the publishable key:"
step "Click 'Reveal test key' on the Secret key row, then copy it."
ask_secret STRIPE_SECRET_KEY "Paste the secret key:"
write_env STRIPE_PUBLISHABLE_KEY "$STRIPE_PUBLISHABLE_KEY"
write_env STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"
set_secret STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"   # CI needs this one
```

Each line calls a helper from the library, so every wizard behaves the same way:

- `open_url` goes first, so the page is open before the prompt.
- `ask` shows what you type, and `ask_secret` hides it.
- `write_env` replaces a key's line in `.env` instead of adding a second one. A new `.env` is one only you can read.
- `set_secret` is only for values CI needs. If `gh`, GitHub's command-line tool ([What Git and GitHub are](/learn/what-git-and-github-are) sets it up), isn't installed or signed in, you get a warning, and the closing summary lists what's left to do by hand.

```checkpoint quick-9
Your `.env` already has a line for this key. What does `write_env` do?
- [x] Replaces that line, instead of adding a second one.
- [ ] Adds a second line for the key, below the first one.
- [ ] Stops the wizard and asks you which value to keep.
Why: `write_env` replaces a key's line in `.env`, so running a wizard twice never leaves two lines for one key.
```

**Typed keys skip the model.** You run the script, not the agent, so a key you type goes straight to `.env` or `gh secret`. In Matt's words, "the model is not connected to it." That covers only the typing. A key you paste into the chat while the agent is working out the stages is in its [context window](/learn/context-window), the text the agent holds at once, like any other text. So is a key in `.env` once an agent reads it.

```checkpoint quick-10
While the agent works out the stages, you paste a key into the chat. Where is it now?
- [x] In the context window, like any other text.
- [ ] Only in `.env`, where the wizard puts every key.
- [ ] Out of the model's reach, as it isn't connected.
Why: A value you type at the script's prompt skips the model. A key pasted into the chat is in the context window like any other text.
```

**The first run is the test.** The agent checks the script with `bash -n`, a command that checks a bash script without running it. It also runs **shellcheck**, a tool that finds mistakes in bash scripts, if that's installed. Nobody has run the script yet, so "the first run is yours, and that run is the test."

**An older idea.** In 2019 Dan Slimmon described the **do-nothing script**: a script that holds a manual procedure's steps, each in its own function. It shows you one step and waits while you do it by hand. One gain he lists: "It’s now much less likely that you’ll lose your place and skip a step." It's a close idea written down earlier, not a proven source of wizard.

```checkpoint quick-11
What does a do-nothing script do for you?
- [x] Shows one step at a time, and waits while you do it.
- [ ] Does each step for you, so nothing is left to do by hand.
- [ ] Writes the manual procedure down for you as a document.
Why: It holds the steps of a manual procedure, shows you one and waits while you do it by hand, so you're less likely to lose your place.
```

### A real example

In October 2026, Colin Eberhardt, CTO at Scott Logic, wrote about rebuilding a personal app from scratch with Matt's Skills. Early on, he asked his agent for help setting up Supabase, a hosted back-end service.

He didn't ask for a wizard. The agent reached for the Skill by itself: "This is exactly what /wizard is for — steps only you can take".

```checkpoint quick-12
You ask your agent for help setting up a hosted service, and never mention wizard. What can happen?
- [x] It reaches for wizard by itself, for steps only you can take.
- [ ] It does nothing with wizard until you type its name yourself.
- [ ] It signs in to the service for you, so that no wizard is needed.
Why: Wizard is model-invoked, so the agent can reach for it by itself when your request runs into steps only you can take.
```

So the model-invoked trigger fired as designed: an ordinary request for help led to a wizard.

### Where it goes wrong

**The wizard sends you to a page that isn't there.** Eberhardt's wizard "asked me to navigate to pages that no longer existed". The agent is told never to invent steps, but a step the model remembers can still be out of date. A running script can't adapt. That's one user's report, on a new app. So press Ctrl-C, tell the agent what the page really shows, and re-run once the stage is fixed.

```checkpoint quick-13
A wizard tells you to click a button that isn't there. What do you do?
- [x] Press Ctrl-C, tell the agent what's there, and re-run.
- [ ] Press Enter to skip it, then carry on to the next stage.
- [ ] Ask the agent to run the script and find the button itself.
Why: A running script can't adapt to a stale step. So you stop it, tell the agent what the page really shows, and re-run once the stage is fixed.
```

**You mistyped a value on stage 3.** There is no back button, because the stages only run forward. Press Ctrl-C and re-run. That costs little: values already in `.env` are offered back, so you press Enter through the stages you got right.

**It sends you to a dashboard for a key you already made.** The agent reads your repo, not the third-party service. If you created the account but never saved the key, it still sends you to the dashboard for it. So expect that trip.

**The script dies with a syntax error while you're at a prompt.** Bash reads a script bit by bit as it runs, so changing the file mid-run could break it. One wizard sat at "Paste the Client ID:" while its author changed two lines above that point. Pressing Enter gave a syntax error. The fix went into the template in October 2026. Every stage now runs inside one function, `run_wizard`, so bash reads the whole file first. So keep every stage inside `run_wizard`.

```checkpoint quick-14
A wizard from today's template waits at a prompt, and you edit its file. Why won't that kill it?
- [x] Bash has already read the whole file.
- [ ] Bash reloads the file at every prompt.
- [ ] The template refuses edits during a run.
Why: Bash reads a script bit by bit, which is what used to break. Every stage now runs inside one function, `run_wizard`, so bash reads the whole file first.
```

**You see no time estimate, though Matt's page promises one.** The page offers "progress with time remaining", and the v1.2 launch post shows a wizard announcing "7 stages · about 37 minutes". Nothing's broken: the page is behind the code. Version 1.2.3 removed the estimate, so the current template counts stages only.

### Try it

Get a real connection string into `.env` and CI. You'll need your practice project, the yoga-studio booking site, and a Neon account. If you haven't set the project up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first. The project also needs its `test` CI workflow, `.github/workflows/ci.yml`, merged into `main`. If it isn't there yet, do the Try it "On GitHub: a `test` check for your practice project" in [What CI/CD is](/learn/what-ci-cd-is) first. Its last step is the `- run: pytest api` line you edit below.

1. Keep secrets out of git: `echo .env >> .gitignore`.
2. In `.github/workflows/ci.yml`, add these lines straight under `- run: pytest api`:

```yaml
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

3. Start Claude Code: `claude`.
4. Type `/wizard Set up a Neon database. Local dev and CI both need its connection string.`
5. Check its list. You should see `DATABASE_URL` among the values, before any script exists.
6. Confirm the stages. You should see it write the script and tell you how to run it.
7. In a second terminal, in the same folder, run the script as it said. You should see "Ready to start?".
8. Press Enter, and follow each stage.
9. Paste the connection string at the script's prompt, never into the chat. You should see nothing as you paste.
10. Count its lines: `grep -c '^DATABASE_URL=' .env`. You should see `1`.
11. List your secrets: `gh secret list`. You should see `DATABASE_URL`.
12. Run the script again. At that prompt you should see `[Enter keeps current]`, so press Enter.
13. Run the count from step 10 again. You should still see `1`.
14. Undo the CI edit: `git restore .github/workflows/ci.yml`.
15. Delete the script, the `DATABASE_URL` line in `.env`, and the GitHub secret: `gh secret delete DATABASE_URL`.
16. Commit the `.gitignore` change on your next branch.

### Read more

- [The /wizard Skill](https://www.aihero.dev/skills-wizard), Matt Pocock, updated 2026-08-24
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, 2026-10-29
- [wizard: editing the script while a wizard is running kills it (#1142)](https://github.com/mattpocock/skills/issues/1142), kurama-ai, 2026-09-30
- [Do-nothing scripting: the key to gradual automation](https://blog.danslimmon.com/2019/07/15/do-nothing-scripting-the-key-to-gradual-automation/), Dan Slimmon, 2019-07-15
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, 2026-10-19

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint wizard-deeper-fix-in-template
A user reported that a generated setup script died with a syntax error when its author edited two lines while it waited at a prompt. Bash reads a script bit by bit as it runs. The fix went into `template.sh`, not into that one script. Why there?
- [x] Every later script is copied from the template, so a fix there reaches all of them.
- [ ] The bug was in the stages the agent wrote, and those stages live only in the template.
  > Stages are written per script; the fix changed how the template wraps them, inside `run_wizard`.
- [ ] Only the template is checked with `bash -n`, so a fix anywhere else can't be verified.
  > The agent runs `bash -n` on each script it writes, not only on the template.
- [ ] The agent isn't allowed to edit a generated script once you have started running it.
  > Nothing forbids that; editing mid-run is exactly what broke it. The template change is what makes such an edit safe from now on.
Why: Every script starts as a copy of the template. Fixing one script helps only that run; fixing the template helps every script made from it from then on. Today's template runs every stage inside `run_wizard`, so bash reads the whole file before the first prompt and an edit mid-run can't break it.
```

```checkpoint wizard-deeper-stale-page
The agent wrote you a setup script for your database host. On stage 2 it tells you to click a button that isn't on the dashboard any more, so you can't get the value it asks for. What should you do, and why?
- [x] Press Ctrl-C, tell the agent what the page really shows, and re-run once the stage is fixed.
- [ ] Ask the agent to run the script itself, so it can find the new button on the page.
  > The agent never runs it end to end: the script opens browsers and waits for a human.
- [ ] Press Enter to skip ahead, since a later stage checks the host and fills the gap.
  > No stage checks the service. The script reads only `.env`, not the dashboard, so a skipped value stays missing.
- [ ] Delete the script and paste the key into the chat so the agent writes `.env` for you.
  > A key pasted into the chat lands in the model's context. The script exists so typed keys go straight to `.env`.
Why: Steps the model remembers can be out of date, and confirming the stages can't catch one the model wrongly believes is current. A running script has no escape hatch, so you stop it, get the stage corrected, and re-run. That costs little, because saved values are offered back as defaults.
```

## Remember

```flashcards
Q: What does wizard create?
A: A bash script that walks a human through manual steps, one stage at a time.

Q: Where does a wizard write the values you paste back?
A: Where they belong, such as `.env` or GitHub secrets.

Q: Is a wizard kept in the repo?
A: Only if you want a repeatable setup path. By default it's for one run, then deleted.

Q: How does the agent find which secrets a wizard must produce?
A: It reads the CI workflows. Every `secrets.*` reference there that GitHub doesn't create itself is a value the wizard must produce.

Q: Why did wizard become model-invoked in v1.2?
A: So an agent that hits a step only you can take writes a wizard, instead of dumping numbered instructions into the chat for you to follow by hand.

Q: What older idea is a wizard close to?
A: Dan Slimmon's do-nothing script (2019): each manual step sits in a function that tells you what to do and waits for you to do it.

Q: Does a wizard check what you've already set up in a third-party service?
A: No. The agent reads your repo, not the service. If you made the account but never saved the key, the wizard still sends you to the dashboard for it.
```

## Final test

```final-test wizard-when-not
When should you not use wizard?
- [x] When the agent can do the steps itself.
- [ ] When the steps involve secrets.
- [ ] When the procedure has more than one stage.
- [ ] When the values need to go into GitHub secrets.
Why: A wizard exists for steps only a human can take. If the agent can do them, a script that makes you do them adds work for nothing. Secrets, several stages and GitHub secrets are what a wizard is built to handle.
```

```final-test wizard-runs-it
Does the agent run the finished wizard from start to end?
- [x] No. It opens browsers and waits for you, so the agent checks it by reading.
- [ ] Yes, once, in a dry run with fake values, to prove that each stage works end to end.
- [ ] Yes, in a CI job, where it can run without a browser or a person.
Why: The script opens browsers and stops at each prompt until a person answers, so the agent can't get through a run on its own. That's why the agent checks it by reading instead, and why your first run is the real test.
```

```final-test wizard-what-agent-writes
When the agent writes a wizard, which part does it write itself?
- [x] Only the stages. The library above them comes from the template unchanged.
- [ ] The whole script, written from scratch so it fits this project's setup.
- [ ] The library of helpers. The stages come from the template unchanged.
Why: The library above the stages is the same in every wizard, so every wizard behaves the same way. That leaves the agent one job: working out the procedure and writing its stages. It never edits the library.
```

```final-test wizard-deeper-mistyped-value
You mistyped a key on stage 3 of a running wizard. What do you do?
- [x] Press Ctrl-C and re-run it, pressing Enter to keep the values you already got right.
- [ ] Use the wizard's back step to return to stage 3, retype the key, then carry on.
- [ ] Let it finish, then ask the agent to run stage 3 again for you with the right key.
- [ ] Edit the stage in the script while it waits at the prompt, then press Enter to reload it.
Why: The stages only run forward, so there's no way back to stage 3. You press Ctrl-C and re-run. That costs little, because values already in `.env` are offered back, and you press Enter through the stages you got right.
```

```final-test wizard-deeper-keys-in-context
When does a key you give a wizard end up in the model's context?
- [x] When you paste it into the chat while the agent is working out the stages.
- [ ] When you type it at the wizard's hidden prompt and it gets written to `.env`.
- [ ] When the wizard passes it to `gh secret` and GitHub reports back to the agent.
Why: You run the script, not the agent, and the model isn't connected to it. So a key typed at its prompt goes straight to `.env` or `gh secret`, not through the model. The chat is different: anything you paste there is in the context window like any other text.
```

```final-test wizard-api-keys
Your new FastAPI backend needs API keys from a payment provider and an email service. Someone has to sign in to each dashboard, create the keys and copy them into `.env`. One of them also has to become a GitHub secret for CI. Which fits best?
- [x] Generate a script that walks you through each dashboard and saves the keys.
  > Right: that's `/wizard`.
- [ ] Write the account owners a document of questions about the keys and secrets.
  > That's `/to-questionnaire`. Nobody is missing knowledge. Someone has to do steps in dashboards, and that's an action, not an answer.
- [ ] Write a handoff document so a fresh agent can create the keys for you.
  > That's `/handoff`. A fresh agent can't sign in to your dashboards either. These are steps only you can take.
Why: Nobody here is missing an answer. Someone has to sign in, create keys and copy them, and an agent can't do that. A script that opens each page, captures each value and writes it to `.env` and GitHub secrets keeps those steps in order, with nothing lost.
```

```final-test wizard-database-cutover
Tonight you're moving your site's Postgres database to a new host. Some steps happen in the old and new hosts' dashboards, one of them can't be undone, and the new connection string must end up in `.env`. Which fits best?
- [x] Generate a script that guides you and confirms before the risky step.
  > Right: that's `/wizard`.
- [ ] Have the agent do the move as a Ticket, test-first, and report back.
  > That's `/implement`. The agent can't click through your hosting dashboards. These steps need a human in the loop.
- [ ] Send a background agent to read both hosts' docs and write up the steps.
  > That's `/research`. A write-up tells you about the steps, but you still have to do them by hand, with nothing captured or confirmed.
Why: An agent can't click through the dashboards, and one step can't be undone. A wizard suits both: it walks you through the steps in order, confirms before anything irreversible, and writes the new value to `.env` for you.
```

```final-test wizard-confirm-stages
The agent has read your repo and drafted the stages of a setup script: create a Neon database, copy its connection string into `.env`, and add it as a GitHub secret for CI. Before writing any of the script, it shows you the stages and the values each produces, and waits. Why?
- [x] So you can add, drop or reorder stages before any script exists.
- [ ] So you can run each stage by hand before the agent writes it.
  > You run the finished script, not the stages one by one. Here you only confirm the list.
- [ ] Because it can't read your setup files, so it needs you to list them.
  > It reads the repo first and doesn't ask cold. It shows you what it found so you can correct it.
- [ ] So the stages can be published as a Spec on the Issue tracker.
  > The stages stay in the conversation. They describe one script, not a whole feature.
Why: As in a [grilling](/learn/grilling), the agent looks up the facts itself, then settles the decisions with you before building. So you add, drop or reorder the stages first, and only then does it map each stage and write the script.
```

```final-test wizard-why-commit
A setup script the agent generated walked you through your payment keys and CI secrets. A friend will clone the repo next week and needs the same setup. You commit the script and link it from the README. Why?
- [x] So the next person runs the script instead of asking an AI again.
- [ ] Because a wizard is meant to stay in the repo once it has worked.
  > They're for one run by default, and deleted when the job's done. You commit one only when you want it to repeat.
- [ ] So CI can run it on every push and keep the secrets in sync.
  > It opens browsers and waits for a human, so it can't run on its own.
Why: A wizard is for one run by default, but your friend needs the same setup. A committed script turns a procedure you'd re-explain every time into a repeatable setup path that lives in the repo, so they run it and need no AI to explain the steps again.
```

```final-test wizard-unknown-dashboard
While mapping the stages, the agent isn't sure where a hosting dashboard now shows the API key. The rest of the stages are clear. What should it do, and why?
- [x] Say so, and ask you or check the docs, because an invented step may not exist.
- [ ] Guess the most likely menu path, since you can work it out when you get there.
  > A guessed step may not exist. Every stage must trace to instructions a stranger could follow.
- [ ] Leave that stage out, and let you find and paste that key yourself later.
  > The key still has to be captured. Every value the wizard needs must be captured and land where it belongs.
Why: An invented step may not exist, and you'd only find out mid-run. So where the agent doesn't know the current page, it says so, and asks you or checks the docs, until every stage is something a stranger could follow.
```

```sources
- [wizard: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wizard/SKILL.md), Matt Pocock's Skills
- [The /wizard Skill](https://www.aihero.dev/skills-wizard), Matt Pocock
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [wizard: template.sh](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wizard/template.sh), Matt Pocock's Skills
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [Do-nothing scripting: the key to gradual automation](https://blog.danslimmon.com/2019/07/15/do-nothing-scripting-the-key-to-gradual-automation/), Dan Slimmon, 2019-07-15
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, 2026-10-19
- [wizard: editing the script while a wizard is running kills it (bash reads incrementally); patch parses the whole file before the first prompt](https://github.com/mattpocock/skills/issues/1142), kurama-ai, 2026-09-30
- [CI builds aren't triggered when Claude makes commits to a PR · Issue #319 · anthropics/claude-code-action](https://github.com/anthropics/claude-code-action/issues/319), searls, 2025-07-21
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token), GitHub Docs
```
