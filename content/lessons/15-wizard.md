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
- **Step 6 puts your secret in the chat.** Everything you paste becomes part of the model's context: everything the AI reads in this conversation, sent to the model provider's servers. A secret key doesn't belong there.

Matt Pocock, a developer and teacher, publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name or when a task matches its description ([Skills](/learn/skills) covers them). Matt kept hitting this wall while setting up cloud infrastructure, and hated it. His answer is `/wizard`: when a job needs a human, the agent writes ==a script that guides you through it== instead of a list.

```callout big-idea
The agent writes the wizard; you run it. Keys you type into the running script go straight into files on your machine and never pass through the model.
```

## The idea: you're the hands, the script is the guide

A wizard is a bash script: a file of terminal commands that runs from top to bottom (bash is the language most Mac and Linux terminals speak). It walks you through a manual job in **stages**, one focused task each. A stage clears the screen, shows "Stage 2/4", opens the right web page in your browser, tells you exactly what to click and copy, then waits for you to paste. It writes each value where it belongs and moves on. At the end it shows a summary of what it wrote and anything you still have to do by hand.

The Skill is built for four kinds of job: provisioning infrastructure (creating servers, databases and other cloud services); credentials and CI secrets (CI, short for continuous integration, means servers that run your tests on every push); clicking through an unfamiliar third-party dashboard; and a one-off migration or cutover (moving a project from one setup to another, once).

You don't write the polish. Every wizard starts as a copy of the same file, `template.sh`, which ships with the Skill. Its top half is a fixed library: the progress display, browser opening on Mac, Linux and WSL (the Linux layer for Windows), hidden typing for secrets, safe writes to `.env`, GitHub writes, and the closing summary. A comment line, the `STAGES` marker, divides the file. ==The agent writes only the stages below the marker== and never edits the library above it, so every wizard behaves the same way.

**Who starts it.** Wizard is a model-invoked Skill: you can type `/wizard`, and the agent can also reach for it on its own. That's deliberate. Since version 1.2 (August 2026), an agent that hits a credentials wall mid-build offers you a wizard instead of a numbered list. Plain words can be enough: "help me set up the database".

**What it's not for.** The Skill's own description draws the line: don't use it for steps the agent can perform itself. If the agent is signed in to a command-line tool that can create the thing, it creates it. ==If the agent can do it, the agent should do it==; a wizard is only for the logins, clicks and approvals that genuinely need you.

```checkpoint which-belongs-in-wizard
You're adding email alerts to a site. Four jobs are on the list. Which one belongs in a wizard stage?
- [ ] Installing the email library that the new code depends on.
  > The agent can run the install itself, so it should. No human needed.
- [ ] Adding the new key's name to the `.env.example` file.
  > Editing files in the project is agent work.
- [x] Creating an API key in the email service's dashboard.
  > Right. That needs your login, so only you can do it. Everything else on the list is the agent's job.
- [ ] Writing the code that sends each alert email.
  > That's the agent's day job. Wizards are for steps a human must take.
```

## How the agent builds one: four steps

The Skill gives the agent four steps, each with a clear "done when".

1. **Scope the procedure.** It reads your repo (the project folder, tracked with Git) before asking you anything: the `.env` files and `.env.example`, the README, config files, and the CI workflow files under `.github/workflows/`. Every secret or variable those files mention is a value the wizard must produce. For a migration, it works out the current state, the target state and the irreversible actions between them. Then it shows you the ordered stages and the values each produces, for you to add, drop or reorder. Every value needs three answers: where you get it, where it's written, and whether it's secret.
2. **Map each stage's journey.** For each stage it writes the exact path a stranger could follow, like "Dashboard → Developers → API keys → Reveal test key → copy". Where it doesn't know the current screen or command, it must say so and ask you or check the docs. It never invents clicks.
3. **Author the wizard.** It copies `template.sh` and writes one stage per step, in dependency order. The bar: open the page before asking for its value, hide the typing for anything secret, ask for a yes before anything irreversible, and keep each stage short enough to fit one screen, because the next stage clears it.
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

