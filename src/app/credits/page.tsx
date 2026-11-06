import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { homePhotos } from "@/app/home-photos";
import { courses, type Credit, type ImageUse } from "@/lessons/lessons";

export const metadata: Metadata = { title: "Image credits · Idea to Shipped" };

// Every image a Course or Lesson header uses, with its credit.
async function loadCredits() {
  "use cache";
  return courses.listCredits();
}

// "<title> by <author>, <license>", the title linked to where the image comes
// from and the licence to its terms.
function CreditBy({ credit }: { credit: Credit | null }) {
  if (!credit) return <span className="credit-by">Credit to come.</span>;
  return (
    <span className="credit-by">
      <a href={credit.source}>{credit.title}</a> by {credit.author},{" "}
      {credit.licenseUrl ? <a href={credit.licenseUrl}>{credit.license}</a> : credit.license}
    </span>
  );
}

// Where an image shows: a Lesson's page, or its Course's header.
function UsedOn({ use }: { use: ImageUse }) {
  return use.lesson ? (
    <Link href={`/learn/${use.lesson.slug}`} className="credit-lesson">
      {use.course.title}: {use.lesson.title}
    </Link>
  ) : (
    <span className="credit-lesson">{use.course.title}</span>
  );
}

export default async function Credits() {
  const credits = await loadCredits();
  return (
    <div className="container">
      <h1>Image credits</h1>
      <p>
        Who made each image on this site, and the licence it&apos;s shared under. Thank you to
        everyone listed here.
      </p>

      <h2>Course and Lesson images</h2>
      <ul className="credit-list">
        {credits.map(({ image, imageAlt, credit, usedBy }) => (
          <li key={image} className="credit">
            <span className="credit-photo">
              <Image src={image} alt={imageAlt} fill sizes="160px" />
            </span>
            <span>
              {usedBy.map((use) => (
                <UsedOn key={`${use.course.slug}/${use.lesson?.slug ?? ""}`} use={use} />
              ))}
              <CreditBy credit={credit} />
            </span>
          </li>
        ))}
      </ul>

      <h2>Home page photos</h2>
      <ul className="credit-list">
        {Object.values(homePhotos).map((p) => (
          <li key={p.image} className="credit">
            <span className="credit-photo">
              <Image src={p.image} alt={p.imageAlt} fill sizes="160px" />
            </span>
            <span>
              <Link href="/" className="credit-lesson">
                Home: {p.label}
              </Link>
              <CreditBy credit={p.credit} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
