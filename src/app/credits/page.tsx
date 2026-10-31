import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { homePhotos } from "@/app/home-photos";
import { courses, type Photo } from "@/lessons/lessons";
import { unsplash } from "./unsplash";

export const metadata: Metadata = { title: "Photo credits · Idea to Shipped" };

// Every Course's Lessons: each one's photo shows on its own page.
async function loadLessons() {
  "use cache";
  return courses.listLessons();
}

function PhotoBy({ photo }: { photo: Photo }) {
  const links = unsplash[photo.image];
  return (
    <span className="credit-by">
      {links ? (
        <>
          Photo by <a href={links.profile}>{photo.imageCredit}</a> on{" "}
          <a href={links.page}>Unsplash</a>
        </>
      ) : (
        <>Photo by {photo.imageCredit} on Unsplash</>
      )}
    </span>
  );
}

export default async function Credits() {
  const all = await loadLessons();
  return (
    <div className="container">
      <h1>Photo credits</h1>
      <p>
        Every photo on this site comes from{" "}
        <a href="https://unsplash.com">Unsplash</a>, under the{" "}
        <a href="https://unsplash.com/license">Unsplash Licence</a>. Thank you to
        the photographers listed here.
      </p>

      <h2>Lesson photos</h2>
      <ul className="credit-list">
        {all.map(
          (l) =>
            l.photo && (
              <li key={l.slug} className="credit">
                <span className="credit-photo">
                  <Image src={l.photo.image} alt={l.photo.imageAlt} fill sizes="160px" />
                </span>
                <span>
                  <Link href={`/learn/${l.slug}`} className="credit-lesson">
                    Lesson {l.number}: {l.title}
                  </Link>
                  <PhotoBy photo={l.photo} />
                </span>
              </li>
            ),
        )}
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
              <PhotoBy photo={p} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