Scoping gives every captured value a destination. A **secret** must stay private, like a password; a **public** value is safe to show anyone, like an account ID. **`.env`** is a private settings file in your project folder that your code reads values from; it should never be committed to Git (saved into the project's shared history). **GitHub secrets and variables** do the same job for CI: values stored in your GitHub repo's settings that your workflows can read, hidden (secrets) or visible (variables).

| Destination | When |
|---|---|
| `.env` only | Your laptop needs it; CI doesn't |
| GitHub secret | CI reads it, and it's sensitive |
| GitHub variable | CI reads it, and it's public |
| `.env` and a GitHub secret | Your laptop and CI both need it |
| Nowhere | The stage is a pure action: a switch flipped, a plan upgraded |

The template writes `.env` carefully: it replaces an old line rather than adding a duplicate, and creates the file so only your user account can read it. It writes GitHub secrets and variables with `gh`, GitHub's command-line tool. If `gh` isn't installed or signed in, the stage doesn't crash: it warns you, and the closing summary lists what to set by hand.

**Why your secrets stay out of the model.** The wizard is a plain program running in your terminal, and the model isn't connected to it. A key you type into a hidden prompt goes from your keyboard into `.env` or GitHub, and the conversation never sees it. That protection covers only values typed into the running script. ==A key you paste into the chat is in the model's context== like any other text. While scoping, describe values ("the secret key from the dashboard"); never paste them.

```callout tip
The `.env` file sits in your project, and Claude Code can read your project's files. If you want the agent to confirm a value landed, ask it to check without printing the value, as this site's agent did.
```

```checkpoint public-ci-value
Only your CI build needs the site's analytics ID, which is public: it appears in every page's source anyway. Your laptop doesn't need it. Where should the wizard write it?
- [x] A GitHub variable.
  > Right. CI reads it and it's public, which is exactly what variables are for.
- [ ] A GitHub secret, just to be safe.
  > It would work, but secrets stay hidden even from you, which makes a public value harder to check. Public CI values go in variables.
- [ ] `.env` only.
  > CI runs on GitHub's servers and can't see the files on your laptop.
- [ ] Nowhere: it's a pure action.
  > There's a value to capture, so it needs a destination.
```

## A session, step by step

Here's the whole loop in a shop project whose tests run on GitHub Actions (GitHub's built-in CI). The project is invented; the agent's moves follow the Skill.

```scene chat
title: A shop site hits a payment-key wall mid-build (illustrative)
# You ask for a feature. The agent builds everything it can by itself.
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
agent: Wrote `scripts/stripe-wizard.sh` from the template. `bash -n` passes, shellcheck is clean, and the secret's name matches the one CI reads. I haven't run it: it opens your browser and waits for you.
# It tells you how to run it, and where your keys go.
agent: In a separate terminal window, run `bash scripts/stripe-wizard.sh`. Type the keys into the script, not this chat. When you're done, delete it, unless you want it as the repo's setup path.
```

## Running it

**Use a real terminal window.** Open a new terminal window or tab, go to your project folder, and run the command the agent gave you. Don't run it from Claude Code's prompt box with `!` (the prefix that runs a shell command from the chat): the script needs your keystrokes, it can't get them there, and every pause gets skipped, as this site's author found out.

**Made a mistake? Re-run.** There's no back button. If you mistype a value, press Ctrl-C to stop and run the script again. Every value already written to `.env` comes back as a default ("[Enter keeps current]"), so you press Enter through the good ones and retype only the wrong one.

**A screen doesn't match? Stop and say so.** The clicks are only as current as the agent's knowledge. If a button isn't there, press Ctrl-C, tell the agent what you see, and let it fix that stage.

**Careful with re-runs on a cutover.** The opening banner says you can stop any time and re-run, because saved values are remembered. That holds for values in `.env`, not for a migration whose progress lives only inside the running script. For those, ask the agent what happens if you stop halfway.

**Ephemeral by default.** A wizard is built for one run: saved to a scratch folder or `scripts/`, run, then deleted. ==Commit it only if the next person will need it too==, and link it from the README so the next person runs the script instead of re-asking an agent.

