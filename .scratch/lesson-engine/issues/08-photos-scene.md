# 08: The photos Scene

**What to build:** A sixth Scene kind, `photos`, where each step cross-fades the stage to a new photo. It runs on ticket 04's stepper, uses only the photos already in `public/photos`, and, like every Scene, shows its final state without JavaScript.

- **Grammar** (authoring contract v1.5): ` ```scene photos `, the shared `title:` setting and no other, then 4–8 steps. Each step is a `# ` caption plus exactly one line `photo: /photos/x.jpg | alt | credit`.
  - The path starts with `/photos/` and has no `..` segment.
  - The alt and the credit are plain text, shown exactly as typed (never Markdown), and neither may be empty.
  - The placement rules are the same as for every Scene: in a Section, never in the intro, at most one per Section.
- **Parser:**
  - `scenes.ts` adds `photos` to the `Scene` union. Each step's `items` holds exactly one `{ src, alt, credit }`.
  - The unknown-type error lists all six kinds.
  - A bare ` ```photos ` or ` ```photo ` fence fails with `did you mean "scene photos"?` (a new `HINTS` entry in `blocks.ts`).
  - Errors use the Scene format, e.g. `wall.md: scene photos: needs 4 to 8 steps (found 3)`. A Scene has no id, so the message quotes the step's caption or the offending line instead.
- **Photo files are checked in the course lint, never at runtime:** `course.test.ts` checks that every photos-Scene path exists in `public/photos`, on every Lesson (like the header photo). The parser never touches the file system, because the API routes run it on Vercel, where `public/` isn't part of the function (the spec's parser decision). The check goes in `course-lint.ts` with its own test, so a rule that never fires on the real course is still proven.
- **The picture:**
  - A `<figure>` with the title as its `<figcaption>`, holding a frame with a fixed 3:2 ratio that fits inside the stage at every width. The current photos are 16:9, 3:2 and 4:3; one fixed ratio crops them all the same way and keeps CLS at 0.
  - Every photo is stacked in the frame in step order, as `next/image` with `fill`, `object-fit: cover` and a `sizes` that matches the stage, so a phone never downloads a desktop-sized photo.
  - Each layer carries its own credit line (the existing `PhotoCredit`: "Photo: <credit> / Unsplash"), so the credit fades with its photo.
- **Stepping, on ticket 04's stepper** (`data-step` on the root, `data-on` / `data-new` on the items):
  - **The base style is the final photo.** With no `data-step`, every layer is opaque and the last one is on top.
  - Inside `[data-step]`, a layer without `data-on` has `opacity: 0`, except the first. So step 0 shows the first photo instead of an empty box, which would look broken while the stage is pinned.
  - The newest `data-on` layer is always on top. Stepping forward fades the new photo in over the last one, and stepping back fades it out again. Opacity only, over ticket 04's 300ms.
  - With reduced motion, the photo swaps instantly.
- **Photos:** only the files already in `public/photos`. No new downloads and no change to `src/app/credits/unsplash.ts`, which belongs to PR B. A new photo needs the user's OK and an entry there, made by PR B.
- **Docs:** a `#### photos` section in `docs/authoring-lessons.md` (now v1.5), and a **photos** part in the spec's Scene kinds.

See the spec's "The five Scene kinds", "How a Scene steps", "Fallbacks" and "Performance budget" decisions, ticket 04, and the authoring contract v1.5. This reverses the spec's Out of Scope line "A `photos` Scene kind (it would need new photo downloads)": reusing the existing photos needs no downloads.

**Blocked by:** 04 (Scroll engine, the five Scene kinds, section bar and tones)

**Status:** ready-for-agent

- [ ] `getLesson` returns a photos Scene as `{ kind: "photos", title, steps }`. Each step's `items` is exactly one `{ src, alt, credit }`, with the alt and the credit exactly as typed (not rendered as HTML)
- [ ] There's one broken fixture per error, each asserting that the message names the file and the block (`scene photos`), plus the step's caption or the offending line when there is one:
  - [ ] a step with no `photo:` line, and a step with two
  - [ ] 3 steps, and 9 steps
  - [ ] a path that doesn't start with `/photos/` (such as `photos/grilling.jpg`, `/images/grilling.jpg` or a full URL), and a path with a `..` segment
  - [ ] an empty alt, an empty credit, and a `photo:` line with too few or too many `|` parts
  - [ ] a line that isn't a `photo:` line, and a setting other than `title`
  - [ ] a bare ` ```photos ` fence (`did you mean "scene photos"?`)
  - [ ] an unknown Scene type, with the error listing all six kinds
- [ ] A fixture whose photo file doesn't exist still parses: the runtime parser does no `public/` checks
- [ ] The course lint checks, on every Lesson, that every photos-Scene path exists in `public/photos`, and a failure names the Lesson's slug and the path. The rule lives in `course-lint.ts`, and a test in `course-lint.test.ts` proves it reports a missing file
- [ ] The Scene renders on the server as a `<figure>` with its title as the `<figcaption>` and a fixed 3:2 frame, with every photo in the HTML in step order as an `<img>` with its alt and its own credit
- [ ] Each step cross-fades as its caption crosses the trigger line, forward and back, with opacity only, and step 0 shows the first photo. It's driven by the stepper's `data-step`, `data-on` and `data-new`, with no change to `scene-stepper.tsx` (or the ticket's `## Comments` says what changed and why)
- [ ] After a reload mid-Scene, or navigating away and back (Activity re-show), the frame shows the right photo with no scrolling and without fading through the others
- [ ] With reduce motion on, nothing fades and the photo swaps instantly at each step
- [ ] With JavaScript off, the last photo shows, and every photo's alt and credit is in the HTML
- [ ] The frame keeps its 3:2 ratio inside the stage at 390px and 1440px, CLS reads 0 while stepping through the Scene, and there's no sideways scroll at 390px
- [ ] Only the existing files in `public/photos` are used: no new photo files and no change to `src/app/credits/unsplash.ts`
- [ ] `docs/authoring-lessons.md` says v1.5 with a "New in v1.5" note, names `photos` in the block table and the bare-word hints, and has a `#### photos` section after `meter`. That section gives the grammar, an example built from existing photos, and the rules: one `photo:` line per step, 4–8 steps, the `/photos/` prefix, plain text, the credit as the photographer's name on the credits page, and no new photo without the user's OK and an `unsplash.ts` entry
- [ ] Section 6 of `docs/authoring-lessons.md` lists the photo rule. Its complete example gains a photos Scene in its own Section, and the guide test in `lessons.test.ts` expects `scene photos` among the kinds
- [ ] The spec gains a **photos** part under its Scene kinds, every list of Scene kinds in it names photos, and the Out of Scope line about a `photos` Scene is gone. The Scene entry in `GLOSSARY.md` and the block table under "Writing a Lesson" in the README include photos
- [ ] No new dependencies, and the new client JavaScript stays inside ticket 04's 8 KB budget
- [ ] Existing tests, lint, `tsc --noEmit` and build pass. QA evidence, linked from this ticket's `## Comments`: screenshots of the photos Scene at its first, a middle and its last step at 390px and 1440px, plus one with reduce motion on and one with JavaScript off. Use the complete example from `docs/authoring-lessons.md`, dropped temporarily into `content/lessons/` (never committed)
