# Lesson Site

A from-zero course that teaches Matt Pocock's skills and agentic coding, using the building of this very site as its worked example.

## Course

**Lesson**:
One page of the course, read in a fixed order. It teaches with goals, Scenes, Checkpoints and a Final test. Most Lessons teach one or more Skills; some teach a foundation instead ("Start here", "Models, effort & ultracode").
_Avoid_: Page, post, chapter, article

**Part**:
One of the four groups the Lessons are read in, in order: Foundations, The main flow, When things go wrong, Level up. A Lesson's Part comes from its file's header.
_Avoid_: Module, unit, section, chapter

**Slug**:
A Lesson's permanent one-word identifier (e.g. `grilling`). Comments and Answers point at it, so it never changes. A Lesson's title, position number and Part can change freely.
_Avoid_: Lesson ID, endpoint, path

**Skill**:
One of Matt Pocock's Claude Code skills (e.g. grilling, tdd) that a Lesson teaches. Every Skill is either user-invoked or model-invoked.
_Avoid_: Command, tool, plugin

**User-invoked Skill**:
A Skill that only you can start, by typing its name (e.g. `/to-spec`, `/implement`). The agent never starts it on its own.
_Avoid_: Manual skill, command

**Model-invoked Skill**:
A Skill the agent can start by itself when your request matches what the Skill is for (e.g. `tdd`, `diagnosing-bugs`). You can still type its name to start it yourself.
_Avoid_: Automatic skill, auto skill

**Main flow**:
The path most work takes through the Skills, from idea to shipped: grill the idea, split it into a spec and tickets if it's too big for one session, then implement and review it.
_Avoid_: Workflow, pipeline, process

**Built-in command**:
A command that comes with Claude Code itself, such as `/clear` or `/compact`. Not a Skill, though the Main flow uses both.
_Avoid_: Skill

**Phase**:
A chunk of work inside one agent session, such as the grilling or the implementation. It ends when you think "ok, that's done", and only at that boundary do you choose whether to carry on, `/clear`, `/compact`, `/handoff` or pass the next task to a subagent.
_Avoid_: Stage, step, milestone

**Smart zone**:
The early part of an agent's context window, where it still reasons well. As the window fills past it, into the dumb zone, the agent's work gets worse.
_Avoid_: Context limit, token budget

## Inside a Lesson

**Scene**:
A small picture inside a Lesson (a chat, a terminal, a flow, a file tree or a context meter) that builds step by step as you scroll past its captions.
_Avoid_: Animation, diagram, widget, slideshow

**Site story**:
The box in a Lesson that tells how the author really used the Skill while building this site, kept apart from the teaching.
_Avoid_: Journal, case study, war story

**Checkpoint**:
A single question inside a Lesson, placed right after the idea it checks. It gives instant feedback and never counts towards passing.
_Avoid_: Quiz, pop question, test

**Final test**:
The questions at the end of a Lesson, checked together; a score of 80% or more passes the Lesson. Always called the Final test in full, so it's never confused with the automated tests.
_Avoid_: Test (on its own), quiz, exam

## Answers

**Answer**:
One Visitor's choice of option for one question, stored every time they answer. Crowd stats count only each Visitor's first Answer to a question.
_Avoid_: Response, submission, vote

**Attempt**:
One submission of a whole Final test by one Visitor, with its score. The latest Attempt decides whether the Lesson is passed.
_Avoid_: Try, submission, run

## Discussion

**Comment**:
A note a Visitor leaves on one Lesson. It has a body and an optional name, and can't be edited after it's posted.
_Avoid_: Message, feedback, post, reply

**Visitor**:
Anyone reading the site. Visitors have no accounts: the site knows one only by a random ID in a cookie, set the first time they answer a question.
_Avoid_: User, member, commenter, learner
