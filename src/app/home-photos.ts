// The home page's own photos. A Lesson's photo lives in its file header; these
// aren't Lessons, so they live here, and the credits page lists them too.
export type HomePhoto = {
  image: string;
  alt: string;
  credit: string;
  where: string;
};

export const homePhotos = {
  hero: {
    image: "/photos/home-hero.jpg",
    alt: "Two engineers work together at a computer in an office at night with city lights outside.",
    credit: "blue sky",
    where: "Opening photo",
  },
  intro: {
    image: "/photos/home-intro.jpg",
    alt: "A man sketches a plan on a whiteboard while two colleagues watch from a table.",
    credit: "Vitaly Gariev",
    where: "About the course",
  },
  cta: {
    image: "/photos/home-cta.jpg",
    alt: "The glowing trail of a rocket launch arcs across a blue dusk sky over the coast.",
    credit: "SpaceX",
    where: "Closing photo",
  },
} satisfies Record<string, HomePhoto>;