```scene terminal
title: This site's setup wizard, replayed (illustrative)
# You run it yourself, in a terminal window of its own.
$ bash .scratch/lesson-site/wizard-02.sh
Connect GitHub, Vercel and Neon (issue 02)
4 stages
Ready to start?
# Each stage clears the screen, says where you are, and opens the page before giving you the clicks.
▸ Stage 1/4 · Connect Neon to Vercel
↗ opening https://console.neon.tech/app/projects/…/integrations
• Find Vercel and click Add, then Install from Vercel Marketplace.
• Turn ON 'Create a branch for your development environment'.
Press Enter once you've clicked Done…
# Once your clicks are done, a stage can run a command for you and check the result.
▸ Stage 2/4 · Download your laptop's database password
Running: vercel env pull .env.local
✓ .env.local has DATABASE_URL (vercel-dev branch)
# Secrets go into a hidden prompt: nothing shows as you paste, and nothing reaches the chat.
▸ Stage 3/4 · Save the test database password
• Click the Connect button (top right).
Paste the test branch connection string:
✓ wrote DATABASE_URL → .env.test.local
# A stage can be a pure action: you click, nothing is saved.
▸ Stage 4/4 · Merge your first PR and see the live site
• Click 'Squash and merge', then 'Confirm squash and merge'.
Press Enter after merging…
# It ends with what it wrote, plus anything left for you to do by hand.
✓ Setup complete
wrote 1 value(s) to .env.test.local: DATABASE_URL
```

```checkpoint mistyped-value
At stage 4 of 5 you notice the key you pasted in stage 2 had a typo, and it's already in `.env`. What's the quickest safe fix?
- [ ] Ask the agent to open `.env` and correct the value for you.
  > Then the key passes through the chat, which is exactly what the wizard was keeping it out of.
- [ ] Delete `.env` and start the whole wizard again from scratch.
  > It works, but you'd retype every value. Re-running keeps the good ones for you.
- [ ] Look for the wizard's back button to return to stage 2.
  > There isn't one. Stages only run forward.
- [x] Ctrl-C, re-run, and press Enter past the good values.
  > Right. Saved values come back as defaults, so you retype only the wrong one.
```

## Where it fits

`/wizard` isn't a fixed step in Matt's Main flow (the path most work takes, from idea to shipped; see [The main flow](/learn/main-flow)). It's a standalone you reach for whenever a manual step shows up: before you start, mid-build, or long after you ship. It pairs naturally with `/implement` ([Implement](/learn/implement)) when a new feature needs credentials. Its nearest neighbour is `/setup-matt-pocock-skills`, which sets up the Skills themselves in a repo; a wizard sets up everything else.

Don't use a wizard to decide *what* to build. That's what [Grilling](/learn/grilling) and `/grill-with-docs` are for.

## How Matt and others use it

**Matt Pocock** showed the Skill in his v1.2 release video (5 August 2026), paraphrased here from machine-translated captions:

- **It came from his own pain.** He'd been provisioning a lot of infrastructure and cloud configuration and hated it (7:27–7:43). The Skill was months in the making (8:50–8:56).
- **He keeps a human at the controls.** He could have had an agent click through the cloud console by computer use (an agent driving the mouse and keyboard), but that felt uncomfortable. He wanted control, made as easy as possible (7:51–8:01).
- **His demo** wizard sent him straight to the right page, had him sign in and change the exact setting, then took his pasted API keys. Because it's a fixed script, he stressed, nothing reaches the agent or Anthropic; it saved each value to the files that need it, and to GitHub secrets (8:02–8:37). He said it made provisioning oddly enjoyable (8:42–8:48).

**Other developers:**

