import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { loadCourses, loadCredits, loadHomePhotos } from "@/app/library";
import type { Credit, ImageUse, Photo } from "@/lessons/lessons";

export const metadata: Metadata = { title: "Image credits" };

// The site a source page is on, as a link's words: "commons.wikimedia.org".
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// The image's title, linked to where it comes from, who made it, its licence
// (linked to the licence's terms when it has an address) and its source.
function CreditLines({ credit }: { credit: Credit | null }) {
  if (!credit) return <span className="credit-by">Credit to come.</span>;
  return (
    <>
      <a href={credit.source} className="credit-title">
        {credit.title}
      </a>
      <span className="credit-by">
        By {credit.author} ·{" "}
        {credit.licenseUrl ? <a href={credit.licenseUrl}>{credit.license}</a> : credit.license} · Source:{" "}
        <a href={credit.source}>{hostOf(credit.source)}</a>
      </span>
    </>
  );
}

// Where an image shows: a Lesson's page, or its Course's own page.
function UsedOn({ use }: { use: ImageUse }) {
  return use.lesson ? (
    <Link href={`/learn/${use.lesson.slug}`}>{use.lesson.title}</Link>
  ) : (
    <Link href={`/courses/${use.course.slug}`}>The Course&apos;s page</Link>
  );
}

function CreditItem({ image, imageAlt, credit, children }: Photo & { children: ReactNode }) {
  return (
    <li className="credit">
      <span className="credit-photo">
        <Image src={image} alt={imageAlt} fill sizes="160px" />
      </span>
      <span className="credit-text">
        <CreditLines credit={credit} />
        <span className="credit-used">{children}</span>
      </span>
    </li>
  );
}

// Every image on the site, Course by Course, with who made it and its
// licence. The home page's own photos come first, once they're credited.
export default async function Credits() {
  const [credits, list, home] = await Promise.all([loadCredits(), loadCourses(), loadHomePhotos()]);
  const homeOwn = [home.hero, home.cta].filter(
    (photo): photo is Photo => photo !== null && photo.image.startsWith("/images/home/"),
  );
  const groups = list
    .map((course) => ({ course, images: credits.filter((image) => image.usedBy[0]?.course.slug === course.slug) }))
    .filter((group) => group.images.length > 0);

  return (
    <div className="container credits-page">
      <h1>Image credits</h1>
      <p className="section-lead">
        Every image here is openly licensed, from Wikimedia Commons. Here&apos;s who made each one and
        the licence it&apos;s shared under. Thank you to everyone listed.
      </p>

      {homeOwn.length > 0 && (
        <section className="credit-group" aria-labelledby="credits-home">
          <h2 id="credits-home">Home page</h2>
          <ul className="credit-list">
            {homeOwn.map((photo) => (
              <CreditItem key={photo.image} {...photo}>
                Used on: <Link href="/">the home page</Link>
              </CreditItem>
            ))}
          </ul>
        </section>
      )}

      {groups.map(({ course, images }) => (
        <section key={course.slug} className="credit-group" aria-labelledby={`credits-${course.slug}`}>
          <h2 id={`credits-${course.slug}`}>
            <Link href={`/courses/${course.slug}`}>{course.title}</Link>
          </h2>
          <ul className="credit-list">
            {images.map(({ image, imageAlt, credit, usedBy }) => (
              <CreditItem key={image} image={image} imageAlt={imageAlt} credit={credit}>
                Used on:{" "}
                {usedBy.map((use, i) => (
                  <span key={`${use.course.slug}/${use.lesson?.slug ?? ""}`}>
                    {i > 0 && ", "}
                    <UsedOn use={use} />
                  </span>
                ))}
              </CreditItem>
            ))}
          </ul>
        </section>
      ))}

      {homeOwn.length === 0 && groups.length === 0 && <p className="muted">No images yet.</p>}
    </div>
  );
}
