---
title: Wizard
slug: wizard
order: 15
part: 3
image: /photos/wizard.jpg
imageAlt: A man in a dark room carefully plugs a cable into a server rack.
imageCredit: ThisisEngineering
---

When the agent hits a step only you can take, let it write you a script that walks you through it, and keeps your secrets out of the chat.

```goals
- You'll be able to tell a step only you can take from one the agent should do itself, and spot when `/wizard` is the Skill to reach for.
- You'll be able to describe what the Skill produces, a bash script built from `template.sh`, and the four steps the agent takes to write it.
- You'll be able to decide where each captured value belongs: `.env`, a GitHub secret, a GitHub variable, both, or nowhere.
- You'll be able to run a wizard safely: in a real terminal, with secrets typed into the script rather than the chat, re-run after a mistake and deleted when the job is done.
```

## Why it matters

Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal, the text window where you type commands) can do a lot on its own, but it can't sign in to your accounts. Ask it to add card payments to a shop site and it will happily write the checkout code, then stop. The code needs an API key (a long password a service issues so your code can use it), and only you can log in to the payment company's dashboard (its website control panel) to create one.

The agent's old answer to that wall was a numbered list in the chat: "1. Go to the dashboard. 2. Click Developers… 6. Paste the key here." Three things go wrong with that list:

- **It scrolls away.** You switch to the browser, come back, and step 4 is somewhere up the conversation.
- **It can be out of date.** The agent's picture of a dashboard comes from its training, and dashboards get redesigned.
- **Step 6 puts your secret in the chat.** Everything you paste joins the model's context (all the text the AI behind Claude Code reads in this conversation), and that text goes to the model provider's servers. A secret key doesn't belong there.

Matt Pocock, a developer and teacher, publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name or when a task matches its description ([Skills](/learn/skills) covers them). His answer to this wall is `/wizard`: when a job needs a human, the agent writes ==a script that guides you through it== instead of a list.

```callout big-idea
The agent writes the wizard; you run it. Keys you type into the script go straight to a private file on your machine (`.env`) or to GitHub (the website that keeps your code online), never through the model.
```

## The idea: you're the hands, the script is the guide

