import type { Photo } from "@/lessons/lessons";

// The home page's own photos. A Lesson's photo lives in its file header; these
// aren't Lessons, so they live here, and the credits page lists them too.
export type HomePhoto = Photo & {
  // Where on the home page the photo sits, for the credits page.
  label: string;
};

export const homePhotos = {
  hero: {
    image: "/photos/home-hero.jpg",
    imageAlt: "Two engineers work together at a computer in an office at night with city lights outside.",
    imageCredit: "blue sky",
    label: "Opening photo",
  },
  intro: {
    image: "/photos/home-intro.jpg",
    imageAlt: "A man sketches a plan on a whiteboard while two colleagues watch from a table.",
    imageCredit: "Vitaly Gariev",
    label: "About the course",
  },
  cta: {
    image: "/photos/home-cta.jpg",
    imageAlt: "The glowing trail of a rocket launch arcs across a blue dusk sky over the coast.",
    imageCredit: "SpaceX",
    label: "Closing photo",
  },
} satisfies Record<string, HomePhoto>;