- **Colin Eberhardt**, CTO of Scott Logic, rebuilt a real app with Matt's Skills (19 October 2026). He asked in plain words for help setting up Supabase (a hosted database service), and the agent reached for `/wizard` on its own. The script then sent him to pages that no longer existed: the agent's memory of the dashboard was stale. His verdict: "the shell script has no escape hatch". The way out is the one in Running it: Ctrl-C, tell the agent what you see, let it fix the stage.
- **A Codex user** (Codex is OpenAI's coding agent; the Skills work there too) generated a wizard for a production cleanup. A review caught, before anything ran, that the banner's re-run promise was false for that job (issue #1310, 20 October 2026, still open).
- **A team on Windows laptops** asked for PowerShell instead of bash (issue #954, August 2026). It was closed as not planned, so on Windows you run wizards inside WSL.
- **A user** asked to combine it with Claude's browser extension so the agent could click through dashboards itself (issue #1111, September 2026). Also closed as not planned: the human stays at the controls.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). Use only made-up values: this is practice.

1. Make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir wizard-practice && cd wizard-practice && claude
```

2. Type a slash and the word wizard. If `wizard` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box, press Shift+Tab until it changes: the agent needs to write a file.
4. Type this:

```text
/wizard I want to practise. Make a 3-stage wizard at scripts/wizard-practice.sh that writes only to .env.practice (no GitHub secrets or variables):
1. Open https://github.com/mattpocock/skills and ask me how many stars it shows (public) -> PRACTICE_STARS.
2. Open https://www.aihero.dev/skills-wizard and have me confirm I've read "Ephemeral by default" (a pure action, nothing saved).
3. Ask me for a made-up practice token with hidden input -> PRACTICE_TOKEN. Remind me to type a fake value.
Show me the stage list first and wait for my OK.
```

5. Read the stage list. Reply "OK", or drop a stage to see it adapt. When it asks permission to create the script, choose Yes.
6. Open a second terminal window (not `!` in Claude Code), run `cd wizard-practice`, then run the command the agent gives you, such as `bash scripts/wizard-practice.sh`. If anything looks wrong, press Ctrl-C.
7. Run it a second time and press Enter at each prompt.
8. Clean up: run `rm -r scripts .env.practice` in that window, then type `/exit` in Claude Code.

**It's working if:**

- [ ] You saw the stages and their values, and were asked to confirm, before any script existed.
- [ ] The agent checked the script (`bash -n`, and `shellcheck` if you have it) but didn't run the wizard.
- [ ] Each stage cleared the screen and showed "Stage n/3".
- [ ] The browser opened before each value was asked for.
- [ ] Your typing was invisible for the token.
- [ ] `.env.practice` holds two values, each in single quotes.
- [ ] On the second run, each prompt offered "[Enter keeps current]".
- [ ] The last screen listed what it wrote.
````

## Common mistakes

- **Editing the library above the `STAGES` marker.** Checks specific to one job belong in that job's stages.
- **Expecting it to know your accounts.** It reads your repo, not the service. If a key isn't saved in `.env`, it sends you to fetch it, even if you created it last week.
- **Forgetting `.gitignore`.** The template writes `.env` but doesn't stop Git from saving it. Check that `.env*` is listed in `.gitignore`, the file of things Git ignores (new Next.js projects list it already).
- **Everything from Running it and Where each value goes:** running it with `!`, pasting secrets into the chat, following stale clicks, trusting re-runs on a cutover, and committing a one-off wizard.

```site-story
The ticket was "Connect GitHub, Vercel and Neon": logins and dashboards only I could do. I typed `/wizard`.

**The agent did most of it first.** It checked what I was signed in to, then proposed a split: it would create the GitHub repo, the Vercel project (Vercel hosts the site) and the Neon project (Neon hosts the database, plus a `test` branch: a separate copy for my tests), and the wizard would cover only the browser steps. It asked whether the repo should be public and whether the split was OK; I replied "1 public 2 yes". The site went live before I'd clicked anything.

**The wizard had 4 stages for me:**

1. Connect Neon to Vercel: about eight clicks in the browser.
2. Download my laptop's database password. No clicks: the script ran `vercel env pull` itself and checked the result.
3. Paste my `test` database's connection string (one line holding a database's address, username and password), with hidden typing.
4. Merge PR #1, my first pull request (a proposed change you review before it joins the main code).

**My first run failed, harmlessly.** I ran it inside the Claude chat with `!`. The chat can't press Enter, so the wizard raced through every pause and stopped at the password prompt. No passwords were saved. I ran it again in my code editor's own terminal, and it waited for me at every step.

**A safety check I didn't ask for.** The agent wrote stage 3 to refuse the production connection string, so my tests couldn't be pointed at real Comments by mistake. That check lived in the stage, below the `STAGES` marker; the library stayed untouched.

**Reality changed the plan.** The Neon–Vercel connection names the laptop's database branch `vercel-dev`, not `dev` as we'd planned, so we updated the spec and the decision record to match. That fix was PR #1.

**Then it was gone.** The agent checked that both database passwords connected, without printing them, and deleted the script. It was a one-time tool, so it was never committed.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| A step needs your login or a dashboard | `/wizard`, or let the agent reach for it |
| The agent could do the step itself | Let it; no wizard stage |
| Scoping | Check the stage list; add, drop or reorder. Describe secrets, never paste them |
| Laptop only | `.env` |
| CI, sensitive | GitHub secret |
| CI, public | GitHub variable |
| Laptop and CI | `.env` and a GitHub secret |
| Running it | A real terminal window, not `!` in the chat |
| Mistyped a value | Ctrl-C, re-run, Enter keeps the good ones |
| A screen doesn't match | Ctrl-C, tell the agent what you see |
| Done | Delete it, unless it's a repeatable setup path (commit it, link it from the README) |

## Final test

```test scenario-credentials-wall
Halfway through building a booking app, the agent needs a key from a calendar service you've signed up for. It can't log in to your account. What should it do?
- [ ] List the dashboard steps in the chat and ask you to paste the key back.
  > That's the old habit the Skill replaced: the steps scroll away, and the pasted key lands in the model's context.
- [ ] Put in a placeholder key so the build can carry on.
  > Code built on a fake key fails later, quietly. A step only you can take needs you.
- [x] Propose a wizard, starting with the stages and values it needs.
  > Right. The Skill is model-invoked so the agent can reach for it at exactly this kind of wall, and the stage list doubles as its proposal.
- [ ] Stop and wait until you type `/wizard` yourself.
  > Wizard is model-invoked: the agent can reach for it on its own.
```

```test scenario-agent-can-do
You're signed in to GitHub's `gh` tool on your laptop. The agent's setup plan includes a wizard stage: "Create a new GitHub repo in the browser." What do you say?
- [x] "Create the repo yourself with `gh`; keep the wizard for the rest."
  > Right. If the agent can do a step, it should. Wizards are only for steps that genuinely need your hands.
- [ ] "Fine. Every setup step belongs in the wizard, so nothing gets missed."
  > The Skill says the opposite: don't use a wizard for steps the agent can perform itself.
- [ ] "Keep it, but use hidden typing for that stage's input."
  > Nothing secret is captured there. The problem is who should do the step.
- [ ] "Move it to the end, after every value has been captured."
  > Order isn't the issue. The agent can do this step, so it shouldn't be a stage at all.
```

```test scenario-not-for-deciding
In your app's repo, you haven't decided whether the app should take payments at all, or which provider you'd use. Which Skill do you reach for first?
- [ ] `/wizard`, so it can walk you through a provider's sign-up.
  > A wizard carries out a procedure you've already chosen. It doesn't help you choose.
- [x] `/grill-with-docs`, to settle what to build first.
  > Right. Deciding what to build is a grilling job. A wizard comes later, if a manual step turns up.
- [ ] `/implement`, building a version with each provider.
  > Building before deciding wastes the work you throw away. Agree on what to build first.
- [ ] `/setup-matt-pocock-skills`, which configures your outside services.
  > It configures Matt's Skills in your repo, not payment providers or other services.
```

```test scenario-local-and-ci
Your app reads a database password on your laptop, and your GitHub Actions tests read the same password. Where should the wizard write it?
- [ ] `.env` only.
  > CI runs on GitHub's servers and can't see your laptop's files.
- [ ] A GitHub variable, so you and CI can both read it.
  > Variables are visible, so they're for public values. A password is sensitive.
- [ ] Only a GitHub secret, since that's where CI looks.
  > Then your laptop doesn't have it, and the app won't run locally.
- [x] `.env` and a GitHub secret.
  > Right. Both places need it, and it's sensitive, so it goes in `.env` and a GitHub secret.
```

```test scenario-keep-or-delete
Every new developer on your team must set up the same five services before the app runs. Your wizard for that job just worked. What do you do with it?
- [ ] Delete it: wizards are always one-run scripts.
  > One run is the default, not a rule. This setup path will be needed again.
- [x] Commit it and link it from the README.
  > Right. A repeatable setup path belongs in the repo, so the next person runs the script instead of asking an agent.
- [ ] Turn it into a Skill so the agent rewrites it each time.
  > Re-explaining the job every time is what the script saves you from. Keep the script.
- [ ] Keep it in a scratch folder on your own laptop only.
  > Teammates can't run a script they can't see.
```

```test spot-ran-in-chat
Ana types `!bash scripts/setup-wizard.sh` into Claude Code's prompt box. The wizard flashes through every stage without waiting, then stops at the first password prompt. Spot the mistake.
- [ ] The library above the marker has a bug, so the agent should edit it.
  > The library is identical in every wizard and never hand-edited. The script is fine; where it ran isn't.
- [ ] She should have run `bash -n` first to turn on the pauses.
  > `bash -n` only checks syntax without running anything. It has nothing to do with pauses.
- [x] She ran it from the chat, which can't take her keystrokes.
  > Right. Wizards wait for Enter and typed values. Run it in a real terminal window.
- [ ] Her `gh` tool isn't signed in.
  > That only affects GitHub writes, and it shows a warning. It doesn't skip pauses.
```

```test spot-pasted-in-chat
While the agent scoped a wizard, Raj pasted his live payment key into the chat "so it knows the format". Later he typed the same key into the wizard's hidden prompt. What went wrong?
- [ ] Nothing: the hidden prompt keeps the key away from the model.
  > The hidden prompt protects only what's typed into the script. The pasted copy is already in the conversation.
- [x] The pasted copy is now in the model's context.
  > Right. Anything pasted into the chat is part of the conversation. Describe values while scoping; type them only into the script.
- [ ] He should have used a visible prompt for the key instead.
  > Hidden typing is right for secrets. The mistake happened earlier, in the chat.
- [ ] The wizard will now write the key into `.env` twice.
  > Writes replace the old line, so there's no duplicate. And that isn't the problem.
```

```test spot-edited-library
While writing a wizard, the agent wants a check that refuses the production password. It adds the check by rewriting the `ask_secret` helper above the `STAGES` marker. Spot the mistake.
- [ ] A wizard can't check the values you type into it.
  > It can. Stage code can check a value before writing it, as this site's wizard did.
- [ ] The check should go in `.env.example` instead.
  > `.env.example` only lists value names. It doesn't run anything.
- [ ] The agent should run the wizard itself to test the check.
  > It never runs a wizard end to end: the script waits for a human.
- [x] The check belongs below the marker, in that stage.
  > Right. The library stays identical in every wizard; anything specific to this job goes in its stages.
```

```test sequence-four-steps
Which order does the agent follow when it builds a wizard?
- [ ] Copy `template.sh` and write stages → read the repo → map every click → check the script
  > Writing comes before it knows what to write. It reads the repo and agrees the stages with you first.
- [ ] Read the repo, confirm stages → write stages → map every click → run the whole wizard yourself
  > It maps the clicks before writing them, and it never runs the wizard end to end: it waits for a human.
- [x] Read the repo, confirm stages → map every click → write stages → check it without running it
  > Right. Scope, map, author, verify: and the first real run is yours.
- [ ] Map every click → write stages → run the whole wizard end to end → confirm stages with you
  > The stage list comes first, before mapping anything, and the agent never runs the wizard itself.
```

```test predict-gh-missing
A stage ends by writing a GitHub secret, but `gh` isn't signed in on your laptop. What happens?
- [x] It warns, carries on, and lists the secret at the end.
  > Right. GitHub writes degrade to a warning, and the closing summary lists what you still have to set by hand.
- [ ] The wizard crashes and you lose the values already typed.
  > It doesn't crash, and values already written to `.env` stay there anyway.
- [ ] It installs `gh` for you and asks you to sign in mid-run.
  > The template doesn't install anything. It warns and moves on.
- [ ] It quietly writes the secret to `.env` instead, without telling you.
  > It never swaps destinations silently. It warns you, and the summary lists the skipped secret.
```

```sources
- [wizard SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wizard/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [wizard template.sh](https://github.com/mattpocock/skills/blob/main/skills/engineering/wizard/template.sh) (the library, the `STAGES` marker, hidden entry, `.env` writes, `gh` fallback, closing summary): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md) (wizard as a standalone; "if the agent could just do it itself, it should"): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /wizard Skill](https://www.aihero.dev/skills-wizard), AI Hero docs (destinations, ephemeral by default, secrets and the model's context, where it fits), same text as `docs/engineering/wizard.md` in 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/main/CHANGELOG.md) (1.2.0 #680: graduated and made model-invoked; 1.2.3 #783: progress counted in stages), read 2026-10-23.
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05 (wizard chapter 7:27–8:56; machine-translated captions, paraphrased).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [Issue #1310: fixed resumability banner is unsafe for stateful cutovers](https://github.com/mattpocock/skills/issues/1310), opened 2026-10-20, open when read 2026-10-23.
- [Issue #954: PowerShell instead of bash on Windows](https://github.com/mattpocock/skills/issues/954), opened 2026-08-25, closed as not planned 2026-10-07.
- [Issue #1111: wizard suggestion (combine with a browser extension)](https://github.com/mattpocock/skills/issues/1111), opened 2026-09-23, closed as not planned 2026-10-07.
```
