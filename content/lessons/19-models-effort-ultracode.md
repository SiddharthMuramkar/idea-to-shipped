---
title: Models, effort & ultracode
slug: models-effort-ultracode
order: 19
part: 4
image: /photos/models-effort-ultracode.jpg
imageAlt: A black-and-white close-up of a jet engine's fan blades spiralling into the centre.
imageCredit: Joao
---

## What it is

Claude Code has four dials that change how it works. Picking them well saves time and money:

- **Model**: *which* Claude you talk to.
- **Effort**: how hard it thinks before answering.
- **Ultracode**: whether it splits big tasks across many helper agents.
- **Fast mode**: the same Opus quality, answering faster, at a higher price.

Facts below come from the official docs ([model config](https://code.claude.com/docs/en/model-config.md), [workflows](https://code.claude.com/docs/en/workflows.md), [fast mode](https://code.claude.com/docs/en/fast-mode.md), [ultrareview](https://code.claude.com/docs/en/ultrareview.md)), checked on 2026-10-21. Settings change over time, so re-check the docs.

## When to use it

**Model** (switch with `/model`):

| Model | Use it for |
|---|---|
| `haiku` | Simple, quick tasks |
| `sonnet` | Everyday coding |
| `opus` | Complex reasoning |
| `opusplan` | Opus plans, Sonnet does the work |
| `fable` | Work that spans more than one sitting: root-cause investigations, outages, architecture. Not the default; you have to pick it. |

**Effort** (set with `/effort` or `/effort <level>`):

| Level | Use it for |
|---|---|
| `low` | Quick edits you'll review yourself |
| `medium` | Routine or cost-sensitive work |
| `high` | Bug fixes where getting it right matters |
| `xhigh` | Deeper reasoning, at more cost |
| `max` | Hard problems the agent works on alone. Watch for overthinking. |

The default is `high`, or `medium` on the 5.5 models.

**Ultracode** is *not* an effort level. It's a setting that makes Claude plan a **workflow** for big tasks: a script that runs many helper agents. It runs at whatever effort you've set.
- Turn it on for the session: `/effort ultracode`. Starting with `claude --effort ultracode` also sets effort to `xhigh`.
- For one task only: put the word `ultracode` in your prompt.
- Cost: more tokens and more time per task, so you hit plan limits sooner.

**`/code-review ultra`** is a separate feature: a deep, multi-agent bug review that runs in the cloud and takes roughly 15–25 minutes. A few free runs, then usage credits.

**Fast mode** (`/fast`) works on Opus only. It's up to 2.5× faster with the same quality, at a higher price, billed from usage credits. Turn it on at the **start** of a session, because switching mid-conversation re-charges the whole conversation once. It's good for live back-and-forth and wasteful for long unattended work.

## What I typed

```
/effort          (opened it, then cancelled: I was just looking)
/code-review max (the built-in bug hunt at max effort, in the background)
```

The whole site was built on **Opus 5.5** at the session's default effort.

## What happened

**How I'd pick, after building this site** (my rule of thumb, not official guidance):

| Situation | Model | Effort | Ultracode |
|---|---|---|---|
| Grilling, planning, spec | opus | high | off |
| Small, clear issue (scaffold, CSS) | sonnet | medium | off |
| Test-first feature with real logic | opus | high | off |
| Mystery bug across many files | fable or opus | xhigh | maybe |
| Final review before shipping | opus | max | off |
| Huge refactor or broad research | opus | xhigh | **on** |

**The lesson:** higher isn't always better. More effort and ultracode cost more and take longer. Match the dial to how hard the problem is, and how costly a mistake would be.
