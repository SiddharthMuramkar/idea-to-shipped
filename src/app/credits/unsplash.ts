// Where each photo came from, keyed by its path under public/. A Lesson's
// header already names its photographer; this adds the two links Unsplash
// asks for: the photo's own page and the photographer's profile.
export const unsplash: Record<string, { page: string; profile: string }> = {
  "/photos/start-here.jpg": {
    page: "https://unsplash.com/photos/lamp-on-table-with-ocean-view-at-sunset-QStrN6Pr4wM",
    profile: "https://unsplash.com/@ruben_aster",
  },
  "/photos/grilling.jpg": {
    page: "https://unsplash.com/photos/woman-in-glasses-interviews-man-at-office-desk-pg2eJwNVpvY",
    profile: "https://unsplash.com/@silverkblack",
  },
  "/photos/domain-modeling.jpg": {
    page: "https://unsplash.com/photos/opened-book-on-brown-table-FQvadXmA524",
    profile: "https://unsplash.com/@pisitheng",
  },
  "/photos/spec-and-issues.jpg": {
    page: "https://unsplash.com/photos/person-drafting-on-blueprint--FPFq_trr2Y",
    profile: "https://unsplash.com/@d_mccullough",
  },
  "/photos/wizard.jpg": {
    page: "https://unsplash.com/photos/man-in-black-and-white-plaid-dress-shirt-zBLtU0zbJcU",
    profile: "https://unsplash.com/@thisisengineering",
  },
  "/photos/prototype.jpg": {
    page: "https://unsplash.com/photos/person-holding-pen-near-paper-sv8oOQaUb-o",
    profile: "https://unsplash.com/@amayli",
  },
  "/photos/tdd.jpg": {
    page: "https://unsplash.com/photos/scientist-using-laptop-in-laboratory-8yS04veb1TQ",
    profile: "https://unsplash.com/@thisisengineering",
  },
  "/photos/code-review.jpg": {
    page: "https://unsplash.com/photos/two-colleagues-collaborating-on-a-project-at-a-desk-UUcgVSq2m3g",
    profile: "https://unsplash.com/@silverkblack",
  },
  "/photos/pr-and-ship.jpg": {
    page: "https://unsplash.com/photos/red-and-blue-cargo-ship-on-body-of-water-during-daytime-NndKt2kF1L4",
    profile: "https://unsplash.com/@william07",
  },
  "/photos/diagnosing-bugs.jpg": {
    page: "https://unsplash.com/photos/man-holding-engines-KxeFuXta4SE",
    profile: "https://unsplash.com/@aahubs",
  },
  "/photos/models-effort-ultracode.jpg": {
    page: "https://unsplash.com/photos/a-black-and-white-photo-of-a-jet-engine-dqrwTvNAAH0",
    profile: "https://unsplash.com/@zymot",
  },
  "/photos/main-flow.jpg": {
    page: "https://unsplash.com/photos/aerial-photography-of-roads-on-city-during-daytime-Zeu57mprpaI",
    profile: "https://unsplash.com/@dnevozhai",
  },
  "/photos/home-hero.jpg": {
    page: "https://unsplash.com/photos/two-men-working-on-computers-at-night-QN1Sz74hVjg",
    profile: "https://unsplash.com/@bluext",
  },
  "/photos/home-intro.jpg": {
    page: "https://unsplash.com/photos/man-presenting-ideas-on-whiteboard-to-colleagues-QiUWAuFleVg",
    profile: "https://unsplash.com/@silverkblack",
  },
  "/photos/home-cta.jpg": {
    page: "https://unsplash.com/photos/rocket-launch-light-trail-at-dusk--p-KCm6xB9I",
    profile: "https://unsplash.com/@spacex",
  },
};
