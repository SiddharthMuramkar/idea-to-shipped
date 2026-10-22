import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { lessons } from "@/lessons/lessons";
import { unsplash } from "./unsplash";

export const metadata: Metadata = { title: "Photo credits · Idea to Shipped" };

async function loadLessons() {
  "use cache";
  return lessons.listLessons();
}

// The full list of photos and photographers. Each Lesson's photo and credit
// come from its own header; the links come from unsplash.ts.
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
        {all.map((l) => {
          const links = unsplash[l.image];
          return (
            <li key={l.slug} className="credit">
              <span className="credit-photo">
                <Image src={l.image} alt={l.imageAlt} fill sizes="160px" />
              </span>
              <span>
                <Link href={`/learn/${l.slug}`} className="credit-lesson">
                  Lesson {l.number}: {l.title}
                </Link>
                <span className="credit-by">
                  {links ? (
                    <>
                      Photo by <a href={links.profile}>{l.imageCredit}</a> on{" "}
                      <a href={links.page}>Unsplash</a>
                    </>
                  ) : (
                    <>Photo by {l.imageCredit} on Unsplash</>
                  )}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
