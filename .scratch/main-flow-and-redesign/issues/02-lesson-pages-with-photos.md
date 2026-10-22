# 02: Lesson pages with photos

**What to build:** Every Lesson opens with its own full-width photo.

- **Photo band:** the photo sits behind "Lesson N", the big title and a small "Photo: <name> / Unsplash" credit. A dark gradient keeps the white text readable on any photo.
- **Topic match:** the photo matches the Lesson's topic. For example: an interview or whiteboard for Grilling, a lab or measuring instruments for TDD, two people at one screen for Code review.
- **Data:** each photo, its alt text and its credit live in the Lesson's own header (`image`, `imageAlt`, `imageCredit`). The Lessons module requires all three and hands them to the home list and to Previous/Next.
- **Rest of the page:** Previous/Next become photo cards. The Discussion panel is restyled to match and behaves exactly as before.
- **Photo source:** Unsplash, saved into the repo, served through Next.js image optimisation.
- **Old Lessons:** the text of Lessons 0–10 is not edited; only their headers gain the photo fields.

Build the Lessons module change with `/tdd`.

**Blocked by:** 01 (Design foundation)

**Status:** ready-for-agent

- [ ] Tests (Lessons module seam, fixture folders): the list, a single Lesson and its neighbours carry photo, alt text and credit; a Lesson file missing any photo field fails loudly, naming the file
- [ ] All 11 existing Lessons (0–10) have a topic-matched Unsplash photo saved in the repo, with real alt text and the photographer's credit
- [ ] A photo credits list (every photo, photographer, link to the Unsplash page) exists and the footer links to it
- [ ] Lesson pages show the photo band with readable text and the credit, and the header sits see-through over it
- [ ] Previous/Next show the neighbouring Lessons' photos; the Discussion panel looks new and still posts and lists Comments
- [ ] Photos load at the right size for the screen (no full-size downloads on phones)
- [ ] The text of Lessons 0–10 is unchanged apart from the three new header fields
- [ ] Existing tests, lint and build pass; screenshots of two Lesson pages at phone and desktop widths
