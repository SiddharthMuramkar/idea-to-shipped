import type { CourseOutline } from "@/app/progress/progress";
import { courses, type Course, type LessonSummary, type Photo } from "@/lessons/lessons";

// What the pages read from content/, cached: it never changes while the site
// runs, and every page is built ahead of time.

export async function loadCourses(): Promise<Course[]> {
  "use cache";
  return courses.listCourses();
}

export async function loadLesson(slug: string) {
  "use cache";
  return courses.getLesson(slug);
}

export async function loadCredits() {
  "use cache";
  return courses.listCredits();
}

// The home page's own photos, used once content/image-credits.json credits
// them. They sit behind text as background, so they need no description.
const HOME_HERO = "/images/home/hero.jpg";
const HOME_CTA = "/images/home/cta.jpg";

// The home page's two photo bands. Each uses its own photo once it's
// credited, or else a Course's photo (the first Course's for the top, another
// for the closing band), or else none, which draws the band in navy.
export async function loadHomePhotos(): Promise<{ hero: Photo | null; cta: Photo | null }> {
  "use cache";
  const [heroCredit, ctaCredit, list] = await Promise.all([
    courses.creditFor(HOME_HERO),
    courses.creditFor(HOME_CTA),
    courses.listCourses(),
  ]);
  const coursePhotos = list.flatMap((course) => (course.photo ? [course.photo] : []));
  const hero = heroCredit ? { image: HOME_HERO, imageAlt: "", credit: heroCredit } : (coursePhotos[0] ?? null);
  const cta = ctaCredit
    ? { image: HOME_CTA, imageAlt: "", credit: ctaCredit }
    : (coursePhotos.findLast((photo) => photo.image !== hero?.image) ?? null);
  return { hero, cta };
}

// Each Course's colour, by its place in the list of Courses: it tints the
// navy picture drawn for a Course or Lesson without a photo, and its cards.
const TONES = ["#4f74ff", "#14b8a6", "#9b7bff", "#ffb020", "#ff6b5f", "#34c77b", "#e45ba8"];

export function toneOf(list: readonly Course[], slug: string): string {
  return TONES[Math.max(0, list.findIndex((course) => course.slug === slug)) % TONES.length];
}

// The Lesson after this one: the next in its own Course, or after a Course's
// last Lesson the first of the next Course. Null after the very last.
export function lessonAfter(
  list: readonly Course[],
  lesson: { slug: string; course: { slug: string }; next: LessonSummary | null },
): { lesson: LessonSummary; newCourse: Course | null } | null {
  if (lesson.next) return { lesson: lesson.next, newCourse: null };
  const at = list.findIndex((course) => course.slug === lesson.course.slug);
  const course = list.slice(at + 1).find((c) => c.lessons.length > 0);
  return course ? { lesson: course.lessons[0], newCourse: course } : null;
}

// The Courses as the browser needs them, for progress and "Continue".
export function outlineOf(list: readonly Course[]): CourseOutline[] {
  return list.map(({ slug, title, lessons }) => ({
    slug,
    title,
    lessons: lessons.map((lesson) => ({ slug: lesson.slug, title: lesson.title })),
  }));
}

// "45 min", "2 h", "3 h 10 min": a whole Course's reading time.
export function readingTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export const courseMinutes = (course: Course) => course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
