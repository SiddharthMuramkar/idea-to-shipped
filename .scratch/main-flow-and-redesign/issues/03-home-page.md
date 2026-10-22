# 03: Home page

**What to build:** The home page becomes a GE-style landing page, top to bottom:

1. A full-screen photo with the big headline, a short line under it, and two pill buttons, "Start with Lesson 0" and "See the main flow".
2. A light intro band.
3. The Lessons as a grid of photo cards, each showing "Lesson N", the title and that Lesson's photo.
4. A dark navy band teasing the Main flow's steps.
5. A full-width photo call-to-action.
6. The dark footer.

The header sits see-through over the opening photo. The home page photos are topic-relevant Unsplash photos (people building software, planning, shipping), saved in the repo and added to the credits list.

**Blocked by:** 01 (Design foundation), 02 (Lesson pages with photos)

**Status:** ready-for-agent

- [ ] The opening photo fills the first screen with readable white text and two working buttons
- [ ] Light and dark bands alternate down the page
- [ ] Every Lesson appears as a photo card in order, linking to its page; the grid becomes one column on phones
- [ ] The Main flow band lists the flow's steps and links to the Main flow Lesson (`/learn/main-flow`)
- [ ] The home page photos are credited in the credits list
- [ ] The opening photo loads first (it's what you see first) and the rest load as you scroll
- [ ] No sideways scrolling at about 390px wide; existing tests, lint and build pass; screenshots at phone and desktop widths
