import { courses } from "@/lessons/lessons";

// The Course the home page and the footer list. Every Course's Lessons live
// at /learn/<slug>, but only this one is shown on every page.
const HOME_COURSE = "idea-to-shipped";

export async function loadHomeCourse() {
  "use cache";
  const course = await courses.getCourse(HOME_COURSE);
  if (!course) {
    throw new Error(`content/${HOME_COURSE}/course.md is missing: the home page and the footer list that Course`);
  }
  return course;
}
