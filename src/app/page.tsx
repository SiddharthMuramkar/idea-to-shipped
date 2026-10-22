import Link from "next/link";
import { lessons } from "@/lessons/lessons";

async function loadLessons() {
  "use cache";
  return lessons.listLessons();
}

export default async function Home() {
  const all = await loadLessons();
  return (
    <div className="container">
      <h1>Idea to Shipped</h1>
      <p>
        A small course on Matt Pocock&apos;s skills and agentic coding, written
        while building this site.
      </p>
      <Link href={`/learn/${all[0].slug}`} className="button">
        Start with Lesson {all[0].number}
      </Link>
      <h2 id="lessons">Lessons</h2>
      <ol className="lesson-list">
        {all.map((l) => (
          <li key={l.slug}>
            <Link href={`/learn/${l.slug}`}>
              <span className="lesson-number">Lesson {l.number}</span>
              <span className="lesson-title">— {l.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
