# Idea to Shipped

A free library of from-zero Courses on building software with coding agents. One of them, Idea to shipped, teaches Matt Pocock's Skills.

## Language

### Courses

**Course**:
A set of Lessons on one topic, read in a fixed order and grouped into Parts when it has them. The site is a library of Courses, each with a page of its own (`/courses/<slug>`) and a colour that tints its pictures.
_Avoid_: Track, program, curriculum, class

**Lesson**:
One page of one Course, read in the Course's order. Its text is split into Sections, and it can hold Scenes, Diagrams, flashcards and Quick checks; it ends with a Final test.
_Avoid_: Page, post, chapter, article

**Part**:
One of the ordered groups a Course's Lessons are read in, under a heading in its `course.md`. Each Course names its own Parts, or has none.
_Avoid_: Module, unit, section, chapter

**Credit**:
Who made an image and its open licence, kept for each image in `content/image-credits.json` and shown under the image and on the credits page.
_Avoid_: Attribution, copyright

**Slug**:
A Lesson's permanent identifier, unique across every Course (e.g. `grilling`, `to-spec`). Comments and Done point at it, so it never changes, though the Lesson's title, Course, Part and place in the order can. The few that were renamed redirect from their old address (`next.config.ts`).
_Avoid_: Lesson ID, endpoint, path

### What Idea to shipped teaches

**Skill**:
One of Matt Pocock's Claude Code skills (e.g. grilling, tdd), each either user-invoked or model-invoked. Most Idea to shipped Lessons teach one or more; a few teach a foundation instead, such as Start here.
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
A chunk of work inside one agent session, such as the grilling or the implementation. It ends when you think "ok, that's done", and only at that boundary do you choose whether to carry on, `/clear`, `/handoff`, pass the next task to a subagent or `/compact`.
_Avoid_: Stage, step, milestone

**Smart zone**:
The early part of an agent's context window, where it still reasons well. As the window fills past it, into the dumb zone, the agent's work gets worse.
_Avoid_: Context limit, token budget

### Inside a Lesson

**Section**:
One headed part of a Lesson's text, numbered "01", "02", … on the page. The Final test sits in a band of its own and isn't numbered.
_Avoid_: Chapter, part, step

**Scene**:
A small picture in a Section (a chat, a terminal, a flow, a file tree or a context meter), built up in numbered steps. The page shows it finished, with every step's caption listed, and doesn't step through it as you scroll.
_Avoid_: Animation, widget, slideshow

**Diagram**:
A drawing in a Lesson (a chain, a comparison, a tree, layers, a git history or a cycle), written as a little YAML in a `diagram` block and drawn on the server, with a caption that names it. Not a Scene, which is built up in steps.
_Avoid_: Chart, figure, Mermaid

**Flashcards**:
Question-and-answer cards in a Lesson, usually under its Remember heading, for what's worth knowing by heart. On the page each card turns over to show its answer.
_Avoid_: Cards (on its own), quiz

**Site story**:
The box in a Lesson that tells how the author really used what it teaches while building this site, kept apart from the teaching.
_Avoid_: Journal, case study, war story

**Quick check**:
An optional question in a Lesson's text, right after the idea it checks, written as a `checkpoint` block. One tap answers it and says why; nothing is saved. On wide screens it sits in the margin beside its block.
_Avoid_: Checkpoint (on the page), quiz, pop question, test

**Final test**:
The questions at the end of a Lesson (at least five), on everything it taught. Submitting it shows the score and why each answer is right, and marks the Lesson Done whatever the score. Always called the Final test in full, so it's never confused with the automated tests.
_Avoid_: Test (on its own), quiz, exam

**Done**:
What a Lesson is once the Visitor has submitted its Final test, whatever the score. It shows as a green tick with the word Done, and each Course counts its Done Lessons. It's kept in the Visitor's browser only.
_Avoid_: Complete, passed, finished, mastered

### Discussion

**Comment**:
A note a Visitor leaves on one Lesson: its text and an optional name. It can't be edited after it's posted.
_Avoid_: Message, feedback, post, reply

**Visitor**:
Anyone reading the site. Visitors have no accounts: what they've Done lives in their own browser.
_Avoid_: User, member, commenter, learner