A wizard is a bash script: a file of terminal commands that runs top to bottom (bash is a terminal language built into every Mac and Linux machine). It walks you through a manual job in **stages**, one focused task each. A stage clears the screen, shows "Stage 2/4", opens the right web page in your browser (or prints the link if it can't), tells you exactly what to click and copy, then waits for you to paste, saves the value and moves on. At the end it shows a summary of what it wrote and anything you still have to do by hand.

It's built for four kinds of job: provisioning infrastructure (creating servers, databases and other cloud services); credentials and CI secrets (CI, short for continuous integration, means servers that run your tests every time you push, or send, new changes to GitHub); clicking through an unfamiliar third-party dashboard; and a one-off migration or cutover (moving a project from one setup to another, once).

Most values land in one of two places. **`.env`** is a private settings file in your project folder that your code reads values from. **GitHub secrets and variables** are values stored in your project's settings on GitHub, where CI can read them: secrets stay hidden, variables are visible.

Every wizard starts as a copy of the same file, `template.sh`, which ships with the Skill. Its top half is a fixed library (ready-made helper code): the progress display, browser opening on Mac, Linux and Windows, hidden typing for secrets, safe writes to `.env`, writes to GitHub, and the closing summary. A comment line (a note bash skips), the `STAGES` marker, divides the file. ==The agent writes only the stages below the marker== and never edits the library above it, so every wizard behaves the same way.

**Who starts it.** Wizard is a model-invoked Skill: you can start it by typing `/wizard`, or the agent can pick it up by itself. Since version 1.2 (August 2026), an agent that hits a credentials wall mid-build offers you a wizard instead of a numbered list. Plain words can be enough: "help me set up the database".

**What it's not for.** The Skill's description rules out steps the agent can perform itself. If you're signed in to a command-line tool (a program you run from the terminal) that can create the thing, like GitHub's `gh`, the agent runs it with your login. ==If the agent can do it, the agent should do it==; a wizard is only for the logins, clicks and approvals that need you.

```checkpoint which-belongs-in-wizard
You're adding email alerts to a site. Four jobs are on the list. Which one belongs in a wizard stage?
- [ ] Creating the alerts database with a command-line tool you're signed in to.
  > The agent can run that tool with your login, so it creates the database itself. No human needed.
- [ ] Reading the email service's public docs for the right settings.
  > The agent can read public web pages itself. No login needed.
- [x] Creating an API key in the email service's dashboard.
  > Right. That needs your login, so only you can do it. Everything else on the list is the agent's job.
- [ ] Writing the code that reads the new key from `.env`.
  > Key-related doesn't mean human-only. Editing project files is the agent's job; only getting the key needs your login.
```

## How the agent builds one: four steps

1. **Scope the procedure.** It reads your repo (your project folder, tracked by Git, the tool that saves, or commits, each change into a shared history) before asking you anything: the `.env` files, `.env.example` (a shared file listing the names of the values `.env` needs, with no real values), the README (the project's front-page guide), config files, and the CI workflow files under `.github/workflows/`. Every secret or variable those workflows read is a value the wizard has to capture. For a migration, it works out where things stand, where they should end up, and which steps between can't be undone. Then it shows you the ordered stages and the values each produces, for you to add, drop or reorder. Every value needs three answers: where you get it, where it's written, and whether it's secret.
2. **Map each stage's journey.** For each stage it writes the exact path a stranger could follow, like "Dashboard → Developers → API keys → Reveal test key → copy". Where it doesn't know the current screen or command, it must say so and ask you or check the docs rather than invent clicks. Its memory can still be stale.
3. **Author the wizard.** It copies `template.sh` and writes one stage per step, in dependency order (a stage that needs another's result comes after it). The bar: open the page before asking for its value, hide the typing for anything secret, ask for a yes before anything irreversible, and keep each stage to one task that fits on one screen, since every stage starts by clearing it.
4. **Verify and hand off.** It runs `bash -n` (a syntax check that doesn't run the script) and `shellcheck` (a tool that spots common shell-script mistakes) if you have it. It never runs the wizard itself, because the script opens browsers and waits for a human. Instead it traces it on paper: every value lands where step 1 said, and every GitHub secret name matches the name CI reads. Then it tells you how to run it.

```scene flow
title: How the agent builds a wizard
node: scope | 1. Scope: read the repo, confirm stages
node: map | 2. Map every click
node: author | 3. Write stages from template.sh
node: verify | 4. Check it without running it
node: you | You run it in a real terminal
# It starts from your repo, not from questions, then shows you the stage list to change.
at: scope
# For every stage it writes clicks a stranger could follow, and asks when it isn't sure of the current screen.
at: map
# It copies the template and writes only the stages below the marker.
at: author
# It checks syntax and traces every value to its destination. It never runs the wizard end to end.
at: verify
# The first real run is yours.
at: you
```

```checkpoint verify-before-handoff
The agent has written a wizard and `bash -n` passes. What should it do before handing it to you?
- [ ] Run it end to end itself, to make sure every stage works.
  > It can't: the script opens browsers and waits for your clicks and keys. The first real run is yours.
- [x] Check on paper that each value lands where scoping said.
  > Right. A static trace, plus matching every GitHub secret name to the name CI reads, is how it verifies a script it can't run.
- [ ] Paste in a sample key to check that hidden entry works.
  > That means running the wizard, which waits for a human. And a key should never pass through the agent.
- [ ] Commit it and link it from the README straight away.
  > Only a setup path the next person will need gets committed. Most wizards are run once and deleted.
```

## Where each value goes

Scoping gives every captured value a destination. A **secret** must stay private, like a password; a **public** value is safe to show anyone, like an account ID. `.env` should never be committed to Git.

| Destination | When |
|---|---|
| `.env` only | Only your laptop uses it |
| GitHub secret | CI uses it, and it must stay private |
| GitHub variable | CI uses it, and anyone may see it |
| `.env` and a GitHub secret | Your laptop and CI both use it |
| Nowhere | Nothing to save: the stage is a pure action, like flipping a switch |

The template writes `.env` carefully: it replaces an old line rather than adding a duplicate, and creates the file so only your user account can read it. It writes GitHub secrets and variables with `gh`, GitHub's command-line tool. If `gh` isn't installed or signed in, the stage doesn't crash: it warns you, and the closing summary lists what to set by hand.

**Why your secrets stay out of the model.** A key you type into a hidden prompt goes from your keyboard into `.env` or GitHub, and the conversation never sees it. That covers only values typed into the running script: ==a key you paste into the chat is in the model's context== like any other text. While scoping, describe values ("the secret key from the dashboard"); never paste them.

```callout tip
Scoping reads your `.env` files, and Claude Code can open them like any project file. Once real keys are saved, ask the agent to look only at the names in `.env`, and to confirm a value landed by testing it (a connection check, say) without printing it.
```

```checkpoint public-ci-value
Only your CI build needs the site's analytics ID, which is public: it appears in every page's source anyway. Your laptop doesn't need it. Where should the wizard write it?
- [x] A GitHub variable.
  > Right. CI reads it and it's public, which is exactly what variables are for.
- [ ] A GitHub secret, just to be safe.
  > Secrets are for sensitive values, and they stay hidden even from you, so a public value is just harder to check there. Public CI values go in variables.
- [ ] `.env` only.
  > CI runs on GitHub's servers and can't see the files on your laptop.
- [ ] Nowhere: it's a pure action.
  > There's a value to capture, so it needs a destination.
```

## A session, step by step

Here's one session (one conversation with the agent) in an invented shop project whose tests run on GitHub Actions (GitHub's built-in CI). The agent's moves follow the Skill.

```scene chat
title: A shop site hits a payment-key wall mid-build (illustrative)
# You ask for payments through Stripe (a payment company) in test mode, its practice mode where no real money moves. The agent builds everything it can by itself.
you: Add Stripe test payments to the checkout page.
agent: The checkout code and its tests are written, and I've added the two key names to `.env.example`. To run, they need Stripe keys, and creating those needs your Stripe login.
# It hits a step only you can take, so it proposes a wizard, scoped from the repo.
agent: Rather than list steps here, I'll write you a wizard. I read `.env.example` and `.github/workflows/test.yml`: CI reads `secrets.STRIPE_SECRET_KEY`. Proposed stages: **1 · Sign in and switch to test mode** (an action, nothing saved). **2 · API keys**: `STRIPE_PUBLISHABLE_KEY` (public) → `.env`; `STRIPE_SECRET_KEY` (secret, hidden typing) → `.env` and a GitHub secret. Add, drop or reorder?
# The plan is yours to change before a line of the script exists.
you: I'm already in test mode, so drop stage 1.
# Where it isn't sure of the current screen, it asks rather than inventing clicks.
agent: One stage, then. Dashboards change: is the key page still under Developers → API keys for you?
you: Yes.
# It writes the script from the template, then checks it without running it.
agent: Wrote `scripts/stripe-wizard.sh` from the template. `bash -n` passes, and the secret's name matches the one CI reads. I haven't run it: it opens your browser and waits for you.
# It tells you how to run it, and where your keys go.
agent: In a separate terminal window, run `bash scripts/stripe-wizard.sh`. Type the keys into the script, not this chat. When you're done, delete it, unless you want it as the repo's setup path.
```

## Running it

**Use a real terminal window.** Open a new terminal window or tab, go to your project folder, and run the command the agent gave you. On Windows, use Git Bash (the bash terminal that comes with Git for Windows) or WSL (Linux running inside Windows). Don't run it from Claude Code's prompt box with `!` (the prefix that runs a shell command from the chat): it can't get your keystrokes there, so every pause gets skipped, as this site's author found out.

**Made a mistake? Re-run.** There's no back button. If you mistype a value, press Ctrl-C (Control+C, on a Mac too) to stop, and run it again. Every value already written to `.env` comes back as a default ("[Enter keeps current]"), so you press Enter through the good ones and retype only the wrong one.

**A screen doesn't match? Stop and say so.** If a page or button isn't there, press Ctrl-C, tell the agent what you see, and let it fix that stage.

**Careful with re-runs on a cutover.** The opening banner says you can stop and re-run any time, because saved values are remembered. That holds for values in `.env`, not for a migration whose progress lives only inside the running script. For those, ask the agent before you start what a stop halfway would leave behind.

**Ephemeral by default.** A wizard is built for one run: saved to a scratch folder (for throwaway files) or `scripts/`, run, then deleted. ==Commit it only if the next person will need it too==, with a link from the README, so they run the script rather than explain the job to an agent again.

```scene terminal
title: Running the shop's Stripe wizard (illustrative)
# You run it yourself, in a terminal window of its own. A banner says what it's for, then waits.
$ bash scripts/stripe-wizard.sh
Stripe setup
Ready to start?
# The stage clears the screen and opens the page before it asks for anything.
▸ Stage 1/1 · Stripe: API keys
↗ opening https://dashboard.stripe.com/test/apikeys
• Copy the Publishable key (starts pk_test_).
Paste the publishable key: pk_test_51Hx…
# The secret key goes into a hidden prompt: nothing shows as you paste, and nothing reaches the chat.
• Reveal the secret key and copy it.
Paste the secret key:
# Each value lands where scoping said: both keys in .env, and the secret in GitHub too.
✓ wrote STRIPE_PUBLISHABLE_KEY → .env
✓ wrote STRIPE_SECRET_KEY → .env
✓ set GitHub secret STRIPE_SECRET_KEY
# It ends with a summary of what it wrote, plus anything left for you to do by hand.
✓ Setup complete
wrote 2 value(s) to .env: STRIPE_PUBLISHABLE_KEY STRIPE_SECRET_KEY
set 1 GitHub secret(s): STRIPE_SECRET_KEY
# Mistyped a key? Run it again: saved values come back, and Enter keeps them.
$ bash scripts/stripe-wizard.sh
Paste the publishable key: [Enter keeps current]
```

```checkpoint cutover-stopped-halfway
Your wizard moves each customer's files to a new storage service, one batch per stage, and only the running script keeps track of which batches have moved. At stage 3 your laptop's battery dies. The banner said you could stop and re-run any time. What's the safe next move?
- [ ] Re-run it straight away: the banner says saved values are remembered.
  > That promise covers values saved in `.env`. Which batches had moved lived only inside the script, and that's gone.
- [ ] Ask the agent to run the remaining stages itself.
  > It never runs a wizard: the script opens browsers and waits for you. And the real problem is unknown progress.
- [ ] Delete `.env` so the re-run starts from a clean slate.
  > The progress was never in `.env`, so clearing it doesn't tell the script what already moved.
- [x] Check what already moved before running it again.
  > Right. Re-running is safe for values in `.env`, not for progress kept inside the script. Find out the current state first; the agent can help you check.
```

## Where it fits

`/wizard` isn't a fixed step in Matt's Main flow (the path most work takes, from idea to shipped; see [The main flow](/learn/main-flow)). It's a standalone for whenever a manual step shows up, before, during or long after a build. It pairs with `/implement` (the Skill that builds a planned change; see [Implement](/learn/implement)) when a feature needs credentials. Its nearest neighbour, `/setup-matt-pocock-skills`, sets up the Skills in a repo; a wizard covers your part of other setups.

Don't use a wizard to decide *what* to build. That's `/grill-with-docs`, where the agent interviews you until the plan is clear ([Domain modeling](/learn/domain-modeling)), then `/to-spec`, which writes it down as a spec (a written plan).

## How Matt and others use it

**Matt Pocock** showed the Skill in his v1.2 release video (5 August 2026), paraphrased here from machine-translated captions:

- **It came from his own pain.** He'd been provisioning a lot of infrastructure and AWS (Amazon's cloud) settings, and hated it (7:27–7:43).
- **He keeps a human at the controls.** He could have had an agent drive AWS by computer use (an agent working the mouse and keyboard), but that felt uncomfortable. He wanted control, made easy (7:51–8:01).
- **His demo** wizard sent him to the right page, had him change the exact setting, then took his pasted API keys. Because it's a fixed script, nothing reaches the agent or Anthropic; values went to the files that need them, and to GitHub secrets where needed (8:02–8:37).

**Other developers:**

- **Colin Eberhardt**, CTO of Scott Logic, rebuilt one of his apps with Matt's Skills (19 October 2026). He asked in plain words for help setting up Supabase (a hosted database service), and the agent reached for `/wizard` itself. The script then sent him to pages that no longer existed. His verdict: "the shell script has no escape hatch".
- **A Codex user** (Codex is OpenAI's coding agent) generated a wizard for a production cleanup. A review caught, before anything ran, that the banner's re-run promise was false for that job (issue #1310, October 2026, open).
- **A team on Windows laptops** asked for PowerShell scripts (Windows' own terminal language) instead of bash (issue #954). It was closed as not planned: the template is bash by design. The maintainer suggested one line in CLAUDE.md (a file of standing instructions the agent reads every session) asking for PowerShell wizards, or, if you installed the Skills as editable copies, editing your copy of the template.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). On Windows you also need Git for Windows (git-scm.com, also in Start here): it adds Git Bash, where you'll run the wizard, and lets the agent check the script. Use only made-up values: this is practice.

1. Open a new terminal window (Terminal on a Mac, PowerShell on Windows); it starts in your home folder. Make an empty folder there and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir wizard-practice
cd wizard-practice
claude
```

2. Type `/wizard` without pressing Enter. If `wizard` shows in the list that pops up, delete what you typed. If not, delete it, type `/exit`, press Enter, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box (plan mode only reads and proposes), press Shift+Tab until it changes: the agent needs to write a file.
4. Copy this, paste it into the prompt box and press Enter:

```text
/wizard I want to practise. Make a 3-stage wizard at scripts/wizard-practice.sh that writes only to .env.practice (no GitHub secrets or variables):
1. Open https://github.com/mattpocock/skills and ask me how many stars it shows (public) -> PRACTICE_STARS.
2. Open https://www.aihero.dev/skills-wizard and wait for me to press Enter once I've read "Ephemeral by default" (a pure action, nothing saved).
3. Ask me for a made-up practice key with hidden input -> PRACTICE_KEY. Remind me to type a fake value.
Show me the stage list first and wait for my OK.
```

5. Read the stage list and reply "OK". If it asks permission to create the script or run a check, choose Yes. To stop the agent at any point, press Esc.
6. Open a second terminal window, not `!` in Claude Code. On Windows, open Git Bash from the Start menu (Git for Windows installed it): PowerShell can't run bash scripts. Run these, using the path the agent gave you:

```sh
cd ~/wizard-practice
bash scripts/wizard-practice.sh
```

7. Press Enter at "Ready to start?", follow each stage, and type something fake like `test123` for the key. If anything looks wrong, press Ctrl-C. (On Windows, a known bug can show "couldn't open a browser" even when the page opened.)
8. Run it again and press Enter at each prompt to keep what's saved (if it asks a [y/N] question, type y). Then run `cat .env.practice` to see what it saved (the values are fake, so showing them is fine).
9. Clean up in that window, then type `/exit` in Claude Code:

```sh
rm -r scripts
rm .env.practice
```

**It's working if:**

- [ ] You saw the stages and their values, and were asked to confirm, before any script existed.
- [ ] The agent checked the script (`bash -n`, and `shellcheck` if you have it, which may flag a few lines in the template's library: known, leave them alone) but didn't run the wizard.
- [ ] Each stage cleared the screen and showed "Stage n/3".
- [ ] In stage 1, the stars page opened before you were asked for the number.
- [ ] Your typing was invisible for the key.
- [ ] On the second run, both value prompts offered "[Enter keeps current]".
- [ ] `cat .env.practice` showed two lines, each value in single quotes.
- [ ] The last screen listed what it wrote.
````

## Common mistakes

- **Editing the library above the `STAGES` marker.** Checks specific to one job belong in that job's stages.
- **Expecting it to know your accounts.** It reads your repo, not the service. If a key isn't saved in `.env`, it sends you to fetch it, even if you created it last week.
- **Forgetting `.gitignore`.** The template writes `.env` but doesn't stop Git from saving it. Check that `.gitignore`, the file of things Git ignores, covers every `.env` file with real values but not the shared `.env.example`.
- **The rest are in Running it:** running it with `!`, following stale clicks, trusting re-runs on a cutover, committing a one-off wizard.

```site-story
The ticket (a written-up task) was "Connect GitHub, Vercel and Neon": logins and dashboards only I could do, with the agent writing a wizard for them. I typed `/wizard`.

**The agent did most of it first.** I was already signed in to GitHub and Vercel (which hosts this site), so it created the public GitHub repo, the Vercel project, and the Neon project (Neon hosts the database) with a `test` branch: a separate copy of the database for my tests.

**The wizard had 4 stages for me:**

1. Connect Neon to Vercel, with clicks in the browser.
2. Download my laptop's database password. No clicks: the script did it.
3. Paste my test database's password, with hidden typing.
4. Merge PR #1, my first pull request (a proposed change you review before it joins the main code).

**My first run failed, harmlessly.** I ran it inside the Claude chat with `!`, which can't press Enter, so it raced through every question. Then I ran it in my code editor's own terminal.

**It guarded my real data.** The wizard refused the production password where my tests' password belonged, so tests can never touch real data by accident.

**Reality changed the plan.** The Neon–Vercel connection named my laptop's database branch `vercel-dev`, not `dev`, so PR #1 updated the site's spec to match.

**It was never committed.** The ticket was done when the live site showed the placeholder page and the agent could reach both databases from my laptop. The script was a one-time tool, so it never entered the repo's history.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| A step needs your login or a dashboard | `/wizard`, or let the agent reach for it |
| The agent could do the step itself | Let it; no wizard stage |
| Scoping | Check the stage list. Describe secrets, never paste them |
| Where a value goes | Laptop only: `.env`. CI: a secret if sensitive, a variable if public. Both: `.env` and a secret |
| Running it | A real terminal window, not `!` in the chat |
| Mistyped a value | Ctrl-C, re-run, Enter keeps the good ones |
| A screen doesn't match | Ctrl-C, tell the agent what you see |
| Done | Delete it, unless it's a repeatable setup path (commit it, link it from the README) |

## Final test

```test scenario-credentials-wall
The agent has written all it can of a booking app's calendar sync. To run, the code needs a key from a calendar service you've signed up for, and the agent can't log in to your account. What should it do?
- [ ] List the dashboard steps in the chat and ask you to paste the key back.
  > That's the old habit the Skill replaced: the steps scroll away, and the pasted key lands in the model's context.
- [ ] Put in a placeholder key and report the feature as done.
  > A made-up key can't make the code really run, and only you can get the real one. Say so and propose a wizard.
- [x] Propose a wizard, starting with the stages and values it needs.
  > Right. The Skill is model-invoked so the agent can reach for it at exactly this kind of wall, and the stage list doubles as its proposal.
- [ ] Stop and wait until you type `/wizard` yourself.
  > Wizard is model-invoked: the agent can reach for it on its own.
```

```test scenario-agent-can-do
Your project deploys with a hosting company's command-line tool, which can also create new sites. The agent used it this morning to deploy for you. Now its setup plan includes a wizard stage: "Create a staging site (a private test copy) in the hosting dashboard." What do you say?
- [x] "You can make that with the tool; drop the stage."
  > Right. The tool already works for the agent, so it can create the site itself, and if the agent can do a step, it should. Wizards are only for steps that genuinely need your hands.
- [ ] "Fine. Every setup step belongs in the wizard, so nothing gets missed."
  > The Skill says the opposite: don't use a wizard for steps the agent can perform itself.
- [ ] "Keep it: anything in my hosting account is mine to do."
  > Whose account it is doesn't decide it: the agent can already use the tool with your login.
- [ ] "Drop it; I'll paste my dashboard password so you can sign in."
  > The tool already works for the agent, so it needs no password, and anything pasted in the chat joins the model's context.
```

```test scenario-not-for-deciding
Matt's Skills are already set up in your app's repo, but you haven't decided whether the app should take payments at all, or which provider you'd use. Which Skill do you reach for?
- [ ] `/wizard`, so it can walk you through a provider's sign-up.
  > A wizard carries out a procedure you've already chosen. It doesn't help you choose.
- [x] `/grill-with-docs`, so the agent questions you until it's clear.
  > Right. Deciding what to build is a grilling job. A wizard comes later, if a manual step turns up.
- [ ] `/implement`, building a version with each provider.
  > Building before deciding wastes the work you throw away. Agree on what to build first.
- [ ] `/to-spec`, so the agent writes up the payment plan you'll follow.
  > A spec writes down a plan you've already agreed, and nothing's decided yet. Grill first; `/to-spec` comes after.
```

```test scenario-local-and-ci
Your app reads a database password on your laptop, and your GitHub Actions tests read the same password. Where should the wizard write it?
- [ ] `.env` only.
  > CI runs on GitHub's servers and can't see your laptop's files.
- [ ] A GitHub variable, so you and CI can both read it.
  > Variables are visible, so they're for public values, and a password is sensitive. Your laptop's code reads `.env`, not GitHub, so it still wouldn't have it.
- [ ] Only a GitHub secret, since that's where CI looks.
  > Then your laptop doesn't have it, and the app won't run locally.
- [x] `.env` and a GitHub secret.
  > Right. Both places need it, and it's sensitive, so it goes in `.env` and a GitHub secret.
```

```test scenario-keep-or-delete
Every new developer on your team must set up the same five services before the app runs. Your wizard for that job just worked. What do you do with it?
- [ ] Delete it: a wizard is built for one run.
  > One run is the default, not a rule. This setup path will be needed again.
- [x] Commit it and link it from the README.
  > Right. A repeatable setup path belongs in the repo, so whoever comes next runs it instead of explaining the setup to an agent again.
- [ ] Paste its steps into the README for teammates to follow.
  > That's the numbered list again: teammates follow it by hand and it goes out of date. Commit the script and link it from the README instead.
- [ ] Keep it in a scratch folder on your own laptop only.
  > Teammates can't run a script they can't see.
```

```test spot-agent-ran-wizard
Ana asks the agent to start the new setup wizard so she can watch it in the chat. The output races past every "Press Enter" and stops at the first prompt. Spot the mistake.
- [ ] She should have typed it after `!` in the prompt box instead.
  > `!` runs it from the chat too, so the pauses still get no keystrokes. That's how this site's author first ran his.
- [ ] Her browser couldn't open, so each stage skipped ahead.
  > When no browser opens, the wizard prints the link and still waits. That isn't what skipped the pauses.
- [x] It ran from the chat; she needs a terminal window.
  > Right. A wizard waits for your Enter presses and typed values, and a script started from the chat can't get your keystrokes. The first real run is yours, in a window of its own.
- [ ] Her `gh` tool isn't signed in.
  > That only affects GitHub writes, and it shows a warning. It doesn't skip pauses.
```

```test spot-pasted-in-chat
While the agent scoped a wizard, Raj pasted his live payment key into the chat "so it knows the format". Later he typed the same key into the wizard's hidden prompt. What went wrong?
- [ ] Nothing: the hidden prompt keeps the key away from the model.
  > The hidden prompt protects only what's typed into the script. The pasted copy is already in the conversation.
- [x] That key is now exposed, whatever the wizard does with it.
  > Right. Anything pasted into the chat joins the model's context and goes to the provider's servers, and it can't be taken back, so make a new key and delete the old one. Describe values while scoping; type them only into the script.
- [ ] Only the format leaked, since he said it was just an example.
  > Saying why you pasted it changes nothing: the whole key is in the model's context and on the provider's servers.
- [ ] Typing it into the wizard afterwards sent it to the chat again.
  > The wizard isn't connected to the model, so the hidden prompt added nothing. The leak was the paste.
```

```test spot-edited-library
While writing a wizard for a maps service, the agent wants to reject any key shorter than 30 characters. It adds the check inside the hidden-typing helper in the template's library. Spot the mistake.
- [ ] A wizard can't check the values you type into it.
  > It can. Stage code can check a value before writing it, as this site's wizard did.
- [ ] Nothing: in the library, every stage gets the check for free.
  > The library is identical in every wizard by design, so job-specific rules don't go there. Put the check in the stage that asks for the key.
- [ ] The agent's `bash -n` check should test the key's length instead.
  > `bash -n` only checks the script's syntax before anyone runs it, and never sees your key. The key check runs in its stage, below the marker.
- [x] The check belongs below the marker, in that key's stage.
  > Right. The library above the `STAGES` marker stays identical in every wizard; anything specific to this job goes in its stages.
```

```test sequence-four-steps
Which order does the agent follow when it builds a wizard?
- [ ] Copy `template.sh` and write stages → read the repo → map every click → check the script
  > Writing comes before it knows what to write. It reads the repo and agrees the stages with you first.
- [ ] Read the repo, confirm stages → write stages → map every click → check it without running it
  > Close, but it maps every click before writing anything: each stage is written from its mapped path.
- [x] Read the repo, confirm stages → map every click → write stages → check it without running it
  > Right. Scope, map, author, verify: and the first real run is yours.
- [ ] Map every click → write stages → run the whole wizard end to end → confirm the stages with you
  > The stage list comes first, before mapping anything, and the agent never runs the wizard itself.
```

```test scenario-rerun-after-fix
Stage 3 of your 4-stage wizard opens a page that doesn't match its clicks. Stages 1 and 2 already saved two values to `.env`. You press Ctrl-C and the agent fixes stage 3. What's the right next move?
- [x] Re-run it yourself and press Enter past the saved values.
  > Right. Values already in `.env` come back as defaults, so you only redo what's left.
- [ ] Re-run it and retype both values: fixing the script erased them.
  > It didn't. Saved values live in `.env`, not in the script, so any version of the wizard offers them back as defaults.
- [ ] Paste the two saved values into the chat so nothing is lost.
  > They're already safe in `.env`, and pasting them puts them in the model's context.
- [ ] Finish stage 3 by hand, since a re-run writes duplicate lines to `.env`.
  > Writes replace the old line, so a re-run never duplicates one. Re-running is the safe way to finish.
```

```sources
- [wizard SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/wizard/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [wizard template.sh](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/wizard/template.sh) (the library, the `STAGES` marker, hidden entry, `.env` writes, `gh` fallback, closing summary): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (wizard as a standalone; "if the agent could just do it itself, it should"): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /wizard Skill](https://www.aihero.dev/skills-wizard), AI Hero docs (destinations, ephemeral by default, secrets and the model's context, where it fits, grill-with-docs and to-spec for deciding), same text as `docs/engineering/wizard.md` in 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (1.2.0 #680: graduated and made model-invoked; 1.2.3 #783: progress counted in stages), read 2026-10-23.
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05 (wizard chapter from 7:27; used 7:27–8:37; machine-translated captions, paraphrased).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19 (the Supabase wizard; "the shell script has no escape hatch"), read 2026-10-24.
- [Issue #1310: fixed resumability banner is unsafe for stateful cutovers](https://github.com/mattpocock/skills/issues/1310), opened 2026-10-20, open when read 2026-10-24.
- [Issue #954: PowerShell instead of bash on Windows](https://github.com/mattpocock/skills/issues/954), opened 2026-08-25, closed as not planned 2026-10-07 (maintainer: bash by design; ask for PowerShell in CLAUDE.md or edit your copy of the template).
- [Issue #1295: template.sh prompt hits SC1087](https://github.com/mattpocock/skills/issues/1295), opened 2026-10-18, open when read 2026-10-24 (shellcheck flags one library line, plus notes for helpers a wizard doesn't call).
- [Issue #963: open_url fails to open a browser on Windows Git Bash](https://github.com/mattpocock/skills/issues/963), opened 2026-08-26, open when read 2026-10-24 (a false "couldn't open a browser" warning).
- This site: `.scratch/lesson-site/issues/02-accounts-and-environments.md`, the old journal Lesson `content/lessons/04-wizard.md` at commit d21fc2c, and [PR #1](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/1) (commit c226730, 2026-10-21: `vercel-dev` in the spec and ADR 0002).
```
