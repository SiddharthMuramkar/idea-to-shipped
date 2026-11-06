import type { Credit, Photo } from "@/lessons/lessons";

// The home page's own photos, from Unsplash. A Course's or Lesson's image is
// credited in content/image-credits.json; these aren't in a header, so their
// credits live here, and the credits page lists them too.
export type HomePhoto = Photo & {
  credit: Credit;
  // Where on the home page the photo sits, for the credits page.
  label: string;
};

const UNSPLASH = { license: "Unsplash License", licenseUrl: "https://unsplash.com/license" };

export const homePhotos = {
  hero: {
    image: "/photos/home-hero.jpg",
    imageAlt: "Two engineers work together at a computer in an office at night with city lights outside.",
    credit: {
      title: "Two men working on computers at night",
      author: "blue sky",
      ...UNSPLASH,
      source: "https://unsplash.com/photos/two-men-working-on-computers-at-night-QN1Sz74hVjg",
    },
    label: "Opening photo",
  },
  intro: {
    image: "/photos/home-intro.jpg",
    imageAlt: "A man sketches a plan on a whiteboard while two colleagues watch from a table.",
    credit: {
      title: "Man presenting ideas on whiteboard to colleagues",
      author: "Vitaly Gariev",
      ...UNSPLASH,
      source: "https://unsplash.com/photos/man-presenting-ideas-on-whiteboard-to-colleagues-QiUWAuFleVg",
    },
    label: "About the course",
  },
  cta: {
    image: "/photos/home-cta.jpg",
    imageAlt: "The glowing trail of a rocket launch arcs across a blue dusk sky over the coast.",
    credit: {
      title: "Rocket launch light trail at dusk",
      author: "SpaceX",
      ...UNSPLASH,
      source: "https://unsplash.com/photos/rocket-launch-light-trail-at-dusk--p-KCm6xB9I",
    },
    label: "Closing photo",
  },
} satisfies Record<string, HomePhoto>;
